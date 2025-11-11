<!-- src/views/system/user/components/user-certificate.vue -->
<template>
  <div class="certificate-page" :class="pageClass">
    <div class="certificate-content">
      <template v-if="type === 'front'">
        <div class="header">
          <h2>应急救援人员证</h2>
          <p>EMERGENCY RESCUE PERSONNEL CERTIFICATE</p>
        </div>

        <div class="user-info">
          <div class="photo-section">
            <img
              :src="userInfo.headurl"
              alt="照片"
              class="user-photo"
              v-if="userInfo.headurl"
            />
            <div class="photo-placeholder" v-else>照片</div>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <span class="label">姓名:</span>
              <span class="value">{{ userInfo.nickName }}</span>
            </div>
            <div class="info-item">
              <span class="label">性别:</span>
              <span class="value">{{ userInfo.sex }}</span>
            </div>
            <div class="info-item">
              <span class="label">血型:</span>
              <span class="value">{{ userInfo.blood }}</span>
            </div>
            <div class="info-item">
              <span class="label">身份证号:</span>
              <span class="value">{{ userInfo.idcard }}</span>
            </div>
            <div class="info-item">
              <span class="label">联系电话:</span>
              <span class="value">{{ userInfo.phonenumber }}</span>
            </div>
            <div class="info-item">
              <span class="label">紧急联系人:</span>
              <span class="value">{{ userInfo.contactpeople }}</span>
            </div>
            <div class="info-item">
              <span class="label">紧急电话:</span>
              <span class="value">{{ userInfo.contactmobile }}</span>
            </div>
            <div class="info-item">
              <span class="label">所属部门:</span>
              <span class="value">{{ userInfo.dept?.deptName || '未知' }}</span>
            </div>
          </div>
        </div>

        <div class="qr-section">
          <ele-qr-code
            :value="text"
            :size="100"
            level="L"
            :margin="0"
            :tag="tag"
          />
          <p class="qr-text">扫码验证</p>
        </div>

        <div class="footer">
          <p>发证日期: {{ formatDate(userInfo.createTime) }}</p>
          <p>证件编号: {{ userInfo.helpno }}</p>
        </div>
      </template>

      <template v-else-if="type === 'back'">
        <div class="back-header">
          <h3>注意事项</h3>
        </div>

        <div class="back-content">
          <ol>
            <li>本证书是持证人具备相应应急救援能力的有效证明</li>
            <li>持证人应按规定参加定期培训和考核</li>
            <li>证书有效期为三年，到期需重新审核</li>
            <li>证书仅限本人使用，不得转借他人</li>
            <li>如有遗失，应及时向发证机关申请补办</li>
            <li>持证人工作单位变更应及时办理变更手续</li>
          </ol>

          <div class="signature-section">
            <div class="signature-item">
              <p>持证人签名:</p>
              <div class="signature-line"></div>
            </div>
            <div class="signature-item">
              <p>发证机关:</p>
              <div class="signature-line"></div>
            </div>
            <div class="signature-item">
              <p>发证日期:</p>
              <div class="signature-line"></div>
            </div>
          </div>
        </div>

        <div class="back-footer">
          <p>应急管理部门制</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    userInfo: {
      type: Object,
      default: () => ({})
    },
    text: {
      type: String,
      default: ''
    },
    tag: {
      type: String,
      default: 'img'
    },
    type: {
      type: String,
      default: 'front', // 'front' or 'back'
      validator: (value) => ['front', 'back'].includes(value)
    },
    isPrint: {
      type: Boolean,
      default: false
    }
  });

  const pageClass = computed(() => {
    return {
      'front-page': props.type === 'front',
      'back-page': props.type === 'back',
      'print-page': props.isPrint
    };
  });

  /** 格式化日期 */
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return `${date.getFullYear()}年${(date.getMonth() + 1).toString().padStart(2, '0')}月${date.getDate().toString().padStart(2, '0')}日`;
  };
</script>

<style lang="scss" scoped>
  .certificate-page {
    width: 340px;
    height: 210px;
    background-image: url('@/assets/print_bg.png');
    background-size: cover;
    background-position: center;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;

    &.print-page {
      box-shadow: none;
      border: none;
      margin-bottom: 20px;
      page-break-after: always;
    }
  }

  .certificate-content {
    padding: 15px;
    height: 100%;
    display: flex;
    flex-direction: column;
    font-family: 'Microsoft YaHei', sans-serif;
  }

  .front-page .header {
    text-align: center;
    margin-bottom: 10px;

    h2 {
      margin: 0;
      font-size: 20px;
      font-weight: bold;
      color: #000;
    }

    p {
      margin: 2px 0 0;
      font-size: 10px;
      color: #333;
    }
  }

  .user-info {
    display: flex;
    flex: 1;
  }

  .photo-section {
    width: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
  }

  .user-photo {
    width: 100%;
    height: auto;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  .photo-placeholder {
    width: 100%;
    height: 100px;
    border: 1px dashed #999;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #999;
  }

  .info-grid {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr;
    gap: 4px;
    font-size: 11px;
  }

  .info-item {
    display: flex;

    .label {
      font-weight: bold;
      min-width: 50px;
      white-space: nowrap;
    }

    .value {
      flex: 1;
      word-break: break-all;
    }
  }

  .qr-section {
    position: absolute;
    top: 15px;
    right: 15px;
    text-align: center;

    .qr-text {
      margin: 2px 0 0;
      font-size: 10px;
    }
  }

  .footer {
    position: absolute;
    bottom: 10px;
    left: 15px;
    font-size: 10px;

    p {
      margin: 0;
    }
  }

  .back-page {
    .back-header {
      text-align: center;
      margin-bottom: 10px;

      h3 {
        margin: 0;
        font-size: 16px;
        color: #000;
      }
    }

    .back-content {
      flex: 1;
      font-size: 10px;

      ol {
        padding-left: 15px;
        margin: 0 0 10px;

        li {
          margin-bottom: 3px;
        }
      }
    }

    .signature-section {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
    }

    .signature-item {
      flex: 1;
      text-align: center;
      font-size: 10px;

      p {
        margin: 0 0 5px;
      }
    }

    .signature-line {
      height: 1px;
      background: #000;
      width: 80%;
      margin: 0 auto;
    }

    .back-footer {
      text-align: right;
      font-size: 10px;
      margin-top: 5px;
    }
  }
</style>
