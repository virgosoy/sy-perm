
/** 基础表 */
export interface User {
    id: number
    account: string
    name: string
    password: string
    disable: boolean
    description: string
}

interface UserWithRoleId extends User {
    /** 
     * 每个用户都是一个特殊的角色 User ? - 1 Role 
     * 可以看成用户是角色的子类，一创建时就有对应的角色，以方便在进行角色配置时也可以看到用户。
     */
    roleId: number
}
interface UserWithRole extends User {
    role: Role
}

/** 基础表 */
export interface Role {
    id: number
    name: string
    description: string
}

interface RoleWithUserId extends Role {
    userId: number
}
interface RoleWithUser extends Role {
    user: User
}

/** 关系表 */
interface RoleExtend {
    parentsId: number
    childrenId: number
}

interface RoleWithparentIds extends Role {
    parentIds: number[]
}
interface RoleWithParents extends Role {
    parents: Role[]
}
interface RoleWithchildIds extends Role {
    childIds: number[]
}
interface RoleWithChildren extends Role {
    children: Role[]
}
interface RoleWithParentsAndchildIds extends Role {
    parentIds: number[]
    childIds: number[]
}
interface RoleWithParentsAndChildren extends Role {
    parents: Role[]
    children: Role[]
}


/** 基础表 */
export interface Perm {
    id: number
    key: string
    name: string
    description: string
}

interface PermWithOwnRoleIds extends Perm {
    roles: {
        roleId: number
        remove: boolean
    }[]
}
interface PermWithOwnRoles extends Perm {
    roles: {
        role: Role
        remove: boolean
    }[]
}


/** 关系表 Role * - * Perm */
interface RolePerm {
    roleId: number
    permId: number
    remove: boolean
}

interface RoleWithOwnPermIds extends Perm {
    perms: {
        permId: number
        remove: boolean
    }[]
}
interface RoleWithOwnPerms extends Perm {
    perms: {
        perm: Perm
        remove: boolean
    }[]
}

interface RoleWithFinalPermIds extends Role {
    permIds: number[]
}

interface RoleWithFinalPerms extends Role {
    perms: Perm[]
}

interface PermWithFinalRoleIds extends Perm {
    roleIds: number[]
}
interface PermWithFinalRoles extends Perm {
    roles: Role[]
}

