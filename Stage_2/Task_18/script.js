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
		alert(queue.firstChild.innerHTML);
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
		alert(queue.lastChild.innerHTML);
		queue.removeChild(queue.lastChild);
	}
}

/**
 * 输入校验与数值处理
 */
function dataProcess(value) {
	if(/\D/.test(value)) {
		alert("输入必须是数字！");
		return null;
	}

	var node = document.createElement("div");
	node.setAttribute("class", "ele");
	node.innerHTML = parseInt(value);
	return node;
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
		}
	});

	addEventHandler(queue, "click", function(event) {
		if(event.target.getAttribute("class") == "ele") {
			queue.removeChild(event.target);
		}
	});
}

var queue;

function init() {
	queue = document.getElementById("queue");
	initEventListener();
}

init();
