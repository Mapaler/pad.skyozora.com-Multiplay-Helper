// ==UserScript==
// @name        pad.skyozora.com-Multiplay-AJAX
// @name:zh-CN	智龙迷城战友网无谷歌AJAX协力页面
// @namespace   http://www.mapaler.com/
// @description Use AJAX to avoid google
// @description:zh-CN 智龙迷城战友系统及资讯网，使用AJAX技术排除谷歌脚本的协力页面，加快手机访问速度。
// @include     http://pad.skyozora.com/forum/uc_client/
// @copyright	2017+, Mapaler <mapaler@163.com>
// @version     1.0.0
// @grant       none
// ==/UserScript==

window.onload = function()
{
	buildMainFramework(); //构建主结构
	refresh(); //刷新
}

//仿GM_xmlhttpRequest函数v1.3
if (typeof(GM_xmlhttpRequest) == "undefined")
{
    var GM_xmlhttpRequest = function(GM_param) {

        var xhr = new XMLHttpRequest(); //创建XMLHttpRequest对象
        xhr.open(GM_param.method, GM_param.url, true);
        if (GM_param.responseType) xhr.responseType = GM_param.responseType;
        if (GM_param.overrideMimeType) xhr.overrideMimeType(GM_param.overrideMimeType);
        xhr.onreadystatechange = function() //设置回调函数
            {
                if (xhr.readyState === xhr.DONE) {
                    if (xhr.status === 200 && GM_param.onload)
                        GM_param.onload(xhr);
                    if (xhr.status !== 200 && GM_param.onerror)
                        GM_param.onerror(xhr);
                }
            }

        for (var header in GM_param.headers) {
            xhr.setRequestHeader(header, GM_param.headers[header]);
        }

        xhr.send(GM_param.data ? GM_param.data : null);
    }
}
//仿GM_getValue函数v1.0
if(typeof(GM_getValue) == "undefined")
{
	var GM_getValue = function(name, type){
		var value = localStorage.getItem(name);
		if (value == undefined) return value;
		if ((/^(?:true|false)$/i.test(value) && type == undefined) || type == "boolean")
		{
			if (/^true$/i.test(value))
				return true;
			else if (/^false$/i.test(value))
				return false;
			else
				return Boolean(value);
		}
		else if((/^\-?[\d\.]+$/i.test(value) && type == undefined) || type == "number")
			return Number(value);
		else
			return value;
	}
}
//仿GM_setValue函数v1.0
if(typeof(GM_setValue) == "undefined")
{
	var GM_setValue = function(name, value){
		localStorage.setItem(name, value);
	}
}
//仿GM_deleteValue函数v1.0
if(typeof(GM_deleteValue) == "undefined")
{
	var GM_deleteValue = function(name){
		localStorage.removeItem(name);
	}
}
//仿GM_listValues函数v1.0
if(typeof(GM_listValues) == "undefined")
{
	var GM_listValues = function(){
		var keys = [];
		for (var ki=0, kilen=localStorage.length; ki<kilen; ki++)
		{
			keys.push(localStorage.key(ki));
		}
		return keys;
	}
}
// 复制文字的程序
function copyArticle(element) {
	const range = document.createRange();
	range.selectNode(element);

	const selection = window.getSelection();
	if(selection.rangeCount > 0) selection.removeAllRanges();
	selection.addRange(range);
	document.execCommand('copy');
}
//给数字字符串补零，不支持负数
function padNumber(num, fill) {
    //改自：http://blog.csdn.net/aimingoo/article/details/4492592
    var len = ('' + num).length;
    return (Array(
        fill > len ? fill - len + 1 || 0 : 0
    ).join(0) + num);
}
//一个按钮对象
var Button = function(value,className,title,onClick)
{
	var btn = document.createElement("button");
	btn.className = className;
	btn.title = title;
	btn.appendChild(document.createTextNode(value));
	btn.onclick = onClick;
	return btn;
}
//创建Label类
var Label = function(text, forId = "", classname = "") {
	var label = document.createElement("label");
	label.appendChild(document.createTextNode(text));
	if (forId != undefined)
		label.setAttribute("for",forId);
	if (classname != undefined)
		label.className = classname;
	return label;
};
//创建Input类
var Input = function(options) {
	var ipt = document.createElement("input");

	for (var attr in options) {
		ipt[attr] = options[attr];
	}

	return ipt;
};
//创建带Label的Input类
var LabelInput = function(text, classname, name, type, value, title = "", beforeText = true) {
	var label = document.createElement("label");
	if (text != undefined) label.appendChild(document.createTextNode(text));
	label.className = classname;
	if (typeof(title) != "undefined")
		label.title = title;

	var ipt = document.createElement("input");
	ipt.name = name;
	ipt.id = ipt.name;
	ipt.type = type;
	ipt.value = value;

	label.input = ipt;
	if (beforeText)
		label.insertBefore(ipt, label.firstChild);
	else
		label.appendChild(ipt);
	return label;
};
//一个Post数据
var PostDataObject = function(obj) {
	var postdata = new Object;
	if (obj)
		postdata.data = Object.assign({}, obj); //合并obj
	postdata.increase = function(obj) {
		postdata.data = Object.assign(postdata.data, obj); //合并obj
	}
	postdata.toPostString = function() {
		var arr = new Array;
		for (var na in postdata.data) {
			var item = [na, postdata.data[na]];
			arr.push(item);
		}

		var str = arr.map(
			function(item) {
				return item.join("=");
			}
		).join("&");
		return str;
	}
	return postdata;
};
//一个协力请求对象
var Multiplay = function(stage1,stage2,image,roomId,ask,time)
{
	var obj = {
		stage1:stage1,
		stage2:stage2,
		image:image,
		roomId:roomId,
		ask:ask,
		time:time
	}
	return obj;
}
function info(message)
{

}
function buildMainFramework()
{
	var mBox = document.body.appendChild(document.createElement("div")); //总框架
	mBox.id = mBox.className = "main-box";
	var boxArr = [];

	var listBox = document.createElement("div"); //列表框架
	listBox.className = "list-box page";
	var title = listBox.appendChild(document.createElement("div"));
	title.className = "list-title";
	title.appendChild(document.createTextNode("其他玩家创建的房间"));

	var list = listBox.appendChild(document.createElement("ul")); //列表ul
	list.className = "mltlist";

	listBox.appendChild(new Button("refresh","material-icons action-button action-button-refresh","刷新列表",function(){refresh()}));


	/* 添加请求页面 */
	var createBox = document.createElement("div"); //添加请求框架
	createBox.className = "create-box page display-none";
	var title = createBox.appendChild(document.createElement("div"));
	title.className = "list-title";
	title.appendChild(document.createTextNode("登陆自行创建的房间"));

	var roomIdBox = createBox.appendChild(document.createElement("div"));
	var lblRoomId = roomIdBox.appendChild(new Label("房间ID","roomid"));
	var iptRoomId = roomIdBox.appendChild(new Input({type:"number",id:"roomid",max:"99999999",min:"0",step:"1"}));

	var stageBox = createBox.appendChild(document.createElement("div"));
	var lblStage = stageBox.appendChild(new Label("地下城","stage"));
	var btnStage = stageBox.appendChild(new Button("点击选择","create-button-stage","点击显示地下城选择页面",function(){alert("地下城")}));

	var askBox = createBox.appendChild(document.createElement("div"));
	var lblAsk = askBox.appendChild(new Label("征求队伍","req"));
	var iptAsk = askBox.appendChild(new Input({type:"text",id:"req",maxLength:"50"}));

	createBox.appendChild(new Button("send","material-icons action-button action-button-send","发送征求",function(){
		var postObj = new PostDataObject({ //Post时发送的数据
			roomid: iptRoomId.value,
			//column1: "",
			column2: "",
			column3: "",
			req: iptAsk.value,
			//button:"登錄",
		})
		GM_xmlhttpRequest({
			method: "POST",
			//url: "http://pad.skyozora.com/multiplay/",
			//url: "test.html",
			url: "test.html",
			data: postObj.toPostString(),
			onload: dealMultiplay,
			onerror: function(response) {
				info("发送征求信息失败");
				console.error("发送征求信息失败",response);
			}
		});
	}));


	/* 设置页面 */
	var settingsBox = document.createElement("div"); //设置框架
	settingsBox.className = "settings-box page display-none";
	var title = settingsBox.appendChild(document.createElement("div"));
	title.className = "list-title";
	title.appendChild(document.createTextNode("程序设置"));

	settingsBox.appendChild(new Button("done","material-icons action-button action-button-done","保存设置",function(){alert("保存")}));


	/* 控制栏 */
	var controlBox = document.createElement("div"); //控制按钮框架
	controlBox.className = "control-box";
	controlBox.appendChild(new Button("list","material-icons control-button control-button-list","全部协力列表",function(){showPage("list")}));
	controlBox.appendChild(new Button("create","material-icons control-button control-button-create","添加我的协力请求",function(){showPage("create")}));
	//controlBox.appendChild(new Button("filter_list","material-icons control-button control-button-filter",function(){alert("筛选")}));
	controlBox.appendChild(new Button("settings","material-icons control-button control-button-settings","程序设置",function(){showPage("settings")}));


	boxArr.push(
		listBox,
		createBox,
		settingsBox,
		controlBox
	)
	boxArr.forEach(function(element) {
		mBox.appendChild(element);
	});
	function showPage(type)
	{
		var pageArr = ["list","create","settings"];
		pageArr.forEach(function(item){
			var box = mBox.querySelector("." + item + "-box");
			if (box)
				var cL = box.classList;
			else
				return;
			if (item == type)
				cL.remove("display-none");
			else
				cL.add("display-none");
		})
	}
}
//刷新
function refresh()
{
	GM_xmlhttpRequest({
		method: "GET",
		//url: "http://pad.skyozora.com/multiplay/",
		//url: "test.html",
		url: "test-mobile.html",
		onload: dealMultiplay,
		onerror: function(response) {
			info("获取协力列表失败");
			console.error("获取协力列表失败",response);
		}
	});
}
//处理获得的协力列表页面
function dealMultiplay(response)
{
	var mltArray = getMultiplayArray(response);
	if (mltArray.length<=0)
	{
		info("获取列表数据出错");
		return;
	}
	var liArr = buildMultiplayList(mltArray);
	var list = document.querySelector(".mltlist");

	while(list.childNodes.length>0)
	{
		delete list.firstChild.remove(); //清空原来的，并从内存删除
	}

	liArr.forEach(function(element) {
		list.appendChild(element);
	});

}
//将协力列表页面转化为数组
function getMultiplayArray(response)
{
	var mobile = false;
	var doc = new DOMParser().parseFromString(response.responseText, "text/html");
	var table = doc.querySelector("#wrapper>table:nth-of-type(3) table"); //协力请求表格
	if (table == undefined) //如果没找到，试试手机版
	{
		table = doc.querySelector(".content>table");
		if (table!=undefined)
		{
			mobile = true;
		}else
		{
			alert("😰未找到协力列表");
		}
	}
	var cellMaxLength = 0;
	for (var ci=0;ci<table.rows[0].cells.length;ci++)
	{
		cellMaxLength += table.rows[0].cells[ci].colSpan; //计算最大宽度
	}

	var mltArray = [];
	for (var ri=(mobile?0:1);ri<table.rows.length;(mobile?ri+=nextRow:ri++))
	{
		var row = table.rows[ri]; //当前行
		if (row.cells[0].colSpan >= cellMaxLength) //和最大宽度一致时算广告
		{
			if (mobile) nextRow=1; //手机版这次只跳一行
			continue; //跳过广告
		}

		var stage1,stage2,image,roomId,ask,time;
		image = (row.cells[0].querySelector("img").src || "");
		stage1 = (row.cells[1].querySelector("a").textContent || "");
		stage2 = (row.cells[1].querySelector("a:nth-of-type(2)").textContent || "");
		
		if (mobile)
		{
			var nextRow = table.rows[ri].cells[0].rowSpan; //获取纵向几行
			roomId = (table.rows[ri+1].cells[0].querySelector("span").textContent.replace(/\s/ig,"") || 0);
			time = (table.rows[ri+1].cells[0].lastChild.textContent.replace(/[\s\(\)]/ig,"") || "");
			ask = nextRow>2?table.rows[ri+2].textContent : "";
		}else
		{
			roomId = parseInt(row.cells[2].textContent.replace(/\s/ig,"") || 0);
			ask = row.cells[3].textContent;
			time = row.cells[4].textContent;
		}
	
		var mlt = new Multiplay(stage1,stage2,image,roomId,ask,time);
		mltArray.push(mlt);
	}
	return mltArray;
}
//将协力数组构建为网页
function buildMultiplayList(mltArray)
{
	var liArr = mltArray.map(function(mlt,index){
		var divArr = [];

		var li = document.createElement("li");
		li.className = index%2?"row-even":"row-odd";

		var imageBox = document.createElement("div");
		imageBox.className = "mlt-image-box";
		var image = imageBox.appendChild(document.createElement("img"));
		image.className = "mlt-image";
		image.src = mlt.image;
		
		var stageBox = document.createElement("div");
		stageBox.className = "mlt-stage-box";
		var stage1Box = stageBox.appendChild(document.createElement("div"));
		stage1Box.className = "mlt-stage-1-box";
		var stage1 = stage1Box.appendChild(document.createElement("a"));
		stage1.className = "mlt-stage-1";
		stage1.href = "stage/" + mlt.stage1;
		stage1.appendChild(document.createTextNode(mlt.stage1));
		var stage2Box = stageBox.appendChild(document.createElement("div"));
		stage2Box.className = "mlt-stage-2-box";
		var stage2 = stage2Box.appendChild(document.createElement("a"));
		stage2.className = "mlt-stage-2";
		stage2.href = "stage/" + mlt.stage1 + "/" + mlt.stage2;
		stage2.appendChild(document.createTextNode(mlt.stage2));

		var roomIdBox = document.createElement("div");
		roomIdBox.className = "mlt-roomId-box";
		roomIdBox.onclick = function(){
			copyArticle(this);
		}
		var id1 = roomIdBox.appendChild(document.createElement("span"));
		id1.className = "mlt-roomId-1";
		id1.appendChild(document.createTextNode( padNumber(parseInt(mlt.roomId / 10000),4) ));

		var id2 = roomIdBox.appendChild(document.createElement("span"));
		id2.className = "mlt-roomId-2";
		id2.appendChild(document.createTextNode( padNumber(parseInt(mlt.roomId % 10000),4) ));

		var timeBox = document.createElement("div");
		timeBox.className = "mlt-time-box";
		var time = timeBox.appendChild(document.createElement("span"));
		time.appendChild(document.createTextNode(mlt.time));

		divArr.push(
			imageBox,
			stageBox,
			timeBox,
			roomIdBox
		)

		if (mlt.ask.length>0)
		{
			var aksBox = document.createElement("div");
			aksBox.className = "mlt-ask-box";
			var ask = aksBox.appendChild(document.createElement("span"));
			ask.appendChild(document.createTextNode(mlt.ask));
			divArr.push(aksBox);
		}


		divArr.forEach(function(element) {
			li.appendChild(element);
		});
		return li;
	});
	return liArr;
}