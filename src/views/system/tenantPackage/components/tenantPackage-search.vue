<template>
  <ele-card :body-style="{ paddingBottom: '2px' }">
    <el-form label-width="98px" @keyup.enter="search" @submit.prevent="">
      <el-row :gutter="8">
        <el-col :lg="6" :md="12" :sm="12" :xs="24">
          <el-form-item label="套餐名称">
            <el-input
              clearable
              v-model.trim="form.packageName"
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
              clearable
            />
          </el-form-item>
        </el-col>
        <el-col :lg="6" :md="12" :sm="12" :xs="24">
          <el-form-item label-width="16px">
            <el-button type="primary" @click="search">查询</el-button>
            <el-button @click="reset">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </ele-card>
</template>

<script setup>
  import { useFormData } from '@/utils/use-form-data';

  defineOptions({ name: 'TenantPackageSearch' });

  const emit = defineEmits(['search']);

  // 表单数据
  const [form, resetFields] = useFormData({
    packageName: '',
    status: undefined
  });

  // 搜索
  const search = () => {
    emit('search', { ...form });
  };

  // 重置
  const reset = () => {
    resetFields();
    search();
  };
</script>

<style scoped>
  .search-wrapper :deep(.ele-card-body) {
    padding-bottom: 0;
  }
</style>
