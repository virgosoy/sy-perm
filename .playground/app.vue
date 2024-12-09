<script setup lang="ts">
import type { User, UserForInsert } from '../server/models/models';

const account = ref('')
const password = ref('')

async function addUser() {
  const newId = await $fetch('/api/perm/user', {
    method: 'POST',
    body: {
      account: account.value,
      name: account.value,
      password: password.value,
    }
  })
  console.log(newId)
}
async function addRandomUser() {
  const newId = await $fetch('/api/perm/user', {
    method: 'POST',
    body: {
      account: 'test' + Math.random(),
      name: 'test',
      password: 'test',
    }
  })
  console.log(newId)
}
async function listUser() {
  const result = await $fetch('/api/perm/user', {
    method: 'GET',
  })
  console.log(result)
}

async function login() {
  const result = await $fetch('/api/perm/login', {
    method: 'POST',
    body: {
      account: account.value,
      password: password.value,
    }
  })
  console.log(result)
}
</script>

<template>
  <HelloWorld />
  <button @click="addRandomUser">addRandomUser</button><br>
  <button @click="listUser">listUser</button><br>
  account: <input v-model="account"/><br>
  password: <input v-model="password"/><br>
  <button @click="addUser">addUser</button><br>
  <button @click="login">login</button><br>
</template>
