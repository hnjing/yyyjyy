<template>
  <div class="photo-collection">
    <div class="photo-page" :class="pageClass">
      <div class="photo-content">
        <!-- 上方头像区域 -->
        <div class="photo-header">
          <div class="photo-container">
            <img
              :src="userInfo.headurl"
              alt="照片"
              class="user-avatar"
              v-if="userInfo.headurl"
            />
            <div class="avatar-placeholder" v-else>
              <span class="placeholder-text">照片</span>
            </div>
          </div>
        </div>
        
        <!-- 下方队员信息 -->
        <div class="photo-info">
          <div class="member-label">{{ postNames || '队员' }}</div>
          <div class="member-name">{{ userInfo.nickName || userInfo.userName }}</div>
          <!-- 已移除编号显示 -->
        </div>
      </div>


    </div>
  </div>
</template>

<script setup>
  import { computed, ref, watch, onMounted } from 'vue';
  import { getUser } from '@/api/system/user';
  import { listPosts } from '@/api/system/post';

  const props = defineProps({
    userInfo: {
      type: Object,
      default: () => ({})
    },
    tag: {
      type: String,
      default: 'img'
    },
    isPrint: {
      type: Boolean,
      default: false
    }
  });

  const pageClass = computed(() => {
    return props.isPrint ? 'print-page' : null;
  });

  // 所有岗位列表
  const postList = ref([]);
  
  // 当前用户的职务名称
  const postNames = ref('');
  
  // 用户数据缓存 { userId: { postIds, timestamp } }
  const userCache = ref({});

  // 获取所有岗位列表
  const fetchPostList = async () => {
    try {
      const posts = await listPosts();
      postList.value = posts;
      updatePostNames();
    } catch (error) {
      console.error('获取岗位列表失败:', error);
    }
  };

  // 根据 postIds 获取职务名称
  const updatePostNames = async () => {
    if (!props.userInfo?.userId || !postList.value.length) {
      postNames.value = '队员';
      return;
    }

    const userId = props.userInfo.userId;
    
    try {
      // 检查缓存中是否有该用户的数据（5分钟内有效）
      const cachedData = userCache.value[userId];
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;
      
      let userPostIds = [];
      
      if (cachedData && (now - cachedData.timestamp < fiveMinutes)) {
        // 使用缓存数据
        userPostIds = cachedData.postIds || [];
      } else {
        // 获取完整的用户信息（包含 postIds）
        const userData = await getUser(userId);
        userPostIds = userData.postIds || [];
        
        // 更新缓存
        userCache.value[userId] = {
          postIds: userPostIds,
          timestamp: now
        };
      }
      
      if (userPostIds.length > 0) {
        // 匹配岗位名称
        const names = userPostIds.map(postId => {
          const post = postList.value.find(p => p.postId === postId);
          return post ? post.postName : '';
        }).filter(name => name);
        
        postNames.value = names.length > 0 ? names.join('、') : '队员';
      } else {
        postNames.value = '队员';
      }
    } catch (error) {
      console.error('获取用户职务信息失败:', error);
      postNames.value = '队员';
    }
  };

  // 监听 userInfo 变化
  watch(() => props.userInfo, (newVal) => {
    if (newVal?.userId) {
      updatePostNames();
    }
  }, { immediate: true });

  // 初始化获取岗位列表
  onMounted(() => {
    fetchPostList();
  });
</script>

<style lang="scss" scoped>
  .photo-collection {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    gap: 6mm;
    flex-wrap: nowrap;
  }

  .photo-page {
    /* 设置为实际打印卡片尺寸：54mm x 86mm（竖向） */
    width: 54mm;
    height: 86mm;
    background: linear-gradient(to bottom, #f8f9fa, #ffffff);
    border: 1px solid #d0d7de;
    border-radius: 6px;
    position: relative;
    overflow: hidden;
    margin: 0 3mm;
    flex: 0 0 auto;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    &.print-page {
      box-shadow: none;
      border: 1px solid #ccc;
      background: #ffffff;
    }
  }

  .photo-content {
    box-sizing: border-box;
    padding: 2mm 2mm;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
    position: relative;
  }

  .top-decoration {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3mm;
    background: linear-gradient(to right, #0b63b8, #1e90ff, #0b63b8);
    border-radius: 6px 6px 0 0;
  }

  .photo-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 80%;
  }

  .photo-container {
    width: 100%;
    height: 100%;
    position: relative;
    margin-bottom: 6mm;
    display: flex;
    align-items: center;
    justify-content: center;

    .user-avatar {
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 1;
      position: relative;
    }

    .avatar-placeholder {
      width: 100%;
      height: 100%;
      border: 3px dashed #0b63b8;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: #0b63b8;
      background: linear-gradient(135deg, #f0f7ff, #e6f0ff);
      z-index: 1;
      position: relative;
      
      .placeholder-text {
        font-size: 14px;
        font-weight: bold;
      }
    }
  }

  .photo-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    flex: 1;
  }

  .member-label {
    font-size: 12px;
    font-weight: 500;
    color: #666;
    margin-bottom: 2mm;
    letter-spacing: 1px;
    text-transform: uppercase;
    position: relative;
    padding-bottom: 2px;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 16mm;
      height: 1px;
      background: linear-gradient(to right, transparent, #0b63b8, transparent);
    }
  }

  .member-name {
    font-size: 20px;
    font-weight: bold;
    color: #0b63b8;
    letter-spacing: 1.5px;
    margin-bottom: 2mm;
    line-height: 1.3;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  /* 已移除编号样式 */

  .bottom-decoration {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2mm;
  }

  .logo-text {
    font-size: 14px;
    font-weight: bold;
    color: #0b63b8;
    letter-spacing: 2px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    position: relative;
    
    &::before {
      content: '★';
      margin-right: 4px;
      color: #ff6b6b;
    }
    
    &::after {
      content: '★';
      margin-left: 4px;
      color: #ff6b6b;
    }
  }

  /* 打印样式优化 */
  @media print {
    .photo-page {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      border: 1px solid #ccc;
      box-shadow: none;
      background: #ffffff !important;
    }
    
    .top-decoration {
      background: #0b63b8 !important;
    }
    
    .user-avatar {
      border-color: #ffffff !important;
      box-shadow: 0 0 0 2px #0b63b8 !important;
    }
    
    .member-name {
      color: #0b63b8 !important;
    }
    
    .logo-text {
      color: #0b63b8 !important;
    }
  }
</style>