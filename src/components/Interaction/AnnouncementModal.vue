<script setup lang="ts">
import type { Notification } from '../../api/types'
import { useMobile } from '../../utils/responsive'

defineProps<{
  show: boolean
  notification: Notification | null
}>()

const emit = defineEmits(['update:show'])
const { isMobile } = useMobile()

</script>

<template>
  <n-modal :show="show" @update:show="(val: boolean) => emit('update:show', val)">
    <n-card
      :style="{ width: isMobile ? '90vw' : '600px' }"
      :title="notification?.title"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <n-tag :type="notification?.type === 'announcement' ? 'info' : 'success'" size="small">
          {{ notification?.type === 'announcement' ? '公告' : '通知' }}
        </n-tag>
      </template>
      
      <div class="anno-content" style="white-space: pre-wrap; line-height: 1.6;">
        {{ notification?.content }}
      </div>
      
      <template #footer>
        <n-flex justify="space-between" align="center">
          <n-text depth="3">
            发布于: {{ notification ? new Date(notification.created_at).toLocaleString() : '' }}
          </n-text>
          <n-text depth="3">
            作者: {{ notification?.created_by }}
          </n-text>
        </n-flex>
      </template>
    </n-card>
  </n-modal>
</template>
