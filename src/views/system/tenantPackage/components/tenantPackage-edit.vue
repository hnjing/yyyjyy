<template>
  <el-dialog
    v-model="visible"
    :title="data ? '修改租户套餐' : '新增租户套餐'"
    width="600px"
    append-to-body
    destroy-on-close
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="套餐名称" prop="packageName">
        <el-input v-model="form.packageName" placeholder="请输入套餐名称" />
      </el-form-item>
      <el-form-item label="关联菜单">
        <ele-loading :loading="menuLoading" class="role-menu-tree">
          <div style="line-height: 1; padding: 0 6px 0 0">
            <el-button
              class="ele-btn-icon"
              size="small"
              style="margin: 0 0 6px 6px"
              @click="expandAll"
            >
              展开全部
            </el-button>
            <el-button
              class="ele-btn-icon"
              size="small"
              style="margin: 0 0 6px 6px"
              @click="foldAll"
            >
              折叠全部
            </el-button>
            <el-button
              class="ele-btn-icon"
              size="small"
              style="margin: 0 0 6px 6px"
              @click="checkAll"
            >
              全选
            </el-button>
            <el-button
              class="ele-btn-icon"
              size="small"
              style="margin: 0 0 6px 6px"
              @click="checkOutAll"
            >
              取消全选
            </el-button>
            <el-checkbox
              v-model="form.menuCheckStrictly"
              @change="handleCheckedTreeConnect"
              style="margin: 0 0 6px 6px"
            >
              父子联动
            </el-checkbox>
          </div>
          <div style="height: 260px; overflow: auto; padding: 0 6px">
            <el-tree
              ref="menuTreeRef"
              show-checkbox
              node-key="id"
              :data="menuOptions"
              :check-strictly="!form.menuCheckStrictly"
              empty-text="加载中，请稍候"
              :props="{ label: 'label', children: 'children' }"
            />
          </div>
        </ele-loading>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          :rows="3"
          placeholder="请输入备注"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button :loading="loading" type="primary" @click="submit"
          >确定</el-button
        >
        <el-button @click="cancel">取消</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
  import { ref, reactive, watch, nextTick } from 'vue';
  import { EleMessage, EleLoading } from '@hnjing/zxzy-admin-plus/es';
  import {
    getTenantPackage,
    addTenantPackage,
    updateTenantPackage,
    tenantPackageMenuTreeselect
  } from '@/api/system/tenantPackage';
  import { listRoleMenus as menuTreeselect } from '@/api/system/role';

  defineOptions({ name: 'TenantPackageEdit' });

  const props = defineProps({
    data: Object
  });

  const emit = defineEmits(['done']);

  const visible = defineModel();

  // 表单ref
  const formRef = ref();

  // 菜单树ref
  const menuTreeRef = ref();

  // 加载状态
  const loading = ref(false);

  // 菜单加载状态
  const menuLoading = ref(false);

  // 菜单树选项
  const menuOptions = ref([]);

  // 表单数据
  const form = reactive({
    packageId: undefined,
    packageName: '',
    menuIds: '',
    remark: '',
    menuCheckStrictly: true
  });

  // 表单校验规则
  const rules = {
    packageName: [
      { required: true, message: '套餐名称不能为空', trigger: 'blur' }
    ]
  };

  // 查询菜单树结构
  const getMenuTreeselect = async () => {
    menuLoading.value = true;
    try {
      const { menus } = await menuTreeselect();
      menuOptions.value = menus;
    } catch (error) {
      console.error(error.message);
      EleMessage.error('获取菜单数据失败');
    } finally {
      menuLoading.value = false;
    }
  };

  // 获取所有菜单节点数据
  const getMenuAllCheckedKeys = () => {
    // 目前被选中的菜单节点
    const checkedKeys = menuTreeRef.value?.getCheckedKeys() || [];
    // 半选中的菜单节点
    const halfCheckedKeys = menuTreeRef.value?.getHalfCheckedKeys() || [];

    return [...checkedKeys, ...halfCheckedKeys];
  };

  // 树权限（父子联动）
  const handleCheckedTreeConnect = (value) => {
    form.menuCheckStrictly = value;
  };

  // 展开全部
  const expandAll = () => {
    const treeList = menuOptions.value;
    for (let i = 0; i < treeList.length; i++) {
      if (
        menuTreeRef.value &&
        menuTreeRef.value.store.nodesMap[treeList[i].id]
      ) {
        menuTreeRef.value.store.nodesMap[treeList[i].id].expanded = true;
      }
    }
  };

  // 折叠全部
  const foldAll = () => {
    const treeList = menuOptions.value;
    for (let i = 0; i < treeList.length; i++) {
      if (
        menuTreeRef.value &&
        menuTreeRef.value.store.nodesMap[treeList[i].id]
      ) {
        menuTreeRef.value.store.nodesMap[treeList[i].id].expanded = false;
      }
    }
  };

  // 全选
  const checkAll = () => {
    menuTreeRef.value?.setCheckedNodes(menuOptions.value);
  };

  // 取消全选
  const checkOutAll = () => {
    menuTreeRef.value?.setCheckedNodes([]);
  };

  // 表单重置
  const resetForm = () => {
    // 重置表单数据
    Object.assign(form, {
      packageId: undefined,
      packageName: '',
      menuIds: '',
      remark: '',
      menuCheckStrictly: true
    });

    // 重置选中菜单
    if (menuTreeRef.value) {
      menuTreeRef.value.setCheckedKeys([]);

      // 折叠所有节点
      if (menuOptions.value && menuOptions.value.length > 0) {
        try {
          const treeList = menuOptions.value;
          for (let i = 0; i < treeList.length; i++) {
            if (
              menuTreeRef.value.store?.nodesMap &&
              treeList[i] &&
              treeList[i].id &&
              menuTreeRef.value.store.nodesMap[treeList[i].id]
            ) {
              menuTreeRef.value.store.nodesMap[treeList[i].id].expanded = false;
            }
          }
        } catch (error) {
          console.error('折叠节点时出错:', error);
        }
      }
    }

    // 重置表单验证状态
    formRef.value?.resetFields();
  };

  // 监听数据变化
  watch(
    () => props.data,
    async (val) => {
      resetForm();
      await getMenuTreeselect();

      if (val) {
        loading.value = true;
        try {
          const res = await getTenantPackage(val.packageId);
          Object.assign(form, res.data);

          // 获取关联的菜单
          const menuRes = await tenantPackageMenuTreeselect(val.packageId);

          // 设置选中的菜单
          menuRes.data.checkedKeys.forEach((v) => {
            nextTick(() => {
              menuTreeRef.value?.setChecked(v, true, false);
            });
          });
        } catch (error) {
          console.error(error.message);
        } finally {
          loading.value = false;
        }
      }
    },
    { immediate: true }
  );

  // 监听弹窗显示状态
  watch(
    () => visible.value,
    async (val) => {
      if (val && !props.data) {
        // 新增状态下，确保表单被重置
        resetForm();
        // 获取菜单树数据
        await getMenuTreeselect();
      }
    }
  );

  // 取消
  const cancel = () => {
    visible.value = false;
    resetForm();
  };

  // 提交
  const submit = () => {
    formRef.value?.validate(async (valid) => {
      if (!valid) return;

      loading.value = true;
      try {
        form.menuIds = getMenuAllCheckedKeys();

        if (props.data) {
          await updateTenantPackage(form);
        } else {
          await addTenantPackage(form);
        }

        EleMessage.success('操作成功');
        visible.value = false;
        emit('done');
      } catch (error) {
        console.error(error.message);
      } finally {
        loading.value = false;
      }
    });
  };
</script>

<style scoped>
  .role-menu-tree {
    border: 1px solid #e5e6e7;
    background: #fff;
    border-radius: 4px;
  }

  .dialog-footer {
    text-align: right;
  }
</style>
