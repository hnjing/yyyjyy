<template>
  <login-layout>
    <QuickLogin
      :show-quick="showQuick"
      :go-home="goHome"
      :client-id="clientId"
    />
    <div class="login-body" v-if="tabActive == 1 && !resetPassword">
      <AccountLogin
        ref="accountLoginRef"
        :clean-page-tabs="cleanPageTabs"
        :go-home="goHome"
        :client-id="clientId"
        @switch-tab="tabActive = $event"
        @reset-password="resetPassword = true"
      />
    </div>
    <div class="login-body" v-else-if="tabActive == 1 && resetPassword">
      <ResetPassword
        @switch-tab="tabActive = $event"
        @back-to-login="resetPassword = false"
      />
    </div>
    <!-- <div class="login-body" v-else-if="tabActive == 2">
      <UkeyLogin
        ref="ukeyLoginRef"
        :clean-page-tabs="cleanPageTabs"
        :go-home="goHome"
        :client-id="clientId"
        @switch-tab="switchToAccountLogin"
      />
    </div> -->
    <!-- <div class="login-body" v-else-if="tabActive == 3">
      <saomaLogin
        ref="saomaLoginRef"
        :clean-page-tabs="cleanPageTabs"
        :go-home="goHome"
        :client-id="clientId"
        @switch-tab="tabActive = $event"
      />
    </div> -->
  </login-layout>
</template>

<script setup>
  import { ref, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { getToken } from '@/utils/token-util';
  import { systemConfig } from '@/api/login';
  import { usePageTab } from '@/utils/use-page-tab';
  import { CLIENT_ID } from '@/config/setting';
  import LoginLayout from './components/LoginLayout.vue';
  import QuickLogin from './components/QuickLogin.vue';
  import AccountLogin from './components/AccountLogin.vue';
  import saomaLogin from './components/saomaLogin.vue';
  import ResetPassword from './components/ResetPassword.vue';
  import UkeyLogin from './components/UkeyLogin.vue';

  import './styles/index.scss';

  const { currentRoute } = useRouter();
  const { goHomeRoute, cleanPageTabs } = usePageTab();

  // 通用配置
  const clientId = CLIENT_ID;

  // 是否显示快捷登录（开发环境）
  const showQuick = ref(false);
  const tabActive = ref(1);
  const resetPassword = ref(false);

  // 账号登录组件实例
  const accountLoginRef = ref(null);
  // UKey登录组件实例
  const ukeyLoginRef = ref(null);

  /** 跳转到首页 */
  const goHome = () => {
    const { query } = currentRoute.value;
    goHomeRoute(query.from);
  };

  // 切换到账号登录
  const switchToAccountLogin = (tab) => {
    tabActive.value = tab;
    resetPassword.value = false;
  };

  // 监听tabActive变化，当切换到UKey登录时自动初始化
  watch(tabActive, (newVal) => {
    if (newVal == 2 && ukeyLoginRef.value) {
      // 切换到UKey登录，自动初始化
      ukeyLoginRef.value.initialize();
    }
  });

  onMounted(() => {
    // 如果已登录，则跳转到首页
    if (getToken()) {
      goHome();
    }

    // 是否开启快捷登录
    // systemConfig(CLIENT_ID).then((res) => {
    //   showQuick.value = res.data.apiActive != 'production';
    // });
  });
</script>

<style lang="scss" scoped>
  .login-body {
    width: 100%;
    background-color: #fff;
  }
</style>
