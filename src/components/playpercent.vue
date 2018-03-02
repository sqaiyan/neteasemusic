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
	
</style>