<template>
  <ele-modal
    form
    maxable
    :width="700"
    :model-value="modelValue"
    :title="isUpdate ? '修改公告' : '新增公告'"
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
      <el-form-item label="公告标题" prop="noticeTitle">
        <el-input v-model="form.noticeTitle" placeholder="请输入公告标题" />
      </el-form-item>
      <el-form-item label="公告类型" prop="noticeType">
        <dict-data
          code="sys_notice_type"
          v-model="form.noticeType"
          placeholder="请选择公告类型"
        />
      </el-form-item>
      <el-form-item label="状态">
        <dict-data
          type="radio"
          code="sys_notice_status"
          v-model="form.status"
          placeholder="请选择"
        />
      </el-form-item>
      <el-form-item label="内容">
        <el-input
          v-model="form.noticeContent"
          type="textarea"
          placeholder="请输入内容"
          :rows="8"
        />
        <!-- 编辑器 -->
        <!-- <tinymce-editor
          ref="editorRef"
          :init="config"
          v-model="form.noticeContent"
        /> -->
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
  // import TinymceEditor from '@/components/TinymceEditor/index.vue';
  import { useFormData } from '@/utils/use-form-data';
  import { addNotice, updateNotice } from '@/api/system/notice';

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
    noticeTitle: undefined,
    noticeType: undefined,
    status: '0',
    noticeContent: undefined,
    noticeId: undefined
  });
  // 表单验证规则
  const rules = reactive({
    noticeTitle: [
      { required: true, message: '公告标题不能为空', trigger: 'blur' }
    ],
    noticeType: [
      { required: true, message: '公告类型不能为空', trigger: 'blur' }
    ]
  });
  //
  // const editorRef = ref(null);
  // 编辑器配置
  // const config = ref({
  //   height: 520,
  //   // 自定义文件上传(这里使用把选择的文件转成blob演示)
  //   file_picker_callback: (callback, _value, meta) => {
  //     const input = document.createElement('input');
  //     input.setAttribute('type', 'file');
  //     // 设定文件可选类型
  //     if (meta.filetype === 'image') {
  //       input.setAttribute('accept', 'image/*');
  //     } else if (meta.filetype === 'media') {
  //       input.setAttribute('accept', 'video/*');
  //     }
  //     input.onchange = () => {
  //       const file = input.files?.[0];
  //       if (!file) {
  //         return;
  //       }
  //       if (meta.filetype === 'media') {
  //         if (!file.type.startsWith('video/')) {
  //           editorRef.value?.alert?.({ content: '只能选择视频文件' });
  //           return;
  //         }
  //       }
  //       if (file.size / 1024 / 1024 > 20) {
  //         editorRef.value?.alert?.({ content: '大小不能超过 20MB' });
  //         return;
  //       }
  //       // 实际项目这里应该上传到后端得到文件url而不是转成blob
  //       const reader = new FileReader();
  //       reader.onload = (e) => {
  //         if (e.target?.result != null) {
  //           const blob = new Blob([e.target.result], { type: file.type });
  //           callback(URL.createObjectURL(blob));
  //         }
  //       };
  //       reader.readAsArrayBuffer(file);
  //     };
  //     input.click();
  //   }
  // });
  /* 保存编辑 */
  const save = () => {
    formRef.value?.validate?.((valid) => {
      if (!valid) {
        return;
      }
      loading.value = true;
      const saveOrUpdate = isUpdate.value ? updateNotice : addNotice;
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
