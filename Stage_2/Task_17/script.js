/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/

// 以下两个函数用于随机模拟生成测试数据
function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}

function randomBuildData(seed) {
  var returnData = {};
  var dat = new Date("2016-01-01");
  var datStr = ''
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
};

// 用于渲染图表的数据
var chartData = {};

// 记录当前页面的表单选项
var pageState = {
  nowSelectCity: -1,
  nowGraTime: "day"
}

/**
 * 渲染图表
 */
function renderChart() {
  var aqiChartWrap = document.getElementById("aqi-chart-wrap");
  aqiChartWrap.setAttribute("style", 
              "margin: 20px auto; border: 2px solid #eee; text-align: center;");

  var time = "每日";
  if(pageState.nowGraTime == "week") {
    time = "周平均";
  } else if (pageState.nowGraTime == "month") {
    time = "月平均";
  }
  var title = "<h3 style='margin-bottom: 60px;'>" + pageState.nowSelectCity + "1月-3月" + time + "空气质量报告" + "</h3>";

  var colors = ["#45818e", "#6d9eeb", "#8e7cc3", "#e06666", "#e69138"];
  var windowWidth = aqiChartWrap.clientWidth > 1024 ? aqiChartWrap.clientWidth: 1024;
  var num = 91;
  if(pageState.nowGraTime == "week") {
    num = 13;
  } else if(pageState.nowGraTime == "month") {
    num = 3;
  }
  var width = Math.floor(windowWidth / num) / 2;

  var items = "";
  var index = 0;
  for(var date in chartData) {
    items += "<div style='display:inline-block; position: relative; background:" + colors[index] 
            + "; margin: 10px " + width/2 + "px 5px; width:" + width + "px; height:" 
            + chartData[date] + "px;'" 
            + " title='Date: " + date +"<br />Aqi: " + chartData[date] 
            + "' onmouseover=showTitle() onmouseleave=hideTitle()></div>";
    index++;
    if(index == colors.length) {
      index = 0;
    }
  }
  aqiChartWrap.innerHTML = title + "<div>"+ items + "</div>";
}

/**
 * 显示柱体日期与数值
 */
function showTitle() {
  var node = event.target;
  var title = document.createElement("div");
  title.innerHTML = node.getAttribute("title");
  title.setAttribute("style",
        "width: 160px; position: absolute; top: -50px; left: -80px; border: 2px solid #000; background: #fff; z-index: 1000;");
  node.appendChild(title);
}

/** 
 * 鼠标离开后隐藏title
 */
function hideTitle() {
  var node = event.target;
  node.removeChild(node.firstChild);
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange() {
  // 确定是否选项发生了变化 
  var gradTime = event.target.value;
  if(gradTime == pageState.nowGraTime) {
    return;
  }

  // 设置对应数据
  pageState.nowGraTime = gradTime;
  if(pageState.nowGraTime == "week") {
    dayToWeek();
  } else if(pageState.nowGraTime == "month") {
    dayToMonth();
  } else {
    chartData = aqiSourceData[pageState.nowSelectCity];
  }

  // 调用图表渲染函数
  renderChart();
}

/** 
 * 周数据处理
 */
function dayToWeek() {
  chartData = aqiSourceData[pageState.nowSelectCity];

  var result = {};
  var sum = 0;
  var dayCount = 0;
  var weekCount = 1;
  for(var date in chartData) {
    sum += chartData[date];

    dayCount++;
    if(dayCount == 7) {
      // var dates = date.split("-");
      // var year = dates[0];
      // var month = parseInt(dates[1]);
      // var day = parseInt(dates[2]);
      // if(day < 7) {
      //   month--;
      // }
      // if((weekCount == 5 && day > 6) || (weekCount == 6)) {
      //   weekCount = 1;
      // }
      var currentDate = new Date(date);
      var year = currentDate.getFullYear();
      var month = currentDate.getMonth() + 1;
      var day = currentDate.getDate();
      if(day < 7) {
        month --;
      }
      if((weekCount == 5 && day > 6) || (weekCount == 6)) {
        weekCount = 1;
      }

      result[year + "年" + month +"月第" + weekCount + "周"] = Math.ceil(sum / 7);

      weekCount ++;      
      sum = 0;
      dayCount = 0;
    }
  }
  chartData = result;
}

/** 
 * 月数据处理
 */
function dayToMonth() {
  chartData = aqiSourceData[pageState.nowSelectCity];
  
  var result = {};
  var sum = 0;
  var dayCount = 0;
  for(var date in chartData) {
    sum += chartData[date];

    dayCount++;
    if(dayCount >= 27) {
      var currentDate = new Date(date);
      var year = currentDate.getFullYear();
      var currentMonth = currentDate.getMonth();
      currentDate.setDate(currentDate.getDate()+1);
      var nextMonth = currentDate.getMonth();
      if(currentMonth != nextMonth) {
        month = currentMonth + 1;
        result[year + "年" + month +"月"] = Math.ceil(sum / dayCount);
        sum = 0;
        dayCount = 0;
      }     
    }
  }
  chartData = result;
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 
  var citySelect = document.getElementById("city-select");
  if(citySelect.value == pageState.nowSelectCity) {
    return;
  }

  // 设置对应数据
  pageState.nowSelectCity = citySelect.value;
  if(pageState.nowGraTime == "week") {
    dayToWeek();
  } else if(pageState.nowGraTime == "month") {
    dayToMonth();
  } else {
    chartData = aqiSourceData[pageState.nowSelectCity];
  }

  // 调用图表渲染函数
  renderChart();
}

/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var formGraTime = document.getElementById("form-gra-time");
  formGraTime.onclick = function(event) {
    if(event.target.nodeName == "INPUT") {
      graTimeChange();
    }
  }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
  var citySelect = document.getElementById("city-select");
  var items = "";
  for(var city in aqiSourceData) {
    items += "<option>" + city + "</option>";
  }
  citySelect.innerHTML = items;

  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  citySelect.onchange = citySelectChange;
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  chartData = aqiSourceData["北京"];
  pageState.nowSelectCity = "北京";
  renderChart();
}

/**
 * 初始化函数
 */
function init() {
  initGraTimeForm()
  initCitySelector();
  initAqiChartData();
}

init();