# before-enter
### 为什么要自造beforeEnter钩子函数？

​	看下问题场景：项目中有一单词列表页面，每个cell都会备注该单词是否已经掌握，点击cell进入详情页，可对该单词进行学习，并标记单词是否掌握，并且在详情页面中也可以通过点击`前进`  `后退` 按钮学习其他的单词。所以但我点击返回时，单词列表要展示所有单词用户掌握的最新情况。

最终的页面关系是这样的：

​	`wordListPage` ——> `wordDetail` （对一系列单词进行学习，退出）——> `wordListPage`（刷新单词列表）   

对于上面的场景，使用Vue生命周期函数是不行的，因为Vue的生命周期函数如：beforeCreate 、created、beforeMounted、mounted等，只有在组件初始化的时候才会被调用，但是当组件（VM实例）来自于缓存（如$route.go(-1) 、keep-alive）中时，生命周期函数将不会再被调用。因此，当我从单词详情页面返回至列表页面时，找不到一个恰当的时期去出发数据更新。所以上面的场景也就无法很好的去做处理。

当然，对于上面的场景是比较少的，但是beforeEnter钩子函数的存在还是有必要的。

### 构造beforeEnter钩子函数

依赖知识点：

 	路由：vue-router   

 	混入：mixin   

​	中央事件总线

#### 1.创建一个中央事件总线

对于中央事件总线，简单理解，就是创建一个公共Vue实例（EventBus），在不同的地方使用相同实例触发`EventBus.$emit('demo') `消息，在想要监听事件的位置使用公共Vue实例进行监听`EventBus.$on('demo',() => {})`。再说白点，就是有这么一个公共组件，它会再不同的地方发消息，又在不同的地方自己去监听消息。所以说消息的发送和接收都是它自己实现的，所以说我们称之为中央事件总线。

代码如下：libs/EventBus.js

```javascript
import Vue from 'vue';
const EventBus = new Vue();
export default EventBus;
```

下面看下怎么使用

#### 2.路由钩子函数beforeEach

通过beforeEach钩子函数，实现路由切换时触发相应组件的beforeEnter事件。

代码如下：router/index.js

```javascript
import EventBus from '@/libs/EventBus';

router.beforeEach((to, from, next) => {
    //如：EventBus.$emit('homeBeforeEnter');
    EventBus.$emit(to.name + 'BeforeEnter');
    
    if (to.matched.some(route => route.meta.isAuth)) {
        ...
        next()
    } else {
        next()
    }
    
})
```



#### 3.创建全局混入对象

这里实现路由切换事件的监听和组件实例钩子函数beforeEnter的触发。

libs/beforeEnterMixin.js

```javascript
import EventBus from './EventBus';

export default {
    beforeCreate() {
        //获取当前路由名称，与前面使用to.name对应
        let vmName = this.$route.name;
        if (!vmName) {
            return;
        }
        // 当组件初始化时，先触发一次，后续将不再调用
        this.$options.beforeEnter();
        const beforeEnter = vmName + 'BeforeEnter';
        //监听路由切换时触发的...BeforeEnter事件
        //通过this.$options获取到实例中的beforeEnter钩子函数
        //监听到...BeforeEnter事件后，触发钩子函数beforeEnter调用
        EventBus.$on(beforeEnter, this.$options.beforeEnter);
    },
    //该函数在这里只作为占位，没有实际意义
    beforeEnter() {}
};
```

对于该混入对象，使用全局或者局部混入都是可行的。



全局混入：main.js

```javascript
import beforeEnterMixin from '@/libs/beforeEnterMixin';
Vue.mixin(beforeEnterMixin);
```



#### 在其他组件中的使用

如：home.vue

```vue
<template>
    <div>
        首页
    </div>
</template>
<script>
export default {
    beforeEnter() {
        console.log('首页 beforeEnter...');
    },
    created() {
        console.log('首页 created...')
    }
}
</script>
```



至此，我们的 beforeEnter 就完成了，可以做个demo自己测试下，目前本人在项目比较多的地方都会用到它。

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
