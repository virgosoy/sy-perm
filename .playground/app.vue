<script setup lang="ts">
import type { PermForInsert, Role, RoleForInsert, UserForInsert } from '../server/models/models';

const account = ref('')
const password = ref('')

async function addUser() {
  const newId = await $fetch('/api/perm/user', {
    method: 'POST',
    body: {
      account: account.value,
      name: account.value,
      password: password.value,
    } as UserForInsert
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
    } as UserForInsert
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

async function logout() {
  const result = await $fetch('/api/perm/logout', {
    method: 'POST',
  })
  console.log(result)
}

async function getSession() {
  const result = await $fetch('/api/session', {
    method: 'GET',
  })
  console.log(result)
}

async function getCurrentUser() {
  const result = await $fetch('/api/perm/my', {
    method: 'GET',
  })
  console.log(result)
}

async function listSession() {
  const result = await $fetch('/api/perm/manager/session', {
    method: 'GET',
  })
  console.log(result)
}

async function listRole() {
  const result = await $fetch('/api/perm/role', {
    method: 'GET',
  })
  console.log(result)
}

async function addRandomRole() {
  const newId = await $fetch('/api/perm/role', {
    method: 'POST',
    body: {
      name: 'test' + Math.random(),
      description: 'test' + Math.random(),
    } satisfies RoleForInsert
  })
  console.log(newId)
}
const roleName = ref('')
async function addRole() {
  const newId = await $fetch('/api/perm/role', {
    method: 'POST',
    body: {
      name: roleName.value,
    } as RoleForInsert
  })
  console.log(newId)
}

async function listPerm() {
  const result = await $fetch('/api/perm/perm', {
    method: 'GET',
  })
  console.log(result)
}

async function addRandomPerm() {
  const newId = await $fetch('/api/perm/perm', {
    method: 'POST',
    body: {
      key: 'test' + Math.random(),
      name: 'test' + Math.random(),
    } as PermForInsert
  })
  console.log(newId)
}
const permKey = ref('')
const permName = ref('')

async function addPerm() {
  const newId = await $fetch('/api/perm/perm', {
    method: 'POST',
    body: {
      key: permKey.value,
      name: permName.value,
    } as PermForInsert
  })
  console.log(newId)
}

const roleList = ref<Role[]>([])

onMounted(async () => {
  roleList.value = await $fetch('/api/perm/role', {
    method: 'GET',
  })
})

const currentRoleId = ref()
const targetRoleIds = ref<Role['id'][]>([])

watchEffect(async () => {
  if (currentRoleId.value) {
    targetRoleIds.value = await $fetch(`/api/perm/role/${currentRoleId.value}/parent/id`, {
      method: 'GET',
    })
  }
})

async function setRoleExtendsRelation(){
  await $fetch(`/api/perm/role/${currentRoleId.value}/parent/id`, {
    method: 'POST',
    body: targetRoleIds.value,
  })
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
  <button @click="logout">logout</button><br>
  <button @click="getSession">getSession</button><br>
  <button @click="getCurrentUser">getCurrentUser</button><br>
  <button @click="listSession">listSession</button><br>
  <button @click="listRole">listRole</button><br></br>
  <button @click="addRandomRole">addRandomRole</button><br>
  roleName: <input v-model="roleName"/><br>
  <button @click="addRole">addRole</button><br>
  <button @click="listPerm">listPerm</button><br></br>
  <button @click="addRandomPerm">addRandomPerm</button><br>
  permKey: <input v-model="permKey"/><br>
  permName: <input v-model="permName"/><br>
  <button @click="addPerm">addPerm</button><br>
  <h1>role extends</h1>
  <div>
    current role: 
    <select v-model="currentRoleId">
      <option v-for="role in roleList" :value="role.id">{{ role.name }}</option>
    </select>
    target role:
    <div v-for="targetRoleId, index in targetRoleIds" >
      <select v-model="targetRoleIds[index]">
        <option v-for="role in roleList.filter(v => v.id !== currentRoleId && !targetRoleIds.includes(v.id) || v.id == targetRoleIds[index])" 
          :value="role.id">{{ role.name }}</option>
      </select>
      <button @click="targetRoleIds.splice(index, 1)">remove</button>
    </div>
    <button @click="targetRoleIds.push(0)">add</button>
    <button @click="setRoleExtendsRelation">setRoleExtendsRelation</button>
  </div>
</template>
