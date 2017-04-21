<template>
	<div id="playingpage" :class="(playing?'playing':'')">
		<mt-header fixed :title="(music.name+' - '+music.ar[0].name)">
			<mt-button slot="left" @click="$router.go(-1)" icon="back">返回</mt-button>
			<img src="" />
		</mt-header>
		<div id="playing-bg" class="blurbg" :style="{'background-image':'url('+music.al.picUrl+')'}"></div>
		<div id="playing-zz" v-show="!showlrc" @click="showlrc=!showlrc">
			<img src="../../static/images/aag.png" />
		</div>
		<div id="playing-main" v-show="!showlrc" @click="showlrc=!showlrc">
			<img id="playingmainbg" src="../../static/images/play.png" />
			<div :style="{'background-image':'url('+music.al.picUrl+'?param=200y200)'}" bindtap="loadlrc" id="pmaincover"></div>
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
			<playpercent :playtime="playtime" :duration="music.dt"></playpercent>
			<div id="playingaction">
				<div class="pa-saction" bindtap="playshuffle" v-if="shuffle==1">
					<img src="../../static/images/cm2_icn_loop@2x.png" />
				</div>
				<div class="pa-saction" bindtap="playshuffle" v-if="shuffle==2">
					<img src="../../static/images/cm2_icn_one@2x.png" />
				</div>
				<div class="pa-saction" bindtap="playshuffle" v-if="shuffle==3">
					<img src="../../static/images/cm2_icn_shuffle@2x.png" />
				</div>
				<div class="pa-maction" data-other="-1" bindtap="playother">
					<img src="../../static/images/ajh.png" />
				</div>
				<div class="pa-baction" v-show="playing" @click="playingtoggle">
					<img id='pa-playing' src="../../static/images/ajd.png" />
				</div>
				<div class="pa-baction" v-show="!playing" @click="playingtoggle">
					<img id='pa-pause' src="../../static/images/ajf.png" />
				</div>
				<div class="pa-maction" data-other="1" bindtap="playother">
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
	import u from "@/utils.js"
	import lrcTpl from "@/components/lrc"
	import playpercent from "@/components/playpercent"
	export default {
		name: 'playing',
		data() {
			return {
				loaded: false,
				id: 0,
				showlrc: false,
				commentscount: 0,
				lrcObj: {
					lrc: [{}]
				}
			}
		},
		components: {
			playpercent,
			lrcTpl
		},
		beforeRouteEnter: (to, from, next) => {
			next(vm => {
				vm.$store.commit("setplaytype",1)
				if(parseInt(to.params.id) !== parseInt(vm.id)) {
					vm.loaded = false;
					vm.$store.commit('setmusic', {
						al: {},
						ar: [{
							name: ''
						}],
						name: ''
					})
					vm.showlrc=false;
					vm.$store.commit("playtimechange",0)
					vm.commentscount = 0;
					vm.lrcObj = {
						lrc: [{}]
					};
					vm.get();
				}
			})
		},
		computed: {
			...mapGetters(['playtime',
				'playing',
				'music',
				'shuffle',
				'playing',
				"likeall"
			])
		},
		watch: {
			music(v) {
				this.showlrc && this.loadLrc(v.id);
			},
			showlrc(v) {
				if(v && !this.lrcObj.code) {
					this.loadLrc(this.music.id)
				}
			}
		},
		methods: {
			loadLrc(id) {
				if(!id) return;
				this.lrcObj = {
					lrc: [{}]
				};
				api.lyric(id).then(res => {
					var lrc = u.parse_lrc(res.data.lrc && res.data.lrc.lyric ? res.data.lrc.lyric : '');
					res.data.lrc = lrc.now_lrc;
					res.data.scroll = lrc.scroll ? 1 : 0;
					this.lrcObj = res.data;
				})
			},
			playingtoggle() {
				this.$store.commit("setplaying", !this.playing);
			},
			async get() {
				this.id = this.$route.params.id;
				api.comments(this.id, 0, 2).then(res => {
					this.commentscount = res.data.total
				})
				await this.$store.dispatch('getmusic_url', this.id);
				//this.$store.commit("setplaying", 1);
			}
		},
		computed: {
			...mapGetters([
				'playing',
				'music',
				'playtime',
				'shuffle',
				'likeall'
			])
		}
	}
</script>

<style scoped>
	.mint-header {
		background: rgba(0, 0, 0, 0);
		border-bottom: 1px solid rgba(255, 255, 255, .2);
	}
	
	#playingpage {
		background: url('../../static/images/cm2_default_play_bg-ip6@2x.jpg') center top no-repeat;
		-webkit-background-size: 100% auto;
		background-size: 100% auto;
	}
	
	.blurbg {
		z-index: 0;
		height: 100%;
		padding: 0;
		background-position: center center;
		background-size: auto 100%;
	}
	
	#playing-zz {
		text-align: center;
		position: absolute;
		z-index: 20;
		width: 100%;
		top: 0;
		overflow: hidden;
		margin-top: 40px;
	}
	
	#playing-zz img {
		width: 30%;
		margin-top: -8%;
		margin-left: 10%;
		margin-bottom: 30px;
		transform: rotate(-20deg);
		transform-origin: 26% 17%;
		transition: all linear .5s
	}
	
	#playing-main {
		margin: 32% auto 0;
		position: relative;
		z-index: 10;
		width: 80%;
		animation-delay: .5s;
		animation: circle 20s linear infinite;
		animation-play-state: paused;
	}
	
	#playingmainbg {
		width: 100%;
		position: relative;
		z-index: 1
	}
	
	#pmaincover {
		position: absolute;
		width: 64%;
		left: 18%;
		top: 18%;
		z-index: 3;
		height: 0;
		padding-top: 64%;
		border-radius: 50%;
		overflow: hidden;
		background-size: 100% 100%;
	}
	
	#playing-actwrap {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		box-sizing: border-box;
		overflow: hidden;
		z-index: 10
	}
	
	#playing-info {
		display: flex;
		margin: 0 10%
	}
	
	.pi-act {
		flex: 1;
		text-align: center;
		position: relative
	}
	
	.pi-act img {
		width: 60%;
	}
	
	#playingaction {
		margin: 2% 0 4%;
		display: flex
	}
	
	.pa-baction,
	.pa-maction,
	.pa-saction {
		flex: 1;
		text-align: center;
		width: 100%
	}
	
	.pa-baction img {
		width: 75%;
	}
	
	.pa-maction img {
		width: 65%;
		margin-top: 2%
	}
	
	.pa-saction img {
		width: 70%;
		margin-top: 2%
	}
	
	.playing #playing-main {
		animation-play-state: running !important;
	}
	
	.playing #playing-zz img {
		transform: rotate(-0deg)
	}
</style>