<template>
	<div id="info-page" v-if="info.display" transition="fade" :class="info.type" class="animated">
		<i class="fa" :class="class"></i>
		{{ content }}
	</div>
</template>
<style lang="stylus" scoped>
	@import '../util.styl';
	#info-page {
		position fixed
		top 0
		left 0
		right 0
		z-index 1000
		margin auto
		width 40vmin 
		text-align center
		border-radius 0 0 .6rem .6rem
		padding 1rem 2rem
	}
	i{
		margin-right .1rem
	}
	.hint{
		color #555
		background #00ff80
	}
	.alert{
		color #eee
		background #bf0a0a
	}
	.warn {
		color #555
		background #f1ff2d
	}
</style>

<script type="text/javascript">
	export default{
		props:{
			info: Object
		},
		watch:{
			'display':function(val){
				if(val){
					setTimeout(()=>{
						this.info.display = false
					},this.delay);
				}
			}
		},
		computed:{
			display(){
				return this.info.display
			},
			content(){
				return this.info.content || '通知消息'
			},
			delay(){
				return this.info.delay || 5000
			},
			type(){
				return this.info.type || 'hint'
			},
			class(){
				switch(this.type){
					case 'hint':
						return 'fa-info';
					case 'warn':
						return 'fa-warning';
					case 'alert':
						return 'fa-warning';
					default:
						return '';
				}
			}
		}
	}
</script>