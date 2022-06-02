import IsArrayBody from "../../packages/feature/isArrayBody"

describe('IsArrayBody', () => {
  let isArrayBody: IsArrayBody
  beforeAll(() => {
    isArrayBody = new IsArrayBody()
    console.log('🚀 ~ file: isArrayBody.spec.ts ~ line 7 ~ beforeAll ~ isArrayBody', isArrayBody, IsArrayBody)
  })
  afterAll(() => {
    isArrayBody = null
  })

  it('has name', () => {
    expect(isArrayBody.name).toBe('isArrayBody')
  })

  it('has beforeRequest', () => {
    expect(typeof isArrayBody.beforeRequest).toBe('function')
  })
  it('call beforeRequest', () => {
    const res = isArrayBody.beforeRequest(null, null, {
      params: 'ID'
    }, null)
    expect(toString.apply(res.params) === '[object Array]').toBe(true)
    const [id] = res.params
    expect(id).toBe('ID')
  })
})