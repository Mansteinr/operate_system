import $http from './ajax'
// 切换table相关方法
export const switchMixin = {
  data () {
    return {
      tabFlag: false,
      tabFlag2: false,
    }
  },
  methods: {
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
        callback(new Error('请选择时间范围'));
      } else {
        callback()
      }
    }
    return {
      rules: {
        time: [{ validator: timeRule, trigger: 'change' },]
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
        this.businessType.unshift({
          typeId: '',
          typeName: '全部'
        })
        this.queryParams.type = this.businessType[0].typeId
      })
    },
    changeType () {
      this.loginName = [{
        customerId: '',
        loginName: '',
        customerName: '全部'
      }]
      if (this.queryParams.type) {
        this.loginNameOrigin.map((v) => {
          if (this.queryParams.type === v.businessId) {
            this.loginName.push(v)
          }
        })
      } else {
        this.loginName = [...[{
          customerId: '',
          loginName: '',
          customerName: '全部'
        }], ...this.loginNameOrigin]
      }
      this.queryParams.loginName = this.loginName[0].loginName
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
        this.loginName = [...[{
          customerId: '',
          loginName: '',
          customerName: '全部'
        }], ...this.loginNameOrigin]
        this.queryParams.loginName = this.loginName[0].loginName
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
        this.services = res.resData
        this.queryParams.serviceName = this.services[0].serviceName
      })
    }
  }
}
export const services = { // 接口类型
  data () {
    return {
      services: [],
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
        this.queryParams.serviceName = this.services[0].serviceName
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

export const toFixed = { // 供应商
  methods: {
    toFixed (val) {
      return Math.round(val * Math.pow(10, val)) / Math.pow(10, val)
    }
  }
}