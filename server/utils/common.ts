
/**
 * 不可能发生的错误，即某些逻辑永远都不可能触发到。可以使用抛出此错误来标识。
 * @author doc-snippet
 * @version 2024-12-11
 */
export class ImpossibleError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ImpossibleError'
  }
}