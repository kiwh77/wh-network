import { RequestManager } from "../../packages"
import UseToken from "../../packages/feature/useToken"

describe('UseToken', () => {
  let useToken
  let rm
  const token = 'TOKEN'
  beforeEach(() => {
    useToken = new UseToken()
    rm = new RequestManager()
    rm.useStore({
      token
    })
  })
  it('has name', () => {
    expect(useToken.name).toBe('useToken')
  })
  it('has beforeRequest', () => {
    expect(typeof useToken.beforeRequest).toBe('function')
  })
  it('call beforeRequest', () => {
    const res = useToken.beforeRequest(rm, null, {})
    expect(res.config.headers.Authorization).toBe(token)
  })
})