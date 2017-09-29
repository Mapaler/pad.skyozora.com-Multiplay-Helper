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

var config={
	version:1, //储存当前设置结构版本
	updateDate:0, //储存今日开放地图上次更新时间
	todayStage:[], //储存当前开放的地图
	starStage:[], //储存收藏的地图
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
	else
		console.error("配置损坏，使用默认配置");
	
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
	GM_setValue("helper-config", configStr);
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
	form.querySelector("p:nth-last-of-type(1)").remove() //去除最后面那个无用的东西
	//new Date().getDate()
	var box = document.createElement("div");form.parentElement.appendChild(box);
	box.id = box.className = "mlt-helper";


	function typeClick(){refreshStageList1(this.value)};

	var stgBox = document.createElement("div");box.appendChild(stgBox);
	var stg1Box = document.createElement("div");stgBox.appendChild(stg1Box);
	stg1Box.className = "stg-box stg-box-1";
	var stg1Ul = document.createElement("ul");stg1Box.appendChild(stg1Ul);
	var stg1UlLi1 = document.createElement("li");stg1Ul.appendChild(stg1UlLi1);
	var stgType1 = new LabelInput("今日地下城", "stg-type","stg-type","radio","0","今天开放的降临地下城与活动地下城");
	stgType1.input.checked = true;
	stgType1.input.onclick = typeClick;
	stg1UlLi1.appendChild(stgType1);
	var stg1UlLi2 = document.createElement("li");stg1Ul.appendChild(stg1UlLi2);
	var stgType2 = new LabelInput("我的收藏", "stg-type","stg-type","radio","1","我收藏的地下城");
	stgType2.input.onclick = typeClick;
	stg1UlLi2.appendChild(stgType2);

	var stg2Box = document.createElement("div");stgBox.appendChild(stg2Box);
	stg2Box.className = "stg-box stg-box-2";
	var stg2Ul = document.createElement("ul");stg2Box.appendChild(stg2Ul);


	var msgBox = document.createElement("div");stgBox.appendChild(msgBox);
	msgBox.className = "stg-box stg-box-3";
	var msgUl = document.createElement("ul");msgBox.appendChild(msgUl);


	//刷新地下城列表类型
	function refreshStageList1(type)
	{
		if (type == undefined)type = 0;
		console.log(type)
		for (var ci = stg2Ul.childNodes.length-1;ci>=0;ci--) //清空主图列表
		{
			stg2Ul.childNodes[ci].remove();
		}
		var stages; //需要处理的数组
		if (type == 0)
		{
			stages = config.todayStage
		}else if (type == 1)
		{
			stages = config.starStage
		}else
		{
			console.error("未知的地下城类型");
			return;
		}

		stages.forEach(function(stgName)
		{
			var _stgName = stgName;
			var li = document.createElement("li");stg2Ul.appendChild(li);
			var stgLbl = new LabelInput(null, "stg-list","stg-list","radio",_stgName,"地下城大关卡：" + _stgName);
			li.appendChild(stgLbl);
			stgLbl.input.onclick = refreshStageList2;

			var icon = document.createElement("div"); stgLbl.appendChild(icon);
			icon.className = "stage-icon";
			var thisStage = config.stageList.filter(function(stg){return stg.name == _stgName;})[0]
			if (thisStage) icon.style.backgroundImage = "url(" + thisStage.iconUrl + ")";
			
			var detail =  document.createElement("div"); stgLbl.appendChild(detail);
			detail.className = "stage-detail";
			detail.appendChild(document.createTextNode(_stgName));
			
		})
	}
	function refreshStageList2()
	{
		if (!this.checked) return; //如果并不是自身被选中，那么就没反应
		var _stgName = this.value;
		var thisStage = config.stageList.filter(function(stg){return stg.name == _stgName;})[0]
		if (thisStage == undefined)
		{
			alert("😱数据库里没有这个地下城");
			return;
		}
		/*
		//添加脚本的地下城类型
		function checkOptionValue(select,value)
		{
			var otps = select.options;
			for (var oi=0,oi_l = otps.length;oi<oi_l;oi++)
			{
				if (otps[oi].value == value)
				{
					return oi;
				}
			}
			return -1;
		}
		var newTypeName = "脚本选中>>";
		var typeIdx = checkOptionValue(stage0,newTypeName);
		if (typeIdx>=0)
		{
			stage0.selectedIndex = typeIdx;
		}else
		{
			var opt = new Option(newTypeName, newTypeName);
			stage0.add(opt);
			stage0.selectedIndex = stage0.options.length - 1;
		}
		*/
		stage0.selectedIndex = stage0.options.length - 1; //选中“上次登录的关卡”

		while(stage1.options.length>0) //清空原来的主地下城列表
		{
			stage1.remove(0);
		}
		while(stage2.options.length>0) //清空原来的子地下城列表
		{
			stage2.remove(0);
		}

		var opt = new Option(thisStage.name, thisStage.name);
		stage1.add(opt);
		stage1.selectedIndex = stage1.options.length - 1;

		thisStage.subStage.forEach(function(stg){
			var opt = new Option(stg.name, stg.name);
			stage2.add(opt);
		})
		stage2.selectedIndex = 0;
	}

	var btnBox = document.createElement("div");box.appendChild(btnBox);
	var chkUpt = document.createElement("input");btnBox.appendChild(chkUpt);
	chkUpt.type = "button";
	chkUpt.id = chkUpt.className = "checkUpdate";
	chkUpt.value = "检查今日开放关卡";
	chkUpt.onclick = checkTodayUpdate;

	var chkStgLst = document.createElement("input");btnBox.appendChild(chkStgLst);
	chkStgLst.type = "button";
	chkStgLst.id = chkUpt.className = "check-stage-list";
	chkStgLst.value = "获取完整地下城数据（极慢，每次出新图更新一次）";
	chkStgLst.onclick = checkAllStageList;

	var ioCfg = document.createElement("input");btnBox.appendChild(ioCfg);
	ioCfg.type = "button";
	ioCfg.id = chkUpt.className = "input-output-config";
	ioCfg.value = "导入/导出本脚本设置";
	ioCfg.onclick = function(){
		var dlg = ioConfigDialog();
		document.body.appendChild(dlg);
		dlg.classList.remove("display-none");
		dlg.txt.value = JSON.stringify(config);
	};

	//收藏按钮
	var stage0 = form.querySelector("[name=column1]");
	var stage1 = form.querySelector("#stage");
	var stage2 = form.querySelector("#stage2"); stage2.onchange = null;
	var starStg = document.createElement("input");form.insertBefore(starStg,stage2.nextSibling);
	starStg.type = "button";
	starStg.id = starStg.className = "star-stage";
	starStg.value = "收藏该地下城";
	starStg.onclick = function(){
		if (config.starStage.indexOf(stage1.value)<0)
		{
			config.starStage.push(stage1.value);
			saveConfig();
			alert("💗“"+ stage1.value +"”收藏成功");
		}else
		{
			alert("😅“"+ stage1.value +"”已经收藏过了");
		}
	};

	refreshStageList1(0); //先刷新地下城吧
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
function checkAllStageList(resetAll = false)
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
		if (resetAll) config.stageList.length = 0; //先清空
		//所有地下城表格
		var stageTd = PageDOM.querySelector("#wrapper>table:nth-of-type(3) td");
		var stages = stageTd.getElementsByClassName("stage");


		//检查是否已经存在，否则添加新的
		function checkExistAdd(newStage,resetAll = false)
		{
			var oldStage = config.stageList.filter(function(item){ //查找以前有没有这个地图
				return item.name == link.title;
			})[0];
			if (!resetAll && oldStage != undefined)
			{
				oldStage.name = newStage.name;
				oldStage.iconUrl = newStage.iconUrl;
			}else
			{ //没有就添加新的
				newStages.push(newStage);
			}
		}

		var newStages = [];
		//所有地下城
		for (var si=1,si_l=stages.length;si<si_l;si++)
		{
			var link = stages[si].querySelector("a");
			if (new RegExp(stageTestReg,"igm").test(link.getAttribute("href")))
			{
				imgUrl = link.querySelector("img").getAttribute("data-original");
				checkExistAdd(new mainStage(link.title,imgUrl),resetAll);
			}
		}
		//▼添加暂时没有的特殊图
		checkExistAdd(new mainStage("光の戦武龍","http://i1296.photobucket.com/albums/ag18/skyozora/pets_icon/3838_zpsognjozvw.png"),resetAll);
		checkExistAdd(new mainStage("闇の戦武龍","http://i1296.photobucket.com/albums/ag18/skyozora/pets_icon/3839_zpsinupxf0j.png"),resetAll);
		//▲添加暂时没有的特殊图

		//var stageArr = config.stageList.slice(398,400); //debug用
		getStageDetail(newStages,newStages.length,function(){
			config.stageList = config.stageList.concat(newStages);
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


function ioConfigDialog()
{
	var box = document.querySelector("#io-config-dialog");
	if (box != undefined) return box;

	var box = document.createElement("div");
	box.id = box.className = "io-config-dialog";
	box.className = "display-none";

	var txt = document.createElement("textarea");box.appendChild(txt);
	txt.id = txt.className = "config-text";
	txt.value = "";
	box.txt = txt;

	var btnBox = document.createElement("div");box.appendChild(btnBox);
	var btnIpt = document.createElement("input");btnBox.appendChild(btnIpt);
	btnIpt.type = "button";
	btnIpt.id = btnIpt.className = "input-config";
	btnIpt.value = "导入设置";
	btnIpt.onclick = function(){
		var configStr = txt.value;
		var saConfig = JSON.parse(configStr);
		if (typeof(saConfig) == "object")
		{
			config = Object.assign(config, saConfig);
			saveConfig();
			alert("😄导入成功");
		}else
		{
			alert("😰该配置信息格式不正确");
		}
	}

	var btnCls = document.createElement("input");btnBox.appendChild(btnCls);
	btnCls.type = "button";
	btnCls.id = btnCls.className = "close-dialog";
	btnCls.value = "关闭";
	btnCls.onclick = function(){box.classList.add("display-none");}

	return box;
}