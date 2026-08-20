<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Rocket24Regular, History24Regular, Target24Regular, Star24Regular } from '@vicons/fluent'
import { useUserStore } from '../../store/user'
import { useCategoryStore } from '../../store/category'
import { useMobile } from '../../utils/responsive'
import { getNotifications } from '../../api/notification'
import type { Notification } from '../../api/types'
import AnnouncementModal from '../../components/Interaction/AnnouncementModal.vue'
import upAvatar from '../../assets/chengxiaoyu-avatar.jpg'
import qrCode from '../../assets/qrcode.jpg'

const userStore = useUserStore()
const categoryStore = useCategoryStore()
const liveAnnouncements = ref<Notification[]>([])
const { isMobile } = useMobile()
const selectedAnno = ref<Notification | null>(null)
const showModal = ref(false)
const loading = ref(false)

const statsData = computed(() => {
  const total = categoryStore.meta?.totalQuestions || 0
  
  let mastered = 0
  let completedSections = 0
  
  if (categoryStore.meta?.categoryIds) {
    categoryStore.meta.categoryIds.forEach(id => {
      const root = categoryStore.getCategoryData(id)
      if (root) {
        mastered += root.total_completed_count || 0
        
        if (root.children) {
          root.children.forEach(child => {
            if (child.total_question_count > 0 && child.completed_count === child.total_question_count) {
              completedSections++
            }
          })
        }
      }
    })
  }

  const pending = total - mastered

  return [
    { label: '大观总量', value: total, icon: Rocket24Regular, color: '#18a058' },
    { label: '已经拿下', value: mastered, icon: History24Regular, color: '#2080f0' },
    { label: '待练习', value: pending < 0 ? 0 : pending, icon: Target24Regular, color: '#f0a020' },
    { label: '完成章节', value: completedSections, icon: Star24Regular, color: '#d03050' }
  ]
})

const fetchAnnos = async () => {
  if (userStore.isLoggedIn) {
    loading.value = true
    try {
      liveAnnouncements.value = await getNotifications()
    } catch (error) {
      console.error('Failed to fetch notifications', error)
    } finally {
      loading.value = false
    }
  }
}

const handleShowDetail = (anno: Notification) => {
  selectedAnno.value = anno
  showModal.value = true
}

onMounted(() => {
  fetchAnnos()
})
</script>

<template>
  <n-space vertical size="large">
    <!-- 移动端布局 -->
    <template v-if="isMobile">
      <n-grid :cols="2" :x-gap="8" :y-gap="8">
        <n-grid-item v-for="item in statsData" :key="item.label">
          <n-card :content-style="{ padding: '12px' }">
            <n-flex align="center" size="small" :wrap="false">
              <n-icon :size="32" :color="item.color">
                <component :is="item.icon" />
              </n-icon>
              <n-statistic>
                <template #label>
                  <n-text depth="3" style="font-size: 12px;">{{ item.label }}</n-text>
                </template>
                <n-number-animation :from="0" :to="item.value" v-if="typeof item.value === 'number'" style="font-size: 18px;" />
                <n-text v-else style="font-size: 18px;">{{ item.value }}</n-text>
              </n-statistic>
            </n-flex>
          </n-card>
        </n-grid-item>
      </n-grid>

      <n-grid :cols="1" :y-gap="12">
        <n-grid-item>
          <n-card title="Bilibili 视频教学" :segmented="{ content: true }">
            <n-flex vertical align="center" :size="16">
              <n-avatar round :size="64" :src="upAvatar" style="border: 2px solid var(--n-primary-color);" />
              <n-flex vertical align="center" :size="4">
                <n-gradient-text type="primary" :size="16" weight="bold">澄潇宇</n-gradient-text>
                <n-text depth="3" style="font-size: 12px;">大观视频、题目整理</n-text>
              </n-flex>
              <n-button type="primary" ghost round size="small" tag="a" href="https://space.bilibili.com/6536560" target="_blank">
                前往关注
              </n-button>
            </n-flex>
          </n-card>
        </n-grid-item>

        <n-grid-item>
          <n-card title="微信公众号" :segmented="{ content: true }">
            <n-flex vertical align="center" justify="center" :size="12">
              <n-image width="100" :src="qrCode" preview-disabled style="border-radius: 8px;" />
              <n-text strong style="font-size: 14px;">帕拉迪宇</n-text>
            </n-flex>
          </n-card>
        </n-grid-item>

        <n-grid-item>
          <n-card title="公告看板" :segmented="{ content: true }" :content-style="{ padding: '0px' }">
            <n-spin :show="loading">
              <template v-if="userStore.isLoggedIn">
                <n-list v-if="liveAnnouncements.length > 0" hoverable clickable :bordered="false">
                  <template v-for="(anno, index) in liveAnnouncements" :key="anno.id">
                    <n-list-item @click="handleShowDetail(anno)" style="padding: 12px 16px;">
                      <n-flex vertical :size="4" align="start">
                        <n-text depth="3" style="font-size: 11px;">{{ new Date(anno.created_at).toLocaleDateString() }}</n-text>
                        <n-text strong ellipsis style="font-size: 13px; width: 100%; text-align: left;">
                          {{ anno.title }}
                        </n-text>
                      </n-flex>
                    </n-list-item>
                    <n-divider v-if="index < liveAnnouncements.length - 1" style="margin: 0;" />
                  </template>
                </n-list>
                <n-flex v-else-if="!loading" vertical align="center" justify="center" style="height: 120px;">
                  <n-empty description="暂无公告" />
                </n-flex>
              </template>
              <n-flex v-else vertical align="center" justify="center" style="height: 120px;">
                <n-text depth="3" style="font-size: 12px;">登录大观墙账号，获取最新信息</n-text>
              </n-flex>
            </n-spin>
          </n-card>
        </n-grid-item>
      </n-grid>
    </template>

    <!-- 桌面端布局 -->
    <template v-else>
      <n-grid :cols="4" :x-gap="12">
        <n-grid-item v-for="item in statsData" :key="item.label">
          <n-card>
            <n-flex align="center" size="large">
              <n-icon :size="48" :color="item.color">
                <component :is="item.icon" />
              </n-icon>
              <n-statistic :label="item.label">
                <n-number-animation :from="0" :to="item.value" v-if="typeof item.value === 'number'" />
                <n-text v-else>{{ item.value }}</n-text>
              </n-statistic>
            </n-flex>
          </n-card>
        </n-grid-item>
      </n-grid>

      <n-grid :cols="3" :x-gap="12" :y-gap="12">
        <n-grid-item>
          <n-card title="Bilibili 视频教学" :segmented="{ content: true }" style="height: 100%;">
            <n-flex vertical align="center" :size="16">
              <n-avatar round :size="80" :src="upAvatar" style="border: 2px solid var(--n-primary-color);" />
              <n-flex vertical align="center" :size="4">
                <n-gradient-text type="primary" :size="18" weight="bold">澄潇宇</n-gradient-text>
                <n-text depth="3">大观视频、题目整理</n-text>
              </n-flex>
              <n-text depth="3" style="text-align: center; font-size: 13px;">
                打破考研信息差，助你轻松备考
              </n-text>
              <n-button type="primary" ghost round tag="a" href="https://space.bilibili.com/6536560" target="_blank">
                前往关注
              </n-button>
            </n-flex>
          </n-card>
        </n-grid-item>

        <n-grid-item>
          <n-card title="微信公众号" :segmented="{ content: true }" style="height: 100%;">
            <n-flex vertical align="center" justify="center" :size="12" style="height: 100%; min-height: 200px;">
              <n-image width="120" :src="qrCode" preview-disabled style="border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
              <n-flex vertical align="center" :size="4">
                <n-text strong :size="16" style="text-align: center;">帕拉迪宇</n-text>
                <n-text depth="3" style="font-size: 12px; text-align: center;">
                  扫码关注获取更多考研资料
                </n-text>
              </n-flex>
            </n-flex>
          </n-card>
        </n-grid-item>

        <n-grid-item>
          <n-card title="公告看板" :segmented="{ content: true }" :content-style="{ padding: '0px' }" style="height: 100%;">
            <n-spin :show="loading" style="min-height: 200px;">
              <template v-if="userStore.isLoggedIn">
                <template v-if="liveAnnouncements.length > 0">
                  <n-list hoverable clickable :bordered="false">
                    <template v-for="(anno, index) in liveAnnouncements" :key="anno.id">
                      <n-list-item @click="handleShowDetail(anno)" style="padding: 12px 16px;">
                        <n-flex vertical :size="8" align="start">
                          <n-flex align="center" :size="12" style="width: 100%;">
                            <n-tag :type="anno.type === 'announcement' ? 'info' : 'success'" size="small" round>
                              {{ anno.type === 'announcement' ? '公告' : '通知' }}
                            </n-tag>
                            <n-text depth="3" style="font-size: 12px;">{{ new Date(anno.created_at).toLocaleDateString() }}</n-text>
                          </n-flex>
                          <n-text strong ellipsis style="font-size: 14px; width: 100%; text-align: left;">
                            {{ anno.title }}
                          </n-text>
                        </n-flex>
                      </n-list-item>
                      <n-divider v-if="index < liveAnnouncements.length - 1" style="margin: 0;" />
                    </template>
                  </n-list>
                </template>
                <template v-else-if="!loading">
                  <n-flex vertical align="center" justify="center" style="height: 200px;">
                    <n-empty description="暂无公告" />
                  </n-flex>
                </template>
              </template>
              <template v-else>
                <n-flex vertical align="center" justify="center" style="height: 200px;">
                  <n-text depth="3" style="text-align: center;">登录大观墙账号，获取最新信息</n-text>
                </n-flex>
              </template>
            </n-spin>
          </n-card>
        </n-grid-item>
      </n-grid>
    </template>

    <AnnouncementModal
      v-model:show="showModal"
      :notification="selectedAnno"
    />
  </n-space>
</template>
