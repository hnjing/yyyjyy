<!-- src/views/system/user/components/user-certificate.vue -->
<template>
  <div class="certificate-collection">
    <!-- 第一张：样式参考图片，大头像、姓名、应急救援、证号 -->
    <div class="certificate-page back-page" :class="pageClass">
      <div class="certificate-content first-card">
        <div class="header">
          <h2>救 援 证</h2>
        </div>
        <div class="first-photo">
          <img
            :src="userInfo.headurl"
            alt="照片"
            class="user-photo"
            v-if="userInfo.headurl"
          />
          <div class="photo-placeholder" v-else>照片</div>
        </div>
        <div class="first-body">
          <h2 class="first-name">{{ userInfo.nickName }}</h2>
          <p class="first-role">益安救援</p>
          <!-- <p class="first-no">{{ userInfo.helpno }}</p> -->
        </div>

        <div class="back-qr-row">
          <div class="back-qr">
            <ele-qr-code
              value="http://www.yiansos.com/"
              :size="50"
              level="L"
              :margin="0"
              :tag="tag"
            />
            <p class="qr-text">益安官网</p>
          </div>
          <div class="back-qr">
            <!-- 从第一张移动过来的证书二维码（替换公众号） -->
            <ele-qr-code
              :value="text"
              :size="50"
              level="L"
              :margin="0"
              :tag="tag"
            />
            <p class="qr-text">个人信息</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 第三张：反面公司信息 + 二维码 -->
    <div
      class="certificate-page back-page certificate-page-2"
      :class="pageClass"
    >
      <div class="certificate-content back-content">
        <div class="header">
          <h2>中华人民共和国</h2>
          <p>The People's Republic of China</p>
        </div>
      </div>
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
    return null;
  });

  const text = computed(() => {
    return `${location.origin}/qrcode/index.html?id=${props.userInfo.userId}`;
  });

  /** 格式化日期 */
  // const formatDate = (dateString) => {
  //   if (!dateString) return '';
  //   const date = new Date(dateString);
  //   return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
  // };

  // /** 有效期限：当前日期 至 三年后 */
  // const validPeriod = computed(() => {
  //   const now = new Date();
  //   const later = new Date(now.getTime());
  //   later.setFullYear(now.getFullYear() + 3);
  //   return `${formatDate(now)}-${formatDate(later)}`;
  // });
</script>

<style lang="scss" scoped>
  .certificate-collection {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    gap: 6mm;
    flex-wrap: nowrap;
  }

  .certificate-page {
    /* 设置为实际打印卡片尺寸：54mm x 86mm（竖向） */
    width: 54mm;
    height: 86mm;
    background-image: url('@/assets/print_bg_shu.png');
    background-size: cover;
    background-position: center;
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    /* 每张卡左右间距 */
    margin: 0 3mm;
    flex: 0 0 auto;
    // page-break-after: always;

    &.print-page {
      box-shadow: none;
      border: none;

      // /* 打印时保持实际卡片尺寸 */
      // width: 54mm;
      // height: 86mm;
    }
  }

  /* 覆盖默认 qr-section，使其在卡内流式布局 */
  .certificate-page .qr-section {
    position: static;
    margin-top: 6px;
    text-align: center;
  }

  .certificate-content {
    box-sizing: border-box;
    padding: 10px;
    height: 100%;
    display: flex;
    flex-direction: column;
    font-family: 'Microsoft YaHei', sans-serif;
  }

  .compact-content {
    padding: 10px;
  }

  .compact-top {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }

  .photo-section {
    width: 24mm;
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
    height: 30mm;
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
      min-width: 50px; /* 继续缩小 label 宽度 */
      flex: 0 0 50px;
      white-space: nowrap;
      font-size: 9px;
      color: #222;
    }

    .value {
      flex: 1;
      word-break: break-all;
      font-size: 12px; /* 增大文字 */
      color: #222;
    }

    &.idcard {
      .value {
        white-space: nowrap; /* 身份证号一行显示 */
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .qr-section {
    position: absolute;
    bottom: 15px;
    right: 15px;
    text-align: center;

    .qr-text {
      margin: 2px 0 0;
      font-size: 10px;
    }
  }

  .footer {
    position: absolute;
    bottom: 15px;
    left: 15px;
    font-size: 10px;

    p {
      margin: 0;
    }
  }

  .back-page {
    .back-content {
      flex: 1;
      font-size: 10px;
      background-image: url('@/assets/guohui.png');
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      padding: 10px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;

      p {
        margin: 4px 0;
      }
    }

    .back-footer {
      text-align: right;
      font-size: 10px;
      margin-top: 5px;
    }
  }

  /* 小卡片样式 */
  .compact {
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 0 10px;

    .photo-section {
      width: 60px;
      height: 60px;
    }

    .user-photo {
      border-radius: 50%;
    }

    .compact-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding-left: 10px;

      .compact-name {
        font-size: 14px;
        font-weight: bold;
        margin: 0;
      }

      .compact-dept {
        font-size: 12px;
        margin: 2px 0;
      }

      .compact-no {
        font-size: 12px;
        color: #666;
        margin: 2px 0;
      }
    }
  }

  /* 新增样式：第一张卡片 */
  .first-card {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    header {
      margin-top: 10px;
    }

    .first-photo {
      width: 34mm;
      height: 34mm;
      margin-bottom: 10px;
      // transform: translateY(-3mm); /* 头像上移 */

      .user-photo {
        border-radius: 50%;
        width: 100%;
        height: 100%;
      }

      .photo-placeholder {
        width: 100%;
        height: 100%;
        line-height: 36mm;
        font-size: 12px;
      }
    }

    .back-qr-row {
      display: flex;
      justify-content: center;
      margin-top: 6px;

      .back-qr {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 0 6px;

        .qr-text {
          margin-top: 4px;
          font-size: 9px;
        }
      }
    }

    .first-body {
      letter-spacing: 5px;
      .first-name {
        font-size: 18px;
        font-weight: bold;
        margin: 0 0 6px 0; /* 增大文字间距 */
        color: #0b63b8; /* 身份证类似蓝色 */
        line-height: 1.1;
      }

      .first-role {
        font-size: 13px;
        margin: 2px 0 6px;
        color: #0b63b8;
      }

      .first-no {
        font-size: 13px;
        color: #0b63b8;
        margin: 0;
      }
    }

    .first-qr {
      margin-top: 10px;
    }
  }

  /* 新增样式：第二张卡片（详细信息） */
  .second-card,
  .certificate-page {
    .header {
      margin-bottom: 6px;

      h2 {
        font-size: 16px;
        margin: 0;
        text-align: center; /* 标题居中 */
      }

      p {
        font-size: 12px; /* 英文字体变小 */
        margin: 2px 0 0;
        text-align: center;
        color: #333;
      }
    }

    /* 列表从上到下排列，每行 label 与 value 同行 */
    .info-grid {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 10px;
    }

    .info-item {
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      gap: 6px;

      .label {
        width: 40px;
        flex: 0 0 40px;
        font-weight: bold;
        font-size: 10px;
        color: #222;
      }

      .value {
        flex: 1;
        font-size: 11px;
        color: #333;
        word-break: break-all;
      }
    }

    .second-footer {
      width: calc(100% - 20px);
      position: absolute;
      bottom: 0px; /* 保持在内容下方，不挤到底部 */
      text-align: center;
      font-size: 9px;
      color: #666;
    }
  }

  /* 使用伪元素渲染背景图，增加打印时背景保留可能性 */
  .certificate-page::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url('@/assets/print_bg_shu.png');
    background-size: cover;
    background-position: center;
    z-index: 0;
    opacity: 1;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .certificate-page > .certificate-content {
    position: relative;
    z-index: 1;
  }
</style>
