<template>
	<article id="naire-edit">
		<div class="container">
			<input type="text" class="title" placeholder="在这里输入标题" v-model="title">
			<div class="que-list-wapper">
				<ul class="que-list" v-if="queList.length !==0">
					<li v-for="que in queList" transition>
						<div class="choice-btn-wapper" v-show="!que.type">
							<button class="btn btn-tiny" @click="que.type='radio'">单选</button>
							<button class="btn btn-tiny" @click="que.type='multiple'">多选</button>
							<button class="btn btn-tiny" @click="que.type='text'">文本题</button>
						</div>
						<div class="radio-choice question" v-if="que.type === 'radio'">
							<input type="text" class="title" placeholder="这里输入问题名称" v-model="que.title">
							<ul class="select-list">
								<li v-for="select in que.selectList" transition>
									<input type="radio" disabled>
									<input type="text" placeholder="这里输入选项{{ $index+1 }}" class="select" v-model="select.title">
									<span @click="que.selectList.$remove(select)">删除</span>
								</li>
							</ul>
							<div class="tool-wapper">
								<button class="btn btn-tiny" @click="que.selectList.push({title:'',choiced:0})">添加选项</button>
								<button class="btn btn-tiny" @click="this.queList.$remove(que)">删除</button>
							</div>
						</div>
						<div class="multiple-choice question" v-if="que.type === 'multiple'">
							<input type="text" class="title" placeholder="这里输入问题名称" v-model="que.title">
							<ul class="select-list">
								<li v-for="select in que.selectList" transition>
									<input type="checkbox" disabled>
									<input type="text" placeholder="这里输入选项{{ $index+1 }}" class="select" v-model="select.title">
									<span @click="que.selectList.$remove(select)">删除</span>
								</li>
							</ul>
							<div class="tool-wapper">
								<button class="btn btn-tiny" @click="que.selectList.push({content:'',choiced:0})">添加选项</button>
								<button class="btn btn-tiny" @click="this.queList.$remove(que)">删除</button>
							</div>
						</div>
						<div class="text-choice question" v-if ="que.type === 'text'">
							<input type="text" class="title" placeholder="这里输入问题名称" v-model="que.title">
							<div class="text-answer">
								<textarea placeholder="这里是将要输入的答案" disabled></textarea>
							</div>
							<div class="tool-wapper">
								<button class="btn btn-tiny" @click="this.queList.$remove(que)">删除</button>
							</div>
						</div>
					</li>
				</ul>
				<button class="btn newQue" @click="newQue"><i class="fa fa-plus"></i>添加问题</button>
			</div>
			<div class="footer-wapper">
				<label for="until-date">问卷截止日期</label>
				<input type="text" id="until-date" v-model="time">
				<button class="left btn btn-tiny" @click="saveQue">保存问卷</button>
				<button class="right btn btn-tiny" @click="releaseQue">发布问卷</button>
			</div>
		</div>
	</article>
</template>
<style lang="stylus">
	@import '../util.styl'
	#naire-edit {
		.container {
			background-color #fff
			display flex
			flex-direction column
			box-sizing border-box
			padding 4%
			.title {
				line-height 4rem
				text-align center
				font-size 140%
				font-weight bold
				border none
				color #444
				&:hover {
					background hoverBgColor
				}
			}
		}
		.que-list-wapper {
			border-top 2px solid #ccc
			border-bottom 2px solid #ccc
			padding 2rem 0
			margin 2rem 0
		}
		.footer-wapper {
			position relative
			text-align center
		}
		.newQue {
			width 100%
			height 5rem
			i {
				margin-right .5rem
			}
		}
		.choice-btn-wapper {
			height 6rem
			border-top .5px solid #ccc
			border-bottom .5px solid #ccc
			display flex
			justify-content space-around
			align-items center
			@media (min-width:768px) {
				justify-content center
				.btn {
					margin 0 1rem
				}
			}
		}
		.que-list {
			border 1px solid #ccc
			margin-bottom 1.5rem
			.title {
				width 100%
				text-align left
			}
			.select {
				width 80%
				&:hover {
					background hoverBgColor
				}
			}
			li {
				&:hover {
					.tool-wapper {
						opacity 1
					}
				}
			}
			.select-list {
				li {
					span {
						&:hover {
							color defaultColor
							cursor pointer
						}
						transition opacity .3s ease
						opacity 0
					}
					&:hover {
						span {
							opacity 1
						}
					}
				}
			}
		}
		.question {
			position relative
			padding 1.5rem 1.5rem 3rem 1.5rem
			line-height 2.5
			.select-list {
				padding-left 5%
			}
			.title {
				font-size 180%
				font-weight bold
			}
			input {
				border none
				padding .5rem
			}
			[type="checkbox"] {
				position relative
				top 2px
			}
		}
		.tool-wapper {
			transition opacity .3s ease
			opacity 0
			position absolute
			bottom 0
			right 0
		}
		.text-answer {
			padding-left 5%
			textarea {
				padding .5rem
				margin-top 1rem
				width 60%
				height 10rem
				resize none
			}
		}
	}
	#until-date {
		margin-right 50%
		padding .5rem
		@media (max-width:768px) {
			margin-bottom 1rem
			margin-right 0
		}
	}
	#calendar {
		position absolute
		bottom 120%
		left 0
		right 0
		text-align center
		border 1px solid defaultColor
		border-radius 5px
		background-color #fff
		padding 1.5rem
		@media (min-width:768px) {
			left 120px
			right auto
			width 20rem
		}
		table {
			width 100%
			th,td {
				padding .5em .7em
			}
			td:empty {
				padding 0
			}
			td:hover {
				cursor pointer
			}
		}
		.active {
			background-color defaultColor
			color #fff
		}
		i {
			width 0
			height 0
			display inline-block
			vertical-align middle
			border .5rem solid transparent
			position relative
			bottom 1px
		}
		.left-arrow {
			border-right-color defaultColor
			margin-right 1rem
			cursor pointer
		}
		.right-arrow {
			border-left-color defaultColor
			margin-left 1rem
			cursor pointer
		}
		select {
			width 30%
			margin 0 .2rem
			border-radius 3px
			color textColor
			background transparent
			&:focus {
				outline none
			}
		}
	}
</style>
<script>
	export default {
		props:{
			user:String
		},
		data(){
			return {
				view:"问卷编辑",
				title:'',
				time:'',
				dateTime:'',
				state:'',
				answer:0,
				queList:[]
			}
		},
		created(){
			this.$parent.view = this.view
			var index = this.$route.params.index
			// dataTime
			if (index === 'new') return
			this.$http.get('../../naire.json').then(res=>{
				var naireList = res.data.naireList
				var naire = naireList[index]
				var match = naire.time.match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/)
				naire.dateTime = new Date(match[1],match[2]-1,match[3])
				this.$data = naire
			})
		},
		ready(){
			// 添加日历组件
			var self = this
			var calendar = new Calendar('calendar', {
				year: {
					start: 1994,
					end: 2020
				},
				inputId: 'until-date',
				selectType: 'radio',
				clicked: function() {
					var untilDate = document.querySelector('#until-date')
					untilDate.value = this.selectDay
					w(this.container).addClass('hide')
					untilDate.dispatchEvent(new Event('change'))
					self.dateTime = this.selectDate
				}
			})
			document.querySelector('#naire-edit .footer-wapper').appendChild(calendar.container)
		},
		methods:{
			// 新建问题
			newQue(){
				var root = this.$root
				if (this.queList.length >= 10) {
					root.info.show("超过10个问题了!",'warn')
				} else {
					this.queList.push({
						title:'',
						type:'',
						selectList:[
							{title:'',choiced:0}
						]
					})
				}
			},
			// 检测是否符合问卷要求
			checkedEmpty(){
				var root = this.$root
				var empty = w('#naire-edit [type="text"]').some(val=>{
					if (!val.value.replace(/^\s+|\s+$/,'')) return true
				})
				if (empty) {
					root.info.show("请填写全部内容",'warn')
					return false
				} else {
					var today = new Date()
					var selectDay = this.dateTime
					if (selectDay < today) {
						root.info.show("截止日期不能在今天及今天之前!",'warn')
					} else {
						return true
					}
				}
				return false
			},
			// 获取并发送问卷
			getNaire(){
				var root = this.$root
				var naire = {}
				// 加上user
				naire.user = this.user || '测试账号'
				// 取消一些不必要的选项
				for (let key in this.$data) {
					if (key === 'dateTime' || key === 'view') continue
					// 根据type选择是否删除selectLsit
					if (key === 'queList') {
						let queList = this.$data.queList
						queList.forEach(que=>{
							if (que.type === 'text') {
								delete que.selectList
								que.content = que.content?que.content:[]
							}
						})
					}
					naire[key] = this.$data[key]
				}
				// 新建问卷
				if (this.$route.params.index === 'new') {
					this.$http.post('../new',naire).then(res=>{
						root.info.show(res.data)
						this.$router.go('/list')
					},res=>{
						root.info.show('连接失败','alert',3000)
						this.$router.go('/list')
					})
				} else {
					this.$http.post('../update',{
						index:this.$route.params.index,
						naire:naire
					}).then(res=>{
						root.info.show(res.data)
						this.$router.go('/list')
					},res=>{
						root.info.show('连接失败','alert',3000)
						this.$router.go('/list')
					})
				}
			},
			// 保存问卷
			saveQue(){
				if (!this.checkedEmpty()) return
				this.state = '未发布'
				this.getNaire()
			},
			// 发布问卷
			releaseQue(){
				if (!this.checkedEmpty()) return
				var root = this.$root
				var typeChoiced = this.queList.every(que=>{
					return que.type !== ''
				})
				if (this.queList.length === 0) {
					root.info.show('不能没有问题','warn')
					return
				}
				if (!typeChoiced) {
					root.info.show('请输入全部问题','warn')
					return
				}
				this.state = '已发布'
				this.getNaire()
			}
		}
	}
</script>
