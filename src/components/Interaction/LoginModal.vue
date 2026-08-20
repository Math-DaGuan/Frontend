<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Person24Regular, LockClosed24Regular } from '@vicons/fluent'
import { useMessage } from 'naive-ui'
import { authApi } from '../../api/auth'
import { useUserStore } from '../../store/user'
import { useMobile } from '../../utils/responsive'

const { isMobile } = useMobile()

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits(['update:show', 'success', 'switch-register'])

const message = useMessage()
const userStore = useUserStore()

const loading = ref(false)
const model = reactive({
  username: '',
  password: ''
})

const rules = {
  username: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur'
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: 'blur'
  }
}

async function handleLogin() {
  loading.value = true
  try {
    const res = await authApi.login(model)
    userStore.setToken(res.access_token)
    userStore.setUser(res.user)
    message.success('登录成功，正在跳转...')
    emit('success')
    setTimeout(() => {
      window.location.href = '/'
    }, 500)
  } catch (err: any) {
    message.error(err.message || '登录失败')
  } finally {
    loading.value = false
  }
}

function closeModal() {
  emit('update:show', false)
}

function switchToRegister() {
  emit('switch-register')
}
</script>

<template>
  <n-modal
    :show="show"
    preset="card"
    style="width: 90%; max-width: 400px; border-radius: 12px;"
    title="用户登录"
    :bordered="false"
    @update:show="closeModal"
  >
    <n-space vertical :size="isMobile ? 'medium' : 'large'">
      <n-form ref="formRef" :model="model" :rules="rules" size="large">
        <n-form-item path="username" label="用户名">
          <n-input v-model:value="model.username" placeholder="请输入用户名">
            <template #prefix>
              <n-icon><Person24Regular /></n-icon>
            </template>
          </n-input>
        </n-form-item>
        <n-form-item path="password" label="密码">
          <n-input
            v-model:value="model.password"
            type="password"
            show-password-on="mousedown"
            placeholder="请输入密码"
            @keyup.enter="handleLogin"
          >
            <template #prefix>
              <n-icon><LockClosed24Regular /></n-icon>
            </template>
          </n-input>
        </n-form-item>
      </n-form>

      <n-button type="primary" block size="large" :loading="loading" @click="handleLogin">
        登录
      </n-button>
      
      <n-flex justify="center">
        <n-button quaternary type="primary" size="small" @click="switchToRegister">立即注册</n-button>
      </n-flex>
    </n-space>
  </n-modal>
</template>
