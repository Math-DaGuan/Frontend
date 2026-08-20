<script setup lang="ts">
import { ref, watch } from 'vue'
import { useMobile } from '../../utils/responsive'

const { isMobile } = useMobile()

const props = defineProps<{
  show: boolean
  initialNote: string
  loading: boolean
}>()

const emit = defineEmits<{
  'update:show': [value: boolean]
  save: [note: string]
}>()

const noteValue = ref(props.initialNote)

watch(() => props.show, (newVal) => {
  if (newVal) {
    noteValue.value = props.initialNote
  }
})

const handleSave = () => {
  emit('save', noteValue.value)
}

const handleClose = () => {
  if (!props.loading) {
    emit('update:show', false)
  }
}
</script>

<template>
  <n-modal
    :show="show"
    preset="card"
    title="题目笔记"
    :style="{ width: isMobile ? '90%' : '500px' }"
    :segmented="{ content: 'soft', footer: 'soft' }"
    :closable="!loading"
    :mask-closable="!loading"
    @update:show="handleClose"
  >
    <n-space vertical>
      <n-input
        v-model:value="noteValue"
        type="textarea"
        placeholder="在此输入您的笔记内容..."
        :autosize="{ minRows: 5, maxRows: 12 }"
        :disabled="loading"
      />
    </n-space>
    <template #footer>
      <n-flex justify="end">
        <n-button :disabled="loading" @click="handleClose">
          取消
        </n-button>
        <n-button
          type="primary"
          :loading="loading"
          @click="handleSave"
        >
          保存笔记
        </n-button>
      </n-flex>
    </template>
  </n-modal>
</template>
