import type { UserForLogin } from "../../../../../server/models/models"
import { verifyUserPassword } from "../../../../../server/services/services"

export default defineEventHandler(async (event) => {
  // 请求体
  const body = await readBody<UserForLogin>(event)
  
  return await verifyUserPassword(body)
})