import Vue from 'vue'
import App from './App'
import router from './router'
import Mint from 'mint-ui';
import 'mint-ui/lib/style.css'
import '@/assets/layout.css'
import store from '@/store/store'
import axios from 'axios'
import api from "@/api"
axios.defaults.timeout = 5000
axios.defaults.baseURL = 'http://localhost:3000/v1/';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.interceptors.request.use(function(config) { // 这里的config包含每次请求的内容
    var url = config.url;
    var c = localStorage.getItem("cookie")||'123';
    c = "cookie=" + c
    if (url.indexOf('?') > -1) {
        url += "&" + c
    } else {
        url += "?" + c
    }
    config.url = url;
    return config;
}, function(err) {
    return Promise.reject(err);
});
axios.interceptors.response.use((res) => {
    if (res.data.code === 301) {
    	console.log('未登录')
    }
    else if (res.data.code !== 200) {
        console.log('返回数据不正常')
    }
    return res
}, (error) => {
    console.log('promise error:' + error)
    return Promise.reject(error)
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(Mint);
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App },
    async mounted() {
    	this.$store.commit("localuser");
    	await this.$store.dispatch('getlike');
    }
})