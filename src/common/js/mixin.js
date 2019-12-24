import { $http } from './ajax'
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
      })
    }
  }
}
export const services = { // 接口类型
  data () {
    return {
      services: []
    }
  },
  mounted () {
    this.getAllServices()
  },
  methods: {
    getAllServices () {
      $http(this.API.upApi.services, {}).then((res) => {
        this.services = []
        this.services = res.resData
        if (this.selectedService) {
          this.selectedService = this.services[0]
        }
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
        this.changeSupInfo(this.querySupInfoList[0])
      })
    },
    changeSupInfo (option) {
      this.querySupService({supId: option.supId})
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
        this.changeSupService(this.querySupServiceList[0])
      })
    },
    changeSupService (options) {
      this.queryPipe({supServiceId: options.supServiceId})
    }
  }
}
export const queryPipe = {
   // 通道名称
  data () {
    return {
      queryPipeList: []
    }
  },
  methods: {
    queryPipe (option) {
      $http(this.API.supplierApi.queryPipeList, option).then((res) => {
        this.queryPipeList = []
        this.queryPipeList = res.resData.simplePipeInfos
      })
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

export const wechatCustomerInfo = { // 微信公众号客户信息
  data () {
    return {
      loginNameOrigin: [],
      loginName: []
    }
  },
  mounted () {
    this.customerInfo()
  },
  methods: {
    customerInfo (options ={
      authCode: '',
      customerId: ''
    }) {
      $http(this.API.wechatAPI.customerInfo, options).then((res) => {
        this.loginNameOrigin = []
        this.loginNameOrigin = res.resData
        this.loginName = this.loginNameOrigin
      })
    }
  }
}

export const serviceInfoQuery = { // 微信公众号服务信息
  data () {
    return {
      loginNameOrigin: [],
      loginName: []
    }
  },
  mounted () {
    this.serviceInfoQuery()
  },
  methods: {
    serviceInfoQuery (options ={
      serviceId: ''
    }) {
      $http(this.API.wechatAPI.serviceInfoQuery, options).then((res) => {
        this.loginNameOrigin = []
        this.loginNameOrigin = res.resData
        this.loginName = this.loginNameOrigin
      })
    }
  }
}