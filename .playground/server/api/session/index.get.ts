import { getCurrentUserId } from "../../../../server/utils/perm-session"

export default defineEventHandler(async (event) => {
  const result = await getCurrentUserId(event)
  return result
})