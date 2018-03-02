<template>
	<div>
		<div id="playing-status" :class="{loading:musicloading}">
			<div>{{playtime|time}}</div>
			<slider v-model="playtime" :min="0" :max="duration" @change="seekmusic"></slider>
			<div>{{duration|time}}</div>
		</div>
		<div id="playingaction" v-if="playtype!=2">
			<!-- 单曲 -->
			<div class="pa-saction" @click="shuffle" v-if="playtype==1">
				<img src="static/images/cm2_icn_loop@2x.png" v-if="shuffle_am==0"/>
				<img src="static/images/cm2_icn_one@2x.png"  v-if="shuffle_am==1"/>
				<img src="static/images/cm2_icn_shuffle@2x.png" v-if="shuffle_am==2" />
			</div>
			<!-- program -->
			<div class="pa-saction" @click="shuffle" v-if="playtype==3">
				<img src="static/images/cm2_icn_order@2x.png" v-if="shuffle_dj==0"/>
				<img src="static/images/cm2_icn_one@2x.png" v-if="shuffle_dj==1"/>
				<img src="static/images/cm2_icn_shuffle@2x.png" v-if="shuffle_dj==1"/>
			</div>
			
			<div class="pa-maction" @click="prev">
				<img src="static/images/ajh.png" />
			</div>
			<div class="pa-baction" @click="setplaying">
				<!-- music||program -->
				<img id='pa-playing' src="static/images/ajf.png" v-if="!playing" />
				<img id='pa-playing' src="static/images/ajd.png" v-if="playing" />
			</div>
			<div class="pa-maction" @click="next">
				<img src="static/images/ajb.png" />
			</div>
			<div class="pa-saction" @click="psaction">
				<img src="static/images/cm2_icn_list@2x.png" />
			</div>
		</div>
		<div id="fm-action" v-if="playtype==2">
			<div @click="del_fm">
				<img :src="'static/images/fm/cm2_fm_btn_delete@2x.png'" />
			</div>
			<div @click="heart">
				<img src="static/images/fm/cm2_fm_btn_loved@2x.png" v-if="star"/>
				<img src="static/images/fm/cm2_fm_btn_love@2x.png" v-else/>
			</div>
			<div class="playbtn" @click="setplaying">
				<!-- fm -->
				<img id='pa-playing' src="static/images/fm/cm2_fm_btn_play@2x.png" v-if="!playing" />
				<img id='pa-playing' src="static/images/fm/cm2_fm_btn_pause@2x.png" v-if="playing" />
			</div>

			<div @click="nextfm">
				<img src="static/images/fm/cm2_fm_btn_next@2x.png" />
			</div>
			<div class="commentscount">
				<router-link :to="{name:'comment',params:{id:music.id||0},query:{ctype:2}}">
					<img src="static/images/fm/cm2_fm_btn_cmt_number@2x.png" v-if="commentscount" />
					<img src="static/images/fm/cm2_fm_btn_cmt@2x.png" v-else/>
					<span v-if="commentscount">{{commentscount>999?'999+':commentscount}}</span>
				</router-link>
			</div>

		</div>
	</div>
</template>
<script>
	import utils from "@/utils.js";
	import slider from "@/components/slider"
	import { mapState, mapMutations } from 'vuex'
	export default {
		name: 'playaction',
		props: {
			type: Array,
			commentscount: Number
		},
		components: {
			slider
		},
		methods: {
			seekmusic(v) {
				audio.currentTime = v / 1000
			},
			psaction() {
				this.$emit("psaction"); //单曲和电台显示更多
			},
			heart() {
				//fm 喜欢
				this.$store.dispatch('heart', {
					id: this.music.id,
					t: this.star
				})
			},
			async del_fm() {
				await this.$store.dispatch('heart', {
					id: this.music.id,
					t: this.star,
					del: true
				});
				this.nextfm()
			},
			nextfm() {
				this.$store.dispatch('next_fm');
			},
			setplaying(){
				this.$store.commit("setplaying",!this.playing)
			},
			...mapMutations([
				'next',
				'prev',
				'shuffle'
			])
		},
		filters: {
			time(v) {
				if(!v){return "00:00"}
				v = new Date(v);
				return(v.getMinutes() > 9 ? v.getMinutes() : ('0' + v.getMinutes())) + ':' + (v.getSeconds() > 9 ? v.getSeconds() : ('0' + v.getSeconds()))
			}
		},
		computed: {
			duration() {
				return this.music.dt || this.music.duration || this.music.mainSong.duration
			},
			star: function() { //歌曲红心状态
				if(!this.music.id) return 0;
				return this.likeall.indexOf(this.music.id) + 1
			},
			...mapState([
				"music",
				"likeall",
				"playing",
				"playtype",
				"shuffle_am",
				"shuffle_dj",
				"musicloading",
				"playtime",
				'index_am',
				'index_dj'

			])
		}
	}
</script>

<style scoped>
#playing-status {
		color: #fff;
		font-size: .8em;
		padding: .5em 1em;
		display: flex;
		align-items:center
	}
	.mu-slider{margin: 0 1em;}
	.loading .mu-slider-thumb:after {
		border-color: #000;
		background: url(../../static/images/loading.gif) center center no-repeat;
		-webkit-background-size: 100% 100%;
		background-size: 100% 100%;
		width: 80%;
		height: 80%;
		left: 10%;
		top: 10%;
		border: none;
		margin: 0;
	}
	#fm-action {
		margin: 2% 0 4%;
		display: flex
	}
	
	#fm-action div {
		flex: 1;
		text-align: center;
		position: relative;
		width: 100%
	}
	
	#fm-action .playbtn {
		flex: 0 0 1
	}
	
	#fm-action img {
		width: 80%;
		vertical-align: top;
		margin-top: 5%;
	}
	
	#fm-action .playbtn img {
		width: 90%;
		margin-top: 0
	}
</style>