
import Response from '../../packages/manager/response'

describe('Response', () => {
  it('初始化赋值', () => {
    const res = new Response({
      success: false,
      code: 1000,
      count: 1000,
      data: [1,2,3],
      msg: 'MSG',
      time: 'TIME'
    })
    expect(res.success).toBe(false)
    expect(res.code).toBe(1000)
    expect(res.count).toBe(1000)
    expect(res.data).toHaveLength(3)
    expect(res.msg).toBe('MSG')
    expect(res.time).toBe('TIME')
  })
})