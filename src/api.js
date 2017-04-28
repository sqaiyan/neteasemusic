import axios from "axios"
let limit = 20;
export default {
    index_rec() {
        //首页个人推荐内容：歌单，新歌，mv，电台
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
        //歌单类型分类列表
        return axios("playlist/catlist")
    },
    index_playlist(type, offset) {
        //根据类型获取歌单列表
        return axios("top/playlist?limit=" + limit + '&offset=' + offset + '&type=' + type)
    },
    index_dj() {
        //首页电台页内容：电台分类，推荐节目，推荐电台，电台列表
        let cate = axios("djradio/catelist");
        let rec_p = axios("program/recommend");
        let rec_dj = axios("djradio/recommend");
        let djlist = this.index_djlist(0);
        return axios.all([cate, rec_p, rec_dj, djlist]).then(axios.spread(function(a, b, c, d) {
            return Promise.resolve([a, b, c, d])
        }))
    },
    index_djlist(offset) {
        //电台列表
        return axios("djradio/hot?limit=" + limit + '&offset=' + offset);
    },
    likeall() {
        return axios("likelist")
    },
    index_sort() {
        return axios("toplist/detail")
    },
    search(name, type, offset) {
        //类型关键词搜索 type:1单曲；10专辑；100歌手；1000歌单；1004mv；1009电台；1002用户
        return axios("search?keywords=" + name + '&type=' + type + '&limit=' + limit + '&offset=' + offset);
    },
    playlist(id, offset, limit) {
        return axios("playlist/detail?id=" + id + '&offset=' + offset + '&limit=' + limit);
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
    	console.log(t)
        return axios("song/tracks?id=" + id + '&r=' + (!d ? '' : 'del') + '&op=' + (!t ? 'like' : 'trash'))
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
        let pl = axios("simi/playlist?id=" + id);
        let song = axios("simi/song?id=" + id);
        let user = axios("simi/user?id=" + id)
        return axios.all([pl,song,user]).then(axios.spread(function(a, b, c) {
            return Promise.resolve([a.data.playlists, b.data.songs, c.data.userprofiles])
        }))
    },
    user_detail(id) {
        return axios("user/detail?uid=" + id)
    },
    user_playlist(id, offset) {
        return axios("user/playlist?uid=" + id + '&offset=' + offset + '&limit=' + limit)
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

}