// ==UserScript==
// @name        主动技能说明
// @namespace   http://www.mapaler.com/
// @include     http://pad.skyozora.com/pets/*
// @version     1.2.0
// @grant       none
// ==/UserScript==

var jxs = [{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-01_zpsxxwacmws.png","name":"HP強化","cname":"HP+"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-02_zpsy1jchamv.png","name":"攻撃強化","cname":"攻击+"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-03_zpsak0tuqfw.png","name":"回復強化","cname":"回复+"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-04_zps6vn4a1r2.png","name":"火ダメージ軽減","cname":"火盾"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-05_zpsk7krbzfw.png","name":"水ダメージ軽減","cname":"水盾"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-06_zpsg3uiml1b.png","name":"木ダメージ軽減","cname":"木盾"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-07_zpssj2kpgm4.png","name":"光ダメージ軽減","cname":"光盾"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-08_zpsxmjgonyv.png","name":"闇ダメージ軽減","cname":"暗盾"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-09_zpscmpb1a9u.png","name":"自動回復","cname":"自回"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-10_zpsgnawh4aw.png","name":"バインド耐性","cname":"防封"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-11_zpstzezynbd.png","name":"暗闇耐性","cname":"防暗"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-12_zpstrlqs0zm.png","name":"お邪魔耐性","cname":"防废"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-13_zpsgmoqh6yh.png","name":"毒耐性","cname":"防毒"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-14_zpspgajml6y.png","name":"火ドロップ強化","cname":"火+"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-15_zpsiqnomwjo.png","name":"水ドロップ強化","cname":"水+"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-16_zps96jzpova.png","name":"木ドロップ強化","cname":"木+"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-17_zpsreclhahj.png","name":"光ドロップ強化","cname":"光+"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-18_zpscwksy2ka.png","name":"闇ドロップ強化","cname":"暗+"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-19_zpstsfhgt1g.png","name":"操作時間延長","cname":"手指"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-20_zpspo6ssykv.png","name":"バインド回復","cname":"心解"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-21_zps3rfxonew.png","name":"スキルブースト","cname":"SB"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-22_zpsr51wxpxg.png","name":"火属性強化","cname":"火横"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-23_zpsnpbjjiml.png","name":"水属性強化","cname":"水横"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-24_zpsplzefe22.png","name":"木属性強化","cname":"木横"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-25_zpsbstitgpp.png","name":"光属性強化","cname":"光横"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-26_zps6464lef2.png","name":"闇属性強化","cname":"暗横"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-27_zpsekmypn6z.png","name":"2体攻撃","cname":"U"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-28_zpscdmq9kyw.png","name":"封印耐性","cname":"SX"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-29_zpsc4ab42lx.png","name":"回復ドロップ強化","cname":"心+"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-30_zpsgze5vdtg.png","name":"マルチブースト","cname":"协力"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-31_zpsgefpdpof.png","name":"ドラゴンキラー","cname":"龙杀"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-32_zpsozuiwcrf.png","name":"神キラー","cname":"神杀"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-33_zpsp6tq5egi.png","name":"悪魔キラー","cname":"恶魔杀"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-34_zps9qppy6u3.png","name":"マシンキラー","cname":"机杀"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-35_zps7yp5sa7p.png","name":"バランスキラー","cname":"平衡杀"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-36_zpsdaddifpz.png","name":"攻撃キラー","cname":"攻击杀"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-37_zps0vbbzf6g.png","name":"体力キラー","cname":"体力杀"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-38_zpsvsnuvszc.png","name":"回復キラー","cname":"回复杀"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-39_zpskswn9txf.png","name":"進化用キラー","cname":"进化杀"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-40_zpsoh0s208i.png","name":"能力覚醒用キラー","cname":"觉醒杀"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-41_zpsrkywclzi.png","name":"強化合成用キラー","cname":"强化杀"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-42_zpsecsdwttd.png","name":"売却用キラー","cname":"卖钱杀"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-43_zpsclamisko.png","name":"コンボ強化","cname":"7c"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-44_zpsaow1ee5r.png","name":"ガードブレイク","cname":"5色破防"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-45_zpstetgt7jw.png","name":"追加攻撃","cname":"心追"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-46_zps5ukjqltw.png","name":"チームHP強化","cname":"全体HP强化"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-47_zpsukbaaqf1.png","name":"チーム回復強化","cname":"全体回复强化"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-48_zpsmbnqtfdz.png","name":"ダメージ無効貫通","cname":"破无效"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-49_zpsdm4onmue.png","name":"覚醒アシスト","cname":"武器觉醒"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-50_zpstrbv2fmv.png","name":"超追加攻撃","cname":"3x3心追"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-51_zpsettxry2b.png","name":"スキルチャージ","cname":"5色溜"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-52_zps0ty3faav.png","name":"バインド耐性＋","cname":"大防封"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-53_zpse11raatm.png","name":"操作時間延長＋","cname":"大手指"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-54_zpsudvrwxtr.png","name":"雲耐性","cname":"防云"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-55_zpsf65qotza.png","name":"操作不可耐性","cname":"防封条"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-56_zps0myhew7j.png","name":"スキルブースト＋","cname":"大SB"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-57_zpswomcefzz.png","name":"HP80％以上強化","cname":"8血以上强化"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-58_zpsc7luzojm.png","name":"HP50％以下強化","cname":"半血以下强化"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-59_zpsqpybuzlz.png","name":"L字消し軽減","cname":"L盾"},{"icon":"http://i1296.photobucket.com/albums/ag18/skyozora/skill_icon/skill-60_zpstbqdrxc8.png","name":"L字消し攻撃","cname":"L解锁"}];

var content = document.querySelector("#wrapper>table:nth-last-of-type(2)>tbody>tr:nth-of-type(2)>td");
var moster = content.querySelector("table:nth-of-type(2)"); //怪物名片
var monsterNameCard = moster.rows[0].cells[0].querySelector("table").rows[0].cells[1];
var monsterId = parseInt(/No\.(\d+)/ig.exec(monsterNameCard.querySelector("h3").textContent)[1]);
var monsterName = monsterNameCard.querySelector("h2").textContent; //怪物名

var skill = content.querySelector("table:nth-of-type(5)"); //技能
var skillInfoLine = skill.rows[0];
var skillName = skillInfoLine.cells[0].querySelector("span").textContent; //技能名称
var skillCDo = parseInt(skillInfoLine.cells[2].textContent); //技能原始CD
var skillCDm = parseInt(skillInfoLine.cells[4].textContent); //技能最短CD
var skillLevelMax = skillCDo - skillCDm + 1; //技能最大等级

var skillDetail = skill.rows[1].cells[0]; //技能详细的内容
var skillText = [];
var sTTemp = []; //储存目前临时的文字
var doms = skillDetail.childNodes;
for (var di=0;di<doms.length;di++)
{
	var dom = doms[di];
	checkDom:
	switch(dom.nodeName)
	{
		case "#text":
			var strTemp = dom.nodeValue;
			jxs.forEach(function(jx){ //替换掉所有的觉醒日文名
				strTemp = strTemp.replace(jx.name,"");
			})
			strTemp = strTemp.replace("闇","暗") //替换掉前后空格
			strTemp = strTemp.replace("攻撃","攻击") //替换掉前后空格
			strTemp = strTemp.replace(/(^\s*|\s*$)/igm,"") //替换掉前后空格
			sTTemp.push(strTemp);
			break;
		case "BR":
			skillText.push(sTTemp.join(""));
			sTTemp = [];
			break;
		case "IMG":
			for (var ji=0;ji<jxs.length;ji++)
			{
				var jx = jxs[ji];
				if (dom.getAttribute("src") == jx.icon)
				{
					sTTemp.push(jx.cname); //图片替换成中文
					break checkDom;
				}
			}
			switch(dom.getAttribute("src"))
			{
				case "images/change.gif":
					sTTemp.push("变为");
					break;
				case "images/drops/Fire.png":
					sTTemp.push("火珠");
					break;
				case "images/drops/Fire+.png":
					sTTemp.push("强化火珠");
					break;
				case "images/drops/Water.png":
					sTTemp.push("水珠");
					break;
				case "images/drops/Water+.png":
					sTTemp.push("强化水珠");
					break;
				case "images/drops/Wood.png":
					sTTemp.push("木珠");
					break;
				case "images/drops/Wood+.png":
					sTTemp.push("强化木珠");
					break;
				case "images/drops/Light.png":
					sTTemp.push("光珠");
					break;
				case "images/drops/Light+.png":
					sTTemp.push("强化光珠");
					break;
				case "images/drops/Dark.png":
					sTTemp.push("暗珠");
					break;
				case "images/drops/Dark+.png":
					sTTemp.push("强化暗珠");
					break;
				case "images/drops/Heart.png":
					sTTemp.push("心珠");
					break;
				case "images/drops/Heart+.png":
					sTTemp.push("强化心珠");
					break;
				case "images/drops/Dead.png":
					sTTemp.push("废珠");
					break;
				case "images/drops/Poison.png":
					sTTemp.push("毒珠");
					break;
				case "images/drops/Poison+.png":
					sTTemp.push("剧毒");
					break;
				default:
					sTTemp.push("未知的图片路径");
					console.error("未知的图片路径",dom);
			}
			break;
		default:
			sTTemp.push("未知的TAG");
			console.error("未知的TAG",dom);
	}
}
if (sTTemp.length>0)
{
	skillText.push(sTTemp.join(""));
	sTTemp = [];
}

var outText = ["No." + monsterId + " " + monsterName,"主动技能:" + skillName,"最小冷却 " + skillCDm + " (Lv" + skillLevelMax + ")"].concat(skillText);
var newRow = skill.insertRow();
var newCell = newRow.insertCell();
var copyBox = newCell.appendChild(document.createElement("div"));
copyBox.id = "copySkill";
copyBox.title = "点击复制";
copyBox.style.cursor = "pointer";
copyBox.onclick = function(){
	copyArticle(this);
}
outText.forEach(function(str,index,allTxt){
	copyBox.appendChild(document.createTextNode(str));
	if (index < allTxt.length)
	{
		copyBox.appendChild(document.createElement("br"));
	}
})

console.log(outText.join("\n"));



// 复制文字的程序
function copyArticle(element) {
	const range = document.createRange();
	range.selectNode(element);

	const selection = window.getSelection();
	if(selection.rangeCount > 0) selection.removeAllRanges();
	selection.addRange(range);
	document.execCommand('copy');
}