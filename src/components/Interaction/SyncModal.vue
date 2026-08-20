<script setup lang="ts">
import { useCategoryStore } from '../../store/category'
import { CloudArrowDown24Regular } from '@vicons/fluent'
import { useMobile } from '../../utils/responsive'

const categoryStore = useCategoryStore()
const { isMobile } = useMobile()
</script>

<template>
  <n-modal 
    :show="categoryStore.loading" 
    :mask-closable="false" 
    :close-on-esc="false"
  >
    <n-card
      :style="{ width: isMobile ? '90vw' : '400px' }"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <template #header>
        <n-flex align="center" :size="8">
          <n-icon size="24" color="var(--n-primary-color)">
            <CloudArrowDown24Regular />
          </n-icon>
          <n-text strong>同步大观题库</n-text>
        </n-flex>
      </template>
      <n-flex vertical :size="20">
        <n-text depth="3">{{ categoryStore.syncStatus }}</n-text>
        <n-progress
          type="line"
          :percentage="categoryStore.syncProgress"
          indicator-placement="inside"
          processing
        />
      </n-flex>
    </n-card>
  </n-modal>
</template>
