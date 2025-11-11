<template>
  <div>
    <ele-modal
      form
      :width="780"
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
      <div class="preview-container">
        <user-certificate
          :user-info="userInfo"
          :text="text"
          :tag="tag"
          type="front"
        />
        <user-certificate
          :user-info="userInfo"
          :text="text"
          :tag="tag"
          type="back"
        />
      </div>

      <template #footer>
        <div class="flexSpace">
          <div>
            <el-button @click="cancelDialog">关闭</el-button>
            <el-button type="primary" @click="save"> 确定打印 </el-button>
          </div>
        </div>
      </template>
    </ele-modal>

    <ele-printer
      v-model="printing"
      margin="0mm 12mm 10mm 12mm"
      :header-style="{
        padding: '26px 0 2px 0',
        fontSize: '13px',
        borderBottom: '1px solid #666',
        marginBottom: '26px'
      }"
      :body-style="{ fontSize: '14px', lineHeight: 2.5 }"
      target="_iframe"
      :static="false"
      @done="handlePrintDone"
    >
      <div class="print-container">
        <user-certificate
          :user-info="userInfo"
          :text="text"
          :tag="tag"
          type="front"
          :is-print="true"
        />
        <user-certificate
          :user-info="userInfo"
          :text="text"
          :tag="tag"
          type="back"
          :is-print="true"
        />
      </div>
    </ele-printer>
  </div>
</template>

<script setup>
  import { ref, watch, nextTick } from 'vue';
  import { EleMessage } from 'ele-admin-plus';
  import { getQrCodeInfo } from '@/api/workplace';
  import UserCertificate from './user-certificate.vue';

  const visible = defineModel({ type: Boolean, default: false });
  const props = defineProps({
    /** 编辑数据 */
    data: {
      type: Object,
      default: () => {}
    }
  });

  const userInfo = ref({});

  /** 渲染方式 */
  const tag = ref('img');
  const text = ref(`${location.origin}/extension/qr-code`);

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
        const res = await getQrCodeInfo({ userId: val.userId });
        userInfo.value = res.sysUser;
        text.value = location.origin + '/qrcode/index.html?id=' + val.userId;
      }
    }
  );
</script>

<style lang="scss" scoped>
  .preview-container {
    display: flex;
    gap: 20px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .print-container {
    display: flex;
    flex-wrap: wrap;
  }

  .flexSpace {
    display: flex;
    justify-content: space-between;
  }
</style>
