"use strict";

import Vue from "vue";
import axios from "axios";
import router from "@/router";
import { Message } from "view-design";

// Full config:  https://github.com/axios/axios#request-config
// axios.defaults.baseURL = process.env.baseURL || process.env.apiUrl || '';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

let config = {
  baseURL: "http://127.0.0.1:3000",
  // baseURL: process.env.baseURL || process.env.apiUrl || ""
  timeout: 60 * 1000, // Timeout
  // withCredentials: true, // Check cross-site Access-Control
};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    if (localStorage.adminToken) {
      config.headers.Authorization = `Bearer ${localStorage.adminToken}`;
    }
    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
_axios.interceptors.response.use(
  (response) => {
    console.log(response);
    const res = response.data;
    // Do something with response data
    console.log(res instanceof Blob);
    if (res.code !== 200 && !(res instanceof Blob)) {
      if(res.code == 401) {
        localStorage.clear()
        return router.push('/login')
      }
      Message.error({
        content: res.msg,
        duration: 2,
      });
      return Promise.reject(new Error(res.msg || "Error"));
    } else {
      return res;
    }
  },
  (error) => {
    console.log("err" + error); // for debug
    if (error.response.data.code == 401) {
       localStorage.clear();
       router.push("/login");
    }
    Message.error({
      content: error.response.data.msg || error.message,
      duration: 2,
    });
    
    return Promise.reject(error);
  }
);

Plugin.install = function(Vue, options) {
  Vue.axios = _axios;
  window.axios = _axios;
  Object.defineProperties(Vue.prototype, {
    axios: {
      get() {
        return _axios;
      },
    },
    $axios: {
      get() {
        return _axios;
      },
    },
  });
};

Vue.use(Plugin);

export default Plugin;
