/**
 * 依赖多个 services:
 * * session
 * * services
 */
import type { User, UserForLogin } from '../models/models'
import { verifyPassword } from '../services/password'
import { getUserByAccount } from '../services/services'
import type { H3Event } from 'h3'

const SERVER_SESSION_USER_ID_ATTRIBUTE_KEY = 'userId'
const LOGIN_TIME_ATTRIBUT_KEY = 'loginTimeUtcMs'
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
}

/**
 * 获取当前登录用户 ID
 * @param event 
 * @returns 未登录返回 null
 */
export async function getCurrentUserId(event: H3Event) {
  return await getServerSessionAttribute(event, SERVER_SESSION_USER_ID_ATTRIBUTE_KEY) as User['id'] | null
}