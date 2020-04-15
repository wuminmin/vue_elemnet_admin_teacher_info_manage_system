import request from '@/utils/request'
import module from '@/settings'
export function login(data) {
  return request({
    // url: '/vue-element-admin/user/login',
    url:module.teacher_base_url+'login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    // url: '/vue-element-admin/user/info',
    url:module.teacher_base_url+'info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    // url: '/vue-element-admin/user/logout',
    url:module.teacher_base_url+'logout',
    method: 'post'
  })
}
