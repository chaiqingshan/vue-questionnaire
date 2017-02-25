<template>
	<article id="naire-list">
		<div class="container">
			<span class="title">标题</span>
			<span class="time">截止时间</span>
			<span class="state">状态</span>
			<button class="btn new" v-link="'/edit/new'">新建问卷</button>
		</div>
		<ul class="naire-wapper">
			<li v-for="naire in naireList" transition="list" @click="naireChecked(naire,$event)">
				<input type="checkbox" v-model="naire.conf.checked" @click.prevent>
				<span class="title">{{ naire.title }}</span>
				<span class="time">{{ naire.time }}</span>
				<span class="state" :class="getClass(naire.state)">{{ naire.state }}</span>
				<i class="fa fa-plus" v-if="X<768" @click.stop="naire.conf.btnShow=naire.conf.btnShow?false:true"></i>
				<div class="btn-wapper" v-if="naire.conf.btnShow || X>768" transition>
					<button class="btn btn-tiny" :disabled="!canEdit(naire)" v-link="'/edit/'+$index">编辑</button>
					<button class="btn btn-tiny" :disabled="user !== naire.user" @click="deleteSingle(naire,$index)">删除</button>
					<button class="btn btn-tiny" :disabled="naire.state === '已发布'?false:true">参加问卷</button>
					<button class="btn btn-tiny" :disabled="naire.state !== '未发布'?false:true" v-link="'/result/'+$index">
						<span>查看数据</span>
						<span class="people" v-if="naire.state !== '未发布'">{{ naire.answer }}</span>
						<span class="inner-data" v-if="naire.state !== '未发布'">已经有{{ naire.answer }}份回答</span>
					</button>
				</div>
			</li>
			<li v-if="naireList.length === 0" transition="list">问卷被删除完了！</li>
			<li transition="list" class="delete" @click="allChecked">
				<input type="checkbox" v-model="conf.allChecked" @click.prevent>
				<span class="title">全选</span>
				<button class="btn btn-tiny delete" :disabled="selectList.length === 0" @click="deleteChecked">删除</button>
			</li>
		</ul>
	</article>
</template>

<style lang="stylus" scoped>
	@import '../util.styl';
	.head-wapper{
		line-height 4rem
		font-size 120%
		span{
			display inline-block
		}
		.btn{
			myBtn(defaultColor)
		}
		.title{
			width 30%
			padding-left 5%
		}
		.time{
			width 20%
		}
		.state{
			width 20%
		}
		@media (max-width:768px){
			.btn{
				display block
				width 100%
				margin-bottom .5rem
			}
			.title{
				width 40%
			}
			.time{
				width 35%
			}
			.state{
				width 15%
			}
		}
	}
	.naire-wapper{
		background #fff
		border-radius 10px
		padding 2% 3%
		li{
			line-height 4rem
			border-bottom 1px solid #ccc
			position relative
			&:hover{
				background #fff1de
			}
		}
		span{
			display inline-block
			white-space nowrap
		}
		[type="checkbox"]{
			position relative
			top 2px
		}
		.fa{
			position absolute
			color defaultColor
			right .3rem
			bottom 38%
			z-index 1
		}
		.btn-wapper {
			display inline-block
			@media (max-width:768px){
				hieght 4rem
				position absolute
				left 0
				top 0
				display flex
				align-items center
				justify-content space-around
				background #fff
			}
		}
		.title{
			width 32%
		}
		.time{
			width 22%
		}
		.state{
			width 10%
		}
		.delete{
			border-bottom none
			.title{
				width 90%
			}
			.btn{
				myBtn(defaultColor)
			}
		}
		@media (max-width:768px){
			.title{
				width 40%
			}
			.time{
				width 34%
			}
			.state{
				width 13%
			}
			.delete .title{
				width 70%
			}
		}
		.in{
			color defaultColor
		}
		.start{
			color #35d51a
		}
		.end{
			color #f11010
		}
		.list-transition{
			transition height .3s ease
			height 4rem
			overflow hidden
			&.list-enter, &.list-leave{
				height 0
			}
		}
		.data{
			position relative
			&:hover{
				.inner-data{
					display block
				}
			}
		}
		.inner-data, .people{
			color defaultColor
			position absolute
			bottom 40%
			left 18%
		}
		.inner-data{
			left -20%
			display none
		}
	}
</style>

<script type="text/javascript">
	export default{
		props:{
			//用户
			user:String;
		},
		data(){
			return {
				view:'问卷列表',
				//获取视口宽高
				X:window.innerWidth,
				Y:window.innerHeight,
				conf:{
					//控制btnwapper显示
					btnShow:false,
					//控制全部选择
					allChecked:false,
					//问卷是否为空
					empty:false
				},
				//获取的问卷数据
				srcNaireList:[],
				//要表现的数据
				naireList:[],
				//被选中的问卷（computed）
				selectList:[]
			}
		},
		created(){
			var root = this.$root;
			root.view = this.view;
			this.$http.get('../../naire.json').then(res=>{
				this.srcNaireList = res.data.naireList || [];
				this.srcNaireList.forEach(naire=>{
					var indexNaire = {};
					for(let key in naire){
						if(key === 'queList') continue;
						if(key === 'time'){
							let reg = /(\d{4})\D+(\d{1,2})\D+(\d{1,2})/g;
							let match = reg.exec(naire[key]);
							let today = new Date(),
							untilTime = new Date(match[1],match[2]-1,match[3]);
							if(untilTime < today){
								naire.state = "已结束";
							}
						}
						indexNaire[key] = naire[key];
					}
					indexNaire.conf = {
						checked:false,
						btnShow:false
					}
					this.naireList.push(indexNaire);
				})
			},res=>{
				root.info.show('连接错误','alert',3000);
			})
		},
		methods:{
			//根据state获取对于的class
			getClass(state){
				switch(state){
					case '已发布':
						return 'in';
					case '未发布':
						return 'start';
					case '已结束':
						return 'end';
					default:
						return '传入state错误'; 
				}
			},
			//单击list选择checkbox的事件
			naireChecked(naire,e){
				if(e.target.tagName.toLowerCase() === 'button') return;
				if(naire.user !== this.user) return;
				naire.conf.checked = naire.conf.checked?false:true;
			},
			//选择全部问卷
			allChecked(e){
				if(e.target.tagName.toLowerCase() === 'button') return;
				//检测是否有自己的问卷
				var someUser = this.naireList.some(naire=>{
					return naier.user === this.user;
				})
				if(!someUser) return;
				this.conf.allChecked = this.conf.allChecked?false:true;
				if(this.conf.allChecked){
					this.naireList.forEach(naire=>{
						if(naire.user !== this.user) return;
						naire.conf.checked = true;
					})
				}else{
					this.naireList.forEach(naire=>{
						if(naire.user !== this.user) return;
						naire.conf.checked = false;
					})
				}
			},
			//删除所有选择问卷
			deleteChecked(){
				if(this.user === "测试账号") return;
				var root = this.$root;
				root.confirm.show('确认删除问卷？');
				this.$on('confirmClicked',msg=>{
					if(msg === 'yes'){
						var index = [];
						this.naireList = this.naireList.filter((naire,inx)=>{
							if(naire.conf.checked){
								index.push(inx);
								return false;
							}
							return true;
						})
						this.conf.allChecked false;
						this.$http.post('/delete',{index}).then(res=>{
							root.info.show(res.data)
						},res=>{
							root.info.show('连接失败','alert');
						})
					}
				})
			},
			//删除单个问卷
			deleteSingle(naire,index){
				if(this.user === "测试账号") return;
				var root = this.$root;
				root.confirm.show("确认删除问卷？");
				this.$on('confirmClicked',msg=>{
					if(msg === 'yes'){
						this.naireList.$remove(naire);
						this.$http.post('/delete',{index}).then(res=>{
							root.info.show(res.data)
						},res=>{
							root.info.show('连接失败','alert');
						})
					}
				})
			},
			//检测是否可以编辑
			canEdit(naire){
				if(naire.user === this.user){
					if(naire.state === '未发布') return true;
				}
				return false;
			}
		},
		computed: {
			selectList(){
				return this.naireList.filter(naire=>{
					return naire.conf.checked === true;
				})
			}
		},
		watch:{
			//控制是否显示没有问卷
			'naireList.length':function(val){
				if(val === 0){
					this.conf.empty = true;
				}
			},
			'selectList.length':function(val){
				if(val === 0) reutrn;
				var naireList = [];
				this.naireList.forEach(naire=>{
					if(naire.user === this.user){
						naireList.push(naire);
					}
				})
				if(val === naireList.length){
					this.conf.allChecked = true;
				}else{
					this.conf.allChecked = false;
				}
			}
		}
	}
</script>