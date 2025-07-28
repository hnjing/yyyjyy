<!-- 用户编辑弹窗 -->
<template>
  <ele-modal
    form
    destroy-on-close
    :width="680"
    v-model="visible"
    :title="`二维码生成-${props.data?.nickName}`"
  >
    <div style="text-align: center; margin: 40px 0">
      <ele-qr-code
        :value="text"
        :size="240"
        level="L"
        :margin="0"
        :image-settings="image"
        :tag="tag"
      />
      <div>{{ text }}</div>
    </div>
    <template #footer>
      <el-button type="primary" @click="handleCancel">完成</el-button>
    </template>
  </ele-modal>
</template>

<script setup>
  import { ref, reactive, watch } from 'vue';

  const IMAGE_SRC =
    'http://43.136.68.215:8081/profile/upload/2025/07/28/logo-yian11_20250728113350A012.png';
  const text = ref(`${location.origin}/extension/qr-code`);
  const image = reactive({
    src: IMAGE_SRC,
    width: 58,
    height: 58,
    x: void 0,
    y: void 0,
    excavate: false
  });
  /** 渲染方式 */
  const tag = ref('img');

  const props = defineProps({
    /** 修改回显的数据 */
    data: Object
  });

  /** 弹窗是否打开 */
  const visible = defineModel({ type: Boolean });
  /** 关闭弹窗 */
  const handleCancel = () => {
    visible.value = false;
  };

  /** 监听弹窗打开 */
  watch(visible, () => {
    if (visible.value) {
      if (props.data) {
        // 生成新的二维码
        text.value =
          location.origin + '/qrcode/index.html?id=' + props.data.userId;
      }
    }
  });
</script>
