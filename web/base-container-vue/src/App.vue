<script setup lang="ts">
import { ref, onMounted, onUpdated, unref, toRefs, computed } from 'vue'
import { PostMessageBus } from 'post-message-simple-bus'
const iframeRef = ref<HTMLIFrameElement | null>(null)
const currentIndex = ref('vue-app')

// const targetWindow = computed(() => {
//   return document.getElementById('iframeId-' + currentIndex.value)?.contentWindow
// })

const postBus = new PostMessageBus()
const busSource = ref('')
function handleLoad() {
  // iframeRef.value?.contentWindow?.postMessage({ type: 'loaed' }, '*')
  console.log('Iframe loaded---')
}

postBus.on('loaded', (source) => {
  console.log('Container received message:', source)
  source.emit('token', {
    name: 'token from container',
  })
  busSource.value = source
})
// window.addEventListener('message', (event) => {
//   const { type } = event.data
//   if (type === 'loaded') {
//     console.log('Container received message:', event)
//     iframeRef.value?.contentWindow?.postMessage({ type: 'token' }, '*')
//   }
// })

function handleRemove() {
  console.log('remove---')
  window.removeEventListener('message', () => {})
}

const urlData = [
  { url: 'http://localhost:5175/about', name: 'vue-app' },
  // { url: 'http://localhost:3000/', name: 'react-app' },
]

function handleChangeUrl() {
  currentIndex.value = currentIndex.value === 'vue-app' ? 'react-app' : 'vue-app'
}
function sendMessage() {
  const iframe = document.getElementById('iframeId-' + currentIndex.value)
  // console.log('sendMessage---', unref(iframeRef.value))
  // console.log(iframe)
  // postBus.config({
  //   targetWindow: iframe?.contentWindow,
  //   targetOrigin: '*',
  // })
  // postBus.emit('token', {
  //   token: 'dddd',
  // })
  // busSource.value.emit('token', {
  //   token: 'dddd',
  // })
  postBus
  // unref(iframeRef.value)?.contentWindow?.postMessage({ type: 'token' }, '*')
  // iframe?.contentWindow?.postMessage({ type: 'token' }, '*')
}

onMounted(() => {
  // handleLoad()
  console.log('App.vue mounted---')
})
</script>

<template>
  <h1>Container</h1>
  <button @click="handleRemove">remote</button>
  <button @click="handleChangeUrl">handleChangeUrl</button>
  <button @click="sendMessage">sendMessage</button>
  <div v-for="item in urlData" :key="item.name">
    <h2>{{ currentIndex }}</h2>
    <iframe
      v-show="item.name === currentIndex"
      style="width: 100%; height: 90vh; border: none"
      :id="'iframeId-' + currentIndex"
      ref="iframeRef"
      :src="item.url"
      @load="handleLoad"
    ></iframe>
  </div>
</template>

<style scoped></style>
