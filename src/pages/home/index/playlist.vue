<template>
	<div v-infinite-scroll="getplaylist" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
		<div id="hqpl" v-show="hiqulity.name">
			<div class="blurbg" :style="{'background-image':'url('+(hiqulity.coverImgUrl)+'?param=500y500)'}"></div>
			<router-link :to="{name: 'playlist'}" class="flexlist flex-image">
				<div class="flexleft fl-image">
					<img :src="hiqulity.coverImgUrl+'?param=200y200'" class="album_cover" />
				</div>
				<div class="flexlist">
					<div class="flexmain">
						<div id="hq_title"><img src="../../../../static/images/cm4_slist_icn_hot@2x.png" alt="" />精品歌单<img src="../../../../static/images/common_icon_arrow@2x.png" alt="" /></div>
						<div>{{hiqulity.name}}</div>
						<div class="relistdes">{{hiqulity.copywriter}}</div>
					</div>
				</div>
			</router-link>
		</div>
		<div id="plc_header"><span @click="catelist.isShow=true">{{catelist.checked.name}} <img src="../../../../static/images/common_icon_arrow@2x.png" height="16px" alt="" /></span>
		</div>
		<div v-if="loaded">
			<div class='flex-boxlist flex-two'>
				<div class="tl_cnt cateplaylist" v-for="item in list.playlists" :key="item.id">
					<router-link :to="{name:'playlist',params:{id:item.id},query:{img:item.coverImgId_str,name:item.name}}">
						<div class="cover">
							<img :src="item.coverImgUrl+'?param=300y300'" class="music_cover" />
							<div class="img_creator"><img src="../../../../static/images/cm2_icn_userhead@2x.png" alt=""> {{item.creator.nickname}}</div>
							<div class="img_playcount">
								<img src="../../../../static/images/p0.png" /> {{item.playCount|playcount}}</div>
						</div>
						<div class="name">{{item.name}}</div>
					</router-link>
				</div>
			</div>
		</div>
		<loading v-show="!loaded||list.more"></loading>

		<div style="height:100%" id="catewrap" v-show="catelist.isShow">
			<div class="close" @click="catelist.isShow=false" id="closecatelist"></div>
			<div id="cateall" @click="catecheck(-1)" :class="'cl_list ' +(catelist.checked.name==catelist.res.all.name?'checked':'')">
				<span class="cl_ico_checked" v-if="catelist.checked.name==catelist.res.all.name"></span>{{catelist.res.all.name}}</div>
			<div class="catelist" v-for="(item,idx) in catelist.res.categories">
				<div class="cl_list cl_ico">
					<img :src="'../../../../static/images/cm2_discover_icn_'+idx+'@2x.png'">
					<span>{{item}}</span>
				</div>
				<div :class="'cl_list '+(catelist.checked.name==re.name?'checked':'')" @click="catecheck(i)" v-if="re.category==idx" v-for="(re,i) in catelist.res.sub">
					<span class="cl_ico_hot" v-if="re.hot"></span>
					<span class="cl_ico_checked" v-if="catelist.checked.name==re.name"></span> {{re.name}}
				</div>
			</div>
		</div>

	</div>
</template>

<script>
	import api from '@/api'
	import loading from "@/components/loading"
	export default {
		name: 'playlist',
		data() {
			return {
				offset: 0,
				list: {},
				loaded: false,
				catelist: {
					checked: {},
					res: {
						all: {}
					}
				},
				hiqulity: {},
				busy: true
			}
		},
		components: {
			loading
		},
		created() {
			this.getcatelist();
		},
		activated() {
			this.busy = this.loaded ? false : true
		},
		deactivated() {
			this.busy = true
		},
		methods: {
			getcatelist() {
				api.index_plcate().then(res => {
					this.catelist = {
						isShow: false,
						res: res.data,
						checked: res.data.all
					};
					this.getplaylist(true);
					api.index_hqpl("全部").then(res => {
						this.hiqulity = res.data.playlists[0] || {}
					})
				});
			},
			getplaylist(d) {
				this.busy = true;

				api.index_playlist(this.catelist.checked.name, this.offset).then(res => {
					this.offset += res.data.playlists.length;
					if(!d) {
						res.data.playlists = this.list.playlists.concat(res.data.playlists)
					}
					this.list = res.data;
					this.loaded = true;
					this.busy = false
				}).catch(res => {
					this.loaded = true;
				})
			},
			catecheck(idx) {
				this.catelist.checked = idx < 0 ? this.catelist.res.all : this.catelist.res.sub[idx]
				this.catelist.isShow = false;
				this.offset = 0;
				this.loaded = false;
				this.getplaylist(true)
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.flex-boxlist {
		min-height: 500px;
	}
	
	#catewrap {
		padding: 0 1%;
		box-sizing: border-box;
		position: fixed;
		width: 100%;
		height: 100%;
		z-index: 100;
		left: 0;
		top: 0;
		background-color: #fff;
		overflow: auto;
	}
	
	#closecatelist {
		margin: .5em auto;
	}
	
	.catelist {
		margin-bottom: 2%;
		overflow: hidden;
		padding-left: 1px;
		padding-bottom: 2px;
	}
	
	.cl_list {
		text-align: center;
		position: relative;
		z-index: 1;
		width: 25%;
		float: left;
		padding: 1.2em 0;
		line-height: 1;
		box-sizing: border-box;
		cursor: pointer;
		z-index: 1;
	}
	
	.cl_list:after {
		content: '';
		position: absolute;
		left: -1px;
		right: 0;
		top: 0;
		bottom: -1px;
		border: 1px solid #eee;
		event-pointer: none;
	}
	
	.cl_ico {
		line-height: 1;
		height: 6.8em;
		padding-top: 5em;
		padding-bottom: 0;
	}
	
	.cl_ico img {
		max-height: 50%;
		display: block;
		max-width: 50%;
		position: absolute;
		top: 50%;
		transform: translate(-50%, -60%);
		left: 50%
	}
	
	#cateall {
		float: none;
		width: auto;
		display: block;
		margin: 0 3px 1em;
	}
	
	.cl_ico_checked,
	.cl_ico_hot {
		content: "";
		position: absolute;
	}
	
	.cl_ico_hot {
		background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADgAAAA4CAMAAACfWMssAAABTVBMVEXTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjHTOjFX1ZKxAAAAbnRSTlMAAQMEBggKCw0ODxATFBUnKSosLi8xP0tNT1JTVFVWV1laW11eX2FiZGVoaWptbnF0dXl6fn+AgYOGh4uMj5CSk5WXnJ2en6ChpKapq6ytr7K3uby9wMHCw8XIy83P0dTj5Obn6err7O7x+fv8/nzHVlgAAAGLSURBVEjH7dVJWxNBEIfxd0YYSEBQFEGWACqKgoIgsig7iixu4EIAFZXNYeb//Y8cmEA4YLrrTJ3q8nu6n6quarg8RnV5vLxyx/OpySUFBk3uHvlti+slv2Vw6SNYs7jHQONffzdA9LGZm3u+/ftMtKGDWzTt+7lE4+uS9pu4fejjnheS02TvBs1H7m4EejL5p5FFZzdKVS29mfw95+zGCNeKtTxMPes5Sbgqfa+hL/VyrwmXJelrRH/q4aYIl06zjYhnqfvcnsMvEU9TV/cp1ivCFUn6FvHE2b0LWmJNEK5Km6XiON3zVwN3Y41x7X0xl7XDcS/9vE77sV5QleNB4rXPtgI6E41At5+LW4HuREOFio6MfJiSFLfR8CbP/USVXQZ3q4NpJR3U/1Axx6wqu9KJC0Ew00XdjqTNztjBlaDmAy5s0UruDGo2YNjDncOyZ+riyuDZRDm5cqhJ7qSu7gLU23/ODr//73/Q0WF1WB1Wh9VhdVgdVofVYXVYHVaH1WF1WB1Wh9VhdScljLevgPOTYwAAAABJRU5ErkJggg==);
		width: 2em;
		height: 2em;
		left: 0;
		top: 0;
		background-size: 100% auto;
	}
	
	.cl_ico_checked {
		background-image: url(../../../../static/images/cm2_discover_slted@2x.png);
		width: 1.5em;
		height: 1.5em;
		right: 0;
		bottom: 0;
		background-size: 100% 100%;
	}
	
	.checked {
		z-index: 2
	}
	
	.checked:after {
		border-color: #BB2C08;
	}
	
	#hqpl {
		position: relative;
		padding: 1em;
		color: #fff;
		overflow: hidden;
	}
	
	#hqpl a {
		color: #fff;
	}
	
	#hq_title img {
		height: 1.5em;
		margin-right: .5em;
	}
	
	#hq_title img:last-child {
		height: 1em;
		margin-left: .5em;
	}
	
	#hq_title {
		font-size: 1.2em;
		padding-bottom: .5em;
	}
	
	#hqpl .fl-image img {
		height: 8em;
		width: 8em;
	}
	
	#plc_header {
		overflow: hidden;
		padding: 1em 2% .5em;
	}
	
	#plc_header span {
		border: 1px solid #ddd;
		border-radius: 2em;
		line-height: 2;
		padding: 0 .5em 0 1em;
		display: inline-block;
	}
	
</style>