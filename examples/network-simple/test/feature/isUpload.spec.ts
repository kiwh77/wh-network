import IsUpload from "../../packages/feature/isUpload"

describe('IsUpload', () => {
  let isUpload
  beforeEach(() => {
    isUpload = new IsUpload()
  })
  it('has name', () => {
    expect(isUpload.name).toBe('isUpload')
  })
  it('has beforeRequest', () => {
    expect(typeof isUpload.beforeRequest === 'function').toBe(true)
  })
  it('call beforeRequest', () => {
    const res = isUpload.beforeRequest(null, null, {})
    const contentType = res.config.headers['Content-Type']
    expect(contentType).toBe('multipart/form-data')
  })
})