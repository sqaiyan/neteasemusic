import Vue from 'vue'
import Router from 'vue-router';
Vue.use(Router)
var router = new Router({
	routes: [{
			path: '/search',
			name: 'search',
			component: resolve => require(['@/pages/search'], resolve)
		},
		{
			path: '/simi/:id',
			name: 'simi',
			component: resolve => require(['@/pages/simi'], resolve)
		},
		{
			path: '/sortmv',
			name: 'sortmv'
		}, {
			path: '/mv/:id',
			name: 'mv',
			meta: {
				isKeepAlive: false
			},
			component: resolve => require(['@/pages/mv'], resolve)
		}, {
			path: '/topic/detail/:id',
			name: 'topicDetail',
			component: resolve => require(['@/pages/topicDetail'], resolve)
		}, {
			path: '/comment/:id',
			name: 'comment',
			meta: {
				isKeepAlive: false
			},
			component: resolve => require(['@/pages/comments'], resolve)
		}, {
			path: '/login',
			name: 'login',
			meta: {
				isKeepAlive: false
			},
			component: resolve => require(['@/pages/login'], resolve)
		}, {
			path: '/album/:id',
			name: 'album',
			component: resolve => require(['@/pages/album'], resolve)
		}, {
			path: '/artist/:id',
			name: 'artist',
			component: resolve => require(['@/pages/artist'], resolve)
		}, {
			path: '/user/:id',
			name: 'user',
			component: resolve => require(['@/pages/user'], resolve)
		}, {
			path: '/radio/:id',
			name: 'radio',
			component: resolve => require(['@/pages/radio'], resolve)
		},
		{
			path: '/playlist/:id',
			name: 'playlist',
			component: resolve => require(['@/pages/playlist'], resolve)
		},
		{
			path: '/video/:id',
			name: 'video',
			component: resolve => require(['@/pages/video'], resolve)
		},
		{
			path: '/me',
			name: 'me',
			meta: {
				'auth': true
			},
			component: resolve => require(['@/pages/my/my'], resolve)
		},
		{
			path: '/favradio',
			name: 'favradio',
			component: resolve => require(['@/pages/my/favradio'], resolve)
		},
		{
			path: '/sublist',
			name: 'sublist',
			component: resolve => require(['@/pages/sublist'], resolve)
		},
		{
			path: '/hqplaylist',
			name: 'hqplaylist',
			component: resolve => require(['@/pages/hqplaylist'], resolve)
		},
		{
			path: '/recsong',
			name: 'recsong',
			meta: {
				'auth': true
			},
			component: resolve => require(['@/pages/recsongs'], resolve)
		},
		{
			path: '/cloud',
			name: 'cloud',
			component: resolve => require(['@/pages/my/cloud'], resolve)
		},
		{
			path: '/record/:uid',
			name: 'record',
			component: resolve => require(['@/pages/record'], resolve)
		},
		{
			path: '/play',
			component: resolve => require(['@/pages/play/play'], resolve),
			children: [{
				path: "/playing/:id",
				name: 'playing',
				component: resolve => require(['@/pages/play/playing'], resolve),

			}, {
				path: 'fm',
				name: 'fm',
				component: resolve => require(['@/pages/play/fm'], resolve)
			}, {
				path: '/program/:id',
				name: 'program',
				component: resolve => require(['@/pages/play/program'], resolve)
			}]
		}, {
			path: '/home',
			name: 'home',
			component: resolve => require(['@/pages/home/home'], resolve),
			children: [{
				path: "index",
				name: 'index',
				component: resolve => require(['@/pages/home/index/index'], resolve),
				children: [{
					path: 'find',
					component: resolve => require(['@/pages/home/index/find'], resolve)
				}, {
					path: 'playlist',
					component: resolve => require(['@/pages/home/index/playlist'], resolve)
				}, {
					path: 'djlist',
					component: resolve => require(['@/pages/home/index/djlist'], resolve)
				}, {
					path: 'sort',
					component: resolve => require(['@/pages/home/index/sort'], resolve)
				}]
			}]
		}, {
			path: '*',
			redirect: '/home/index/find'
		}
	]
});

router.beforeEach((to, from, next) => {
	let user = JSON.parse(localStorage.getItem("user"))
	if(to.meta.auth && !logined && !user.account) {
		console.error("需先登录")
		next(false);
		router.push({
			name: 'login'
		});
	} else {
		next();
	}

});
export default router;