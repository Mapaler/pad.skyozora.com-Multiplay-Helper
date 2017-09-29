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
	updateDate:0, //储存今日开放地图上次更新时间
	todayStage:[], //储存当前开放的地图
	stageList:[], //储存全部地图的数据
}
var stageTestReg = "^/?s(?:tage)?/"; //用来测试href是不是地下城的

if (GM_getValue("helper-config")==undefined)
{
	saveConfig();
	console.log("配置不存在，储存默认配置");
}else
{
	loadConfig();
	console.log("配置存在",config);
}
function loadConfig()
{
	var configStr = GM_getValue("helper-config");
	var saConfig = JSON.parse(configStr);
	if (typeof(saConfig) == "object")
		config = Object.assign(config, saConfig);
	var now = new Date();var last = new Date(config.updateDate);
	if (now > last && now.getDate() != last.getDate())
	{
		console.log("今天的开放地图还没检查");
	}else
	{
		console.log("已经是今天的开放地图");
	}
}
function saveConfig()
{
	var configStr = JSON.stringify(config);
	GM_setValue("helper-config", configStr); //下载方案
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
	chkStgLst.value = "获取完整地下城数据（极慢，每次出新图更新一次）";
	chkStgLst.onclick = checkAllStageList;

	var ioCfg = document.createElement("input");box.appendChild(ioCfg);
	ioCfg.type = "button";
	ioCfg.id = chkUpt.className = "input-output-config";
	ioCfg.value = "导入/导出本脚本设置";
	ioCfg.onclick = null;
}
function checkTodayUpdate()
{
	GM_xmlhttpRequest({
		method: "GET",
		url: location.origin, //主页
		onload: dealMainPage,
		onerror: function(response) {
			console.error("获取主页地下城活动失败",response);
		}
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
			var endTime = "";
			var endTimeTd = ChangQiEvent.rows[ri].cells[3];
			if (endTimeTd != undefined)
			{
				endTime = endTimeTd.childNodes[1].nodeValue;
			}
			for (var ii=0;ii<imgs.length;ii++)
			{
				var link = imgs[ii].parentElement;
				if (new RegExp(stageTestReg,"igm").test(link.getAttribute("href")) //是场景
					&& !/coin\.png/igm.test(imgs[ii].getAttribute("src")) //不是金币地下城
					&& !/一次通關限定/igm.test(typeStr) //不是一次通关限定
					&& !/每天一場/igm.test(typeStr) //不是每天一场限定
					&& !/後開始/igm.test(endTime) //不是还没有开始的
				)
				{
					config.todayStage.push(link.title);
				}
			}
		}
		config.updateDate = new Date().getTime();
		console.log("今日地下城获取完毕",config);
		saveConfig();
	}
}
//关卡大家都有的部分，类
function minStage(name,iconUrl)
{
	this.name = name;
	this.iconUrl = iconUrl;
}
//单个难度地下城关卡，类
function Stage(name,iconUrl,stamina,battles)
{
	var obj = new minStage(name,iconUrl);
	obj.stamina = stamina; //体力
	obj.battles = battles; //层数
	return obj;
}
//多个难度的地下城关卡，类
function mainStage(name,iconUrl)
{
	var obj = new minStage(name,iconUrl);
	obj.name = name;
	obj.iconUrl = iconUrl;
	obj.subStage = [];
	obj.checkSubStage = function(callback)
	{
		GM_xmlhttpRequest({
			method: "GET",
			url: "stage/" + this.name,
			onload: function(response){ //获取成功
				var PageDOM = new DOMParser().parseFromString(response.responseText, "text/html");
				var subStageList = PageDOM.querySelector("#wrapper>table:nth-of-type(3) ul"); //子关卡的列表ul
				var subStage = subStageList.getElementsByTagName("li"); //所有的li

				obj.subStage.length = 0; //去掉所有的旧数据
				for (var si=0;si<subStage.length;si++)
				{
					var link = subStage[si].querySelector("div a"); //图标链接
					var iconUrl = link.querySelector("img").getAttribute("data-original");
					var detailTd = subStage[si].querySelector("div:nth-of-type(2)"); //介绍格
					if (detailTd == undefined)
					{ //目前不知道到底是谁错了
						console.error("没有介绍格",subStage[si]);
					}
					var name = detailTd.querySelector("a").textContent.replace(/\s*關卡資料.*$/igm,"");
					var stamina = 0;var battles = 0;
					for (var ci=0;ci<detailTd.childNodes.length;ci++)
					{
						var cld = detailTd.childNodes[ci];
						if (cld.nodeName == "SPAN" && /體力/igm.test(cld.previousSibling.nodeValue))
							var stamina = parseInt(cld.textContent);
						if (cld.nodeName == "SPAN" && /層數/igm.test(cld.previousSibling.nodeValue))
							var battles = parseInt(cld.textContent);
					}
					var stage = new Stage(name,iconUrl,stamina,battles);
					obj.subStage.push(stage);
				}
				callback();
			},
			onerror: function(response) {
				console.error("获取 " + obj.name + " 详情失败",response);
			},
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
		onerror: function(response) {
			console.error("获取全部地下城列表失败",response);
		},
	});

	function dealStageList(response)
	{
		var PageDOM = new DOMParser().parseFromString(response.responseText, "text/html");
		//config.stageList.length = 0; //先清空
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
				var stage = config.stageList.filter(function(item){ //查找以前有没有这个地图
					return item.name == link.title;
				})[0];
				if (stage != undefined)
				{
					stage.name = link.title;
					stage.iconUrl = imgUrl;
				}else
				{ //没有就添加新的
					var stage = new mainStage(link.title,imgUrl);
					config.stageList.push(stage);
				}
				
			}
		}
		/*
		 * ▼添加暂时没有的特殊图
		 */
		config.stageList.push(new mainStage("光の戦武龍","http://i1296.photobucket.com/albums/ag18/skyozora/pets_icon/3838_zpsognjozvw.png"));
		config.stageList.push(new mainStage("闇の戦武龍","http://i1296.photobucket.com/albums/ag18/skyozora/pets_icon/3839_zpsinupxf0j.png"));
		/*
		 * ▲添加暂时没有的特殊图
		 */

		var stageArr = config.stageList;
		//var stageArr = config.stageList.slice(398,400); //debug用
		getStageDetail(stageArr,stageArr.length,function(){
			console.log("所有地下城获取完毕",config);
			saveConfig();
		});
	}
	function getStageDetail(stgArr,max,callback)
	{
		if (stgArr.length < 1)
		{
			callback();
			return;
		}
		var newStgArr = stgArr.concat();
		var thisStg = newStgArr.shift(); //删除新数组的第一个元素

		thisStg.checkSubStage(function(){
			console.log("已获取" + (max-newStgArr.length) + "/" + max);
			getStageDetail(newStgArr,max,callback);
		});
	}
}

/*
 * 协力列表页面
 * 
 */
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
	table.rows[0].cells[0].colSpan += 1; //标题添加一格合并
	for (var ri=1;ri<table.rows.length;ri++)
	{
		var newCell = table.rows[ri].insertCell(2); //添加新格
		var stageNameCell = table.rows[ri].cells[1]; //获取名字的格

		var link1 = stageNameCell.querySelector("a");
		var link2 = stageNameCell.querySelector("a:nth-of-type(2)");
		var stage1 = config.stageList.filter(function(item){
			return item.name == link1.textContent;
		})[0];
		if (stage1 == undefined) //如果发现没有数据的图，跳过
		{
			console.error("没有关卡数据",link1.textContent)
			continue;
		}
		var stage2 = stage1.subStage.filter(function(item){
			return item.name == link2.textContent;
		})[0];
		//newCell.appendChild(document.createTextNode(stage2.stamina + "体"));
		//newCell.appendChild(document.createElement("br"));
		newCell.appendChild(document.createTextNode("协力" + Math.round(stage2.stamina/2) + "体"));
		newCell.appendChild(document.createElement("br"));
		newCell.appendChild(document.createTextNode(stage2.battles + "层"));
	}
}