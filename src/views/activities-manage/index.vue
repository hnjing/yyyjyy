<template>
  <ele-page :flex-table="fixedHeight" hide-footer>
    <ele-card
      :flex-table="fixedHeight"
      :body-style="{ paddingBottom: '4px' }"
      :style="{
        minHeight: fixedHeight ? '380px' : void 0,
        marginBottom: fixedHeight ? '10px' : void 0
      }"
    >
      <EleTableSearch
        :model="form"
        :items="items"
        filterRowToMore="1"
        @updateValue="updateFormValue"
        @submit="onSearch"
        @reset="onSearch"
      >
        <template #SelectUser>
          <SelectUser v-model="form.user" />
        </template>
        <template #toolbar>
          <ele-tooltip
            content="新增志愿活动、救援活动"
            type="warning"
            placement="top"
            bg="linear-gradient( 135deg, #43CBFF 10%, #9708CC 100%)"
            arrow-bg="#7556E0"
            :offset="8"
          >
            <el-button
              type="primary"
              :icon="PlusOutlined"
              v-permission="'activity:add'"
              class="ele-btn-icon"
              @click="openEdit()"
            >
              新增活动
            </el-button>
          </ele-tooltip>
        </template>
      </EleTableSearch>
      <!-- 表格 -->
      <ele-pro-table
        ref="tableRef"
        row-key="userId"
        :columns="columns"
        :datasource="datasource"
        v-model:current="current"
        v-model:selections="selections"
        :show-overflow-tooltip="true"
        :export-config="{ fileName: '基础列表数据', datasource: exportSource }"
        :print-config="{ datasource: exportSource }"
        :sticky="!fixedHeight"
        cache-key="normal-table"
        :border="tableBorder"
        :toolbar="{ theme: toolDefault ? 'default' : 'plain' }"
        :default-sort="{ prop: 'createTime', order: 'ascending' }"
        :footer-style="{ paddingBottom: '12px' }"
        style="padding-bottom: 0; margin-top: -5px"
        @done="onDone"
      >
        <template #image="{ row }">
          <el-image
            style="width: 80px; height: 80px"
            :src="row.activityPicList[0]"
            :preview-src-list="row.activityPicList"
            show-progress
            :preview-teleported="true"
            :teleported="true"
            :initial-index="1000"
            fit="cover"
          />
        </template>
        <!-- 操作列 -->
        <template #action="{ row }">
          <el-link
            type="primary"
            underline="never"
            v-permission="'activity:update'"
            @click.stop="openEdit(row)"
          >
            修改
          </el-link>
          <el-divider v-permission="'activity:delete'" direction="vertical" />
          <el-link
            type="danger"
            underline="never"
            v-permission="'activity:delete'"
            @click.stop="remove(row)"
          >
            删除
          </el-link>
        </template>
        <!-- 打印增加额外内容 -->
        <template #printTop>
          <h2 style="text-align: center">还可以自定义打印的顶部区域</h2>
        </template>
        <template #printBottom="{ data }">
          <h2 style="text-align: center">还可以自定义打印的底部区域</h2>
          <div style="text-align: center">
            共打印了 <b style="color: red">{{ data.length }}</b> 条数据
          </div>
        </template>
      </ele-pro-table>

      <handleModal
        v-model="visibleModal"
        :handle="handle"
        :editData="editData || {}"
      />
    </ele-card>
  </ele-page>
</template>

<script setup name="ActiveManage">
  import { ref, reactive, computed, nextTick, provide } from 'vue';
  import { ElMessageBox } from 'element-plus/es';
  import { EleMessage } from '@hnjing/zxzy-admin-plus';
  import { PlusOutlined } from '@/components/icons';
  import { useDictData } from '@/utils/use-dict-data';
  import { pageActivitys, listActivitys, removeActivity } from '@/api/activity';
  import handleModal from './components/modal.vue';
  import SelectUser from '@/components/SelectUser/index.vue';

  /** 性别字典数据 */
  const [typeDicts] = useDictData(['sys_activity_type']);

  /** 表格实例 */
  const tableRef = ref(null);

  /** 表单数据 */
  const form = reactive({
    carNo: '',
    aidCarNo: '',
    useName: ''
  });

  /** 更新表单数据 */
  const updateFormValue = (prop, value) => {
    console.log(prop, value);
    form[prop] = value;
  };

  /** 表单项 */
  const items = ref([
    {
      type: 'input',
      label: '活动名称',
      prop: 'activityTitle',
      props: {
        labelWidth: '120px'
      }
    },
    {
      type: 'SelectUser',
      label: '相关人员',
      prop: 'user'
    },
    {
      label: '活动类型',
      prop: 'activityType',
      type: 'dictSelect',
      props: { code: 'sys_activity_type' }
    }
  ]);

  /** 表格搜索参数 */
  const lastWhere = reactive({});

  /** 表格列配置 */
  const columns = computed(() => {
    return [
      {
        type: 'index',
        columnKey: 'index',
        width: 50,
        align: 'center',
        fixed: 'left'
      },
      {
        prop: 'activityTitle',
        label: '活动名称',
        minWidth: 110
      },
      {
        prop: 'remark1',
        label: '相关人员',
        minWidth: 110
      },
      {
        columnKey: 'image',
        prop: 'image',
        label: '活动照片',
        minWidth: 100,
        align: 'center',
        slot: 'image'
      },
      {
        columnKey: 'activityType',
        label: '活动类型',
        minWidth: 110,
        formatter: (row) =>
          (
            typeDicts.value.filter(
              (i) => String(i.dictValue) === row.activityType
            )[0] || {}
          ).dictLabel
      },
      {
        prop: 'activitySco',
        label: '活动积分',
        minWidth: 110,
        sortable: 'custom'
      },
      {
        prop: 'activityStartTime',
        label: '开始时间',
        minWidth: 110,
        sortable: 'custom'
      },
      {
        prop: 'activityEndTime',
        label: '结束时间',
        minWidth: 110
      },
      {
        prop: 'activityContent',
        label: '活动描述',
        minWidth: 110
      },
      {
        prop: 'createUser',
        label: '创建人',
        minWidth: 110
      },
      {
        prop: 'createTime',
        label: '创建时间',
        minWidth: 110,
        sortable: 'custom'
      },
      {
        columnKey: 'action',
        label: '操作',
        minWidth: 160,
        align: 'center',
        showOverflowTooltip: false,
        resizable: false,
        slot: 'action',
        fixed: 'right',
        disabledInSetting: true,
        hideInPrint: true,
        hideInExport: true
      }
    ];
  });

  /** 表格选中数据 */
  const selections = ref([]);

  /** 表格单选选中数据 */
  const current = ref(null);

  /** 表头工具栏风格 */
  const toolDefault = ref(false);

  /** 表格固定高度 */
  const fixedHeight = ref(true);

  /** 新增编辑弹窗是否显示 */
  const visibleModal = ref(false);

  const editData = ref({});

  const handle = ref('add');

  /** 表格数据源 */
  const datasource = ({ pages, where, orders, filters }) => {
    return pageActivitys({ ...where, ...orders, ...filters, ...pages });
  };

  /** 表格数据请求完成事件 */
  const onDone = () => {
    // 回显 id 为 45、47、48 的数据的复选框
    nextTick(() => {
      const ids = [45, 47, 48];
      tableRef.value?.setSelectedRowKeys?.(ids);
    });
  };

  /** 搜索事件 */
  const onSearch = (where) => {
    const [d1, d2] = where.createTime ?? [];
    const time = {
      createTimeStart: d1 ? `${d1} 00:00:00` : '',
      createTimeEnd: d2 ? `${d2} 23:59:59` : ''
    };
    Object.assign(lastWhere, where, time);
    doReload();
  };

  /** 刷新表格 */
  const reload = (where) => {
    tableRef.value?.reload?.({ page: 1, where });
  };

  /** 修改搜索框背景色 */
  const tableBorder = ref(false);

  const openDetail = (row) => {
    console.log(row);
  };

  /** 编辑 */
  const openEdit = (row) => {
    handle.value = row ? 'edit' : 'add';
    editData.value = row || null;
    visibleModal.value = true;
  };

  /** 删除 */
  const remove = (row) => {
    ElMessageBox.confirm(
      `确定要删除“${row.activityTitle}”的活动吗?`,
      '系统提示',
      {
        type: 'warning',
        draggable: true
      }
    )
      .then(() => {
        removeActivity(row.id)
          .then((msg) => {
            EleMessage.success(msg);
            reload();
          })
          .catch((e) => {
            EleMessage.error(e.message);
          });
      })
      .catch(() => {});
  };

  /** 表格搜索 */
  const doReload = () => {
    reload(lastWhere);
  };

  /** 孙子组件刷新表格 */
  provide('reloadTable', reload);

  /** 导出和打印全部数据的数据源 */
  const exportSource = ({ where, orders, filters }) => {
    return listActivitys({ ...where, ...orders, ...filters });
  };
</script>
