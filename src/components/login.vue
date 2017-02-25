<template>
	<div id="login-page" v-if="display" transition @click.self="display=false" class="animated">
		<div class="wapper">
			<a href="" :class="{'active':signinDisplay === true}" @click.prevent="signinDisplay=true">登录</a>
			<img src="../../favicon.ico" alt="">
			<a href="" :class="{'active':signinDisplay === false}" @click.prevent="signinDisplay=false">注册</a>
			<form class="login" action="./signin" method="post" v-if="signinDisplay">
				<div class="input-wapper" v-for="signin in signinList" :class="{wrong:signin.wrong}">
					<label :for="signin.id">{{ signin.label }}</label>
					<input :type="signin.type" name="signin.id" class="text" :id="signin.id" @input="detect(signin)" v-model="signin.val">
					<span class="detect" v-show="signin.wrong">{{ signin.detectText }}</span>
				</div>
				<button type="submit" class="btn btn-tiny" :disabled="!signinValid" @click.prevent="signinSubmit">提交</button>
			</form>
			<form class="login" action="./signup" method="post" v-if="!signinDisplay">
				<div class="input-wapper" v-for="signup in signupList" :class="{wrong:signup.wrong}">
					<label :for="signup.id">{{ signup.label }}</label>
					<input :type="signup.type" name="signup.id" :placeholder="signup.placeholder" class="text" :id="signup.id" @input="detect(signup)" @blur="checkAccount(signup)" v-model="signup.val">
					<!-- blur只用来验证账号是否存在 -->
					<span class="detect" v-show="signup.wrong">{{ signup.detectText }}</span>
				</div>
				<button type="submit" class="btn btn-tiny" :disabled="!signupValid" @click.prevent="signupSubmit">提交</button>
			</form>
		</div>
	</div>
</template>

<style lang="stylus" scoped>
	@import '../util.styl';
	#login-page{
		position fixed
		top 0
		left 0
		width 100vw
		height 100vh
		z-index 999
		background rgba(115,115,115,0.5)
		display flex 
		justify-content center
		align-items center
	}
	.wapper{
		box-sizing border-box
		width 30vw
		position relative
		bottom 2rem 
		paddiing 2rem 3rem
		background #fff
		border-radius 1rem
		text-align center
		@media (max-width:768px){
			width 70vw
		}
	}
	.login{
		text-align right
		margin-top 1rem
	}
	.detect{
		display block
		padding-left 23%
		@media (max-width:768px){
			padding-left 0
		} 
	}
	.input-wapper{
		min-height 3rem
		text-align left
		&.wrong{
			.text{
				border-color #ee2c2c
			}
			.detect{
				color #ee2c2c
			}
		}
		label{
			width 25% 
		}
		.text{
			padding 5px
			margin .2rem 0
			border-radius 5px
			width 75%
			box-sizing border-box  
		}
		@media (max-width:768px){
			min-height 4rem
			.text{
				display block
				width 100% 
			}
		}
	}
	.btn{
		myBtn(defaultColor)
	}
	.active{
		color #36fc0e
		border-bottom 1px solid currentColor
	}
</style>

<script type="text/javascript">
	import util form '../util.js';
	export default{
		props:{
			display:Boolean;
		},
		data(){
			return {
				signinDisplay:true,
				//登录列表
				signinList:[
				{
					id:'name',
					label:'你的账号：',
					type:'text',
					val:'',
					detectText:'请输入2到10个汉字或英文',
					wrong:''
				},
				{
					id:'password',
					label:'你的密码：',
					type:'password',
					val:'',
					detectText:'密码在6-12位之间',
					wrong:''
				}
				],
				//注册列表
				signupList:[
					{
						id:'name',
						type:'text',
						label:'你的账号：',
						placeholder:'2到10个汉字或英文',
						val:'',
						wrong:''
					},
					{
						id:'password',
						type:'password',
						label:'你的密码：',
						placeholder:'密码在6-12位之间',
						detectText:'输入格式错误！',
						val:'',
						wrong:''
					},
					{
						id:'passwordConfirm',
						type:'password',
						label:'确认密码：',
						placeholder:'与刚才所输入密码相同',
						detectText:'与刚才输入不同',
						val:'',
						wrong:''
					}

				]
			}
		}.
		methods:{
			//验证表单
			detect(input){
				var reg;
				switch (input) {
					case 'name':
						reg = /^(\w|[\u4E00-\u9FFF]){2,10}$/;
						break;
					case 'password':
						reg = /^\S{6,12}$/;
						break;
					case 'passwordConfirm':
						input.wrong = document.getElementById('password').value !== input.val;
						return;
					default:
						return '不可验证';
				}
				input.wrong = !reg.test(input.val);
			},
			//检测账户是否存在
			checkAccount(input){
				if(input.id !== 'name') return;
				this.$http.post('/test',{name:input.val}).then(res=>{
					if(res.data === '账号存在'){
						input.wrong = true;
						input.detectText = '已经存在此账号'
					}
					if(res.data === 'ok'){
						input.detectText = '请输入2到10个汉字或英文';
						console.log('可以注册');
					}
				},res=>{
					this.$root.info.show('连接错误','alert',3000);
				})
			},
			//提交注册表单
			signupSubmit(){
				var user = {};
				var root = this.$root;
				this.signupList.forEach(input=>{
					if(input.id === 'passwordConfirm') return;
					user[input.id] = input.val;
				})
				this.$http.post('/signup',user).then(res=>{
					console.log("注册结果："+res.data);
					if(res.data === '注册成功'){
						this.display = false;
						root.info.show(`${res.data},已自动登录，设置了1天的cookie`);
						root.user.show(user.name);
						//登录成功设置cookie
						for(let key in user){
							util.setCookie('_'+key,user[key],1);
						}
						console.log('设置cookie成功');
					}
				},fail=>{
					root.info.show('连接错误','alert',3000)
				})
			},
			//提交登录表单
			signinSubmit(){
				var user = {};
				var root = this.$root;
				this.signinList.forEach(input=>{
					user[input.id] = input.val;
				})
				this.$http.post('/signin',user).then(res=>{
					console.log("登录结果："+res.data);
					if(res.data === "登录成功"){
						this.display = false;
						root.info.show(`${res.data},设置了1天的cookie`);
						root.user.show(user.name);
						for(let key in user){
							util.setCookie('_'+key,user[key],10);
						}
						console.log('设置cookie成功');
					}else{
						root.info.show(res.data,'alert');
					}
				},fail=>{
					root.info.show('连接错误','alert',3000);
				})
			}
		},
		computed:{
			//检测是否可以提交表单
			//注册
			signupValid(){
				return this.signupList.every(val=>{
					return val.wrong === false;
				})
			},
			//登录
			signinValid(){
				return this.signinList.every(val=>{
					return val.wrong === false;
				})
			}
		},
		watch:{
			'display':function(val){
				if(val){
					this.signinDisplay = true;
				}
			}
		}
	}
</script>