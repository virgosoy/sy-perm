import type { Role } from "../../../../../../../../server/models/models"
import { setRoleExtendsRelation } from "../../../../../../../../server/services/services"

export default defineEventHandler<{body: Role['id'][]}>(async (event) => {
  // 请求体
  const body = await readBody(event)
  // 路由参数
  const childRoleId = parseInt(getRouterParam(event, 'roleId') ?? '')

  await setRoleExtendsRelation(childRoleId, body)
})