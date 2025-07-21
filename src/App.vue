<template>
  <el-config-provider :locale="elLocale">
    <ele-config-provider
      :locale="eleLocale"
      :table="tableConfig"
      :map-key="MAP_KEY"
      :license="LICENSE_CODE"
    >
      <ele-app>
        <router-view />
      </ele-app>
    </ele-config-provider>
  </el-config-provider>
</template>

<script setup>
  import { MAP_KEY, LICENSE_CODE } from '@/config/setting';
  import { useGlobalConfig } from '@/config/use-global-config';
  import { useThemeStore } from '@/store/modules/theme';
  import { useLocale } from '@/i18n/use-locale';
  import { storeToRefs } from 'pinia';
  import { watch } from 'vue';
  // import { useUserStore } from '@/store/modules/user';
  // import { updateUserSetting } from '@/api/common/index';

  /** 组件全局配置 */
  const { tableConfig } = useGlobalConfig();

  /** 恢复缓存主题 */
  const themeStore = useThemeStore();

  const { fontSize, tableSuit } = storeToRefs(themeStore);

  watch(
    () => fontSize.value,
    () => {
      if (
        fontSize.value !== null &&
        fontSize.value !== undefined &&
        tableSuit.value
      ) {
        tableConfig.value.size =
          fontSize.value < 14
            ? 'small'
            : fontSize.value > 15
              ? 'large'
              : 'default';
      } else {
        tableConfig.value.size = 'default'; // 默认值
      }
    },
    { immediate: true }
  );

  themeStore.recoverTheme();

  // const userStore = useUserStore();

  // if (!localStorage.getItem('pageSize')) {
  //   localStorage.setItem('pageSize', userStore.pageSize);
  // }

  // userStore.pageSize = Number(localStorage.getItem('pageSize') || 10);
  // 高级表格全局配置
  // tableConfig.value = Object.assign(tableConfig.value, {
  //   border: themeStore.tableborder,
  //   stripe: themeStore.tablestripe,
  //   pagination: {
  //     pageSize: Number(userStore.pageSize || 100)
  //   }
  // });

  /** 国际化配置 */
  const { elLocale, eleLocale } = useLocale();

  // watchEffect(() => {
  //   if (!userStore.info) {
  //     return;
  //   }
  //   console.log(userStore.info);
  //   console.log('======>' + userStore.pageSize + '<========');
  //   localStorage.setItem('pageSize', userStore.pageSize);
  //   tableConfig.value.pagination.pageSize = Number(userStore.pageSize || 10);
  //   // updateUserSetting({ pageSize: userStore.pageSize || 10 }).then((res) => {
  //   //   console.log(res);
  //   // });
  // });
</script>
