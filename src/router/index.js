import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
export default new Router({
    routes: [
        { path: '/search',
            name: 'search',
            component: require("@/pages/search")
        },
        {
            path: '/simi/:id',
            name: 'simi',
            component: require("@/pages/simi")
        },
        {
            path: '/sortmv',
            name: 'sortmv'
        },{
            path: '/mv/:id',
            name: 'mv',
            component: require("@/pages/mv")
        }, {
            path: '/comment/:id',
            name: 'comment',
            component: require("@/pages/comments")
        },{
            path: '/login',
            name: 'login',
            component: require("@/pages/login")
        }, {
            path: '/album/:id',
            name: 'album',
            component: require("@/pages/album")
        }, {
            path: '/artist/:id',
            name: 'artist',
            component: require("@/pages/artist")
        },{
            path: '/user/:id',
            name: 'user',
            component: require("@/pages/user")
        },{
            path: '/radio/:id',
            name: 'radio',
            component: require("@/pages/radio")
        },
        {
            path: '/playlist/:id',
            name: 'playlist',
            component: require("@/pages/playlist")
        },
        {
        	path:'/me',
        	name:'me',
        	component:require("@/pages/my/my")
        },
        {
        	path:'/hqplaylist',
        	name:'hqplaylist',
        	component:require("@/pages/hqplaylist")
        },
        {
        	path:'/recsong',
        	name:'recsong',
        	component:require("@/pages/recsongs")
        },
        {path:'/cloud',
	          name:'cloud',component:require("@/pages/my/cloud")},
        {
            path: '/play',
            component: require("@/pages/play/play"),
            children: [{
                path: "/playing/:id",
                name: 'playing',
                component: require("@/pages/play/playing"),
                
            }, {
                path: 'fm',
                name: 'fm',
                component: require("@/pages/play/fm")
            }, {
                path: '/program/:id',
                name: 'program',
                component: require("@/pages/play/program")
            }]
        },{
            path: '/home',
            name: 'home',
            component: require("@/pages/home/home"),
            children: [{
                path: "index",
                name: 'index',
                component: require("@/pages/home/index/index"),
                children: [{
                    path: 'find',
                    component: require("@/pages/home/index/find")
                }, {
                    path: 'playlist',
                    component: require("@/pages/home/index/playlist")
                }, {
                    path: 'djlist',
                    component: require("@/pages/home/index/djlist")
                }, {
                    path: 'sort',
                    component: require("@/pages/home/index/sort")
                }]
            }
              ]
        }, {
            path: '*',
            redirect: '/home/index/find'
        }
    ]
})