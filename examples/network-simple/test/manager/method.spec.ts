import { Method } from '../../packages'

describe('HTTP Method', () => {
  it('请求方法值', () => {
    expect(Method.GET).toBe('get')
    expect(Method.POST).toBe('post')
    expect(Method.PUT).toBe('put')
    expect(Method.DELETE).toBe('delete')
    expect(Method.PATCH).toBe('patch')
  })
})