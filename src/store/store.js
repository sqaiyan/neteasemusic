import Vue from 'vue';
import Vuex from 'vuex';
import api from '@/api';
Vue.use(Vuex);
import u from "@/utils"
const store = new Vuex.Store({
  state: {
    music: {al:{},ar:[{}],artists:[{}],album:{}},
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
    user:JSON.parse(localStorage.getItem('user'))||{},
    bgmchange:false,
    uplaylist:[]
  },
  getters: {
	music: state => state.music,
	commentscount:state=>state.commentscount,
	lrcObj:state=>state.lrcObj,
	bgmchange:state=>state.bgmchange,
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
    uplaylist:state=>state.uplaylist,
    musicloading:state=>state.musicloading
  },
  mutations: {
	 localuser(state,user){
		 state.user=user?user:(JSON.parse(localStorage.getItem('user'))||{})
	 },
	  setbgmchange(state,t){
		 state.bgmchange=t;
	 },
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
      res.heart=false;
      if(res.id&&state.likeall.indexOf(res.id)>-1){
    	  res.heart=true
      }
      state.music = res;
    },
    waiting(state){
    	state.musicloading=true
    },
    setlrc(state,res){
    	state.lrcObj=res;
    },
    commentscount(state,c){
    	state.commentscount=c;
    },
    resetmusic(state){//初始音乐
    	document.getElementById('audio').pause()
    	state.commentscount=0;
    	state.playurl=""
    	state.playtime=0;
    	state.playing=false;
    	state.lrcObj = {
				lrc: [{}]
		};
    	state.musicloading=true;
    	state.playtime=0;
    },
    setmusic_url (state, url) {
    	state.playurl=url
    },
    list_remove (state, index) {
    },
    playtimechange (state, time) {
      state.playtime = Math.round(time*1000)
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
    seekmusic(state,v){
    	document.getElementById('audio').currentTime=v
    },
    playindex(state,i){
    	if(state.playtype==1){
    		state.index_am=i;
    		state.music=state.list_am[i]
    	}else{
    		state.index_dj=i;
    		state.music=state.list_dj[i]
    	}
    },
    delplaylist(state,i){
    	if(i>-1){
    		state.index_am--;
    		state.list_am.splice(i,1);
    	}else{
    		state.index_am=0
    		state.list_am=[]
    	}
    },
    next (state) { // 播放下一曲
      console.log("next")
      if(!state.list_am.length)return;
	  state.index_am++;
	  state.index_am=state.index_am>=state.list_am.length?0:state.index_am;
	  state.music=state.list_am[state.index_am];
    },
    prev (state) { // 播放上一曲
    	 console.log("prev")
         if(state.playtype==1){
       	  if(!state.list_am.length)return;
       	  state.index_am--;
       	  state.index_am=state.index_am<0?state.list_am.length-1:state.index_am;
       	  console.log(state.index_am,state.list_am[state.index_am])
       	  state.music=state.list_am[state.index_am];
         }
    },
    setshuffle(state,def=false){
    	//播放模式切换时默认设置为1 ：顺序播放
    	if(def){
    		state.shuffle=1
    	}else{
    		state.shuffle++;
    		state.shuffle=state.shuffle>3?1:state.shuffle;
    	}
    },
    setfm(state,fm){
    	state.index_fm=fm.index+1;
    	state.list_fm=fm.list;
    	var res=state.list_fm[state.index_fm]||{};
    	 res.heart=false;
         if(res.id&&state.likeall.indexOf(res.id)>-1){
       	  res.heart=true
         }
         state.music = res;
    },
    setuplaylist(state,res){
    	res=res.filter((i)=>{
    		return i.creator.userId==state.user.userId;
    	})
    	state.uplaylist=res;
    },
    setlikeall(state,res){
    	state.likeall=res;
    }
  },
  actions: {
	 next_music({commit,state,dispatch}){
	   commit("next");
	   dispatch("only_murl");
	},
	next_fm({commit,state}){
		if(state.index_fm>=state.list_fm.length-1){
			api.fm().then(res=>{
				commit("setfm",{list:res.data.data,index:-1});
			})
		}else{
			commit('setfm',{list:state.list_fm,index:state.index_fm})
		}
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
    		commit("setlikeall",(res.data.ids||[]).join(","))
    	});
    	if(!state.user.userId)return;
    	await api.user_playlist(state.user.userId,0).then(res=>{
    		console.log(res.data.playlist)
    		commit("setuplaylist",res.data.playlist||[])
    	})
    },
    async heart({state,commit,dispatch},opt){
    	console.log(opt)
    	api.songtrack(opt.id,opt.t,opt.del).then(res=>{
    		dispatch("getlike");
    	})
    },
    getlrc({state,commit},id){
    	api.lyric(id).then(res => {
			var lrc = u.parse_lrc(res.data.lrc && res.data.lrc.lyric ? res.data.lrc.lyric : '');
			res.data.lrc = lrc.now_lrc;
			res.data.scroll = lrc.scroll ? 1 : 0;
			commit("setlrc", res.data)
		}).catch(()=>{
			commit("setlrc",{code:500})
		})
    }
  }
})
export default store

