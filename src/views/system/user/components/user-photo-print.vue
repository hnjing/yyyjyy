<template>
  <div>
    <ele-modal
      form
      :width="780"
      :bodyStyle="{ maxHeight: '700px', overflow: 'auto' }"
      title="照片打印"
      v-model="visible"
      :move-out="moveOut"
      :resizable="modalResizable"
      :maxable="maxable"
      :inner="inner"
      :reset-on-close="resetOnClose"
      :position="position"
      :append-to-body="true"
      :z-index="2001"
      @closed="cancelDialog"
    >
      <div
        class="preview-container"
        v-for="item in printList"
        :key="item.userId"
      >
        <user-photo :user-info="item" :tag="tag" />
      </div>

      <template #footer>
        <div>
          <div>
            <el-button @click="cancelDialog">关闭</el-button>
            <el-button type="primary" @click="save"> 确定打印 </el-button>
          </div>
        </div>
      </template>
    </ele-modal>

    <ele-printer
      v-model="printing"
      margin="12mm"
      target="_iframe"
      :static="false"
      @done="handlePrintDone"
    >
      <div
        class="preview-container"
        v-for="item in printList"
        :key="item.userId"
      >
        <user-photo :user-info="item" :tag="tag" />
      </div>
    </ele-printer>
  </div>
</template>

<script setup>
  import { ref, watch, nextTick } from 'vue';
  import { EleMessage } from 'ele-admin-plus';
  import UserPhoto from './user-photo.vue';

  const visible = defineModel({ type: Boolean, default: false });
  const props = defineProps({
    /** 编辑数据 */
    data: {
      type: Array,
      default: () => []
    }
  });

  const printList = ref([]);

  /** 渲染方式 */
  const tag = ref('img');

  const moveOut = ref(false);
  const modalResizable = ref(true);
  const maxable = ref(false);
  const inner = ref(false);
  const resetOnClose = ref(true);
  const position = ref('center');
  const loading = ref(false);
  const cancelDialog = () => {
    visible.value = false;
    loading.value && loading.value.close();
  };
  const printing = ref(false);
  const save = () => {
    loading.value = EleMessage.loading({
      message: '正在打印中..',
      plain: true,
      centered: true,
      mask: true
    });
    nextTick(() => {
      printing.value = true;
    });
  };

  /** 打印结束事件 */
  const handlePrintDone = () => {
    printing.value = false;
    loading.value && loading.value.close();
  };

  watch(
    () => props.data,
    async (val) => {
      if (val) {
        printList.value = val;
      }
    }
  );
</script>

<style lang="scss" scoped>
  :print-container {
    max-height: 500px;
    overflow: auto;
  }
  .preview-container {
    display: flex;
    padding-top: 8px;
    justify-content: center;
    flex-wrap: wrap;
    // page-break-after: always;
  }

  .preview-container:nth-child(3n) {
    page-break-after: always;
  }

  .flexSpace {
    display: flex;
    justify-content: space-between;
  }
</style>