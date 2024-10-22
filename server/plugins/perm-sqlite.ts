import sqlite3 from 'sqlite3'
import { open, type Database } from 'sqlite'

//#region 重要配置
/**
 * 环境变量来控制 sqlite3 数据库文件路径
 */
const DB_FILE_PATH = (useRuntimeConfig().sqlite3DbFilePath ?? ':memory:') as string
//#endregion

/**
 * 初始化表结构 sql
 */
const initSchema = `
  -- 创建 User 表
  CREATE TABLE User (
      id INTEGER PRIMARY KEY,
      account TEXT NOT NULL,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      disable BOOLEAN NOT NULL,
      description TEXT
  );

  -- 创建 Role 表
  CREATE TABLE Role (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT
  );

  -- 创建 Perm（Permission）表
  CREATE TABLE Perm (
      id INTEGER PRIMARY KEY,
      key TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT
  );

`

export default defineNitroPlugin(async (nitroApp) => {
  openDb(db => db.run(initSchema))
})

//#region 类型定义
/**
 * 命名参数类型，会在泛型类型的字符串 key 加上 $ 前缀
 */
type NamedParameter<T> = {
  [K in keyof T as K extends string ? `$${K}` : never]: T[K]
}

/**
 * 含有 rowid 的表。会在泛型类型加上名为 rowid 的 key
 */
export type RowidTable<T> = T & {
  rowid: number
}
//#endregion

//#region 工具方法
/**
 * 打开数据库并返回数据库对象
 */
export async function openDb() : Promise<Database>
/**
 * 打开数据库，执行回调后关闭数据库，并返回其结果
 * @param callback - 参数为数据库对象
 */
export async function openDb<R>(callback: (db: Database) => R | Promise<R>) : Promise<R>
export async function openDb<R>(callback ?: (db: Database) => R | Promise<R>) : Promise<Database | R>{
  const driver = process.dev ? sqlite3.verbose().Database : sqlite3.Database
  const db = await open({
    filename: DB_FILE_PATH,
    driver,
  })
  
  process.dev && db.on('trace', (sql: string) => {
    console.log(`sql = ${sql}`)
  })

  if(callback){
    const result = await callback(db)
    await db.close()
    return result
  }else{
    return db
  }
}
//#endregion

//#region PermDb 实现
import {type PermDb, setPermDb } from '../services/services'
import type { Perm, Role, User } from '../models/models'

setPermDb({
  async listPerm() {
    return openDb(db => db.all<RowidTable<Perm>[]>('select rowid,* from perm'))
  },
  async listUser() {
    return openDb(db => db.all<RowidTable<User>[]>('select rowid,* from user'))
  },
  async listRole() {
    return openDb(db => db.all<RowidTable<Role>[]>('select rowid,* from role'))
  },
})


//#endregion