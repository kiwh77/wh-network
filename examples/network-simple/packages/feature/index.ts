import useToken from './useToken'
import isArrayBody from './isArrayBody'
import isDownload from './isDownload'
import isUpload from './isUpload'

export default [
  new useToken(),
  new isArrayBody(),
  new isDownload(),
  new isUpload()
]
