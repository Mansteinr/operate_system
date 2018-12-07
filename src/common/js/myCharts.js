import echarts from 'echarts'

let color = ['rgba(44,181,171, 1)', 'rgba(44,181,171,.3)', 'rgba(145,191,93,1)', 'rgba(145,191,93, .3)', 'rgba(248,168,159,1)', 'rgba(248,168,159,.3)',
  'rgba(138, 43, 226, 1)', 'rgba(220, 20, 60, 1)', 'rgba(0, 0, 139, 1)', 'rgba(255,140,0,1)', 'rgba(121,85,72,1)', 'rgba(124,252,0,1)',
  'rgba(0,0,128,1)', 'rgba(158,158,158,1)', 'rgba(172,89,163,1)', 'rgba(53,231,255,1)', 'rgba(16,16,16,1)', 'rgba(52,135,158,1)']
export function setLineData (title, xAxisData, series) {
  var legendData = []
  let seriesOpt = []
  var arrLength = series.length > 21 ? 20 : series.length
  for (var i = 0; i < arrLength; i++) {
    legendData.push(series[i].name)
    seriesOpt.push({
      "name": series[i].name,
      type: 'line',
      smooth: true, //是否平滑曲线显示
      lineStyle: { //线条样式 
        normal: {
          width: 1,
          color: color[i * 2]
        }
      },
      areaStyle: { //区域填充样式
        normal: {
          //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
          color: color[i * 2 + 1]
        }
      },
      itemStyle: { //折现拐点标志的样式
        normal: {
          color: color[i * 2]
        }
      },
      "data": series[i].data
    })
  }
  var option = {
    title: {
      text: title,
      left: '1%',
      top: '-1%',
      textStyle: {
        fontSize: 16,
        fontWeight: "normal",
        fontFamily: "微软雅黑",
        color: "#36383c"
      }
    },
    tooltip: {
      bordeRadius: 4,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.2)',
      backgroundColor: 'rgba(255,255,255,0.9)',
      padding: 0,
      formatter: function (params) {
        var paramsName = ''
        params.forEach(function (v) {
          if (v.name) {
            paramsName = v.name;
          }
        })
        let color = "#757b90";
        var a = "<div style='background-color:" + color + ";padding: 5px 10px;border:0;marging-top:1px;text-align:center;color:white;font-size: 14px;'>" + paramsName + "</div>";
        a += "<div style='padding:5px;color:#36383c;font-size:14px;'>";
        params.forEach(function (v) {
          a += "<span style='margin-right:5px;display: inline-block;display: inline-block; height:8px;width: 8px;border: 2px solid " + v.color + ";border-radius: 50%;'/></span>" + v.seriesName + "  :  " + (v.value || '--') + "<br>";
        })
        a += "</div>";
        return a;
      },
      trigger: 'axis',
      textStyle: {
        fontSize: 15,
        color: "#fff"
      },
      axisPointer: {
        lineStyle: {
          color: '#00c1de'
        }
      }
    },
    legend: {
      orient: 'horizontal',
      bottom: 70,
      left: "4%",
      itemGap: 20,
      data: legendData,
      textStyle: {
        color: '#6f7479',
        fontSize: 12
      }
    },
    grid: {
      show: true,
      left: "8%",
      top: 34,
      right: "3%",
      x2: 50,
      borderWidth: 0,
    },
    toolbox: {
      show: true,
      feature: {
        mark: {
          show: true
        },
        dataView: {
          show: false,
          readOnly: false
        },
        magicType: {
          show: true,
          type: ['line', 'bar']
        },
        saveAsImage: {
          show: true
        },
        restore: {
          show: true
        }
      }
    },
    calculable: true,
    xAxis: [{
      type: 'category',
      boundaryGap: false,
      data: xAxisData,
      axisLine: { //坐标轴轴线相关设置。就是数学上的x轴
        show: true,
        lineStyle: {
          color: '#00c1de',
          width: 2
        },
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        align: "right",
        textStyle: {
          color: '#6f7479',
        },
      },
    }],
    yAxis: [{
      type: 'value',
      splitLine: {
        show: true,
        lineStyle: {
          color: '#ececec'
        }
      },
      axisLine: { //坐标轴轴线相关设置。就是数学上的y轴
        show: false,
        lineStyle: {
          color: 'rgba(170,172,178,0.53)'
        },
      },
      axisLabel: {
        textStyle: {
          color: '#6f7479'
        },
      }
    }],
    series: seriesOpt
  }
  if (xAxisData.length > 20) {
    var dataZoom = []
    dataZoom.push({
      "show": true,
      "height": 30,
      "bottom": 30,
      "start": 95,
      "end": 100,
      handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
      handleSize: '110%',
      handleStyle: {
        color: "#d3dee5",
      },
      textStyle: {
        color: "#6f7479"
      },
      borderColor: "#90979c"
    }, {
        type: 'inside',
        realtime: true,
        start: 20,
        end: 80
      })
    option.dataZoom = dataZoom
    option.grid.bottom = 120 + Math.ceil(legendData.length / 8) * 20
    option.legend.bottom = 70

  } else {
    option.grid.bottom = 70
    option.legend.bottom = 5
  }
  return option
}

export function setOtherLineData (xAxisData, series) {
  var legendData = [];
  var arrLength = series.length > 21 ? 20 : series.length;
  for (var i = 0; i < arrLength; i++) {
    legendData.push(series[i].name)
  }
  var option = {
    tooltip: {
      bordeRadius: 4,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.2)',
      backgroundColor: 'rgba(255,255,255,0.9)',
      padding: 0,
      formatter: function (params) {
        var paramsName = ''
        params.forEach(function (v) {
          if (v.name) {
            paramsName = v.name;
          }
        })
        let color = "#757b90";
        var a = "<div style='background-color:" + color + ";padding: 5px 10px;border:0;marging-top:1px;text-align:center;color:white;font-size: 14px;'>" + paramsName + "</div>";
        a += "<div style='padding:5px;color:#36383c;font-size:14px;'>";
        params.forEach(function (v) {
          a += "<span style='margin-right:5px;display: inline-block;display: inline-block; height:8px;width: 8px;border: 2px solid " + v.color + ";border-radius: 50%;'/></span>" + v.seriesName + "  :  " + (v.value || '--') + "<br>";
        })
        a += "</div>";
        return a;
      },
      trigger: 'axis',
      textStyle: {
        fontSize: 15,
        color: "#fff"
      },
      axisPointer: {
        lineStyle: {
          color: '#00c1de'
        }
      }
    },
    legend: {
      orient: 'horizontal',
      bottom: 70,
      left: "4%",
      itemGap: 20,
      data: legendData,
      textStyle: {
        color: '#6f7479',
        fontSize: 12
      }
    },
    grid: {
      show: true,
      left: "5%",
      top: 34,
      right: "5%",
      x2: 50,
      borderWidth: 0,
    },
    toolbox: {
      show: true,
      left: 'center',
      feature: {
        mark: {
          show: true
        },
        dataView: {
          show: false,
          readOnly: false
        },
        magicType: {
          show: true,
          type: ['line', 'bar']
        },
        saveAsImage: {
          show: true
        },
        restore: {
          show: true
        }
      }
    },
    calculable: true,
    xAxis: [{
      type: 'category',
      boundaryGap: false,
      data: xAxisData,
      axisLine: { //坐标轴轴线相关设置。就是数学上的x轴
        show: true,
        lineStyle: {
          color: '#00c1de',
          width: 2
        },
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        align: "right",
        textStyle: {
          color: '#6f7479',
        },
      },
    }],
    yAxis: [{
      name: '实时响应分析(ms)',
      type: 'value',
      splitLine: {
        show: true,
        lineStyle: {
          color: '#ececec'
        }
      },
      axisLine: { //坐标轴轴线相关设置。就是数学上的y轴
        show: false,
        lineStyle: {
          color: 'rgba(170,172,178,0.53)'
        },
      },
      axisLabel: {
        textStyle: {
          color: '#6f7479'
        },
      }
    }, {
      name: '实时调用量(条)',
      type: 'value',
      splitLine: {
        show: true,
        lineStyle: {
          color: '#ececec'
        }
      },
      axisLine: { //坐标轴轴线相关设置。就是数学上的y轴
        show: false,
        lineStyle: {
          color: 'rgba(170,172,178,0.53)'
        },
      },
      axisLabel: {
        textStyle: {
          color: '#6f7479'
        },
      }
    }],
    series: series
  }
  if (xAxisData.length > 20) {
    var dataZoom = [];
    dataZoom.push({
      "show": true,
      "height": 30,
      "bottom": 30,
      "start": 95,
      "end": 100,
      handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
      handleSize: '110%',
      handleStyle: {
        color: "#d3dee5",
      },
      textStyle: {
        color: "#6f7479"
      },
      borderColor: "#90979c"
    }, {
        type: 'inside',
        realtime: true,
        start: 20,
        end: 80
      });
    option.dataZoom = dataZoom;
    option.grid.bottom = 120 + Math.ceil(legendData.length / 8) * 20;
  } else {
    option.grid.bottom = 120;
  }
  return option
}

export function renderChart (container, option) {
  var myChart = echarts.init(container)
  myChart.clear()
  myChart.setOption(option);
  return myChart
}