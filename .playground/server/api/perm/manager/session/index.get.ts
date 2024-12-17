import { listServerSessionAttribute } from "../../../../../../server/utils/session"

export default defineEventHandler(async (event) => {
  return listServerSessionAttribute()
})