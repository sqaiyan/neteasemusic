#价值￥399。 Vue全家桶高仿网易云音乐,最像最全的版本。还附赠微信小程序版

>网易忠粉，去年小程序刚出来时候开始用小程序写过一版高仿ios版网易云音乐。一直在踩坑，基本完成后开始考虑用vue实现(其实是懒，想脱坑)。vue之前仅限于活动页使用，全家桶没用过，所以这次也是边学边做，很多东西来回重写了好多次。

##先来个预览图，比较大。[点这里](http://7vik7b.com1.z0.glb.clouddn.com/20170612_164110.gif)，![点这里](http://7vik7b.com1.z0.glb.clouddn.com/20170612_164110.gif)

###为啥不放在线地址？
其实是有在线地址的，实在懒得自己部署可以问我要地址看哈。因为是用爬虫在线访问网易的接口，很多接口都是有频率限制的，稍微频繁点就被暂停访问，像登录接口直接封ip，然后我自己也没法愉快的玩耍，项目里最大的bug就是没人做任何的失败处理，然后你们看到的可能就是一坨屎的页面了。

###哪里价值399？
慕课网有个399的vue课程也是做的音乐类的webapp，是滴滴的一个大牛开的课程。我这完全是标题党哈，虽然代码质量比不过人家，但咱这也免费是不，3个star足矣。所以开始看之前是不是先star一下？


***

##技术栈

1. Vue全家桶(vue,vue-router,vuex)
2. axios(http)
3. mint-ui(滚动加载)+移植原来小程序版的css
4. node(接口服务)，接口整理的累死，[地址在这里](https://github.com/sqaiyan/netmusic-node)，欢迎star!

##遇到的难点
1. 样式不像写小程序那么爽了哈，所以移植过来又得改动一堆。
2. router是边学边做，整体用了keep-alive，好像是会卡？
3. vuex也是边学边做，重构几次了。小程序里面没有状态管理，所以写起来也很坑。稍微大点的项目没有状态管理简直没法写了。
4. 还是状态管理的问题，看过其他同学写的一些vue仿的网易云，功能比较少。我这个要播放单曲，FM,电台节目，一个audio，3种类型，反复改好几次
5. 有的页面逻辑比较复杂，多。写起来哼哧哼哧，比如搜索页面，播放页面

##部署
先下载node后端代码，[这里下载](https://github.com/sqaiyan/netmusic-node)启动下就ok，正常启动本项目即可

##关于bug
几乎所有的异常都没有考虑，所以嘛自己排错吧，如果找我也排不掉就unstar吧。手机测试不完全。
边学编写的东西难免很多地方逻辑不顺，性能地下。欢迎大牛们提建议。

##最后小程序版在[这里](https://github.com/sqaiyan/netmusic-app),欢迎star,当初写了一句准备重构的，结果骗到一个提iusse的同学，呵呵

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

