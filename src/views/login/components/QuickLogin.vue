<template>
  <div class="model" v-if="showQuick">
    <div class="ewm">
      <h3 style="font-size: 16px">快捷登录</h3>
      <el-collapse v-model="openCollapse" style="margin-bottom: 20px">
        <el-collapse-item name="1">
          <template #title>
            <span
              style="
                color: #4643c0;
                flex: 1;
                margin-left: 5px;
                overflow: hidden;
              "
              >A医院</span
            >
          </template>
          <dd @click="doQuickLogin('13712345678')">管理员：陈主任</dd>
          <dd @click="doQuickLogin('13812345678')">普通成员：柯秘书</dd>
        </el-collapse-item>
        <el-collapse-item name="3">
          <template #title>
            <span
              style="
                color: #4643c0;
                flex: 1;
                margin-left: 5px;
                overflow: hidden;
              "
              >B医院</span
            >
          </template>
          <dd @click="doQuickLogin('aydefy_admin')">机构主任</dd>
          <dd @click="doQuickLogin('aydefy_user')">机构秘书</dd>
        </el-collapse-item>
        <el-collapse-item name="2">
          <template #title>
            <span
              style="
                color: #4643c0;
                flex: 1;
                margin-left: 5px;
                overflow: hidden;
              "
              >系统运营</span
            >
          </template>
          <dd @click="doQuickLogin('admin')">运营：管理员</dd>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script setup>
  import { reactive, ref } from 'vue';
  import { quickLogin } from '@/api/login';
  import { EleMessage } from '@hnjing/zxzy-admin-plus';
  import { usePageTab } from '@/utils/use-page-tab';

  const { cleanPageTabs } = usePageTab();

  const props = defineProps({
    showQuick: {
      type: Boolean,
      default: false
    },
    goHome: {
      type: Function,
      required: true
    },
    clientId: {
      type: String,
      default: 'e5cd7e4891bf95d1d19206ce24a7b32e'
    }
  });

  const openCollapse = reactive(['1', '2', '3']);

  /** 快捷登录 */
  const doQuickLogin = (phone) => {
    const params = {
      phone,
      clientId: props.clientId
    };
    quickLogin(params)
      .then(() => {
        EleMessage.success({ message: '快捷登录成功', plain: true });
        cleanPageTabs();
        props.goHome();
      })
      .catch((e) => {
        EleMessage.error(e);
      });
  };
</script>

<style lang="scss" scoped>
  .model {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 999;
  }
  .ewm {
    width: 124px;
    background: #ffffff;
    border-color: #513a29;
    border-radius: 10px;
    margin: -9px auto 0;
    padding: 20px 15px 1px 15px;
    color: #ffffff;
    font-size: 12px;
    cursor: pointer;
    box-shadow: 0px 2px 6px 0px rgba(47, 45, 59, 0.21);
  }
  .ewm h3 {
    margin: 0;
    font-size: 14px;
    color: #2d2661;
    margin-left: 18px;
    margin-bottom: 10px;
  }
  .ewm dt {
    font-weight: bold;
    line-height: 20px;
  }
  .ewm dd {
    margin-left: 0;
    line-height: 25px;
    margin-left: 18px;
  }
  .ewm dd:hover {
    color: #4643c0;
    text-decoration: underline;
  }
  :deep(.ewm .el-collapse) {
    border: none;
    --ele-collapse-border-color: transparent;
  }
  :deep(.ewm .el-collapse .el-icon) {
    color: #4643c0;
    margin: 0;
  }
  :deep(.ewm .el-collapse-item__header) {
    height: 30px;
    flex-direction: row-reverse;
    text-align: left;
    overflow: hidden !important;
  }
  :deep(.ewm .el-collapse-item__content) {
    padding-bottom: 0;
  }
  :deep(.el-collapse-item__wrap) {
    border-bottom: none;
  }
</style>
