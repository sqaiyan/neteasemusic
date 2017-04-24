import Vue from 'vue';
import Vuex from 'vuex';
import api from '@/api';
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    music: {al:{},ar:[{}]},
    playing: false,
    lrcObj:{lrc: [{}]},
    musicloading:true,
    playurl:'',
    musicload: false,
    playtype:1,
    shuffle:1,
    commentscount:0,
    list_am: [],
    index_am: 0,
    list_fm:[],
    index_fm:0,
    list_dj:[],
    index_dj:0,
    playtime: 0,
    likeall:"",
    user:{},
    uplaylist:[]
  },
  getters: {
	music: state => state.music,
	commentscount:state=>state.commentscount,
	lrcObj:state=>state.lrcObj,
	playtype:state=>state.playtype,
	playurl:state=>state.playurl,
    playing: state => state.playing,
    musicload: state => state.musicload,
    shuffle: state => state.shuffle,
    list_am: state => state.list_am,
    list_fm: state => state.list_fm,
    list_dj: state => state.list_dj,
    index_am: state => state.index_am,
    index_fm: state => state.index_fm,
    index_dj: state => state.index_dj,
    playtime: state => state.playtime,
    likeall: state => state.likeall,
    musicloading:state=>state.musicloading
  },
  mutations: {
	 setplaying(state,t) {
      state.playing =t;
      if(t){
    	  state.musicload=true;
    	  state.musicloading=false;
    	  document.getElementById('audio').play()
      }else{
    	  document.getElementById('audio').pause()
      }
    },
    setmusic (state,res) {
      if(res.id&&state.likeall.indexOf(res.id)>-1){
    	  res.heart=true
      }
      state.music = res;
    },
    waiting(state){
    	state.musicloading=true
    },
    setlrc(state,res){
    	console.log(res)
    	state.lrcObj=res;
    },
    commentscount(state,c){
    	state.commentscount=c;
    },
    resetmusic(state){//初始音乐
    	state.music= {al:{},ar:[{}]};
    	state.commentscount=0;
    	state.playtime=0;
    	state.playtime=0
    	state.lrcObj = {
				lrc: [{}]
		};
    	state.musicloading=true;
    	//dispatch("d")
    },
    setmusic_url (state, url) {
    	state.playurl=url
    },
    list_remove (state, index) {
    },
    playtimechange (state, time) {
      state.playtime = time*1000
    },
    setplaytype(state,type){
    	state.playtype=type
    },
    shuffle (state, type) {
      state.shuffle = type
    },
    setmusicload (state,type) {
      state.musicload = type
    },
    setplaylist(state,arr){
    	state.playtype==1?(state.list_am=arr):(state.list_dj=arr);
    },
    playindex(state,i){
    	if(state.playtype==1){
    		state.index_am=i;
    	}else{
    		state.index_dj=i;
    	}
    },
    next (state) { // 播放下一曲
      console.log("next")
      state.playing=false
      if(state.playtype==1){
    	  if(!state.list_am.length)return;
    	  state.index_am++;
    	  state.index_am=state.index_am>=state.list_am.length?0:state.index_am;
    	  state.music=state.list_am[state.index_am];
      }
    },
    
    prev (state) { // 播放上一曲
    	 console.log("prev")
         state.playing=false
         if(state.playtype==1){
       	  if(!state.list_am.length)return;
       	  state.index_am--;
       	  state.index_am=state.index_am<0?state.list_am.length-1:state.index_am;
       	  console.log(state.index_am,state.list_am[state.index_am])
       	  state.music=state.list_am[state.index_am];
         }
    },
    setshuffle(state){
    	if(state.playtype==1){
    		
    	}else{
    		
    	}
    },
    next_fm(state){
    	state.index_fm++;
    	if(state.index_fm>state.list_fm.length){
    	}else{
    		state.music=state.list_fm[state.index_fm]
    	}
    },
    setfm({state,dispatch},fm){
    	state.index_fm=0;
    	state.list_fm=fm;
    	commit("setmusic",fm[0]);
    	dispatch("only_murl")
    },
  },
  actions: {
	d(){
		console.log("commit to dispatch")
	},
	next_fm({commit}){
		api.fm().then(res=>{
			commit("setfm",res.data.data);
		})
	  },
	async getmusic({commit}, id) {
		// 歌曲详情
		var res=await api.music_detail(id);
		commit("setmusic",res.data.songs[0]||{});
    },
    async getmusic_url({commit, dispatch,state}, id){
    	// 获取歌曲详情和播放地址
    	await dispatch('getmusic',id) 
    	api.music_url(state.music.id).then(res=>{
    		commit('setmusic_url',res.data.data[0].url);
    	})
    },
    only_murl({commit,state}){// 获取歌曲播放地址
    	api.music_url(state.music.id).then(res=>{
    		commit('setmusic_url',res.data.data[0].url);
    	})
    },
    async getlike({commit,state}){// 获取红心歌曲
    	api.likeall().then(res=>{
    		state.likeall=(res.data.ids||[]).join(",")
    	})
    },
    getuplaylist(state){//用户创建的歌单
    	if(!state.user.id)return;
    	api.userplaylist().then(res=>{
    		state.uplaylist=res.data.playlist.filter((i)=>{i.userId==state.user})
    	})
    }
  }
})
export default store

