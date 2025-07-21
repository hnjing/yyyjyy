<!-- 字体大小设置 -->
<template>
  <ele-dropdown
    :items="items"
    :model-value="fontSize"
    :placement="placement"
    :menu-style="{ minWidth: '108px' }"
    :popper-options="{
      modifiers: [{ name: 'offset', options: { offset: [0, 5] } }]
    }"
    :icon-props="{
      size: 12,
      style: { fontStyle: 'normal', fontWeight: '800' }
    }"
    style="line-height: inherit"
    @command="changeFontSize"
  >
    <div
      :style="{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        outline: 'none'
      }"
    >
      <slot>
        <el-icon>
          <SetFontSize :style="iconStyle" />
        </el-icon>
      </slot>
    </div>
  </ele-dropdown>
</template>

<script>
  import { ref, defineComponent } from 'vue';
  import { storeToRefs } from 'pinia';
  import { SetFontSize } from '@/components/icons';
  import { useThemeStore } from '@/store/modules/theme';

  export default defineComponent({
    components: {
      SetFontSize
    },
    props: {
      /** placement */
      placement: {
        type: String,
        default: 'bottom'
      },
      /** 自定义样式 */
      iconStyle: {
        type: Object,
        default: () => ({})
      }
    },
    setup() {
      const themeStore = useThemeStore();
      const { fontSize } = storeToRefs(themeStore);

      const items = ref([
        { title: '13px', command: 13 },
        { title: '13.5px', command: 13.5 },
        { title: '14px', command: 14 },
        { title: '15px', command: 15 },
        { title: '15.5px', command: 15.5 },
        { title: '16px', command: 16 }
      ]);

      /** 切换字体 */
      const changeFontSize = (command) => {
        themeStore.setFontSize(command, false);
      };

      return {
        fontSize,
        items,
        changeFontSize
      };
    }
  });
</script>
