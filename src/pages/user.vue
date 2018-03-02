<template>
	<div v-infinite-scroll="user_events" infinite-scroll-disabled="busy">
		<div id="fixheader" :class="{'page_t':!st,'stfixed':st}">
			<mt-header id="artheader" fixed :title="title||user.profile.nickname">
				<mt-button slot="left" @click="$router.go(-1)" icon="back"></mt-button>
				<playico slot="right"></playico>
			</mt-header>
			<div id="artist_header" ref="main" :style="{top:-st+'px'}">
				<img id="art_cover" :src="user.profile.backgroundUrl" :style="{'filter':'blur('+opa+'px) brightness(.8)'} "  />
				<div id="user_hmain" v-show="title==' '">
					<img id="uh_avatar" class="user_avator" :src="user.profile.avatarUrl+'?param=80y80'" :alt="user.profile.nickname" />
					<div id="uh_name">{{user.profile.nickname}}<img src="../../static/images/cm2_pro_icn_girl@2x.png" v-if="user.profile.gender==2" /><img src="../../static/images/cm2_pro_icn_boy@2x.png" v-else alt="" /></div>
					<p>关注{{user.profile.follows}} | 粉丝{{user.profile.followeds}}</p>
					<div class="ahw_btn">
						<img src="../../static/images/cm2_vehicle_icn_subscribe@2x.png" v-if="!user.profile.followed" alt="" />
						<img src="../../static/images/cm2_vehicle_icn_subscribed@2x.png" v-else alt="" /> 关 注
					</div>
				</div>
			</div>
		</div>
		<tabs :tabs="tab" :tabidx="cur" v-on:switchtab="switchtab"></tabs>
		<div class="tab_cnt" v-show="cur==0">
			<div v-if="radio.length">
				<div class="sm_title">电台({{radio.length}})</div>
				<router-link :to="{name: 'radio',params:{id:re.id}}" :key="re.id" class="flexlist flex-image" v-for="re in radio">
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
				<div class="sm_title">歌单 ({{user.profile.playlistCount}})<span class="fr">共被收藏({{user.profile.playlistBeSubscribedCount|playcount}})次</span></div>
				<router-link :to="{name: 'record',params:{uid:id}}" class="flexlist flex-image">
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
		<div class="tab_cnt" v-show="cur==1">
			<div class="limg_list rec_list" v-for="item in events.events">
				<div class="rec_avatar">
					<img class="user_avator" :src="item.user.avatarUrl+'?param=60y60'" />
				</div>
				<div class="rec_main">
					<div class="rm_header">
						<span class="fmh_name"><router-link :to="{name:'user',params:{id:item.user.userId}}">{{item.user.nickname}}</router-link> <span>分享{{sharetype(item.json)}}：</span></span>
						<span class="fmh_time">{{item.showTime|time}}</span>
					</div>
					<div class="rm_cnt">
						<div class="WxEmojidiv">
							<span v-for="re in emoji(item.json.msg)" :key="re.id">
                      			<span v-if="re.node == 'text'">{{re.text}}</span>
							<span v-if="re.node == 'element'"><img class="wxEmoji" :src="'http://s1.music.126.net/style/web2/emt//emoji_'+re.text+'.png'" /></span>
							</span> 
						</div>
						<div v-for="re in item.pics" class="e_imgs">
							<img :src="re.originUrl+'?param=640x0'" />
						</div>
						<div class="flex-boxlist mvs" v-if="item.json.mv">
							<router-link :to="{name:'mv',params:{id:item.json.mv.id}}" class="tl_cnt">
								<div class="cover">
									<img :src="item.json.mv.imgurl16v9" alt="" class="mv_cover" />
									<div class="img_creator">
										{{item.json.mv.name}}
										<p>{{item.json.mv.artist.name}}</p>
									</div>
								</div>
							</router-link>
						</div>
						<div class="flex-boxlist mvs" v-if="item.json.video">
							
							<router-link :to="{name:'video',params:{id:item.json.video.videoId}}" class="tl_cnt">
								<div class="cover">
									<img :src="item.json.video.coverUrl" alt="" class="mv_cover" />
									<div class="img_creator">
										{{item.json.video.title}}
										<p>{{item.json.video.creator.nickname}}</p>
									</div>
								</div>
							</router-link>
							<!-- 
							<div class="tl_cnt">
								<div>
									<video width="100%" height="auto" controls="controls" :src="item.json.video.playurl" :poster="item.json.video.coverUrl">
									</video>
								</div>
							</div> -->
						</div>
						<router-link :to="{name:'playlist',params:{id:item.json.playlist.id}}" class="flexlist flex-image" v-if="item.json.playlist">
							<div class="flexleft fl-image">
								<img :src="item.json.playlist.coverImgUrl+'?param=100y100'" class="music_cover" />
							</div>
							<div class="flexlist">
								<div class="flexmain">
									<div><span class="tags">歌单</span>{{item.json.playlist.name}}
									</div>
									<div class="relistdes">by,{{item.json.playlist.creator.nickname}}
									</div>
								</div>
							</div>
						</router-link>
						<router-link :to="{name:'playing',params:{id:item.json.song.id}}" class="flexlist flex-image" v-if="item.json.song">
							<div class="flexleft fl-image">
								<img :src="item.json.song.album.picUrl+'?param=100y100'" class="music_cover" />
							</div>
							<div class="flexlist">
								<div class="flexmain">
									<div>{{item.json.song.name}}
									</div>
									<div class="relistdes">{{item.json.song.artists[0].name}}
									</div>
								</div>
							</div>
						</router-link>
					</div>
					<div class="rm_act">
						<div class="rma_list" @click="likevents(item)"><img src="../../static/images/cm2_act_icn_praise@2x.png" v-if="!item.info.liked" alt="" />
							<img src="../../static/images/cm2_act_icn_praised@2x.png" v-else alt="" />{{item.info.likedCount||'赞'}}</div>
						<router-link :to="{name:'comment',params:{id:item.info.commentThread.id}}" class="rma_list"><img src="../../static/images/cm2_act_icn_cmt@2x.png" alt="" />{{item.info.commentCount||'评论'}}</router-link>
						<div class="rma_list"><img src="../../static/images/cm2_act_icn_share@2x.png" alt="" />{{item.info.shareCount||'分享'}}</div>
					</div>
				</div>
			</div>
			<loading v-show="!tab[1].loaded||events.more"></loading>
		</div>
		<div class="tab_cnt" v-show="cur==2">
			<div class="listheader">个人信息：</div>
			<div class="user_about">
				<div class="ua_cnt">
					等级：<span>Lv{{user.level}}</span>
				</div>
				<div class="ua_cnt">
					性别：<span>{{user.profile.gender==1?'男':'女'}}</span>
				</div>
				<div class="ua_cnt">
					年龄：<span>{{user.profile.birthday|btdto}}</span>
				</div>
				<div class="ua_cnt">社交账号：<span v-for="re in user.bindings" v-if="re.expired">
					<a :href="re.url">{{re.type==2?'新浪微博':(re.type==6?'腾讯微博':'')}}，</a>
				</span></div>
			</div>
			<div class="listheader">个人简介：</div>
			<div class="user_about">
				{{user.profile.signature}}
			</div>
		</div>
	</div>

</template>

<script>
	import { mapState } from 'vuex'
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
		text: 0,
		loaded: false
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
				cur: '0',
				radio: {},
				playlist1: [],
				playlist2: [],
				tab: utils.clone(tab),
				events: {
					events: []
				},
				e_offset: 0,
				busy:true
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
					vm.tab = utils.clone(tab);
					vm.cur = "0";
					vm.events = {
						events: []
					};
					vm.radio = 0
					vm.playlist1 = [];
					vm.playlist2 = []
					vm.e_offset = 0
					vm.user = {
						profile: {}
					}
					vm.getuser();
				}
			})
		},
		methods: {
			switchtab(index) {
				this.cur = index.toString();
				if(this.cur == 1 && !this.tab[1].loaded) {
					this.user_events()
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
				if(this.$route.name!='user')return;
				this.busy=true;
				api.user_event(this.id, this.e_offset).then(res => {
					res = res.data;
					res.events = this.events.events.concat(res.events);
					for(var i in res.events) {
						res.events[i].json = this.s2j(res.events[i].json)
					}
					this.tab[1].loaded = true;
					this.events = res;
					this.e_offset = this.events.events.length;
					this.busy=res.more?false:true
				})
			},
			likevents(item){
				api.program_like(item.info.commentThread.id, item.info.liked ? 0 : 1).then(res => {
					if(res.data.code != 200) return;
					item.info.liked = !item.info.liked;
					item.info.liked ? item.info.likedCount++ : item.info.likedCount--
				})
			},
			s2j(v) {
				return JSON.parse(v)
			},
			emoji(str) {
				return utils.emoji(str)
			},
			sharetype(v) {
				if(v.playlist) {
					return "歌单"
				} else if(v.song) {
					return "单曲"
				} else if(v.mv) {
					return "MV"
				} else if(v.video) {
					return "短视频"
				}
			}
		},
		computed: {
			st() {
				var t = this.cw * 0.62 - 40;
				return this.scrolltop > t ? t : 0
			},
			opa() {
				return this.scrolltop / this.cw * 10
			},
			title() {
				return this.scrolltop > this.cw* 0.5 ? '' : ' ';
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
		padding-top: 62%;
	}
	
	.stfixed #artist_header {
		position: fixed;
		margin-top: 0;
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
	
	.ahw_btn {
		margin-top: 1em;
	}
	
	.user_about {
		padding: .5em;
		color: #666;
	}
	
	.user_about span {
		color: #333;
	}
	
	.fmh_name a {
		color: blue;
	}
	
	.rm_cnt .flex-image {
		background-color: #efefef;
		margin-top: .5em;
	}
	
	.rm_cnt .fl-image {
		margin: .5em;
	}
	
	.tl_cnt {
		flex: 1;margin: 0;
	}
</style>