/**
 * aqiData，存储用户输入的空气指数数据
 * 示例格式：
 * aqiData = {
 *    "北京": 90,
 *    "上海": 40
 * };
 */
var aqiData = {};

/**
 * 从用户输入中获取数据，向aqiData中增加一条数据
 * 然后渲染aqi-list列表，增加新增的数据
 */
function addAqiData() {
	var city = document.getElementById("aqi-city-input").value.trim();
	var value = document.getElementById("aqi-value-input").value.trim();

	if(!/^[a-zA-Z\u4e00-\u9fa5]+$/.test(city)) {
		alert("输入的城市名必须为中英文字符!");
		return ;
	}

	if(!/^\d+$/.test(value)) {
		alert("空气质量指数必须为正整数！");
		return ;
	}
	aqiData[city] = value;
}

/**
 * 渲染aqi-table表格
 */
function renderAqiList() {
	var aqiTable = document.getElementById("aqi-table");
	if(Object.keys(aqiData).length > 0) {
		var items = "<tr><td>城市</td><td>空气质量</td><td>操作</td></tr>";
		for(var key in aqiData) {
			items += "<tr><td>" + key + "</td><td>" + aqiData[key] +"</td><td><button>删除</button></td></tr>";
		}
		aqiTable.innerHTML = items;
	} else {
		aqiTable.innerHTML = "";
	}
}

/**
 * 点击add-btn时的处理逻辑
 * 获取用户输入，更新数据，并进行页面呈现的更新
 */
function addBtnHandle() {
  addAqiData();
  renderAqiList();
}

/**
 * 点击各个删除按钮的时候的处理逻辑
 * 获取哪个城市数据被删，删除数据，更新表格显示
 */
function delBtnHandle() {
  // do sth.
  var aqiTable = document.getElementById("aqi-table");
  console.log(event.target.parentNode.parentNode.firstChild.firstChild.nodeValue);
  delete aqiData[event.target.parentNode.parentNode.firstChild.firstChild.nodeValue];
  renderAqiList();
}

function init() {
  var addBtn = document.getElementById("add-btn");
  var aqiTable = document.getElementById("aqi-table");

  // 在这下面给add-btn绑定一个点击事件，点击时触发addBtnHandle函数
  addBtn.onclick = addBtnHandle;
  // 想办法给aqi-table中的所有删除按钮绑定事件，触发delBtnHandle函数
  aqiTable.onclick = function(event) {
  	if(event.target.nodeName == "BUTTON") {
  		delBtnHandle();
  	}
  };

}

init();