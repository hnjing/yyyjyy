<template>
  <el-dialog
    v-model="visible"
    :title="data ? '修改客户端' : '新增客户端'"
    width="680px"
    append-to-body
    destroy-on-close
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="180px">
      <el-form-item label="客户端名称" prop="clientName">
        <el-input v-model="form.clientName" placeholder="请输入客户端名称" />
      </el-form-item>
      <el-form-item label="客户端key" prop="clientKey">
        <el-input
          v-model="form.clientKey"
          :disabled="form.id != null"
          placeholder="请输入客户端key"
        />
      </el-form-item>
      <el-form-item label="客户端秘钥" prop="clientSecret">
        <el-input
          v-model="form.clientSecret"
          :disabled="form.id != null"
          placeholder="请输入客户端秘钥"
        />
      </el-form-item>
      <el-form-item label="授权类型" prop="grantTypeList">
        <dict-data
          code="sys_grant_type"
          multiple
          v-model="form.grantTypeList"
          placeholder="请选择授权类型"
        />
      </el-form-item>
      <el-form-item label="设备类型" prop="deviceType">
        <dict-data
          code="sys_device_type"
          v-model="form.deviceType"
          placeholder="请选择设备类型"
        />
      </el-form-item>
      <el-form-item prop="redirectUri">
        <template #label>
          <span>
            <el-tooltip
              content="主应用登录后，子应用的重定向地址"
              placement="top"
            >
              <el-icon>
                <QuestionCircleOutlined style="opacity: 0.6" />
              </el-icon>
            </el-tooltip>
            客户端路径
          </span>
        </template>
        <el-input
          v-model="form.redirectUri"
          placeholder="请输入子应用重定向地址"
        />
      </el-form-item>
      <el-form-item prop="activeTimeout">
        <template #label>
          <span>
            <el-tooltip
              content="指定时间无操作则过期（单位：秒），默认30分钟（1800秒）"
              placement="top"
            >
              <el-icon>
                <QuestionCircleOutlined style="opacity: 0.6" />
              </el-icon>
            </el-tooltip>
            Token活跃超时时间
          </span>
        </template>
        <el-input
          v-model="form.activeTimeout"
          placeholder="请输入Token活跃超时时间"
        />
      </el-form-item>
      <el-form-item prop="timeout">
        <template #label>
          <span>
            <el-tooltip
              content="指定时间必定过期（单位：秒），默认七天（604800秒）"
              placement="top"
            >
              <el-icon>
                <QuestionCircleOutlined style="opacity: 0.6" />
              </el-icon>
            </el-tooltip>
            Token固定超时时间
          </span>
        </template>
        <el-input
          v-model="form.timeout"
          placeholder="请输入Token固定超时时间"
        />
      </el-form-item>
      <el-form-item label="状态">
        <dict-data
          code="sys_normal_disable"
          type="radio"
          v-model="form.status"
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
  import { ref, reactive, watch } from 'vue';
  import { EleMessage } from '@hnjing/zxzy-admin-plus/es';
  import { QuestionCircleOutlined } from '@/components/icons';
  import { getClient, addClient, updateClient } from '@/api/system/client';

  defineOptions({ name: 'ClientEdit' });

  const visible = defineModel();

  const props = defineProps({
    data: Object
  });

  const emit = defineEmits(['done']);

  // 表单ref
  const formRef = ref();

  // 加载状态
  const loading = ref(false);

  // 表单数据
  const form = reactive({
    clientName: undefined,
    id: undefined,
    clientId: undefined,
    clientKey: undefined,
    clientSecret: undefined,
    grantTypeList: undefined,
    deviceType: undefined,
    activeTimeout: undefined,
    timeout: undefined,
    status: '0',
    redirectUri: undefined
  });

  // 表单校验规则
  const rules = {
    clientName: [
      { required: true, message: '客户端名称y不能为空', trigger: 'blur' }
    ],
    clientKey: [
      { required: true, message: '客户端key不能为空', trigger: 'blur' }
    ],
    clientSecret: [
      { required: true, message: '客户端秘钥不能为空', trigger: 'blur' }
    ],
    grantTypeList: [
      { required: true, message: '授权类型不能为空', trigger: 'change' }
    ],
    deviceType: [
      { required: true, message: '设备类型不能为空', trigger: 'change' }
    ]
  };

  // 表单重置
  const resetForm = () => {
    Object.keys(form).forEach((key) => {
      form[key] = undefined;
    });
    form.status = '0';
    formRef.value?.resetFields();
  };

  // 监听数据变化
  watch(
    () => props.data,
    (val) => {
      resetForm();
      if (val) {
        loading.value = true;
        getClient(val.id)
          .then((res) => {
            Object.assign(form, res.data);
          })
          .catch((e) => {
            EleMessage.error(e.message);
          })
          .finally(() => {
            loading.value = false;
          });
      }
    },
    { immediate: true }
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
        if (props.data) {
          await updateClient(form);
        } else {
          await addClient(form);
        }
        EleMessage.success('操作成功');
        visible.value = false;
        emit('done');
      } catch (error) {
        EleMessage.error(error.message);
      } finally {
        loading.value = false;
      }
    });
  };
</script>
