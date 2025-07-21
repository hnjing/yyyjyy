<template>
  <ele-page flex-table hide-footer>
    <ele-card
      flex-table
      :body-style="{ paddingBottom: '4px' }"
      :style="{
        minHeight: '380px',
        marginBottom: '10px'
      }"
    >
      <ele-table-search
        v-show="showSearch"
        v-model="queryParams"
        :model="queryParams"
        :items="searchItems"
        @submit="handleQuery"
        @reset="resetQuery"
      >
        <template #toolbar>
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                type="primary"
                plain
                :icon="PlusOutlined"
                @click="handleAdd()"
                v-permission="['workflow:category:add']"
                >新增</el-button
              >
            </el-col>
            <el-col :span="1.5">
              <el-button
                type="info"
                plain
                :icon="ArrowDown"
                @click="handleToggleExpandAll"
                >展开/折叠</el-button
              >
            </el-col>
          </el-row>
        </template>
      </ele-table-search>
      <ele-pro-table
        ref="categoryTableRef"
        v-loading="loading"
        :datasource="datasource"
        row-key="menuKey"
        :default-expand-all="isExpandAll"
        :columns="columns"
      >
        <template #action="{ row }">
          <el-link
            type="primary"
            :icon="EditOutlined"
            underline="never"
            @click="handleUpdate(row)"
          >
            修改
          </el-link>
          <el-divider direction="vertical" />
          <el-link
            type="primary"
            :icon="PlusOutlined"
            underline="never"
            @click="handleAdd(row)"
          >
            新增
          </el-link>
          <el-divider direction="vertical" />
          <el-link
            type="primary"
            :icon="DeleteOutlined"
            underline="never"
            @click="handleDelete(row)"
          >
            删除
          </el-link>
        </template>
      </ele-pro-table>
    </ele-card>
    <el-dialog
      :title="dialog.title"
      v-model="dialog.visible"
      width="500px"
      append-to-body
    >
      <el-form
        ref="categoryFormRef"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="上级分类" prop="parentId">
          <el-tree-select
            v-model="form.parentId"
            :data="categoryOptions"
            :props="{
              value: 'categoryId',
              label: 'categoryName',
              children: 'children'
            }"
            value-key="categoryId"
            placeholder="请选择上级分类"
            check-strictly
          />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="分类名称" prop="categoryName">
              <el-input
                v-model="form.categoryName"
                placeholder="请输入分类名称"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="orderNum">
              <el-input-number
                v-model="form.orderNum"
                controls-position="right"
                :min="0"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm"
            >确 定</el-button
          >
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </ele-page>
</template>

<script setup name="Category">
  import { ref, reactive, getCurrentInstance, toRefs, computed } from 'vue';
  import { ElMessageBox } from 'element-plus';
  import { EleMessage, toTree } from '@hnjing/zxzy-admin-plus/es';
  import {
    listCategory,
    getCategory,
    delCategory,
    addCategory,
    updateCategory
  } from '@/api/workflow/category';
  import {
    PlusOutlined,
    ArrowDown,
    EditOutlined,
    DeleteOutlined
  } from '@/components/icons';

  defineOptions({ name: 'WorkflowCategory' });

  // 搜索表单项
  const searchItems = [
    {
      type: 'input',
      label: '分类名称',
      prop: 'categoryName',
      placeholder: '请输入分类名称'
    }
  ];

  const categoryList = ref([]);
  const categoryOptions = ref([]);
  const buttonLoading = ref(false);
  const showSearch = ref(true);
  const isExpandAll = ref(true);
  const loading = ref(false);

  const queryFormRef = ref();
  const categoryFormRef = ref();
  const categoryTableRef = ref();

  const dialog = reactive({
    visible: false,
    title: ''
  });

  const initFormData = {
    categoryId: undefined,
    categoryName: '',
    parentId: undefined,
    orderNum: 0
  };

  const data = reactive({
    form: { ...initFormData },
    queryParams: {
      categoryName: undefined
    },
    rules: {
      categoryId: [
        { required: true, message: '流程分类ID不能为空', trigger: 'blur' }
      ],
      parentId: [
        { required: true, message: '请选择上级分类', trigger: 'change' }
      ],
      categoryName: [
        { required: true, message: '请输入分类名称', trigger: 'blur' }
      ]
    }
  });

  const { queryParams, form, rules } = toRefs(data);

  /** 表格数据源 */
  const datasource = async ({ pages, where, parent }) => {
    const now = Date.now();
    if (parent == null) {
      const res = await listCategory(queryParams.value);
      const data = toTree({
        data: res.data.data,
        idField: 'categoryId',
        parentIdField: 'parentId'
      });
      return data?.map?.((d) => {
        return {
          ...d,
          menuKey: d.categoryId + '-' + now
        };
      });
    }
  };
  const getList = async () => {
    loading.value = true;
    try {
      const res = await listCategory(queryParams.value);
      const data = toTree({
        data: res.data.data,
        idField: 'categoryId',
        parentIdField: 'parentId'
      });
      if (data) {
        categoryList.value = data;
      }
    } catch (error) {
      console.error(error);
      EleMessage.error(error.message || '获取数据失败');
    } finally {
      loading.value = false;
    }
  };

  /** 查询流程分类下拉树结构 */
  const getTreeselect = async () => {
    try {
      const res = await listCategory();
      categoryOptions.value = [];
      // 处理树形数据
      const data = toTree(res.data, 'categoryId', 'parentId');
      if (data) {
        categoryOptions.value = data; // 将处理后的树形数据赋值
      }
    } catch (error) {
      console.error(error);
      EleMessage.error(error.message || '获取树结构失败');
    }
  };

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
        label: '分类名称',
        prop: 'categoryName',
        minWidth: 260
      },
      {
        label: '显示顺序',
        align: 'center',
        prop: 'orderNum',
        width: 200
      },
      {
        label: '创建时间',
        align: 'center',
        prop: 'createTime',
        width: 180
      },
      {
        label: '操作',
        slot: 'action',
        align: 'center',
        fixed: 'right',
        width: 280
      }
    ];
  });

  // 取消按钮
  const cancel = () => {
    reset();
    dialog.visible = false;
  };

  // 表单重置
  const reset = () => {
    form.value = { ...initFormData };
    categoryFormRef.value?.resetFields();
  };

  /** 搜索按钮操作 */
  const handleQuery = () => {
    getList();
  };

  /** 重置按钮操作 */
  const resetQuery = () => {
    queryFormRef.value?.resetFields();
    handleQuery();
  };

  /** 新增按钮操作 */
  const handleAdd = (row) => {
    reset();
    getTreeselect();
    if (row?.categoryId) {
      form.value.parentId = row.categoryId;
    } else {
      form.value.parentId = undefined;
    }
    dialog.visible = true;
    dialog.title = '添加流程分类';
  };

  /** 展开/折叠操作 */
  const handleToggleExpandAll = () => {
    isExpandAll.value = !isExpandAll.value;
    toggleExpandAll(categoryList.value, isExpandAll.value);
  };

  /** 展开/折叠操作 */
  const toggleExpandAll = (data, status) => {
    data.forEach((item) => {
      categoryTableRef.value?.toggleRowExpansion(item, status);
      if (item.children && item.children.length > 0)
        toggleExpandAll(item.children, status);
    });
  };

  /** 修改按钮操作 */
  const handleUpdate = async (row) => {
    reset();
    await getTreeselect();
    if (row != null) {
      form.value.parentId = row.parentId;
    }
    try {
      const res = await getCategory(row.categoryId);
      Object.assign(form.value, res.data);
      dialog.visible = true;
      dialog.title = '修改流程分类';
    } catch (error) {
      console.error(error);
      EleMessage.error(error.message || '获取分类详情失败');
    }
  };

  /** 提交按钮 */
  const submitForm = () => {
    categoryFormRef.value?.validate(async (valid) => {
      if (valid) {
        buttonLoading.value = true;
        try {
          if (form.value.categoryId) {
            await updateCategory(form.value);
          } else {
            await addCategory(form.value);
          }
          EleMessage.success('操作成功');
          dialog.visible = false;
          getList();
        } catch (error) {
          console.error(error);
          EleMessage.error(error.message || '操作失败');
        } finally {
          buttonLoading.value = false;
        }
      }
    });
  };

  /** 删除按钮操作 */
  const handleDelete = async (row) => {
    try {
      await ElMessageBox.confirm(
        '是否确认删除"' + row.categoryName + '"的分类？',
        '提示',
        {
          type: 'warning'
        }
      );
      loading.value = true;
      await delCategory(row.categoryId);
      await getList();
      EleMessage.success('删除成功');
    } catch (error) {
      if (error !== 'cancel') {
        console.error(error);
        EleMessage.error(error.message || '删除失败');
      }
    } finally {
      loading.value = false;
    }
  };
</script>
