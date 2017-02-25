<template>
	<div id="confirm-page" v-if="display" transition @click.self="confirm.display=false" class="animated">
		<div class="wapper">
			<h3 class="title">{{ title }}</h3>
			<p class="content">{{{ content }}}</p>
			<div class="btn-wapper">
				<button class="btn btn-tiny yes" @click="clicked">确定</button>
				<button class="btn btn-tiny no" v-if="rightBtnDisplay" @click="clicked">取消</button>
			</div>
		</div>
	</div>
</template>
<style lang="stylus" scoped>
	@import '../util.styl'
	#confirm-page {
		position fixed
		top 0
		left 0
		width 100vw
		height 100vh
		z-index 999
		background rgba(115, 115, 115, 0.5)
		display flex 
		justify-content center 
		align-items center 
	}
	.wapper{
		box-sizing border-box 
		width 80vmin
		padding 1.5rem 2rem 
		bottom 2rem 
		background #fff
		border-radius 1rem
		@media (min-width:768px){
			width 50vmin
		}
	}
	.content {
		padding .15rem
		margin 2rem 0 4rem 0
	}
	.btn-wapper{
		text-algn center
	}
	.btn {
		margin 0 .5rem
		&.yes {
			myBtn(defaultColor)
		}
	}
</style>
<script type="text/javascript">
	import tool from '../util.js';
	export default {
		props: {
			confirm: Object
		},
		methods: {
			//选择后传递给父元素
			clicked(event){
				var elem = event.target;
				if(tool.hasClass('yes',elem)){
					this.$dispatch('clicked', 'yes');
					console.log("dispatch yes");
				}else{
					this.$dispatch('clicked', 'no');
					console.log("dispatch no")
				}
				this.confirm.display = false;
			}
		},
		computed: {
			'display': function(){
				return this.confirm.display;
			},
			'rightBtnDisplay': function(){
				return this.confirm.rightBtnDisplay === false?false:true;
			},
			'title': function(){
				return this.confirm.title || '提示';
			}
			'content': function(){
				return this.confirm.content || '提示内容'
			}
		}
	}
</script>
