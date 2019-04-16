import { $http } from './ajax'
let pinyin = require('js-pinyin')
// 切换table相关方法
export const switchMixin = {
  data () {
    return {
      tabFlag: false,
      tabFlag2: false,
    }
  },
  methods: {
    resetTabFlag () {
      this.tabFlag = false
      this.tabFlag2 = false
    },
    switchTab (value) {
      this.tabFlag = value
    },
    switchTab2 (value) {
      this.tabFlag2 = value
    }
  }
}
// 时间快捷键
export const hotKeyTime = {
  data () {
    let timeRule = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择时间范围'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        time: [{ validator: timeRule, trigger: 'change' }]
      },
      pickerOptions2: {
        disabledDate (time) {
          return time.getTime() > Date.now() || time.getTime() < new Date('2018-09-30')
        },
        shortcuts: [{
          text: '最近一周',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '全部',
          onClick (picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - (new Date() - new Date('2017-03-15').getTime()))
            picker.$emit('pick', [start, end]);
          }
        }]
      }
    }
  }
}

export const businessType = { // 行业类型
  data () {
    return {
      businessType: []
    }
  },
  mounted () {
    this.businessTypes()
  },
  methods: {
    businessTypes () {
      $http(this.API.upApi.businessTypes, {}).then((res) => {
        this.businessType = []
        this.businessType = res.resData
      })
    },
    changeType (msg) { // 行业类型切换时 对应的客户名称发生变化 该变化时前端做的 不需要发送请求
      this.loginName = [] // 改变时 首先清空原有的数组 防止重复
      if (msg.typeId) { // 不是全部选项时
        this.loginNameOrigin.map(v => {
          if (msg.typeId === v.businessId) { // 筛选合适的客户名称 并保存
            this.loginName.push(v)
          }
        })
      } else { // 是全部选型时
        this.loginName = [...this.loginNameOrigin] // 全部时重新赋值
      }
    }
  }
}

export const loginName = { // 客户登陆名称
  data () {
    return {
      loginNameOrigin: [],
      loginName: []
    }
  },
  mounted () {
    this.customers()
  },
  methods: {
    customers () {
      $http(this.API.upApi.customers, {}).then((res) => {
        this.loginNameOrigin = []
        this.loginNameOrigin = res.resData
        this.loginName = this.loginNameOrigin
      })
    },
    changeCustomer (v) {
      if (v.customerId) {
        this.getHasService({ customerId: v.customerId })
      } else {
        this.getAllServices()
      }
    },
    getHasService (op) {
      $http(this.API.upApi.hasServices, op).then((res) => {
        this.services = []
        this.services = res.resData
        // if (this.isServiceNames) {
        //   this.queryParams.serviceNames = []
        //   let pushData = this.services.length ? this.services[0].serviceName : null
        //   this.queryParams.serviceNames.push(pushData)
        // } else {
        //   this.queryParams.serviceName = this.services.length ? this.services[0].serviceName : null
        // }
      })
    },
    // filterLoginName (params) {
    //   this.loginName = []
    //   if (params) {
    //     let translateParams = params.toLowerCase()
    //     this.loginNameOrigin.filter(v => {
    //       let testBool = v['loginName'].toLowerCase().indexOf(translateParams) > -1 || v['customerName'].indexOf(translateParams) > -1 || pinyin.getFullChars(v['customerName']).toLowerCase().indexOf(translateParams) > -1 ||  pinyin.getCamelChars(v['customerName']).toLowerCase().indexOf(translateParams) > -1
    //       if (testBool) {
    //         this.loginName.push(v)
    //       }
    //     })
    //   } else {
    //     if(this.noAllLogin) {
    //       this.loginName = this.loginNameOrigin
    //     } else {
    //       this.loginName = [...[{
    //         customerId: '',
    //         loginName: '',
    //         customerName: '全部'
    //       }], ...this.loginNameOrigin]
    //     }
    //   }
    // }
  }
}
export const services = { // 接口类型
  data () {
    return {
      services: [],
      servicesOrigin: []
    }
  },
  mounted () {
    this.getAllServices()
  },
  methods: {
    getAllServices () {
      $http(this.API.upApi.services, {}).then((res) => {
        this.services = [], this.servicesOrigin = res.resData
        this.services = this.servicesOrigin 
      })
    }
  }
}

export const company = { // 供应商
  data () {
    return {
      companys: [],
    }
  },
  mounted () {
    this.getAllCompanys()
  },
  methods: {
    getAllCompanys () {
      $http(this.API.upApi.companys, {}).then((res) => {
        this.companys = []
        this.companys = res.resData
        this.queryParams.companyName = this.companys[0]
      })
    }
  }
}

// boss提供的接口
export const querySupInfo = {
   // 供应商名称
  data () {
    return {
      querySupInfoList: []
    }
  },
  mounted () {
    this.querySupInfo()
  },
  methods: {
    querySupInfo () {
      $http(this.API.supplierApi.querySupInfoList, {}).then((res) => {
        this.querySupInfoList = []
        this.querySupInfoList = res.resData.supInfos
        this.supId = this.querySupInfoList[0].supId
        this.changeSupInfo()
      })
    },
    changeSupInfo () {
      this.querySupService({supId: this.supId})
    }
  }
}
export const querySupService = {
   // 供应商对应服务
  data () {
    return {
      querySupServiceList: []
    }
  },
  methods: {
    querySupService (op) {
      $http(this.API.supplierApi.querySupServiceList, op).then((res) => {
        this.querySupServiceList = []
        this.querySupServiceList = res.resData.supServiceInfos
        this.supServiceId = this.querySupServiceList[0].supServiceId
        this.changeSupService()
      })
    },
    changeSupService () {
      this.queryPipe()
    }
  }
}
export const queryPipe = {
   // 通道名称
  data () {
    return {
      queryPipeList: [],
      queryPipeOriList: []
    }
  },
  methods: {
    queryPipe () {
      $http(this.API.supplierApi.queryPipeList, {supServiceId: this.supServiceId}).then((res) => {
        this.queryPipeList = []
        this.queryPipeOriList = res.resData.simplePipeInfos
        this.queryPipeList = [...[{
          pipeId: '432423',
          pipeName: '全部'
        }], ...res.resData.simplePipeInfos]
        this.queryParams.classNames = []
        this.queryParams.classNames.push(this.queryPipeList[0].pipeName)
        this.selectPipe(this.queryPipeList[0])
      })
    },
    selectPipe (v) {
      if (v.pipeName === '全部') {
        this.queryParams.classNames = []
        this.queryParams.classNames.push('全部')
        this.classNames = []
        this.queryPipeOriList.forEach(v => {
          this.classNames.push(v.pipeName)
        })
      } else {
        let index = this.queryParams.classNames.findIndex(value => {
          return value ==='全部'
        })
        if (index > -1) {
          this.queryParams.classNames.splice(index,1)
        }
        this.classNames = this.queryParams.classNames
      }
    }
  }
}
export const getParam = {
  data () {
    return {
      allParams: []
    }
  },
  mounted () {
    this.getParam()
  },
  methods: {
    getParam () {
      $http(this.API.paramsApi.getParam, {}, 'get').then((res) => {
        this.allParams = res.resData.paramInfos
      })
    }
  }
}


