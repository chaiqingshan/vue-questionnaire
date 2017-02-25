import Vue from 'vue';
import Router from 'vue-router';
import XHR from 'vue-resource';
import App from './app.vue';
import ConfirmPage from './components/confirm.vue';
import InfoPage from './components/info.vue';
import LoginPage from './components/login.vue';
import QueList from './components/list.vue';
import EditPage from './components/edit.vue';
import JoinPage from './components/join.vue';
import ResultPage from './components/result.vue';

Vue.use(Router);
Vue.use(XHR);
Vue.config.devtools = true;
Vue.config.debug = true;

Vue.component('confirm', ConfirmPage);
Vue.component('info', InfoPage);
Vue.component('login', LoginPage);

function bindTransitionClass(tag,enter,leave){
	Vue.transition(tag,{
		enterClass: enter,
		leaveClass: leave
	});
}
bindTransitionClass('roll','rollIn','rollOut');
bindTransitionClass('zoom','zoomIn','zoomOut');
bindTransitionClass('fade','fadeInDown','fadeOutUp');

var router = new Router({
	hashbang: false,
	transitionOnLoad: true
});

router.map({
	'/list':{
		component: QueList
	},
	'/edit/:index':{
		component: EditPage
	},
	'join/:index':{
		component:JoinPage
	},
	'result/:index':{
		component:ResultPage
	}
});

router.redirect({
	'*': '/list'
});

router.beforeEach(function(){
	window.scrollTo(0,0);
});

router.start(App, 'div');