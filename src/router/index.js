import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/search',
            name: 'search',
            component: require("@/pages/search")
        },
        {
            path: '/simi/:id',
            name: 'simi',
            component: require("@/pages/simi")
        },
        {
            path: '/user/:id',
            name: 'user',
        },
        {
            path: '/sortmv',
            name: 'sortmv'
        }, {
            path: '/playlist/:id',
            name: 'playlist',
            component: require("@/pages/playlist")
        }, {
            path: '/album/:id',
            name: 'album',
            component: require("@/pages/album")
        }, {
            path: '/mv/:id',
            name: 'mv'
        }, {
            path: '/comment/:id',
            name: 'comment',
            component: require("@/pages/comments")
        }, {
            path: '/artist/:id',
            name: 'artist',
            component: require("@/pages/artist")
        }, {
            path: '/login',
            name: 'login',
            component: require("@/pages/login")
        }, 
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
            }, {
                path: 'recsongs',
                name: 'recsongs'
            }]
        }, {
            path: '*',
            redirect: '/home/index/find'
        }
    ]
})