<template>
	<div class="page_t" v-infinite-scroll="loadmore" infinite-scroll-disabled="busy">
		<mt-header fixed title="我的收藏">
			<mt-button slot="left" @click="$router.go(-1)" icon="back"></mt-button>
		</mt-header>
		<tab :tabs="st" :tabidx="cur" v-on:switchtab="switchtab"></tab>

		<div v-show="cur=='0'">
			<router-link :to="{name:'artist',params:{id:re.id}}" v-for="re in st[0].data.data" :key="re.id" class="flexlist flex-image">
				<div class="flexleft fl-image">
					<img :src="re.picUrl+'?param=100y100'" class="album_cover" />
				</div>
				<div class="flexlist">
					<div class="flexmain">
						<div>{{re.name}} <span v-if='re.alias.length'>({{...re.alias}})</span></div>
					</div>
				</div>
			</router-link>
			<loading v-if="!st[0].loaded||st[0].data.hasMore"></loading>
		</div>

		<div v-show="cur=='1'">
			<div class="mvs">
				<router-link :to="{name: 'mv',params:{id:re.id}}" v-for="re in st[1].data.data" :key="re.id" class="flexlist flex-image">
					<div class="flexleft fl-image">
						<img :src="re.cover+'?param=320y180'" class="mv_cover" />
						<div class="img_playcount">
							<img src="../../static/images/video.png" alt="" />{{re.playCount}}</div>
					</div>
					<div class="flexlist">
						<div class="flexmain">
							<div  class="fm_title">{{re.name}}</div>
							<div class="relistdes">{{re.artistName}}</div>
						</div>
					</div>
				</router-link>
				<loading v-if="!st[1].loaded||st[1].data.hasMore"></loading>
			</div>
		</div>

		<div v-show="cur=='2'" class="mt">
			<router-link :to="{name:'radio',params:{id:re.id}}" class="flexlist flex-image zllist mvs" v-for="re in st[2].data.data" :key="re.id">
				<div class="flexleft fl-image ">
					<img :src="re.rectanglePicUrl+'?param=320y200'" class="mv_cover" />
				</div>
				<div class="flexlist">
					<div class="flexmain">
						<div class="fm_title">{{re.title}}</div>
						<div class="relistdes">by {{re.author}}　阅读 {{re.readCount}}</div>
					</div>
				</div>
			</router-link>
			<loading v-if="!st[2].loaded||st[2].data.hasMore"></loading>
		</div>
		
		<div v-show="cur=='3'" class="albums">
			<router-link :to="{name:'album',params:{id:re.id}}" class="flexlist flex-image" v-for="re in st[3].data.data" :key="re.id">
				<div class="flexleft fl-image">
					<img :src="re.picUrl+'?param=100y100'" class="album_cover" />
					<img class="albums_cover" src="../../static/images/a6l.png" />
				</div>
				<div class="flexlist">
					<div class="flexmain">
						<div>{{re.name}}</div>
						<div class="relistdes">{{re.artists[0].name}}，{{re.size}}首</div>
					</div>
				</div>
			</router-link>
			<loading v-if="!st[3].loaded||st[3].data.hasMore"></loading>
		</div>
	</div>
</template>

<script>
	import { mapState } from 'vuex'
	import api from '@/api';
	import u from "@/utils.js"
	import tab from "@/components/tabs";
	import loading from "@/components/loading"
	import playico from "@/components/playico"
	const type = [{
		name: '歌手',
		text: 0,
		t: 'artist',
		data: {
			data: []
		},
		offset: 0
	}, {
		name: 'Mv',
		text: 0,
		t: 'mv',
		data: {
			data: []
		},
		offset: 0
	}, {
		name: '专栏',
		text: 0,
		t: 'topic',
		data: {
			data: []
		},
		offset: 0
	}, {
		name: '专辑',
		text: 0,
		t: 'album',
		data: {
			data: []
		},
		offset: 0
	}]
	export default {
		name: 'simi',
		data() {
			return {
				busy: true,
				st: u.clone(type),
				cur: '0'
			}
		},
		components: {
			loading,
			playico,
			tab
		},
		created() {
			this.get();
			api.user_subcount(this.user.account.id).then(res => {
				this.st[0].text = res.data.artistCount;
				this.st[1].text = res.data.mvCount;
			})
		},
		methods: {
			get() {
				var cur = this.st[this.cur]
				api.user_sublist(cur.t, cur.offset).then(res => {
					cur.loaded = true;
					if(res.data.code != 200) return;
					cur.offset +=  res.data.data.length ;
					res.data.data = cur.data.data.concat(res.data.data);
					cur.data = res.data;
					cur.text=res.data.count
					this.st[this.cur] = cur;
					this.busy = false;
				})
			},
			switchtab(i) {
				this.cur = i;
				console.log(i);
				if(!this.st[this.cur].loaded) {
					this.get()
				}
			},
			loadmore() {
				var cur = this.st[this.cur];
				if(this.$route.name != 'sublist' || (!cur.data.hasMore && cur.loaded)) return;
				this.get()
			}
		},
		computed: {
			...mapState([
				"user"
			])
		}
	}
</script>
