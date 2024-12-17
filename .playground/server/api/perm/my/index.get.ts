import { getUserByIdForFrontend } from "../../../../../server/services/services"

export default defineEventHandler(async (event) => {
  
  const userId = await getCurrentUserId(event)
  
  return userId !== null ? await getUserByIdForFrontend(userId) : void 0
})