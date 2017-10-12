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
//一个按钮对象
var Button = function(value,className,onClick)
{
	var btn = document.createElement("button");
	btn.className = className;
	btn.appendChild(document.createTextNode(value));
	btn.onclick = onClick;
	return btn;
}
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

	var listBox = mBox.appendChild(document.createElement("div")); //列表框架
	listBox.className = "list-box";
	var list = listBox.appendChild(document.createElement("ul")); //列表ul
	list.className = "mltlist";

	var controlBox = mBox.appendChild(document.createElement("div")); //控制按钮框架
	controlBox.className = "control-box";
	controlBox.appendChild(new Button("refresh","material-icons",function(){refresh()}));
	controlBox.appendChild(new Button("add","material-icons",function(){alert("添加")}));
	controlBox.appendChild(new Button("settings","material-icons",function(){alert("设置")}));

	var addBox = mBox.appendChild(document.createElement("div")); //添加请求框架
	addBox.className = "add-box";

	var configBox = mBox.appendChild(document.createElement("div")); //设置框架
	configBox.className = "config-box";
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
	buildMultiplayList(mltArray);
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
	console.log(mltArray);
}