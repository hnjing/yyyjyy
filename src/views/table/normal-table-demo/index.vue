<template>
  <ele-page flex-table hide-footer>
    <ele-card flex-table>
      <ele-tabs
        ref="tabRef"
        :items="items"
        v-model="active"
        :mousewheel="true"
      />
      <TableTemplate
        v-for="key in items"
        :key="key.name"
        class="flex-table"
        v-show="active === key.name"
        v-bind="key.bind"
        :alert="key.alert"
        :noSearch="key.noSearch"
      />
    </ele-card>
  </ele-page>
</template>

<script setup>
  import { ref } from 'vue';
  import TableTemplate from './table-template.vue';
  /** 选中 */
  const active = ref('demo1');

  /** 标签页数据 */
  const items = ref([
    {
      name: 'demo1',
      label: '按钮左侧布局',
      bind: {
        labelWidth: '80px'
      },
      alert:
        '搜索条件宽度固定，根据内容流式布局；可根据需求设置 labelWidth 宽度调整'
    },
    {
      name: 'demo2',
      label: '默认两行数',
      bind: {
        filterRowToMore: '2'
      },
      alert: '搜索条件默认一行，可以设置成2行超出显示展开按钮'
    },
    {
      name: 'demo3',
      label: '全部展开',
      bind: {
        expandAllFilter: true
      },
      alert: '搜索条件全部展开，根据开发需求自行设置'
    },
    {
      name: 'demo4',
      label: '栅格布局',
      bind: {
        grid: { span: 6 }
      },
      alert: '搜索条件随宽度变化，根据栅格占比显示'
    },
    {
      name: 'demo5',
      label: '无标题',
      bind: {
        showLabel: false
      },
      alert: '搜索条件可以设置成无标题'
    },
    {
      name: 'demo6',
      label: '无搜索',
      noSearch: true
    }
  ]);
</script>
<style scoped lang="scss">
  :deep(.el-tabs) {
    margin-top: -15px;
  }
  .flex-table {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: auto;
  }
</style>
