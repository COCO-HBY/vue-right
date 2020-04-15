import Vue from 'vue'
import Popup from './popup.vue'

const PopupBox = Vue.extend(Popup)

Popup.install = function(data){
    let instance = new PopupBox({
        data
    }).$mount();

    document.body.appendChild(instance.$el)

    Vue.nextTick(()=>{
        // show 和弹窗组件里的show对应，用于控制显隐
        instance.show = true
    })
}

export default Popup