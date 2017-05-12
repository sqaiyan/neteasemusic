import axios from "axios"
let limit = 20;
export default {
    index_rec() {
        // 首页个人推荐内容：歌单，新歌，mv，电台
        let banner = axios("banner");
        let pl = axios('personalized');
        let ns = axios('personalized/newsong');
        let mv = axios('personalized/mv');
        let djprogram = axios('personalized/djprogram');
        return axios.all([banner, pl, ns, mv, djprogram]).then(axios.spread(function(a, b, c, d, e) {
            return Promise.resolve([a.data.banners, b.data.result, c.data.result, d.data.result, e.data.result])
        }))
    },
    index_plcate() {
        // 歌单类型分类列表
        return axios("playlist/catlist")
    },
    index_playlist(type, offset) {
        // 根据类型获取歌单列表
        return axios("top/playlist?limit=" + limit + '&offset=' + offset + '&type=' + type)
    },
    index_dj() {
        // 首页电台页内容：电台分类，推荐节目，推荐电台，电台列表
        let cate = axios("djradio/catelist");
        let rec_p = axios("program/recommend");
        let rec_dj = axios("djradio/recommend");
        let djlist = this.index_djlist(0);
        return axios.all([cate, rec_p, rec_dj, djlist]).then(axios.spread(function(a, b, c, d) {
            return Promise.resolve([a, b, c, d])
        }))
    },
    index_djlist(offset) {
        // 电台列表
        return axios("djradio/hot?limit=" + limit + '&offset=' + offset);
    },
    index_hqpl(cat){
    	//精品歌单
    	return axios("top/playlist/highquality?type="+cat)
    },
    likeall() {
        return axios("likelist")
    },
    index_sort() {
        return axios("toplist/detail")
    },
    search(name, type, offset) {
        // 类型关键词搜索 type:1单曲；10专辑；100歌手；1000歌单；1004mv；1009电台；1002用户
        return axios("search?keywords=" + name + '&type=' + type + '&limit=' + limit + '&offset=' + offset);
    },
    search_suggest(s,t){
    		return axios("search/suggest?keywords="+s)
    },
    search_hot(s,t){	
    		return axios("search/hot?type="+t+'&keywords='+s)
    },
    search_multimatch(s,t){
    		return axios("search/multimatch?type="+t+'&keywords='+s)
    },
    playlist(id, offset, limit) {
        return axios.get("playlist/detail?id=" + id + '&offset=' + offset + '&limit=' + limit);
    },
    album(id) {
        return axios("album/detail?id=" + id)
    },
    artist(id) {
        return axios("artist?id=" + id)
    },
    artist_album(id, offset) {
        return axios("artist/album?id=" + id + '&offset=' + offset + '&limit=' + limit)
    },
    artist_mv(id, offset) {
        return axios("artist/mv?id=" + id + '&offset=' + offset + '&limit=' + limit)
    },
    artist_desc(id) {
        return axios("artist/desc?id=" + id)
    },
    artist_simi(id) {
        return axios("artist/simi?id=" + id)
    },
    lyric(id) {
        return axios("lyric?id=" + id)
    },
    songtrack(id, t, d) {
        return axios("song/tracks",{params:{id:id,auth:true,r:(!d ? '' : 'del'),op:(!t ? 'like' : 'trash')}})
    },
    tracktpl(sid,pid,add=true){
    		var op=add?'add':'del'
    		return axios("playlist/tracks?pid="+pid+"&op="+op+"&tracks="+sid)
    },
    comments(id, offset, type) {
        id = (type == 1 ? '' : (type == 3 ? 'A_DJ_1_' : 'R_SO_4_')) + id
        return axios("comments?id=" + id + '&offset=' + offset + '&limit=' + limit)
    },
    music_url(id) {
        return axios("music/url?id=" + id + '&br=128000')
    },
    async music_detail(id) {
        return axios("music/detail?id=" + id)
    },
    fm() {
        return axios("fm")
    },
    simi(id) {
        let pl = axios("simi/playlist",{params:{id:id,auth:true}});
        let song = axios("simi/song?id=" + id);
        let user = axios("simi/user?id=" + id)
        return axios.all([pl,song,user]).then(axios.spread(function(a, b, c) {
            return Promise.resolve([a.data.playlists, b.data.songs, c.data.userprofiles])
        }))
    },
    recsongs() {
        return axios("recommend/songs")
    },
    record(t = 0) {
        return axios("record?type=" + t)
    },
    login(name, pwd) {
        var data = { email: name, password: pwd, phone: name }
        return axios.post((/^0\d{2,3}\d{7,8}$|^1[34578]\d{9}$/.test(name) ? "login/cellphone" : "login"), data)
    },
    mv(id){
    	let mv =axios.get('mv?id='+id);
        let simi = axios("mv/simi?id=" + id)
        return axios.all([mv,simi]).then(axios.spread(function(a,b) {
                return Promise.resolve([a.data.data, b.data.mvs]);
        }))
    },
    dj_detail(id){
    	return axios("dj/detail?id="+id);
    },
    dj_getprogram(id,offset){
    	return axios("dj/program",{params:{id:id,offset:offset,limit:limit}});
    },
    dj_sub(id,t){
    	return axios("dj/sub",{params:{id:id,t:t}});
    },
    program_detail(id){
    	return axios("program/detail",{params:{id:id}})
    },
    program_like(id,t){
    	return axios("resource/like",{params:{id:id,t:t}})
    },
    user_detail(id) {
        return axios("user/detail?uid=" + id)
    },
    user_playlist(id, offset) {
        return axios("user/playlist?uid=" + id + '&offset=' + offset + '&limit=' + limit)
    },
    user_radio(id){
    	return axios("user/radio",{params:{uid:id}});
    }
}