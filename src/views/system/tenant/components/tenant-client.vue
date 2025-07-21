<template>
  <el-dialog
    v-model="visible"
    title="关联客户端"
    width="500px"
    append-to-body
    destroy-on-close
  >
    <el-form ref="formRef" :model="form" label-width="80px">
      <el-form-item label="客户端" prop="clientId">
        <el-select
          v-model="form.clientId"
          placeholder="请选择客户端"
          multiple
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="item in clientList"
            :key="item.clientId"
            :label="item.clientName"
            :value="item.clientId"
          />
        </el-select>
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
  import { ref, reactive, watch } from 'vue';
  import {
    listClientAll,
    getTenantLinkList,
    updateClientAndTenant
  } from '@/api/system/tenant';
  import { EleMessage } from '@hnjing/zxzy-admin-plus/es';

  defineOptions({ name: 'TenantClient' });

  const props = defineProps({
    tenantId: [String, Number]
  });

  const emit = defineEmits(['done']);

  const visible = defineModel();

  // 表单ref
  const formRef = ref();

  // 加载状态
  const loading = ref(false);

  // 客户端列表
  const clientList = ref([]);

  // 表单数据
  const form = reactive({
    tenantId: undefined,
    clientId: []
  });

  // 获取客户端列表
  const getClientList = async () => {
    const res = await listClientAll();
    clientList.value = res.data;
  };

  // 获取租户关联的客户端列表
  const getTenantClients = async (tenantId) => {
    const res = await getTenantLinkList(tenantId);
    if (res) {
      form.clientId = res.map((i) => i.clientId);
    }
  };

  // 监听数据变化
  watch(
    () => props.tenantId,
    async (val) => {
      if (val) {
        loading.value = true;
        try {
          form.tenantId = val;
          await getClientList();
          await getTenantClients(val);
        } catch (e) {
          console.error(e.message);
        } finally {
          loading.value = false;
        }
      }
    },
    { immediate: true }
  );

  // 表单重置
  const resetForm = () => {
    form.tenantId = undefined;
    form.clientId = [];
    formRef.value?.resetFields();
  };

  // 取消
  const cancel = () => {
    visible.value = false;
    resetForm();
  };

  // 提交
  const submit = async () => {
    loading.value = true;
    try {
      await updateClientAndTenant({
        tenantId: form.tenantId,
        clientIdList: form.clientId
      });
      EleMessage.success('关联成功');
      visible.value = false;
      emit('done');
    } catch (error) {
      console.error(error.message);
    } finally {
      loading.value = false;
    }
  };
</script>
