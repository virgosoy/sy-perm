/**
 * 依赖多个 services
 */
import type { UserForLogin } from '../models/models'
import { verifyPassword } from '../services/password'
import { getUserByAccount } from '../services/services'
import type { H3Event } from 'h3'

export const SERVER_SESSION_USER_ID_ATTRIBUTE_KEY = 'userId'
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