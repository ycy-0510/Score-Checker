<template>
  <div class="q-pa-md">
    <div class="row items-center q-gutter-sm">
      <div class="col-auto">
        <q-btn label="查詢成績" @click="getScore" />
      </div>
      <div class="col-auto">
        <q-btn label="登出" @click="logout" class="q-ml-sm" />
      </div>
    </div>
    <q-card class="q-mt-md">
      <q-card-section>
        <div class="text-h6">使用者資訊</div>
        <div>座號: {{ userInfo.number }}</div>
        <div>Email: {{ userInfo.email }}</div>
      </q-card-section>
    </q-card>
    <q-separator />
    <q-markup-table v-if="result" flat bordered class="q-mt-md">
      <thead>
        <tr>
          <th>項目</th>
          <th>分數</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(k, i) in Object.keys(result)" :key="i">
          <td>{{ k }}</td>
          <td :class="{ 'bg-negative': result[k] == '-', 'text-white': result[k] == '-' }">{{ result[k]
            == '-' ? '成績證明無效' :result[k]}}</td>
        </tr>
      </tbody>
    </q-markup-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

onMounted(async () => {
  await getScore();
})

const router = useRouter()

const result = ref(null)
const userInfo = ref({
  number: '',
  email: ''
})
const $q = useQuasar()

async function getScore() {
  const token: string | null = localStorage.getItem('token')
  if (!token) {
    $q.notify({ type: 'negative', message: '請先登入' })
    await router.push('/')
    return
  }
  $q.loading.show({ message: '查詢中...' })
  const body = new URLSearchParams({ action: 'getScore', token: token })
  const res = await fetch('https://script.google.com/macros/s/AKfycbzyyLuw47h0qTpsO_2oOmfILATgDqddBrYCxL8AcDpQqn1J_rYTYswOxZIcASRezQjyGw/exec', {
    method: 'POST',
    body
  })
  const data = await res.json()
  $q.loading.hide()
  if (data.error) {
    $q.notify({ type: 'negative', message: data.error })
  } else {
    userInfo.value = {
      number: data['座號'],
      email: data['Email'],
    }
    delete data['Email']
    delete data['座號']
    delete data['Token']
    result.value = data
  }
}

async function logout() {
  localStorage.removeItem('token')
  $q.notify({ type: 'positive', message: '登出成功' })
  await router.push('/')
}
</script>
