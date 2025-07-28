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
      <SelectUser v-model="form.certificateUser" />
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
  import { ref, reactive, watch, inject } from 'vue';
  // import { useRouter } from 'vue-router';
  import type { FormInstance, FormRules } from 'element-plus';
  import { EleMessage, emailReg, phoneReg } from '@hnjing/zxzy-admin-plus';
  import { useFormData } from '@/utils/use-form-data';
  // import { usePageTab } from '@/utils/use-page-tab';
  import SelectUser from '@/components/SelectUser/index.vue';
  import { addCertificate, updateCertificate } from '@/api/certificate';
  import { useUserStore } from '@/store/modules/user';

  const userStore = useUserStore();

  const props = defineProps<{
    /** 修改回显的数据 */
    data?: any;
  }>();

  const reloadTable = inject<(where?: any) => void>('reloadTable');

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
  const [form, resetFields, assignFields, setFieldValue] = useFormData({
      id: '',
      certificate: '',
      certificateNo: '',
      certificateUser: '',
      certificateType: '',
      certificateTime: '',
      certificateDetail: '',
      certificatePic: ''
    },
    {
      immediate: true
    }
  );


  /** 表单项 */
  const items = ref([
    {
      label: '证书名称',
      prop: 'certificate',
      type: 'input',
      required: true
    },
    {
      label: '证书编号',
      prop: 'certificateNo',
      type: 'input'
    },
    {
      label: '获证人员',
      prop: 'certificateUser',
      type: 'SelectUser', // 自定义组件
      required: true,
      bind: {
        multiple: true
      }
    },
    {
      label: '证书类型',
      prop: 'certificateType',
      type: 'dictSelect',
      props: { code: 'sys_certificate_type' },
      required: true
    },
    {
      label: '获证日期',
      prop: 'certificateTime',
      type: 'date',
      required: true
    },
    {
      label: '证书描述',
      prop: 'certificateDetail',
      type: 'textarea'
    },
    {
      label: '证书照片',
      prop: 'certificatePic',
      type: 'imageUpload',
      props: {
        limit: 5
      },
      required: true
    }
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
      const saveOrUpdate = isUpdate.value ? updateCertificate : addCertificate;
      const params = {
        ...form,
        remark1: userStore.userList.filter(i=>form.certificateUser == i.userId).map(i=>i.nickName).join(',')
      }
      saveOrUpdate(params)
        .then((msg) => {
          loading.value = false;
          EleMessage.success(msg);
          reloadTable?.();
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
    () => props.data,
    () => {
      if (props.data) {
        assignFields({
          ...props.data,
          certificateUser: Number(props.data.certificateUser)
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
