<template>
  <div class="q-pa-md">
    <q-input v-model="email" label="Email" />
    <q-btn label="傳送驗證碼" @click="sendCode" class="q-mt-sm" />
    <q-input v-model="code" label="驗證碼" class="q-mt-md" />
    <q-btn label="登入" @click="verifyCode" class="q-mt-sm" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router';

const router = useRouter();

const $q = useQuasar()
const email = ref('')
const code = ref('')

async function sendCode() {
  if (!email.value) {
    $q.notify({ type: 'negative', message: '請填寫Email' })
    return
  }
  $q.loading.show({ message: '寄送中...' })
  const body = new URLSearchParams({ action: 'sendCode', email: email.value })
  const res = await fetch('https://script.google.com/macros/s/AKfycbzyyLuw47h0qTpsO_2oOmfILATgDqddBrYCxL8AcDpQqn1J_rYTYswOxZIcASRezQjyGw/exec', {
    method: 'POST',
    body
  })
  const result = await res.json()
  $q.loading.hide()
  $q.notify({ type: result.success ? 'positive' : 'negative', message: result.success ? '已寄出驗證碼' : '寄送失敗' })
}

async function verifyCode() {
  if (!email.value || !code.value) {
    $q.notify({ type: 'negative', message: '請填寫所有欄位' })
    return
  }
  $q.loading.show({ message: '驗證中...' })
  const body = new URLSearchParams({ action: 'verifyCode', email: email.value, code: code.value })
  const res = await fetch('https://script.google.com/macros/s/AKfycbzyyLuw47h0qTpsO_2oOmfILATgDqddBrYCxL8AcDpQqn1J_rYTYswOxZIcASRezQjyGw/exec', {
    method: 'POST',
    body
  })
  const result = await res.json()
  $q.loading.hide()
  if (result.token) {
    localStorage.setItem('token', result.token)
    $q.notify({ type: 'positive', message: '登入成功' })
    await router.push('/score')
  } else {
    $q.notify({ type: 'negative', message: '登入失敗' })
  }
}
</script>
