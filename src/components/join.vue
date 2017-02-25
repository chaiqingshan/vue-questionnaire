<template>
	<article id="que-join">
		<div class="container">
			<h3 class="title">{{ title }}</h3>
			<div class="que-list-wapper">
				<ul class="que-list">
					<li v-for="que in queList">
						<div class="only-choice question" v-if="que.type === 'radio">
							<h4 class="title">{{ que.title }}</h4>
							<ul class="select-list">
								<li v-for="select in selectList">
									<input type="radio" v-model="select.checked" @click="radioClicked(select,que.selectList)">
									<p class="select">{{ select.title }}</p>
								</li>
							</ul>
						</div>
						<div class="text-choice question" v-show="que.type === 'text">
							<h4 class="title">{{ que.title }}</h4>
							<div class="text-answer">
								<textarea v-model="que.textContent"></textarea>
							</div>
						</div>
					</li>
				</ul>
			</div>
			<button class="btn btn-tiny" @click="submit">提交</button>
		</div>
	</article>
</template>
<style lang="stylus" scoped>//具有scoped属性的样式只会应用到当前元素和其子元素
	@import '../util.styl'
	.container{
		background-color #fff
		display flex
		flex-direction column
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
		.title{
			text-align left
		}
		.select{
			display inline-block
			width 80%
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
		}
		[type="checkbox"]{
			position relative
			top 2px
		}
	}
	.text-answer{
		padding-left 5%
		textarea {
			padding .5rem
			margin-top 1rem
			width 60%
			height 10rem
		}
	}
	.btn{
		myBtn(defaultColor)
	}
</style>
<script type="text/javascript">
	export default{
		data(){
			return {
				view:'参加问卷'
			}
		},
		created(){
			this.$parent.view = this.view;
			var index = this.$route.params.index;
			//获得数据
			this.$http.get('../../naire.json').then(res=>{
				var naireList = res.data.naireList;
				var naire = naierList[index];
				naire.queList.forEach(que=>{
					if(que.type !== 'text'){
						que.selectList.forEach(select=>{
							select.checked = false;
						})
					}else{
						que.textContent = '';
					}
				})
				this.$data = naire;
			})
		},
		methods:{
			//单选
			radioClicked(select,list){
				list.forEach(select=>{
					select.checked = false;
				})
				select.checked = 'no';
			},
			//提交问卷
			submit(){
				var root = this.$root;
				//检测选择题是否选择
				var  choiced = this.queList.every(que=>{
					if(que.type !== 'text'){
						let choiced = que.selectList.some(select=>{
							if(select.checked){
								return true;
							}
							return false;
						})
						if(choiced){
							return true;
						}else{
							return false;
						}
					}else{
						return true;
					}
				})
				if(!choiced){
					root.info.show('选择题为必填','warn');
					return;
				}
				root.confirm.show('是否提交？');
				this.$on('confirmClicked',msg=>{
					if(msg === 'yes'){
						this.answer++;
						//确定提交后改变数据
						this.queList.forEach(que=>{
							if(que.type !== 'text'){
								que.selectList.forEach(select=>{
									if(select.checked){
										select.choiced++
									}
								})
							}else{
								if(que.textContent.trim()){
									que.content.push(que.textContent)
								}
							}
						})
						//上传
						var naire = {};
						//取消一些不必要的选项
						for(let key in this.$data){
							//根据type选择是否删除selectList
							if(key === 'queList'){
								let queList = this.$data.queList;
								queList.forEach(que=>{
									if(que.type === 'text'){
										delete que.textContent;
									}else{
										que.selectList.forEach(select=>{
											delete select.checked; 
										})
									}
								})
							}
							naire[key] = this.$data[key];
						}
						this.$http.post('../update',{
							index:this.$route.params.index,
							naire:naire
						}).then(res=>{
							root.info.show(res.data);
							this.$router.go('/list');
						},res=>{
							root.info.show('连接失败','alert',3000);
							this.$router.go('/list');
						})
					}else{
						//pass
					}
				})
			}
		}
	}
</script>