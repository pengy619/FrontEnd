<template>
  <div id="app">
    	<transition name="fade" mode="out-in">
					<router-view/>
					</transition>
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>

<style>
* {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
html {
  font-size: 10px;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  height: 100%;
  height: 100vh;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}
.fade-enter,
.fade-leave-active {
  opacity: 0;
}
body {
  margin: 0;
  padding: 0;
  /* position: relative; */
  height: 100%;
  background: #fff;
  font-family: "Segoe UI", "Lucida Grande", Helvetica, Arial, "Microsoft YaHei",
    FreeSans, Arimo, "Droid Sans", "wenquanyi micro hei", "Hiragino Sans GB",
    "Hiragino Sans GB W3", FontAwesome, sans-serif;
  font-weight: 400;
  line-height: 1.6;
  color: #333;
  font-size: 1.4rem;
  /* background: #eff0f4; */
  /* min-width: 1200px; */
  width: 100%;
  height: 100vh;
}
ul,
li {
  list-style: none;
  padding: 0;
}
a {
  text-decoration: none;
}
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background: #fff;
  height:100%
  /* min-height: 815px; */
}
</style>
