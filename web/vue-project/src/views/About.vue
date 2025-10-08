<template>
  <div>aboujt</div>
</template>

<script setup lang="ts">
import { PostMessageBus } from 'post-message-simple-bus'
import { inject } from 'vue'

// const postBus = new PostMessageBus()
const token = inject('token')
console.log('about', token.value)
// postBus.on('token', (source, data) => {
//   console.log('source', source)
//   console.log('child about received message:', data)
// })
</script>
