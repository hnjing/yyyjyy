<template>
  <div class="mobile-intro">
    <div class="intro-header">
      <div class="title">益安应急救援官网</div>
    </div>

    <div class="intro-card">
      <img
        class="logo-img"
        src="/src/assets/logo/logo-yian.png"
        style="width: 88px; margin-right: 10px"
        alt=""
      />
      <p>
        益安救援队是一支扎根民间的纯公益志愿组织，始终秉持“人道为先、奉献为本”的核心精神，以无偿守护生命安全为使命，成为社会应急体系的重要补充力量。
      </p>
      <p>
        队伍汇聚了一批热爱公益、具备专业技能的志愿者，聚焦应急救援与安全宣教两大核心领域：在突发灾情与意外现场，无论是水域搜救、走失人员寻找，还是自然灾害应急响应，队员们皆闻令而动、专业施救，用快速响应筑牢生命防线；在日常公益服务中，通过“案例警示+实操教学”的模式，深入社区、学校、企业开展防灾减灾、急救技能等宣讲培训，让安全知识惠及更多群众。
      </p>
      <p>
        自成立以来，益安救援队始终恪守无偿服务原则，不收取任何救援费用，以“救在急时、防在平时”的担当，用坚守与奉献传递温暖力量，为构建平安和谐社会持续注入民间志愿活力。
      </p>
      <p> 官网地址：http://www.yiansos.com/ </p>
    </div>
  </div>
</template>

<script setup>
  // 简单静态展示组件，无业务逻辑
</script>

<style scoped lang="scss">
  .mobile-intro {
    width: 100%;
    padding: 16px;
    box-sizing: border-box;
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
    .intro-header {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12px;
      .title {
        color: #fff;
        font-size: 32px;
        font-weight: 700;
        letter-spacing: 1px;
      }
    }

    .intro-card {
      background: linear-gradient(180deg, #2f4568 0%, #23354f 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 16px;
      box-sizing: border-box;
      color: #f3f6fa;
      border-radius: 8px;
      font-size: 14px;
      line-height: 1.6;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      p {
        margin: 8px 0;
        text-indent: 1em; // 添加这行
      }
    }
  }
</style>
