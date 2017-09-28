// ==UserScript==
// @name        pad.skyozora.com-Multiplay-Helper
// @namespace   http://www.mapaler.com/
// @description show体力
// @include     http://pad.skyozora.com/multiplay/register/
// @include     http://pad.skyozora.com/multiplay/
// @version     1.0.0
// @grant       none
// ==/UserScript==


//仿GM_xmlhttpRequest函数v1.3
if (typeof(GM_xmlhttpRequest) == "undefined") {
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

var config={
	version:1, //储存当前设置结构版本
	updateDate:0, //储存当前开放地图上次更新时间
	todayStage:[], //储存当前开放的地图
	coinStage:[], //储存配信中的金币地下城
	stageList:[], //储存全部地图的数据
}
var stageTestReg = "^/?s(?:tage)?/"; //用来测试href是不是地下城的

if (GM_getValue("helper-config")==undefined)
{
	console.log("配置不存在")
}else
{
	console.log("配置存在")
}

if(location.pathname == "/multiplay/register/") //注册页面
{
	registerPage();
}else if(location.pathname == "/multiplay/") //列表页面
{
	multiplayPage();
}

function registerPage()
{
	var form = document.querySelector("#wrapper>table:nth-of-type(3) form"); //主要版面的表单
	//new Date().getDate()
	var box = document.createElement("div");form.parentElement.appendChild(box);
	box.id = "helper";

	var chkUpt = document.createElement("input");box.appendChild(chkUpt);
	chkUpt.type = "button";
	chkUpt.id = chkUpt.className = "checkUpdate";
	chkUpt.value = "检查今日开放关卡";
	chkUpt.onclick = checkTodayUpdate;

	var chkStgLst = document.createElement("input");box.appendChild(chkStgLst);
	chkStgLst.type = "button";
	chkStgLst.id = chkUpt.className = "check-stage-list";
	chkStgLst.value = "获取完整地下城列表（慢，建议每次出新图更新一次）";
	chkStgLst.onclick = checkAllStageList;
}

function multiplayPage()
{
	var table = document.querySelector("#wrapper>table:nth-of-type(3) table"); //协力请求表格
	for (var ri=table.rows.length-1;ri>0;ri--)
	{
		if (table.rows[ri].cells.length<2)
		{
			table.rows[ri].remove(); //去除广告
		}
	}
}
function checkTodayUpdate()
{
	GM_xmlhttpRequest({
		method: "GET",
		url: location.origin, //主页
		onload: dealMainPage,
	});
	GM_xmlhttpRequest({
		method: "GET",
		url: "stage/配信中的金幣地下城",
		onload: dealCoinPage,
	});

	function dealMainPage(response)
	{
		var PageDOM = new DOMParser().parseFromString(response.responseText, "text/html");
		config.todayStage.length = 0; //先清空
		//紧急活动地下城表格
		var JinJiEvent = PageDOM.querySelector("#container>.item:nth-of-type(1)>table:nth-of-type(2)");
		//今天的降临
		var JiangLin = JinJiEvent.rows[2].cells[1].getElementsByTagName("a");
		for (var ai=0;ai<JiangLin.length;ai++)
		{
			var link = JiangLin[ai];
			if (new RegExp(stageTestReg,"igm").test(link.getAttribute("href")))
			{
				config.todayStage.push(link.title);
			}
		}
		//今天的紧急
		for (var ri=1;ri<JinJiEvent.rows[2].cells[0].rowSpan;ri++)
		{
			var link = JinJiEvent.rows[2+ri].cells[0].querySelector("a");
			if (new RegExp(stageTestReg,"igm").test(link.getAttribute("href")))
			{
				config.todayStage.push(link.title);
			}
		}
	
		//长期活动地下城表格
		var ChangQiEvent = PageDOM.querySelector("#container>.item:nth-of-type(2)>table:nth-of-type(2)");
		for (var ri=1;ri<ChangQiEvent.rows.length;ri++)
		{
			var imgs = ChangQiEvent.rows[ri].getElementsByTagName("img");
			var typeStr = ""; //储存地下城类型说明
			var typeSpan = ChangQiEvent.rows[ri].cells[2].querySelector("span");
			if (typeSpan != undefined)
			{
				typeStr = typeSpan.textContent;
			}
			for (var ii=0;ii<imgs.length;ii++)
			{
				var link = imgs[ii].parentElement;
				if (new RegExp(stageTestReg,"igm").test(link.getAttribute("href")) //是场景
					&& !/coin\.png/igm.test(imgs[ii].getAttribute("src")) //不是金币地下城
					&& !/一次通關限定/igm.test(typeStr) //不是一次通关限定
					&& !/每天一場/igm.test(typeStr) //不是每天一场限定
				)
				{
					config.todayStage.push(link.title);
				}
			}
		}
		console.log("今日地下城获取完毕",config);
	}

	function dealCoinPage(response)
	{
		var PageDOM = new DOMParser().parseFromString(response.responseText, "text/html");
		config.coinStage.length = 0; //先清空
		//金币地下城表格
		var stageTable = PageDOM.querySelector("#wrapper>table:nth-of-type(3) table");
		//今天的紧急
		for (var ri=1;ri<stageTable.rows.length;ri++)
		{
			var link = stageTable.rows[ri].cells[1].querySelector("a");
			if (new RegExp(stageTestReg,"igm").test(link.getAttribute("href")))
			{
				config.coinStage.push(link.textContent);
			}
		}
		console.log("金币地下城获取完毕",config);
	}
}
//单个难度地下城关卡
function Stage(name,iconUrl)
{
	this.name = name;
	this.iconUrl = iconUrl;
	return this;
}
//多个难度的地下城关卡
function mainStage(name,iconUrl)
{
	var obj = new Stage(name,iconUrl);
	obj.subStage = [];
	function dealSubStage(response)
	{
		var PageDOM = new DOMParser().parseFromString(response.responseText, "text/html");
		obj.subStage.length = 0; //先清空

	}
	obj.checkSubStage = function(callback)
	{
		GM_xmlhttpRequest({
			method: "GET",
			url: "stage/" + this.name,
			onload: dealSubStage,
		});
	}
	return obj;
}
function checkAllStageList()
{
	GM_xmlhttpRequest({
		method: "GET",
		url: "stage",
		onload: dealStageList,
	});

	function dealStageList(response)
	{
		var PageDOM = new DOMParser().parseFromString(response.responseText, "text/html");
		config.stageList.length = 0; //先清空
		//所有地下城表格
		var stageTd = PageDOM.querySelector("#wrapper>table:nth-of-type(3) td");
		var stages = stageTd.getElementsByClassName("stage");
		//所有地下城
		for (var si=1,si_l=stages.length;si<si_l;si++)
		{
			var link = stages[si].querySelector("a");
			if (new RegExp(stageTestReg,"igm").test(link.getAttribute("href")))
			{
				imgUrl = link.querySelector("img").getAttribute("data-original");
				var stage = new mainStage(link.title,imgUrl);
				config.stageList.push(stage);
			}
		}

		console.log("所有地下城获取完毕",config);
	}
}