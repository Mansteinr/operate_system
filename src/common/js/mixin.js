import $http from './ajax'
import pinyin from 'js-pinyin'
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
// table相关方法
export const tableMixin = {
  data () {
    return {
      currentPage: 1,
      pageSize: 10,
      tatalPage: 0,
      tableData: [],
      search: ''
    }
  },
  methods: {
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        // column.property 为自己定义的 data为table中的数据
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
          sums[index]
        } else {
          sums[index] = ''
        }
      })
      sums.forEach((v, k) => {
        if (Number(v)) {
          sums[k] = Math.round(v * 100) / 100
        }
      })
      return sums
    },
    handleSizeChange (val) {
      if (val) {
        this.pageSize = val
      } else {
        this.pageSize = this.tableData.length
      }
    },
    filterTable (data) {
      return !this.search || data.dayTime.toLowerCase().includes(this.search.toLowerCase()) || (data.usedCount + '').toLowerCase().includes(this.search.toLowerCase()) || (data.downChargedCount + '').toLowerCase().includes(this.search.toLowerCase()) || (data.downCost + '').toLowerCase().includes(this.search.toLowerCase())
    },
    handleCurrentChange (val) {
      this.currentPage = val
    },
    changePage (value) {
      this[value.split('-')[0]] = value.split('-')[1] / 1
    }
  },
  computed: {
    tableDataComputed () {
      if (this.tableData && this.tableData.length) {
        let start = this.pageSize * (this.currentPage - 1)
        let end = Math.min(this.pageSize * (this.currentPage), this.tableData.length)
        return this.tableData.slice(start, end)
      } else {
        return []
      }
    }
  }
}
// 时间快捷键
export const hotKeyTime = {
  data () {
    return {
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
        this.loginName = this.loginNameOrigin
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
