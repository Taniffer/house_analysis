import axios from 'axios'

  class MyFetchConf {
    // constructor(){
    //     super()
    // }

      setAuthor(AUTH_TOKEN){
          console.log('zzz')
          if(AUTH_TOKEN){
              window.localStorage['Authorization'] = AUTH_TOKEN
          }
          if(window.localStorage['Authorization']){
              axios.defaults.headers.common['Authorization'] = 'Bearer '+window.localStorage['Authorization'];
          }
      }

      errHandleInit(){
          axios.interceptors.response.use(function (response) {
              // Do something with response data
              if(response.data.errorCode == 0){
                  return response;
              }else throw response.data
          }, function (error) {
              // Do something with response error
              return Promise.reject(error);
          });
      }

      errHandle (error) {
          if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              if(error.response.status == 401){
                  window.location.hash='/login'
                  alert('token 过期, 重新登录')
              }else{
                  console.log('未处理的response错误')
              }
          } else if (error.request) {
              // The request was made but no response was received
              // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
              // http.ClientRequest in node.js
              console.log('resq错误')
              console.log(error.request);
          } else {
              // Something happened in setting up the request that triggered an Error

              switch (error.errorCode){
                  case 10001 :{
                      alert('用户不存在或者密码错误')
                      break
                  }

                  case 10002:{
                      alert(' 输入用户名和密码参数错误')
                      break
                  }

                  default :{
                      console.log('自定义错误')
                      console.log('Error', error);
                      break
                  }
              }
          }
      }

      init(){
          this.errHandleInit()
          this.setAuthor()
      }
  }

export default new MyFetchConf()