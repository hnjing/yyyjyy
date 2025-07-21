<template>
  <ele-modal
    form
    maxable
    :width="600"
    :model-value="modelValue"
    :title="isUpdate ? '修改岗位' : '新增岗位'"
    @update:modelValue="updateModelValue"
    :draggable="false"
  >
    <el-form
      ref="formRef"
      label-position="right"
      label-width="90px"
      :model="form"
      :rules="rules"
    >
      <el-form-item label="岗位名称" prop="postName">
        <el-input v-model="form.postName" placeholder="请输入岗位名称" />
      </el-form-item>
      <el-form-item label="岗位编码" prop="postCode">
        <el-input v-model="form.postCode" placeholder="请输入编码名称" />
      </el-form-item>
      <el-form-item label="岗位顺序" prop="postSort">
        <el-input-number
          v-model="form.postSort"
          controls-position="right"
          :min="0"
        />
      </el-form-item>
      <el-form-item label="岗位状态" prop="status">
        <dict-data
          type="radio"
          code="sys_normal_disable"
          v-model="form.status"
          placeholder="请选择岗位状态"
        />
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="form.remark"
          type="textarea"
          placeholder="请输入内容"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="updateModelValue(false)">取消</el-button>
      <el-button type="primary" :loading="loading" @click="save">
        保存
      </el-button>
    </template>
  </ele-modal>
</template>
<script setup>
  import { ref, reactive, watch } from 'vue';
  import { EleMessage } from '@hnjing/zxzy-admin-plus/es';
  import { useFormData } from '@/utils/use-form-data';
  import { addPost, updatePost } from '@/api/system/post';

  const emit = defineEmits(['done', 'update:modelValue']);

  const props = defineProps({
    // 弹窗是否打开
    modelValue: Boolean,
    data: Object
  });
  // 是否是修改
  const isUpdate = ref(false);
  // 提交状态
  const loading = ref(false);

  // 表单实例
  const formRef = ref(null);

  // 表单数据
  const { form, resetFields, assignFields } = useFormData({
    postName: undefined,
    postCode: undefined,
    postSort: undefined,
    status: '0',
    remark: undefined,
    postId: undefined
  });
  // 表单验证规则
  const rules = reactive({
    postName: [
      { required: true, message: '岗位名称不能为空', trigger: 'blur' }
    ],
    postCode: [
      { required: true, message: '岗位编码不能为空', trigger: 'blur' }
    ],
    postSort: [{ required: true, message: '岗位顺序不能为空', trigger: 'blur' }]
  });
  /* 保存编辑 */
  const save = () => {
    formRef.value?.validate?.((valid) => {
      if (!valid) {
        return;
      }
      loading.value = true;
      const saveOrUpdate = isUpdate.value ? updatePost : addPost;
      saveOrUpdate({
        ...form
      })
        .then(() => {
          loading.value = false;
          EleMessage.success('操作成功！');
          updateModelValue(false);
          emit('done');
        })
        .catch((e) => {
          loading.value = false;
          EleMessage.error(e);
        });
    });
  };

  /* 更新modelValue */
  const updateModelValue = (value) => {
    emit('update:modelValue', value);
  };
  watch(
    () => props.modelValue,
    async (modelValue) => {
      if (modelValue) {
        if (props.data) {
          assignFields(props.data);
          isUpdate.value = true;
        } else {
          isUpdate.value = false;
        }
      } else {
        resetFields();
        formRef.value?.clearValidate?.();
      }
    }
  );
</script>
