<!-- 统计卡片 -->
<template>
  <el-row :gutter="16">
    <el-col :md="6" :sm="12" :xs="24">
      <ele-card class="monitor-count">
        <el-tag size="large" :disable-transitions="true">
          <el-icon>
            <UserFilled />
          </el-icon>
        </el-tag>
        <ele-text size="xxl" class="monitor-count-value">{{
          cardData.totalUserNumber
        }}</ele-text>
        <ele-text type="placeholder" class="monitor-count-text">
          总人数
        </ele-text>
        <ele-avatar-group :data="myVisitUsers" size="small" :max-count="4" />
      </ele-card>
    </el-col>
    <el-col :md="6" :sm="12" :xs="24">
      <ele-card class="monitor-count">
        <el-tag type="warning" size="large" :disable-transitions="true">
          <el-icon>
            <Flag />
          </el-icon>
        </el-tag>
        <ele-text size="xxl" class="monitor-count-value">{{
          cardData.totalRescueNumber
        }}</ele-text>
        <ele-text type="placeholder" class="monitor-count-text">
          救援次数
        </ele-text>
        <ele-text
          strong
          type="success"
          :icon="ArrowUpBold"
          class="monitor-count-trend"
        >
          &nbsp;110.5%
        </ele-text>
        <ele-tooltip
          content="指标说明: 只包含救援任务，不包括志愿任务！"
          placement="top"
          :offset="3"
        >
          <ele-text
            :icon="QuestionCircleOutlined"
            type="placeholder"
            class="monitor-count-tip"
          />
        </ele-tooltip>
      </ele-card>
    </el-col>
    <el-col :md="6" :sm="12" :xs="24">
      <ele-card class="monitor-count">
        <el-tag type="danger" size="large" :disable-transitions="true">
          <el-icon>
            <IdcardOutlined />
          </el-icon>
        </el-tag>
        <ele-text size="xxl" class="monitor-count-value">{{
          cardData.totalCertificateNumber
        }}</ele-text>
        <ele-text type="placeholder" class="monitor-count-text">
          证书总数
        </ele-text>
        <ele-text
          strong
          type="danger"
          :icon="ArrowDownBold"
          class="monitor-count-trend"
        >
          &nbsp;15.5%
        </ele-text>
        <ele-tooltip
          content="指标说明：包含荣誉证书和技能证书！"
          placement="top"
          :offset="3"
        >
          <ele-text
            :icon="QuestionCircleOutlined"
            type="placeholder"
            class="monitor-count-tip"
          />
        </ele-tooltip>
      </ele-card>
    </el-col>
    <el-col :md="6" :sm="12" :xs="24">
      <ele-card class="monitor-count">
        <el-tag type="success" size="large" :disable-transitions="true">
          <el-icon>
            <Share />
          </el-icon>
        </el-tag>
        <ele-text size="xxl" class="monitor-count-value">{{
          cardData.totalLicenseNumber
        }}</ele-text>
        <ele-text type="placeholder" class="monitor-count-text">
          关联车牌数
        </ele-text>
        <ele-text
          strong
          type="success"
          :icon="ArrowUpBold"
          class="monitor-count-trend"
        >
          &nbsp;65.8%
        </ele-text>
      </ele-card>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import type { AvatarItem } from 'ele-admin-plus/es/ele-avatar-group/types';
  import {
    UserFilled,
    Opportunity,
    Flag,
    Share,
    ArrowUpBold,
    ArrowDownBold
  } from '@element-plus/icons-vue';
  import { QuestionCircleOutlined, IdcardOutlined } from '@/components/icons';

  const props = defineProps({
    cardData: {
      type: Object,
      default: () => ({})
    },
    visitUsers: {
      type: Array,
      default: () => []
    }
  });

  const myVisitUsers = computed(() => {
    return props.visitUsers.map((item: AvatarItem, index: number) => {
      return {
          key: index,
          label: item.name,
          value: item.avatar
        };
    });
  });
</script>

<style lang="scss" scoped>
  .monitor-count {
    position: relative;
    text-align: center;

    .el-tag {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      font-size: 16px;
      line-height: 0;
      padding: 0;
    }

    .monitor-count-value {
      margin-top: 8px;
    }

    .monitor-count-text {
      margin: 4px 0 8px 0;
    }

    .monitor-count-trend {
      line-height: 26px;
    }

    .monitor-count-tip {
      position: absolute;
      top: 16px;
      right: 16px;
      font-size: 15px;
      cursor: help;
    }
  }
</style>
