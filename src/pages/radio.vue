<template>
	<div id="fixheader" :class="{'page_t':!st,'stfixed':st}" v-infinite-scroll="getprogram" infinite-scroll-disabled="busy">
		<mt-header id="artheader" fixed :title="(djradio.name||'电台')">
			<mt-button slot="left" @click="$router.go(-1)" icon="back"></mt-button>
			<playico slot="right"></playico>
		</mt-header>
		<div id="artist_header" ref="main" :style="{top:-st+'px'}">
			<img src="../../static/images/cm2_default_act_320@2x.png" alt="" />
			<img :src="djradio.picUrl+'?param=750y750'" :style="{'filter':'blur('+opa+'px) brightness(.8)'} " />
			<div id="ahw_wrap">
				<div :style="{'visibility':(opa1>.4?'visible':'hidden')}">
					<div class="ahw_name">{{djradio.name||' '}}
						<p>{{djradio.subCount|playcount}}人订阅</p>
					</div>
					<div class="ahw_btn" @click="djradio_sub">
						<img src="../../static/images/cm2_vehicle_icn_subscribe@2x.png" v-if="!djradio.subed" alt="" />
						<img src="../../static/images/cm2_vehicle_icn_subscribed@2x.png" v-else alt="" /> 订阅</div>
				</div>
			</div>
		</div>
		<tab :tabs="tab" :tabidx="cur" v-on:switchtab="switchtab" class="tab-split"></tab>
		<div class="tab_cnt" v-show="cur==0">
			<div id="djradio_info">
				<div class="infowrap">主播</div>
				<div class="infowrap">
					<router-link :to="{path:'/playlist',param:{id:djradio.dj.userId}}" class="flexlist flex-image">
						<div class="flexlist nonebd">
							<div class="flexleft fl-image">
								<img :src="djradio.dj.avatarUrl+'?param=100y100'" class="user_avator" />
							</div>
							<div class="flexmain">
								<div>{{djradio.dj.nickname}}
								</div>
								<div class="relistdes">{{djradio.dj.description}}</div>
							</div>
						</div>
					</router-link>
				</div>
				<div class="infowrap">
					电台内容简介
					<div class="info_des">
						<p>分类：<span class="tags">{{djradio.category}}</span></p>
						{{djradio.desc}}
					</div>
				</div>
				<div class="sm_title" v-if="djradio.commentDatas.length">热门评论</div>
				<div class="limg_list rec_list " v-for="(item,index) in djradio.commentDatas">
					<div class="rec_avatar">
						<img class="user_avator" :src="item.userProfile.avatarUrl+'?param=60y60'" />
					</div>
					<div class="rec_main">
						<div class="rm_header">
							<span class="fmh_name">{{item.userProfile.nickname}}</span>
						</div>
						<div class="rm_cnt">
							<div class="WxEmojidiv">
								<span v-for="re in emoji(item.content)" :key="re.id">
									<span v-if="re.node == 'text'">{{re.text}}</span>
								<span v-if="re.node == 'element'"><img class="wxEmoji" :src="'http://s1.music.126.net/style/web2/emt//emoji_'+re.text+'.png'" /></span>
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="tab_cnt" v-show="cur==1">
			<div class="sm_title">共{{programs.count}}期</div>
			<div class="songs">
				<router-link v-for="(re,idx) in programs.programs" :to="{name:'program',params:{id:re.id},query:{img:re.mainSong.album.picId_str||re.mainSong.album.picId}}" :class="'flexlist flex-center '+(re.id==music.id?'cur':'')" @click.native="indexprog(idx)" :key="re.id">
					<div class="flexleft flexnum ">
						<div v-if="re.id===music.id">
							<img src="../../static/images/aal.png" alt="" />
						</div>
						<div v-else>
							<span>{{idx+1}}</span>
						</div>
					</div>
					<div class="flexlist">
						<div class="flexmain">
							<div>{{re.name}}</div>
							<div class="relistdes">
								<span>{{re.createTime|dateM}} </span>
								<img src="../../static/images/cm4_list_icn_play_time@2x.png" alt="" />
								<span> {{re.listenerCount|playcount}}</span>
								<img src="../../static/images/cm4_list_icn_time@2x.png" alt="" />
								<span>{{re.duration|dateS}}</span>
							</div>
						</div>
						<div class="flexact">
							<div class="fa_list">
								<img src="../../static/images/cm2_list_btn_more@2x.png" />
							</div>
						</div>
					</div>
				</router-link>
			</div>
			<loading v-show="!loaded||programs.more"></loading>
		</div>
	</div>
</template>

<script>
	import {mapState } from 'vuex'
	import api from '@/api';
	import bs64 from "@/base64";
	import tab from "@/components/tabs";
	import utils from "@/utils"
	import loading from "@/components/loading"
	import playico from "@/components/playico"
	import songlist from "@/components/songlist";
	export default {
		name: 'djlist',
		data() {
			return {
				djradio: {
					dj: {},
					commentDatas: []
				},
				name: '',
				cur: '1',
				tab: [{
					name: '详情'
				}, {
					name: '节目',
					text: 0
				}],
				offset: 0,
				id: -1,
				loaded: false,
				programs: {},
				busy: true
			}
		},
		components: {
			songlist,
			loading,
			playico,
			tab
		},
		beforeRouteEnter: (to, from, next) => {
			next(vm => {
				if(parseInt(to.params.id) != parseInt(vm.id)) {
					vm.name = "";
					vm.loaded = false;
					vm.djradio = {
						dj: {},
						commentDatas: []
					};
					vm.id = -1
					vm.offset = 0;
					vm.busy = true;
					vm.cur = '1'
					vm.programs = {}
					vm.loadj();
				}
			})
		},
		methods: {
			switchtab(index) {
				this.cur = index.toString();
			},
			async loadj() {
				this.id = this.$route.params.id;
				await api.dj_detail(this.id).then(res => {
					this.djradio = res.data.djRadio;
				}).catch(() => {});
				this.getprogram(false)
			},
			getprogram(more = true) {
				if(this.$route.name!='radio'||this.cur!='1'||(this.loaded && !this.programs.more)) return;
				api.dj_getprogram(this.id, this.offset).then(res => {
					if(more) {
						res.data.programs = this.programs.programs.concat(res.data.programs);
					}
					this.programs = res.data;
					this.offset = res.data.programs.length
					this.loaded = true;
					this.busy = false;
				})
			},
			indexprog(i) {
				this.$store.commit("setplaytype", 3);
				this.$store.commit("setplaylist", this.programs.programs);
				this.$store.commit("playindex", i);
			},
			emoji(str) {
				return utils.emoji(str)
			},
			djradio_sub() {
				api.dj_sub(this.id, this.djradio.subed ? 0 : 1).then(res => {
					if(res.data.code == 200) {
						this.djradio.subed = !this.djradio.subed
					}
				})
			}

		},
		computed: {
			st() {
				var t = this.cw * 0.8 - 40;
				return this.scrolltop > t ? t : 0
			},
			opa1() {
				return 1 - this.scrolltop / this.cw
			},
			opa() {
				return this.scrolltop / this.cw * 10
			},
			...mapState([
				"scrolltop",
				"music",
				"cw"
			])
		}
	}
</script>

<style scoped>
	.mint-header {
		background: rgba(0, 0, 0, 0)
	}
	
	.stfixed {
		padding-top: 80%;
	}
	
	.stfixed #artist_header {
		position: fixed;
		margin-top: 0;
	}
	
	.blurbg {
		background-color: #eee
	}
	
	#artist_header {
		padding-top: 80%;
	}
	
	#artist_header img {}
	
	#djradio_info {
		margin-top: -1px;
		line-height: 1.4
	}
	
	#djradio_info .infowrap {
		padding: .5em 2%;
		line-height: 1.6;
		border-bottom: 1px solid #dadada;
	}
	
	.infowrap .flexlist .flexlist .flexleft {
		margin-left: 0;
	}
	
	.info_des {
		color: #999;
	}
</style>