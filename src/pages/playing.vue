<template>
	<div id="playingpage" :class="(playing?'playing':'')">
		<mt-header fixed :title="(music.name+' - '+music.ar[0].name)">
			<mt-button slot="left" @click="$router.go(-1)" icon="back">返回</mt-button>
			<img src="" />
		</mt-header>
		<div id="playing-bg" class="blurbg" :style="{'background-image':'url('+(cover||music.al.picUrl)+')'}">{{cover}}----</div>
		<div id="playing-zz" v-show="!showlrc" @click="showlrc=!showlrc">
			<img src="../../static/images/aag.png" />
		</div>
		<div id="playing-main" v-show="!showlrc" @click="showlrc=!showlrc">
			<img id="playingmainbg" src="../../static/images/play.png" />
			<div :style="{'background-image':'url('+(cover||music.al.picUrl)+'?param=200y200)'}" bindtap="loadlrc" id="pmaincover"></div>
		</div>
		<div id="lrclist" @click="showlrc=!showlrc" :playtime="playtime">
			<lrcTpl :lrc="lrcObj" :showlrc="showlrc" :playtime="playtime" lrcindex="1"></lrcTpl>
		</div>
		<div id="playing-actwrap">
			<div id="playing-info" v-show="!showlrc">
				<div class="pi-act" bindtap="songheart">
					<img src="../../static/images/cm2_play_icn_love@2x.png" v-if="!music.heart" />
					<img src="../../static/images/cm2_play_icn_loved@2x.png" v-if="music.heart" />
				</div>
				<div class="pi-act" bindtap="downmusic">
					<img src="../../static/images/cm2_list_detail_icn_share@2x.png" />
				</div>
				<div class="pi-act commentscount">
					<router-link :to="{name:'comment',params:{id:music.id},query:{ctype:2}}">
						<img v-if="!commentscount" src="../../static/images/cm2_play_icn_cmt@2x.png" />
						<img v-if="commentscount" src="../../static/images/cm2_play_icn_cmt_num@2x.png" />
						<span v-if="commentscount">{{commentscount>999?'999+':commentscount}}</span>
					</router-link>
				</div>
				<div class="pi-act" bindtap="togminfo">
					<img src="../../static/images/cm2_play_icn_more@2x.png" />
				</div>
			</div>
			<playpercent :playtime="playtime" v-on:change="change" :musicloading="musicloading" :duration="music.dt"></playpercent>
			<div id="playingaction">
				<div class="pa-saction" @click="setshuffle" v-if="shuffle==1">
					<img :src="'../../static/images/cm2_icn_'+(shuffle==1?'loop':(shuffle==2?'one':'shuffle'))+'@2x.png'" />
				</div>
				
				<div class="pa-maction" @click="prev" bindtap="playother">
					<img src="../../static/images/ajh.png" />
				</div>
				<div class="pa-baction" @click="playingtoggle">
					<img id='pa-playing' :src="'../../static/images/aj'+(playing?'d':'f')+'.png'" />
				</div>
				
				<div class="pa-maction" @click="next">
					<img src="../../static/images/ajb.png" />
				</div>
				<div class="pa-saction" bindtap="togpinfo">
					<img src="../../static/images/cm2_icn_list@2x.png" />
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex'
	import api from "@/api"
	import u from "@/utils.js";
	import bs64 from "@/base64";
	import lrcTpl from "@/components/lrc"
	import playpercent from "@/components/playpercent"
	export default {
		name: 'playing',
		data() {
			return {
				loaded: false,
				id: 0,
				showlrc: false,
				cover: "",
			}
		},
		components: {
			playpercent,
			lrcTpl
		},
		beforeRouteEnter: (to, from, next) => {
			next(vm => {
				vm.$store.commit("setplaytype", 1)
				if(parseInt(to.params.id) !== parseInt(vm.music.id)) {
					vm.loaded = false;
					vm.$store.commit('resetmusic')
					vm.showlrc = false;
					vm.cover = ""
					vm.get();

				}
			})
		},
		watch: {
			music(v) {
				if(!this.music.id)return;
				this.showlrc && this.loadLrc(v.id);
				if(!this.music.playurl) {
					console.log('ppppppppppp')
					this.cover = "";
					this.$store.commit("setlrc", {
						lrc: [{}]
					})
					this.$store.dispatch('only_murl');
					this.getcommit()
				}
				this.$router.replace({name:'playing',params:{id:this.music.id},query:{img:this.music.al.pic}})
			},
			showlrc(v) {
				if(v && !this.lrcObj.code) {
					this.loadLrc(this.music.id)
				}
			}
		},
		created() {
			if(!this.music.id) {
				//	this.get()
			}
		},
		methods: {
			loadLrc(id) {
				if(!id) return;
				api.lyric(id).then(res => {
					var lrc = u.parse_lrc(res.data.lrc && res.data.lrc.lyric ? res.data.lrc.lyric : '');
					res.data.lrc = lrc.now_lrc;
					res.data.scroll = lrc.scroll ? 1 : 0;
					this.$store.commit("setlrc", res.data)
				})
			},
			playingtoggle() {
				this.$store.commit("setplaying", !this.playing);
			},
			async get() {
				var img = this.$route.query.img;
				img && (this.cover = bs64.id2Url(img));
				await this.$store.dispatch('getmusic', this.$route.params.id);
			},
			getcommit() {
				api.comments(this.music.id, 0, 2).then(res => {
					this.$store.commit('commentscount', res.data.total);
				})
			},
			change(v){
				console.log(v)
			},
			...mapMutations([
				'next',
				'prev',
				'setshuffle'
			])
		},
		computed: {
			...mapGetters([
				'playing',
				'music',
				'playtime',
				'shuffle',
				'likeall',
				'lrcObj',
				'commentscount',
				'musicloading',
				'list_am'
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
</style>