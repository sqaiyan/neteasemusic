# Vue全家桶高仿网易云音乐
功能最多，按照ios客户端高仿，还有小程序版嘞

>网易忠粉，去年小程序刚出来时候开始用小程序写过一版高仿ios版网易云音乐。一直在踩坑，基本完成后开始考虑用vue实现(其实是懒，想脱坑)。vue之前仅限于活动页使用，全家桶没用过，所以这次也是边学边做，很多东西来回重写了好多次。

## 技术栈
1. Vue全家桶(vue,vue-router,vuex)
2. axios(http)
3. mint-ui+移植原来小程序版的css
4. node(接口服务)，[地址在这里](https://github.com/sqaiyan/netmusic-node)
5. 图片资源来自ios端解压缩文件

## 项目地址, 欢迎 star，issue
 vps ip已经被封 无法在线预览
1. [Vue版](https://github.com/sqaiyan/neteasemusic) ：https://github.com/sqaiyan/neteasemusic
2. [小程序版](https://github.com/sqaiyan/netmusic-app) ：https://github.com/sqaiyan/netmusic-app
3. [node后端](https://github.com/sqaiyan/netmusic-node) ：https://github.com/sqaiyan/netmusic-node


## 部署

### 后端项目

``` bash
# 克隆node后端代码到本地
git clone git@github.com:sqaiyan/netmusic-node.git

cd netmusic-node 

# install dependencies
npm install 

# serve at localhost:3000
node app.js
```

### 前台项目

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

## 预览图[gif版比较大](http://7vik7b.com1.z0.glb.clouddn.com/20170612_164110.gif)、
![2](https://github.com/sqaiyan/neteasemusic/raw/master/screenshot/1.png)
![2](https://github.com/sqaiyan/neteasemusic/raw/master/screenshot/2.png)
![2](https://github.com/sqaiyan/neteasemusic/raw/master/screenshot/3.png)
![2](https://github.com/sqaiyan/neteasemusic/raw/master/screenshot/4.png)
![2](https://github.com/sqaiyan/neteasemusic/raw/master/screenshot/5.png)
![2](https://github.com/sqaiyan/neteasemusic/raw/master/screenshot/6.png)
![2](https://github.com/sqaiyan/neteasemusic/raw/master/screenshot/7.png)
![2](https://github.com/sqaiyan/neteasemusic/raw/master/screenshot/8.png)
![2](https://github.com/sqaiyan/neteasemusic/raw/master/screenshot/9.png)
![2](https://github.com/sqaiyan/neteasemusic/raw/master/screenshot/10.png)
![2](https://github.com/sqaiyan/neteasemusic/raw/master/screenshot/11.png)
![2](https://github.com/sqaiyan/neteasemusic/raw/master/screenshot/12.png)
![2](https://github.com/sqaiyan/neteasemusic/raw/master/screenshot/13.png)
![2](https://github.com/sqaiyan/neteasemusic/raw/master/screenshot/14.png)
![2](https://github.com/sqaiyan/neteasemusic/raw/master/screenshot/15.png)

[小程序版预览图gif](http://7vik7b.com1.z0.glb.clouddn.com/20170308_112339.gif)

## 已完成功能
1. 首页（个性推荐，分类歌单，电台推荐，热门排行
2. 搜索（hot ,history ,suggest ,multimatch; 单曲，歌单，歌手，mv等。。。
3. 详情单页类（歌单，歌手，电台，专辑，评论，用户，相似推荐，每日推荐
4. 播放页（单曲，FM，节目：上下一曲，播放模式[单曲，随机，顺序]，单曲喜欢，单曲收藏到歌单，fm trash，快进快退，歌词，播放列表
5. 我的（登录，云盘，收藏

## 待完成功能（根据api破解情况
1. 评论（操作类
2. 动态
3. 音质切换
4. 歌词翻译
....

## 存在的问题或bug
1. 单曲播放进入评论等前进页面，单曲播放完自动播放下一曲后页面回退回播放页面 路由自动切换不了，会播放上一曲，逻辑这块没理顺

2. 目前的api基本都是根据官网版扒下来的，git上发布的一些也基本都是这样，客户端接口用的是最新版的 没有能力扒出来。存在问题是banner接口请求到的是老接口数据，已经不维护了的数据 


### 如果本例对您学习Vue有帮助，欢迎赏杯奶茶喝
<img src="https://github.com/sqaiyan/NeteaseMusicWxMiniApp/raw/master/screenshot/zfb.jpg" width="220"/><img src="https://github.com/sqaiyan/NeteaseMusicWxMiniApp/raw/master/screenshot/wx.jpg" width="220"/>




