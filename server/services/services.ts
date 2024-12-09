
import type { Perm, Role, User, UserForInsert } from '../models/models'


/**
 * @implements 这里的方法专注于不同数据库 sql 读写数据，而非逻辑。
 */
export interface PermDb {
    listUser(): Promise<User[]>
    listRole(): Promise<Role[]>
    listPerm(): Promise<Perm[]>
    /**
     * @param user 这里的密码是密文了，salt 字段也有值
     * @implements 实现必须要回写参数的 id
     */
    addUser(user: UserForInsert): Promise<void>
}

let _db: PermDb
export function setPermDb(db: PermDb) {
    _db = db
}

export async function listUser() {
    return _db.listUser()
}

export async function listRole() {
    return _db.listRole()
}

export async function listPerm() {
    return _db.listPerm()
}

export async function listPermKeyByUserId(userId: User['id']) {
    return // TODO:
}

export async function hasPermKeyByUserId(userId: User['id'], permKey: Perm['key']) {
    return // TODO:
}

export async function listPermKeyByRoleId(roleId: Role['id']) {
    return // TODO:
}

export async function listRoleIdByPermKey(permKey: Perm['key']) {
    return // TODO:
}

export async function listUserIdByPermKey(permKey: Perm['key']) {
    return // TODO:
}

export async function getRoleWithAncestors(roleId: Role['id']) {
    // TODO:
}

export async function getRoleWithDescendants(roleId: Role['id']) {
    return // TODO:
}

export async function roleTree() {
    // TODO: 
    return []
}

import crypto from 'crypto'

/**
 * 添加用户
 * @param user 注：传入的密码是明文，执行后变密文。并会赋予 salt 字段值。
 * @returns 
 */
export async function addUser(user: UserForInsert) {
    const salt = crypto.randomBytes(16).toString('hex')
    const encodePassword = crypto.createHash('md5').update(user.password + salt).digest('hex')
    user.salt = salt
    user.password = encodePassword
    console.log({salt, encodePassword})
    return _db.addUser(user)
}

export async function addRole(role: Role) {
    return // TODO:
}

export async function addPerm(perm: Perm) {
    return // TODO:
}

/**
 * 重设连接关联关系，等同于移除全部关系后设置，角色与其父角色
 */
export async function setRoleExtendsRelation(roleId: Role['id'], parentIds: Role['id'][]) {
    // TODO:
}

/**
 * 新增连接关联关系，角色与其父角色。不会移除原有的关系。
 */
export async function addRoleExtendsRelation(roleId: Role['id'], parentIds: Role['id'][]) {
    // TODO:
}

/**
 * 移除连接关联关系，角色与其父角色
 */
export async function removeRoleExtendsRelation(roleId: Role['id'], parentIds: Role['id'][]) {
    // TODO:
}

