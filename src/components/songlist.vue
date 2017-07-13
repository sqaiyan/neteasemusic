<template>
	<div class="songs">
		<router-link v-for="(re,idx) in list" :key="re.id" :to="{name: 'playing',params:{id:re.id},query:{img:re.al.pic_str||re.al.pic}}" @click.native="playindex(idx)" :class="'flexlist flex-center '+(re.id===curplay?'cur ':' ')+(toplist==1?'istop':'')+(nonum=='a'?'':'ml')">
			<div class="flexleft flexnum " v-if="nonum=='a'">
				<div v-if="re.id===curplay">
					<img src="../../static/images/aal.png" alt="">
				</div>
				<div v-else>
					<span :class="(toplist&&idx<3?'topindex':'')">{{idx+1}}</span>
					<div v-if="toplist==1">
						<div class="ftp" v-if="trackids[idx].ratio">
							<img src="../../static/images/xv.png" />{{trackids[idx].ratio}}%</div>
						<div class="ftp" v-if="!trackids[idx].ratio&&trackids[idx].v">
							<img src="../../static/images/wu.png" v-if="idx>trackids[idx].v" />
							<img src="../../static/images/xu.png" v-if="trackids[idx].v>idx" />
							<img src="../../static/images/xr.png" v-if="trackids[idx].v==idx" />
							<span>{{(trackids[idx].v>idx)?(trackids[idx].v-idx):(idx-trackids[idx].v)}}</span>
						</div>
						<div class="ftp" v-if="!trackids[idx].ratio&&!trackids[idx].v">
							<img src="../../static/images/xy.png" class="tpnew" />
						</div>
					</div>
				</div>
			</div>
			<div class="flexlist">
				<div class="flexleft " v-if="re.id===curplay&&nonum!='a'">
					<div>
						<img src="../../static/images/aal.png" alt="">
					</div>
				</div>
				<div class="flexmain">
					<div>{{re.name}}<span v-if="re.alia.length">（{{...re.alia}}）</span></div>
					<div class="relistdes">{{re.ar[0].name}} - {{re.al.name}}</div>
				</div>
				<div class="flexact">
					<router-link :to="{name:'mv',params:{id:re.mv}}" class="fa_list fa_mv" v-if="re.mv!=0">
						<img src="../../static/images/l0.png" />
					</router-link>
					<div class="fa_list">
						<img src="../../static/images/cm2_list_btn_more@2x.png" />
					</div>
				</div>
			</div>
		</router-link>
	</div>
</template>

<script>
	export default {
		name: 'songlist',
		props: {
			list: Array,
			privileges: Array,
			toplist: {
				type: String,
				default: ''
			},
			nonum: {
				type: String,
				default: 'a'
			},
			trackids: Array,
			curplay: {
				type: Number,
				default: -1
			}
		},
		methods: {
			playindex(index) {
				this.$store.commit("setbgmchange", false)
				this.$emit("playindex", index)
			}
		}
	}
</script>

<style scoped>
	.flexnum img {
		width: 1.3em
	}
	
	.topindex {
		color: #BB2C08;
	}
	
	.ftp {
		font-size: .5em;
		font-weight: lighter;
	}
	
	.ftp img {
		height: .8em;
		width: auto;
	}
</style>