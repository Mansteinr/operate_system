

// getters支是一个包装器 并不会改变state中的数据
// 按日期分析
export const lightSignInCustomerList = state => [...[], ...state.lightSignInCustomerList]
// 获取app信息
export const lightSignInAppInfoList = state =>{
  console.log(state.lightSignInAppInfoList, '90909009')
  return  [...[], ...state.lightSignInAppInfoList] 
}