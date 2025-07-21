<template>
  <div>
    <ele-modal
      form
      :width="600"
      :title="`${props.handle === 'add' ? '新增' : '编辑'}用户`"
      v-model="visible"
      :move-out="moveOut"
      :resizable="modalResizable"
      :maxable="maxable"
      :inner="inner"
      :reset-on-close="resetOnClose"
      :position="position"
      :append-to-body="true"
      :z-index="2001"
      @closed="cancelDialog"
    >
      <edit-form @close="visible = false" :data="editData" />
    </ele-modal>
  </div>
</template>

<script lang="ts" setup>
  import EditForm from '../components/edit-form.vue';
  import { ref } from 'vue';

  const visible = defineModel({ type: Boolean, default: false });
  const props = defineProps({
    /** 操作类型 add/edit */
    handle: {
      type: String,
      default: 'add'
    },
    /** 编辑数据 */
    editData: {
      type: Object,
      default: () => ({})
    }
  });

  const moveOut = ref(false);
  const modalResizable = ref(true);
  const maxable = ref(false);
  const inner = ref(false);
  const resetOnClose = ref(true);
  const position = ref('center');
  const cancelDialog = () => {
    visible.value = false;
  };
</script>

<script lang="ts">
  export default {
    name: 'ListBasicAdd'
  };
</script>
