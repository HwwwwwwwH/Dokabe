import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ViewUI from 'view-design'
import 'iview/dist/styles/iview.css'
//@ts-ignore
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
import hljs from 'highlight.js'
import 'highlight.js/styles/googlecode.css'

let options = {
  fullscreenEl: false
};

Vue.use(preview, options)
Vue.use(preview)
Vue.use(ViewUI)

Vue.directive('highlight',function (el) {
  let blocks = el.querySelectorAll('pre code');
  blocks.forEach((block)=>{
    hljs.highlightBlock(block as any)
  })
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

document.title = "清软论坛"

router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('jwt')
  let logId = localStorage.getItem('logId')
  if(!token && to.path != '/login') {
    // next({path: '/login'})
  }
  else if(to.path.indexOf('post') !== -1){
    let asyncLocalStorage = store.state.AsyncLocalStorage
    let hisstring = localStorage.getItem('historyid'+logId)
    let his
    if(hisstring) {
      his = JSON.parse(hisstring as any)
    }
    else {
      his = []
    }
    let last = his[his.length-1]
    if(last === to.params.id) {
      next()
    }
    else {
      his.push(to.params.id)
      asyncLocalStorage.setItem('historyid'+logId, JSON.stringify(his))
      next()
    }
  }
  else {
    next()
  }
})