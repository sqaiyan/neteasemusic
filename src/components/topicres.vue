<template>
	<div :class="'detail_des des_'+type">
		<div v-if="type==13" v-html="resource"></div>
		<div v-if="type==7"><span>{{resource}}</span></div>
		<div v-if="type==2"><img :src="resource" alt="" /></div>
		<div v-if="type==6" class="flex-boxlist flex-one mvs">
			<!-- mv -->
			<router-link :to="{name:'mv',params:{id:resource.id}}" class="tl_cnt">
				<div class="cover">
					<div class="coverplay" style="width: 20%;">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" enable-background="new 0 0 60 60">
							<circle cx="30" cy="30" r="30" fill="#040000" fill-opacity=".3"></circle>
							<circle cx="30" cy="30" r="29" fill="none" stroke="#fff" stroke-width="2"></circle>
							<path d="m41 29l-14.7-9.8c-1-.6-2.3.1-2.3 1.3v19.3c0 1.2 1.3 1.9 2.3 1.3l14.7-10.1c1.1-.7 1.3-1.2 0-2" fill="#fff"></path>
						</svg>
					</div>
					<img :src="resource.img16v9Url+'?param=320y180'" class="music_cover" />
					<div class="img_playcount ip_leftb"><img src="../../static/images/video.png" alt="" />{{resource.playTime|playcount}}</div>
					<div class="img_playcount ip_rightb">
						<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5755" xmlns:xlink="http://www.w3.org/1999/xlink" width="12" height="12">
							<path class="st0" d="M-272,413c-0.6,0-1-0.4-1-1v-30c0.2-0.6,0.6-1,1-1s1,0.4,1,1v30C-270.8,412.6-271.4,413-272,413z" fill="#ffffff"/>
<path class="st0" d="M-262.9,413c-0.6,0-1-0.4-1-1v-19c0-0.6,0.4-1,1-1s1.2,0.4,1.2,1v19C-261.7,412.6-262.3,413-262.9,413z" fill="#ffffff"/>
<path class="st0" d="M-280.6,413c-0.6,0-1-0.4-1-1v-11.8c0-0.6,0.4-1,1-1s1,0.4,1,1V412C-279.6,412.6-280,413-280.6,413z" fill="#ffffff"/>
						
						</svg> {{resource.duration|dateS}}</div>
				</div>
			</router-link>
		</div>
		<div v-else>
			<router-link :to="{name:linktype,params:{id:resource.id}}" class="flexlist flex-image topicfl" v-if="resource.id">
				<div class="flexleft fl-image">
					<div class="coverplay">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60" enable-background="new 0 0 60 60">
							<circle cx="30" cy="30" r="30" fill="#040000" fill-opacity=".3"></circle>
							<circle cx="30" cy="30" r="29" fill="none" stroke="#fff" stroke-width="2"></circle>
							<path d="m41 29l-14.7-9.8c-1-.6-2.3.1-2.3 1.3v19.3c0 1.2 1.3 1.9 2.3 1.3l14.7-10.1c1.1-.7 1.3-1.2 0-2" fill="#fff"></path>
						</svg>
					</div>
					<img :src="(resource.coverUrl||resource.coverImgUrl||resource.picUrl||resource.album.picUrl)+'?param=100y100'" class="music_cover " />
				</div>
				<div class="flexmain">
					<div class="fm_title">{{resource.name}}
					</div>
					<div class="relistdes"><span class="tags" v-if="type!=3">{{type==4?'歌单':(resource.category||resource.radio.category)}}</span>
						<span v-if="type==3">{{resource.artists[0].name}}</span>
						<span v-if="type==4">{{resource.creator.nickname}}</span>
						<span v-if="type==5">by{{resource.dj.nickname}}</span>
					</div>
				</div>
			</router-link>
		</div>
	</div>
</template>

<script>
	import { mapState } from 'vuex';
	export default {
		name: 'topicres',
		data() {
			return {}
		},
		props: {
			type: Number,
			resource: {
				type: Object
			}
		},
		methods: {

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
					case 8:
						return "radio"
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