import IsDownload from "../../packages/feature/isDownload"

describe('IsDownload', () => {
  let isDownload
  beforeEach(() => {
    isDownload = new IsDownload()
  })
  it('has name', () => {
    expect(isDownload.name).toBe('isDownload')
  })
  it('has beforeRequest', () => {
    expect(typeof isDownload.beforeRequest === 'function').toBe(true)
  })
  it('call beforeRequest', () => {
    //TODO
  })
})