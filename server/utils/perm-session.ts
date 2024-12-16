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