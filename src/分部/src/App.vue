<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
	*{
		-webkit-box-sizing: border-box;
    box-sizing: border-box;
	}
	html{
		    font-size: 10px;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
	}
  body{
		margin: 0;
		padding: 0;
		position: relative;
    background: #fff;
    font-family: "Segoe UI", "Lucida Grande", Helvetica, Arial, "Microsoft YaHei", FreeSans, Arimo, "Droid Sans", "wenquanyi micro hei", "Hiragino Sans GB", "Hiragino Sans GB W3", FontAwesome, sans-serif;
    font-weight: 400;
    line-height: 1.6;
    color: #333;
    font-size: 1.4rem;
        background: #eff0f4;
    min-width: 1200px;
    width: 100%;
	}
	ul,li{
		list-style: none;
    padding: 0;
	}
	a{
		text-decoration: none;
	}
  #app {
    height: 100%;
  }
</style>
