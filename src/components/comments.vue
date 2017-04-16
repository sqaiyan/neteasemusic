<template>
  <div >
  </div>
</template>
<script>
  export default {
    name: 'songlist',
    props: {
      list: Array,
      privileges: Array,
      toplist:{
        type:Boolean,
        default:false
      },
      curplay: {
        type: Number,
        default: -1
      }
    },
    methods: {
      switchtab(index) {}
    }
  }
</script>

<style scoped>
  
</style>
