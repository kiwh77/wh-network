import Feature from '../../packages/feature'
import IsArrayBody from '../../packages/feature/isArrayBody'
import IsDownload from '../../packages/feature/isDownload'
import IsUpload from '../../packages/feature/isUpload'
import UseToken from '../../packages/feature/useToken'

describe('Feature', () => {
  it('Feature is Array', () => {
    expect(Feature instanceof Array).toBe(true)
  })
  it('Feature has useToken', () => {
    expect(Feature.some(f => f instanceof UseToken)).toBe(true)
  })
  it('Feature has isArrayBody', () => {
    expect(Feature.some(f => f instanceof IsArrayBody)).toBe(true)
  })
  it('Feature has isDownload', () => {
    expect(Feature.some(f => f instanceof IsDownload)).toBe(true)
  })
  it('Feature has isUpload', () => {
    expect(Feature.some(f => f instanceof IsUpload)).toBe(true)
  })
})