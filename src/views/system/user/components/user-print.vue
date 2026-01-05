<template>
  <div>
    <ele-modal
      form
      :width="780"
      :bodyStyle="{ maxHeight: '700px', overflow: 'auto' }"
      title="证书打印"
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
        class="preview-container show-container"
        v-for="item in printList"
        :key="item.userId"
      >
        <user-certificate :user-info="item" :tag="tag" />
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
        <user-certificate :user-info="item" :tag="tag" />
      </div>
    </ele-printer>
  </div>
</template>

<script setup>
  import { ref, watch, nextTick } from 'vue';
  import { EleMessage } from 'ele-admin-plus';
  // import { getQrCodeInfo } from '@/api/workplace';
  import UserCertificate from './user-certificate.vue';

  const visible = defineModel({ type: Boolean, default: false });
  const props = defineProps({
    /** 编辑数据 */
    data: {
      type: Array,
      default: () => []
    }
  });

  const userInfo = ref({});
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
        // const res = await getQrCodeInfo({ userId: val.userId });
        // userInfo.value = res.sysUser;
        // text.value = location.origin + '/qrcode/index.html?id=' + val.userId;
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
    justify-content: center;
    flex-wrap: wrap;
    // page-break-after: always;
  }

  .preview-container.show-container {
    gap: 20px;
    margin-bottom: 20px;
  }

  // .preview-container:last-child {
  //   page-break-after: auto;
  // }

  .flexSpace {
    display: flex;
    justify-content: space-between;
  }
</style>
