import EventBus from './EventBus';

export default {
    beforeCreate(e) {
        let vmName = this.$route.name;
        if (!vmName) return;       
        this.$options.beforeEnter();
        const beforeEnter = vmName + 'BeforeEnter';
        EventBus.$on(beforeEnter, this.$options.beforeEnter);
    },
    beforeEnter() {}
};