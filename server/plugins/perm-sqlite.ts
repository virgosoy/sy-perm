// import sqlite3 from 'sqlite3'
// import { open, type Database } from 'sqlite'

import Database from 'better-sqlite3'
import type BetterSqlite3 from 'better-sqlite3'

//#region 重要配置
/**
 * 环境变量来控制 sqlite3 数据库文件路径
 * // TODO: 
 */
const DB_FILE_PATH = (useRuntimeConfig().sqlite3DbFilePath ?? './sy-perm.sqlite.db') as string
//#endregion

/**
 * 初始化表结构 sql
 */
const initSchema = /*SQL*/`
  -- 创建 User 表
  CREATE TABLE IF NOT EXISTS User (
      id INTEGER PRIMARY KEY,
      account TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      salt TEXT NOT NULL,
      disable BOOLEAN NOT NULL DEFAULT 0,
      description TEXT
  );

  -- 创建 Role 表
  CREATE TABLE IF NOT EXISTS Role (
      id INTEGER PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      description TEXT
  );

  -- 创建 Perm（Permission）表
  CREATE TABLE IF NOT EXISTS Perm (
      id INTEGER PRIMARY KEY,
      key TEXT UNIQUE NOT NULL,
      name TEXT UNIQUE NOT NULL,
      description TEXT
  );

`

export default defineNitroPlugin(async (nitroApp) => {
  console.log('init sqlite3 db')
  openDb(db => db.exec(initSchema))
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
 * 打开数据库并返回数据库对象，不会自动关闭数据库
 * @example 
 * ```ts
 * const db = openDb()
 * // Some custom op, e.g. db.prepare(...)
 * const stmt = db.prepare(...)
 * const result = stmt.all()
 * ```
 */
export function openDb() : BetterSqlite3.Database
/**
 * 打开数据库，执行回调后关闭数据库，并返回其结果
 * @param callback - 参数为数据库对象
 * @example
 * ```ts
 * openDb(db => db.prepare(...).all())
 * ```
 */
export function openDb<R>(callback: (db: BetterSqlite3.Database) => R) : R
/**
 * 基于 better-sqlite3
 * @author doc-snippet
 * @version 0.0.1 初稿
 */
export function openDb<R>(callback ?: (db: BetterSqlite3.Database) => R) : BetterSqlite3.Database | R{
  
  const db = new Database(DB_FILE_PATH, {verbose: import.meta.dev ? console.log : undefined});
  db.pragma('journal_mode = WAL');
  
  // import.meta.dev && db.on('trace', (sql: string) => {
  //   console.log(`sql = ${sql}`)
  // })

  if(callback){
    const result = callback(db)
    db.close()
    return result
  }else{
    return db
  }
}
//#endregion

//#region PermDb 实现
import { setPermDb } from '../services/services'
import type { Perm, Role, RoleForInsert, User, UserForInsert } from '../models/models'
// import { SQL } from 'sql-template-strings'

setPermDb({
  async listPerm() {
    return openDb().prepare<[], RowidTable<Perm>>('select rowid,* from perm').all()
  },
  async listUser() {
    return openDb().prepare<[], RowidTable<User>>('select rowid,* from user').all()
  },
  async listRole() {
    return openDb().prepare<[], RowidTable<Role>>('select rowid,* from role').all()
  },
  async getUserByAccount(userAccount) {
    return openDb().prepare<[string], RowidTable<User>>(/*sql*/`
      select rowid,* from user where account = ?
    `).get(userAccount)
  },
  async getUserById(userId) {
    return openDb().prepare<[number], RowidTable<User>>(/*sql*/`
      select rowid,* from user where id = ?
    `).get(userId)
  },
  async addUser(user) {
    // return openDb(db => db.run('insert into user(account,name,password,disable,description) values(?,?,?,?,?)', [user.account, user.name, user.password, user.disable, user.description]))
    const info = openDb().prepare<UserForInsert>(/*sql*/`
      insert into user(account,name,password,salt,disable,description) 
      values(@account,@name,@password,@salt,@disable,@description)`
    ).run({
      account: user.account, 
      name: user.name, 
      password: user.password, 
      salt: user.salt, 
      disable: user.disable ?? 0, 
      description: user.description
    })
    // const result = await openDb(db => db.run(SQL`
    //   insert into user(account,name,password,salt,disable,description) 
    //   values(${user.account},${user.name},${user.password},${user.salt},${user.disable ?? 0},${user.description})
    // `))
    // 唯一约束错误在上面抛出
    if(typeof(info.lastInsertRowid)!=='undefined'){
      user.id = info.lastInsertRowid as number // 默认返回 number
    }
    // if(typeof(result.lastID)!=='undefined'){
    //   user.id = result.lastID
    // }
  },
  async addRole(role) {
    const info = openDb().prepare<RoleForInsert>(/*sql*/`
      insert into role(name,description) values(@name, @description)
    `).run({
      name: role.name, 
      description: role.description,
    })
    // 唯一约束错误在上面抛出
    role.id = info.lastInsertRowid as number // 默认返回 number
  },
})


//#endregion