<template>
  <ele-modal
    form
    maxable
    :width="600"
    :model-value="modelValue"
    :title="isUpdate ? '修改字典类型' : '新增字典类型'"
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
      <el-form-item label="字典类型">
        <el-input v-model="form.dictType" :disabled="true" />
      </el-form-item>
      <el-form-item label="数据标签" prop="dictLabel">
        <el-input v-model="form.dictLabel" placeholder="请输入数据标签" />
      </el-form-item>
      <el-form-item label="数据键值" prop="dictValue">
        <el-input v-model="form.dictValue" placeholder="请输入数据键值" />
      </el-form-item>
      <el-form-item label="样式属性" prop="cssClass">
        <el-input v-model="form.cssClass" placeholder="请输入样式属性" />
      </el-form-item>
      <el-form-item label="显示排序" prop="dictSort">
        <el-input-number
          v-model="form.dictSort"
          controls-position="right"
          :min="0"
        />
      </el-form-item>
      <el-form-item label="回显样式" prop="listClass">
        <el-select v-model="form.listClass">
          <el-option
            v-for="item in listClassOptions"
            :key="item.value"
            :label="item.label + '(' + item.value + ')'"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <dict-data
          type="radio"
          code="sys_normal_disable"
          v-model="form.status"
          placeholder="请选择"
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
  const emit = defineEmits(['done', 'update:modelValue']);
  import { addData, updateData } from '@/api/system/dict/data';

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
  // 数据标签回显样式
  const listClassOptions = ref([
    {
      value: 'default',
      label: '默认'
    },
    {
      value: 'primary',
      label: '主要'
    },
    {
      value: 'success',
      label: '成功'
    },
    {
      value: 'info',
      label: '信息'
    },
    {
      value: 'warning',
      label: '警告'
    },
    {
      value: 'danger',
      label: '危险'
    }
  ]);
  // 表单数据
  const { form, resetFields, assignFields } = useFormData({
    dictType: undefined,
    dictLabel: undefined,
    dictValue: undefined,
    cssClass: undefined,
    status: undefined,
    remark: undefined,
    dictId: undefined,
    dictSort: undefined,
    listClass: undefined,
    dictCode: undefined
  });
  // 表单验证规则
  const rules = reactive({
    dictLabel: [
      { required: true, message: '数据标签不能为空', trigger: 'blur' }
    ],
    dictValue: [
      { required: true, message: '数据键值不能为空', trigger: 'blur' }
    ],
    dictSort: [{ required: true, message: '数据顺序不能为空', trigger: 'blur' }]
  });
  /* 保存编辑 */
  const save = () => {
    formRef.value?.validate?.((valid) => {
      if (!valid) {
        return;
      }
      loading.value = true;
      const saveOrUpdate = isUpdate.value ? updateData : addData;
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
        assignFields(props.data);
        if (props.data && props.data.dictCode) {
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
