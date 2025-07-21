import 'element-plus/global';
import '@hnjing/zxzy-admin-plus/typings/global';

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    DictData: (typeof import('@/components/DictData/index.vue'))['default'];
  }
}

export {};
