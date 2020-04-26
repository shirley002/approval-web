import request from '@/utils/request'
import {getNewUrl} from '@/utils/index'

//获取登陆用户信息
export function getLoginUserInfo(params) {
  return request({
    url: '/casAuth/loginUserInfo',
    method: 'get'
  })
}


//判断登陆状态
export function checkLoginStatus(ticket) {
  let url = '/casAuth/checkLoginStatus';
//  if (ticket && ticket.trim() !== '') {
//    url += "?ticket=" + ticket + "&service=" + encodeURIComponent(getNewUrl());
//  }
  url += "?service=" + encodeURIComponent(getNewUrl());
  return request({
    url: url,
    method: 'post'
  })
}

//登出接口
export function logout() {
  return request({
    url: '/casAuth/logout',
    method: 'post'
  })
}
//获取用户 可以操作的学校列表
export function userSchoolList() {
  return request({
    url: '/casAuth/userSchoolList',
    method: 'post'
  })
}
//获取用户的权限列表
export function userPermissionList() {
  return request({
    url: '/casAuth/userPermissionList',
    method: 'post'
  })
}
