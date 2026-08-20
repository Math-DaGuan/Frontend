<script setup lang="ts">
import { useThemeStore } from './store/theme'
import MobileWarningModal from './components/Interaction/MobileWarningModal.vue'
const themeStore = useThemeStore()
</script>

<template>
  <n-config-provider :theme="themeStore.theme">
    <n-loading-bar-provider>
      <n-message-provider>
        <n-notification-provider>
          <n-dialog-provider>
            <router-view />
            <MobileWarningModal />
          </n-dialog-provider>
        </n-notification-provider>
      </n-message-provider>
    </n-loading-bar-provider>
    <n-global-style />
  </n-config-provider>
</template>

<style>
body {
  margin: 0;
  padding: 0;
}
</style>
