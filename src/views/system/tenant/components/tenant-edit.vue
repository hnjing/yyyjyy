<template>
  <el-dialog
    v-model="visible"
    :title="data ? '修改租户' : '新增租户'"
    width="780px"
    append-to-body
    destroy-on-close
  >
    <el-form
      ref="formRef"
      :model="form"
      :rules="rules"
      label-width="100px"
      @submit.prevent=""
    >
      <el-row :gutter="16">
        <el-col :sm="12" :xs="24">
          <el-form-item label="企业名称" prop="companyName">
            <el-input v-model="form.companyName" placeholder="请输入企业名称" />
          </el-form-item>
          <el-form-item label="联系人" prop="contactUserName">
            <el-input
              v-model="form.contactUserName"
              placeholder="请输入联系人"
            />
          </el-form-item>
          <el-form-item label="联系电话" prop="contactPhone">
            <el-input
              v-model="form.contactPhone"
              placeholder="请输入联系电话"
            />
          </el-form-item>
          <template v-if="!form.id">
            <el-form-item label="用户名" prop="username">
              <el-input
                v-model="form.username"
                placeholder="请输入系统用户名"
                maxlength="30"
              />
            </el-form-item>
            <el-form-item label="用户密码" prop="password">
              <el-input
                v-model="form.password"
                type="password"
                placeholder="请输入系统用户密码"
                maxlength="20"
              />
            </el-form-item>
          </template>
          <el-form-item label="过期时间" prop="expireTime">
            <el-date-picker
              v-model="form.expireTime"
              clearable
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择过期时间"
            />
          </el-form-item>
          <el-form-item label="经度" prop="longitude">
            <el-input v-model="form.longitude" placeholder="请输入经度" />
          </el-form-item>
          <el-form-item label="纬度" prop="latitude">
            <el-input v-model="form.latitude" placeholder="请输入纬度" />
          </el-form-item>
        </el-col>
        <el-col :sm="12" :xs="24">
          <el-form-item label="租户套餐" prop="packageId">
            <el-select
              v-model="form.packageId"
              :disabled="!!form.tenantId"
              placeholder="请选择租户套餐"
              clearable
              style="width: 100%"
            >
              <el-option
                v-for="item in packageList"
                :key="item.packageId"
                :label="item.packageName"
                :value="item.packageId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="用户数量" prop="accountCount">
            <el-input
              v-model="form.accountCount"
              placeholder="请输入用户数量"
            />
          </el-form-item>
          <el-form-item label="绑定域名" prop="domain">
            <el-input v-model="form.domain" placeholder="请输入绑定域名" />
          </el-form-item>
          <el-form-item label="企业地址" prop="address">
            <el-input v-model="form.address" placeholder="请输入企业地址" />
          </el-form-item>
          <el-form-item label="企业代码" prop="licenseNumber">
            <el-input
              v-model="form.licenseNumber"
              placeholder="请输入统一社会信用代码"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="form.status">
              <el-radio value="0">正常</el-radio>
              <el-radio value="1">停用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="企业简介" prop="intro">
        <el-input
          v-model="form.intro"
          type="textarea"
          :rows="3"
          placeholder="请输入企业简介"
        />
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
  import { ref, reactive, watch } from 'vue';
  import { getTenant, addTenant, updateTenant } from '@/api/system/tenant';
  import { selectTenantPackage } from '@/api/system/tenantPackage';
  import { EleMessage } from '@hnjing/zxzy-admin-plus/es';

  defineOptions({ name: 'TenantEdit' });

  const props = defineProps({
    data: Object
  });

  const emit = defineEmits(['done']);

  const visible = defineModel();

  // 表单ref
  const formRef = ref();

  // 加载状态
  const loading = ref(false);

  // 租户套餐列表
  const packageList = ref([]);

  // 表单数据
  const form = reactive({
    id: undefined,
    tenantId: undefined,
    contactUserName: '',
    contactPhone: '',
    username: '',
    password: '',
    longitude: '',
    latitude: '',
    companyName: '',
    licenseNumber: '',
    domain: '',
    address: '',
    intro: '',
    remark: '',
    packageId: '',
    expireTime: '',
    accountCount: 0,
    status: '0'
  });

  // 表单校验规则
  const rules = {
    contactUserName: [
      { required: true, message: '联系人不能为空', trigger: 'blur' }
    ],
    contactPhone: [
      { required: true, message: '联系电话不能为空', trigger: 'blur' }
    ],
    companyName: [
      { required: true, message: '企业名称不能为空', trigger: 'blur' }
    ],
    longitude: [{ required: true, message: '经度不能为空', trigger: 'blur' }],
    latitude: [{ required: true, message: '纬度不能为空', trigger: 'blur' }],
    packageId: [
      { required: true, message: '租户套餐不能为空', trigger: 'blur' }
    ],
    username: [
      { required: true, message: '用户名不能为空', trigger: 'blur' },
      {
        min: 2,
        max: 20,
        message: '用户名称长度必须介于 2 和 20 之间',
        trigger: 'blur'
      }
    ],
    password: [
      { required: true, message: '密码不能为空', trigger: 'blur' },
      {
        min: 5,
        max: 20,
        message: '用户密码长度必须介于 5 和 20 之间',
        trigger: 'blur'
      }
    ]
  };

  // 获取租户套餐
  const getTenantPackage = async () => {
    const res = await selectTenantPackage();
    packageList.value = res.data;
  };

  // 表单重置
  const resetForm = () => {
    Object.assign(form, {
      id: undefined,
      tenantId: undefined,
      contactUserName: '',
      contactPhone: '',
      username: '',
      password: '',
      longitude: '',
      latitude: '',
      companyName: '',
      licenseNumber: '',
      domain: '',
      address: '',
      intro: '',
      remark: '',
      packageId: '',
      expireTime: '',
      accountCount: 0,
      status: '0'
    });
    formRef.value?.resetFields();
  };

  // 监听数据变化
  watch(
    () => props.data,
    async (val) => {
      resetForm();
      await getTenantPackage();
      if (val) {
        loading.value = true;
        try {
          const res = await getTenant(val.id);
          Object.assign(form, res.data);
        } catch (e) {
          console.error(e.message);
        } finally {
          loading.value = false;
        }
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
          await updateTenant(form);
        } else {
          await addTenant(form);
        }
        EleMessage.success('操作成功');
        visible.value = false;
        emit('done');
      } catch (error) {
        EleMessage.error(error.message);
        console.error(error.message);
      } finally {
        loading.value = false;
      }
    });
  };
</script>
