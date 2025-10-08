<script setup lang="ts">
import { onMounted, provide, ref } from 'vue'
import { PostMessageBus } from 'post-message-simple-bus'

const postBus = new PostMessageBus({
  targetOrigin: 'http://localhost:5100',
  targetWindow: window.parent,
})

function sendMessage() {
  // window.parent.postMessage({ type: 'loaded' }, 'http://localhost:5100')
  postBus.emit('loaded', {
    name: 'loaded from child',
  })
}
sendMessage()
const token = ref('ddd')
// postBus.destroy()
postBus.on('token', (source, data) => {
  console.log('source', source)
  console.log('child about received message:', data)
  token.value = data
})
provide('token', token)

onMounted(() => {
  console.log('child: app mounted')
})
</script>

<template>
  <h1>You did it!</h1>
  <router-view />
</template>

<style scoped></style>
