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

	if (GM_getValue("helper-config") == undefined && location.pathname == "/multiplay/register/")
	{
		saveConfig();
		info("💗欢迎使用！\n请先导入地下城列表数据\n然后检查今日开放地下城。");
		console.log("配置不存在，储存默认配置");
	}else
	{
		loadConfig(GM_getValue("helper-config"),GM_getValue("helper-stage-list"));
		//console.log("配置存在",config);
	
		var now = getLocalTime(9);var last = new Date(config.updateDate);
		if (now > last && now.getDate() != last.getDate())
		{
			console.log("今天的开放地图还没检查");
			info("💗又是新的一天了！\n先检查今天开放的地下城。");
			config.todayStage.length = 0; //清空昨天的
			config.reqStageList.length = 0; //清空昨天的
			checkTodayUpdate(function(){
				//refresTypeList();
				//saveConfig(1);
				//refreshStageList1(0);
			})
		}else
		{
			console.log("已经是今天的开放地图");
		}
	}

	refresh(); //刷新列表
}
var config={
	version:1, //储存当前设置结构版本
	updateDate:0, //储存今日开放地图上次更新时间
	todayStage:[], //储存当前开放的地图
	starStage:[], //储存收藏的地图
	reqStageList:[], //储存可以发表征求的地图信息（从网站stage.js中获得的）
	message:[],
};
var stageList=[]; //储存全部地图的数据
var mobile = false; //是否为手机版
var stageTestReg = "^/?s(?:tage)?/"; //用来测试href是不是地下城的

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
//得到标准时区的时间的函数
function getLocalTime(i)
{
	//参数i为时区值数字，比如北京为东八区则输进8,西5输入-5
	if (typeof i !== 'number') return;
	var d = new Date();
	//得到1970年一月一日到现在的秒数
	var len = d.getTime();
	//本地时间与GMT时间的时间偏移差
	var offset = d.getTimezoneOffset() * 60000;
	//得到现在的格林尼治时间
	var utcTime = len + offset;
	return new Date(utcTime + 3600000 * i);
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
	if (forId.length>0)
		label.setAttribute("for",forId);
	if (classname.length>0)
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
//一个地下城分类收藏
var StageCollection = function(name,detail = "",stage = [])
{
	var obj = {
		name:name,
		detail:detail,
		stages:stage
	}
	return obj;
}


function info(message)
{
	console.log("info:",message);
}
function loadConfig(configStr,stageListStr,reset = false)
{
	var bk = [true,true];
	var saConfig = JSON.parse(configStr);
	console.log("设置JSON>",saConfig)
	var saStageList = JSON.parse(stageListStr);
	console.log("地图数据>",saStageList)

	if (saConfig != null && typeof(saConfig) == "object")
	{
		if (reset)
		{
			config = saConfig;
		}
		else
			config = Object.assign(config, saConfig);
	}	
	else
	{
		console.error("配置损坏，使用默认配置");
		bk[0] = false;
	}
	if (saStageList != null && typeof(saStageList) == "object")
		stageList = saStageList.concat();
	else
	{
		console.error("完整地下城数据丢失，使用空配置");
		bk[1] = false;
	}
	return bk;
}
function saveConfig(type)
{
	if (type == undefined) type = 255;
	if (1 == (type & 1))
	{
		var configStr = JSON.stringify(config);
		GM_setValue("helper-config", configStr);
	}
	if (2 == (type & 2))
	{
		var stageListStr = JSON.stringify(stageList);
		GM_setValue("helper-stage-list", stageListStr);
	}
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
	var btnStage = stageBox.appendChild(new Button("点击选择","create-button-stage","点击显示地下城选择页面",function(){chooseStage()}));
	btnStage.id = "stage";
	var iptStage1 = stageBox.appendChild(new Input({type:"hidden",id:"stage1"}));
	var iptStage2 = stageBox.appendChild(new Input({type:"hidden",id:"stage2"}));

	var askBox = createBox.appendChild(document.createElement("div"));
	var lblAsk = askBox.appendChild(new Label("征求队伍","req"));
	var iptAsk = askBox.appendChild(new Input({type:"text",id:"req",maxLength:"50"}));

	createBox.appendChild(new Button("send","material-icons action-button action-button-send","发送征求",function(){
		if (iptRoomId.value.replace(/[^0-9]/g,"").length<8)
		{
			info("房间号输入错误");
			return;
		}else if (iptStage2.value.length<=0)
		{
			info("未选择地图");
			return;
		}
		var postObj = new PostDataObject({ //Post时发送的数据
			roomid: iptRoomId.value,
			//column1: "",
			column2: iptStage1.value,
			column3: iptStage2.value,
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

	var stageListPage = createBox.appendChild(document.createElement("div")); //地下城列表页面
	stageListPage.className = "stage-list-box page display-none";
	var stgList1Box = stageListPage.appendChild(document.createElement("div")); //类型
	stgList1Box.className =  "stage-list-1-box";
	var stgList1 = stgList1Box.appendChild(document.createElement("ul"));
	stgList1.className =  "stage-list-1";
	var stgList2Box = stageListPage.appendChild(document.createElement("div")); //主管卡
	stgList2Box.className =  "stage-list-2-box";
	var stgList2 = stgList2Box.appendChild(document.createElement("ul"));
	stgList2.className =  "stage-list-2";
	var stgList3Box = stageListPage.appendChild(document.createElement("div")); //子关卡
	stgList3Box.className =  "stage-list-3-box";
	var stgList3 = stgList3Box.appendChild(document.createElement("ul"));
	stgList3.className =  "stage-list-3";

	function chooseStage()
	{
		while(stgList1.childNodes.length>0)
		{
			delete stgList1.firstChild.remove(); //清空原来的，并从内存删除
		}
		while(stgList2.childNodes.length>0)
		{
			delete stgList2.firstChild.remove(); //清空原来的，并从内存删除
		}
		while(stgList3.childNodes.length>0)
		{
			delete stgList3.firstChild.remove(); //清空原来的，并从内存删除
		}
		
		var starStgC = new StageCollection("我的收藏","我收藏的地下城列表",config.starStage); //收藏类型值0
		starStgC.type = 0;
		var toDayStgCs = config.todayStage.map(function(item,index){ //今日地下城类型值10 + i
			var obj = Object.assign({type:index + 10}, item);
			return obj;
		})
		var reqStgCs = config.reqStageList.map(function(item,index){ //征求地下城类型值100 + i
			var obj = Object.assign({type:index + 100}, item);
			return obj;
		})

		allStgCs = [starStgC].concat(toDayStgCs,reqStgCs); //所有地下城放到一起

		allStgCs.forEach(function(item){
			var typeli = stgList1.appendChild(document.createElement("li"));
			var ipt = typeli.appendChild(new Input({type:"radio",name:"stage-type",id:"stage-type-" + item.type,value:item.type}));
			ipt.typeName = item.name;
			ipt.stages = item.stages;
			ipt.onclick = chooseStageType;
			var lbl = typeli.appendChild(new Label(item.name,ipt.id,"stage-type-label"));
		})

		stageListPage.classList.remove("display-none"); //最后显示出来
		document.querySelector("#stage-type-0").click();
	}
	function chooseStageType()
	{
		if (!this.checked) return;
		var typeName = this.typeName;
		var stages = this.stages;
		while(stgList2.childNodes.length>0)
		{
			delete stgList2.firstChild.remove(); //清空原来的，并从内存删除
		}
		while(stgList3.childNodes.length>0)
		{
			delete stgList3.firstChild.remove(); //清空原来的，并从内存删除
		}

		stages.forEach(function(item,index){
			var typeli = stgList2.appendChild(document.createElement("li"));
			var stg = stageList.filter(function(stg){return stg.name == item;})[0];
			if (stg)
			{
				var ipt = typeli.appendChild(new Input({type:"radio",name:"stage-1",id:"stage-1-" + index,value:index}));
				ipt.typeName = typeName;
				ipt.stage = stg;
				ipt.onclick = chooseMainStage;
				var lbl = typeli.appendChild(new Label(item,ipt.id,"stage-1-label"));
				//插图
				var ico = lbl.insertBefore(document.createElement("img"),lbl.firstChild);
				ico.className = "stage-icon";
				ico.src = stg.iconUrl;
			}else
			{ //没有数据的地图
				typeli.appendChild(document.createTextNode(item));
				typeli.className = "line-between";
			}
		})
		document.querySelector("#stage-1-0").click();
	}
	function chooseMainStage()
	{
		if (!this.checked) return;
		var typeName = this.typeName;
		var stage = this.stage;
		var subStages = this.stage.subStage;
		//var stgIndex = this.value;
		while(stgList3.childNodes.length>0)
		{
			delete stgList3.firstChild.remove(); //清空原来的，并从内存删除
		}

		subStages.forEach(function(item,index){
			var typeli = stgList3.appendChild(document.createElement("li"));
			var ipt = typeli.appendChild(new Input({type:"radio",name:"stage-2",id:"stage-2-" + index,value:index}));
			var lbl = typeli.appendChild(new Label(item.name,ipt.id,"stage-2-label"));
			//插图
			var ico = lbl.insertBefore(document.createElement("img"),lbl.firstChild);
			ico.className = "stage-icon";
			ico.src = item.iconUrl;

			ipt.onclick = function()
			{
				iptStage1.value = stage.name;
				iptStage2.value = item.name;
				while(btnStage.childNodes.length>0)
				{
					delete btnStage.firstChild.remove(); //清空选择按钮的内容
				}
				var stgI1 = btnStage.appendChild(document.createElement("span"));
				stgI1.className = "stage-chose-show-1";
				stgI1.appendChild(document.createTextNode(typeName));
				var stgI2 = btnStage.appendChild(document.createElement("span"));
				stgI2.className = "stage-chose-show-2";
				var ico2 = stgI2.appendChild(document.createElement("img"));
				ico2.className = "stage-icon";
				ico2.src = stage.iconUrl;
				stgI2.appendChild(document.createTextNode(stage.name));
				var stgI3 = btnStage.appendChild(document.createElement("span"));
				stgI3.className = "stage-chose-show-3";
				var ico3 = stgI3.appendChild(document.createElement("img"));
				ico3.className = "stage-icon";
				ico3.src = item.iconUrl;
				stgI3.appendChild(document.createTextNode(item.name));

				stageListPage.classList.add("display-none"); //最后显示出来
			}
		})
	}

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
}
function showPage(type)
{
	var pageArr = ["list","create","settings"];
	var mBox = document.querySelector("#main-box");
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
	showPage("list");
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


function checkTodayUpdate(callback)
{
	info("开始检查今日地下城");
	GM_xmlhttpRequest({
		method: "GET",
		//url: "desktop/", //主页
		url: "desktop.html", //主页
		onload: function(response1){
			GM_xmlhttpRequest({
				method: "GET",
				//url: "javascript/stage.js?" + new Date().getTime(), //主页
				url: "stage.js", //主页
				onload: function(response2){
					dealMainPage(response1);
					dealStageJS(response2);
					config.updateDate = getLocalTime(9).getTime();
					saveConfig(1);
					callback();
				},
				onerror: function(response) {
					info("获取可征求列表失败");
					console.error("获取可征求列表失败",response);
				}
			});
		},
		onerror: function(response) {
			info("获取主页地下城活动失败");
			console.error("获取主页地下城活动失败",response);
		}
	});
	//处理首页
	function dealMainPage(response)
	{

		var PageDOM = new DOMParser().parseFromString(response.responseText, "text/html");
		//紧急活动地下城表格
		var JinJiEvent = PageDOM.querySelector("#container>.item:nth-of-type(1)>table:nth-of-type(2)");
		//今天的降临
		if (JinJiEvent.rows[2] == undefined || JinJiEvent.rows[2].cells[1] == undefined) {info("😅未发现今日数据，是不是主页格式有问题？"); return;}
		
		config.todayStage.length = 0; //先清空

		var JiangLin = JinJiEvent.rows[2].cells[1].getElementsByTagName("a");
		var stgs1 = new StageCollection("每日降临","每天都会更换一次的降临神，保持24小时。");
		for (var ai=0;ai<JiangLin.length;ai++)
		{
			var link = JiangLin[ai];
			if (new RegExp(stageTestReg,"igm").test(link.getAttribute("href")) && stgs1.stages.indexOf(link.title)<0)
			{
				stgs1.stages.push(link.title);
			}
		}
		
		//今天的紧急
		var stgs2 = new StageCollection("紧急降临","每天分组出现的紧急本，每个组一小时。");
		for (var ri=1;ri<JinJiEvent.rows[2].cells[0].rowSpan;ri++)
		{
			var link = JinJiEvent.rows[2+ri].cells[0].querySelector("a");
			if (new RegExp(stageTestReg,"igm").test(link.getAttribute("href")) && stgs2.stages.indexOf(link.title)<0)
			{
				stgs2.stages.push(link.title);
			}
		}
	
		//长期活动地下城表格
		//第一行周回本
		var ChangQiEvent = PageDOM.querySelector("#container>.item:nth-of-type(2)>table:nth-of-type(2)");
		var stgs3 = new StageCollection("今日周回","每周分星期几固定出现的本，原耀日本。");
		var imgs = ChangQiEvent.rows[1].getElementsByTagName("img");
		for (var ii=0;ii<imgs.length;ii++)
		{
			var link = imgs[ii].parentElement;
			if (new RegExp(stageTestReg,"igm").test(link.getAttribute("href")) //是场景
				&& stgs3.stages.indexOf(link.title)<0
			)
			{
				stgs3.stages.push(link.title);
			}
		}

		//后面的活动
		var stgs4 = new StageCollection("长期活动","各种官方活动、合作活动的本。");
		for (var ri=4;ri<ChangQiEvent.rows.length;ri++)
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
					&& !/排名地下城/igm.test(typeStr) //不是排名地下城
					&& !/每天一場/igm.test(typeStr) //不是每天一场限定
					&& !/後開始/igm.test(endTime) //不是还没有开始的
					&& stgs4.stages.indexOf(link.title)<0
				)
				{
					stgs4.stages.push(link.title);
				}
			}
		}

		config.todayStage.push(
			stgs1,
			stgs2,
			stgs3,
			stgs4
		);

		info("今日有" + config.todayStage.reduce(function(previous, current){return previous + current.stages.length},0) + "个地下城");
		//console.log("今日地下城获取完毕",config);
	}
	// 处理征求地下城列表
	function dealStageJS(response)
	{
		var dataTree;
		var jsTxt = response.responseText;
		eval(jsTxt);

		var stgCs = dataTree.map(function(item){
			var stgC = new StageCollection(item.name);
			stgC.stages = item.child.map(function(item2){
				return item2.name;
			})
			return stgC;
		})
		config.reqStageList = stgCs;
	}
}