/** 依赖其他 services */
import { generateSalt, hashPassword, verifyPassword } from './password'

import type { Perm, PermForInsert, Role, RoleForInsert, User, UserForInsert, UserForLogin } from '../models/models'

/**
 * @implements 这里的方法专注于不同数据库 sql 读写数据，而非逻辑。
 */
export interface PermDb {
    listUser(): Promise<User[]>
    /**
     * @implements 查询所有字段的原始存储，即加密的密码也要拿出来。获取不到返回 undefined。
     */
    getUserByAccount(userAccount: User['account']): Promise<User | undefined>
    /**
     * 根据 id 获取 user
     * @implements 查询所有字段的原始存储，即加密的密码也要拿出来。获取不到返回 undefined。
     */
    getUserById(userId: User['id']): Promise<User | undefined>
    /**
     * @param user 这里的密码是密文了，salt 字段也有值
     * @implements 实现必须要回写参数的 id
     */
    addUser(user: UserForInsert): Promise<void>
    listRole(): Promise<Role[]>
    /**
     * @implements 实现必须要回写参数的 id
     */
    addRole(role: RoleForInsert): Promise<void>
    listPerm(): Promise<Perm[]>
    /**
     * @implements 实现必须要回写参数的 id
     */
    addPerm(perm: PermForInsert): Promise<void>
    /**
     * 设置用户与角色的关系
     * @param userId 
     * @param roleId 
     */
    setUserRole(userId: User['id'], roleId: Role['id']): Promise<void>
}

let _db: PermDb
export function setPermDb(db: PermDb) {
    _db = db
}

//#region 纯用户相关
export async function listUser() {
    return _db.listUser()
}

/**
 * 添加用户
 * @param user 注：传入的密码是明文，执行后变密文。并会赋予 salt 字段值。若插入成功，则会回写 id（由 {@link PermDb.addUser} 实现 ）。
 */
export async function addUser(user: UserForInsert) {
    const salt = await generateSalt()
    const encodePassword = await hashPassword(user.password, salt)
    user.salt = salt
    user.password = encodePassword
    // TODO: 事务处理
    _db.addUser(user)
    // 同时创建相关的角色，进行绑定
    const role = {
        id: undefined as number | undefined,
        name: `user-${user.account}-${user.name}`, // TODO: 不会重复的方式，例如后缀时间戳
        description: user.description
    }
    _db.addRole(role)
    _db.setUserRole(user.id!, role.id!)
}

export async function getUserByAccount(userAccount: User['account']) {
    return _db.getUserByAccount(userAccount)
}

/**
 * 根据 id 获取 user
 * @param userId 
 * @returns 获取不到返回 undefined
 */
export async function getUserById(userId: User['id']) {
    return _db.getUserById(userId)
}

/**
 * 获取用户信息，方便给前端展示，不包含密码和盐。
 * @param userId 
 * @returns 获取不到返回 undefined
 */
export async function getUserByIdForFrontend(userId: User['id']) {
    const user = await getUserById(userId)
    if (!user) {
        return user
    }
    const { password, salt, ...result } = user
    return result
}

/**
 * 校验用户密码
 * @param userToken 注：传入的密码是明文
 * @returns 是否校验通过
 * @deprecated 使用 {@link verifyPassword | verifyPassword()} 代替
 */
export async function verifyUserPassword(userToken: UserForLogin): Promise<boolean> {
    const user = await getUserByAccount(userToken.account)
    if (!user) {
        return false
    }
    const encodePassword = await hashPassword(userToken.password, user.salt)
    return encodePassword === user.password
}
//#endregion

//#region 纯角色相关
export async function listRole() {
    return _db.listRole()
}

export async function addRole(role: RoleForInsert) {
    return _db.addRole(role)
}
//#endregion

//#region 纯权限相关
export async function listPerm() {
    return _db.listPerm()
}

export async function addPerm(perm: PermForInsert) {
    return _db.addPerm(perm)
}

//#endregion


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

