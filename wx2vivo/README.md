## quickstart

## 源码目录介绍
```
./js
├── base                                   // 定义游戏开发基础类
│   ├── animatoin.js                       // 帧动画的简易实现
│   ├── pool.js                            // 对象池的简易实现
│   └── sprite.js                          // 游戏基本元素精灵类
├── libs
│   ├── symbol.js                          // ES6 Symbol简易兼容
│   └── weapp-adapter.js                   // 小游戏适配器
├── npc
│   └── enemy.js                           // 敌机类
├── player
│   ├── bullet.js                          // 子弹类
│   └── index.js                           // 玩家类
├── runtime
│   ├── background.js                      // 背景类
│   ├── gameinfo.js                        // 用于展示分数和结算界面
│   └── music.js                           // 全局音效管理器
├── databus.js                             // 管控游戏状态
└── main.js                                // 游戏入口主函数

```

## 微信小游戏转成vivo小游戏的步骤说明

### 第一步
安装qgame-toolkit@alpha-weixin  
```javascript
npm install -g qgame-toolkit@alpha-weixin
```
  
### 第二步
新建一个空文件夹,假设命名为vivocontainer，假设您的微信小游戏项目文件夹为weixingame（请确认weixingame这个文件夹中有一个名为game.js的入口文件，如果没有，请找到你的微信小游戏的入口文件，并将其改为game.js）,将weixingame文件夹拷贝到该空文件夹vivocontainer中。  

### 第三步
进入vivocontainer/weixingame，打开CMD或者其他命令行工具，输入`qgame weixin` 并回车执行，如果成功，将会在vivocontainer文件夹下生成文件夹vivo-qgame，此时的vivo-qgame就是生成后的vivo小游戏的工程目录，您可以基于这个生成的目录做进一步的适配。
有了vivo小游戏的工程目录之后，后面就可以按照[vivo小游戏官方教程](https://minigame.vivo.com.cn/documents/#/lesson/base/start?id=%e5%ae%89%e8%a3%85%e4%be%9d%e8%b5%96)进行操作了。  

### 注意:如果要适配屏幕，请参考下面的代码进行适配
```javascript
if(ctx._setTransform){
  ctx._setTransform(screenWidth/375, 0, 0, screenHeight/667, 0, 0)
}
else if(ctx.scale){
  ctx.scale(screenWidth/375, screenHeight/667)
}
```

### 其他注意事项
如果你的游戏中使用了微信小游戏中的API，但是vivo小游戏对此API无法适配(比如支付功能)，您可以打开src/manifest.json中，找到logLevel，将其值改为"log",然后用数据线连接电脑，在电脑上CMD或者其他命令行工具中输入adb logcat -s jswrapper,会输出不支持的这些API，请根据提示手动修改。