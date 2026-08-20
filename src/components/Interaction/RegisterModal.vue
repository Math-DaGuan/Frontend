<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  Person24Regular,
  LockClosed24Regular,
  ContactCard24Regular,
  ShieldKeyhole24Regular
} from '@vicons/fluent'
import { useMessage } from 'naive-ui'
import { authApi } from '../../api/auth'
import { useMobile } from '../../utils/responsive'
import qrcode from '../../assets/qrcode.jpg'

const { isMobile } = useMobile()

const props = defineProps<{
  show: boolean
}>()

const emit = defineEmits(['update:show', 'success', 'switch-login'])

const message = useMessage()

const loading = ref(false)
const showQRModal = ref(false)
const model = reactive({
  username: '',
  password: '',
  nickname: '',
  verification_code: ''
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
  },
  nickname: {
    required: false,
    trigger: 'blur'
  },
  verification_code: {
    required: true,
    message: '请输入验证码',
    trigger: 'blur'
  }
}

async function handleRegister() {
  loading.value = true
  try {
    await authApi.register(model)
    message.success('注册成功，请登录')
    emit('success')
    closeModal()
  } catch (err: any) {
    message.error(err.message || '注册失败')
  } finally {
    loading.value = false
  }
}

function handleGetCode() {
  showQRModal.value = true
}

function closeModal() {
  emit('update:show', false)
}

function switchToLogin() {
  emit('switch-login')
}
</script>

<template>
  <n-modal
    :show="show"
    preset="card"
    style="width: 90%; max-width: 440px; border-radius: 12px;"
    title="用户注册"
    :bordered="false"
    @update:show="closeModal"
  >
    <n-space vertical :size="isMobile ? 'medium' : 'large'">
      <n-form ref="formRef" :model="model" :rules="rules" size="large">
        <n-form-item path="username" label="用户名">
          <n-input v-model:value="model.username" placeholder="建议使用手机号或邮箱">
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
            placeholder="请输入 6-18 位密码"
          >
            <template #prefix>
              <n-icon><LockClosed24Regular /></n-icon>
            </template>
          </n-input>
        </n-form-item>

        <n-form-item path="nickname" label="昵称">
          <n-input v-model:value="model.nickname" placeholder="想一个好听的名字吧">
            <template #prefix>
              <n-icon><ContactCard24Regular /></n-icon>
            </template>
          </n-input>
        </n-form-item>

        <n-form-item path="verification_code" label="验证码">
          <n-input-group>
            <n-input v-model:value="model.verification_code" placeholder="请输入验证码">
              <template #prefix>
                <n-icon><ShieldKeyhole24Regular /></n-icon>
              </template>
            </n-input>
            <n-button ghost @click="handleGetCode">
              获取验证码
            </n-button>
          </n-input-group>
        </n-form-item>
      </n-form>

      <n-button type="primary" block size="large" :loading="loading" @click="handleRegister">
        立即注册
      </n-button>
      
      <n-flex justify="center">
        <n-text depth="3">已有账号？</n-text>
        <n-button text type="primary" @click="switchToLogin">直接登录</n-button>
      </n-flex>
    </n-space>
  </n-modal>

  <n-modal
    v-model:show="showQRModal"
    preset="card"
    style="width: 90%; max-width: 340px; border-radius: 12px; text-align: center;"
    title="微信扫码获取验证码"
    :bordered="false"
  >
    <n-flex vertical align="center" size="large">
      <n-image
        width="240"
        :src="qrcode"
      />
      <n-text depth="3">
        扫描二维码，关注微信公众号<n-text type="primary" strong>“帕拉迪宇”</n-text>，发送<n-text type="primary" strong>“注册”</n-text>来获取注册验证码。
      </n-text>
    </n-flex>
  </n-modal>
</template>
