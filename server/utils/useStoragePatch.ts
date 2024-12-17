/**
 * 对 useStorage 的补丁工具方法
 */
import type { Storage } from 'unstorage'

/**
 * 移除所有 item
 * 为了代替 {@link Storage.clear | storage.clear()} 方法，后者在 base 没有作为挂载点的情况下 clear 不生效，即使用 useStorage(base).clear() 和 useStorage(base).clear(otherBase) 不生效。
 * @param storage 
 * @param base 指定 base，会仅移除指定 base 下的 item
 * @returns 
 * @author doc-snippet
 * @version 2024-12-17
 */
export async function removeItems(storage: Storage, base?: string) {
  const keys = await storage.getKeys(base)
  return Promise.all(keys.map(key => storage.removeItem(key)))
}