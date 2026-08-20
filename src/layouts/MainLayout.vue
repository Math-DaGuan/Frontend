<script setup lang="ts">
import { ref, h, onMounted, computed } from 'vue'
import type { Component } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NIcon } from 'naive-ui'
import { 
  Home24Regular, 
  List24Regular,
  ClipboardError24Regular,
  Star24Regular, 
  SignOut24Regular,
  ChevronDown24Regular,
  Book24Regular,
  CloudArrowDown24Regular,
  Navigation24Regular,
  Person24Regular
} from '@vicons/fluent'
import { Sunny, Moon } from '@vicons/ionicons5'
import { useUserStore } from '../store/user'
import { useThemeStore } from '../store/theme'
import { useCategoryStore } from '../store/category'
import { useMobile } from '../utils/responsive'
import { useMessage } from 'naive-ui'
import defaultAvatar from '../assets/default-avatar.svg'
import LoginModal from '../components/Interaction/LoginModal.vue'
import RegisterModal from '../components/Interaction/RegisterModal.vue'
import { isLocalDev } from '../utils/request'
import SyncModal from '../components/Interaction/SyncModal.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const themeStore = useThemeStore()
const categoryStore = useCategoryStore()
const { isMobile } = useMobile()
const message = useMessage()

const showRegisterModal = ref(false)
const showMobileMenu = ref(false)
const collapsed = ref(false)

onMounted(() => {
  if (!localStorage.getItem('theme')) {
    const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    themeStore.setTheme(isSystemDark);
    message.info(`已跟随系统切换为${isSystemDark ? '深色' : '浅色'}模式`, { duration: 3000 });
  }

  if (isLocalDev) {
    message.info('检测到开发环境，正在使用本地代理转发')
  }

  if (categoryStore.meta) {
    const date = new Date(categoryStore.meta.syncTime)
    const formattedDate = `${date.getFullYear()}年${(date.getMonth() + 1).toString().padStart(2, '0')}月${date.getDate().toString().padStart(2, '0')}日${date.getHours().toString().padStart(2, '0')}时${date.getMinutes().toString().padStart(2, '0')}分${date.getSeconds().toString().padStart(2, '0')}秒`
    message.success('成功加载本地大观题库！')
    message.info(`上次同步时间：${formattedDate}`)
  } else {
    categoryStore.fetchAndSync()
  }
})

const handleSyncCloud = () => {
  Object.keys(localStorage).forEach(key => {
    if (key.startsWith('category')) {
      localStorage.removeItem(key)
    }
  })
  categoryStore.fetchAndSync()
}

function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

const menuOptions = computed(() => [
  {
    label: '首页',
    key: 'home',
    icon: renderIcon(Home24Regular)
  },
  {
    label: '章节目录',
    key: 'category',
    icon: renderIcon(List24Regular),
    children: categoryStore.meta?.topLevelNames.map((name, index) => ({
      label: name,
      key: `category-${categoryStore.meta?.categoryIds[index]}`,
      icon: renderIcon(Book24Regular)
    }))
  },
  {
    label: '错题本',
    key: 'mistakes',
    icon: renderIcon(ClipboardError24Regular)
  },
  {
    label: '收藏本',
    key: 'favorites',
    icon: renderIcon(Star24Regular)
  }
])

const breadcrumbs = computed(() => {
  const items = [{ label: '首页', path: '/' }]
  
  if (route.name === 'category' || route.name === 'practice') {
    const id = Number(route.params.id || route.params.categoryId)
    if (id) {
      const path = categoryStore.findCategoryPath(id)
      if (path.length > 0 && path[0]) {
        const rootId = path[0].id
        path.forEach(cat => {
          items.push({ 
            label: cat.name, 
            path: cat.id === rootId ? `/category/${rootId}` : `/category/${rootId}?target=${cat.id}` 
          })
        })
      }
    }
    
    if (route.name === 'practice') {
      items.push({ label: '题目练习', path: '' })
    }
  } else if (route.name !== 'home') {
    items.push({ 
      label: (route.meta.title as string) || (route.name as string), 
      path: '' 
    })
  }
  
  return items
})

const checkAuth = () => {
  if (!userStore.checkAuth()) {
    message.warning('请登录大观墙账号后继续！')
    return false
  }
  return true
}

const handleBreadcrumbClick = (path: string) => {
  if (path) {
    if ((path.includes('mistakes') || path.includes('favorites')) && !checkAuth()) return
    router.push(path)
  }
}

function handleMenuUpdate(key: string) {
  if ((key === 'mistakes' || key === 'favorites') && !checkAuth()) return
  
  if (isMobile.value) {
    showMobileMenu.value = false
  }

  if (key.startsWith('category-')) {
    const id = key.split('-')[1]
    router.push({ name: 'category', params: { id } })
  } else {
    router.push({ name: key })
  }
}

const userDropdownOptions = computed(() => [
  {
    label: userStore.user?.nickname || userStore.user?.username || '用户',
    key: 'profile',
    icon: renderIcon(Person24Regular),
    disabled: true
  },
  {
    type: 'divider',
    key: 'd1'
  },
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon(SignOut24Regular)
  }
])

function handleUserDropdownSelect(key: string) {
  if (key === 'logout') {
    userStore.logout()
    message.success('已退出登录')
    setTimeout(() => {
      window.location.href = '/'
    }, 500)
  }
}

function handleSwitchToRegister() {
  userStore.showLoginModal = false
  showRegisterModal.value = true
}

function handleSwitchToLogin() {
  showRegisterModal.value = false
  userStore.showLoginModal = true
}
function renderMenuLabel(option: any) {
  return h(
    'div',
    { style: 'text-align: left; width: 100%;' },
    { default: () => (typeof option.label === 'function' ? option.label() : option.label) }
  )
}
</script>

<template>
  <!-- 移动端布局 -->
  <template v-if="isMobile">
    <n-layout position="absolute">
      <n-layout-header bordered style="height: 64px; padding: 0 16px;">
        <n-flex justify="space-between" align="center" style="height: 100%;" :wrap="false">
          <n-flex align="center" :wrap="false">
            <n-button 
              quaternary 
              circle 
              size="large" 
              @click="showMobileMenu = true"
              style="margin-right: 8px;"
            >
              <template #icon>
                <n-icon><Navigation24Regular /></n-icon>
              </template>
            </n-button>

            <n-text 
              strong 
              depth="1" 
              style="font-size: 16px; margin-left: 4px;"
            >
              <n-ellipsis style="max-width: 120px">
                {{ breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1]?.label : '首页' }}
              </n-ellipsis>
            </n-text>
          </n-flex>
          <n-flex align="center">
            <n-button 
              quaternary 
              circle 
              size="large"
              @click="handleSyncCloud"
            >
              <template #icon>
                <n-icon>
                  <CloudArrowDown24Regular />
                </n-icon>
              </template>
            </n-button>
            <n-button 
              quaternary 
              circle 
              size="large"
              @click="themeStore.toggleTheme"
            >
              <template #icon>
                <n-icon>
                  <component :is="themeStore.isDark ? Sunny : Moon" />
                </n-icon>
              </template>
            </n-button>
            <template v-if="userStore.isLoggedIn">
              <n-dropdown 
                trigger="click" 
                :options="userDropdownOptions" 
                @select="handleUserDropdownSelect"
              >
                <n-avatar 
                  round 
                  size="small" 
                  color="transparent"
                  :src="userStore.user?.avatar || defaultAvatar" 
                  :style="{ 
                    filter: (themeStore.isDark && !userStore.user?.avatar) ? 'invert(1) brightness(1.5)' : 'none',
                    cursor: 'pointer'
                  }"
                />
              </n-dropdown>
            </template>
            <template v-else>
              <n-button type="primary" secondary round size="small" @click="userStore.showLoginModal = true">
                登录 / 注册
              </n-button>
            </template>
          </n-flex>
        </n-flex>
      </n-layout-header>
      <n-layout-content 
        :content-style="{ padding: '16px' }" 
        :native-scrollbar="false"
        style="position: absolute; top: 64px; bottom: 0; left: 0; right: 0; overflow-y: auto;"
      >
        <router-view />
      </n-layout-content>
    </n-layout>
  </template>

  <!-- 桌面端布局 -->
  <template v-else>
    <n-layout has-sider position="absolute">
      <n-layout-sider
        bordered
        collapse-mode="width"
        :collapsed-width="64"
        :width="240"
        show-trigger
        :collapsed="collapsed"
        @collapse="collapsed = true"
        @expand="collapsed = false"
      >
        <n-flex 
          :justify="collapsed ? 'center' : 'flex-start'" 
          align="center" 
          :style="{ height: '64px', paddingLeft: collapsed ? '0' : '24px', overflow: 'hidden' }"
        >
          <n-gradient-text v-if="!collapsed" type="primary" :size="24" weight="bold" style="white-space: nowrap;">
            大观墙
          </n-gradient-text>
          <n-gradient-text v-else type="primary" :size="24" weight="bold">
            观
          </n-gradient-text>
        </n-flex>
        <n-menu
          :value="(route.name as string)"
          :options="menuOptions"
          :collapsed="collapsed"
          :collapsed-width="64"
          :collapsed-icon-size="22"
          :indent="18"
          :root-indent="18"
          default-expand-all
          :watch-props="['defaultExpandedKeys']"
          :render-label="renderMenuLabel"
          @update:value="handleMenuUpdate"
        />
      </n-layout-sider>
      <n-layout>
        <n-layout-header bordered position="absolute" style="height: 64px; padding: 0 24px;">
          <n-flex justify="space-between" align="center" style="height: 100%;">
            <n-breadcrumb style="max-width: 60%; overflow: hidden; white-space: nowrap;">
              <n-breadcrumb-item 
                v-for="(item, index) in breadcrumbs" 
                :key="index"
                @click="handleBreadcrumbClick(item.path)"
                :style="{ cursor: item.path ? 'pointer' : 'default' }"
              >
                <n-ellipsis style="max-width: 150px">
                  {{ item.label }}
                </n-ellipsis>
              </n-breadcrumb-item>
            </n-breadcrumb>
            <n-flex align="center">
              <n-button 
                quaternary 
                circle 
                size="large"
                @click="handleSyncCloud"
              >
                <template #icon>
                  <n-icon>
                    <CloudArrowDown24Regular />
                  </n-icon>
                </template>
              </n-button>
              <n-button 
                quaternary 
                circle 
                size="large"
                @click="themeStore.toggleTheme"
              >
                <template #icon>
                  <n-icon>
                    <component :is="themeStore.isDark ? Sunny : Moon" />
                  </n-icon>
                </template>
              </n-button>
              <template v-if="userStore.isLoggedIn">
                <n-dropdown 
                  trigger="hover" 
                  :options="userDropdownOptions" 
                  @select="handleUserDropdownSelect"
                >
                  <n-flex align="center" style="cursor: pointer;">
                    <n-avatar 
                      round 
                      size="small" 
                      color="transparent"
                      :src="userStore.user?.avatar || defaultAvatar" 
                      :style="{ 
                        filter: (themeStore.isDark && !userStore.user?.avatar) ? 'invert(1) brightness(1.5)' : 'none' 
                      }"
                    />
                    <n-text>{{ userStore.user?.nickname || userStore.user?.username }}</n-text>
                    <n-icon><ChevronDown24Regular /></n-icon>
                  </n-flex>
                </n-dropdown>
              </template>
              <template v-else>
                <n-button type="primary" secondary round @click="userStore.showLoginModal = true">
                  登录 / 注册
                </n-button>
              </template>
            </n-flex>
          </n-flex>
        </n-layout-header>
        <n-layout-content 
          content-style="padding: 24px;" 
          :native-scrollbar="false"
          style="position: absolute; top: 64px; bottom: 0; left: 0; right: 0; overflow-y: auto;"
        >
          <router-view />
        </n-layout-content>
      </n-layout>
    </n-layout>
  </template>

  <LoginModal 
    v-model:show="userStore.showLoginModal" 
    @switch-register="handleSwitchToRegister"
  />
  <RegisterModal 
    v-model:show="showRegisterModal" 
    @switch-login="handleSwitchToLogin"
  />
  
  <SyncModal />

  <n-drawer v-model:show="showMobileMenu" :width="280" placement="left">
    <n-drawer-content title="大观墙" closable>
      <n-menu
        :value="(route.name as string)"
        :options="menuOptions"
        :indent="18"
        :root-indent="18"
        default-expand-all
        :render-label="renderMenuLabel"
        @update:value="handleMenuUpdate"
      />
    </n-drawer-content>
  </n-drawer>
</template>
