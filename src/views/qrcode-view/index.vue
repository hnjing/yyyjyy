<template>
  <div class="qrcode-root">
    <div class="qrcode-container">
      <!-- 顶部标题栏 -->
      <header class="qrcode-header">
        <span class="qrcode-header-title">
          益阳紧急救援中心
          <span class="qrcode-header-icon" @click="callCenter">
            <svg width="18" height="18" viewBox="0 0 512 512">
              <path
                fill="#fff"
                d="M391 351c-13 0-26-2-38-6-12-4-25-1-34 8l-54 41c-52-27-94-69-121-121l41-54c9-9 12-22 8-34-4-12-6-25-6-38 0-19-15-34-34-34H89c-19 0-34 15-34 34 0 177 144 321 321 321 19 0 34-15 34-34v-56c0-19-15-34-34-34z"
              />
            </svg>
          </span>
        </span>
      </header>
      <!-- 人员信息卡片 -->
      <main class="qrcode-main">
        <div class="qrcode-card">
          <!-- 头像和基本信息 -->
          <div class="qrcode-profile">
            <div class="qrcode-avatar-wrap">
              <img class="qrcode-avatar" :src="person.avatar" alt="头像" />
              <span class="qrcode-avatar-check">
                <svg width="14" height="14" viewBox="0 0 1024 1024">
                  <path
                    fill="#fff"
                    d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.2 0-372-166.8-372-372s166.8-372 372-372 372 166.8 372 372-166.8 372-372 372zm-56-232.6l-120-120c-12.4-12.4-12.4-32.8 0-45.2s32.8-12.4 45.2 0l97.4 97.4 193.4-193.4c12.4-12.4 32.8-12.4 45.2 0s12.4 32.8 0 45.2l-216 216c-12.4 12.4-32.8 12.4-45.2 0z"
                  />
                </svg>
              </span>
            </div>
            <div class="qrcode-profile-info">
              <div class="qrcode-profile-name">{{ person.name }}</div>
              <div class="qrcode-profile-row">
                <span class="qrcode-profile-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24">
                    <path
                      fill="#2563eb"
                      d="M12 12c2.7 0 5-2.2 5-5s-2.3-5-5-5-5 2.2-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"
                    />
                  </svg>
                </span>
                <span>{{ person.gender }}</span>
                <span class="qrcode-profile-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24">
                    <path
                      fill="#2563eb"
                      d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7zm0 9.5A2.5 2.5 0 1 0 12 6a2.5 2.5 0 0 0 0 5.5z"
                    />
                  </svg>
                </span>
                <span>{{ person.age }}岁</span>
                <span class="qrcode-profile-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24">
                    <path
                      fill="#2563eb"
                      d="M12 2C7.03 2 2.5 6.03 2.5 11c0 4.97 4.53 9 9.5 9s9.5-4.03 9.5-9c0-4.97-4.53-9-9.5-9zm0 16c-3.87 0-7-3.13-7-7 0-3.87 3.13-7 7-7s7 3.13 7 7c0 3.87-3.13 7-7 7z"
                    />
                  </svg>
                </span>
                <span>{{ person.bloodType }}</span>
              </div>
              <div class="qrcode-profile-row qrcode-profile-id">
                <span class="qrcode-profile-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24">
                    <path
                      fill="#2563eb"
                      d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"
                    />
                  </svg>
                </span>
                <span>救援编号: {{ person.rescueId }}</span>
              </div>
            </div>
          </div>
          <!-- 详细信息 -->
          <div class="qrcode-section">
            <div class="qrcode-section-title">
              <span class="qrcode-section-icon">
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path
                    fill="#2563eb"
                    d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.11-.21c1.21.49 2.53.76 3.88.76a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.07 21 3 13.93 3 5a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.35.27 2.67.76 3.88a1 1 0 0 1-.21 1.11l-2.2 2.2z"
                  />
                </svg>
              </span>
              联系方式
            </div>
            <div class="qrcode-section-content">
              <div>手机: {{ person.phone }}</div>
              <div
                >紧急联系人: {{ person.emergencyContact.name }} ({{
                  person.emergencyContact.phone
                }})</div
              >
            </div>
          </div>
          <div class="qrcode-section">
            <div class="qrcode-section-title">
              <span class="qrcode-section-icon">
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path
                    fill="#2563eb"
                    d="M18.92 5.01C18.72 4.42 18.15 4 17.5 4h-11c-.65 0-1.22.42-1.42 1.01L3 7v13c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7l-1.08-1.99zM5.12 6h13.76l.93 2H4.19l.93-2zM19 20H5V8h14v12z"
                  />
                </svg>
              </span>
              车辆信息
            </div>
            <div class="qrcode-section-content">
              <div>车牌号: {{ car.plate }}</div>
              <div>车辆类型: {{ car.type }}</div>
              <img class="qrcode-car-img" :src="car.image" alt="救援车辆" />
            </div>
          </div>
          <div class="qrcode-section">
            <div class="qrcode-section-title">
              <span class="qrcode-section-icon">
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path
                    fill="#2563eb"
                    d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"
                  />
                </svg>
              </span>
              荣誉证书
            </div>
            <div class="qrcode-cert-list">
              <img
                v-for="(cert, idx) in certificates"
                :key="idx"
                :src="cert"
                :alt="'荣誉证书' + (idx + 1)"
                class="qrcode-cert-img"
              />
            </div>
          </div>
        </div>
        <!-- 救援经历 -->
        <div class="qrcode-card qrcode-exp-card">
          <div class="qrcode-section-title qrcode-exp-title">
            <span class="qrcode-section-icon">
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path
                  fill="#2563eb"
                  d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z"
                />
              </svg>
            </span>
            救援经历
          </div>
          <div>
            <div
              v-for="(exp, idx) in displayedExperiences"
              :key="idx"
              class="qrcode-exp-item"
            >
              <div class="qrcode-exp-row">
                <span class="qrcode-exp-title-text">{{ exp.title }}</span>
                <span class="qrcode-exp-date">{{ exp.date }}</span>
              </div>
              <div class="qrcode-exp-desc">{{ exp.desc }}</div>
            </div>
            <div
              v-if="!showAllExperience && experiences.length > 3"
              class="qrcode-exp-more"
            >
              <button
                class="qrcode-exp-more-btn"
                @click="showAllExperience = true"
                >展示全部</button
              >
            </div>
          </div>
        </div>
      </main>
      <!-- 底部操作栏 -->
      <footer class="qrcode-footer">
        <button class="qrcode-btn qrcode-btn-blue" @click="callEmergency">
          <span class="qrcode-btn-icon">
            <svg width="18" height="18" viewBox="0 0 512 512">
              <path
                fill="#fff"
                d="M391 351c-13 0-26-2-38-6-12-4-25-1-34 8l-54 41c-52-27-94-69-121-121l41-54c9-9 12-22 8-34-4-12-6-25-6-38 0-19-15-34-34-34H89c-19 0-34 15-34 34 0 177 144 321 321 321 19 0 34-15 34-34v-56c0-19-15-34-34-34z"
              />
            </svg>
          </span>
          紧急联系
        </button>
        <button class="qrcode-btn qrcode-btn-green" @click="callCenter">
          <span class="qrcode-btn-icon">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path
                fill="#fff"
                d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
              />
            </svg>
          </span>
          当前位置
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
  import { ref, computed } from 'vue';

  const person = ref({
    name: '张三',
    gender: '男',
    age: 32,
    bloodType: 'O型血',
    rescueId: 'RESC-2023-001',
    avatar:
      'https://design.gemcoder.com/staticResource/echoAiSystemImages/c1a60c5f6e7e18cc77177bc341302d61.png',
    phone: '138****1234',
    emergencyContact: {
      name: '李四',
      phone: '139****5678'
    }
  });

  const car = ref({
    plate: '湘H·A1234',
    type: '应急救援车',
    image:
      'https://design.gemcoder.com/staticResource/echoAiSystemImages/5a66353fe7591143da66740e8f188b57.png'
  });

  const certificates = ref([
    'https://design.gemcoder.com/staticResource/echoAiSystemImages/3edf9b31c98ab47fa1b8494520581111.png',
    'https://design.gemcoder.com/staticResource/echoAiSystemImages/ea22363ec87a5e639ede2d409cb88a53.png'
  ]);

  const experiences = ref([
    {
      title: '2023年抗洪抢险',
      date: '2023-07-15',
      desc: '在益阳市资阳区参与抗洪抢险工作，成功转移群众50余人'
    },
    {
      title: '2022年山林火灾',
      date: '2022-11-03',
      desc: '参与桃江县山林火灾扑救工作，连续奋战36小时'
    },
    {
      title: '2021年高速事故救援',
      date: '2021-05-20',
      desc: '参与长益高速重大交通事故救援，救助受伤人员20人'
    },
    {
      title: '2020年疫情防控',
      date: '2020-03-10',
      desc: '参与疫情防控物资运输，保障防疫一线物资供应'
    }
  ]);

  const showAllExperience = ref(false);
  const displayedExperiences = computed(() =>
    showAllExperience.value ? experiences.value : experiences.value.slice(0, 3)
  );

  function callEmergency() {
    window.alert(`正在拨打紧急联系人电话: ${person.value.phone}`);
  }
  function callCenter() {
    window.alert('正在拨打益阳紧急救援中心电话: 07374631999');
  }
</script>

<style scoped>
  .qrcode-root {
    min-height: 100vh;
    width: 100vw;
    background: #f5f7fa;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .qrcode-container {
    width: 100vw;
    max-width: 400px;
    min-height: 100vh;
    background: #fff;
    box-shadow: 0 4px 24px 0 rgba(0, 0, 0, 0.08);
    border-radius: 28px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }
  .qrcode-header {
    background: #2563eb;
    border-top-left-radius: 28px;
    border-top-right-radius: 28px;
    color: #fff;
    padding: 18px 0 14px 0;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
    position: relative;
  }
  .qrcode-header-title {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
  }
  .qrcode-header-icon {
    margin-left: 10px;
    cursor: pointer;
    display: flex;
    align-items: center;
  }
  .qrcode-main {
    flex: 1;
    padding: 0;
    width: 100%;
    background: transparent;
  }
  .qrcode-card {
    background: #fff;
    border-radius: 18px;
    margin: 0 16px;
    margin-top: -32px;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.03);
    position: relative;
    z-index: 2;
    padding-bottom: 8px;
  }
  .qrcode-profile {
    display: flex;
    align-items: center;
    padding: 32px 0 12px 0;
    border-bottom: 1px solid #f0f0f0;
    margin: 0 24px;
  }
  .qrcode-avatar-wrap {
    position: relative;
    width: 64px;
    height: 64px;
  }
  .qrcode-avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #2563eb;
  }
  .qrcode-avatar-check {
    position: absolute;
    right: -4px;
    bottom: -4px;
    background: #2563eb;
    border-radius: 50%;
    width: 22px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #fff;
  }
  .qrcode-profile-info {
    margin-left: 16px;
    flex: 1;
  }
  .qrcode-profile-name {
    font-size: 18px;
    font-weight: bold;
    color: #222;
    margin-bottom: 4px;
  }
  .qrcode-profile-row {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: #666;
    margin-bottom: 2px;
  }
  .qrcode-profile-icon {
    margin: 0 4px;
    display: flex;
    align-items: center;
  }
  .qrcode-profile-id {
    font-size: 12px;
    color: #888;
  }
  .qrcode-section {
    margin: 18px 0 0 0;
    padding: 0 24px;
  }
  .qrcode-section-title {
    font-size: 15px;
    font-weight: 600;
    color: #2563eb;
    display: flex;
    align-items: center;
    margin-bottom: 6px;
  }
  .qrcode-section-icon {
    margin-right: 7px;
    display: flex;
    align-items: center;
  }
  .qrcode-section-content {
    font-size: 15px;
    color: #444;
    margin-left: 24px;
    margin-bottom: 2px;
  }
  .qrcode-car-img {
    width: 100%;
    height: 90px;
    object-fit: cover;
    border-radius: 8px;
    margin-top: 8px;
  }
  .qrcode-cert-list {
    display: flex;
    gap: 8px;
    margin-left: 24px;
  }
  .qrcode-cert-img {
    width: 100px;
    height: 60px;
    object-fit: cover;
    border-radius: 8px;
    background: #f5f5f5;
  }
  .qrcode-exp-card {
    margin-top: 18px;
    margin-bottom: 90px;
    padding-bottom: 0;
  }
  .qrcode-exp-title {
    padding: 18px 24px 8px 24px;
    border-bottom: 1px solid #f0f0f0;
  }
  .qrcode-exp-item {
    padding: 12px 24px 8px 24px;
    border-bottom: 1px solid #f0f0f0;
  }
  .qrcode-exp-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2px;
  }
  .qrcode-exp-title-text {
    font-size: 15px;
    font-weight: 500;
    color: #222;
  }
  .qrcode-exp-date {
    font-size: 12px;
    color: #888;
  }
  .qrcode-exp-desc {
    font-size: 13px;
    color: #666;
    margin-top: 2px;
  }
  .qrcode-exp-more {
    text-align: center;
    padding: 8px 0 0 0;
  }
  .qrcode-exp-more-btn {
    background: none;
    border: none;
    color: #2563eb;
    font-size: 14px;
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
  }
  .qrcode-footer {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    border-top: 1px solid #e5e5e5;
    padding: 14px 0 14px 0;
    display: flex;
    justify-content: space-around;
    z-index: 10;
  }
  .qrcode-btn {
    display: flex;
    align-items: center;
    border: none;
    border-radius: 999px;
    font-size: 16px;
    font-weight: 600;
    padding: 10px 28px;
    cursor: pointer;
    box-shadow: 0 2px 8px 0 rgba(37, 99, 235, 0.08);
    transition: background 0.2s;
  }
  .qrcode-btn-blue {
    background: #2563eb;
    color: #fff;
  }
  .qrcode-btn-blue:active {
    background: #1746b0;
  }
  .qrcode-btn-green {
    background: #22c55e;
    color: #fff;
  }
  .qrcode-btn-green:active {
    background: #15803d;
  }
  .qrcode-btn-icon {
    margin-right: 8px;
    display: flex;
    align-items: center;
  }
  @media (max-width: 430px) {
    .qrcode-container {
      max-width: 100vw;
      border-radius: 0;
    }
    .qrcode-header {
      border-radius: 0;
    }
  }
</style>
