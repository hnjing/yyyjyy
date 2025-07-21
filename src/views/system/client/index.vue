<template>
  <ele-page :flex-table="true" hide-footer>
    <!-- 搜索表单 -->
    <client-search @search="reload" />

    <ele-card :flex-table="true" :body-style="{ paddingTop: '8px' }">
      <!-- 表格 -->
      <ele-pro-table
        ref="tableRef"
        row-key="id"
        :columns="columns"
        :datasource="datasource"
        :loading="loading"
        :show-overflow-tooltip="true"
        v-model:selections="selections"
        highlight-current-row
        :export-config="{ fileName: '客户端数据' }"
        cache-key="systemClientTable"
      >
        <template #toolbar>
          <el-button
            type="primary"
            class="ele-btn-icon"
            :icon="PlusOutlined"
            v-permission="'system:client:add'"
            @click="openEdit()"
          >
            新增
            </el-button>
          <el-button
            type="danger"
            class="ele-btn-icon"
            :icon="DeleteOutlined"
            v-permission="'system:client:remove'"
            :disabled="!selections.length"
            @click="removeBatch()"
          >
              删除
            </el-button>
          <el-button
            class="ele-btn-icon"
            :icon="DownloadOutlined"
            v-permission="'system:client:export'"
            @click="exportData"
          >
            导出
          </el-button>
      </template>
        <template #status="{ row }">
          <el-switch
            size="small"
            :model-value="row.status == 0"
            @change="(checked) => editStatus(checked, row)"
          />
          </template>
        <template #action="{ row }">
          <el-link
            v-permission="'system:client:edit'"
            type="primary"
            underline="never"
            @click="openEdit(row)"
          >
            修改
          </el-link>
          <el-divider
            v-permission="'system:client:remove'"
            direction="vertical"
          />
          <el-link
            v-permission="'system:client:remove'"
            type="danger"
            underline="never"
            @click="removeBatch(row)"
          >
            删除
          </el-link>
          </template>
        <template #grantTypeList="{ row }">
          <dict-data
            code="sys_grant_type"
            type="tag"
            :model-value="row.grantTypeList"
          />
          </template>
        <template #deviceType="{ row }">
          <dict-data
            code="sys_device_type"
            type="tag"
            :model-value="row.deviceType"
          />
          </template>
      </ele-pro-table>
    </ele-card>

    <!-- 编辑弹窗 -->
    <client-edit v-model="showEdit" :data="current" @done="reload" />
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
  import ClientSearch from './components/client-search.vue';
  import ClientEdit from './components/client-edit.vue';
  import {
    listClient,
    delClient,
    delClients,
    changeStatus,
    exportClient
  } from '@/api/system/client';

  defineOptions({ name: 'SystemClient' });

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
        prop: 'clientName',
        label: '客户端名称',
        columnKey: 'clientName',
        minWidth: 120,
        align: 'center'
      },
      {
        prop: 'clientId',
        label: '客户端id',
        columnKey: 'clientId',
        minWidth: 120,
        align: 'center'
      },
      {
        prop: 'clientKey',
        label: '客户端key',
        columnKey: 'clientKey',
        minWidth: 120,
        align: 'center'
      },
      {
        prop: 'clientSecret',
        label: '客户端秘钥',
        columnKey: 'clientSecret',
        minWidth: 120,
        align: 'center'
      },
      {
        prop: 'redirectUri',
        label: '客户端路径',
        columnKey: 'redirectUri',
        minWidth: 150,
        align: 'center'
      },
      {
        prop: 'grantTypeList',
        label: '授权类型',
        columnKey: 'grantTypeList',
        width: 130,
        slot: 'grantTypeList',
        align: 'center'
      },
      {
        prop: 'deviceType',
        label: '设备类型',
        columnKey: 'deviceType',
        width: 120,
        slot: 'deviceType',
        align: 'center'
      },
      {
        prop: 'activeTimeout',
        label: 'Token活跃超时时间',
        columnKey: 'activeTimeout',
        width: 150,
        align: 'center'
      },
      {
        prop: 'timeout',
        label: 'Token固定超时时间',
        columnKey: 'timeout',
        width: 150,
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
    return listClient({ ...where, ...filters, ...orders, ...pages }).finally(
      () => {
  loading.value = false;
      }
    );
  };

  // 搜索
  const reload = (where) => {
    tableRef.value?.reload?.({ page: 1, where });
  };

  // 打开编辑弹窗
  const openEdit = (row) => {
    current.value = row ?? null;
    showEdit.value = true;
  };

  // 批量删除
  const removeBatch = (row) => {
    const rows = row ? [row] : selections.value;
    if (!rows.length) {
      EleMessage.error('请至少选择一条数据');
      return;
    }

    ElMessageBox.confirm(
      `是否确认删除客户端"${rows.map((d) => d.clientKey).join(',')}"的数据?`,
      '系统提示',
      { type: 'warning', draggable: true }
    )
      .then(() => {
        const loading = EleMessage.loading({
          message: '请求中..',
          plain: true
        });

        if (row) {
          // 删除单条
          delClient(row.id)
            .then(() => {
              loading.close();
              EleMessage.success('删除成功');
              reload();
            })
            .catch((e) => {
              loading.close();
              EleMessage.error(e.message);
            });
        } else {
          // 批量删除
          delClients(rows.map((d) => d.id))
            .then(() => {
              loading.close();
              EleMessage.success('删除成功');
              reload();
            })
            .catch((e) => {
              loading.close();
              EleMessage.error(e.message);
            });
        }
      })
      .catch(() => {});
  };

  // 导出数据
  const exportData = () => {
    const loading = EleMessage.loading({
      message: '请求中..',
      plain: true
    });
    tableRef.value?.fetch?.(({ page, limit, where }) => {
      exportClient({ page, limit, ...where })
        .then(() => {
          loading.close();
        })
        .catch((e) => {
          loading.close();
          EleMessage.error(e.message);
        });
    });
  };

  // 状态修改
  const editStatus = (checked, row) => {
    const status = checked ? '0' : '1';
    changeStatus(row.clientId, status)
      .then((msg) => {
        row.status = status;
        EleMessage.success(msg);
      })
      .catch((e) => {
        EleMessage.error(e.message);
      });
  };
</script>
