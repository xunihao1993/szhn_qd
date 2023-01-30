// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 门牌号校验 POST /api/rule */
export async function flag_house_number(body:any, options?: { [key: string]: any }) {
  return request('/api/lease/flag_house_number/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 图书查询 POST /api/rule */
export async function getPage(body:any, options?: { [key: string]: any }) {
  return request('/library/getPage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 图书历史记录查询 POST /api/rule */
export async function getHistoryLeaseResult(body:any, options?: { [key: string]: any }) {
  return request('/library/getLoanLogs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 新建图书 POST /api/rule */
export async function libraryAddOrUpdate(body:any, options?: { [key: string]: any }) {
  return request('/library/addOrUpdate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
/** 出租图书 POST /api/rule */
export async function rentOutLeaseResult(body:any, options?: { [key: string]: any }) {
  return request('/api/lease/rent_out_lease/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
/** 缴费续费图书接口 POST /api/rule */
export async function paymentLeaseResult(body:any, options?: { [key: string]: any }) {
  return request('/api/lease/payment_lease/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 续租图书 POST /api/rule */
export async function reletLeaseResult(body:any, options?: { [key: string]: any }) {
  return request('/library/loanOutInBook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除图书 POST /api/rule */
export async function deleteLeaseResult(body:any, options?: { [key: string]: any }) {
  return request('/library/deleteBook', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新图书信息 POST /api/rule */
export async function updateLeaseResult(body:any, options?: { [key: string]: any }) {
  return request('/api/lease/update_lease/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}



/** 用户查询 POST /api/rule */
export async function getPaymentRecords(body:any, options?: { [key: string]: any }) {
  return request('/sysUser/getPage', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 用户添加接口 POST /api/rule */
export async function sysUserAdd(body:any, options?: { [key: string]: any }) {
  return request('/sysUser/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 用户删除接口 POST /api/rule */
export async function sysUserDeleteById(body:any, options?: { [key: string]: any }) {
  return request('/sysUser/deleteById', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
