<!-- 最新动态 -->
<template>
  <ele-card :header="title" :body-style="{ padding: '6px 0', height: '670px' }">
    <template #extra>
      <more-icon @command="handleCommand" />
    </template>
    <el-scrollbar :view-style="{ padding: '20px 20px 0 20px' }">
      <el-timeline :reverse="false" class="demo-timeline">
        <el-timeline-item
          v-for="item in cardData"
          :key="item.title"
          :timestamp="item.startDate + '~' + item.endDate"
          :type="item.type"
          :hollow="true"
        >
          <div> {{ item.title }}: {{ item.description }} </div>
          <div style="margin-top: 10px">
            <ele-check-card
              :items="checkCardItems(item.images)"
              :row="{ gutter: 8 }"
              :item-style="{
                display: 'flex',
                padding: '6px',
                marginBottom: '8px'
              }"
              style="max-width: 652px"
              @click="openImageViewer(item.images)"
            >
              <template #item="{ item }">
                <img
                  :src="item.url"
                  :style="{
                    objectFit: 'contain',
                    width: '100%',
                    height: '38px',
                    pointerEvents: 'none'
                  }"
                />
              </template>
            </ele-check-card>
          </div>
          <div>
            <el-tag
              v-for="(name, index) in item.names"
              :key="name"
              :type="index < 3 ? 'success' : index < 10 ? 'primary' : ''"
              size="small"
              style="margin-right: 8px"
            >
              {{ name }}
            </el-tag>
          </div>
        </el-timeline-item>
      </el-timeline>
      <EleImageViewer v-model="showImageViewer" :urlList="images" />
    </el-scrollbar>
    <el-button
      class="more-btn"
      @click="handleClickMoreActivities"
      size="large"
      type="primary"
      plain
      >查看更多活动</el-button
    >
  </ele-card>
</template>

<script setup>
  import { ref, reactive } from 'vue';
  import MoreIcon from './more-icon.vue';
  import { useRouter } from 'vue-router';

  const { push } = useRouter();

  defineProps(['title', 'cardData']);

  const emit = defineEmits(['command']);

  /** 是否打开图片预览组件 */
  const showImageViewer = ref(false);

  /** 可选卡片数据 */
  const checkCardItems = (urls) => {
    return urls.map((url, value) => ({
      value,
      url,
      col: { sm: 3, xs: 6 }
    }));
  };

  /** 打开图片预览组件 */
  const images = ref([]);
  const openImageViewer = (img) => {
    showImageViewer.value = true;
    images.value = img;
  };

  const handleCommand = (command) => {
    emit('command', command);
  };

  const handleClickMoreActivities = () => {
    push('/activities-manage');
  };

  // queryActivities();
</script>

<style lang="scss" scoped>
  :deep(.el-scrollbar) {
    height: calc(100% - 50px);
  }
  /* 时间轴 */
  .demo-timeline {
    padding-left: 0;
    height: calc(100% - 50px);

    :deep(.el-timeline-item__wrapper) {
      display: flex;

      .el-timeline-item__timestamp {
        order: 0;
        flex-shrink: 0;
        margin: 0 16px 0 0;
        height: 22px;
        line-height: 22px;
        font-size: 14px;
      }

      .el-timeline-item__content {
        order: 1;
        flex: 1;
      }
    }

    :deep(.el-timeline-item__node) {
      top: 3px;
      --el-color-white: var(--el-bg-color-overlay);
    }

    :deep(.el-timeline-item__tail) {
      top: 3px;
    }
  }
  .more-btn {
    display: block;
    margin: 0 auto 10px auto;
    width: fit-content; /* 让按钮宽度自适应内容 */
  }
</style>
