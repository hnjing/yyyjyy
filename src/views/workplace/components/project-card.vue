<!-- 项目进度 -->
<template>
  <ele-card :header="title" :body-style="{ padding: '10px', height: 'auto' }">
    <template #extra>
      <more-icon @command="handleCommand" />
    </template>
    <el-row :gutter="16">
      <el-col
        v-for="item in cardData"
        :key="item.id"
        :lg="6"
        :md="12"
        :sm="12"
        :xs="24"
      >
        <ele-card
          shadow="hover"
          bordered="true"
          :body-style="{ padding: 0 }"
          style="margin-top: 16px; overflow: hidden; cursor: pointer"
        >
          <img :src="item.cover" style="width: 100%" />
          <div style="padding: 14px 24px 24px 24px">
            <ele-text size="md" style="max-height: 100%">
              {{ item.title }}
            </ele-text>
            <ele-ellipsis
              :max-line="2"
              type="placeholder"
              style="margin: 8px 0 16px 0; max-height: 100%"
            >
              {{ item.typeName }}
            </ele-ellipsis>
            <div style="display: flex; align-items: center">
              <ele-text type="placeholder" style="flex: 1">
                {{ item.gainTime }}
              </ele-text>
              <ele-text type="placeholder">{{ item.name }}</ele-text>
            </div>
          </div>
        </ele-card>
      </el-col>
    </el-row>
    <el-button
      class="more-btn"
      @click="handleClickMoreCert"
      size="large"
      type="primary"
      plain
      >查看更多证书</el-button
    >
  </ele-card>
</template>

<script setup>
  import { ref } from 'vue';
  import MoreIcon from './more-icon.vue';
  import { useRouter } from 'vue-router';

  const { push } = useRouter();

  defineProps({
    title: String,
    cardData: Array
  });

  // 点击更多证书
  const handleClickMoreCert = () => {
    push('/cert-manage');
  };

  /** 项目进度数据 */
  const projectList = ref([]);

  /** 查询项目进度 */
  const queryProjectList = () => {
    projectList.value = [
      {
        id: 1,
        title: '218抗洪特大救援荣誉证书',
        cover:
          'https://cdn.eleadmin.com/20200610/RZ8FQmZfHkcffMlTBCJllBFjEhEsObVo.jpg',
        typeName: '荣誉证书',
        gainTime: '2023-03-01',
        name: '张三'
      },
      {
        id: 2,
        title: '314打捞抢险荣誉证书',
        cover:
          'https://cdn.eleadmin.com/20200610/WLXm7gp1EbLDtvVQgkeQeyq5OtDm00Jd.jpg',
        typeName: '荣誉证书',
        gainTime: '2024-08-01',
        name: '李四'
      },
      {
        id: 3,
        title: '项目000000003',
        cover:
          'https://cdn.eleadmin.com/20200610/ttkIjNPlVDuv4lUTvRX8GIlM2QqSe0jg.jpg',
        typeName: '技能证书',
        gainTime: '2025-01-01',
        name: '王五'
      },
      {
        id: 4,
        title: '项目000000004',
        cover:
          'https://cdn.eleadmin.com/20200610/fAenQ8nvRjL7x0i0jEfuDBZHvJfHf3v6.jpg',
        typeName: '技能证书',
        gainTime: '2026-06-01',
        name: '赵六'
      }
    ];
  };

  const handleCommand = (command) => {
    emit('command', command);
  };

  queryProjectList();
</script>

<style lang="scss" scoped>
  .project-table :deep(.el-progress__text) {
    font-size: 12px !important;
  }
  .more-btn {
    display: block;
    margin: 0 auto 10px auto;
    width: fit-content; /* 让按钮宽度自适应内容 */
  }
</style>
