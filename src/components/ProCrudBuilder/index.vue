<!-- 增删改查构建器 -->
<template>
  <EleCrudBuilder
    v-bind="$props"
    :templateData="templateData || defaultTemplateData"
    :pageConfigFormItems="pageConfigFormItems || defaultPageConfigFormItems"
    :fieldEditFormItems="fieldEditFormItems || defaultFieldEditFormItems"
    :crudComponent="crudComponent || ProCrud"
    :proFormComponent="proFormComponent || ProForm"
    :proFormBuilderComponent="proFormBuilderComponent || ProFormBuilder"
    :codeEditerComponent="codeEditerComponent || CodeEditer"
    :jsonEditerComponent="jsonEditerComponent || JsonEditer"
    :codeViewerComponent="codeViewerComponent || CodeViewer"
    :headerTools="headerTools ?? defaultHeaderRightTools"
    @update:modelValue="handleUpdateModelValue"
  >
    <template v-for="name in Object.keys($slots)" #[name]="slotProps">
      <slot :name="name" v-bind="slotProps || {}"></slot>
    </template>
  </EleCrudBuilder>
</template>

<script setup>
  import { crudBuilderProps } from '@hnjing/zxzy-admin-plus/es/ele-crud-builder/props';
  import {
    defaultPageConfigFormItems,
    defaultFieldEditFormItems
  } from '@hnjing/zxzy-admin-plus/es/ele-crud-builder/util';
  import ProCrud from '@/components/ProCrud/index.vue';
  import ProForm from '@/components/ProForm/index.vue';
  import ProFormBuilder from '@/components/ProFormBuilder/index.vue';
  import CodeEditer from '@/components/ProFormBuilder/components/code-editer.vue';
  import JsonEditer from '@/components/ProFormBuilder/components/json-editer.vue';
  import CodeViewer from '@/components/ProFormBuilder/components/code-viewer.vue';
  import { defaultTemplateData } from './components/template-data';

  defineOptions({ name: 'ProCrudBuilder' });

  defineProps(crudBuilderProps);

  const emit = defineEmits(['update:modelValue']);

  /** 顶栏右侧按钮布局 */
  const defaultHeaderRightTools = ['import', 'export', 'clear', 'code'];

  /** 更新绑定值 */
  const handleUpdateModelValue = (config) => {
    emit('update:modelValue', config);
  };
</script>
