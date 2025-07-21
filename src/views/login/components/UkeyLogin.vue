<template>
  <div class="login-body">
    <div class="switch-corner">
      <img
        src="@/assets/login/loginType_1.png"
        class="switch-icon"
        @click="$emit('switchTab', '1')"
      />
    </div>
    <el-text>
      <span class="ukey-text">UKey</span>
      <span class="login-text">登录</span>
    </el-text>
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
      <el-form-item>
        <img
          class="ukey-image"
          src="@/assets/login/ukey_1.png"
          alt=""
          v-if="!ukeyStatus"
        />
        <img class="ukey-image" src="@/assets/login/ukey_2.png" alt="" v-else />
      </el-form-item>
      <el-form-item prop="code">
        <div class="login-captcha-group">
          <el-input
            v-model="form.code"
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
              <div class="login-captcha" @click="changeCaptcha">
                <img v-if="captcha" :src="captcha" class="captcha-img" />
              </div>
            </template>
          </el-input>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button
          size="large"
          class="custom-info ukey-button initialize-button"
          @click="initialize"
          v-if="!ukeyStatus"
        >
          插入UKey ，点击登录
        </el-button>
        <el-button
          v-else
          size="large"
          class="custom-primary ukey-button"
          :loading="loading"
          @click="submit"
        >
          连接成功，点击登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
  import { getCodeImg, loginUkey } from '@/api/login';
  import { EleMessage } from '@hnjing/zxzy-admin-plus';
  import { reactive, ref, onMounted } from 'vue';

  const emit = defineEmits(['switchTab']);

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

  /** 表单 */
  const formRef = ref(null);

  /** 加载状态 */
  const loading = ref(false);
  const ukeyStatus = ref(false);

  /** 表单数据 */
  const form = reactive({
    code: '',
    uuid: '',
    ukey: ''
  });

  /** 表单验证规则 */
  const rules = reactive({
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

  /** 获取图形验证码 */
  const changeCaptcha = () => {
    form.code = '';
    getCodeImg()
      .then((res) => {
        captcha.value = 'data:image/gif;base64,' + res.data.img;
        form.uuid = res.data.uuid;
      })
      .catch((e) => {
        EleMessage.error(e);
      });
  };

  /** UKey登录 */
  const submit = () => {
    formRef.value?.validate?.((valid) => {
      if (!valid) {
        return false;
      }
      if (!form.ukey) {
        initialize();
        return;
      }
      loading.value = true;
      const params = {
        ukey: form.ukey,
        code: form.code,
        uuid: form.uuid,
        clientId: props.clientId
      };
      loginUkey(params)
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

  // UKey登录
  const initialize = async () => {
    const ws = new WebSocket('ws://127.0.0.1:54321');
    ws.onopen = () => {
      if (ws.readyState === WebSocket.OPEN) {
        console.log('已连接');
        const guid = Date.parse(new Date()); //建议使用Guid
        const data = { api: 'Api_UKey_GetSerial', id: guid, body: [] };
        ws.send(JSON.stringify(data));
      } else {
        console.log('Websocket未连接');
        EleMessage.error('请检查U盾是否连接');
      }
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.api == 'Api_UKey_GetSerial') {
        if (data.body.Result) {
          ukeyStatus.value = true;
          form.ukey = data.body.Data;
          return;
        }
        ukeyStatus.value = false;
        EleMessage.warning(data.body.Message);
      }
    };
  };

  onMounted(() => {
    changeCaptcha();
    // 组件挂载时自动初始化UKey连接
    initialize();
  });

  // 暴露方法供父组件调用
  defineExpose({
    initialize,
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

  .login-form {
    margin: 0 40px;
  }

  .ukey-image {
    width: 309px;
    height: 151px;
    margin: 0 auto;
    margin-bottom: 20px;
  }

  .form-input {
    height: 50px;
  }

  .prefix-icon {
    width: 16px;
    height: 18px;
  }

  .captcha-img {
    width: 100%;
    height: 40px;
  }

  .ukey-button {
    width: 100%;
    height: 52px;
    font-size: 22px;
  }

  .initialize-button {
    background: #f0f3f8;
    border: 1px solid #f0f3f8;
    color: #718ebf;
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
