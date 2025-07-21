<!-- 机构选择下拉框 -->
<template>
  <el-tree-select
    clearable
    :data="data"
    check-strictly
    default-expand-all
    node-key="organizationId"
    :props="{ label: 'organizationName' }"
    :placeholder="placeholder"
    :model-value="modelValue"
    class="ele-fluid"
    @update:modelValue="updateValue"
  />
</template>

<script setup>
  import { ref } from 'vue';
  import { EleMessage, toTree } from '@hnjing/zxzy-admin-plus/es';
  import { listOrganizations } from '@/api/system/organization';

  const emit = defineEmits(['update:modelValue']);

  defineProps({
    /** 选中的机构 */
    modelValue: Number,
    /** 提示信息 */
    placeholder: {
      type: String,
      default: '请选择所属机构'
    }
  });

  /** 机构数据 */
  const data = ref([]);

  /** 更新选中数据 */
  const updateValue = (value) => {
    emit('update:modelValue', value);
  };

  /** 获取机构数据 */
  listOrganizations()
    .then((list) => {
      data.value = toTree({
        data: list,
        idField: 'organizationId',
        parentIdField: 'parentId'
      });
    })
    .catch((e) => {
      EleMessage.error(e.message);
    });
</script>
