<template>
	<div class="page_t" v-infinite-scroll="loadmore" infinite-scroll-disabled="busy">
		<mt-header fixed title="我的电台">
			<mt-button slot="left" @click="$router.go(-1)" icon="back"></mt-button>
			<playico slot='right'></playico>
		</mt-header>
		<div v-if="program.djRadios.length">
			<div class="sm_title">我创建的电台（{{program.djRadios.length}}）</div>
			<router-link :to="{name:'radio',params:{id:re.id}}" class="flexlist flex-image" v-for="re in program.djRadios" :key="re.id">
				<div class="flexleft fl-image radiolist">
					<img :src="re.picUrl+'?param=100y100'" class="album_cover" />
				</div>
				<div class="flexlist">
					<div class="flexmain">
						<div>{{re.name}}</div>
						<div class="relistdes">by {{re.dj.nickname}}</div>
						<div class="relistdes">{{re.lastProgramName}}</div>
					</div>
				</div>
			</router-link>
			<loading v-if="!loaded||radio.hasMore"></loading>
		</div>
		<div>
			<div class="sm_title">我收藏的电台（{{radio.count}}）</div>
			<router-link :to="{name:'radio',params:{id:re.id}}" class="flexlist flex-image" v-for="re in radio.djRadios" :key="re.id">
				<div class="flexleft fl-image radiolist">
					<img :src="re.picUrl+'?param=100y100'" class="album_cover" />
					<span class="fli-poai" v-if="re.newProgramCount">{{re.newProgramCount}}</span>
				</div>
				<div class="flexlist">
					<div class="flexmain">
						<div>{{re.name}}</div>
						<div class="relistdes">by {{re.dj.nickname}}</div>
						<div class="relistdes">{{re.lastProgramName}}</div>
					</div>
				</div>
			</router-link>
			<loading v-if="!loaded||radio.hasMore"></loading>
		</div>

	</div>
</template>

<script>
	import { mapState } from 'vuex'
	import api from '@/api';
	import loading from "@/components/loading"
	import playico from "@/components/playico"
	export default {
		name: 'subradio',
		data() {
			return {
				busy: true,
				offset: 0,
				radio: {
					djRadios: []
				},
				loaded: false,
				program: {
					djRadios: []
				}
			}
		},
		components: {
			loading,
			playico,
		},
		created() {
			this.get();
			api.user_radio(this.user.account.id).then(res => {
				this.program = res.data;
			})
		},
		methods: {
			get() {
				this.busy = true;
				api.user_sublist("radio", this.offset).then(res => {
					this.loaded = true;
					if(res.data.code != 200) return;
					this.offset += res.data.djRadios.length;
					res.data.djRadios = this.radio.djRadios.concat(res.data.djRadios);
					this.radio = res.data;
					this.busy = false;
				})
			},
			loadmore() {
				if(this.$route.name != 'subradio' || (!this.radio.hasMore && this.loaded)) return;
				this.get()
			}
		},
		computed: {
			...mapState([
				"user"
			])
		}
	}
</script>
