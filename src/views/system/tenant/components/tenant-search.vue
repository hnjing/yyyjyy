<template>
  <ele-card :body-style="{ paddingBottom: '2px' }">
    <el-form label-width="98px" @keyup.enter="handleQuery" @submit.prevent="">
      <el-row :gutter="8">
        <el-col :lg="6" :md="12" :sm="12" :xs="24">
          <el-form-item label="租户编号">
            <el-input
              clearable
              v-model.trim="form.tenantId"
              placeholder="请输入"
            />
          </el-form-item>
        </el-col>
        <el-col :lg="6" :md="12" :sm="12" :xs="24">
          <el-form-item label="联系人">
            <el-input
              clearable
              v-model.trim="form.contactUserName"
              placeholder="请输入"
            />
          </el-form-item>
        </el-col>
        <el-col :lg="6" :md="12" :sm="12" :xs="24">
          <el-form-item label="联系电话">
            <el-input
              clearable
              v-model.trim="form.contactPhone"
              placeholder="请输入"
            />
          </el-form-item>
        </el-col>
        <el-col :lg="6" :md="12" :sm="12" :xs="24">
          <el-form-item label="企业名称">
            <el-input
              clearable
              v-model.trim="form.companyName"
              placeholder="请输入"
            />
          </el-form-item>
        </el-col>
        <el-col :lg="6" :md="12" :sm="12" :xs="24">
          <el-form-item label="状态">
            <dict-data
              code="sys_normal_disable"
              v-model="form.status"
              placeholder="请选择"
            />
          </el-form-item>
        </el-col>
        <el-col :lg="6" :md="12" :sm="12" :xs="24">
          <el-form-item label-width="16px">
            <el-button type="primary" @click="handleQuery">查询</el-button>
            <el-button @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </ele-card>
</template>

<script setup>
  import { ref } from 'vue';
  import { useFormData } from '@/utils/use-form-data';
  import { useDictData } from '@/utils/use-dict-data';

  defineOptions({ name: 'TenantSearch' });

  // 定义事件
  const emit = defineEmits(['search']);

  // 字典数据
  const [sys_normal_disable] = useDictData(['sys_normal_disable']);

  /** 表单数据 */
  const [form, resetFields] = useFormData({
    tenantId: '',
    contactUserName: '',
    contactPhone: '',
    companyName: '',
    status: ''
  });

  /** 搜索按钮操作 */
  const handleQuery = () => {
    emit('search', { ...form });
  };

  /** 重置按钮操作 */
  const resetQuery = () => {
    resetFields();
    handleQuery();
  };
</script>
