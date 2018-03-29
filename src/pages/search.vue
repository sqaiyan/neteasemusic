<template>
	<div v-infinite-scroll="loadmore" infinite-scroll-disabled="busy" style="padding-top:82px;">
		<div id="searcheader">
			<form @submit.prevent="search(true,false)">
				<label><input type="search" v-model="value" required autofocus="autofocus" @input="search_sug" placeholder="搜索音乐、电台、歌手"/><span @click="$router.back()">取消</span></label>
			</form>
			<tab :class="(!value||!loaded?'rehide':'')" :tabs="tab" :tabidx="cur" v-on:switchtab="switchtab"></tab>
		</div>
		<div id="suggest" v-show="value&&focus&&suggest.order">
			<div v-if="suggest['artists']" class="sr_lists flexlist flex-center" @click="searchFkey(suggest['artists'][0].name)">
				<div class="flexnum"><img src="../../static/images/cm2_list_icn_search@2x.png" alt="" /></div>
				<div class="flexlist">
					<div class="flexmain">{{suggest['artists'][0].name}}</div>
				</div>
			</div>
			<div class="sr_lists flexlist flex-center" v-if="suggest['songs']" @click="searchFkey((re.artists[0].name+re.name))" v-for="(re,idx) in suggest['songs']">
				<div class="flexnum"><img src="../../static/images/cm2_list_icn_search@2x.png" alt="" /></div>
				<div class="flexlist">
					<div class="flexmain">{{re.artists[0].name}} {{re.name}}</div>
				</div>
			</div>
		</div>
		<div id="hot" v-show="!value||!loaded">
			<div class="sm_title">热门搜索</div>
			<div class="hot_list">
				<span @click="searchFkey(re.first)" v-for="(re,idx) in hot">{{re.first}}</span>
			</div>
		</div>
		<div id="recent" v-show="!value||!loaded">
			<div class="sm_title">历史搜索 <span class="smt_right" @click="clearecent(1)"><img src="../../static/images/cm2_act_delete@2x.png" alt="" /></span></div>
			<div class="sr_lists flexlist flex-center ml" @click="searchFkey(re)" v-for="(re,idx) in recent">
				<div class="flexlist">
					<div class="flexnum"><img src="../../static/images/cm2_list_search_time@2x.png" alt="" /></div>
					<div class="flexmain">{{re}}</div>
					<div class="flexact" @click.stop="clearecent(0,idx)">
						<img src="../../static/images/cm2_playlist_icn_dlt@2x.png" alt="" />
					</div>
				</div>
			</div>
		</div>
		<div :class="(!value||!loaded?'rehide':'')">
			<mt-tab-container v-model="cur" swipeable>
				<mt-tab-container-item id="0">
					<div v-if="multimatch">
						<div class="gray_title">最佳匹配</div>
						<div v-for="item in multimatch.orders">
							<router-link :to="{name:item,params:{id:re.id},query:{img:re.picId_str||re.picId||re.pic}}" :class="'flexlist flex-image '+item" v-for="re in multimatch[item]" :key="re.id">
								<div class="flexlist">
									<div class="flexleft fl-image">
										<img :src="(re.picUrl||re.cover||re.avatarUrl||re.coverUrl)+'?param=100y100'" class="album_cover" />
									</div>
									<div class="flexmain">
										<div>{{item|mo2name}}：{{re.name||re.nickname||re.title}} <span class="fm_tdes" v-if="re.trans">({{re.trans}})</span></div>
										<div class="relistdes" v-if="re.artistName">{{re.artistName}}</div>
									</div>
									<div class="flexact">
										<img src="../../static/images/cm2_runfm_icn_arr@2x.png" class="fa_list " width="12" alt="" />
									</div>
								</div>
							</router-link>
						</div>
					</div>
					<songlist :list="st[0].relist.songs" :curplay="music.id" nonum="''"></songlist>
					<div class="cntloading" v-if="st[0].loaded&&!st[0].relist.songs">暂无结果</div>
					<loading v-show="!st[0].loaded||!st[0].none"></loading>
				</mt-tab-container-item>
				<mt-tab-container-item id="1" class="artists ">
					<router-link :to="{name: 'artist',params:{id:re.id},query:{img:re.picId}}" class="flexlist flex-image" v-for="re in st[1].relist.artists" :key="re.id">
						<div class="flexleft fl-image">
							<img :src="re.img1v1Url+'?param=100y100'" class="album_cover" />
						</div>
						<div class="flexlist">
							<div class="flexmain">
								<div>{{re.name}}
									<span class="fm_tdes" v-if="re.trans">({{re.trans}})</span>
								</div>
							</div>
						</div>
					</router-link>
					<div class="cntloading" v-if="st[1].loaded&&!st[1].relist.artists">暂无结果</div>
					<loading v-show="!st[1].loaded||!st[1].none"></loading>
				</mt-tab-container-item>
				<mt-tab-container-item id="2" class="albums ">
					<router-link :to="{name: 'album',params:{id:re.id},query:{img:re.picId||re.pic}}" class="flexlist flex-image" v-for="re in st[2].relist.albums" :key="re.id">
						<div class="flexleft fl-image">
							<img :src="re.picUrl+'?param=100y100'" class="album_cover" />
							<img class="albums_cover" src="../../static/images/a6l.png" />
						</div>
						<div class="flexlist">
							<div class="flexmain">
								<div>{{re.name}}
									<span class="fm_tdes" v-if="re.alias.length">({{...re.alias}})</span>
								</div>
								<div class="relistdes">{{re.artist.name}}
									<span v-if="re.artist.alias.length">({{...re.artist.alias}})</span>
								</div>
							</div>
						</div>
					</router-link>
					<div class="cntloading" v-if="st[2].loaded&&!st[2].relist.albums">暂无结果</div>
					<loading v-show="!st[2].loaded||!st[2].none"></loading>
				</mt-tab-container-item>
				<mt-tab-container-item id="3" class="playlist ">
					<pl :list="st[3].relist.playlists"></pl>
					<div class="cntloading" v-if="st[3].loaded&&!st[3].relist.playlists">暂无结果</div>
					<loading v-show="!st[3].loaded||!st[3].none"></loading>
				</mt-tab-container-item>
				<mt-tab-container-item id="4">
					<div class="flex-boxlist mvs flex-two">
						<router-link :to="{name:'mv',params:{id:re.id}}" class="tl_cnt" v-for="re in st[4].relist.mvs" :key="re.id">
							<div class="cover">
								<div class="img_playcount">
									<img src="../../static/images/video.png" style="height:20rpx;width:28rpx;" />{{re.playCount}}</div>
								<img :src="re.cover+'?param=320y180'" class="mv_cover" />
							</div>
							<div class="tl_info">
								<div>{{re.name}}</div>
								<div class="tli_des">{{re.artistName}}</div>
							</div>
						</router-link>
					</div>
					<div class="cntloading" v-if="st[4].loaded&&!st[4].relist.mvs">暂无结果</div>
					<loading v-show="!st[4].loaded||!st[4].none"></loading>
				</mt-tab-container-item>
				<mt-tab-container-item id="5">
					<div class="sm_title" v-if="st[5].relist.djRadios">电台</div>
					<router-link :to="{name:'radio',params:{id:re.id}}" class="flexlist flex-image" v-for="re in st[5].relist.djRadios" :key="re.id">
						<div class="flexleft fl-image">
							<img :src="re.picUrl+'?param=100y100'" class="album_cover" />
						</div>
						<div class="flexlist">
							<div class="flexmain">
								<div>{{re.name}}</div>
								<div class="relistdes">{{re.dj.nickname}}</div>
							</div>
						</div>
					</router-link>
					<div class="sm_title" v-if="st[5].relist.djprograms">节目</div>
					<router-link :to="{name:'program',params:{id:re.id}}" class="flexlist flex-image" v-for="re in st[5].relist.djprograms" :key="re.id">
						<div class="flexleft fl-image">
							<img :src="re.coverUrl+'?param=100y100'" class="album_cover" />
						</div>
						<div class="flexlist">
							<div class="flexmain">
								<div>{{re.name}}</div>
								<div class="relistdes">{{re.dj.brand}} {{'Vol.'+re.serialNum}}</div>
							</div>
						</div>
					</router-link>
					<div class="cntloading" v-if="st[5].loaded&&!st[5].relist.djprograms">暂无结果</div>
					<loading v-show="!st[5].loaded||!st[5].none"></loading>
				</mt-tab-container-item>
				<mt-tab-container-item id="6" class="userprofiles">
					<router-link :to="{name:'user',params:{id:re.userId}}" class="flexlist flex-image" v-for="re in st[6].relist.userprofiles" :key="re.id">
						<div class="flexleft fl-image">
							<img :src="re.avatarUrl+'?param=100y100'" class="user_avator" />
						</div>
						<div class="flexlist">
							<div class="flexmain">
								<div>{{re.nickname}}
									<img src="../../static/images/cm2_pro_icn_boy@2x.png" v-if="re.gender==1" />
									<img src="../../static/images/cm2_pro_icn_girl@2x.png" v-if="re.gender!=1" />
								</div>
								<div class="relistdes">{{re.signature}}</div>
							</div>
						</div>
					</router-link>
					<div class="cntloading" v-if="st[6].loaded&&!st[6].relist.userprofiles[0]">暂无结果</div>
					<loading v-show="!st[6].loaded||!st[6].none"></loading>
				</mt-tab-container-item>
			</mt-tab-container>
		</div>

	</div>
</template>

<script>
	import { mapState } from 'vuex'
	import api from "@/api"
	import {
		Toast
	} from 'mint-ui';
	import st from "@/assets/searchtype.js";
	import u from "@/utils.js"
	export default {
		name: 'search',
		data() {
			return {
				recent_s: [],
				cur: '0',
				songs: {},
				tab: st,
				loaded: false,
				st: u.clone(st),
				prevalue: '',
				value: "",
				suggest: {
					artists: [{
						name: ''
					}],
					songs: []
				},
				hot: [],
				busy: true,
				focus: false,
				multimatch: {},
				recent: JSON.parse(localStorage.getItem('recent')) || {}
			}
		},
		activated() {
			this.busy = false;
		},
		deactivated() {
			this.busy = true
		},
		created() {
			var k = this.$route.query.key;
			this.value = k;
			k && this.search(k, false, false);
			api.search_hot().then(res => {
				this.hot = res.data.result.hots || []
			})
		},
		watch: {
			'cur' (n, o) {
				//监控tab切换
				if(!this.st[n].loaded) {
					this.search(false, false)
				}
			}
		},
		methods: {
			loadmore() {
				if(this.$route.name != 'search') return;
				this.search(false, true)
			},
			switchtab(index) {
				this.cur = index.toString()
			},
			searchFkey(v) {
				this.value = v;
				this.search();
			},
			clearecent(all = false, i = 0) {
				if(all) {
					this.recent = {}
				} else {
					this.$delete(this.recent, i);
				}
				localStorage.setItem("recent", JSON.stringify(this.recent));
			},
			search_sug() {
				this.focus = true;
				if(!this.value) return
				api.search_suggest(this.value).then(res => {
					this.suggest = res.data.result || {};
				})
			},
			search(notw = true, more = false) {
				//关键词,是否是新搜索，是否是更多搜索
				notw && (this.st = u.clone(st));
				var curt = this.st[this.cur];
				if(curt.none || !this.value) return;
				this.busy = true;
				(curt.type == 1) && notw && api.search_multimatch(this.value, curt.type).then(res => {
					this.multimatch = res.data.result
				})
				api.search(this.value, curt.type, curt.offset).then(res => {
					res = res.data.result;
					this.loaded = true;
					this.focus = false;
					this.prevalue = this.value;
					var rarry = res.songs || res.artists || res.albums || res.playlists || res.mvs || res.djprograms || res.userprofiles || [];
					var size = res.songCount || res.artistCount || res.albumCount || res.playlistCount || res.mvCount || res.djprogramCount || res.userprofileCount;
					size = size ? size : 0;
					curt.offset += rarry.length;
					curt.loaded = true
					curt.none = ((curt.offset >= size) || rarry.length < 20) ? true : false;
					if(more) {
						this.cur == 0 && (curt.relist.songs = curt.relist.songs.concat(res.songs))
						this.cur == 1 && (curt.relist.artists = curt.relist.artists.concat(res.artists))
						this.cur == 2 && (curt.relist.albums = curt.relist.albums.concat(res.albums))
						this.cur == 3 && (curt.relist.playlists = curt.relist.playlists.concat(res.playlists))
						this.cur == 4 && (curt.relist.mvs = curt.relist.mvs.concat(res.mvs))
						this.cur == 5 && (curt.relist.djprograms = curt.relist.djprograms.concat(res.djprograms))
						this.cur == 6 && (curt.relist.userprofiles = curt.relist.userprofiles.concat(res.userprofiles))
					} else {
						let t = true;
						for(let i in this.recent) {
							if(this.recent[i] == this.value) {
								t = false
							}
						}
						t && (this.recent[new Date().getTime()] = this.value);
						localStorage.setItem("recent", JSON.stringify(this.recent))
						curt.relist = res;
					}
					this.st[this.cur] = curt;
					this.busy = false;
				});
			},
			urltn(str) {
				if(!str) return "";
				str = str.split("/");
				str = str[str.length - 1];
				return str.split(".")[0];
			}
		},
		filters: {
			mo2name(v) {
				switch(v) {
					case "mv":
						return 'MV';
					case 'radio':
						return "电台";
					case "album":
						return "专辑";
					case "artist":
						return "歌手";
					case "user":
						return "用户";
					case "video":
						return "视频";
				}
			}
		},
		computed: {
			...mapState([
				'music'
			])
		}
	}
</script>

<style scoped>
	#searcheader {
		position: fixed;
		z-index: 10;
		width: 100%;
		top: 0;
		max-width: 750px;
	}
	
	#searcheader form {
		background: #BB2C08;
		color: #fff;
	}
	
	.rehide {
		visibility: hidden;
	}
	
	.mint-button--default.is-plain {
		border: none;
		color: #fff;
	}
	
	#searcheader label {
		display: flex;
		flex: 1;
		padding: 6px;
		line-height: 28px
	}
	
	#searcheader span {
		padding-left: 8px
	}
	
	#searcheader input {
		flex: 1;
		border: none;
		height: 28px;
		border-radius: 2em;
		color: #333;
		background: #fff;
		padding: 0 1em;
		background: url(../../static/images/cm2_list_icn_search@2x.png) 8px center no-repeat #fff;
		padding-left: 30px;
		-webkit-background-size: auto 16px;
		background-size: auto 16px;
	}
	
	.sr_lists img {
		height: 2.6em;
	}
	
	.smt_right {
		float: right;
		width: 2em;
	}
	
	.sr_lists .flexnum {
		flex: 0 0 1.8em;
		text-align: left;
	}
	
	.sr_lists .flexnum img {
		height: 1.2em
	}
	
	.hot_list {
		overflow: hidden;
		padding: 1em;
	}
	
	.hot_list span {
		display: inline-block;
		height: 32px;
		margin-right: 8px;
		margin-bottom: 8px;
		padding: 0 14px;
		font-size: 14px;
		line-height: 32px;
		color: #333;
		border: 1px solid #dfdfdf;
		border-radius: 2em;
	}
	
	#suggest {
		position: absolute;
		top: 40px;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 10;
		background-color: #fff;
	}
	
	#suggest .flexlist .flexlist {
		padding: .7em 0;
	}
	
	.flexlist:last-child .flexlist {
		border-bottom: 1px solid #e1e2e3;
	}
	
	#suggest .flexnum {
		padding-left: .5em;
	}
	
	.gray_title {
		padding: 1% 2% 0;
		color: #999;
		font-size: .8em;
		line-height: 2;
	}
</style>