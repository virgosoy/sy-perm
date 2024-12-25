import { listRole } from "../../../../../server/services/services"

export default defineEventHandler(async (event) => {
  return listRole()
})