import RequestManager from '../../packages'
import Vue from 'vue'


describe('RequestManager', () => {
  let rm
  let vue
  beforeEach(() => {
    Vue.use(RequestManager)
    vue = new Vue()
    rm = vue.$http
  })

  afterEach(() => {
    rm = null
    vue = null
  })

  it('初始化', () => {
    expect(rm).not.toBeUndefined()
    expect(rm).not.toBeNull()
  })

  
})