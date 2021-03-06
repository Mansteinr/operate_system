

// getters支是一个包装器 并不会改变state中的数据
// 余额快照
export const balanceSnapshotList = state => state.balanceSnapshotList
// 充值记录
export const chargeLogList = state => state.chargeLogList
// 供应商
export const supplierCompanysList = state => state.supplierCompanysList
// 供应商分析
export const dayCompanyList = state => state.dayCompanyList
// 供应商分析
export const serviceCompanyList = state => state.serviceCompanyList
// 按客户分析
export const customerChargeInfoList = state => state.customerChargeInfoList

// 服务分析
export const companyList = state => state.companyList
export const customerList = state => state.customerList
// 按日服务分析
export const outServiceChargeInfoByDayList = state => state.outServiceChargeInfoByDayList
// 下游按客户分析
export const allUsageNameSortBydownCostList = state => state.allUsageNameSortBydownCostList
export const allUsageNameSortBydownCostTop10 = state => state.allUsageNameSortBydownCostTop10
export const allUsageNameSortBydownChargedCountList = state => state.allUsageNameSortBydownChargedCountList
export const allUsageNameSortBydownChargedTop10 = state => state.allUsageNameSortBydownChargedTop10

