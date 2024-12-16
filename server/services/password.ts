// TODO: 未来可考虑参考 https://github.com/atinux/nuxt-auth-utils/blob/v0.5.5/src/runtime/server/utils/password.ts

import crypto from 'crypto'

/**
 * 生成盐值
 */
export async function generateSalt() {
  return crypto.randomBytes(16).toString('hex')
}

/**
 * 加密密码
 * @param password 密码明文
 * @param salt 盐值
 * @returns 密码密文
 */
export async function hashPassword(password: string, salt: string) {
  return crypto.createHash('md5').update(password + salt).digest('hex')
}

/**
 * 校验密码
 * @param password 密码明文
 * @param salt 盐值
 * @param hashPassword 密码密文
 */
export async function verifyPassword(password: string, salt: string, hashPassword: string) {
  const encodePassword = crypto.createHash('md5').update(password + salt).digest('hex')
  return encodePassword === hashPassword
}