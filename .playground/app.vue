<script setup lang="ts">
import type { User, UserForInsert } from '../server/models/models';

async function addUser() {
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
</script>

<template>
  <HelloWorld />
  <button @click="addUser">addUser</button><br>
  <button @click="listUser">listUser</button>
</template>
