<template>
	<div v-infinite-scroll="getplaylist" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
		<div id="hqpl" v-show="hiqulity.name">
			<div class="blurbg album_cover" :style="{'background-image':'url('+(hiqulity.coverImgUrl)+'?param=500y500)','background-color':'#eee'}"></div>
			<router-link :to="{name: 'hqplaylist'}" class="flexlist flex-image">
				<div class="flexleft fl-image">
					<img :src="hiqulity.coverImgUrl+'?param=200y200'" class="album_cover" />
				</div>
				<div class="flexlist" style="border-bottom: none;">
					<div class="flexmain">
						<div id="hq_title"><img src="../../../../static/images/cm4_slist_icn_hot@2x.png" alt="" />精品歌单<img src="../../../../static/images/common_icon_arrow@2x.png" alt="" /></div>
						<div>{{hiqulity.name}}</div>
						<div class="relistdes">{{hiqulity.copywriter}}</div>
					</div>
				</div>
			</router-link>
		</div>
		<div id="plc_header"><span @click="catelist.isShow=true">{{catelist.checked.name}} <img src="../../../../static/images/common_icon_arrow@2x.png" height="16px" alt="" /></span>
		</div>
		<div v-if="loaded">
			<div class='flex-boxlist flex-two'>
				<div class="tl_cnt cateplaylist" v-for="item in list.playlists" :key="item.id">
					<router-link :to="{name:'playlist',params:{id:item.id},query:{img:item.coverImgId_str,name:item.name}}">
						<div class="cover">
							<img :src="item.coverImgUrl+'?param=300y300'" class="music_cover" />
							<div class="img_creator"><img src="../../../../static/images/cm2_icn_userhead@2x.png" alt=""> {{item.creator.nickname}}</div>
							<div class="img_playcount">
								<img src="../../../../static/images/p0.png" /> {{item.playCount|playcount}}</div>
						</div>
						<div class="name">{{item.name}}</div>
					</router-link>
				</div>
			</div>
		</div>
		<loading v-show="!loaded||list.more"></loading>

		<div style="height:100%" id="catewrap" v-show="catelist.isShow">
			<div class="close" @click="catelist.isShow=false" id="closecatelist"></div>
			<div id="cateall" @click="catecheck(-1)" :class="'cl_list catelist ' +(catelist.checked.name==catelist.res.all.name?'checked':'')">
				<span class="cl_ico_checked" v-if="catelist.checked.name==catelist.res.all.name"></span>{{catelist.res.all.name}}</div>
			<div class="catelist" v-for="(item,idx) in catelist.res.categories">
				<div class="cl_list cl_ico">
					<span><img :src="'../../../../static/images/cm2_discover_icn_'+idx+'@2x.png'">{{item}}</span>
				</div>
				<div :class="'cl_list '+(catelist.checked.name==re.name?'checked':'')" @click="catecheck(i)" v-if="re.category==idx" v-for="(re,i) in catelist.res.sub">
					<span class="cl_ico_hot" v-if="re.hot"></span>
					<span class="cl_ico_checked" v-if="catelist.checked.name==re.name"></span> {{re.name}}
				</div>
			</div>
		</div>

	</div>
</template>

<script>
	import api from '@/api'
	import loading from "@/components/loading"
	export default {
		name: 'playlist',
		data() {
			return {
				offset: 0,
				list: {},
				loaded: false,
				catelist: {
					checked: {},
					res: {
						all: {}
					}
				},
				hiqulity: {},
				busy: true
			}
		},
		components: {
			loading
		},
		created() {
			this.getcatelist();
		},
		activated() {
			this.busy = this.loaded ? false : true
		},
		deactivated() {
			this.busy = true
		},
		methods: {
			getcatelist() {
				api.index_plcate().then(res => {
					this.catelist = {
						isShow: false,
						res: res.data,
						checked: res.data.all
					};
					this.getplaylist(true);
					api.index_hqpl("全部").then(res => {
						this.hiqulity = res.data.playlists[0] || {}
					})
				});
			},
			getplaylist(d) {
				this.busy = true;

				api.index_playlist(this.catelist.checked.name, this.offset).then(res => {
					this.offset += res.data.playlists.length;
					if(!d) {
						res.data.playlists = this.list.playlists.concat(res.data.playlists)
					}
					this.list = res.data;
					this.loaded = true;
					this.busy = false
				}).catch(res => {
					this.loaded = true;
				})
			},
			catecheck(idx) {
				this.catelist.checked = idx < 0 ? this.catelist.res.all : this.catelist.res.sub[idx]
				this.catelist.isShow = false;
				this.offset = 0;
				this.loaded = false;
				this.getplaylist(true)
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.flex-boxlist {
		min-height: 500px;
	}
	
	#hqpl {
		position: relative;
		padding: 1em 0;
		color: #fff;
		overflow: hidden;
	}
	
	#hqpl a ,#hqpl .relistdes{
		color: #fff;
	}
	
	#hq_title img {
		height: 1.5em;
		margin-right: .5em;
	}
	#hqpl .fl-image{margin:0 1em;}
	#hq_title img:last-child {
		height: 1em;
		margin-left: .5em;
	}
	
	#hq_title {
		font-size: 1.2em;
		padding-bottom: .5em;
	}
	
	#hqpl .fl-image img {
		height: 8em;
		width: 8em;
	}
	
	#plc_header {
		overflow: hidden;
		padding: 1em 2% .5em;
	}
	
	#plc_header span {
		border: 1px solid #ddd;
		border-radius: 2em;
		line-height: 2;
		padding: 0 .5em 0 1em;
		display: inline-block;
	}
	
</style>