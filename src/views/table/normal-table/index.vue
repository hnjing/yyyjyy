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
        :show-label="false"
        @updateValue="updateFormValue"
        @submit="onSearch"
        @reset="onSearch"
      >
        <template #toolbar>
          <ele-tooltip
            content="单个新增"
            type="warning"
            placement="top"
            bg="linear-gradient( 135deg, #43CBFF 10%, #9708CC 100%)"
            arrow-bg="#7556E0"
            :offset="8"
          >
            <el-button
              type="primary"
              :icon="PlusOutlined"
              class="ele-btn-icon"
              @click="openEdit()"
            >
              新增
            </el-button>
          </ele-tooltip>

          <el-button
            class="ele-btn-icon"
            type="primary"
            @click="changeTableBorder()"
          >
            表格边框变更
          </el-button>
          <ele-dropdown
            :disabled="!selections.length"
            :items="[
              {
                title: '批量修改',
                command: 'edit',
                icon: EditOutlined
              },
              {
                title: '批量禁用',
                command: 'disabled',
                icon: MinusCircleOutlined
              },
              {
                title: '批量删除',
                command: 'del',
                icon: DeleteOutlined,
                danger: true,
                divided: true
              }
            ]"
            :icon-props="{ size: 15 }"
            placement="bottom-start"
            style="margin-left: 12px"
            @command="onDropClick"
          >
            <el-button
              :disabled="!selections.length"
              type="primary"
              class="ele-btn-icon"
            >
              <span>批量操作</span>
              <el-icon :size="12" style="margin: 0 -4px 0 2px">
                <ArrowDown />
              </el-icon>
            </el-button>
          </ele-dropdown>
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
        :isMobile="mobileDevice"
        :sticky="!fixedHeight"
        cache-key="normal-table"
        :border="tableBorder"
        :toolbar="{ theme: toolDefault ? 'default' : 'plain' }"
        :default-sort="{ prop: 'createTime', order: 'ascending' }"
        :footer-style="{ paddingBottom: '12px' }"
        style="padding-bottom: 0; margin-top: -5px"
        @done="onDone"
      >
        <!-- 头像列 -->
        <template #avatar="{ row }">
          <el-avatar
            v-if="row.avatar"
            :src="row.avatar"
            :size="32"
            @click.stop=""
            style="vertical-align: -8px"
          />
          <el-avatar
            v-else
            :size="32"
            style="background: #1677ff; vertical-align: -8px"
            @click.stop=""
          >
            {{
              row.nickname && row.nickname.length > 2
                ? row.nickname.substring(row.nickname.length - 2)
                : row.nickname
            }}
          </el-avatar>
        </template>
        <!-- 状态列 -->
        <template #status="{ row }">
          <ele-dot v-if="row.status === 0" text="正常" size="8px" />
          <ele-dot
            v-else-if="row.status === 1"
            text="冻结"
            type="danger"
            :ripple="false"
            size="8px"
          />
        </template>
        <!-- 角色列 -->
        <template #roles="{ row }">
          <el-tag
            v-for="item in row.roles"
            :key="item.roleId"
            size="small"
            :disable-transitions="true"
            style="margin-right: 6px"
          >
            {{ item.roleName }}
          </el-tag>
        </template>
        <!-- 操作列 -->
        <template #action="{ row }">
          <el-link
            type="primary"
            underline="never"
            @click.stop="openDetail(row)"
          >
            查看
          </el-link>
          <el-divider direction="vertical" />
          <el-link type="primary" underline="never" @click.stop="openEdit(row)">
            修改
          </el-link>
          <el-divider direction="vertical" />
          <el-link type="danger" underline="never" @click.stop="remove(row)">
            删除
          </el-link>
        </template>
        <!-- 用户名表头 -->
        <template #nicknameHeader="{ column }">
          <div style="display: flex; align-items: center">
            <div style="flex: 1; overflow: hidden; text-overflow: ellipsis">
              {{ column.label }}
            </div>
            <nickname-filter @search="onNicknameFilter" />
          </div>
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

<script setup name="NormalTable">
  import { ref, reactive, computed, nextTick } from 'vue';
  import { ElMessageBox } from 'element-plus/es';
  import { EleMessage } from '@hnjing/zxzy-admin-plus';
  import { useI18n } from 'vue-i18n';
  import {
    PlusOutlined,
    ArrowDown,
    EditOutlined,
    MinusCircleOutlined,
    DeleteOutlined
  } from '@/components/icons';
  import { useDictData } from '@/utils/use-dict-data';
  import NicknameFilter from './components/nickname-filter.vue';
  import { templatePageUsers, listUsers } from '@/api/system/user';
  import handleModal from './handleModal/index.vue';
  import { useMobileDevice } from '@/utils/use-mobile';
  import { useRouter } from 'vue-router';

  const { push } = useRouter();

  const { t } = useI18n();

  const { mobileDevice } = useMobileDevice();

  /** 性别字典数据 */
  const [sexDicts] = useDictData(['sys_user_sex']);
  console.log('sexDicts', sexDicts.value);

  /** 表格实例 */
  const tableRef = ref(null);

  /** 用户名筛选值 */
  const nicknameFilterValue = ref('');

  /** 表单数据 */
  const form = reactive({
    username: '',
    organizationName: '',
    phone: '',
    email: '',
    createTime: ['', ''],
    sex: ''
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
      label: '用户账号',
      prop: 'username',
      props: {
        labelWidth: '120px'
      }
    },
    {
      type: 'input',
      label: '组织机构',
      tips: '组织机构包含公司和部门',
      prop: 'organizationName'
    },
    {
      type: 'input',
      label: '手机号',
      prop: 'phone',
      tips: '当前用户的手机号，支持模糊匹配'
    },
    {
      type: 'input',
      label: '文字长时显示效果',
      tips: '文字长度可以设置，默认显示4个字',
      prop: 'username'
    },
    {
      type: 'input',
      label: '组织机构',
      prop: 'organizationName'
    },
    {
      type: 'input',
      label: '手机号',
      prop: 'phone'
    },
    {
      type: 'input',
      label: '用户账号',
      prop: 'username'
    },
    {
      type: 'input',
      label: '组织机构',
      prop: 'organizationName'
    },
    {
      type: 'input',
      label: '手机号',
      prop: 'phone'
    },
    {
      type: 'input',
      label: '邮箱',
      prop: 'email',
      placeholder: '请输入邮箱'
    },
    {
      label: '创建时间',
      prop: 'createTime',
      type: 'daterange'
    },
    {
      type: 'dictSelect',
      label: '性别',
      prop: 'sex',
      props: {
        code: 'sex'
      }
    }
  ]);

  /** 表格搜索参数 */
  const lastWhere = reactive({});

  /** 表格列配置 */
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
        columnKey: 'avatar',
        prop: 'avatar',
        label: t('list.basic.table.avatar'),
        width: 100,
        align: 'center',
        slot: 'avatar'
      },
      {
        prop: 'username',
        label: t('list.basic.table.username'),
        minWidth: 110,
        sortable: 'custom'
      },
      {
        prop: 'nickname',
        label: t('list.basic.table.nickname'),
        minWidth: 110,
        sortable: 'custom',
        headerSlot: 'nicknameHeader'
      },
      {
        columnKey: 'roles',
        label: t('list.basic.table.roles'),
        minWidth: 110,
        slot: 'roles',
        hideInTable: true,
        formatter: (row) => row.roles.map((d) => d.roleName).join(',')
      },
      {
        prop: 'organizationName',
        label: t('list.basic.table.organizationName'),
        minWidth: 110,
        sortable: 'custom'
      },
      {
        prop: 'phone',
        label: t('list.basic.table.phone'),
        minWidth: 110,
        sortable: 'custom',
        hideInTable: true
      },
      {
        prop: 'email',
        label: t('list.basic.table.email'),
        minWidth: 110,
        sortable: 'custom',
        hideInTable: true
      },
      {
        columnKey: 'sex',
        prop: 'sexName',
        label: t('list.basic.table.sexName'),
        minWidth: 110,
        align: 'center',
        sortable: 'custom',
        filters: sexDicts.value.map((d) => {
          return { text: d.dictLabel, value: d.dictValue };
        }),
        filterMultiple: false
      },
      {
        prop: 'createTime',
        label: t('list.basic.table.createTime'),
        minWidth: 110,
        sortable: 'custom'
      },
      {
        prop: 'status',
        label: t('list.basic.table.status'),
        minWidth: 110,
        sortable: 'custom',
        align: 'center',
        slot: 'status',
        filters: [
          { text: '正常', value: '0' },
          { text: '冻结', value: '1' }
        ],
        filterMultiple: false,
        formatter: (row) => (row.status == 0 ? '正常' : '冻结')
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
    return templatePageUsers({ ...where, ...orders, ...filters, ...pages });
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
  const changeTableBorder = () => {
    tableBorder.value = !tableBorder.value;
  };

  const openDetail = (row) => {
    console.log(row);
    push({
      path: '/dashboard/normal-table/detail',
      query: {
        id: row?.userId
      }
    });
  };

  /** 编辑 */
  const openEdit = (row) => {
    handle.value = row ? 'edit' : 'add';
    editData.value = row || null;
    visibleModal.value = true;
  };

  /** 删除 */
  const remove = (row) => {
    ElMessageBox.confirm(`确定要删除“${row.username}”吗?`, '系统提示', {
      type: 'warning',
      draggable: true
    })
      .then(() => {
        EleMessage.success('点击了删除');
      })
      .catch(() => {});
  };

  /** 下拉按钮点击 */
  const onDropClick = (command) => {
    if (command === 'del') {
      EleMessage.error('点击了批量删除');
    } else if (command === 'edit') {
      EleMessage.info({ message: '点击了批量修改', plain: true });
    } else if (command === 'disabled') {
      EleMessage.info({ message: '点击了批量禁用', plain: true });
    }
  };

  /** 表格搜索 */
  const doReload = () => {
    if (nicknameFilterValue.value) {
      reload({
        ...lastWhere,
        nickname: nicknameFilterValue.value
      });
    } else {
      reload(lastWhere);
    }
  };

  /** 用户名筛选事件 */
  const onNicknameFilter = (nickname) => {
    nicknameFilterValue.value = nickname;
    doReload();
  };

  /** 导出和打印全部数据的数据源 */
  const exportSource = ({ where, orders, filters }) => {
    return listUsers({ ...where, ...orders, ...filters });
  };
</script>
