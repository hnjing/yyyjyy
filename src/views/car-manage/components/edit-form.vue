<!-- 添加和修改的表单 -->
<template>
  <!-- :footerStyle="{ justifyContent: 'flex-start' }" -->
  <pro-form
    ref="formRef"
    :model="form"
    :rules="rules"
    :items="items"
    :footer="true"
    :label-width="100"
    :grid="{ span: 24 }"
    @updateValue="setFieldValue"
  >
    <template #SelectUser>
      <SelectUser v-model="form.users" />
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
  import { addCar, updateCar } from '@/api/car';
  import { useUserStore } from '@/store/modules/user';

  const userStore = useUserStore();

  const reloadTable = inject<(where?: any) => void>('reloadTable');

  const props = defineProps<{
    /** 修改回显的数据 */
    data?: any;
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
  const [form, resetFields, assignFields, setFieldValue] = useFormData({
    id: '',
    aidCarNo: '',
    carNo: '',
    users: '',
    carType: '',
    mobile: '',
    carPic: '',
    bindTime: '',
    remark1: ''
  });

  /** 表单项 */
  const items = ref([
    {
      label: '救援车牌号',
      prop: 'aidCarNo',
      type: 'input',
      required: true
    },
    {
      label: '车牌号',
      prop: 'carNo',
      type: 'input',
      required: true
    },
    {
      label: '使用人',
      prop: 'users',
      type: 'SelectUser', // 自定义组件
      required: true
    },
    {
      label: '车辆类型',
      prop: 'carType',
      type: 'dictSelect',
      props: { code: 'sys_car_type' },
      required: true
    },
    {
      label: '联系电话',
      prop: 'mobile',
      type: 'input'
    },
    {
      label: '车辆照片',
      prop: 'carPic',
      type: 'imageUpload',
      props: {
        limit: 1
      },
      required: true
    },
    {
      label: '绑定时间',
      prop: 'bindTime',
      type: 'date',
      required: true
    },
    {
      label: '备注',
      prop: 'remark1',
      type: 'textarea'
    }
  ]);


  /** 保存编辑 */
  const save = () => {
    formRef.value?.validate?.((valid) => {
      if (!valid) {
        return;
      }
      loading.value = true;
      const saveOrUpdate = isUpdate.value ? updateCar : addCar;
      saveOrUpdate({...form, remark2: userStore.userList.filter(i=>form.users == i.userId).map(i=>i.nickName).join(',')})
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
          users: Number(props.data.users)
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
