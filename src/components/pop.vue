<template>
	<div class="pop" v-show="show">
		<div class="pp_overlay" @click="closepop"></div>
		<div class="pp_main">
			<slot></slot>
			<div class="ppm_footer" v-if="close" @click="closepop">关闭</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'pop',
		props: {
			show: {
				type: Boolean,
				default: false
			},
			close: {
				type: String,
				default: ''
			}
		},
		methods: {
			closepop() {
				this.$emit("closepop")
			}
		}
	}
</script>

<style scoped>

</style>