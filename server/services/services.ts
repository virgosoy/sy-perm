
import type { Perm, Role, User } from '../models/models'



export interface PermDb {
    listUser(): Promise<User[]>
    listRole(): Promise<Role[]>
    listPerm(): Promise<Perm[]>
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

export async function addUser(user: User) {
    return // TODO:
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

