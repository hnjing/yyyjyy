<template>
  <ele-page :flex-table="true" hide-footer>
    <!-- 搜索表单 -->
    <tenant-search @search="reload" v-if="showSearch" />

    <ele-card :flex-table="true" :body-style="{ paddingTop: '8px' }">
      <!-- 表格 -->
      <ele-pro-table
        ref="tenantTableRef"
        row-key="id"
        :columns="columns"
        :datasource="datasource"
        :loading="loading"
        :show-overflow-tooltip="true"
        v-model:selections="selections"
        highlight-current-row
        :export-config="{ fileName: '租户数据' }"
        cache-key="systemTenantTable"
      >
        <template #toolbar>
          <el-button
            v-permission="['system:tenant:add']"
            type="primary"
            class="ele-btn-icon"
            :icon="PlusOutlined"
            @click="handleAdd"
          >
            新增
          </el-button>
          <el-button
            v-permission="['system:tenant:remove']"
            type="danger"
            class="ele-btn-icon"
            :icon="DeleteOutlined"
            :disabled="!selections.length"
            @click="handleDelete()"
          >
            删除
          </el-button>
          <el-button
            v-permission="['system:tenant:export']"
            class="ele-btn-icon"
            :icon="DownloadOutlined"
            @click="handleExport"
          >
            导出
          </el-button>
          <el-button
            v-if="userId === 1"
            type="success"
            class="ele-btn-icon"
            :icon="SyncOutlined"
            @click="handleSyncTenantDict"
          >
            同步租户字典
          </el-button>
        </template>
        <template #expireTime="{ row }">
          <span>{{ dayjs(row.expireTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
        </template>
        <template #status="{ row }">
          <el-switch
            size="small"
            :model-value="row.status == 0"
            @change="(checked) => handleStatusChange(checked, row)"
          />
        </template>
        <template #action="{ row }">
          <el-link
            v-permission="['system:tenant:edit']"
            type="primary"
            underline="never"
            @click="handleUpdate(row)"
          >
            修改
          </el-link>
          <el-divider
            v-permission="['system:tenant:edit']"
            direction="vertical"
          />
          <el-link
            v-permission="['system:tenant:edit']"
            type="primary"
            underline="never"
            @click="handleConnectClient(row)"
          >
            关联客户端
          </el-link>
          <el-divider
            v-permission="['system:tenant:edit']"
            direction="vertical"
          />
          <el-link
            v-permission="['system:tenant:edit']"
            type="primary"
            underline="never"
            @click="handleSyncTenantPackage(row)"
          >
            同步套餐
          </el-link>
          <el-divider
            v-permission="['system:tenant:remove']"
            direction="vertical"
          />
          <el-link
            v-permission="['system:tenant:remove']"
            type="danger"
            underline="never"
            @click="handleDelete(row)"
          >
            删除
          </el-link>
        </template>
      </ele-pro-table>
    </ele-card>

    <!-- 编辑弹窗 -->
    <tenant-edit v-model="showEdit" :data="current" @done="getList" />

    <!-- 关联客户端弹窗 -->
    <tenant-client
      v-model="showClient"
      :tenant-id="currentTenantId"
      @done="getList"
    />
  </ele-page>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { EleMessage } from '@hnjing/zxzy-admin-plus/es';
  import {
    PlusOutlined,
    DeleteOutlined,
    DownloadOutlined,
    SyncOutlined
  } from '@/components/icons';
  import { useUserStore } from '@/store/modules/user';
  import TenantSearch from './components/tenant-search.vue';
  import TenantEdit from './components/tenant-edit.vue';
  import TenantClient from './components/tenant-client.vue';
  import dayjs from 'dayjs';
  import {
    listTenant,
    delTenant,
    changeTenantStatus,
    syncTenantPackage,
    syncTenantDict,
    exportTenant
  } from '@/api/system/tenant';
  import { ElMessageBox } from 'element-plus/es';

  defineOptions({ name: 'SystemTenant' });

  // 用户信息
  const userStore = useUserStore();
  const userId = ref(userStore.userId);

  // 表格实例
  const tenantTableRef = ref(null);

  // 加载状态
  const loading = ref(false);

  // 表格选中数据
  const selections = ref([]);

  // 当前编辑数据
  const current = ref(null);

  // 当前选中的租户ID（用于客户端关联）
  const currentTenantId = ref('');

  // 是否显示编辑弹窗
  const showEdit = ref(false);

  // 是否显示客户端关联弹窗
  const showClient = ref(false);

  // 是否显示搜索表单
  const showSearch = ref(true);

  // 定义表格列配置
  const columns = computed(() => {
    return [
      {
        type: 'selection',
        columnKey: 'selection',
        width: 50,
        align: 'center',
        fixed: 'left'
      },
      {
        type: 'index',
        columnKey: 'index',
        width: 50,
        align: 'center',
        fixed: 'left'
      },
      {
        prop: 'tenantId',
        label: '租户编号',
        columnKey: 'tenantId',
        minWidth: 100,
        align: 'center'
      },
      {
        prop: 'clientNames',
        label: '关联应用',
        columnKey: 'clientNames',
        minWidth: 120,
        align: 'center'
      },
      {
        prop: 'contactUserName',
        label: '联系人',
        columnKey: 'contactUserName',
        minWidth: 100,
        align: 'center'
      },
      {
        prop: 'contactPhone',
        label: '联系电话',
        columnKey: 'contactPhone',
        minWidth: 120,
        align: 'center'
      },
      {
        prop: 'companyName',
        label: '企业名称',
        columnKey: 'companyName',
        minWidth: 150,
        align: 'center'
      },
      {
        prop: 'licenseNumber',
        label: '社会信用代码',
        columnKey: 'licenseNumber',
        minWidth: 150,
        align: 'center'
      },
      {
        prop: 'expireTime',
        label: '过期时间',
        columnKey: 'expireTime',
        width: 180,
        slot: 'expireTime',
        align: 'center'
      },
      {
        prop: 'status',
        label: '租户状态',
        columnKey: 'status',
        width: 100,
        slot: 'status',
        align: 'center'
      },
      {
        columnKey: 'action',
        label: '操作',
        width: 320,
        align: 'center',
        slot: 'action',
        hideInPrint: true,
        hideInExport: true
      }
    ];
  });

  // 表格数据源
  const datasource = ({ pages, where, filters, orders }) => {
    loading.value = true;
    return listTenant({ ...where, ...filters, ...orders, ...pages }).finally(
      () => {
        loading.value = false;
      }
    );
  };

  // 搜索
  const reload = (where) => {
    tenantTableRef.value?.reload?.({ page: 1, where });
  };

  /** 查询租户列表 */
  const getList = () => {
    tenantTableRef.value?.reload?.();
  };

  // 租户状态修改
  const handleStatusChange = async (checked, row) => {
    const status = checked ? '0' : '1';
    const text = status === '0' ? '启用' : '停用';
    try {
      await ElMessageBox.confirm(
        '确认要"' + text + '"' + row.companyName + '"租户吗？',
        '系统提示',
        { type: 'warning', draggable: true }
      );
      await changeTenantStatus(row.id, row.tenantId, status);
      row.status = status;
      EleMessage.success(text + '成功');
    } catch {
      // 用户取消操作
    }
  };

  /** 新增按钮操作 */
  const handleAdd = () => {
    current.value = null;
    showEdit.value = true;
  };

  /** 修改按钮操作 */
  const handleUpdate = (row) => {
    current.value = row ?? selections.value[0];
    showEdit.value = true;
  };

  /** 关联客户端 */
  const handleConnectClient = (row) => {
    currentTenantId.value = row.tenantId;
    showClient.value = true;
  };

  /** 同步租户套餐按钮操作 */
  const handleSyncTenantPackage = async (row) => {
    try {
      await ElMessageBox.confirm(
        '是否确认同步租户套餐租户编号为"' + row.tenantId + '"的数据项？',
        '系统提示',
        { type: 'warning', draggable: true }
      );
      loading.value = true;
      await syncTenantPackage(row.tenantId, row.packageId);
      await getList();
      EleMessage.success('同步成功');
    } catch {
      // 用户取消操作
    } finally {
      loading.value = false;
    }
  };

  /** 删除按钮操作 */
  const handleDelete = async (row) => {
    const rows = row ? [row] : selections.value;
    if (!rows.length) {
      EleMessage.error('请至少选择一条数据');
      return;
    }

    try {
      await ElMessageBox.confirm(
        '是否确认删除租户编号为"' +
          rows.map((d) => d.tenantId).join(',') +
          '"的数据项？',
        '系统提示',
        { type: 'warning', draggable: true }
      );
      loading.value = true;
      await delTenant(rows.map((d) => d.id));
      await getList();
      EleMessage.success('删除成功');
    } catch {
      // 用户取消操作
    } finally {
      loading.value = false;
    }
  };

  /** 导出按钮操作 */
  const handleExport = () => {
    const loading = EleMessage.loading({
      message: '请求中..',
      plain: true
    });
    tenantTableRef.value?.fetch?.(({ page, limit, where }) => {
      exportTenant({ page, limit, ...where })
        .then(() => {
          loading.close();
        })
        .catch((e) => {
          loading.close();
          EleMessage.error(e.message);
        });
    });
  };

  /**同步租户字典*/
  const handleSyncTenantDict = async () => {
    try {
      await ElMessageBox.confirm('确认要同步所有租户字典吗？', '系统提示', {
        type: 'warning',
        draggable: true
      });
      const res = await syncTenantDict();
      EleMessage.success(res.msg);
    } catch {
      // 用户取消操作
    }
  };
</script>
