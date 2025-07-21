<template>
  <ele-page class="workplace-page">
    <!-- <profile-card /> -->
    <!-- <link-card ref="linkCardRef" /> -->
    <StatisticsCard :cardData="pageData?.statistics" />

    <el-row :gutter="8" ref="wrapRef">
      <el-col v-for="(item, index) in data" :key="item.name" :span="item.md">
        <component
          :is="item.name"
          :title="item.title"
          :cardData="pageData[item.cardData]"
          @command="(command) => handleCommand(command, index)"
        />
      </el-col>
    </el-row>
    <ele-card :body-style="{ padding: 0 }">
      <div class="workplace-bottom">
        <el-link
          type="primary"
          :icon="PlusCircleOutlined"
          underline="never"
          class="workplace-button"
          @click="add"
        >
          添加卡片
        </el-link>
        <el-divider direction="vertical" style="margin: 0" />
        <el-link
          type="primary"
          :icon="UndoOutlined"
          underline="never"
          class="workplace-button"
          @click="reset"
        >
          重置布局
        </el-link>
      </div>
    </ele-card>
    <!-- 添加卡片弹窗 -->
    <ele-modal :width="680" v-model="visible" title="未添加的卡片">
      <el-row :gutter="8" style="margin-top: -16px">
        <el-col v-for="item in notAddedData" :key="item.name" :span="8">
          <ele-card
            bordered
            :header="item.title"
            :header-style="{ padding: '8px 14px', fontSize: '14px' }"
            :body-style="{ padding: '32px 0', textAlign: 'center' }"
            style="margin-top: 16px"
          >
            <el-button
              plain
              round
              size="small"
              type="primary"
              @click="addView(item)"
            >
              添加
            </el-button>
          </ele-card>
        </el-col>
      </el-row>
      <el-empty
        v-if="!notAddedData.length"
        description="已添加所有视图"
        :image-size="80"
      />
    </ele-modal>
  </ele-page>
</template>

<script setup>
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
  import SortableJs from 'sortablejs';
  import { ElMessageBox } from 'element-plus/es';
  import { EleMessage } from '@hnjing/zxzy-admin-plus/es';
  import {
    PlusCircleOutlined,
    UndoOutlined
  } from '@hnjing/zxzy-admin-plus/es/icons';
  import StatisticsCard from './components/statistics-card.vue';
  import ActivitiesCard from './components/activities-card.vue';
  import TaskCard from './components/task-card.vue';
  import GoalCard from './components/goal-card.vue';
  import ProjectCard from './components/project-card.vue';
  import UserList from './components/user-list.vue';

  defineOptions({
    name: 'DashboardWorkplace',
    components: {
      ActivitiesCard,
      TaskCard,
      GoalCard,
      ProjectCard,
      UserList
    }
  });

  const CACHE_KEY = 'workplace-layout';

  const pageData = {
    statistics: {
      // 总人数
      totalUserNumber: 158,
      // 救援总次数
      totalRescueNumber: 125,
      // 证书总数
      totalCertificateNumber: 25,
      // 关联车牌数
      totalLicenseNumber: 15
    },
    // 最新动态
    experience: [
      {
        title: '2023年抗洪抢险',
        startDate: '2023-07-15',
        endDate: '2023-07-18',
        description: '在益阳市资阳区参与抗洪抢险工作，成功转移群众50余人',
        images: [
          'https://cdn.eleadmin.com/20200610/RZ8FQmZfHkcffMlTBCJllBFjEhEsObVo.jpg',
          'https://cdn.eleadmin.com/20200610/WLXm7gp1EbLDtvVQgkeQeyq5OtDm00Jd.jpg',
          'https://cdn.eleadmin.com/20200610/4Z0QR2L0J1XStxBh99jVJ8qLfsGsOgjU.jpg',
          'https://cdn.eleadmin.com/20200610/ttkIjNPlVDuv4lUTvRX8GIlM2QqSe0jg.jpg',
          'https://cdn.eleadmin.com/20200610/fAenQ8nvRjL7x0i0jEfuDBZHvJfHf3v6.jpg',
          'https://cdn.eleadmin.com/20200610/LrCTN2j94lo9N7wEql7cBr1Ux4rHMvmZ.jpg',
          'https://cdn.eleadmin.com/20200610/yeKvhT20lMU0f1T3Y743UlGEOLLnZSnp.jpg',
          'https://cdn.eleadmin.com/20200610/CyrCNmTJfv7D6GFAg39bjT3eRkkRm5dI.jpg'
        ],
        names: ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']
      },
      {
        title: '2022年山林火灾',
        startDate: '2022-11-03',
        endDate: '2022-11-05',
        description: '参与桃江县山林火灾扑救工作，连续奋战36小时',
        images: [
          'https://cdn.eleadmin.com/20200610/RZ8FQmZfHkcffMlTBCJllBFjEhEsObVo.jpg',
          'https://cdn.eleadmin.com/20200610/WLXm7gp1EbLDtvVQgkeQeyq5OtDm00Jd.jpg',
          'https://cdn.eleadmin.com/20200610/4Z0QR2L0J1XStxBh99jVJ8qLfsGsOgjU.jpg'
        ],
        names: ['张三', '李四', '王五', '赵六', '钱七']
      },
      {
        title: '2021年地震救援',
        startDate: '2021-05-10',
        endDate: '2021-05-15',
        description: '参与四川某地地震救援，协助搭建临时安置点',
        images: [
          'https://cdn.eleadmin.com/20200610/RZ8FQmZfHkcffMlTBCJllBFjEhEsObVo.jpg'
        ],
        names: ['张三', '李四']
      },
      {
        title: '2020年交通事故救援',
        startDate: '2020-09-20',
        endDate: '2020-09-25',
        description: '参与G55高速交通事故救援，协助伤员转运',
        images: [
          'https://cdn.eleadmin.com/20200610/ttkIjNPlVDuv4lUTvRX8GIlM2QqSe0jg.jpg',
          'https://cdn.eleadmin.com/20200610/fAenQ8nvRjL7x0i0jEfuDBZHvJfHf3v6.jpg'
        ],
        names: ['赵六', '钱七']
      }
    ],
    // 救援次数排名
    rescueRanking: [
      {
        ranking: 1,
        name: '张三',
        number: 11
      },
      {
        ranking: 2,
        name: '李四',
        number: 4
      },
      {
        ranking: 3,
        name: '王五',
        number: 3
      },
      {
        ranking: 4,
        name: '赵六',
        number: 2
      },
      {
        ranking: 4,
        name: '钱七',
        number: 2
      },
      {
        ranking: 5,
        name: '王平',
        number: 1
      }
    ],
    // 人员积分排名
    userRanking: [
      {
        name: '张三',
        ranking: 500,
        // 头像
        avatar: 'https://cdn.eleadmin.com/20200610/avatar.jpg',
        roleName: '赫山区支队队长'
      },
      {
        name: '李四',
        ranking: 400,
        avatar: 'https://cdn.eleadmin.com/20200610/avatar.jpg',
        roleName: '赫山区支队副队长'
      },
      {
        name: '王五',
        ranking: 350,
        avatar: 'https://cdn.eleadmin.com/20200610/avatar.jpg',
        roleName: '赫山区支队员'
      },
      {
        name: '赵六',
        ranking: 200,
        avatar: 'https://cdn.eleadmin.com/20200610/avatar.jpg',
        roleName: '资阳区支队队长'
      },
      {
        name: '钱七',
        ranking: 100,
        avatar: 'https://cdn.eleadmin.com/20200610/avatar.jpg'
      }
    ],
    // 证书列表
    certificateList: [
      {
        id: 1,
        title: '518抗洪特大救援荣誉证书',
        cover:
          'https://cdn.eleadmin.com/20200610/RZ8FQmZfHkcffMlTBCJllBFjEhEsObVo.jpg',
        typeName: '荣誉证书',
        gainTime: '2023-03-01',
        name: '张三'
      },
      {
        id: 2,
        title: '314打捞抢险荣誉证书',
        cover:
          'https://cdn.eleadmin.com/20200610/WLXm7gp1EbLDtvVQgkeQeyq5OtDm00Jd.jpg',
        typeName: '荣誉证书',
        gainTime: '2024-08-01',
        name: '李四'
      },
      {
        id: 3,
        title: '项目000000003',
        cover:
          'https://cdn.eleadmin.com/20200610/ttkIjNPlVDuv4lUTvRX8GIlM2QqSe0jg.jpg',
        typeName: '技能证书',
        gainTime: '2025-01-01',
        name: '王五'
      },
      {
        id: 4,
        title: '项目000000004',
        cover:
          'https://cdn.eleadmin.com/20200610/fAenQ8nvRjL7x0i0jEfuDBZHvJfHf3v6.jpg',
        typeName: '技能证书',
        gainTime: '2026-06-01',
        name: '赵六'
      }
    ]
  };

  // 页面初始化数据
  const init = () => {
    // todo获取初始数据
  };

  /** 默认布局 */
  const DEFAULT = [
    {
      name: 'task-card',
      title: '救援次数排名',
      cardData: 'rescueRanking',
      md: 12
    },
    {
      name: 'user-list',
      title: '人员积分排名',
      cardData: 'userRanking',
      md: 12
    },
    {
      name: 'project-card',
      title: '证书列表',
      cardData: 'certificateList',
      md: 24
    },
    {
      name: 'activities-card',
      title: '最新动态',
      cardData: 'experience',
      md: 24
    }
    // {
    //   name: 'goal-card',
    //   title: '本月目标',
    //   md: 8
    // },
  ];

  /** 获取缓存的数据 */
  const getCacheData = () => {
    const str = localStorage.getItem(CACHE_KEY);
    try {
      return str ? JSON.parse(str) : null;
    } catch (e) {
      return null;
    }
  };

  /** 卡片数据 */
  const data = ref([...(getCacheData() ?? DEFAULT)]);

  /** 弹窗是否打开 */
  const visible = ref(false);

  /** 快捷方式卡片 */
  const linkCardRef = ref(null);

  /** 容器 */
  const wrapRef = ref(null);

  /** 拖拽排序实例 */
  let sortableIns = null;

  /** 未添加的数据 */
  const notAddedData = computed(() => {
    return DEFAULT.filter((d) => !data.value.some((t) => t.name === d.name));
  });

  /** 添加 */
  const add = () => {
    visible.value = true;
  };

  /** 重置布局 */
  const reset = () => {
    data.value = [...DEFAULT];
    cacheData();
    linkCardRef.value?.reset?.();
    EleMessage.success('已重置');
  };

  /** 缓存布局 */
  const cacheData = () => {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data.value));
  };

  /** 编辑卡片 */
  const handleCommand = (command, index) => {
    switch (command) {
      case 'refresh': // 刷新
        EleMessage.info({ message: '点击了刷新', plain: true });
        break;
      case 'edit': // 编辑
        EleMessage.info({ message: '点击了编辑', plain: true });
        break;
      case 'remove': // 删除
        ElMessageBox.confirm(
          `确定要删除“${data.value[index].title}”卡片吗?`,
          '系统提示',
          { type: 'warning', draggable: true }
        )
          .then(() => {
            data.value = data.value.filter((_d, i) => i !== index);
            cacheData();
          })
          .catch(() => {});
        break;
    }
  };

  /** 添加视图 */
  const addView = (item) => {
    data.value.push(item);
    cacheData();
    EleMessage.success('已添加');
  };

  onMounted(() => {
    init();
    // 卡片支持拖动排序
    if ('ontouchstart' in document.documentElement) {
      return;
    }
    sortableIns = new SortableJs(wrapRef.value?.$el, {
      handle: '.ele-card-header',
      filter: '.demo-more-icon',
      animation: 300,
      onUpdate: ({ oldIndex, newIndex }) => {
        if (typeof oldIndex === 'number' && typeof newIndex === 'number') {
          const temp = [...data.value];
          temp.splice(newIndex, 0, temp.splice(oldIndex, 1)[0]);
          data.value = temp;
          cacheData();
        }
      },
      setData: () => {},
      forceFallback: true
    });
  });

  onBeforeUnmount(() => {
    sortableIns && sortableIns.destroy();
    sortableIns = null;
  });
</script>

<style lang="scss" scoped>
  .workplace-page {
    :deep(.ele-card-header) {
      user-select: none;
      cursor: move;
    }

    :deep(.el-col) {
      &.sortable-chosen > .ele-card {
        box-shadow: 0 2px 16px 0 rgba(0, 0, 0, 0.2);
      }

      &.sortable-ghost {
        opacity: 0;
      }

      &.sortable-fallback {
        opacity: 1 !important;
      }
    }
  }

  /* 底部按钮 */
  .workplace-bottom {
    display: flex;
    align-items: center;

    .workplace-button {
      flex: 1;
      padding: 10px 0;
      transition: background-color 0.2s;

      &:hover {
        background: hsla(0, 0%, 60%, 0.05);
      }

      :deep(.el-icon) {
        font-size: 15px;
        margin: -1px 6px 0 0;
      }
    }
  }
</style>
