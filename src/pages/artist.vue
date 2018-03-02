<template>
	<div id="fixheader" :class="{'page_t':!st,'stfixed':st}" v-infinite-scroll="loadmore" infinite-scroll-disabled="busy">
		<mt-header id="artheader" fixed :title="art.artist.name||'歌手'">
			<mt-button slot="left" @click="$router.go(-1)" icon="back"></mt-button>
			<playico slot="right"></playico>
		</mt-header>
		<div id="artist_header" ref="main" :style="{top:-st+'px'}">
			<img src="../../static/images/cm2_default_artist_banner@2x.jpg" />
			<img id="art_cover" :src="(cover||art.artist.picUrl)+'?param=640y520'" :style="{'filter':'blur('+opa+'px) brightness(.8)'} " />
			<div id="ahw_wrap">
				<div class="ahw_btn" :style="{'visibility':(opa1>.7?'visible':'hidden')}">
					<img src="../../static/images/cm2_vehicle_icn_subscribe@2x.png" v-if="!art.artist.followed" alt="" />
					<img src="../../static/images/cm2_vehicle_icn_subscribed@2x.png" v-else alt="" /> {{art.artist.followed?'已':''}}收藏
				</div>
			</div>
		</div>
		<tab :tabs="tab" :tabidx="cur" v-on:switchtab="switchtab" class="tab-split"></tab>
		<div id="art_main">
			<div class="tab_cnt" v-show="cur==0">
				<songlist :list="art.hotSongs" v-on:playindex="playindex" :curplay="music.id"></songlist>
				<div v-if="art.more">
					<div url="" class="cntloading">查看所有曲目></div>
				</div>
				<loading v-if="!loaded"></loading>
			</div>
			<div class="tab_cnt " v-show="cur==1">
				<router-link :to="{name:'album',params:{id:re.id}}" v-for="re in tab[1].album.hotAlbums" :key="re.id" class="flexlist flex-image albums">
					<div class="flexleft fl-image">
						<img :src="(re.picUrl||'../../static/images/a6l.png')+'?param=100y100'" class="music_cover" />
						<img class="albums_cover" src="../../static/images/a6l.png" />
					</div>
					<div class="flexlist">
						<div class="flexmain">
							<div>{{re.name}}
								<span v-if="re.alias[0]">({{re.alias[0]}})</span>
							</div>
							<div class="relistdes">{{re.publishTime|artptime}} 歌曲{{re.size|playcount}}
							</div>
						</div>
					</div>
				</router-link>
				<loading v-if="!tab[1].loaded||tab[1].album.more"></loading>
			</div>
			<div class="tab_cnt" v-show="cur==2">
				<div class="flex-boxlist mvs flex-two">
					<router-link :to="{name: 'mv',params:{id:re.id}}" :key="re.id" v-for="re in tab[2].mvs.mvs" class="tl_cnt">
						<div class="cover">
							<div class="img_playcount">
								<img src="../../static/images/video.png" />{{re.playCount|playcount}}</div>
							<img :src="re.imgurl16v9+'?param=320y180'" class="mv_cover" />
						</div>
						<div class="tl_info">
							<div>{{re.name}}</div>
							<div class="tli_des">{{re.artistName}}</div>
						</div>
					</router-link>
				</div>
				<loading v-if="!tab[2].loaded||tab[2].text>tab[2].mvs.mvs.length"></loading>
			</div>
			<div class="tab_cnt" v-show="cur==3">
				<div v-if="tab[3].loaded">
					<div class="listheader">
						<span>歌手简介</span>
					</div>
					<span class="detail_des">{{tab[3].desc.briefDesc||'暂无简介'}}</span>
					<div class="cntloading" id="descallbtn" @click="popupVisibleDesc=true" v-if="tab[3].desc.introduction.length">查看完整介绍>
					</div>

					<div v-if="tab[3].desc.topicData">
						<div class="listheader">
							<span>相关专栏</span>
						</div>
						<router-link :to="{name:'topicDetail',params:{id:re.id}}" class="flexlist flex-image mvs" v-for="re in tab[3].desc.topicData" @click="topicDetail(re)">
							<div class="flexleft fl-image">
								<img :src="re.rectanglePicUrl+'?param=320y180'" class="mv_cover" />
							</div>
							<div class="flexlist">
								<div class="flexmain">
									<div class="fm_title">{{re.mainTitle}}</div>
									<div class="relistdes">by{{re.creator.nickname}}　阅读{{re.readCount|playcount}}</div>
								</div>
							</div>
						</router-link>
					</div>

					<div class="listheader" v-if="tab[3].artists.artists.length">
						<span>相似歌手</span>
					</div>
					<div id="simiwrap">
						<div class="flex-boxlist" :style="{'width':cw/4*tab[3].artists.artists.length+'px'}">
							<router-link replace :style="{'flex':'0 0 '+cw*0.21+'px','margin':'.5em '+(cw*0.02)+'px .5em'}" redirect :to="{name:'artist',params:{id:item.id}}" :key="item.id" class="tl_cnt" v-for="item in tab[3].artists.artists">
								<div class="cover">
									<img :src="item.img1v1Url+'?param=100y100'" class="music_cover" />
								</div>
								<span>{{item.name}}</span>
							</router-link>
						</div>
					</div>
				</div>
				<loading v-else></loading>
			</div>
		</div>
		<!-- 歌手详情介绍 -->
		<mt-popup v-model="popupVisibleDesc" position="right">
			<mt-header fixed title="歌手介绍">
				<mt-button slot="left" @click="popupVisibleDesc=false" icon="back"></mt-button>
			</mt-header>
			<div class="pop_cnt">
				<div class="listheader" id="pop_hasheader">
					<span>歌手简介</span>
				</div>
				<span class="detail_des">{{tab[3].desc.briefDesc}}</span>
				<div v-for="item in tab[3].desc.introduction">
					<div class="listheader" v-if="item.ti">
						<span>{{item.ti}}</span>
					</div>
					<span class="detail_des">{{item.txt}}</span>
				</div>
			</div>
		</mt-popup>
		<!-- 相关专栏详情 -->
		<mt-popup v-model="popupVisibleTopic" position="right">
			<mt-header fixed :title="topic.title">
				<mt-button slot="left" @click="popupVisibleTopic=false" icon="back"></mt-button>
			</mt-header>
			<div class="pop_cnt">
				<div class="topic_header">
					<h2>{{topic.mainTitle}}</h2>
					<p>{{topic.addTime|time}}　阅读：{{topic.readCount|playcount}}</p>
					<p><img :src="topic.creator.avatarUrl+'?param=30y30'" class="user_avator" :alt="topic.creator.nickname" />　{{topic.creator.nickname}}</p>
				</div>
				<div v-for="item in topic.topic.content" :class="'detail_des des_'+item.type">
					<!-- 电台 -->
					<topicontent v-if="item.type==5" :type="item.type" :tid="item.id"></topicontent>
					<!--歌单-->
					<topicontent v-if="item.type==4" :type="item.type" :tid="item.id"></topicontent>
					<!--单曲-->
					<topicontent v-if="item.type==3" :type="item.type" :tid="item.id"></topicontent>
					<!--标题-->
					<span v-if="item.type==7">{{item.content}}</span>
					<div v-if="item.type==13&&item.content" v-html="item.content"></div>
				</div>
			</div>
		</mt-popup>
	</div>
</template>

<script>
	import api from '@/api';
	import loading from "@/components/loading";
	import tab from "@/components/tabs";
	import bs64 from "@/base64";
	import playico from "@/components/playico"
	import songlist from "@/components/songlist";
	import utils from "@/utils"
	import { mapState } from 'vuex'
	import topicontent from "@/components/topicontent"
	const tabcnt = [{
		name: '热门50',
		loaded: false
	}, {
		name: '专辑',
		album: {
			hotAlbums: []
		},
		text: 0,
		offset: 0,
		loaded: false
	}, {
		name: 'MV',
		text: 0,
		offset: 0,
		mvs: {
			mvs: []
		},
		loaded: false
	}, {
		name: '歌手信息',
		desc: {},
		artists: {
			artists: []
		},
		loaded: false
	}]
	export default {
		name: 'artist',
		data() {
			return {
				cur: '0',
				id: -1,
				cover: "",
				popupVisibleDesc: false,
				popupVisibleTopic: false,
				topic: {
					creator: {},
					topic: {}
				},
				busy: false,
				loaded: false,
				art: {
					artist: {}
				},
				tab: utils.clone(tabcnt)
			}
		},
		components: {
			songlist,
			tab,
			loading,
			playico,
			topicontent
		},
		beforeRouteEnter: (to, from, next) => {
			next(vm => {
				if(parseInt(to.params.id) !== parseInt(vm.id)) {
					vm.loaded = false;
					vm.id = vm.$route.params.id;
					vm.cover = "";
					vm.cur = "0"
					var img = vm.$route.query.img;
					img && (vm.cover = bs64.id2Url(img));
					vm.art = {
						artist: {}
					}
					vm.tab = utils.clone(tabcnt);
					vm.load();
				}
			})
		},
		beforeRouteUpdate(to, from, next) {
			next();
			this.loaded = false;
			this.id = to.params.id;
			this.cover = "";
			this.cur = "0"
			var img = to.query.img;
			img && (this.cover = bs64.id2Url(img));
			this.art = {
				artist: {}
			}
			this.tab = utils.clone(tabcnt);
			this.load();
		},
		methods: {
			switchtab(index) {
				this.cur = index.toString();
				if(this.cur == 1 && !this.tab[1].loaded) {
					this.loadAlbum(false)
				}
				if(this.cur == 2 && !this.tab[2].loaded) {
					this.loadMvs(false)
				}
				if(this.cur == 3 && !this.tab[3].loaded) {
					api.artist_desc(this.id).then(res => {
						this.tab[3].loaded = true;
						this.tab[3].desc = res.data;
						api.artist_simi(this.id).then(res => {
							res.data.code == 200 && (this.tab[3].artists = res.data)
						})
					})
				}
			},
			loadAlbum(more = true) {
				this.tab[1].busy = true
				api.artist_album(this.id, this.tab[1].offset).then(res => {
					this.tab[1].offset += res.data.hotAlbums.length;
					this.tab[1].busy = false;
					res.data.hotAlbums = this.tab[1].album.hotAlbums.concat(res.data.hotAlbums)
					this.tab[1].album = res.data
					this.tab[1].loaded = true
				})
			},
			loadMvs(more = true) {
				this.tab[2].busy = true;
				api.artist_mv(this.$route.params.id, this.tab[2].offset).then(res => {
					this.tab[2].offset += res.data.mvs.length;
					this.tab[2].busy = false;
					res.data.mvs = this.tab[2].mvs.mvs.concat(res.data.mvs)
					this.tab[2].mvs = res.data
					this.tab[2].loaded = true
				})
			},
			load() {
				this.id = this.$route.params.id
				api.artist(this.$route.params.id).then(res => {
					this.loaded = true;
					this.art = res.data;
					this.tab[1].text = res.data.artist.albumSize;
					this.tab[2].text = res.data.artist.mvSize
				}).catch(() => {
					this.loaded = true
				});
			},
			loadmore() {
				if(this.$route.name != 'artist') return;
				if((this.cur == 1) && this.tab[1].album.more && !this.tab[2].busy) {
					this.loadAlbum()
				}
				if((this.cur == 2) && (this.tab[2].text > this.tab[2].mvs.mvs.length) && !this.tab[2].busy) {
					this.loadMvs()
				}
			},
			playindex(i) {
				this.$store.commit("setplaytype", 1);
				this.$store.commit("setplaylist", this.art.hotSongs);
				this.$store.commit("playindex", i);
			}
		},
		computed: {
			st() {
				var t = this.cw * 0.62 - 40;
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
		},
		filters: {
			artptime(v) {
				let t = new Date(v);
				return t.getFullYear() + '.' + (t.getMonth() + 1) + '.' + t.getDate()
			}
		}
	}
</script>

<style scoped>
	.blurbg {
		transform: scale(1)
	}
	
	.stfixed {
		padding-top: 62%;
	}
	
	.stfixed #artist_header {
		position: fixed;
		margin-top: 0;
	}
	
	.tab {
		margin-bottom: 1%;
	}
	
	#descallbtn {
		color: #999
	}
	
	.mvs .cover {
		padding-top: 56.2%
	}
	
	
	
	#simiwrap {
		overflow: hidden;
		overflow-x: auto;
	}
	
	.mint-popup {
		height: 100%;
		position: fixed;
	}
	
	.pop_cnt {
		padding-top: 50px;
		height: 100%;
		overflow: auto;
		word-break: break-all;
		box-sizing: border-box
	}
	
	#simiwrap .tl_cnt {
		width: 20%;
		text-align: center;
		flex: 0 0 21%;
		margin-left: 2%;
		margin-right: 2%;
	}
	
	
</style>