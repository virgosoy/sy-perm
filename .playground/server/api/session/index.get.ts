import { SERVER_SESSION_USER_ID_ATTRIBUTE_KEY } from "../../../../server/utils/perm-session"

export default defineEventHandler(async (event) => {
  const result = await getServerSessionAttribute(event, SERVER_SESSION_USER_ID_ATTRIBUTE_KEY)
  return result
})