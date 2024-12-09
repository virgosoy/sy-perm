import type { UserForInsert } from "../../../../../server/models/models"
import { addUser } from "../../../../../server/services/services"

export type UserForInsertReq = Omit<UserForInsert, 'salt'>
export default defineEventHandler<{ body: UserForInsertReq }>(async (event) => {
  // 请求体
  const body = await readBody(event)
  console.log(body)
  await addUser(body as UserForInsert) // 实现的 salt 没用故可强转
  return body.id
})