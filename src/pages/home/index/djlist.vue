<template>
	<div v-infinite-scroll="getdjlist" infinite-scroll-disabled="busy">

		<mt-swipe :auto="5000" v-show="djcate.categories.length">
			<mt-swipe-item v-for="item in [1,2,3]" class="djcatewrap" :key="item">
				<div bindtap="djradiotype" v-if="(idx<item*8)&&(idx>=(item-1)*8)" class="djcatelist" data-djtype="re.id" v-for="(re,idx) in djcate.categories">
					<img :src="re.pic56x56Url" class="slide-image" width="56" height="56" />
					<div>{{re.name}}</div>
				</div>
			</mt-swipe-item>
		</mt-swipe>
		<div v-show="djrecs.rec_p.name">
			<div class="listheader">{{djrecs.rec_p.name}}</div>
			<div class="playlist">
				<router-link :to="{name:'program',params:{id:re.id},query:{img:re.mainSong.album.picId_str||re.mainSong.album.picId}}" class="flexlist flex-image" v-for="re in djrecs.rec_p.programs" :key="re.id">
					<div class="flexleft fl-image">
						<img :src="re.coverUrl+'?param=100y100'" class="album_cover" />
					</div>
					<div class="flexlist">
						<div class="flexmain">
							<div>{{re.name}}</div>
							<div class="relistdes">{{re.reason}}</div>
						</div>
					</div>
				</router-link>
			</div>
		</div>
		<div v-show="djrecs.rec_d.name">
			<div class="listheader">{{djrecs.rec_d.name}}</div>
			<div class='flex-boxlist'>
				<router-link :to="{name:'radio',params:{id:item.id}}" class="tl_cnt cateplaylist" v-for="(item,idx) in djrecs.rec_d.djRadios" v-if="idx<6" :key="item.id">
					<div class="cover">
						<img :src="item.picUrl+'?param=200y200'" class="music_cover" />
					</div>
					<div class="name">{{item.copywriter}}</div>
				</router-link>
			</div>
		</div>
		<div class="listheader" v-show="djlist.length">热门电台</div>
		<div class='flex-boxlist flex-two'>
			<router-link :to="{name:'radio',params:{id:item.id}}" class="tl_cnt cateplaylist" v-for="item in djlist" :key="item.id">
				<div class="cover">
					<img :src="item.picUrl+'?param=200y200'" class="music_cover" />
					<div class="img_playcount">
						<img src='../../../../static/images/cm2_list_icn_subscribe@2x.png' />{{item.subCount|playcount}}订阅</div>
				</div>
				<div class="name">{{item.name}}</div>
			</router-link>
		</div>
		<loading v-show="!loaded||hasMore"></loading>
	</div>
</template>

<script>
	import api from '@/api'
	import loading from "@/components/loading"
	export default {
		name: 'djlist',
		data() {
			return {
				djcate: {
					categories: []
				},
				djrecs: {
					rec_p: {},
					rec_d: {}
				},
				djlist: [],
				offset: 0,
				hasMore: false,
				busy: true,
				loaded: false
			}
		},
		components: {
			loading
		},
		created() {
			this.djall();
		},
		methods: {
			djall(val) {
				api.index_dj().then(res => {
					this.djcate = res[0].data;
					this.djrecs = {
						rec_p: res[1].data,
						rec_d: res[2].data
					};
					this.loaded = true;
					this.djlist = res[3].data.djRadios
					this.offset = res[3].data.djRadios.length;
					this.hasMore = res[3].data.hasMore;
					this.busy = false;
				})
			},
			getdjlist() {
				this.busy = true
				api.index_djlist(this.offset).then(res => {
					this.offset += res.data.djRadios.length;
					res.data.djRadios = this.djlist.concat(res.data.djRadios);
					this.djlist = res.data.djRadios;
					this.hasMore = res.data.hasMore;
					this.busy = false;
				}).catch(res=>{
					console.log(res);
				})
			}
		},
		filters: {
			playcount(v) {
				if(!v) return "0";
				return v < 10e3 ? v : ((v / 10e3).toFixed(0) + '万')
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.mint-swipe {
		height: 8em;
	}
	
	.djcatewrap {
		overflow: hidden
	}
	
	.djcatelist {
		text-align: center;
		width: 25%;
		float: left;
	}
	
	.djcatelist img {
		width: auto;
		height: 2em;
		margin: .5em 0 .2em
	}
	
	.djcatelist div {
		font-size: .8em
	}
</style>