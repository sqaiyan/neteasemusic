<template>
	<div>
		<div id="fixheader">
			<mt-header id="artheader" fixed :title="title">
				<mt-button slot="left" @click="$router.go(-1)" icon="back"></mt-button>
				<playico :playtype="playtype" slot="right" :playing="playing" :music="music"></playico>
			</mt-header>
			<div id="artist_header" ref="main" :style="{top:-scrolltop+'px'}">
				<img id="art_cover" :src="user.profile.backgroundUrl" />
				<div id="user_hmain">
					<img id="uh_avatar" class="user_avator" :src="user.profile.avatarUrl+'?param=100y100'" alt="" />
					<div id="uh_name">{{user.profile.nickname}}<img src="../../static/images/cm2_pro_icn_girl@2x.png" v-if="user.profile.gender==2" /><img src="../../static/images/cm2_pro_icn_boy@2x.png" v-else alt="" /></div>
					<p>关注{{user.profile.follows|playcount}} | 粉丝{{user.profile.followeds|playcount}}</p>
					<div class="ahw_btn">
						<img src="../../static/images/cm2_vehicle_icn_subscribe@2x.png" v-if="!user.profile.followed" alt="" />
						<img src="../../static/images/cm2_vehicle_icn_subscribed@2x.png" v-else alt="" />关注
					</div>
				</div>
			</div>
		</div>
		<tabs :tabs="tab" :tabidx="cur" v-on:switchtab="switchtab"></tabs>
		<div class="tab_cnt" v-show="cur==0">
			<div v-if="radio.length">
				<div class="sm_title">电台({{radio.length}})</div>
				<router-link :to="{name: 'playlist',params:{id:re.id}}" class="flexlist flex-image" v-for="re in radio">
					<div class="flexleft fl-image">
						<img :src="re.picUrl+'?param=100y100'" class="album_cover" />
					</div>
					<div class="flexlist">
						<div class="flexmain">
							<div><span class="tags">{{re.category}}</span>{{re.name}}</div>
							<div class="relistdes">共{{re.programCount}}期，{{re.subCount|playcount}}人订阅</div>
						</div>
					</div>
				</router-link>
			</div>
			<div v-if="playlist1.length">
				<div class="sm_title">歌单 ({{user.profile.playlistCount}})<span class="fr">共被收藏({{user.profile.playlistBeSubscribedCount}})次</span></div>
				<router-link :to="{name: 'playlist'}" class="flexlist flex-image">
					<div class="flexleft fl-image">
						<img src="../../static/images/cm2_list_cover_rank@2x.png" class="album_cover" />
					</div>
					<div class="flexlist">
						<div class="flexmain">
							<div>听歌排行</div>
							<div class="relistdes">累计收听{{user.listenSongs}}首</div>
						</div>
					</div>
				</router-link>
				<pl :list="playlist1" :showcreator="false"></pl>
			</div>
			<div v-if="playlist2.length">
				<div class="sm_title">收藏的歌单({{playlist2.length}})</div>
				<pl :list="playlist2"></pl>
			</div>
		</div>
		<div class="tab_cnt" v-show="cur==1"></div>
		<div class="tab_cnt" v-show="cur==2"></div>
	</div>

</template>

<script>
	import { mapGetters, mapMutations } from 'vuex'
	import api from '@/api';
	import bs64 from "@/base64";
	import tabs from "@/components/tabs";
	import pl from "@/components/playlist";
	import loading from "@/components/loading"
	import playico from "@/components/playico";
	import utils from "@/utils"
	let tab = [{
		name: '音乐',
		text: 0
	}, {
		name: '动态',
		text: 0
	}, {
		name: '关于TA',
		text: 6
	}]
	export default {
		name: 'user',
		data() {
			return {
				user: {
					profile: {}
				},
				offset: 0,
				id: -1,
				loaded: false,
				canplay: [],
				title: '',
				scrolltop: 0,
				cur: '0',
				radio: {},
				playlist1: [],
				playlist2: [],
				tab: utils.clone(tab)
			}
		},
		components: {
			loading,
			playico,
			tabs,
			pl
		},
		beforeRouteEnter: (to, from, next) => {
			next(vm => {
				if(parseInt(to.params.id) !== parseInt(vm.id)) {
					vm.name = "";
					vm.loaded = false;
					vm.user = {
						profile: {}
					}
					vm.getuser();
				}
			})
		},
		activated() {
			var st = this.$refs.main;
			st = window.screen.width * 0.62 - 40;
			this.title = window.pageYOffset >  window.screen.width * 0.5 ? '' : '';
			this.scrolltop = window.pageYOffset > st ? st : window.pageYOffset
			window.onscroll = () => {
				this.title = window.pageYOffset >  window.screen.width * 0.5 ? '' : '';
				this.scrolltop = window.pageYOffset > st ? st : window.pageYOffset
			}
		},
		deactivated() {
			window.onscroll = null
		},
		methods: {
			switchtab(index) {
				this.cur = index.toString();
				if(this.cur == 2 && !this.tab[2].loaded) {
					this.user_events(false)
				}
			},
			getuser() {
				this.id = this.$route.params.id;
				api.user_detail(this.id).then(res => {
					this.loaded = true;
					this.user = res.data;
					this.tab[1].text = this.user.profile.eventCount;
					this.tab[2].text = this.user.bindings.length;
				});
				this.user_music()
			},
			user_music() {
				api.user_playlist(this.id, 0).then(res => {
					this.playlist1 = res.data.playlist.filter(i => {
						return i.creator.userId == this.id
					});
					this.playlist2 = res.data.playlist.filter(i => {
						return i.creator.userId != this.id
					});
					this.tab[0].text += res.data.playlist.length
				});
				api.user_radio(this.id).then(res => {
					this.radio = res.data.djRadios;
					this.tab[0].text += res.data.djRadios.length
				})
			},
			user_events() {
				api.user_radio(this.id).then(res => {
					this.radio = res.data;
				})
			}
		},
		computed: {
			...mapGetters([
				'playing',
				'music',
				"playtype"
			])
		}
	}
</script>

<style scoped>
	.mint-header {
		background: rgba(0, 0, 0, 0)
	}
	
	#fixheader {
		padding-top: 62%;
	}
	
	#art_cover {
		margin-top: -24%;
	}
	
	#art_cover {
		filter: brightness(.8);
	}
	
	#user_hmain {
		text-align: center;
		width: 100%;
		position: absolute;
		left: 0;
		top: 40px;
		color: #fff;
	}
	
	#uh_avatar {
		width: 6em;
	}
	
	#uh_name {
		font-size: 1.2em;
		padding: .5em 0 .2em;
	}
	
	#uh_name img {
		margin-left: .5em;
		width: 1em;
	}
	.ahw_btn{margin-top: 1em;}
</style>