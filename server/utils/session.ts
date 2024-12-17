
/**
 * 参考有修改：https://github.com/atinux/nuxt-auth-utils/blob/v0.5.5/src/runtime/server/utils/session.ts
 */

import { defu } from 'defu'
import { useSession, type H3Event, type SessionConfig } from 'h3'
import { ImpossibleError } from './common'
import { removeItems } from './useStoragePatch'

// /**
//  * 用户 session 数据
//  */
// export interface UserSession {
// }

// /**
//  * 从当前请求中获取用户会话
//  * @param event 请求 (h3) 事件
//  * @returns 用户会话
//  */
// export async function getClientSession(event: H3Event) {
//   return (await _useSession(event)).data
// }

// /**
//  * 更新用户会话
//  * @param event 请求 (h3) 事件
//  * @param data 用户会话数据，建议仅存储公共信息，因为它可以通过 API 调用进行解码
//  * @see https://github.com/atinux/nuxt-auth-utils
//  */
// export async function updateClientSession(event: H3Event, data: UserSession) {
//   const session = await _useSession(event)
//   await session.update(defu(data, session.data))
//   return session.data
// }

// export async function clearClientSession(event: H3Event) {
//   const session = await _useSession(event)
//   await session.update(undefined as any)
// }

/**
 * 失效 Session
 * @param event H3Event
 */
export async function invalidateSession(event: H3Event) {
  const session = await _useSession(event)
  const storage = _useStorage()
  if(typeof session.id === 'undefined') {
    throw new ImpossibleError('session id is undefined')
  }
  await removeItems(storage,`${session.id}`)
  await session.clear()
}

// FIXME: 前端 session 对应 cookie 没用后服务端 session 还在。



/**
 * 来源：node_modules\.pnpm\unstorage@1.12.0_ioredis@5.4.1\node_modules\unstorage\dist\shared\unstorage.28bc67f1.d.ts
 */
type StorageValue = null | string | number | boolean | object;

/**
 * 获取服务器端 Session 属性
 * @param event H3Event
 * @param key 属性名
 * @returns 属性值，如果不存在，返回 null。
 */
export async function getServerSessionAttribute<T extends StorageValue = StorageValue>(event: H3Event, key: string): Promise<T | null> {
  const session = await _useSession(event)
  const storage = _useStorage()
  if(typeof session.id === 'undefined') {
    throw new ImpossibleError('session id is undefined')
  }
  return storage.getItem<T>(`${session.id}:${key}`)
}

/**
 * 设置/覆盖 服务器端 Session 属性
 * @param event H3Event
 * @param key 属性名
 * @param value 属性值
 */
export async function setServerSessionAttribute<T extends StorageValue = StorageValue>(event: H3Event, key: string, value: T) {
  const session = await _useSession(event)
  const storage = _useStorage()
  if(typeof session.id === 'undefined') {
    throw new ImpossibleError('session id is undefined')
  }
  await storage.setItem(`${session.id}:${key}`, value)
}

/**
 * 清除服务器端当前 Session 的所有属性
 * @param event H3Event
 */
export async function clearServerSessionAttribute(event: H3Event) {
  // 旧名 invalidateServerSession
  const session = await _useSession(event)
  const storage = _useStorage()
  if(typeof session.id === 'undefined') {
    throw new ImpossibleError('session id is undefined')
  }
  await removeItems(storage, `${session.id}`)
}

let sessionConfig: SessionConfig

/**
 * 除了作为 storage 的命名空间之外，还作为 cookies 的 key
 */
const STORAGE_BASE = 'sy-perm-session'

/**
 * 封装 useSession，依赖环境变量 NUXT_SESSION_PASSWORD，不配置会随机生成
 * @param event 
 * @param config 
 * @returns 
 */
function _useSession(event: H3Event, config: Partial<SessionConfig> = {}) {
  if (!sessionConfig) {
    const runtimeConfig = useRuntimeConfig(event)
    const envSessionPassword = `${runtimeConfig.nitro?.envPrefix || 'NUXT_'}SESSION_PASSWORD`

    // sessionConfig = defu({ password: process.env[envSessionPassword] }, runtimeConfig.session)
    sessionConfig = { 
      name: STORAGE_BASE,
      password: process.env[envSessionPassword] ?? generateDefaultSessionPassword(),
    }
  }
  const finalConfig = defu(config, sessionConfig) as SessionConfig
  return useSession(event, finalConfig)
}

/**
 * 获取服务器所有 session 属性
 * @returns 类型为 { [id: string]: { [key: string]: StorageValue } }
 */
export async function listServerSessionAttribute() {
  const storage = _useStorage()
  const keys = await storage.getKeys()
  const group: Record<string, Record<string, unknown>> = {}
  await Promise.all(keys.map(async key => {
    const [id, attr] = key.split(':')
    const v = await storage.getItem(key)
    group[id] = group[id] || {}
    group[id][attr] = v
  }))
  return group
}

import { randomUUID } from 'uncrypto'

/**
 * 生成默认的 session 密码
 */
function generateDefaultSessionPassword() {
  // 参考 https://github.com/atinux/nuxt-auth-utils/blob/v0.5.5/src/module.ts
  return randomUUID().replace(/-/g, '')
}

/**
 * 封装 useStorage
 */
function _useStorage() {
  return useStorage(STORAGE_BASE)
}