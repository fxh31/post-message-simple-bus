import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

console.log('child: main')
app.mount('#app')

// window.addEventListener('message', (event) => {
//   console.log('child received message:', event.data)
// })
