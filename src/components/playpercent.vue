<template>
	<div id="playing-status" :class="{loading:musicloading}">
		<mt-range :barHeight="barHeight" v-model="playtime" :min="0" :max="duration">
			<div slot="start">{{playtime|time}}</div>
			<div slot="end">{{duration|time}}</div>
		</mt-range>
	</div>
</template>

<script>
	export default {
		name: 'playpercent',
		data(){
			return{
				barHeight:2
			}
		},
		props: {
			playtime: {
				type: Number,
				default: 0
			},
			duration: {
				type: Number,
				default: 0
			},
			min: {
				type: Number,
				default: 0
			},
			musicloading:{
				type:Boolean,
				default:true
			}
		},
		computed:{
			value:function(){
				return this.playtime
			}
		},
		methods:{
			change(v){
				//拖动进度条
				this.$emit('change',v)
			}
		},
		filters: {
			time(v) {
				v = new Date(v);
				return(v.getMinutes() > 9 ? v.getMinutes() : ('0' + v.getMinutes())) + ':' + (v.getSeconds() >9 ? v.getSeconds() : ('0' + v.getSeconds()))
			}
		}
	}
</script>

<style>
	#playing-status .mt-range {
		margin: 3% 5%;
		width: 90%;
		height: auto;
		line-height: 1;
	}
	
	.mt-range .mt-range-content {
		margin: 0 1em;
	}
	
	.mt-range .mt-range-thumb {
		width: 1.2em;
		height: 1.2em;
		margin-top: -.1em;margin-left: -.6em;
	}
	
	.mt-range .mt-range-progress {
		background-color: #d33a31;
		max-width: 100%;
	}
	
	.mt-range .mt-range-runway {
		right: 0;
	}
	
	.mt-range .mt-range-runway {
		border-top-color: #fff;
	}
	
	.mt-range .mt-range-progress,
	.mt-range .mt-range-runway {
		transform: none;
		margin-top: -1px;
	}
	.loading .mt-range-thumb:after{border-color: #000;}
	.mt-range-thumb:after {
		border: 2px solid #d33a31;
		height: 0;
		width: 0;
		overflow: hidden;
		position: absolute;
		left: 50%;
		top: 50%;
		content: '';
		border-radius: 1em;
		margin-top: -2px;
		margin-left: -2px;
	}
</style>