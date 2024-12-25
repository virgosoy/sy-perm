/** 
 * 访问服务器后端时刷新 session 访问时间
 * @see {@link refreshSessionVisitTimeWhenLoggedIn}
 */

import { refreshSessionVisitTimeWhenLoggedIn } from "../utils/perm-session"

export default defineEventHandler(async (event) => {
  await refreshSessionVisitTimeWhenLoggedIn(event)
})