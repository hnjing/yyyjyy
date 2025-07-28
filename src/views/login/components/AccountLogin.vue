<template>
  <div class="login-body">
    <!-- <div class="switch-corner">
      <img
        src="@/assets/login/loginType_2.png"
        class="switch-icon"
        @click="switchToUKey"
      />
    </div> -->
    <el-text>账号登录</el-text>
    <div class="form-padding"></div>

    <el-form
      ref="formRef"
      size="large"
      :model="form"
      :rules="rules"
      @keyup.enter="submit"
      @submit.prevent
      class="login-form"
    >
      <el-form-item prop="username">
        <el-input
          clearable
          v-model="form.username"
          placeholder="请输入登录账号"
          class="form-input specialInput"
        >
          <template #prefix>
            <img
              src="@/assets/login/form_user.png"
              alt=""
              class="prefix-icon"
            />
            <div class="form_line"></div>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          show-password
          v-model="form.password"
          placeholder="请输入登录密码"
          class="form-input specialInput"
        >
          <template #prefix>
            <img
              src="@/assets/login/form_password.png"
              alt=""
              class="prefix-icon"
            />
            <div class="form_line"></div>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="code" class="mb-10" v-if="captchaEnabled">
        <div class="login-captcha-group">
          <el-input
            v-model="form.code"
            placeholder="请输入验证码"
            class="form-input specialInput captcha-input"
          >
            <template #prefix>
              <img
                src="@/assets/login/form_captcha.png"
                alt=""
                class="prefix-icon"
              />
              <div class="form_line"></div>
            </template>
            <template #suffix>
              <div class="login-captcha" @click="changeCaptcha">
                <img v-if="captcha" :src="captcha" />
              </div>
            </template>
          </el-input>
        </div>
      </el-form-item>
      <el-form-item>
        <div class="flex-between">
          <el-checkbox v-model="form.remember" class="remember-check">
            <span class="remember-text">记住密码</span>
          </el-checkbox>
          <span class="forget-password" @click="handleForgetPassword"
            >忘记密码</span
          >
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          size="large"
          type="primary"
          class="login-button"
          :loading="loading"
          @click="submit"
        >
          登录
        </el-button>
        <!-- <div style="display: flex; justify-content: center; width: 100%">
          <img
            src="@/assets/login/ukeyLogin.png"
            style="height: 48px; margin-top: 18px; cursor: pointer"
            @click="goUkeyLogin"
          />
        </div> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
  import { getCaptcha, login } from '@/api/login';
  import { encrypt, decrypt } from '@/utils/jsencrypt';
  import { EleMessage } from '@hnjing/zxzy-admin-plus';
  import { reactive, ref, onMounted } from 'vue';

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

  const emit = defineEmits(['switchTab', 'resetPassword']);

  /** 表单 */
  const formRef = ref(null);

  /** 加载状态 */
  const loading = ref(false);

  /** 表单数据 */
  const form = reactive({
    username: '',
    password: '',
    code: '',
    uuid: '',
    remember: false
  });

  /** 表单验证规则 */
  const rules = reactive({
    username: [
      {
        required: true,
        message: '请输入登录账号',
        type: 'string',
        trigger: ['blur', 'change']
      }
    ],
    password: [
      {
        required: true,
        message: '请输入登录密码',
        type: 'string',
        trigger: ['blur', 'change']
      }
    ],
    code: [
      {
        required: true,
        message: '请输入验证码',
        type: 'string',
        trigger: ['blur', 'change']
      }
    ]
  });

  /** 图形验证码 */
  const captcha = ref('');
  const captchaEnabled = ref(false);

  const goUkeyLogin = () => {
    emit('switchTab', '2');
  };

  const handleForgetPassword = () => {
    EleMessage.warning('请联系管理员重置密码');
  };

  /** 获取图形验证码 */
  const changeCaptcha = () => {
    form.code = '';
    getCaptcha()
      .then((res) => {
        // captchaEnabled 如果是false,则不显示验证码
        captchaEnabled.value = res.data.captchaEnabled;
        captcha.value = 'data:image/gif;base64,' + res.data.img;
        form.uuid = res.data.uuid;
      })
      .catch((e) => {
        EleMessage.error(e);
      });
  };

  /** 密码登录 */
  const submit = () => {
    formRef.value?.validate?.((valid) => {
      if (!valid) {
        return false;
      }
      if (form.remember) {
        localStorage.setItem(
          'rememberPwd',
          JSON.stringify({
            username: encrypt(form.username),
            password: encrypt(form.password)
          })
        );
      } else {
        localStorage.removeItem('rememberPwd');
      }
      loading.value = true;
      const params = {
        username: form.username,
        password: form.password,
        code: form.code,
        uuid: form.uuid
        // clientId: props.clientId,
        // grantType: 'password'
      };
      console.log('登录参数====>', params);
      login(params)
        .then((res) => {
          if (res.code == 200) {
            EleMessage.success({ message: '登录成功', plain: true });
            props.cleanPageTabs();
            props.goHome();
            loading.value = false;
          } else {
            EleMessage.error(res.msg);
            loading.value = false;
            changeCaptcha();
          }
        })
        .catch((e) => {
          loading.value = false;
          EleMessage.error(e);
          changeCaptcha();
        });
    });
  };

  // 切换到扫码登录
  const switchToUKey = () => {
    emit('switchTab', '3');
  };

  onMounted(() => {
    if (localStorage.getItem('rememberPwd')) {
      let dd = JSON.parse(localStorage.getItem('rememberPwd'));
      form.remember = true;
      form.username = decrypt(dd.username);
      form.password = decrypt(dd.password);
    } else {
      form.remember = false;
    }

    changeCaptcha();
  });

  // 暴露方法供父组件调用
  defineExpose({
    changeCaptcha
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

    :deep(.el-checkbox) {
      height: auto;

      .el-checkbox__label {
        color: inherit;
      }
    }
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

  .form-padding {
    padding: 5px 0;
  }

  .login-form {
    margin: 0 40px;
  }

  .form-input {
    height: 50px;
  }

  .prefix-icon {
    width: 16px;
    height: 18px;
  }

  .mb-10 {
    margin-bottom: 10px !important;
  }

  .captcha-input {
    padding-right: 0;
  }

  .flex-between {
    display: flex;
    justify-content: space-between;
    width: 100%;
    color: #5280fb;
  }

  .remember-check {
    color: #5280fb;
  }

  .remember-text {
    font-size: 16px;
  }

  .forget-password {
    cursor: pointer;
    font-size: 16px;
  }

  .login-button {
    width: 100%;
    height: 52px;
    font-size: 22px;
    margin-top: -10px;
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

  /* 验证码 */
  .login-captcha-group {
    width: 100%;
    display: flex;
    align-items: center;

    :deep(.el-input) {
      flex: 1;
    }

    .login-captcha {
      height: 40px;
      background-image: linear-gradient(to right, #c1c1c1, #fafafa);
      border-radius: 5px;
      cursor: pointer;
      margin-left: 10px;
      transform: translate(6px);
      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        display: block;
      }

      &:hover {
        border-color: hsla(0, 0%, 60%, 0.8);
      }
    }

    :deep(.el-input__prefix-inner > .el-icon) {
      transform: scale(1.16);
    }
  }
</style>
