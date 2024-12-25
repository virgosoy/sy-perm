import { listPerm } from "../../../../../server/services/services"

export default defineEventHandler(async (event) => {
  return listPerm()
})