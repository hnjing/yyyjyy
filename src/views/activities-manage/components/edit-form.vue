<!-- 添加和修改的表单 -->
<template>
  <!-- :footerStyle="{ justifyContent: 'flex-start' }" -->
  <pro-form
    ref="formRef"
    :model="form"
    :items="items"
    :footer="true"
    :label-width="100"
    :grid="{ span: 24 }"
    @updateValue="setFieldValue"
  >
    <template #SelectUser>
      <SelectUser v-model="form.user" multiple />
    </template>
    <template #footer>
      <el-button @click="onClose">关闭</el-button>
      <el-button type="primary" :loading="loading" @click="save">
        保存
      </el-button>
    </template>
  </pro-form>
</template>

<script lang="ts" setup>
  import ProForm from '@/components/ProForm/index.vue';
  import { ref, reactive, watch } from 'vue';
  // import { useRouter } from 'vue-router';
  import type { FormInstance, FormRules } from 'element-plus';
  import { EleMessage, emailReg, phoneReg } from '@hnjing/zxzy-admin-plus';
  import { useFormData } from '@/utils/use-form-data';
  // import { usePageTab } from '@/utils/use-page-tab';
  import SelectUser from '@/components/SelectUser/index.vue';
  import { addActivity, updateActivity } from '@/api/activity/index.js';

  const props = defineProps<{
    /** 修改回显的数据 */
    editData?: any;
  }>();

  const emit = defineEmits(['close']);

  // const { currentRoute, push } = useRouter();
  // const { removePageTab, reloadPageTab } = usePageTab();

  /** 是否是修改 */
  const isUpdate = ref(false);

  /** 提交状态 */
  const loading = ref(false);

  /** 表单实例 */
  const formRef = ref<FormInstance | null>(null);

  /** 表单数据 */
  const [form, resetFields, assignFields, setFieldValue] = useFormData(
    {
      activityTitle: '',
      user: [],
      dateRange: [],
      type: '',
      activitySco: '',
      date: [],
      image: [],
      remark: ''
    },
    {
      immediate: true
    }
  );

  /** 表单项 */
  const items = ref([
    {
      label: '活动名称',
      prop: 'activityTitle',
      type: 'input',
      required: true
    },
    {
      label: '相关人员',
      prop: 'user',
      type: 'SelectUser', // 自定义组件
      required: true,
      bind: {
        multiple: true
      }
    },
    {
      label: '活动时间',
      prop: 'dateRange',
      type: 'daterange',
      required: true
    },
    {
      label: '活动类型',
      prop: 'type',
      type: 'dictSelect',
      props: { code: 'sys_activity_type' },
      required: true
    },
    {
      label: '活动积分',
      prop: 'activitySco',
      type: 'input',
      required: true
    },
    {
      label: '活动地点',
      prop: 'activityAddress',
      type: 'input'
    },
    {
      label: '活动描述',
      prop: 'activityContent',
      type: 'textarea'
    },
    {
      label: '活动照片',
      prop: 'activityPic',
      type: 'imageUpload',
      props: {
        limit: 5
      }
    },
  ]);

  /** 表单验证规则 */
  const rules = reactive<FormRules>({});

  /** 保存编辑 */
  const save = () => {
    formRef.value?.validate?.((valid) => {
      if (!valid) {
        return;
      }
      loading.value = true;
      debugger;
      const saveOrUpdate = isUpdate.value ? updateActivity : addActivity;
      const sendParams = {
        ...form,
        user: form.user.join(','),
        activityStartTime: form.dateRange[0],
        activityEndTime: form.dateRange[1]
      };
      saveOrUpdate(sendParams)
        .then((msg) => {
          loading.value = false;
          EleMessage.success(msg);
          onClose();
        })
        .catch((e) => {
          loading.value = false;
          EleMessage.error(e.message);
        });
    });
  };

  /** 关闭当前页面并跳转到列表页面 */
  const onClose = () => {
    emit('close');
    // removePageTab({ key: unref(currentRoute).path });
    // push('/list/basic');
  };

  /** 关闭当前页面并刷新列表页面 */
  // const onDone = () => {
  //   emit('close');
  //   // reloadPageTab({ fullPath: '/dashboard/normal-table' });
  // };

  watch(
    () => props.editData,
    () => {
      if (props.editData?.id) {
        assignFields({
          ...props.editData
        });
        isUpdate.value = true;
      } else {
        isUpdate.value = false;
        resetFields();
        setTimeout(() => {
          formRef.value?.clearValidate?.();
        }, 0);
      }
    },
    { immediate: true }
  );
</script>
