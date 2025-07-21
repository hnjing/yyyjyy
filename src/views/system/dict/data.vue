<template>
  <ele-card flex-table :body-style="{ paddingTop: '8px', overflow: 'hidden' }">
    <!-- 表格 -->
    <ele-pro-table
      ref="tableRef"
      row-key="id"
      v-model:selections="selections"
      :columns="columns"
      :datasource="datasource"
      :toolbar="{ theme: tableHeader }"
      highlight-current-row
      :bottom-line="tableFullHeight"
      cache-key="workAuditCheckTable"
      :pagination="{
        pageSizes: [10, 15, 20, 30, 40, 50, 100] // 每页显示条数选项
      }"
    >
      <smart-form
        v-model="searchExpand"
        ref="searchRef"
        :entityFileds="searchConfig"
        @search="reload"
      />
      <!-- 表头左侧功能按钮 -->
      <template #toolbar>
        <el-space>
          <el-button
            type="primary"
            class="ele-btn-icon"
            :icon="Plus"
            @click="handleAddorEdit()"
          >
            新增
          </el-button>
          <el-button
            type="danger"
            class="ele-btn-icon"
            :icon="Delete"
            :disabled="selections.length <= 1"
            @click="handleDelete"
          >
            删除
          </el-button>
          <el-button
            type="warning"
            class="ele-btn-icon"
            :icon="ArrowDown"
            @click="downLoad"
          >
            导出
          </el-button>
          <el-button
            type="warning"
            class="ele-btn-icon"
            :icon="Close"
            @click="closeFun"
          >
            关闭
          </el-button>
          <!-- <smart-search :entityFileds="searchConfig" @search="reloadSearch" /> -->
          <smart-search
            v-if="!searchExpand"
            :entityFileds="searchConfig"
            @search="reloadSearch"
          />
          <smart-search2 v-if="searchExpand" />
        </el-space>
      </template>

      <!-- 表头工具按钮 -->
      <template #tools>
        <el-space size="default" :wrap="true">
          <el-link type="primary" @click="searchExpand = !searchExpand">
            {{ searchExpand ? '普通搜索' : '高级搜索' }}
          </el-link>
          <el-divider direction="vertical" style="margin: 0" />
        </el-space>
      </template>
      <template #dictLabel="{ row }">
        <span v-if="row.listClass == '' || row.listClass == 'default'">{{
          row.dictLabel
        }}</span>
        <el-tag
          v-else
          :type="row.listClass == 'primary' ? '' : row.listClass"
          >{{ row.dictLabel }}</el-tag
        >
      </template>
      <template #status="{ row }">
        <dict-data type="tag" code="sys_normal_disable" v-model="row.status" />
      </template>
      <template #action="{ row }">
        <el-space>
          <el-link
            type="primary"
            underline="never"
            @click="handleAddorEdit(row)"
          >
            修改
          </el-link>
          <el-divider direction="vertical" style="margin: 0" />
          <el-link type="primary" underline="never" @click="handleDelete(row)">
            删除
          </el-link>
          <el-divider direction="vertical" style="margin: 0" />
          <el-link
            type="primary"
            underline="never"
            @click="getlog(row.dictCode, 'data')"
          >
            操作痕迹
          </el-link>
        </el-space>
      </template>
    </ele-pro-table>
    <!-- 新增弹窗 -->
    <CreateDataDialog v-model="showCreate" :data="current" @done="reload" />
    <!-- 操作留痕 -->
    <Trace v-model="showTrace" :data="traceObj" />
  </ele-card>
</template>
<script setup>
  import { delData, exportProject, listData } from '@/api/system/dict/data';
  import { getType, optionselect } from '@/api/system/dict/type';
  import { usePageTab } from '@/utils/use-page-tab';
  import { ArrowDown, Close, Delete, Plus } from '@element-plus/icons-vue';
  import { EleMessage } from '@hnjing/zxzy-admin-plus/es';
  import { ElMessageBox } from 'element-plus/es';
  import { nextTick, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import CreateDataDialog from './components/CreateDataDialog.vue';
  const route = useRoute();
  const router = useRouter();
  const { finishPageTab } = usePageTab();
  defineProps({
    // 表头背景
    tableHeader: String,
    // 表格高度
    tableFullHeight: Boolean
  });

  // 搜索表单是否展开
  const searchExpand = ref(false);

  // 表格搜索配置
  const searchConfig = ref([
    {
      prop: 'keywords',
      label: '关键字',
      type: '1',
      canDefaultSearch: true
    },
    {
      prop: 'dictType',
      label: '字典名称',
      type: '4',
      canDefaultSearch: true,
      value: '',
      options: []
    },
    {
      prop: 'dictLabel',
      label: '字典标签',
      type: '1',
      canDefaultSearch: true
    },
    {
      prop: 'status',
      label: '状态',
      type: '2',
      key: 'sys_normal_disable',
      canDefaultSearch: true
    }
  ]);

  // 表格列配置
  const columns = ref([
    {
      type: 'selection',
      columnKey: 'selection',
      width: 48,
      align: 'center',
      fixed: 'left'
    },
    {
      prop: 'dictCode',
      label: '字典编码',
      showOverflowTooltip: true,
      width: 80
    },
    {
      prop: 'dictLabel',
      label: '字典标签',
      width: 220,
      showOverflowTooltip: true,
      slot: 'dictLabel'
    },
    {
      prop: 'dictValue',
      label: '字典键值',
      width: 220,
      showOverflowTooltip: true
    },
    {
      prop: 'dictSort',
      label: '字典排序',
      width: 100,
      showOverflowTooltip: true
    },
    {
      prop: 'status',
      label: '状态',
      width: 160,
      align: 'center',
      showOverflowTooltip: true,
      slot: 'status'
    },
    {
      prop: 'createTime',
      label: '创建时间',
      align: 'center',
      width: 200
    },
    {
      prop: 'remark',
      label: '备注',
      minWidth: 200,
      showOverflowTooltip: true
    },
    {
      columnKey: 'action',
      label: '操作',
      width: 220,
      align: 'left',
      resizable: false,
      slot: 'action',
      fixed: 'right'
    }
  ]);
  // 表格选中数据
  const selections = ref([]);
  // 新增修改弹框控制
  const showCreate = ref(false);
  // 当前选中数据
  const current = ref({});
  const showTrace = ref(false);
  const traceObj = ref({});
  // 表格数据源
  const datasource = ({ page, limit, where, orders }) => {
    return listData({
      ...where,
      ...orders,
      pageNum: page,
      pageSize: limit
    });
  };

  // 表格实例
  const tableRef = ref(null);
  const dictType = ref('');
  // 搜索组件实例
  const searchRef = ref();
  const reloadSearch = (where) => {
    searchRef.value?.onSearchFilterSubmit(where);
  };
  const reload = (where) => {
    tableRef.value?.reload?.({ where });
  };
  const handleAddorEdit = (row = { dictType: dictType.value }) => {
    showCreate.value = true;
    current.value = row;
  };
  /** 查询字典类型详细 */
  const getTypeFun = (dictId) => {
    getType(dictId).then((res) => {
      searchConfig.value[1].value = res.data.dictType;
      dictType.value = res.data.dictType;
    });
  };
  /** 查询字典类型列表 */
  const getTypeList = () => {
    optionselect().then((res) => {
      const list = res.data.map((el) => {
        return {
          value: el.dictType,
          label: el.dictName
        };
      });
      searchConfig.value[1].options = list;
    });
  };
  /** 删除按钮操作 */
  const handleDelete = (row) => {
    const dictCodes =
      row.dictCode || selections.value.map((el) => el.dictCode).join(',');
    ElMessageBox.prompt(
      `是否确认删除字典编码为${dictCodes}的数据项？`,
      '淘汰',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputErrorMessage: '删除原因不能为空',
        inputValidator: (value) => {
          if (!value) {
            return '删除原因不能为空';
          }
        }
      }
    ).then(async ({ value }) => {
      sessionStorage.setItem('operationReason', value);
      try {
        await delData(dictCodes);
        EleMessage.success(`删除成功！`);
        sessionStorage.setItem('operationReason', '');
        reload();
      } catch (e) {
        EleMessage.error(e);
      }
    });
  };
  /* 导出数据 */
  const downLoad = () => {
    const loading = EleMessage.loading('请求中..');
    tableRef.value?.fetch?.(({ where }) => {
      exportProject(where)
        .then(() => {
          loading.close();
        })
        .catch((e) => {
          loading.close();
          EleMessage.error(e.msg);
        });
    });
  };
  const closeFun = () => {
    finishPageTab();
    nextTick(() => {
      router.push('/dict');
    });
  };
  const getlog = (val, name) => {
    traceObj.value = { objectId: val, objectName: name };
    showTrace.value = true;
  };
  getTypeFun(route.query.dictId);
  getTypeList();
</script>
