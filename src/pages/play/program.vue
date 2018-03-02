<template>
	<div id="playingpage" :class="(playing?'playing':'')">
		<mt-header fixed :title="(music.name)">
			<mt-button slot="left" @click="$router.go(-1)" icon="back"></mt-button>
		</mt-header>
		<img src="static/images/cm2_play_disc_radio-ip6@2x.png" v-if="!showlrc" id="coverbg" alt="" />
		<div id="playing-bg" class="blurbg" :style="{'background-image':'url('+(music.mainSong.album||{}).picUrl+'?param=500y500)'}"></div>
		<div class="flexlist flex-center" id="program_radio_info" v-show="!showlrc">
			<div class="flexlist ml">
				<div class="flexleft flexnum fl-image">
					<img id="radio_cover" :src="(music.radio||{}).picUrl" /></div>
				<div class="flexmain">
					<div>{{music.radio.name}}</div>
					<div class="relistdes">{{music.radio.subCount|playcount}}人订阅</div>
				</div>
				<div class="flexact">
					<div class="fa_list" id="subtn" @click="djradio_sub">
						<img src="static/images/cm2_vehicle_icn_subscribe@2x.png" v-if="!music.radio.subed" alt="" />
						<img src="static/images/cm2_vehicle_icn_subscribed@2x.png" v-else alt="" />
						<span v-if="music.radio.subed">已</span>订阅
					</div>
				</div>
			</div>
		</div>

		<div class="menu" id="p_info_menu" v-if="showlrc" @click="showlrc=!showlrc">
			<router-link replace :to="{name:'radio',params:{id:music.radio.id}}" class="mn_list">
				<div class="mn_ico">
					<img src="static/images/cm2_rdi_icn_name@2x.png"></image>
				</div>
				<div class="cmain">{{music.radio.name}}</div>
				<div class="rdes">
					<div class="arrow arrow-white"></div>
				</div>
			</router-link>
			<router-link replace class="mn_list" :to="{name:'user',params:{id:music.dj.userId}}">
				<div class="mn_ico">
					<img src="static/images/cm2_rdi_icn_artist@2x.png"></image>
				</div>
				<div class="cmain">{{music.dj.nickname}}</div>
				<div class="rdes">
					<div class="arrow arrow-white"></div>
				</div>
			</router-link>
			<!--
            	包含歌曲信息需重新请求节目信息才有，从radio中播单中过了都没有此内容
            	<div class="mn_list" v-if="music.songs">
				<div class="mn_ico">
					<img src="static/images/cm2_rdi_icn_list@2x.png"></image>
				</div>
				<div class="cmain">包含的歌曲</div>
				<div class="rdes">
					<span>{{music.songs}}{{music.songs.length}}</span>
					<div class="arrow arrow-white"></div>
				</div>
			</div>
            -->
			<div id="p_info">
				<div>
					<span class="tags">{{music.radio.category}}</span>{{music.name}}Vol.{{music.serialNum}}</div>
				<div id="p_info_time">创建 播放：{{music.listenerCount}}次</div>
				<div>{{music.description}}</div>
			</div>
		</div>

		<div id="playing-main" v-show="!showlrc" @click="showlrc=!showlrc">
			<img id="playingmainbg" src="static/images/play.png" />
			<div :style="{'background-image':'url('+(music.mainSong.album||{}).picUrl+'?param=400y400)'}" bindtap="loadlrc" id="pmaincover"></div>
		</div>
		<div id="playing-actwrap">
			<div id="playing-info" v-show="!showlrc">
				<div class="pi-act commentscount" @click="heart">
					<img :src="'static/images/cm2_play_icn_'+(!music.liked?'praise':'yizan')+'@2x.png'" />
					<span>{{music.likedCount}}</span>
				</div>
				<!-- -->
				<div class="pi-act" bindtap="downmusic">
					<img src="static/images/cm2_list_detail_icn_share@2x.png" />
				</div>
				<router-link class="pi-act commentscount" :to="{name:'comment',params:{id:music.commentThreadId},query:{ctype:1}}">
					<img v-if="!commentscount" src="static/images/cm2_play_icn_cmt@2x.png" />
					<img v-if="commentscount" src="static/images/cm2_play_icn_cmt_num@2x.png" />
					<span v-if="commentscount">{{commentscount>999?'999+':commentscount}}</span>
				</router-link>
				<!-- -->
				<div class="pi-act">
					<img src="static/images/cm2_play_icn_more@2x.png" />
				</div>
			</div>
			<playaction v-on:psaction="psaction"></playaction>
		</div>

		<pop :show="pop_tg==3" v-on:closepop="pop_tg=0">
			<div class='ppm_header'>
				<div class="pph_cnt" @click="shuffle"><img :src="'static/images/cm2_play_btn_'+(shuffle_dj==0?'order':(shuffle_dj==1?'one':'shuffle'))+'@2x.png'" alt="" />{{(shuffle==1?'循序播放':(shuffle==2?'单曲循环':'随机播放'))}}（{{list_dj.length}}）</div>
				<div class="pph_cnt">
					<div @click="delplaylist();pop3=false"><img src="static/images/cm2_btmlay_btn_dlt_prs@2x.png" alt="" /><span>清空</span></div>
				</div>
			</div>
			<div class='ppm_content'>
				<div class="cntloading" v-show="!list_dj.length">列表为空</div>
				<div :class="'flexlist ml flex-center '+(re.id===music.id?'cur ':' ')" @click="playindex(idx)" v-for="(re,idx) in list_dj" :key="re.id">
					<div class="flexlist">
						<div class="flexleft " v-if="re.id===music.id">
							<div>
								<img src="static/images/aal.png" alt="">
							</div>
						</div>
						<div class="flexmain">
							<div>{{re.name}}</div>
						</div>
						<div class="flexact">
							<div class="fa_list" @click.stop="delplaylist(idx)">
								<img src="static/images/cm2_playlist_icn_dlt@2x.png" alt="" /></div>
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
	import {
		Toast
	} from 'mint-ui';
	import u from "@/utils.js";
	import bs64 from "@/base64";
	import lrcTpl from "@/components/lrc";
	import pop from "@/components/pop"
	import playaction from "@/components/playaction"
	export default {
		name: 'program',
		data() {
			return {
				showlrc: false,
				loaded: false,
				id: 0,
				pop_tg: 0
			}
		},
		components: {
			playaction,
			lrcTpl,
			pop
		},
		beforeRouteEnter: (to, from, next) => {
			next(vm => {
				//当前播放的音乐的id与路由的id不一样
				if(parseInt(to.params.id) !== parseInt(vm.music.id)) {
					vm.$store.commit("setplaytype", 3);
					if(vm.bgmchange && vm.music.id) {
						vm.$router.replace({
							name: 'program',
							params: {
								id: vm.music.id
							}
						})
						return;
					}
					vm.loaded = false;
					vm.$store.commit("setmusic")
					vm.$store.commit('resetmusic')
					vm.get();
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
				if((!this.music.id || this.playtype != 3) || this.$route.name != 'program') return;
				this.$store.commit("resetmusic");
				this.$store.dispatch('only_murl');
				this.getcommit();
				(this.$route.name == 'program') && this.$router.replace({
					name: 'program',
					params: {
						id: this.music.id
					}
				})
			}
		},
		methods: {

			get() {
				this.id = this.$route.params.id;
				api.program_detail(this.id).then(res => {
					//this.music = res.data.program;
					this.$store.commit("setmusic", res.data.program);
					if(this.list_dj.findIndex((v) => {
							return v.id == this.music.id
						}) == -1) {
						//当前播放列表中没有此歌曲则向列表中添加
						this.list_dj.splice(this.index_dj + 1, 0, this.music);
						this.$store.commit("setindex", this.index_dj + 1)
					}
				})
			},
			getcommit() {
				api.comments(this.music.commentThreadId, 0, 1).then(res => {
					this.$store.commit('commentscount', res.data.total);
				})
			},
			heart() {
				this.music.id && api.program_like(this.music.commentThreadId, this.music.liked ? 0 : 1).then(res => {
					if(res.data.code != 200) return;
					this.music.liked = !this.music.liked;
					this.music.liked ? this.music.likedCount++ : this.music.likedCount--
				})
			},
			djradio_sub() {
				api.dj_sub(this.music.radio.id, this.music.radio.subed ? 0 : 1).then(res => {
					if(res.data.code == 200) {
						this.music.radio.subed = !this.music.radio.subed
					}
				})
			},
			psaction() {
				this.pop_tg = 3
			},
			...mapMutations([
				'playindex',
				'delplaylist',
				"shuffle"
			])
		},
		computed: {
			...mapState([
				'playing',
				'music',
				'shuffle_dj',
				'commentscount',
				'list_dj',
				'playtype',
				'bgmchange',
				'index_dj'
			])
		},
		filters: {
			playcount(v) {
				if(!v) return "0";
				return v < 10e3 ? v : ((v / 10e3).toFixed(0) + '万')
			}
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
	
	#program_radio_info {
		color: #fff;
		margin-top: 40px;
		position: absolute;
		z-index: 3;
		width: 100%;
	}
	
	#program_radio_info .flexlist {
		border-bottom: 1px solid rgba(255, 255, 255, .2);
		;
		padding: 2% 2% 2% 0;
	}
	
	#program_radio_info #radio_cover {
		width: 100%
	}
	
	#subtn img {
		height: 2em;
		vertical-align: top;
	}
	
	#subtn {
		border: 1px solid rgba(255, 255, 255, 1);
		padding: 0 1.2em 0 .8em;
		color: #fff;
		border-radius: 2em;
		line-height: 2;
	}
	
	.flexact {
		font-size: .8em;
	}
	
	.relistdes {
		color: #fff
	}
	
	#p_info_menu {
		position: absolute;
		top: 40px;
		z-index: 10;
		bottom: 10em;
		width: 100%;
		color: #fff;
		overflow: auto;
	}
	
	.menu .mn_ico,
	.menu .cmain,
	.menu .rdes {
		color: #fff;
		border-bottom: 1px solid rgba(255, 255, 255, .2);
	}
	
	.mn_list {
		color: #fff;
	}
	
	#p_info {
		padding: 1em;
		line-height: 1.6
	}
	
	#p_info_time {
		color: #ddd;
		padding: .5em 0
	}
	
	#playing-main {
		z-index: 10;
		margin-top: 43.5%;
	}
	
	#pmaincover {
		position: absolute;
		width: auto;
		height: auto;
		left: 3px;
		top: 3px;
		right: 3px;
		bottom: 3px;
		z-index: 3;
		border-radius: 50%;
		overflow: hidden;
	}
	
	#coverbg {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: auto;
		display: block;
		z-index: 1;
	}
</style>