# 智龙迷城战友系统及资讯网协力页面辅助器
访问[智龙迷城战友系统及资讯网 pad.skyozora.com](http://pad.skyozora.com/)

协力列表页面添加体力显示，登陆房间页面，可以快速添加指定的地下城和短语  
![预览图](https://raw.githubusercontent.com/Mapaler/pad.skyozora.com-Multiplay-Helper/master/images/preview.png)

![手机预览图](https://raw.githubusercontent.com/Mapaler/pad.skyozora.com-Multiplay-Helper/master/images/preview-android.png)

## 使用方法
1. 安装用户脚本扩展，用于执行脚本。
   * 桌面电脑
     * [![](https://www.mozilla.org/media/img/firefox/favicon.dc6635050bf5.ico)FireFox](http://www.firefox.com) 安装 [![](https://github.com/greasemonkey/greasemonkey/raw/master/skin/icon32.png)GreaseMonkey](https://addons.mozilla.org/firefox/addon/greasemonkey/)(油猴) 扩展。
     * ![](http://www.chromium.org/_/rsrc/1438879449147/config/customLogo.gif)Chromium 系安装 [![](https://addons.cdn.mozilla.net/user-media/addon_icons/683/683490-64.png?modified=1463757971)Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=zh-CN) 扩展。
   * ![](https://www.android.com/static/2016/img/logo-android-green_1x.png)安卓手机（其他系统请自己想办法）
     * [![](https://www.mozilla.org/media/img/firefox/favicon.dc6635050bf5.ico)安卓火狐](https://www.mozilla.org/zh-CN/firefox/android/) 安装 [![](https://addons.cdn.mozilla.net/user-media/addon_icons/597/597912-64.png?modified=1506370821)USI](https://addons.mozilla.org/zh-CN/android/addon/userunified-script-injector/) 扩展。
     * 安装 [![](https://lh3.ggpht.com/s4QefQLlT37lHeDcnxPkw66VMciHW0I2KPHaPRBkCzlYm8fBjimDoASWjU-HbjrfP9g=w48)Tampermonkey](https://play.google.com/store/apps/details?id=net.biniok.tampermonkey) 应用。  
     （但是我试了，协力网没法登陆，所以还是推荐用安卓火狐加USI扩展）
2. 到 Greasy Fork [安装脚本](https://greasyfork.org/scripts/33628)，油猴可以自动更新脚本。  
   也可以直接在本项目直接[访问源码](https://github.com/Mapaler/pad.skyozora.com-Multiplay-Helper/raw/master/pad.skyozora.com-Multiplay-Helper.user.js)安装。
3. 进入[登陆房间页面](http://pad.skyozora.com/multiplay/register/)享受便捷。
4. 点击“导入/导出设置&地下城列表”按钮，并在弹出框内地下城列表，**先删除原先的所有内容**。然后填入[地下城列表数据](https://raw.githubusercontent.com/Mapaler/pad.skyozora.com-Multiplay-Helper/master/stage-list.json)文件内的所有文本，并导入。  
   ![导入设置](https://raw.githubusercontent.com/Mapaler/pad.skyozora.com-Multiplay-Helper/master/images/ioconfig.png)  
   （如果不做这一步，也可以自行“获取完整地下城数据”，但是这个过程极其缓慢）  
5. 点击“检查今日开放地下城”，获取今天开放的地下城。

## Tips
* 原始地下城列表旁的“⭐️”按钮的作用是将当前选中地下城添加到收藏。而“输入地下城收藏”按钮的区别是需要输入地下城名称。
* 点击今日列表中的地下城即可让地下城下拉框出现那个地下城，然后和以往一样的发布征求即可。
* 右边的“+”、“-”按钮是加减短语的，点击添加的短语会直接添加到上方的征求信息光标处。
* “检查今日开放地下城”用于检查每天开放的降临、活动。
* “获取完整地下城数据”是获取地下城数据的更新，默认为增量更新，所以如果一开始导入了设置，那么就不会花很长的时间，否则会花很久。
* “导入/导出设置&地下城列表”里面左边是这个脚本的设置（包含今日地下城和收藏列表），右边是所有地下城的信息。可以把文本保存下来的方式来复制设置（不要用GBK编码，否则会出错），不需要导入设置的时候，点击“关闭”即可。