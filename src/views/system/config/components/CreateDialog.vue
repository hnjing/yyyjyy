<template>
  <ele-modal
    form
    maxable
    :width="600"
    :model-value="modelValue"
    :title="isUpdate ? '修改参数' : '新增参数'"
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
      <el-form-item label="参数名称" prop="configName">
        <el-input v-model="form.configName" placeholder="请输入参数名称" />
      </el-form-item>
      <el-form-item label="参数键名" prop="configKey">
        <el-input v-model="form.configKey" placeholder="请输入参数键名" />
      </el-form-item>
      <el-form-item label="参数键值" prop="configValue">
        <el-input v-model="form.configValue" placeholder="请输入参数键值" />
      </el-form-item>
      <el-form-item label="系统内置" prop="configType">
        <dict-data
          type="radio"
          code="sys_yes_no"
          v-model="form.configType"
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
  import { addConfig, updateConfig } from '@/api/system/config';

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
    configName: undefined,
    configKey: undefined,
    configValue: undefined,
    configType: undefined,
    remark: undefined,
    configId: undefined
  });
  // 表单验证规则
  const rules = reactive({
    configName: [
      { required: true, message: '参数名称不能为空', trigger: 'blur' }
    ],
    configKey: [
      { required: true, message: '参数键名不能为空', trigger: 'blur' }
    ],
    configValue: [
      { required: true, message: '参数键值不能为空', trigger: 'blur' }
    ]
  });
  /* 保存编辑 */
  const save = () => {
    formRef.value?.validate?.((valid) => {
      if (!valid) {
        return;
      }
      loading.value = true;
      const saveOrUpdate = isUpdate.value ? updateConfig : addConfig;
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
