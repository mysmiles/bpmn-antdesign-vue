import axios from 'axios';
// import store from '@/store';
import storage from 'store';
import notification from 'ant-design-vue/es/notification';
import { VueAxios } from './axios';
import { ACCESS_TOKEN } from '@/store/mutation-types';

import { request, getDomain } from '@/api/api';

const login = () => {
  const data = {
    username: 'admin',
    password: '123456',
    grant_type: 'password',
    client_id: 'vue',
    client_secret: '123456'
  };
  let body;
  return request('post', getDomain() + '/oauth/token', body, data, {});
}

// 异常拦截处理器
const errorHandler = error => {
  if (error.response) {
    const data = error.response.data;
    // 从 localstorage 获取 token
    // const token = storage.get(ACCESS_TOKEN);
    if (error.response.status === 403) {
      notification.error({
        message: '禁止访问',
        description: data.message
      });
    }
    if (error.response.status === 401) {
      // 20210615z 防止开发中突然跳出
      notification.error({
        message: '未登录',
        description: '您还没有登录'
      });

      login()
        .then(result => {
          storage.set(ACCESS_TOKEN, result.access_token, 7 * 24 * 60 * 60 * 1000);
          sessionStorage
          this.$store.commit('SET_TOKEN', result.access_token);
        })
    }
  }
  return Promise.reject(error);
};

// request interceptor
axios.interceptors.request.use(config => {
  const token = storage.get(ACCESS_TOKEN);
  // const token = "jJeB2MuO9qe2qJUwpuUimepqjBo=";
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token;
  }
  config.headers['X-Requested-With'] = 'XMLHttpRequest ';
  // config.timeout = 5000; // request timeout
  return config;
}, errorHandler);

// response interceptor
axios.interceptors.response.use(response => {
  return response.data;
}, errorHandler);

const installer = {
  vm: {},
  install(Vue) {
    Vue.use(VueAxios, axios);
  }
};

export default axios;

export { installer as VueAxios, axios };
