<template>
  <div class="login-body">
    <div class="switch-corner">
      <img
        src="@/assets/login/loginType_2.png"
        class="switch-icon"
        @click="switchToUKey"
      />
    </div>
    <el-text>重置密码</el-text>
    <div class="form-padding"></div>

    <el-form
      ref="formRef"
      size="large"
      :model="form"
      :rules="rules"
      @keyup.enter="reset"
      @submit.prevent
      class="login-form"
    >
      <el-form-item prop="phone">
        <el-input
          clearable
          v-model="form.phone"
          placeholder="请输入手机号码"
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
      <el-form-item prop="smsCode">
        <el-input
          v-model="form.smsCode"
          placeholder="请输入验证码"
          class="form-input specialInput"
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
            <el-button
              size="small"
              class="sms-button"
              @click="getSmsCode"
              :disabled="smsLoading"
            >
              <span v-if="!smsLoading">获取验证码</span>
              <span v-else>重新发送（{{ smsCount }}s）</span>
            </el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="newPassword">
        <el-input
          clearable
          v-model="form.newPassword"
          placeholder="新密码"
          type="password"
          show-password
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
      <el-form-item prop="affirmPassword">
        <el-input
          clearable
          v-model="form.affirmPassword"
          placeholder="确认密码"
          type="password"
          show-password
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
      <el-form-item>
        <el-button
          size="large"
          type="primary"
          class="custom-primary login-button"
          :loading="loading"
          @click="reset"
        >
          重置密码
        </el-button>
      </el-form-item>
      <el-form-item>
        <div class="login-option-container">
          <span
            class="login-link"
            @click="$emit('backToLogin')"
          >直接登录</span>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { verifyPhone, forgotPassword, sendSms } from '@/api/login';
import { EleMessage } from '@hnjing/zxzy-admin-plus';
import { reactive, ref } from 'vue';
import { debounce } from 'lodash';

const emit = defineEmits(['switchTab', 'backToLogin']);

/** 表单 */
const formRef = ref(null);

/** 加载状态 */
const loading = ref(false);
const smsLoading = ref(false);
const smsCount = ref(60);

/** 表单数据 */
const form = reactive({
  phone: '',
  smsCode: '',
  tempCheckCode: '',
  newPassword: '',
  affirmPassword: ''
});

/** 表单验证规则 */
const rules = reactive({
  phone: [
    {
      required: true,
      message: '请输入手机号码',
      type: 'string',
      trigger: ['blur', 'change']
    }
  ],
  smsCode: [
    {
      required: true,
      message: '请输入短信验证码',
      type: 'string',
      trigger: ['blur', 'change']
    }
  ],
  newPassword: [
    {
      required: true,
      message: '请输入新密码',
      type: 'string',
      trigger: ['blur', 'change']
    },
    {
      validator: (rule, value, callback) => {
        // 密码规则：必须包含字母、数字、符号中的任意2种，不得少于6位数
        const pattern =
          /^(?=.*[a-zA-Z])(?=.*\d)|(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),.?":{}|<>])|(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
        if (!pattern.test(value)) {
          callback(
            new Error(
              '密码必须包含字母、数字、符号中的任意2种，不得少于6位数'
            )
          );
        } else {
          callback();
        }
      },
      trigger: ['blur', 'change']
    }
  ],
  affirmPassword: [
    {
      required: true,
      message: '请再次输入新密码',
      type: 'string',
      trigger: ['blur', 'change']
    },
    {
      validator: (rule, value, callback) => {
        if (value !== form.newPassword) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          // 密码规则：必须包含字母、数字、符号中的任意2种，不得少于6位数
          const pattern =
            /^(?=.*[a-zA-Z])(?=.*\d)|(?=.*[a-zA-Z])(?=.*[!@#$%^&*(),.?":{}|<>])|(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
          if (!pattern.test(value)) {
            callback(
              new Error(
                '密码必须包含字母、数字、符号中的任意2种，不得少于6位数'
              )
            );
          } else {
            callback();
          }
        }
      },
      trigger: ['blur', 'change']
    }
  ]
});

const getSmsCode = debounce(() => {
  formRef.value?.validateField('phone', async (valid) => {
    if (!valid) {
      return;
    }
    const res = await verifyPhone(form.phone);
    console.log(res);
    if (res.code != 200) {
      EleMessage.error(res.msg);
      return;
    }
    if (!res.data) {
      EleMessage.error('手机号不存在');
      return;
    }
    smsLoading.value = true;

    sendSms(form.phone).then((result) => {
      
      console.log(result.data);
      if (result.code == 200) {
        EleMessage.success('短信发送成功');
        form.smsCode = result.data.smsCode;
        form.tempCheckCode = result.data.tempCheckCode;
        return;
      }
      EleMessage.error(result.msg);
    });
    const timer = setInterval(() => {
      smsCount.value--;
      if (smsCount.value <= 0) {
        clearInterval(timer);
        smsLoading.value = false;
        smsCount.value = 60;
      }
    }, 1000);
  });
}, 500);

const reset = () => {
  formRef.value?.validate?.((valid) => {
    if (!valid) {
      return false;
    }
    loading.value = true;
    const params = {
      phone: form.phone,
      smsCode: form.smsCode,
      tempCheckCode: form.tempCheckCode,
      newPassword: form.newPassword
    };
    forgotPassword(params).then((res) => {
      console.log(res);
      if (res.code == 200) {
        EleMessage.success('密码重置成功');
        emit('backToLogin');
        loading.value = false;
      } else {
        EleMessage.error(res.msg);
        loading.value = false;
      }
    });
  });
};

// 切换到UKey登录
const switchToUKey = () => {
  emit('switchTab', '2');
};
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

.sms-button {
  margin-left: 10px;
  border: none;
  color: #517bff;
  font-size: 16px;
  transform: translateX(10px);
}

.login-button {
  width: 100%;
  height: 52px;
  font-size: 22px;
}

.login-option-container {
  display: flex;
  justify-content: center;
  width: 100%;
  color: #5280fb;
  transform: translateY(-15px);
}

.login-link {
  cursor: pointer;
  font-size: 16px;
}

:deep(.el-text) {
  font-size: 34px;
  color: #3B426F;
  text-align: center;
  letter-spacing: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 400 !important;
}
</style> 