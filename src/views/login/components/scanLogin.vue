<!-- 编辑弹窗 -->
<template>
  <ele-modal
    form
    :width="550"
    :model-value="modelValue"
    title="绑定账号"
    @update:modelValue="updateModelValue"
  >
    <div>
      <el-form ref="formRef" :model="form" :rules="rules">
        <el-form-item prop="username">
          <el-input
            clearable
            v-model="form.username"
            placeholder="请输入登录账号"
            style="height: 50px"
            class="specialInput"
          >
            <template #prefix>
              <img
                src="@/assets/login/form_user.png"
                alt=""
                style="width: 16px; height: 18px"
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
            style="height: 50px"
            class="specialInput"
          >
            <template #prefix>
              <img
                src="@/assets/login/form_password.png"
                alt=""
                style="width: 16px; height: 18px"
              />
              <div class="form_line"></div>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="code" style="margin-bottom: 10px !important">
          <div class="login-captcha-group">
            <el-input
              v-model="form.code"
              placeholder="请输入验证码"
              style="padding-right: 0; height: 50px"
              class="specialInput"
            >
              <template #prefix>
                <img
                  src="@/assets/login/form_captcha.png"
                  alt=""
                  style="width: 16px; height: 18px"
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
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <div>
          <el-button type="info" @click="onClose">取 消</el-button>
          <el-button type="primary" :loading="loading" @click="submit">
            确 定
          </el-button>
        </div>
      </div>
    </template>
  </ele-modal>
</template>

<script setup>
  import { getCodeImg, bindLogin, check, unbindUser } from '@/api/login';
  import { ElMessage, ElMessageBox } from 'element-plus';
  import { ref, reactive, unref, onMounted } from 'vue';
  import { setToken } from '@/utils/token-util';
  import { useRouter } from 'vue-router';
  import { usePageTab } from '@/utils/use-page-tab';
  // import { EleMessage } from 'ele-admin-plus/es';
  import { EleMessage } from '@hnjing/zxzy-admin-plus/es';
  import { nextTick } from 'vue';
  import { encrypt, decrypt } from '@/utils/jsencrypt';

  // eslint-disable-next-line no-unused-vars
  const emit = defineEmits(['update:modelValue', 'done', 'switchTab']);
  // eslint-disable-next-line no-unused-vars
  const props = defineProps({
    // 弹窗是否打开
    modelValue: Boolean,
    openid: String,
    clientId: {
      type: String,
      default: 'e5cd7e4891bf95d1d19206ce24a7b32e'
    }
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
  // nextTick(() => {
  //   changeCaptcha();
  // });
  onMounted(() => {
    changeCaptcha();
  });

  // 暴露方法供父组件调用
  defineExpose({
    changeCaptcha
  });
  // const captcha = ref(null);
  // const changeCaptcha = () => {
  //   form.code = '';
  //   form.num = new Date().getTime();
  //   captcha.value = `${import.meta.env.VITE_APP_BASE_API}/captcha.jpg?num=${
  //     form.num
  //   }`;
  // };
  const submit = () => {
    formRef.value?.validate?.(async (valid) => {
      if (!valid) {
        return false;
      }
      loading.value = true;
      let data = {
        ...form,
        openId: props.openid,
        // captcha: form.code,
        clientId: props.clientId
      };
      // data.password = encrypt(form.password);
      console.log('绑定提交参数====>', data);
      bindWxLogin(data);
      return;
    });
  };
  const bindWxLogin = (data) => {
    bindLogin(data).then((res) => {
      if (res.code == 200) {
        const msg = res.data.password
          ? `微信绑定账号成功，系统的初始密码是：${res.data.password}，请您牢记！`
          : `微信绑定账号成功！`;
        ElMessageBox.confirm(msg, '提醒', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async () => {
            // setToken(res.data.token);
            loading.value = false;
            goHome();
          })
          .catch(() => {
            loading.value = false;
            changeCaptcha();
          });

        return;
      }
      loading.value = false;
      EleMessage.error(res.msg);
    });
  };
  const unbundle = (data) => {
    ElMessageBox.confirm(
      '当前手机号已绑定其他微信，是否解除原来绑定的微信？',
      '提醒',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
      .then(async () => {
        const unbindUserData = await unbindUser(data);
        if (unbindUserData.code == 200) {
          bindWxLogin(data);
          return;
        }
        changeCaptcha();
        EleMessage.error(unbindUserData.msg);
      })
      .catch(() => {
        loading.value = false;
      });
  };
  const { goHomeRoute } = usePageTab();
  const { currentRoute } = useRouter();
  const goHome = () => {
    const { query } = unref(currentRoute);
    goHomeRoute(query.from);
  };
  const codeNum = ref(60);
  const timeOut = ref(null);

  const onClose = () => {
    emit('done');
    updateModelValue(false);
  };
  const updateModelValue = (value) => {
    emit('update:modelValue', value);
  };
  // 提交状态
  const loading = ref(false);
  const formRef = ref(null);

  // 表单数据
  const form = reactive({});

  // 表单验证规则
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
</script>

<style lang="scss" scoped>
  .codeButton {
    cursor: pointer;
    padding: 0 15px;
    height: 46px;
    line-height: 46px;
    border-radius: 5px;
    background: #04bbef;
    color: #ffffff;
  }
  .specialInput {
    --ele-input-focus-shadow: 0 0 0 1px #5280fb;
    --ele-input-focus-border: 1px solid #5280fb;
    --ele-input-hover-border: 1px solid #5280fb;
    --ele-input-hover-shadow: 0 0 0 1px #5280fb;
  }
  .login-captcha-group {
    width: 100%;
    display: flex;
    align-items: center;

    :deep(.el-input) {
      flex: 1;
    }

    .login-captcha {
      height: 40px;
      // border: 1px solid #eee;
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
