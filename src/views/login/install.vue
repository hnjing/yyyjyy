<template>
  <div class="book">
    <!-- 标题 -->
    <div class="book-title">
      <div class="book-title-content"> 驱动安装说明 </div>
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
          <p class="book-iden-content-header-name">点击右上角【常见问题】</p>
        </div>
        <!-- 具体内容 -->
        <div class="book-iden-content-wrap">
          <img
            :src="one"
            class="book-iden-content-wrap-img"
            style="margin-top: 30px; width: 500px"
          />
        </div>

        <!-- 标题 -->
        <div class="book-iden-content-header">
          <div class="book-iden-content-header-num">2</div>
          <p class="book-iden-content-header-name">点击【点击下载驱动】</p>
        </div>
        <!-- 具体内容 -->
        <div class="book-iden-content-wrap">
          <img
            :src="two"
            class="book-iden-content-wrap-img"
            style="margin-top: 30px; width: 500px"
          />
        </div>

        <!-- 标题 -->
        <div class="book-iden-content-header">
          <div class="book-iden-content-header-num">3</div>
          <p class="book-iden-content-header-name">下载完成，点击打开文件</p>
        </div>
        <!-- 具体内容 -->
        <div class="book-iden-content-wrap">
          <img
            :src="three"
            class="book-iden-content-wrap-img"
            style="margin-top: 30px; width: 500px"
          />
        </div>

        <!-- 标题 -->
        <div class="book-iden-content-header">
          <div class="book-iden-content-header-num">4</div>
          <p class="book-iden-content-header-name"
            >Windows保护，点击【更多信息】</p
          >
        </div>
        <!-- 具体内容 -->
        <div class="book-iden-content-wrap">
          <img
            :src="four"
            class="book-iden-content-wrap-img"
            style="margin-top: 30px; width: 500px"
          />
        </div>

        <!-- 标题 -->
        <div class="book-iden-content-header">
          <div class="book-iden-content-header-num">5</div>
          <p class="book-iden-content-header-name">点击【仍然运行】</p>
        </div>
        <!-- 具体内容 -->
        <div class="book-iden-content-wrap">
          <img
            :src="five"
            class="book-iden-content-wrap-img"
            style="margin-top: 30px; width: 500px"
          />
        </div>

        <!-- 标题 -->
        <div class="book-iden-content-header">
          <div class="book-iden-content-header-num">6</div>
          <p class="book-iden-content-header-name">点击【安装】</p>
        </div>
        <!-- 具体内容 -->
        <div class="book-iden-content-wrap">
          <img
            :src="six"
            class="book-iden-content-wrap-img"
            style="margin-top: 30px; width: 500px"
          />
        </div>

        <!-- 标题 -->
        <div class="book-iden-content-header">
          <div class="book-iden-content-header-num">7</div>
          <p class="book-iden-content-header-name"
            >勾选【记住我的选择】，点击【允许】（没有腾讯电脑管家不会有，若安装了360提示请一样勾选【记住我的选择】，点击允许）</p
          >
        </div>
        <!-- 具体内容 -->
        <div class="book-iden-content-wrap">
          <img
            :src="seven"
            class="book-iden-content-wrap-img"
            style="margin-top: 30px; width: 500px"
          />
        </div>

        <!-- 标题 -->
        <div class="book-iden-content-header">
          <div class="book-iden-content-header-num">8</div>
          <p class="book-iden-content-header-name"
            >勾选【运行】Farinfo.ToolServices(R)，点击【完成】</p
          >
        </div>
        <!-- 具体内容 -->
        <div class="book-iden-content-wrap">
          <img
            :src="eight"
            class="book-iden-content-wrap-img"
            style="margin-top: 30px; width: 500px"
          />
        </div>

        <!-- 标题 -->
        <div class="book-iden-content-header">
          <div class="book-iden-content-header-num">9</div>
          <p class="book-iden-content-header-name"
            >点击【确定】，点击【⎯】最小化服务运行框，勿关闭</p
          >
        </div>
        <!-- 具体内容 -->
        <div class="book-iden-content-wrap">
          <img
            :src="nine"
            class="book-iden-content-wrap-img"
            style="margin-top: 30px; width: 500px"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
  import { nextTick } from 'vue';
  import one from '@/assets/guidance/install/37097dd6638f7b7dc978123e155a809.png';
  import two from '@/assets/guidance/install/9555d6eaccbbbb6ed6310517a75adf3.png';
  import three from '@/assets/guidance/install/3fac3e4794b85b0c30fdb74cdb26581.png';
  import four from '@/assets/guidance/install/da89b7881ce0e1de31900154cf3219f.png';
  import five from '@/assets/guidance/install/9200df91147bf318e4c8016fd3bf11e.png';
  import six from '@/assets/guidance/install/4b9ac3f9feeeea0fb38834801ccdf71.png';
  import seven from '@/assets/guidance/install/ef39dad71e30083fbdc74222de749c5.png';
  import eight from '@/assets/guidance/install/847c7c3270822893355abd1a393a63d.png';
  import nine from '@/assets/guidance/install/eb95e8bff411fdd497bd7fa9a49231e.png';

  nextTick(() => {
    document.body.scrollTop = document.documentElement.scrollTop = 0;
  });
  const donwloadWare = () => {
    window.location.href =
      'https://ibank.frp.520gcp.com/sms/Farinfo.ToolServices_Setup_2023.1.1.1.exe';
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
