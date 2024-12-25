/**
 * session 中包含用户相关的信息。
 * 依赖多个 services:
 * * session
 * * services
 */
import type { User, UserForLogin } from '../models/models'
import { verifyPassword } from '../services/password'
import { getUserByAccount } from '../services/services'
import type { H3Event } from 'h3'

/** 用户id 的 服务端 session attribute key */
const SERVER_SESSION_USER_ID_ATTRIBUTE_KEY = 'userId'
/** 登录时间 的 服务端 session attribute key */
const LOGIN_TIME_ATTRIBUT_KEY = 'loginTimeUtcMs'
/** 最后一次访问时间 的 服务端 session attribute key */
const LAST_VISIT_TIME_ATTRIBUT_KEY = 'lastVisitTimeUtcMs'

/**
 * 登录
 * @param userToken 这里的密码是明文
 */
export async function login(event: H3Event, userToken: UserForLogin) {
  const user = await getUserByAccount(userToken.account)
  if (!user) {
      return false
  }
  if(!await verifyPassword(userToken.password, user.salt, user.password)){
    return false
  }
  await setServerSessionAttribute(event, SERVER_SESSION_USER_ID_ATTRIBUTE_KEY, user.id)
  await setServerSessionAttribute(event, LOGIN_TIME_ATTRIBUT_KEY, Date.now())
  // 登录后刷新访问时间，因为 {@link sy-perm-session-refresh.ts} 是在之前触发的，没登录的话不会写入
  await refreshSessionVisitTime(event)
  return true
}

/**
 * 登出
 * 幂等，没登入进行登出也不会报错。
 * @param event H3Event
 */
export async function logout(event: H3Event) {
  // const userId = await getServerSessionAttribute(event, SERVER_SESSION_USER_ID_ATTRIBUTE_KEY)
  // if(typeof userId === null) {
  //   return true
  // }
  await invalidateSession(event)
  // 上面会清除全部的 session 信息，所以 {@link sy-perm-session-refresh.ts} 刷新访问时间的也会被清掉。但此处没什么影响故不需要特殊处理。
}

/**
 * 获取当前登录用户 ID
 * @param event 
 * @returns 未登录返回 null
 */
export async function getCurrentUserId(event: H3Event) {
  return await getServerSessionAttribute(event, SERVER_SESSION_USER_ID_ATTRIBUTE_KEY) as User['id'] | null
}

/**
 * 刷新 session 访问时间，无论是否有登录
 * 建议外部使用 {@link refreshSessionVisitTimeWhenLoggedIn} 替代，注意，功能不一样。
 * @param event H3Event
 */
async function refreshSessionVisitTime(event: H3Event) {
  await setServerSessionAttribute(event, LAST_VISIT_TIME_ATTRIBUT_KEY, Date.now())
}

/**
 * 当已经登录时刷新 session 访问时间，否则不操作
 * @param event H3Event
 */
export async function refreshSessionVisitTimeWhenLoggedIn(event: H3Event) {
  if(await getCurrentUserId(event) === null) {
    return
  }
  await refreshSessionVisitTime(event)
}