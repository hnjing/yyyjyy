<!-- 我的任务 -->
<template>
  <ele-card
    :header="title"
    :body-style="{ height: '370px', padding: '7px 8px 6px 8px' }"
  >
    <template #extra>
      <more-icon @command="handleCommand" />
    </template>
    <el-scrollbar
      :wrap-style="{ position: 'relative', zIndex: 1 }"
      @scroll="handleTaskTableScroll"
    >
      <ele-table
        size="large"
        :class="['task-table', { 'is-ping-left': isPingLeft }]"
      >
        <thead style="position: sticky; top: 0; z-index: 2">
          <tr>
            <th
              style="position: sticky; left: 0; z-index: 1; width: 38px"
              class="task-table-index"
            ></th>
            <th style="text-align: center; width: 88px">排名</th>
            <th>姓名</th>
            <th>救援次数</th>
          </tr>
        </thead>
        <vue-draggable
          tag="tbody"
          item-key="id"
          v-model="taskList"
          handle=".sort-handle"
          :animation="300"
          :set-data="() => void 0"
          :force-fallback="true"
        >
          <template #item="{ element }">
            <tr>
              <td
                :style="{
                  textAlign: 'center',
                  paddingLeft: 0,
                  paddingRight: 0,
                  position: 'sticky',
                  left: 0,
                  zIndex: 1,
                  width: '38px'
                }"
                class="task-table-index"
              >
                <ele-text
                  :icon="DragOutlined"
                  :icon-style="{ transform: 'scale(1.15)' }"
                  type="placeholder"
                  class="sort-handle"
                />
              </td>
              <td style="text-align: center; width: 78px">
                <el-tag
                  v-if="element.ranking === 1"
                  type="danger"
                  :disable-transitions="true"
                >
                  {{ element.ranking }}
                </el-tag>
                <el-tag
                  v-else-if="element.ranking === 2"
                  type="warning"
                  :disable-transitions="true"
                >
                  {{ element.ranking }}
                </el-tag>
                <el-tag v-else :disable-transitions="true">
                  {{ element.ranking }}
                </el-tag>
              </td>
              <td>
                <ele-ellipsis style="line-height: 20px">
                  <el-link type="primary" underline="never">
                    {{ element.name }}
                  </el-link>
                </ele-ellipsis>
              </td>
              <td style="text-align: center; width: 80px">
                <ele-text type="info" align="left">
                  {{ element.number }}
                </ele-text>
              </td>
            </tr>
          </template>
        </vue-draggable>
      </ele-table>
    </el-scrollbar>
  </ele-card>
</template>

<script setup>
  import { onMounted, ref, toRefs, watch } from 'vue';
  import VueDraggable from 'vuedraggable';
  import { DragOutlined } from '@hnjing/zxzy-admin-plus/es/icons';
  import MoreIcon from './more-icon.vue';

  const props = defineProps({
    title: String,
    cardData: Array
  });

  const { title, cardData } = toRefs(props);

  const emit = defineEmits(['command']);

  /** 我的任务数据 */
  const taskList = ref([]);

  /** 查询我的任务 */
  const queryTaskList = () => {
    taskList.value = cardData.value;
  };

  const handleCommand = (command) => {
    emit('command', command);
  };

  /** 我的任务表格左侧列是否固定状态 */
  const isPingLeft = ref(false);

  /** 我的任务表格滚动事件 */
  const handleTaskTableScroll = ({ scrollLeft }) => {
    isPingLeft.value = scrollLeft > 1;
  };

  watch(
    () => props.cardData,
    () => {
      queryTaskList();
    },
    { immediate: true }
  );
</script>

<style lang="scss" scoped>
  .task-table {
    table-layout: fixed;
    min-width: 300px;

    .sort-handle {
      cursor: move;
    }

    .el-tag {
      width: 20px;
      height: 20px;
      border-radius: 50%;
    }

    td,
    th {
      box-sizing: border-box;
    }

    tr.sortable-chosen {
      user-select: none;
    }

    tr.sortable-ghost {
      opacity: 0;
    }

    tr.sortable-fallback {
      opacity: 1 !important;
      display: table !important;
      table-layout: fixed !important;

      td {
        background: var(--el-color-primary-light-8);
      }
    }
  }

  .task-table.is-ping-left :deep(.task-table-index) {
    &::before {
      content: '';
      width: 10px;
      position: absolute;
      top: 0;
      bottom: -1px;
      right: -10px;
      box-shadow: var(--ele-table-fixed-left-shadow);
      transition: box-shadow 0.2s;
      pointer-events: none;
    }

    &::after {
      display: none;
    }
  }
</style>
