<template>
	<div class="tab" :id="ids" v-if="url">
		<router-link v-for="(item,index) in tabs" class=" tab-item" :key="index" active-class="tbi-cur" :to="{path:item.url}">
			<div class="tbi-text">{{item.name}}
				<div class="tbi-des" v-if="item.text">{{item.text}}</div>
			</div>
		</router-link>
		<slot></slot>
	</div>
	<div v-else class="tab" :id="ids">
		<div v-for="(item,index) in tabs" :class="(index==tabidx?'tbi-cur':'')+ ' tab-item'" :key="index" @click="switchtab(index)">
			<div class="tbi-text">{{item.name}}
				<div class="tbi-des" v-if="item.text">{{item.text}}</div>
			</div>
		</div>
		<slot></slot>
	</div>
</template>

<script>
	export default {
		name: 'tab',
		props: {
			url: {
				type: Boolean,
				default: false
			},
			ids: String,
			classes: String,
			addclass: Boolean,
			tabs: Array,
			tabidx: String
		},
		methods: {
			switchtab(index) {
				this.$emit("switchtab", index)
			}
		}
	}
</script>

<style scoped>

</style>