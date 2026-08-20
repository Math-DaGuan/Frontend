<script setup lang="ts">
import { computed } from 'vue'
import katex from 'katex'

const props = defineProps<{
  content: string
}>()

const renderLatex = (text: string): string => {
  if (!text) return ''
  let result = text
  
  result = result.replace(/\$\$([\s\S]+?)\$\$/g, (_, formula) => {
    try {
      return katex.renderToString(formula, { displayMode: true, throwOnError: false })
    } catch {
      return `$$${formula}$$`
    }
  })
  
  result = result.replace(/\\\[([\s\S]+?)\\\]/g, (_, formula) => {
    try {
      return katex.renderToString(formula, { displayMode: true, throwOnError: false })
    } catch {
      return `\\[${formula}\\]`
    }
  })
  
  result = result.replace(/\$([^\$]+?)\$/g, (_, formula) => {
    try {
      return katex.renderToString(formula, { displayMode: false, throwOnError: false })
    } catch {
      return `$${formula}$`
    }
  })
  
  result = result.replace(/\\\(([\s\S]+?)\\\)/g, (_, formula) => {
    try {
      return katex.renderToString(formula, { displayMode: false, throwOnError: false })
    } catch {
      return `\\(${formula}\\)`
    }
  })
  
  return result
}

const renderedContent = computed(() => renderLatex(props.content))
</script>

<template>
  <div v-html="renderedContent" class="latex-render-content"></div>
</template>

<style scoped>
.latex-render-content {
  text-align: left;
  line-height: 1.8;
  font-size: 1.15rem;
}

:deep(.katex-display) {
  margin: 0.8em 0;
  overflow-x: auto;
  overflow-y: hidden;
}

:deep(.katex) {
  font-size: 1.05em;
}
</style>
