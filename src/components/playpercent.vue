<template>
	<div id="playing-status" :class="{loading:musicloading}">
		<div>{{playtime|time}}</div>
		<slider v-model="playtime" :min="0" :max="duration"  @change="seekmusic"></slider>
		<div>{{duration|time}}</div>
	</div>
</template>

<script>
	import { mapState } from 'vuex';
	import slider from "@/components/slider"
	export default {
		name: 'playpercent',
		props: {
			duration: {
				type: Number,
				default: 0
			}
		},
		components: {
			slider
		},
		methods: {
			seekmusic(v) {
				audio.currentTime = v / 1000
			}
		},
		filters: {
			time(v) {
				v = new Date(v);
				return(v.getMinutes() > 9 ? v.getMinutes() : ('0' + v.getMinutes())) + ':' + (v.getSeconds() > 9 ? v.getSeconds() : ('0' + v.getSeconds()))
			}
		},
		computed: {
			tmp() {
				return this.$store.state.playtime
			},
			...mapState([
				'musicloading',
				'playtime'
			])
		}
	}
</script>

<style>
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
	
	
</style>