<template>
	<div class="page_t" v-infinite-scroll="get" infinite-scroll-disabled="busy">
		<mt-header fixed title="精品歌单">
			<mt-button slot="left" @click="$router.go(-1)" icon="back"></mt-button>
			<playico slot="right"></playico>
		</mt-header>
		<div class="tab"><span class="ml">{{checked}}</span><span class="pw" @click="cateshow=true"><img src="/static/images/cm2_list_icn_filter@2x.png" alt="" /> 筛选</span></div>
		<div class='flex-boxlist flex sortlist'>
			<router-link class=" flexlist " :to="{name: 'playlist',query:{name: re.name},params: { id: re.id}}" v-for="re in list.playlists" :key="re.id">
				<div class="cover flexleft fl-image">
					<div class="hqico cover_ico" v-if="re.highQuality"></div>
					<img class="album_cover" :src="re.coverImgUrl+'?param=200y200'" />
				</div>
				<div class="flexlist tl_info">
					<div class="sort_fl_list ">
						{{re.name}}
					</div>
					<div class="tli_des">by{{re.creator.nickname}}</div>
					<div class="tli_des tag_des"><span class="tags">{{re.tag}}</span>{{re.copywriter}}</div>
				</div>
			</router-link>
		</div>
		<loading v-show="!loaded||list.more"></loading>
		<div style="height:100%" id="catewrap" v-show="cateshow">
			<div class="close" @click="cateshow=false" id="closecatelist"></div>
			<div id="cateall" @click="catecheck('全部')" :class="'catelist cl_list '+('全部'==checked?'checked':'')">
				<span class="cl_ico_checked" v-if="checked=='全部'"></span>全部</div>
			<div class="catelist">
				<div :class="'cl_list '+(item==checked?'checked':'')" @click="catecheck(item)" v-for="(item,idx) in cate">
					<span class="cl_ico_checked" v-if="'全部'==item"></span> {{item}}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapState } from 'vuex'
	import api from '@/api';
	import loading from "@/components/loading"
	import playico from "@/components/playico"
	import songlist from "@/components/songlist";
	export default {
		name: 'playlist',
		data() {
			return {
				loaded: false,
				cateshow: false,
				list: {playlists:[]},
				cate: ['华语', '欧美', '韩语', '日语', '粤语', '小语种', '运动', 'ACG', '影视原声', '流行', '摇滚', '后摇', '古风', '民谣', '轻音乐', '电子', '器乐', '说唱', '古典', '爵士'],
				checked: "全部",
				busy:true,
				offset:0
			}
		},
		components: {
			songlist,
			loading,
			playico
		},
		created() {
			this.get()
		},
		methods: {
			get() {
				if(this.$route.name!='hqplaylist')return;
				api.index_hqpl(this.checked,this.offset).then(res => {
					this.loaded = true
					res.data.playlists=this.list.playlists.concat(res.data.playlists);
					this.list=res.data;
					this.offset=this.list.playlists.length;
					this.busy=this.list.more?false:true;
				})
			},
			catecheck(i) {
				this.cateshow = false;
				this.checked = i;
				this.offset=0;
				this.list={playlists:[]};
				this.loaded=false;
				this.get()
			}
		}
	}
</script>
<style>
	.flexlist .cover {
		flex: 0 0 32%;
		margin: 1% 0 0 0;
		padding-top: 32%;
	}
	
	.flexlist {
		width: 100%
	}
	
	.sort_fl_list {
		line-height: 2
	}
	
	.sortlist .flexlist .flexlist {
		padding: .3em;
		flex-flow: column;
		align-content: center;
		justify-content: center;
		align-items: flex-start;
	}
	
	.sort_fl_list span {
		color: #999;
	}
	
	.sortlist .tl_info .tag_des {
		padding-top: 1em;
	}
</style>