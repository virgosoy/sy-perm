
import type { Perm, Role, User } from '../models/models'
import * as db from '../services/perm-db'

export function listUser() {
    return db.listUser()
}

export function listRole() {
    return db.listRole()
}

export function listPerm() {
    return db.listPerm()
}

export function listPermKeyByUserId(userId: User['id']) {
    return // TODO:
}

export function hasPermKeyByUserId(userId: User['id'], permKey: Perm['key']) {
    return // TODO:
}

export function listPermKeyByRoleId(roleId: Role['id']) {
    return // TODO:
}

export function listRoleIdByPermKey(permKey: Perm['key']) {
    return // TODO:
}

export function listUserIdByPermKey(permKey: Perm['key']) {
    return // TODO:
}

export function getRoleWithAncestors(roleId: Role['id']) {
    // TODO:
}

export function getRoleWithDescendants(roleId: Role['id']) {
    return // TODO:
}

export function roleTree() {
    // TODO: 
    return []
}

export function addUser(user: User) {
    return // TODO:
}

export function addRole(role: Role) {
    return // TODO:
}

export function addPerm(perm: Perm) {
    return // TODO:
}

/**
 * 重设连接关联关系，等同于移除全部关系后设置，角色与其父角色
 */
export function setRoleExtendsRelation(roleId: Role['id'], parentIds: Role['id'][]) {
    // TODO:
}

/**
 * 新增连接关联关系，角色与其父角色。不会移除原有的关系。
 */
export function addRoleExtendsRelation(roleId: Role['id'], parentIds: Role['id'][]) {
    // TODO:
}

/**
 * 移除连接关联关系，角色与其父角色
 */
export function removeRoleExtendsRelation(roleId: Role['id'], parentIds: Role['id'][]) {
    // TODO:
}

