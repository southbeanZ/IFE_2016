/**
 * 添加事件监听
 */
function addEventHandler(ele, type, handler) {
	if(ele.addEventListner) {
		ele.addEventListener(type, handler, false);
	} else if(ele.attachEvent) {
		ele.attachEvent("on" + type, handler);
	} else {
		ele["on" + type] = handler;
	}
}

/**
 * 左侧加入队列
 */
function pushLeft(ele) {
	var node = dataProcess(ele);
	if(node == null) {
		return;
	}

	if(queue.childElementCount == 0) {
		queue.appendChild(node);
	} else {
		queue.insertBefore(node, queue.firstChild);
	}
	
}

/**
 * 右侧加入队列
 */
function pushRight(ele) {
	var node = dataProcess(ele);
	if(node == null) {
		return;
	}

	queue.appendChild(node);
}

/**
 * 左侧弹出队列
 */
function popLeft() {
	if(queue.childElementCount == 0) {
		alert("队列为空！");
	} else {
		alert(queue.firstChild.getAttribute("data"));
		queue.removeChild(queue.firstChild);
	}
}

/**
 * 右侧弹出队列
 */
function popRight() {
	if(queue.childElementCount == 0) {
		alert("队列为空！");
	} else {
		alert(queue.lastChild.getAttribute("data"));
		queue.removeChild(queue.lastChild);
	}
}

/**
 * 输入校验与数值处理
 */
function dataProcess(value) {
	if(queue.childElementCount > 59) {
		alert("队列元素已有60个！");
		return null;
	}

	if(!/\d/.test(value)) {
		alert("输入必须是数字！");
		return null;
	}

	var inputVal = parseInt(value);
	if(inputVal < 10 || inputVal > 100) {
		alert("输入数字必须在10-100！");
		return null;
	}

	var node = document.createElement("div");
	node.className = "ele";
	node.setAttribute("data", inputVal);
	node.style.height = inputVal + "px";
	return node;
}

/**
 * 随机生成一组数据
 */
function randomGenerate() {
	clearData();
	
	for(var i = 0; i < 60; i++) {
		var num = Math.ceil(Math.random()*90+10);
		pushRight(num);
	}
}

/**
 * 清除数据
 */
function clearData() {
	queue.innerHTML = "";
}

/**
 * 插入排序
 */
function insertSort() {
	var childs = queue.querySelectorAll(".ele");
	var len = childs.length;
	var i = 1;
	var sorter = setInterval(function(){
		if(i < len) {
			var temp = parseInt(childs[i].getAttribute("data"));
			var j = i - 1;
			while((j >= 0) && (temp < parseInt(childs[j].getAttribute("data"))) ) {
				childs[j + 1].style.height = childs[j].style.height;
				childs[j + 1].setAttribute("data", childs[j].getAttribute("data"));
				j--;
			}
			childs[j + 1].style.height = temp + "px";
			childs[j + 1].setAttribute("data", temp);
			i++;
		} else {
			clearInterval(sorter);
		}
	}, time);
}

/**
 * 冒泡排序
 */
function bubbleSort() {
	var childs = queue.querySelectorAll(".ele");
	var len = childs.length;
	var i = 0;
	var j = len - 1;
	var timer = setInterval(function(){
		if(i >= len) {
			clearInterval(timer);
		}
		if(j > i) {
			var cur = parseInt(childs[j].getAttribute("data"));
			var prev = parseInt(childs[j-1].getAttribute("data"));
			if(cur < prev) {
				childs[j].style.height = prev + "px";
				childs[j].setAttribute("data", prev);
				childs[j-1].style.height = cur + "px";
				childs[j-1].setAttribute("data", cur);
			}
			j--;
		} 
		if(j <= i) {
			i++;
			j = len - 1;
		}
	}, time);
}
 
/**
 * 初始化事件监听
 */
function initEventListener() {
	var btnGroup = document.getElementById("btnGroup");
	addEventHandler(btnGroup, "click", function(event) {
		var curVal = document.getElementById("num").value.trim();
		var tNode = event.target.id;

		if(tNode == "pushLeft") {
			pushLeft(curVal);
		} else if(tNode == "pushRight") {
			pushRight(curVal);
		} else if(tNode == "popLeft") {
			popLeft();
		} else if(tNode == "popRight") {
			popRight();
		} else if(tNode == "insertSort") {
			insertSort();
		} else if(tNode == "random") {
			randomGenerate();
		} else if(tNode == "clear") {
			clearData();
		} else if(tNode == "bubbleSort") {
			bubbleSort();
		}
 	});

	addEventHandler(queue, "click", function(event) {
		if(event.target.className == "ele") {
			queue.removeChild(event.target);
		}
	});
}

var queue;
var time = 100;

function init() {
	queue = document.getElementById("queue");
	initEventListener();
}

init();
