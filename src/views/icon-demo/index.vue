<template>
  <ele-page class="icon-gallery">
    <ele-card
      header="图标库 (ZxzyAdminPlus:菜单使用时IconPro前缀)"
      :body-style="{ display: 'flex', flexWrap: 'wrap', gap: '20px' }"
    >
      <div
        v-for="(icon, key) in icons"
        :key="key"
        class="icon-item"
        @click="copyKey(key)"
      >
        <component :is="icon" class="icon" />
        <div class="icon-name">{{ key }}</div>
      </div>
    </ele-card>
  </ele-page>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import * as icons from '@hnjing/zxzy-admin-plus/es/icons/index';
  import { ElMessage } from 'element-plus';

  // 将导入的图标组件转换为对象
  const iconComponents = ref<{ [key: string]: any }>({});

  for (const key in icons) {
    if (icons[key] && icons[key].default) {
      iconComponents.value[key] = icons[key].default;
    }
  }

  // 复制 key 到剪贴板
  const copyKey = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      ElMessage.success(`已复制【${key}】到粘贴板`);
    } catch (err) {
      ElMessage.error('复制失败，请手动复制！');
    }
  };
</script>

<style lang="scss" scoped>
  .icon-gallery {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 20px;
  }

  .icon-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    width: 100px;
    padding: 10px;
    border: 1px solid #ebeef5;
    border-radius: 4px;
    transition:
      box-shadow 0.3s,
      transform 0.3s;
    cursor: pointer;

    &:hover {
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
      transform: translateY(-4px);
    }
  }

  .icon {
    width: 48px;
    height: 48px;
    margin-bottom: 10px;
  }

  .icon-name {
    font-size: 14px;
    color: #333;
  }
</style>
