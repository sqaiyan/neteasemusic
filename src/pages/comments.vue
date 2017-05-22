<template>
	<div v-infinite-scroll="comments" infinite-scroll-disabled="busy" class="page_t">
		<mt-header fixed :title="'评论('+rec.total+')'">
			<mt-button slot="left" @click="$router.go(-1)" icon="back"></mt-button>
		</mt-header>
		<div v-if="rec.hotComments.length">
			<div class="sm_title">热门评论</div>
			<cmt :list="rec.hotComments"></cmt>
			<div class="cntloading" v-if="rec.moreHot1">查看更多热门评论</div>
		</div>
		<div v-if="rec.comments.length">
			<div class="sm_title">精彩评论({{rec.total}})</div>
			<cmt :list="rec.comments"></cmt>
		</div>
		<div v-if="loaded&&!rec.comments.length" class="cntloading">暂无评论</div>
		<loading v-if="rec.more||!loaded"></loading>
	</div>
</template>

<script>
	import api from '@/api';
	import loading from "@/components/loading"
	import cmt from "@/components/comments"
	export default {
		name: 'comments',
		data() {
			return {
				rec: {
					hotComments: [],
					comments: [],
					total: 0
				},
				id: 0,
				loaded: false,
				offset: 0,
				busy: true
			}
		},
		components: {
			loading,
			cmt
		},
		beforeRouteEnter: (to, from, next) => {
			next(vm => {
				if(parseInt(to.params.id) !== parseInt(vm.id)) {
					vm.loaded = false;
					vm.cover = "";
					vm.offset = 0;
					vm.rec = {
							hotComments: [],
							comments: [],
							total: 0
						},
						vm.comments(false)
				}
			})
		},
		methods: {
			comments(more = true, id) {
				if(this.$route.name!='comment')return;
				this.busy = true;
				this.id = this.$route.params.id;
				if(more && !this.rec.more) return;
				var ctype = this.$route.query.ctype;
				ctype = ctype ? ctype : 1;
				api.comments(this.id, this.offset, ctype).then(res => {
					var data = res.data;
					if(more) {
						data.hotComments = this.rec.hotComments;
						data.comments = this.rec.comments.concat(data.comments);
					}
					this.loaded = true;
					this.rec = data;
					this.offset = data.comments ? data.comments.length : 0;
					this.busy = false;
				})
			}
		}
	}
</script>