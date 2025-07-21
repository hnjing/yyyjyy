<template>
  <div class="book">
    <!-- 标题 -->
    <div class="book-title">
      <div class="book-title-content"> 系统可能出现的问题处理办法 </div>
    </div>

    <div class="book-iden" v-if="false">
      <div class="book-iden-content">
        <div class="book-no-message"> 暂无内容 </div>
      </div>
    </div>

    <!-- 身份证 -->
    <div class="book-iden">
      <div class="book-iden-content">
        <!-- 标题 -->
        <div class="book-iden-content-header">
          <div class="book-iden-content-header-num">1</div>
          <p class="book-iden-content-header-name"
            >非https协议下，摄像头拍照无法使用的问题</p
          >
        </div>
        <!-- 具体内容 -->
        <div class="book-iden-content-wrap">
          <p class="book-common-solve-title book-common-solve-title-iden"
            >解决方法</p
          >
          <div class="book-iden-content-wrap-intro">
            <span class="book-iden-content-wrap-intro-bg"
              >打开chrome（谷歌）浏览器</span
            >
            <i class="el-icon-d-arrow-right book-iden-content-wrap-arr"></i>
            <span class="book-iden-content-wrap-intro-bg"
              >在地址栏中输入 chrome://flags/ 回车确认</span
            >
            <i class="el-icon-d-arrow-right book-iden-content-wrap-arr"></i>
            <span class="book-iden-content-wrap-intro-bg"
              >在打开的页面的搜索框中输入 unsafely</span
            >
            <!-- <i class="el-icon-d-arrow-right book-iden-content-wrap-arr"></i> -->
            <i class="el-icon-d-arrow-right book-iden-content-wrap-arr"></i>
            <span class="book-iden-content-wrap-intro-bg"
              >选择 enabled 并在输入框中填入要授信的域名</span
            >
          </div>
          <div></div>
          <img :src="firstStepFirst" class="book-iden-content-wrap-img" />
        </div>

        <!-- 标题 -->
        <div class="book-iden-content-header">
          <div class="book-iden-content-header-num">2</div>
          <p class="book-iden-content-header-name"
            >筛查相关页面出现 “连接驱动失败！” 的提示</p
          >
        </div>
        <!-- 具体内容 -->
        <div class="book-iden-content-wrap">
          <p class="book-common-solve-title book-common-solve-title-iden"
            >解决方法<span class="book-server-ware" @click="donwloadService"
              >点击下载服务</span
            ></p
          >
          <div class="book-iden-content-wrap-intro">
            <span class="book-iden-content-wrap-intro-bg"
              >出现这样的提示的原因是筛查相关硬件的使用需要启动服务才能使用，系统现在正在自动为我们启动服务。
              提示之后会出现启动服务的选项，我们选择“打开Farinfo.ToolServices.StartUp”
              即可。</span
            >
          </div>
          <div></div>
          <img :src="guidanceTips" class="book-iden-content-wrap-img2" />
          <img :src="guidanceStart" class="book-iden-content-wrap-img2" />
        </div>

        <!-- 标题 -->
        <div class="book-iden-content-header">
          <div class="book-iden-content-header-num">3</div>
          <p class="book-iden-content-header-name"
            >读卡的时候出现 “端口打开失败，请检测相应的端口或者重新连接读卡器”
            的提示</p
          >
        </div>
        <!-- 具体内容 -->
        <div class="book-iden-content-wrap">
          <p class="book-common-solve-title book-common-solve-title-iden"
            >解决方法<span class="book-server-ware" @click="donwloadWare"
              >点击下载驱动</span
            ></p
          >
          <div class="book-iden-content-wrap-intro">
            <span class="book-iden-content-wrap-intro-bg"
              >出现这样的提示，首先我们应该检查读卡器是否连接，如果已经连接请检查连接处是否松动，
              或者尝试重新连接读卡器设备到计算机上，新电脑请先下载驱动。</span
            >
          </div>
          <div></div>
          <img :src="guidanceRead" class="book-iden-content-wrap-img2" />
        </div>

        <!-- 标题 -->
        <div class="book-iden-content-header">
          <div class="book-iden-content-header-num">4</div>
          <p class="book-iden-content-header-name">使用外接 USB 摄像设备</p>
        </div>
        <!-- 具体内容 -->
        <div class="book-iden-content-wrap">
          <p class="book-common-solve-title book-common-solve-title-iden"
            >解决方法（window10 操作系统）</p
          >
          <div class="book-iden-content-wrap-intro">
            <span class="book-iden-content-wrap-intro-bg"
              >（ 1 ）如果需要使用外接 USB
              摄像设备，可以禁用本机默认的摄像设备，选择我的电脑，右击然后选择管理进入计算机管理界面</span
            >
          </div>
          <div></div>

          <img :src="guidanceBanFirst" class="book-iden-content-wrap-img3" />
          <div class="book-iden-content-wrap-intro">
            <span class="book-iden-content-wrap-intro-bg"
              >（ 2
              ）进入计算机管理界面，选择设备管理器，找到照相机，选择本机的摄像设备，右击选择禁用</span
            >
          </div>
          <img :src="guidanceBanSecond" class="book-iden-content-wrap-img4" />
          <div class="book-iden-content-wrap-intro">
            <span class="book-iden-content-wrap-intro-bg"
              >（ 3 ）在弹出的禁用弹框中选择是即可</span
            >
          </div>
          <img :src="guidanceBanThird" class="book-iden-content-wrap-img4" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { nextTick } from 'vue';
  import firstStepFirst from '@/assets/guidance/guidance_photo.png';
  import guidanceStart from '@/assets/guidance/guidance_start.png';
  import guidanceTips from '@/assets/guidance/guidance_tips.png';
  import guidanceRead from '@/assets/guidance/guidance_read.png';
  import guidanceBanFirst from '@/assets/guidance/guidance_ban_1.png';
  import guidanceBanSecond from '@/assets/guidance/guidance_ban_2.png';
  import guidanceBanThird from '@/assets/guidance/guidance_ban_3.png';

  nextTick(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  });
  const donwloadService = () => {
    window.location.href =
      'https://ibank.frp.520gcp.com/sms/Farinfo.ToolServices_Setup_2023.1.1.1.exe';
  };
  const donwloadWare = () => {
    window.location.href =
      'https://ibank.frp.520gcp.com/sms/MSI-install-x64.zip';
  };
</script>

<style scoped>
  .book {
    background-color: #eeeff1;
    width: 100%;
    height: auto;
  }

  .book-no-message {
    border: 1px solid #f5f5f5;
    border-radius: 5px;
    min-height: 200px;
    text-align: center;
    width: 300px;
    margin: 0 auto;
    line-height: 200px;
    color: #999;
    font-size: 16px;
    margin-top: 350px;
    margin-bottom: 350px;
  }

  /* 说明书标题 */
  .book-title {
    width: 100%;
    height: 57px;
    background-color: #fff;
  }

  .book-title-content {
    width: 1366px;
    margin: 0 auto;
    font-size: 16px;
    color: #666;
    line-height: 57px;
    padding-left: 40px;
    font-weight: bold;
    /* border: 1px solid red; */
  }

  /* 身份证 */
  .book-iden {
    width: 100%;
    height: auto;
    background-color: #fff;
    margin-top: 10px;
  }
  .book-iden-content {
    width: 1366px;
    margin: 0 auto;
    border: 1px solid transparent;
    padding-bottom: 100px;
  }
  .book-iden-content-header {
    height: 20px;
    position: relative;
    margin-left: 40px;
    margin-top: 42px;
  }
  .book-iden-content-header-num {
    width: 20px;
    height: 20px;
    background-color: #0377d9;
    font-size: 14px;
    color: #fff;
    text-align: center;
    line-height: 20px;
    border-radius: 2px;
  }
  .book-iden-content-header-name {
    font-size: 16px;
    color: #666;
    font-weight: bold;
    position: absolute;
    left: 40px;
    top: 0px;
    line-height: 100%;
    padding-top: 1px;
    margin: 0;
  }
  .book-iden-content-wrap {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    padding-left: 80px;
    /* border: 1px solid orange; */
  }
  .book-iden-content-wrap-img {
    width: 1100px;
    height: auto;
    margin-top: 20px;
  }
  .book-iden-content-wrap-img2 {
    width: 50%;
    height: auto;
    margin-top: 20px;
  }
  .book-iden-content-wrap-img3 {
    width: 30%;
    height: auto;
    margin-top: 20px;
  }
  .book-iden-content-wrap-img4 {
    width: 70%;
    height: auto;
    margin-top: 20px;
  }
  .book-iden-content-wrap-pic {
    width: 457px;
    height: 181px;
    margin-bottom: 36px;
    margin-top: 20px;
  }

  /* 拍照 */
  .book-flash {
    width: 100%;
    height: auto;
    background-color: #fff;
    margin-top: 8px;
  }
  .book-flash-content {
    width: 1366px;
    border: 1px solid transparent;
    margin: 0 auto;
  }
  .book-flash-content-header {
    height: 20px;
    position: relative;
    margin-left: 40px;
    margin-top: 42px;
  }
  .book-flash-content-header-num {
    width: 20px;
    height: 20px;
    background-color: #0377d9;
    font-size: 14px;
    color: #fff;
    text-align: center;
    line-height: 20px;
    border-radius: 2px;
  }
  .book-flash-content-header-name {
    font-size: 16px;
    color: #666;
    font-weight: bold;
    position: absolute;
    left: 40px;
    top: 0px;
    line-height: 100%;
    padding-top: 1px;
  }
  .book-flash-content-wrap {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    padding-left: 80px;
  }
  .book-flash-content-wrap-img1 {
    width: 395px;
    height: 370px;
  }
  .book-flash-content-wrap-img2 {
    width: 546px;
    height: 292px;
    margin-top: 20px;
    display: inline-block;
  }
  .book-flash-content-wrap-img3 {
    width: 546px;
    height: 377px;
    display: inline-block;
    float: right;
    margin-right: 83px;
    margin-top: 20px;
  }
  .book-flash-content-wrap-img3::after {
    content: '';
    display: block;
    height: 0;
    visibility: hidden;
    clear: both;
  }
  .book-flash-content-wrap-img4 {
    width: 809px;
    height: 626px;
    margin-bottom: 30px;
  }

  /* 摄像头 */
  .book-camera {
    width: 100%;
    height: auto;
    background-color: #fff;
    margin-top: 8px;
  }
  .book-camera-content {
    width: 1366px;
    border: 1px solid transparent;
    margin: 0 auto;
  }
  .book-camera-content-header {
    height: 20px;
    position: relative;
    margin-left: 40px;
    margin-top: 42px;
  }
  .book-camera-content-header-num {
    width: 20px;
    height: 20px;
    background-color: #0377d9;
    font-size: 14px;
    color: #fff;
    text-align: center;
    line-height: 20px;
    border-radius: 2px;
  }
  .book-camera-content-header-name {
    font-size: 16px;
    color: #666;
    font-weight: bold;
    position: absolute;
    left: 40px;
    top: 0px;
    line-height: 100%;
    padding-top: 1px;
  }
  .book-camera-content-wrap {
    width: 100%;
    height: auto;
    box-sizing: border-box;
    padding-left: 80px;
    padding-bottom: 30px;
  }
  .book-common-solve-title-iden {
    padding-top: 30px;
  }
  .book-common-solve-title-flash {
    padding-top: 30px;
  }
  .book-common-solve-title-camera {
    padding-top: 30px;
  }
  .book-iden-content-wrap-intro-bg {
    display: inline-block;
    background-color: #e7f4ff;
    color: #0377d9;
    font-size: 14px;
    border-radius: 2px;
    padding: 8px;
    margin-top: 30px;
  }
  .book-iden-content-wrap-arr {
    color: #0d83e4;
    font-size: 20px;
    font-weight: bold;
  }
  .book-iden-content-wrap-intro-activex {
    font-size: 14px;
    color: #666;
  }
  .book-iden-content-wrap-intro-active {
    font-size: 14px;
    color: #666;
    padding-top: 19px;
  }
  .book-camera-content-wrap-resolve {
    font-size: 14px;
    color: #666;
    padding-top: 5px;
  }
  .book-common-solve-alert {
    margin-top: 20px;
    position: relative;
  }
  .book-common-solve-alert-flash {
    width: 700px;
    position: absolute;
    left: 425px;
    top: 0;
    padding-top: 165px;
    color: #666;
    font-size: 14px;
    line-height: 25px;
  }
  .book-flash-content-wrap-firstline {
    border: 1px solid transparent;
    margin-top: 30px;
    font-size: 14px;
    color: #0377d9;
    height: 40px;
  }
  .book-flash-content-wrap-firstline span {
    padding: 8px;
  }
  .book-flash-content-wrap-firstline span:first-child {
    float: left;
    background-color: #e7f4ff;
  }
  .book-flash-content-wrap-firstline span:last-child {
    background-color: #e7f4ff;
    float: right;
    margin-right: 355px;
  }
  .book-flash-content-wrap-secondline {
    /* border: 1px solid red; */
    margin-top: 40px;
    height: 40px;
    color: #0377d9;
    font-size: 14px;
  }
  .book-flash-content-wrap-secondline span {
    background: #e7f4ff;
    padding: 8px;
  }
  .book-flash-content-wrap-secondline span:last-child {
    margin-left: 66px;
  }

  /* 公共部分的样式 */
  .book-common-solve-title {
    color: #0377d9;
    font-size: 14px;
    font-weight: bold;
  }

  img {
    box-shadow: 1px 1px 2px 2px #eee;
  }
  .book-server-ware {
    color: #ff0000;
    font-size: 16px;
    cursor: pointer;
    margin-left: 20px;
  }
</style>
