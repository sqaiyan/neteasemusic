<template>
	<div class="page_t">
		<mt-header fixed title="相似推荐">
			<mt-button slot="left" @click="$router.go(-1)" icon="back"></mt-button>
			<playico slot="right"></playico>
		</mt-header>
		<loading v-if="!loaded"></loading>
		<div v-if="pl.length">
			<div class="sm_title">包含这首歌的歌单</div>
			<div class='flex-boxlist'>
				<div class="tl_cnt" v-for="re in pl">
					<router-link :to="{name:'playlist',params:{id:re.id},query:{img:re.coverImgId_str||re.coverImgId}}">
						<div class="cover">
							<img :src="re.coverImgUrl+'?param=200y200'" class="music_cover" />
							<div class="img_playcount">
								<img src="../../static/images/p0.png" alt="" />{{re.playCount}}</div>
						</div>
						<div class="tl_info">
							<div>{{re.name}}</div>
							<div class="tli_des">{{re.creator.nickname}}</div>
						</div>
					</router-link>
				</div>
			</div>
		</div>
		<div v-if="songs.length">
			<div class="sm_title">喜欢这首歌的人也喜欢听</div>
			<div class="'songs ml ">
				<router-link :to="{name:'playing',params:{id:re.id},query:{img:re.picId_str||re.picId||re.pic}}" v-for="(re,idx) in songs" :class="'flexlist flex-image '+(re.id==music.id?'cur':'')" :key="re.id">
					<div class="flexlist flex-center">
						<div class="flexleft" v-if="re.id==music.id">
							<img src="../../static/images/aal.png" alt="" />
						</div>
						<div class="flexmain">
							<div>{{re.name}}</div>
							<div class="relistdes">{{re.artists[0].name}}-{{re.album.name}}</div>
						</div>
						<div class="flexact">
							<router-link :to="{name:'mv',params:{id:re.mvid}}" class="fa_list fa_mv" v-if="re.mvid!=0">
								<img src="../../static/images/l0.png" />
							</router-link>
						</div>
					</div>
				</router-link>
			</div>
		</div>
		<div v-if="simiusr.length">
			<div class="sm_title">喜欢这首歌的人</div>
			<div class="userprofiles">
				<router-link :to="{name:'user',params:{id:re.userId}}" v-for="re in simiusr" :key="re.id" class="flexlist flex-image">
					<div class="flexleft fl-image">
						<img :src="re.avatarUrl+'?param=100y100'" class="user_avator" />
					</div>
					<div class="flexlist">
						<div class="flexmain">
							<div>{{re.nickname}} <img :src="'../../static/images/cm2_pro_icn_'+(re.gender?'boy':'girl')+'@2x.png'" alt="" /></div>
							<div class="relistdes">{{re.recommendReason}}</div>
						</div>

					</div>
				</router-link>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapState } from 'vuex'
	import api from '@/api';
	import bs64 from "@/base64";
	import loading from "@/components/loading"
	import playico from "@/components/playico"
	import songlist from "@/components/songlist";
	export default {
		name: 'simi',
		data() {
			return {
				loaded: false,
				pl: [],
				songs: [],
				simiusr: [],
				id: 0
			}
		},
		components: {
			songlist,
			loading,
			playico
		},
		beforeRouteEnter: (to, from, next) => {
			next(vm => {
				if(to.params.id !== vm.id) {
					vm.getsimi()
				}
			})
		},
		methods: {
			getsimi() {
				this.loaded = false;
				this.pl = [];
				this.songs = []
				this.simiusr = [];
				this.id = this.$route.params.id
				api.simi(this.$route.params.id).then(res => {
					this.pl = res[0]
					this.songs = res[1]
					this.simiusr = res[2];
					this.loaded = true
				})
			}

		},
		computed: {
			...mapState([
				"music"
			])
		}
	}
</script>