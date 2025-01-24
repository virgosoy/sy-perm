import { listRoleIdByChildRoleId } from "../../../../../../../../server/services/services"


export default defineEventHandler(async (event) => {
  // 路由参数
  const roleId = parseInt(getRouterParam(event, 'roleId') ?? '')
  return listRoleIdByChildRoleId(roleId)
})