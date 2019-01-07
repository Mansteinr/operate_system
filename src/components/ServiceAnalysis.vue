<template>
  <div class="template-wrapper">
    <div class="card-wrapper">
      <div class="card-title">
        查询条件
      </div>
      <div class="card-container">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="服务名称：">
            <el-select v-model.trim="serviceName"
              filterable
              placeholder="请选择">
              <el-option
                v-for="item in serviceArr"
                :key="item.serviceName"
                :label="item.serviceNameZh"
                :value="item.serviceName">
                <span style="float: left">{{ item.serviceNameZh }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="card-query">
            <el-button type="primary" @click="onSubmit" round>查询</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="card-wrapper card-content">
      <div class="card-title">
        查询结果
      </div>
      <div class="card-container">
        <div :class="flag ?'':'no-charts'" ref="charts" style="height:400px;"></div>
      </div>
    </div>
  </div>
</template>

<script>
import {$http} from '../common/js/ajax'
import moment from 'moment'
import { setOtherLineData } from '../common/js/myCharts'
import echarts from 'echarts'
export default {
  data () {
    return {
      formInline: {
        serviceNames: []
      },
      serviceName: '',
      serviceArr: [],
      customerArr: [],
      flag: false,
      minutesArr: [],
      timeId: null,
      m: 0
    }
  },
  methods: {
    services () {
      let url = '/operation/down/queryServices'
      $http(url, {}, 'get').then((res) => {
        this.serviceArr = res.resData
        if (this.serviceArr && this.serviceArr.length) {
          this.serviceName = this.serviceArr[0].serviceName
        }
      })
    },
    getCoustomer (value) {
      let loginNames = []
      if (value === 'IDNameCheck') {
        loginNames = ["taimiaoxinxi", "yunchen", "beidou", "yunfeng", "beikejinkong", "qinzhishuma", "test", "58jinrong01", "weiyankeji", "ruisai", "jiean", "chuanglan", "yijifu", "suyouda", "songshunxinxi", "lianjinsuo", "ruanyinantong", "duanhuanhuan", "VULOG", "qianbaohaoche", "xinqiang", "xinzuhui", "jiayinzhengxin", "tianqiguofu", "qian", "youzu", "shiyukeji", "hongyuan", "milianyunchuang", "ningmi", "yundaikeji", "zijin", "zhongjinhang", "shengjinnong", "haoxin", "choushane", "kafeijinrong", "panwan", "tianchuang1", "renrun", "tanzhishuju", "xinqiandai", "jinlianhuitong", "aibaojiazheng", "xianfengzhifu", "gotoway", "shujubao", "guangfubao", "Simon0328", "hongxin", "baiqishi", "chedun0820", "xiaoxin", "yishou", "zhonghang", "shoukuliandiao", "yucunkeji", "changjiezhifu", "shengdatest", "yuqiang", "yishouyin", "tongcheng", "beitaijinfu", "meituan", "fenmi", "test0826", "lianghaodai", "xiangyunteng", "yimei", "guoxinyouyi", "zhenge", "tongzheng", "tielong", "testSimon1", "wangtouwang", "dajiaying", "xiaoshidai", "shandianhebao", "lingxianjinrong", "weisudai", "jihuojie", "renrenhunlian", "qianbao", "ronghui", "quanmuxing", "testHuafu", "nuoya", "huixiangtiancheng", "xinhuashuju", "tiantianouya", "zishuipan", "lingjiang", "qiyidai", "youli2", "yincai", "test_alarm", "runhengfeng", "zhongsheng", "zhoushouyes", "xinyada", "zhaoweibin", "jiangxin", "shualiankeji", "shengdunkeji", "bjdingxiang", "tianying", "xiaodouding", "wangzhejinka", "shangbang", "huixiang", "xinjiyuan", "91zhengxin", "shuzun", "mobaikeji", "jixin", "chuanhuazhifu", "yibaba", "huafuxinxi", "testMoney", "zewei", "koudai", "wanggang", "puhuishuju", "momo", "shengfutong", "changan", "fenglihe", "nuozhengtong", "baishiyi", "wolaidai", "yilianyinhang", "bingjian", "yilian", "yishangdai", "zhironghui", "dianchou2", "hongshu", "jiupai", "testjd", "鱼耀金融", "jinyuntong", "zhongchengxin01", "kunying", "shunjingfa", "xianjinzhuanche", "zupukeji", "zhoubingyang", "bangfubao", "rongdou0913", "chengduzhidao", "pengju", "ruirongtianxia", "wolongdashuju", "tuniu", "moxieshuju", "quanbeikeji", "zhigu", "jingzhenshidai", "dingxiang2018", "jiazhengzhijia", "youli1", "qianlong", "yiwangxi", "baite", "yicheng", "yamu", "kaijie", "haier", "tongzhanggui", "handi", "test2", "jingjing", "youxin", "juheshuju0208", "shimingbao", "xinglv", "chengxin", "taida", "yixun2016", "jiuyuan", "qianbaojinfu", "zhongyanyitong", "kangruide", "chuanhuahuiyuan", "tuling", "daoshengkeji", "suanhua", "beifu", "junxin", "hefeiyuying", "limu", "hengaikeji", "touna", "chuangming", "tongfudun", "jiajiacaifu", "zhangpeiyus", "zhonghaiwai", "taishancaichan", "jinxunhechuang", "jinyungtong", "tianyi3", "wangrunjinfu", "hujinshidai2018", "jizhi", "yinshengzhifu", "qianyi", "jiayoutong", "cjtest", "bianlidai", "maidanxia", "zhangcunbao", "bangfutong", "shanxica", "shujing", "yinhuotong", "zhonghuizhifu", "anrongzhengxin", "haitun", "huoke", "qianbaowangjin1111", "jienuo", "anhe", "zhongxinlihe", "yige", "fuqing", "qianchen", "duomi", "xiaodai", "quancun", "wenhai", "weipintest", "weichengzx", "JSguangdian", "dongxiao", "dongfangmingzhu", "58jinrong", "shujubao01", "wuxingkonggu", "aixixinxi", "shandiandai", "dianshen", "shanglong", "anbao", "milidai", "hangzhouhedun", "xinhua", "tianxingshuke", "fuafuxinxi", "xsProduction", "sixixinxi", "zunxin", "liantongzhineng", "moxiekeji", "tongjidaxue", "zhongqing", "chuangshihuaxin", "hemaxinxi", "huadaoshuju", "tiantianlicai", "xiaoerduo", "yiliankeji", "hanxin", "fnc", "wanjiajinrong", "daxin", "deke", "youbei", "shenzhourong2", "FESCO", "dianjin", "zhuyinsuo", "legua", "dexinpuhui", "duanweizhis", "geile", "jiujinsuo", "xiangyue", "xinyanzhengxin2", "weishidun", "guazi", "kuaifutong", "dingfengjinrong", "member", "shumaikeji", "qianbaobaoli", "shouqian", "shulian", "yifeng", "zhongyuanjinrong", "chaocai", "shoushan", "xinlang", "hefeizishang", "huoshuju", "xindaxin", "lianshengxinding", "yuhaihengtong", "shenmajinrong", "test_MM", "heyunchou", "nanjingkuaige2", "songshujinrong", "testOnline", "hepu", "shuqu", "banjinwang", "shunfengjinrong", "shenghuoke", "zhuyingbaobao", "changxin", "zhonglianshangwu", "chengxiaofei", "yuanqidan", "youshukeji", "shengda", "zhongjin", "yingdong", "zhongyuanjinrong2", "xiaoshi", "qianbaowangjin", "shangtong", "fenjinshe", "qianyankeji", "huiyuekeji", "songhongkeji", "xianzaizhifu", "ruanzhi", "huangfeng", "zhongli", "renhezhong2", "zhongankeji", "zhongyou", "kubao", "fuyu", "zhaocai", "yichenkeji", "zhongshenzichan", "zhongrongjin", "fujinsuo", "huifu", "bajieqianbao", "nanlang", "youyu", "jiaozhen", "shuyunpuhui", "wukongzuche", "taiyuan", "yinchu", "kbcs", "shulixinxi", "qiuce", "longze", "youmeng0423", "suanli", "bailianyouli", "huazhong", "wenzhouliquan", "lianshengxd", "gxtest", "yunyihutong", "fanchi", "youdun", "shenzhouweizhi", "xiandaiwuliu", "gegejia", "linggao", "yunyexinxi", "daolonghuaer", "lvxun", "guojiawuliu", "yongyizhifu", "sanbao", "zhangshang", "huadaozhengxin", "chengweixin", "yunmi", "dichang", "hujinshidai", "xiaocong", "huabojinfu", "huixiangtiancheng2", "samoye", "wanghuijinrong", "qichen", "dianchou", "ningmeng", "yicheng02", "ximan", "puhui", "fengfuzhifu", "xinlianzhengxin", "chengshu", "hedaokeji", "riskCtrl", "xinmeida", "xiaoxin2", "jingdongyun", "bairongjinfu", "ping", "qianhui", "chuyunkeji", "tianyi", "sanjiangshujin", "huangweiyiAuth", "dingyi", "jindanlicai", "aiqi", "zengxintong", "banma", "xiaodai1111"]
      } else if (value === 'IdNamePhotoCheck') {
        loginNames = ["songshunxinxi", "shiyukeji", "feizhu", "renrun", "jinlianhuitong", "gotoway", "doufu", "yucunkeji", "changjiezhifu", "alading", "guoxin", "guoxinyouyi", "hzkj2018", "guli", "shandikeji", "xinyada", "shengdunkeji", "jixin", "nuozhengtong", "yilian", "jiupai", "chengduzhidao", "pengyuan", "moxieshuju", "hengxintong", "kangruide", "tuopurenli", "tongfudun", "yiqian", "jixiang", "weipintest", "tianxingshuke", "jixiang2018", "sixixinxi", "qianlaiwang", "hangzhouzhuokai", "shumaikeji", "huoshuju", "testOnline", "zhonglianshangwu", "qianyankeji", "huiyuekeji", "songhongkeji", "ruanzhi", "huifu", "youmeng0423", "chengweixin", "chengshu", "xinmeida", "huangweiyiAuth", "dingyi", "aiqi", "zengxintong"]
      } else {
        loginNames = ["hanxin", "testOnline", "huangweiyiAuth"]
      }
      return loginNames
    },
    realTime () {
      // let startTime = + new Date() - 1 * 24 * 3600 * 1000
      let startTime = + new Date('2018-11-20 17:25:36') - 1 * 24 * 3600 * 1000
      let arr = []
      for (let i = 0; i <= 1440; i++) {
        arr.push(moment(startTime + (i * 60 * 1000)).format('YYYYMMDDHHmm'))
      }
      this.minutesArr = arr
      let url = '/qualityanalyze/customer/realTime'
      this.formInline.date = moment(+new Date()).format('YYYY-MM-DD HH:mm:ss')
      this.formInline.loginNames = this.getCoustomer(this.serviceName)
      this.formInline.serviceNames.push(this.serviceName)
      $http(url, this.formInline).then((res) => {
        var myChart = echarts.init(this.$refs.charts)
        myChart.clear()
        let dataArr = Object.keys(res.resData.avgCallTime) /* 因为返回是个对象 所以提取对象的key并组成一个数组 这是平均相应时长*/
        if (dataArr && dataArr.length > 0) {
          this.flag = true
          let data = res.resData.avgCallTime
          let dataCall = res.resData.callNum
          let dataNeed = res.resData.needChargeCallNum
          let xFiled = [] /* x轴数据 */
          let yFiled = [] /* y平均响应时间y轴数据 */
          let yCallFiled = [] /* 平均调用量y轴数据 */
          let yNeedFiled = [] /* 平均调用量y轴数据 */
          let handleObj = {}
          this.minutesArr.forEach(v => {
            if (data[v]) { /* 检测某个点是否存在 则不动 反之 补一个空  这样写的好处 就是不会改变时间点的顺序 */
              handleObj[v] = data[v]
            } else {
              handleObj[v] = ''
            }
          })
          for (let k in handleObj) {
            xFiled.push(this.substrTime(k)) /* x轴 */
            yFiled.push(handleObj[k]) /* y轴 */
            if (dataCall[k]) {
              yCallFiled.push(dataCall[k])
            } else {
              yCallFiled.push('')
            }
            if (dataNeed[k]) {
              yNeedFiled.push(dataNeed[k])
            } else {
              yNeedFiled.push('')
            }
          }
          let lineData = [{
            "name": "实时响应分析（ms）",
            type: 'line',
            smooth: true, //是否平滑曲线显示
            lineStyle: { //线条样式 
              normal: {
                width: 1,
                color: 'rgba(44,181,171, 1)'
              }
            },
            areaStyle: { //区域填充样式
              normal: {
                //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                color: 'rgba(44,181,171, 0.3)'
              }
            },
            itemStyle: { //折现拐点标志的样式
              normal: {
                color: 'rgba(44,181,171, 1)'
              }
            },
            "data": yFiled
          }, {
            "name": "实时调用量（条）",
            type: 'line',
            yAxisIndex: 1,
            smooth: true, //是否平滑曲线显示
            lineStyle: { //线条样式 
              normal: {
                width: 1,
                color: 'rgb(248,168,159)'
              }
            },
            areaStyle: { //区域填充样式
              normal: {
                //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                color: 'rgb(248,168,159,.3)'
              }
            },
            itemStyle: { //折现拐点标志的样式
              normal: {
                color: 'rgb(248,168,159)'
              }
            },
            "data": yCallFiled
          }, {
            "name": "实时计费调用量（条）",
            type: 'line',
            yAxisIndex: 1,
            smooth: true, //是否平滑曲线显示
            lineStyle: { //线条样式 
              normal: {
                width: 1,
                color: 'rgba(145,191,93,1)'
              }
            },
            areaStyle: { //区域填充样式
              normal: {
                //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                color: 'rgba(145,191,93,.3)'
              }
            },
            itemStyle: { //折现拐点标志的样式
              normal: {
                color: 'rgba(145,191,93,1)'
              }
            },
            "data": yNeedFiled
          }]
          myChart.setOption(setOtherLineData(xFiled, lineData))
          window.onresize = function () {
            myChart.resize()
          }
        } else {
          this.flag = false
        }
      })
    },
    onSubmit () {
      this.playerInterVal()
    },
    substrTime (params) {
      return params.substr(params.length - 4).substr(0, 2) + ':' + params.substr(params.length - 4).substr(2, 4)
    },
    setIntervalFun () {
      if (this.timeId) {
        clearInterval(this.timeId); /* 每次调用定时器 先清除定时器 */
      }
      this.realTime() /* 第一次调用 */
      this.timeId = setInterval(this.playerInterVal, 1000 * 60);
    },
    playerInterVal () {
      this.m++
      if (this.m > 20) { /* 执行20次以后清除定时器 */
        this.m = 0
        this.setIntervalFun() /* 重启定时器 */
      } else {
        this.realTime()
      }
    }
  },
  mounted () {
    this.services()
  }
}
</script>