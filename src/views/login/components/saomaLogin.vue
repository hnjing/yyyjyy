<template>
  <div class="login-body">
    <div class="switch-corner">
      <img
        src="@/assets/login/loginType_1.png"
        class="switch-icon"
        @click="emit('switchTab', '1')"
      />
    </div>

    <el-text>
      <span class="ukey-text">扫码</span>
      <span class="login-text">登录</span>
    </el-text>
    <div class="form-padding"></div>
    <div
      style="
        width: 100%;
        margin-bottom: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      "
    >
      <div
        class="gzhLogin"
        style="
          background: #ffffff;
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid rgb(208, 208, 208);
        "
      >
        <el-image
          style="width: 262px; height: 262px"
          :src="scanImgInfo.qrCodeUrl"
        >
          <template #placeholder>
            <ele-loading :loading="true">
              <div
                style="
                  width: 262px;
                  height: 262px;
                  background: rgba(255, 255, 255, 0.9);
                "
              >
              </div>
            </ele-loading>
          </template>
          <template #error>
            <ele-loading :loading="true">
              <div
                style="
                  width: 262px;
                  height: 262px;
                  background: rgba(255, 255, 255, 0.9);
                "
              >
              </div>
            </ele-loading>
          </template>
        </el-image>
        <div class="gzhLoginMask" v-if="scanImgShow" @click="getScanImg">
          <el-icon :size="30" color="#ffffff"><Refresh /></el-icon>
          <span style="color: #ffffff; margin-top: 5px; font-size: 16px"
            >刷新二维码</span
          >
        </div>
      </div>
      <div style="font-size: 16px; margin-top: 20px"
        >打开微信扫一扫，快速登录
      </div>
    </div>
    <scanLogin
      v-model="scanShow"
      @done="getScanImg"
      :openid="openid"
      :client-id="clientId"
      v-if="scanShow"
    />
  </div>
</template>
<script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  import { genQrCodeUrl, checkLogin } from '@/api/login';
  import scanLogin from './scanLogin.vue';
  import { Refresh } from '@element-plus/icons-vue';
  import { EleMessage } from '@hnjing/zxzy-admin-plus/es';

  const props = defineProps({
    goHome: {
      type: Function,
      required: true
    },
    cleanPageTabs: {
      type: Function,
      required: true
    },
    clientId: {
      type: String,
      default: 'e5cd7e4891bf95d1d19206ce24a7b32e'
    }
  });

  const emit = defineEmits(['switchTab']);
  const scanImgInfo = ref({});
  const scanImgShow = ref(false);
  const timeOut = ref(null);
  const openid = ref('');
  const scanShow = ref(false);
  const getScanImg = async () => {
    try {
      clearInterval(timeOut.value);
      scanImgShow.value = false;
      scanImgInfo.value = {};
      const res = await genQrCodeUrl();
      scanImgInfo.value = res.data;
      checkLoginTime();
      setTimeout(() => {
        scanImgShow.value = true;
        clearInterval(timeOut.value);
      }, 60000);
    } catch (error) {
      setTimeout(() => {
        scanImgShow.value = true;
        clearInterval(timeOut.value);
      }, 1000);
    }
  };
  const checkLoginTime = () => {
    // checkLogin
    timeOut.value = setInterval(async () => {
      const res = await checkLogin({
        scene: scanImgInfo.value.sceneStr,
        clientId: props.clientId
      });
      console.log('checkLoginTime===>', res);
      if (res.code === 200) {
        if (res.data.hasLogin) {
          await goScanLogin(res.data);
          clearInterval(timeOut.value);
        }
      } else {
        scanImgShow.value = true;
        clearInterval(timeOut.value);
        EleMessage.error(res.msg);
      }
    }, 1000);
  };

  const goScanLogin = (data) => {
    console.log('goScanLogin===>', data);
    if (data.sso_token) {
      EleMessage.success({ message: '登录成功', plain: true });
      props.cleanPageTabs();
      props.goHome();
      clearInterval(timeOut.value);
      return;
    }
    openid.value = data.openid;
    scanShow.value = true;
  };
  onMounted(() => {
    getScanImg();
  });
  onBeforeUnmount(() => {
    clearInterval(timeOut.value);
  });
</script>
<style lang="scss" scoped>
  .login-body {
    flex-shrink: 0;
    width: 100%;
    height: 100% !important;
    padding: 40px 40px 0 40px;
    box-sizing: border-box;
    position: relative;
  }
  .switch-corner {
    width: 90px;
    height: 90px;
    position: absolute;
    top: 0;
    right: 0;
    overflow: hidden;
    clip-path: polygon(100% 0, 0 0, 100% 100%);
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.5);
    box-shadow:
      -10px 0 10px -5px rgba(0, 0, 0, 0.3),
      0 -10px 10px -5px rgba(0, 0, 0, 0.3);
    background: #fefefe;
    cursor: pointer;
  }

  .switch-icon {
    width: 100%;
    height: 100%;
    user-select: none;
  }

  .ukey-text {
    margin-right: 3px;
  }

  .login-text {
    letter-spacing: 3px;
  }

  .form-padding {
    padding: 18px 0;
  }
  .gzhLogin {
    width: 262px;
    height: 262px;
    margin: 0 auto;
    position: relative;
  }
  .gzhLogin img {
    width: 262px;
    height: 262px;
  }
  .gzhLoginMask {
    cursor: pointer;
    width: 262px;
    height: 262px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.7);
    position: absolute;
    top: 0px;
    left: 0px;
  }
  :deep(.el-text) {
    font-size: 34px;
    color: #3b426f;
    text-align: center;
    letter-spacing: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 400 !important;
  }
</style>
