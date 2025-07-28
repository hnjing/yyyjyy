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
      :label="item.nickName"
      :value="item.userId"
    />
  </el-select>
</template>

<script setup>
  import { ref, defineEmits } from 'vue';
  import { pageUsers } from '@/api/system/user/index';
  import { pinyin } from 'pinyin-pro';
  import { useUserStore } from '@/store/modules/user';

  const userStore = useUserStore();

  const user = defineModel('modelValue', { type: Number });
  const userList = ref([]);
  const emit = defineEmits('setUserList')

  // 获取人员列表
  pageUsers({ page: 1, limit: 1000 }).then((res) => {
    list.value = res.rows;
    userList.value = res.rows;
    userStore.setUserList(res.rows);
    emit('setUserList', res.rows);
  });

  // 自定义过滤方法
  const list = ref([]);
  const filterUser = (query) => {
    if (!query) {
      userList.value = list.value;
      return;
    }
    userList.value = list.value.filter((item) => {
      const nickName = item.nickName;
      const pinyinName = pinyin(nickName, {
        pattern: 'first',
        type: 'array'
      })?.join(''); // 使用 pinyin-pro 转换拼音
      return (
        nickName.includes(query) || // 匹配中文
        pinyinName.includes(query.toLowerCase()) // 匹配拼音
      );
    });
  };
</script>

<style scoped></style>
