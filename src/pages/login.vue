<template>
  <div class="form-common">
    <mt-header fixed title="登录">
    </mt-header>
    <form @submit="login">
      <div class="formc-cnt">
        <span>账号：</span>
        <input auto-focus placeholder="手机/邮箱" type="text" required v-model="name" maxlength="20" />
      </div>
      <div class="formc-cnt">
        <span>密码：</span>
        <input type="password" v-model="pwd" required maxlength="20" />
      </div>
      <div>
        <mt-button type="danger" v-bind:class="{'is-disabled':(!name||!pwd||loading)}" size="large" @click="login">登录</mt-button>
      </div>
    </form>
  </div>
</template>

<script>
  import api from "@/api"
  import {
    Toast
  } from 'mint-ui';
  export default {
    name: 'login',
    data() {
      return {
        name: '',
        pwd: '',
        linktype: 3,
        url: 'home',
        loading: false
      }
    },
    components: {
      Toast
    },
    methods: {
      login() {
        this.loading = true
        api.login(this.name, this.pwd).then(res => {
          this.loading = false;
          if (res.data.code!=200) {
            Toast({
              message: '登录失败，请重试！',
              duration: 5000
            });
          }
          localStorage.setItem("cookie",res.data.c);
          this.$router.back()
        })
      }
    }
  }
</script>

<style scoped>
  .form-common {
    padding: 5em 5% 0;
  }
  
  .formc-cnt {
    display: flex;
    border-bottom: 1px solid #eee;
    align-items: center;
    padding: .5em 0
  }
  
  .form-common button {
    margin-top: 2em;
    background-color: #d43c33;
  }
  
  .formc-cnt span {
    text-align: left
  }
  
  .formc-cnt input {
    flex: 1;
    display: block;
    background: transparent;
    border: none;
    padding: 1em .5em;
  }
</style>
