import request from '@/utils/request'
const qs = require("qs")
/*************    流程列表    ***************/
//获取流程列表
export function getFlowList(params) {
  return request({
    url: '/flow',
    method: 'get',
    params:params
  })
}

//启用/停用流程
export function switchOnOff(params) {
    return request({
        url: '/flow/switch',
        method: 'get',
        params:params
    })
}
/*************    流程列表end    ***************/

/*************    流程编辑     ***************/
//获取流程详情
export function getFlowDetail(params) {
    return request({
        url: '/flow/detail',
        method: 'get',
        params:params
    })
}

//保存流程基础信息
export function saveBasic(params) {
    return request({
        url: '/flow/save/basic',
        method: 'post',
        data:qs.stringify(params)
    })
}

//保存流程高级设置
export function saveAdvance(params) {
    return request({
        url: '/flow/save/advance',
        method: 'post',
        data:qs.stringify(params)
    })
}

//保存流程设计
export function saveProcess(params) {
    return request({
        url: '/flow/save/process',
        method: 'post',
        data:qs.stringify(params)
    })
}

//保存可见范围
export function saveVisibleRange(params) {
    return request({
        url: '/flow/save/visible',
        method: 'post',
        data:qs.stringify(params)
    })
}

//获取全部部门及其成员
export function getAllDepartmentAndUser(params) {
    return request({
        url: '/flow/get_all_user',
        method: 'get',
        params:params
    })
}
//获取全部职务和职务类型
export function getJobAndJobType(params) {
    return request({
        url: '/flow/get_jobs_and_jobs_type',
        method: 'get',
        params:params
    })
}
/*************    流程编辑end     ***************/

/*************    我的上报     ***************/
//保存财务审批申请
export function saveApply(params) {
    return request({
        url: '/apply/save',
        method: 'post',
        data:qs.stringify(params)
    })
}

//编辑财务审批申请
export function editApply(params) {
    return request({
        url: '/apply/edit',
        method: 'post',
        data:qs.stringify(params)
    })
}

//获取财务申请列表
export function getFinanceList(params) {
    return request({
        url: '/finance/list',
        method: 'get',
        params:params
    })
}

//获取财务申请数量
export function getFinanceCount(params) {
    return request({
        url: '/finance/count',
        method: 'get',
        params:params
    })
}

//获取单个申请的详情
export function getApplyDetail(params) {
    return request({
        url: '/apply/detail',
        method: 'get',
        params:params
    })
}
/*************    我的上报end     ***************/

/*************    申请审批     ***************/
//获取我的审批列表
export function getApprovalList(params) {
    return request({
        url: '/apply/approval/list',
        method: 'get',
        params:params
    })
}

//获取我的审批列表数量
export function getApprovalCount(params) {
    return request({
        url: '/apply/approval/count',
        method: 'get',
        params:params
    })
}

//审批财务申请
export function approval(params) {
    return request({
        url: '/apply/approval',
        method: 'post',
        params:params
    })
}
/*************    申请审批end     ***************/

/*************    流程看板     ***************/
//获取我的管辖范围
export function getAccessOffice(params) {
    return request({
        url: '/dashborad/offices',
        method: 'get',
        params:params
    })
}

//获取流程看板类型统计
export function getDashboradAll(params) {
    return request({
        url: '/dashborad/all',
        method: 'get',
        params:params
    })
}

//获取流程看板请假
export function getDashboradLeave(params) {
    return request({
        url: '/dashborad/leave',
        method: 'get',
        params:params
    })
}
/*************    流程看板end     ***************/
