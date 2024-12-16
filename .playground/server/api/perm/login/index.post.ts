import type { UserForLogin } from "../../../../../server/models/models"
import { login } from "../../../../../server/utils/perm-session"

export default defineEventHandler(async (event) => {
  // 请求体
  const body = await readBody<UserForLogin>(event)
  
  return await login(event, body)
})