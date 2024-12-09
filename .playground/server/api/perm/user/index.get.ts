import { listUser } from "../../../../../server/services/services"

export default defineEventHandler(async (event) => {
  return listUser()
})