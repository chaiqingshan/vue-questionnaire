<template>
	<article id="que-result"> 
		<div class="container">
			<h3 class="title">{{ title }}</h3>
			<div class="que-list-wapper">
				<ul class="que-list">
					<li v-for="que in queList">
						<div class="only-choice question" v-if="que.type === 'radio'">
							<h4 class="title">{{ que.title }}</h4>
							<h4 class="chart">{{ que.chartType }}</h4>
							<ul class="select-list">
								<li v-for="select in que.selectList">
									<p>{{ select.title }}</p>
									<div class="percent-wapper">
										<div class="inner" :style="{width:select.percent+'%'}"></div>
									</div>
									<span>{{ select.percent }}%</span>
								</li>
							</ul>
						</div>
						<div class="multiple-choice question" v-if="que.type === 'multiple'">
							<h4 class="title">{{ que.title }}</h4>
							<h4 class="chart">{{ que.chartType }}</h4>
							<ul class="select-list">
								<li v-for="select in que.selectList">
									<p>{{ select.title }}</p>
									<div class="percent-wapper">
										<div class="inner" :style="{width:select.percent+'%'}"></div>
									</div>
									<span>{{ select.percent }}%</span>
								</li>
							</ul>
						</div>
						<div class="text-choice question" v-if="que.type === 'text'">
							<h4 class="title">{{ que.title }}</h4>
							<h4 class="chart">{{ que.chartType }}</h4>
							<p></p>
							<div class="percent-wapper">
								<div class="inner" v-bind:style="{width:que.percent+'%'}"></div>
							</div>
							<span>{{ que.percent }}%</span>
						</div>
					</li>
				</ul>
			</div>
			<button class="btn btn-tiny" v-link="'/list'">返回</button>
		</div>
	</article>
</template>

<style lang="stylus" scoped>
	@import '../util.styl';
	.container{
		backgruond #fff
		display flex
		flex-direction colunm
		align-items center
		box-sizing border-box
		padding 4%
		.title{
			line-height 4rem
			text-align center
			font-size 140%
			font-weight bold
			border none
			color #444
			span{
				font-size 70%
				font-weight normal
			}
		}
	}
	.que-list-wapper{
		width 100%
		border-top 2px solid #ccc
		border-bottom 2px solid #ccc
		padding 2rem 0
		margin 2rem 0
	}
	.que-list{
		border 1px solid #ccc
		margin-bottom 1.5rem
		title{
			text-align left
			display inline-block
			width 60%
		}
		.chart{
			display inline-block
		}
	}
	.question{
		position relative
		padding 1.5rem 1.5rem 3rem 1.5rem
		line-height 2.5
		.select-list{
			padding-left 5%
		}
		.title{
			font-size 180%
			font-weight bold
			white-space nowrap
			overflow hidden
			text-overflow ellipsis
			vertical-align middle
			@media (max-width:768px){
				font-size 100%
			}
		}
		p{
			display inline-block
			width 58%
		}
	}
	.text-choice p{
		width 60%
	}
	.percent-wapper {
		color defaultColor
		display inline-block
		width 20%
		height .8em
		border 1px solid currentColor
	}
	.inner{
		height .8em
		width 0
		background-color currentColor
	}
	.btn{
		myBtn(defaultColor)
	}
</style>

<script type="text/javascript">
	export default {
		data(){
			return {
				view:'问卷数据'
			}
		},
		created(){
			this.$root.view = this.view;
			//获得数据
			var index = this.$route.params.index;
			this.$http.get('../../naire.json').then(res=>{
				var naireList = res.data.naireList;
				var naire = naireList[index];
				var answers = naire.answer;
				//当selectList的情况
				function selectPercent(choiced){
					var percent = choiced/answers*100;
					if(isNaN(percent)) percent = 0;
					return Math.round(percent);
				}
				naire.queList.forEach(que=>{
					switch (que.type) {
						case 'text':
							que.title += '（文本题）';
							que.chartType = '数据占比';
							var percent = que.content.length/answers*100;
							if(isNaN(percent)) percent = 0;
							que.percent = percent;
							break;
						case 'radio':
							que.title += '（单选题）';
							que.chartType = '数据占比';
							que.selectList.forEach(select=>{
								select.percent = selectPercent(select.choiced);
							})
							break;
						case 'multiple':
							que.title += '（多选题）';
							que.chartType = '有效占比';
							que.selectList.forEach(select=>{
								select.percent = selectPercent(select.choiced);
							})
							break;
						default:
							return 'error';
					}
				})
				this.$data = naire;
			})
		}
	}
</script>