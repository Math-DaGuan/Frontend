<script setup lang="ts">
import { ref } from 'vue'
import { useMobile } from '../../utils/responsive'

const { isMobile } = useMobile()

const props = defineProps<{
  show: boolean
  loading: boolean
}>()

const emit = defineEmits<{
  'update:show': [value: boolean]
  submit: [type: string, content: string]
}>()

const feedbackType = ref('other')
const feedbackContent = ref('')

const typeOptions = [
  { label: '错别字', value: 'typo' },
  { label: '答案错误', value: 'answer_error' },
  { label: '解析错误', value: 'analysis_error' },
  { label: '其他', value: 'other' }
]

const handleSubmit = () => {
  emit('submit', feedbackType.value, feedbackContent.value)
}

const handleClose = () => {
  if (!props.loading) {
    emit('update:show', false)
    feedbackType.value = 'other'
    feedbackContent.value = ''
  }
}
</script>

<template>
  <n-modal
    :show="show"
    preset="card"
    title="题目纠错"
    :style="{ width: isMobile ? '90%' : '500px' }"
    :segmented="{ content: 'soft', footer: 'soft' }"
    :closable="!loading"
    :mask-closable="!loading"
    @update:show="handleClose"
  >
    <n-space vertical :size="20">
      <n-form-item label="错误类型" :show-feedback="false">
        <n-select
          v-model:value="feedbackType"
          :options="typeOptions"
          :disabled="loading"
        />
      </n-form-item>
      <n-form-item label="详细描述" :show-feedback="false">
        <n-input
          v-model:value="feedbackContent"
          type="textarea"
          placeholder="请详细描述题目中的错误，以便我们核实并修正..."
          :autosize="{ minRows: 4, maxRows: 8 }"
          :disabled="loading"
        />
      </n-form-item>
    </n-space>
    <template #footer>
      <n-flex justify="end">
        <n-button :disabled="loading" @click="handleClose">
          取消
        </n-button>
        <n-button
          type="primary"
          :loading="loading"
          @click="handleSubmit"
        >
          提交反馈
        </n-button>
      </n-flex>
    </template>
  </n-modal>
</template>
