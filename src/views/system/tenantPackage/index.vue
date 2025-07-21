<template>
  <ele-page :flex-table="true" hide-footer>
    <!-- 搜索表单 -->
    <tenant-package-search @search="reload" v-if="showSearch" />

    <ele-card :flex-table="true" :body-style="{ paddingTop: '8px' }">
      <!-- 表格 -->
      <ele-pro-table
        ref="tableRef"
        row-key="packageId"
        :columns="columns"
        :datasource="datasource"
        :loading="loading"
        :show-overflow-tooltip="true"
        v-model:selections="selections"
        highlight-current-row
        :export-config="{ fileName: '租户套餐数据' }"
        cache-key="systemTenantPackageTable"
      >
        <template #toolbar>
          <el-button
            v-permission="['system:tenantPackage:add']"
            type="primary"
            class="ele-btn-icon"
            :icon="PlusOutlined"
            @click="handleAdd"
          >
            新增
          </el-button>
          <el-button
            v-permission="['system:tenantPackage:remove']"
            type="danger"
            class="ele-btn-icon"
            :icon="DeleteOutlined"
            :disabled="!selections.length"
            @click="handleDelete()"
          >
            删除
          </el-button>
          <!-- <el-button
            v-permission="['system:tenantPackage:export']"
            class="ele-btn-icon"
            :icon="DownloadOutlined"
            @click="handleExport"
          >
            导出
          </el-button> -->
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
            v-permission="['system:tenantPackage:edit']"
            type="primary"
            underline="never"
            @click="handleUpdate(row)"
          >
            修改
          </el-link>
          <el-divider
            v-permission="['system:tenantPackage:remove']"
            direction="vertical"
          />
          <el-link
            v-permission="['system:tenantPackage:remove']"
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
    <tenant-package-edit v-model="showEdit" :data="current" @done="getList" />
  </ele-page>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import { ElMessageBox } from 'element-plus/es';
  import { EleMessage } from '@hnjing/zxzy-admin-plus/es';
  import {
    PlusOutlined,
    DeleteOutlined,
    DownloadOutlined
  } from '@/components/icons';
  import { useDictData } from '@/utils/use-dict-data';
  import TenantPackageSearch from './components/tenantPackage-search.vue';
  import TenantPackageEdit from './components/tenantPackage-edit.vue';
  import {
    listTenantPackage,
    delTenantPackage,
    changePackageStatus,
    exportTenantPackage
  } from '@/api/system/tenantPackage';

  defineOptions({ name: 'SystemTenantPackage' });

  // 字典数据
  const [sys_normal_disable] = useDictData(['sys_normal_disable']);

  // 表格实例
  const tableRef = ref(null);

  // 加载状态
  const loading = ref(false);

  // 表格选中数据
  const selections = ref([]);

  // 当前编辑数据
  const current = ref(null);

  // 是否显示编辑弹窗
  const showEdit = ref(false);

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
        prop: 'packageName',
        label: '套餐名称',
        columnKey: 'packageName',
        minWidth: 120,
        align: 'center'
      },
      {
        prop: 'remark',
        label: '备注',
        columnKey: 'remark',
        minWidth: 150,
        align: 'center'
      },
      {
        prop: 'status',
        label: '状态',
        columnKey: 'status',
        width: 90,
        slot: 'status',
        align: 'center',
        filters: sys_normal_disable.value.map((d) => {
          return { text: d.label, value: d.value };
        }),
        filterMultiple: false,
        formatter: (row) =>
          sys_normal_disable.value.find((d) => d.value == row.status)?.label
      },
      {
        columnKey: 'action',
        label: '操作',
        width: 150,
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
    return listTenantPackage({
      ...where,
      ...filters,
      ...orders,
      ...pages
    }).finally(() => {
      loading.value = false;
    });
  };

  // 搜索
  const reload = (where) => {
    tableRef.value?.reload?.({ page: 1, where });
  };

  /** 查询套餐列表 */
  const getList = () => {
    tableRef.value?.reload?.();
  };

  // 租户套餐状态修改
  const handleStatusChange = async (checked, row) => {
    const status = checked ? '0' : '1';
    const text = status === '0' ? '启用' : '停用';
    try {
      await ElMessageBox.confirm(
        '确认要"' + text + '"' + row.packageName + '"套餐吗？',
        '系统提示',
        { type: 'warning', draggable: true }
      );
      await changePackageStatus(row.packageId, status);
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

  /** 删除按钮操作 */
  const handleDelete = async (row) => {
    const rows = row ? [row] : selections.value;
    if (!rows.length) {
      EleMessage.error('请至少选择一条数据');
      return;
    }

    try {
      await ElMessageBox.confirm(
        '是否确认删除套餐ID为"' +
          rows.map((d) => d.packageId).join(',') +
          '"的数据项？',
        '系统提示',
        { type: 'warning', draggable: true }
      );
      loading.value = true;
      await delTenantPackage(rows.map((d) => d.packageId));
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
    tableRef.value?.fetch?.(({ _page, _limit, where }) => {
      exportTenantPackage({ ...where })
        .then(() => {
          loading.close();
        })
        .catch((e) => {
          loading.close();
          EleMessage.error(e.message || '导出失败');
        });
    });
  };
</script>
