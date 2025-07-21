import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import permission from './utils/permission';
import DictData from '@/components/DictData/index.vue';
import i18n from './i18n';
import installer from './as-needed';
import { iconsInstaller } from '@/components/IconSelect/util';
import 'element-plus/theme-chalk/display.css';
import '@hnjing/zxzy-admin-plus/es/style/nprogress.scss';
import './styles/themes/rounded.scss';
import './styles/themes/dark.scss';
import './styles/themes/transparent.scss';
import './styles/index.scss';

const app = createApp(App);

// 挂载全局变量
// app.config.globalProperties.$baseImg = import.meta.env.VITE_APP_BASE_IMG;
// app.config.globalProperties.$baseApiImg = import.meta.env.VITE_APP_BASE_API_URL;
// loginEnvironmentConfig().then((res) => {
//   if (res.code == 200) {
//     console.log(res);
//     // app.config.globalProperties.$baseImg = res.ossUrl;
//     // app.config.globalProperties.$baseApiImg = res.apiUrl;
//     app.config.globalProperties.$apiActive = res.apiActive;
//     app.config.globalProperties.$baseImg = res.ossUrl + '/';
//     app.config.globalProperties.$baseApiImg = res.apiUrl + '/';
//     localStorage.setItem('baseApiImg', res.apiUrl + '/');
//   }
// });

app.use(store);
app.use(router);
app.use(permission);
app.use(i18n);
app.use(installer);
app.use(iconsInstaller);
app.component('DictData', DictData);

app.mount('#app');
