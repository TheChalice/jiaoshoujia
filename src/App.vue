<template>
    <div id="app">
        <van-nav-bar
                title="手机云计算脚手架软件"
        />
        <HelloWorld msg="Welcome to Your Vue.js App"/>
    </div>
</template>

<script>
    // import {Toast} from 'vant';
    import HelloWorld from './components/HelloWorld.vue'

    export default {
        name: 'App',
        methods: {
            // onClickLeft() {
            //     Toast('返回');
            // },
        },
        components: {
            HelloWorld
        }
    }
</script>

<style>
    #app {
        font-family: Avenir, Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        /*margin-top: 60px;*/
    }
</style>
