import type { PermForInsert } from "../../../../../server/models/models"
import { addPerm } from "../../../../../server/services/services"

export default defineEventHandler<{ body: PermForInsert }>(async (event) => {
  // 请求体
  const body = await readBody(event)
  await addPerm(body)
  return body.id
})