<template>
	<confirm :confirm="confirm" @clicked="confirmChecked"></confirm>
	<info :info="info"></info>
	<login :display.sync="loginDisplay"></login>
	<header>
		<div class="container">
			<a id="logo" v-link="'/list'">调查问卷</a>
			<span class="state animated" :class="viewChangeClass" @animationEnd="viewChangeClass=''" v-link="'/list'">{{view}}</span>
			<a class="login" @click.prevent="loginPage" v-if="!user.display">登录/注册</a>
			<a href="#" class="user" v-if="user.display" @click.prevent>
				<span>{{user.name}}</span>
				<div class="logout" @click="logout">登出</div>
			</a>
		</div>
	</header>
	<router-view transition transition-mode="out-in" :user="user.name"></router-view>
</template>
<style lang="stylus">
	@import './util.styl'
	body {
		color defaultTextColor
		background defaultBgColor
	}
	.btn {
		border-radius 3px
	}
	.container {
		margin 7vmin auto
		width 1200px
		@media (max-width: 768px) {
			width 97%
			margin 3vmin auto
		}
	}
	.v-transition {
		transition opacity .3s ease &.v-enter,&.v-leave {
			opacity 0
		}  
	}
	.btn {
		white-space nowrap
	}
	.text {
		box-shadow inset 0 0 1000px #fff
	}
	#logo {
		font-size 1.5rem
		@media (max-width: 768px) {
			display none
		}
	}
	header {
		line-height 9vmin
		color #fff 
		background defaultColor
		.container {
			margin-top 0
			display flex 
			justify-content space-between
		}
		.state {
			display inline-block
		}
		.login {
			transition color .3s ease 
			text-shadow 0 1px 2px #444
			&:hover {
				color #36fc0e
			}
		}
		.user {
			transition: color .3s ease
			position relative 
			min-width 3rem 
			text-align: center
			.logout {
				color #fff
				transition .3s ease
				position absolute
				right 0
				left 0
				top 100%
				background defaultColor
				height 0 
				over-flow hidden 
				text-align center 
				border-radius 0 0 5px 5px
				&:hover {
					color inherit
				}
			}
			&:hover {
				color #e73232
				.logout {
					height 2.5rem
					line-height 2.5rem
				}
			}
		}
	}
</style>
<script type="text/javascript">
	import util from './util.js'
	export default {
		data() {
			return {
				//当前页面
				view: '问卷列表',
				//当view改变时的动画
				viewChangeClass: 'swing',
				//登录页面
				loginDisplay: false,
				//用户
				user: {
					display: false,
					name: '',
					show(name){
						this.display = true
						this.name = name
					}
				},
				//确认框组件
				confirm: {
					display: false,
					rightBtnDisplay: true,
					title: '',
					content: '',
					show(content, right=true, title='提示'){
						this.display = true
						this.rightBtnDisplay = right
						this.content = content 
						this.title = title 
					}
				},
				//消息提示组件
				info: {
					display: false,
					type: '',
					content: '',
					delay: '',
					show(content, type="hint", delay=5000){
						this.display = true 
						this.type = type 
						this.content = content
						this.delay = delay
					}
				}
			}
		},
		methods: {
			//confirm选择了确定/取消
			confirmChecked(msg){
				this.$broadcast('confirmClicked',msg)
			},
			//登录页面
			loginPage(){
				this.loginDisplay = true 
				this.info.show("注册时请不要输入常用密码，这只是一个个人练习！", 'warn')
			},
			//登出
			logout(){
				this.user.display = false 
				this.user.name = ''
				util.setCookie('_name','',-1)
				util.setCookie('_password','',-1)
				this.info.show('已注销')
			}
		},
		watch:{
			//检测view的改变
			'view': function(val) {
				this.viewChangeClass = 'swing'
			}
		},
		created(){
			//检测是否存在cookie
			var cookie = document.cookie.split(';')
			var user = {}
			cookie.forEach(val=>{
				val = val.trim()
				let name = val.split('=')[0]
				let value = val.split('=')[1]
				if (name === '_name' || name === '_password') {
					user[name.slice(1,name.length)] = value
				}
			})
			if(!user.name){
				//提示登录测试账号
				this.confirm.show('不想注册可以登录测试账号<br><strong>账号：测试账号</strong><br><strong>密码：123456</strong><br>只可以编辑/删除自己的问卷<br>所有人可以参加/查看问卷<br>测试账号不可删除问卷，未登录的新建问卷都会归类测试账号下', false)
				return
			}
			//使用cookie内容登录
			this.$http.post('/signin',user).then(res=>{
				if(res.data === '登录成功'){
					this.user.show(user.name)
				},res=>{
					console.log('连接服务器失败，无法登录')
				}
			})
		}
	}
</script>