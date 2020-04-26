import request from '@/utils/request'
const qs = require("qs")
/*************    班级    ***************/
//获取学校班级选项信息
export function getClassOptionList() {
  return request({
    url: '/busi/gradeoption/list',
    method: 'get'
  })
}

//根据年级查询班级信息
export function getClassesByGrade(params) {
  return request({
    url: '/busi/class/getClassesByGrade',
    method: 'get',
    params : params
  })
}

//获取班级信息
export function classList(params) {
  return request({
    url: '/busi/class/list',
    method: 'get',
    params : params
  })
}

//新增或更新班级信息
export function saveOrUpdateClass(params) {
  return request({
    url: '/busi/class/saveOrUpdate',
    method: 'post',
    data : qs.stringify(params)
  })
}

//停用/启用班级信息
export function changeClassStatus(params) {
  return request({
    url: '/busi/class/changeStatus',
    method: 'post',
    data : qs.stringify(params)
  })
}

//新增或更新班级信息
export function deleteClass(params) {
  return request({
    url: '/busi/class/delete',
    method: 'post',
    data : qs.stringify(params)
  })
}

/****************    学生    ***************/
//获取学生列表
export function getStudentList(params) {
  return request({
    url: '/busi/studentV4/list',
    method: 'get',
    params : params
  })
}

//新增或更新学生信息
export function saveOrUpdateStudent(params) {
  return request({
    url: '/busi/student/saveOrUpdate',
    method: 'post',
    data : qs.stringify(params)
  })
}
//删除学生信息
export function deleteStudent(params) {
  return request({
    url: '/busi/student/delete',
    method: 'post',
    data : qs.stringify(params)
  })
}

//更改学生状态
export function changeStudentStatus(params) {
  return request({
    url: '/busi/student/changeStatus',
    method: 'post',
    data : qs.stringify(params)
  })
}
//获取学生班级信息
export function studentClassList(params) {
  return request({
    url: '/busi/student/studentClassList',
    method: 'get',
    params : params
  })
}
//获取所有班级信息
export function allClassList(params) {
  return request({
    url: '/busi/class/allList',
    method: 'get',
    params : params
  })
}

/****************    教师  ***************/
//获取教师列表
export function getTeacherList(params) {
  return request({
    url: '/busi/teacher/list',
    method: 'get',
    params : params
  })
}

//新增或更新学教师信息
export function saveOrUpdateTeacher(params) {
  return request({
    url: '/busi/teacher/saveOrUpdate',
    method: 'post',
    data : qs.stringify(params)
  })
}

//更改教师状态
export function changeTeacherStatus(params) {
  return request({
    url: '/busi/teacher/changeStatus',
    method: 'post',
    data : qs.stringify(params)
  })
}

//删除教师信息
export function deleteTeacher(params) {
  return request({
    url: '/busi/teacher/delete',
    method: 'post',
    data : qs.stringify(params)
  })
}

/************   系统   *************/
//获取国家字典信息
export function countryDict(params) {
  return request({
    url: '/busi/dict/country',
    method: 'get',
    params : params
  })
}

//获取民族字典信息
export function nationDict(params) {
  return request({
    url: '/busi/dict/nation',
    method: 'get',
    params : params
  })
}


//教职工列表
export function staffList(params) {
  return request({
    url: '/busi/class/staffList',
    method: 'get',
    params : params
  })
}

//设置班主任
export function updateHeadTeacher(params) {
  return request({
    url: '/busi/class/updateHeadTeacher',
    method: 'post',
    data : qs.stringify(params)
  })
}

//获取词典数据
export function dictList(params) {
  return request({
    url: '/busi/dict/list',
    method: 'get',
    parmas : params
  })
}
