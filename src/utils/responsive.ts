import { ref, onMounted, onUnmounted } from 'vue'

export function useMobile() {
  const isMobile = ref(window.innerWidth < 768)
  
  const checkScreen = () => {
    isMobile.value = window.innerWidth < 768
  }

  onMounted(() => {
    window.addEventListener('resize', checkScreen)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', checkScreen)
  })

  return {
    isMobile
  }
}
