<template>
	<div class="songs">
		<loading v-show="loading"></loading>
		<router-link :to="{name:linktype,params:{id:tid}}" class="flexlist flex-image topicfl"  v-if="topic.id">
			<div class="flexleft fl-image">
				<img :src="(topic.coverUrl||topic.coverImgUrl||topic.al.picUrl)+'?param=100y100'" class="music_cover " />
			</div>
			<div class="flexmain">
				<div class="fm_title">{{topic.name}}
				</div>
				<div class="relistdes"><span class="tags" v-if="type!=3">{{type==5?topic.radio.category:'歌单'}}</span>
					<span v-if="type==3">{{topic.ar[0].name}}</span>
					<span v-if="type==4">{{topic.creator.nickname}},{{type}}</span>
					<span v-if="type==5">by{{topic.dj.nickname}}</span>
				</div>
			</div>
		</router-link>
	</div>
</template>

<script>
	import api from '@/api';
	import { mapState } from 'vuex'
	import loading from "@/components/loading"
	export default {
		name: 'topicontent',
		data() {
			return {
				topic: {
					radio: {},
					al: {},
					ar: [{}],
					dj: {},
					creator: {}
				},
				loading: true
			}
		},
		componentes: {
			loading
		},
		props: {
			type: Number,
			tid: Number
		},
		methods: {
			getDetail() {
				if(this.type == 5) {
					api.program_detail(this.tid).then(res => {
						(res.data.code==200)&&(this.topic = res.data.program);
						this.loading = false
					})
				} else if(this.type == 4) {
					api.playlist(this.tid, 0).then(res => {
						this.topic = res.data.playlist;
						this.loading = false
					})
				} else if(this.type == 3) {
					api.music_detail(this.tid).then(res => {
						this.topic = res.data.songs[0];
						this.loading = false
					})
				}
			}
		},
		created() {
			this.getDetail()
		},
		computed: {
			linktype() {
				switch(this.type) {
					case 3:
						return "playing"
						break;
					case 4:
						return "playlist"
						break;
					case 5:
						return "program"
						break;
				}
			},
			...mapState([
				"music"
			])
		}
	}
</script>
<style>
	
</style>