<template>
  <div class="login-wrapper">
    <!--<span class="login-logo">
      <img src="/src/assets/logo/login-bg.png" />
    </span>-->
    <div class="logo-wrapper">
      <img class="logo-img" src="/src/assets/login/login-left.png" alt="" />
    </div>
    <div style="margin-top: 20px; margin-bottom: 15px">
      <h1
        style="
          color: #fff;
          font-size: 36px;
          font-weight: bold;
          letter-spacing: 5px;
        "
        >{{ PROJECT_NAME }}</h1
      >
      <!-- <img src="/src/assets/logo/login-title.svg" alt="" /> -->
    </div>
    <div class="login-main">
      <el-card shadow="always" class="login-card">
        <div class="login-list">
          <slot></slot>
        </div>
      </el-card>
      <div class="footer">
        <div
          >Copyright © 北京中兴正远科技有限公司 &nbsp;版权所有
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            style="
              color: rgb(230, 162, 60);
              text-decoration: none;
              margin-left: 5px;
            "
            >京ICP备19031785号-1</a
          >
        </div>
        <div
          >电话：010-86463913
          &nbsp;&nbsp;&nbsp;&nbsp;邮箱：zxzy@yuans28.com</div
        >
      </div>
    </div>
  </div>
</template>

<script setup>
  import { PROJECT_NAME } from '@/config/setting';
  // 登录页面布局组件
</script>

<style lang="scss" scoped>
  .login-logo {
    position: absolute;
    top: 43px;
    left: 73px;
    z-index: 110000;
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .login-logo-text {
    font-size: 36px;
    color: #fff;
    font-weight: bold;
    margin-bottom: 18px;
    letter-spacing: 5px;
  }
  .footer {
    position: relative;
    bottom: -47px;
    width: 100%;
    line-height: 32px;
    text-align: center;
    font-size: 16px;
    color: #fff;
  }
  .logo-wrapper {
    width: 100%;
    padding-top: 20px;
    padding-left: 20px;
    box-sizing: border-box;
    .logo-img {
      // width: 501px;
      // height: 92px;
    }
  }
  .login-wrapper::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url('@/assets/login/login_bg.jpg');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    z-index: -1;
  }
  .login-wrapper {
    min-width: 1280px;
    min-height: 100vh;
    box-sizing: border-box;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .login-main {
      width: 100%;
      height: 100%;
      flex: 1;
      display: flex;
      //justify-content: center;
      align-items: center;
      flex-direction: column;
    }
    .login-card {
      width: 600px;
      height: 500px;
      min-width: 600px;
      max-width: 600px;
      min-height: 500px;
      max-height: 500px;
      border-radius: 10px;
      overflow: hidden;
      background-color: #fff;
      :deep(.el-card__body) {
        display: flex;
        padding: 0;
      }
      .login-list {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: space-between;
      }
    }
  }
</style>
