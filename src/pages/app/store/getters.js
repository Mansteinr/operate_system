

// getters支是一个包装器 并不会改变state中的数据
// 按日期分析
export const lightSignInCustomerList = state => [...[], ...state.lightSignInCustomerList]
// 按客户分析
export const UsageByCustomerList = state => [...[], ...state.UsageByCustomerList] 