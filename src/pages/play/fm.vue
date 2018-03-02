<template>
	<div id="playingpage" :class="(playing?'playing':'')">
		<mt-header fixed :title="music.name">
			<mt-button slot="left" @click="$router.go(-1)" icon="back"></mt-button>
			<mt-button icon="more" @click="pop_tg=1" slot="right"></mt-button>
		</mt-header>
		<div id="playing-bg" class="blurbg" :style="{'background-image':'url('+(music.album||{}).picUrl+'?param=500y500)'}"></div>
		<div id="fm-covermain" :class="(showlrc?'playinghidden':'')">
			<img id="fm-cmpic" :src="(music.album||{}).picUrl+'?param=500y500'" />
		</div>
		<div id="fm-mdes" :class="(showlrc?'playinghidden':'')">
			<span id="fm-mname">{{music.name}}</span>
			<span id="fm-martist">{{(music.artists||[1])[0].name}}</span>
		</div>
		<div id="lrclist" @click="showlrc=!showlrc" >
			<lrcTpl :lrc="lrcObj" :showlrc="showlrc"></lrcTpl>
		</div>
		<div id="playing-actwrap">
			<playaction :commentscount="commentscount"></playaction>
		</div>
		<pop :show="pop_tg==1" v-on:closepop="pop_tg=0">
			<div class='ppm_header'>{{music.name}}</div>
			<div class='ppm_content'>
				<div class="menu">
					<div class="mn_list" @click="pop_tg=2">
						<div class="mn_ico">
							<div class="plicon picon1"></div>
							<img src="static/images/cm2_lay_icn_fav_new@2x.png" alt="" />
						</div>
						<div class="cmain">收藏到歌单</div>
					</div>
					<router-link replace :to="{name:'simi',params:{id:music.id||0}}" class="mn_list">
						<div class="mn_ico">
							<img src="static/images/cm2_lay_icn_similar_new@2x.png" alt="" />
						</div>
						<div class="cmain">相似推荐</div>
					</router-link>
					<router-link replace v-if="(music.artists||[{id:0}])[0].id" :to="{name:'artist',params:{id:(music.artists||[{id:0}])[0].id}}" class="mn_list">
						<div class="mn_ico">
							<img src="static/images/cm2_lay_icn_artist_new@2x.png" alt="" />
						</div>
						<div class="cmain">歌手：{{(music.artists||[{a:1}])[0].name}}</div>
					</router-link>
					<router-link replace :to="{name:'album',params:{id:(music.album||{id:0}).id},query:{img:(music.album||{pic_str:''}).pic_str||(music.album||{pic_str:''}).pic}}" class="mn_list">
						<div class="mn_ico">
							<img src="static/images/cm2_lay_order_album_new@2x.png" alt="" />
						</div>
						<div class="cmain">专辑：{{(music.album||{name:''}).name}}</div>
					</router-link>
					<router-link v-if="music.mvid" :to="{name:'mv',params:{id:music.mvid||0}}" class="mn_list">
						<div class="mn_ico">
							<img src="static/images/cm2_lay_icn_mv_new@2x.png" alt="" />
						</div>
						<div class="cmain">查看Mv</div>
					</router-link>
				</div>
			</div>
		</pop>

		<pop :show="pop_tg==2" v-on:closepop="pop_tg=0">
			<div class='ppm_header'>收藏到歌单</div>
			<div class='ppm_content'>
				<div class="flexlist flex-image" @click="tracktpl(re.id)" v-for="re in uplaylist" :key="re.id">
					<div class="flexlist">
						<div class="flexleft fl-image ml">
							<img :src="re.coverImgUrl+'?param=100y100'" class="album_cover" />
						</div>
						<div class="flexmain">
							<div>{{re.name}}</div>
							<div class="relistdes">{{re.trackCount}}首</div>
						</div>
					</div>
				</div>
			</div>
		</pop>

	</div>
</template>

<script>
	import { mapState, mapMutations } from 'vuex'
	import api from "@/api"
	import u from "@/utils.js";
	import {
		Toast
	} from 'mint-ui';
	import bs64 from "@/base64";
	import pop from "@/components/pop"
	import lrcTpl from "@/components/lrc"
	import playaction from "@/components/playaction"
	export default {
		name: 'fm',
		data() {
			return {
				loaded: false,
				id: 0,
				showlrc: false,
				pop_tg: 0
			}
		},
		components: {
			lrcTpl,
			pop,
			playaction
		},
		beforeRouteEnter: (to, from, next) => {
			next(vm => {
				if(vm.playtype != 2) {
					vm.$store.commit("setplaytype", 2)
					vm.loaded = false;
					vm.$store.commit("setmusic")
					vm.$store.commit('resetmusic')
					vm.$store.dispatch('next_fm');
				}
			})
		},
		beforeRouteLeave(to, from, next) {
			this.pop_tg = 0;
			this.showlrc = false;
			next()
		},
		watch: {
			music(v) {
				if(!this.music.id || this.playtype != 2) return;
				this.showlrc && this.loadLrc(v.id);
				this.$store.commit("resetmusic");
				if(!this.playurl) {
					this.$store.dispatch('only_murl');
					this.getcommit()
				}
			},
			showlrc(v) {
				if(v && !this.lrcObj.code) {
					this.loadLrc(this.music.id)
				}
			}
		},
		methods: {
			loadLrc(id) {
				id && this.$store.dispatch('getlrc', id);
			},
			getcommit() {
				api.comments(this.music.id, 0, 2).then(res => {
					this.$store.commit('commentscount', res.data.total);
				})
			},
			tracktpl(pid) {
				this.$store.dispatch('tracktpl',{id:this.music.id,pid:pid,add:true})
			}
		},
		computed: {
			...mapState([
				'playing',
				'music',
				'playtime',
				'playtype',
				'likeall',
				'lrcObj',
				'index_fm',
				'commentscount',
				'musicloading',
				'list_fm',
				'playurl',
				'uplaylist'
			])
		}
	}
</script>

<style scoped>
	.mint-header {
		background: rgba(0, 0, 0, 0);
		border-bottom: 1px solid rgba(255, 255, 255, .2);
	}
	
	.blurbg {
		z-index: 0;
		height: 100%;
		padding: 0;
		background-position: center center;
		background-size: auto 100%;
	}
	
	
	.mn_list {
		color: #555;
	}
	
	#coverbg {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		z-index: -2;
		display: block
	}
	
	#fm-cmpic {
		position: absolute;
		left: 0;
		top: 0;
		z-index: 2;
		width: 100%;
	}
	
	#fm-mdes {
		position: relative;
		z-index: 2;
		text-align: center;
		color: #fff;
		padding: 0 1em;
	}
	
	#fm-martist {
		display: block;
		color: #eee;
		font-size: .8em;
		padding-top: .5em;
	}
	
	#fm-fixed {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
	}
	
</style>