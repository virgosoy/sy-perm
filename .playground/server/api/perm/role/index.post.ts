import type { RoleForInsert } from "../../../../../server/models/models"
import { addRole } from "../../../../../server/services/services"

export default defineEventHandler<{ body: RoleForInsert }>(async (event) => {
  // 请求体
  const body = await readBody(event)
  await addRole(body)
  return body.id
})