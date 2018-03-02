<template>
	<div style="padding-top: 82px;">
		<div class="fixheader">
		<mt-header fixed title="听歌排行">
			<mt-button slot="left" @click="$router.go(-1)" icon="back"></mt-button>
			<playico slot="right"></playico>
		</mt-header>
		<tab :tabs="tab" :tabidx="type" v-on:switchtab="switchtab"></tab></div>
		<div class="plist-detail" v-show="type==0">
			<div v-if="tab[0].loaded">
				<div @click="play(re.song)" :key="re.id" :class="'flexlist flex-center '+(re.song.privilege.st<0?'disabled':'')" v-for="(re,idx) in allData.allData">
					<div class="flexleft flexnum ">
						<span :class="{'topindex':idx<3}">{{idx+1}}</span>
					</div>
					<div class="flexlist">
						<div class="flexmain">
							<div>{{re.song.name}}</div>
							<div class="relistdes">{{re.song.ar[0].name}}-{{re.song.al.name}}</div>
						</div>
						<div class=" fc_gray">
							<img src="../../static/images/pl-playall.png" width="20" /> {{re.playCount}}次
						</div>
					</div>
				</div>
				<p class="cntloading">{{allData.msg}}</p>
			</div>
			
			<loading v-else></loading>
		</div>
		
		<div class="plist-detail" v-show="type==1">
			<div v-if="tab[1].loaded">
				<div :key="re.id" @click="play(re.song)" :class="'flexlist flex-center '+(re.song.privilege.st<0?'disabled':'')" v-for="(re,idx) in weekly.weekData">
					<div class="flexleft flexnum ">
						<span :class="{'topindex':idx<3}">{{idx+1}}</span>
					</div>
					<div class="flexlist">
						<div class="flexmain">
							<div>{{re.song.name}}</div>
							<div class="relistdes">{{re.song.ar[0].name}}-{{re.song.al.name}}</div>
						</div>
						<div class=" fc_gray">
							<img src="../../static/images/pl-playall.png" width="20" /> {{re.playCount}}次
						</div>
					</div>
				</div>
				<p class="cntloading">{{weekly.msg}}</p>
			</div>
			
			<loading v-else></loading>
		</div>
	</div>
</template>
 
<script>
	import { Toast } from 'mint-ui';
	import { mapState } from 'vuex'
	import api from '@/api';
	import bs64 from "@/base64";
	import loading from "@/components/loading"
	import playico from "@/components/playico"
	import songlist from "@/components/songlist";
	import tab from "@/components/tabs";
	export default {
		name: 'record',
		data() {
			return {
				loaded: false,
				weekly: [],
				allData: [],
				type: 0,
				tab: [{
					name: '全部',
					loaded: false
				},{
					name: '最近一周',
					loaded: false
				}]
			}
		},
		components: {
			songlist,
			loading,
			playico,
			tab
		},
		beforeRouteEnter: (to, from, next) => {
			next(vm => {
				if(parseInt(to.params.id) !== parseInt(vm.id)) {
					vm.loaded = false;
					vm.recordList();
				}
			})
		},
		methods: {
			play(re){
				if(re.privilege.st<0){
					Toast("歌曲已下架")
					return;
				}
				this.$store.commit("setmusic",re)
				this.$router.push({name:'playing',params:{id:re.id},query:{img:re.al.pic_str}})
			},
			switchtab(index) {
				this.type = index.toString();
				this.recordList()
			},
			recordList() {
				!this.tab[this.type].loaded&&api.record(this.$route.params.uid, this.type).then(res => {
					
					if(this.type==0){
						this.allData = res.data;
					}else{
						this.weekly = res.data;
					}
					this.tab[this.type].loaded = true;
				})
			}
		},
		computed: {
			...mapState([
				"music"
			])
		}
	}
</script>