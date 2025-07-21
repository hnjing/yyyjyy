<template>
  <el-select
    class="monitor-select-user"
    v-model="user"
    v-bind="$attrs"
    filterable
    clearable
    placeholder="请选择人员"
    :filter-method="filterUser"
  >
    <el-option
      v-for="item in userList"
      :key="item.userId"
      :label="item.userName"
      :value="item.userId"
    />
  </el-select>
</template>

<script setup>
  import { ref } from 'vue';
  import { pageUsers } from '@/api/system/user/index';
  import { pinyin } from 'pinyin-pro';

  const user = defineModel('modelValue', { type: Number });
  const userList = ref([]);

  // 获取人员列表
  pageUsers({ page: 1, limit: 1000 }).then((res) => {
    list.value = res.rows;
    userList.value = res.rows;
  });

  // 自定义过滤方法
  const list = ref([]);
  const filterUser = (query) => {
    if (!query) {
      userList.value = list.value;
      return;
    }
    userList.value = list.value.filter((item) => {
      const userName = item.userName;
      const pinyinName = pinyin(userName, {
        pattern: 'first',
        type: 'array'
      })?.join(''); // 使用 pinyin-pro 转换拼音
      return (
        userName.includes(query) || // 匹配中文
        pinyinName.includes(query.toLowerCase()) // 匹配拼音
      );
    });
  };
</script>

<style scoped></style>
