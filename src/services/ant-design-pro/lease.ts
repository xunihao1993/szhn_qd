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

/** 租赁查询 POST /api/rule */
export async function getLeaseResult(body:any, options?: { [key: string]: any }) {
  return request('/api/lease/get_lease_result/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 租赁历史记录查询 POST /api/rule */
export async function getHistoryLeaseResult(body:any, options?: { [key: string]: any }) {
  return request('/api/lease/get_history_lease_info/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 新建租赁 POST /api/rule */
export async function addLeaseResult(body:any, options?: { [key: string]: any }) {
  return request('/api/lease/add_lease/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
/** 出租租赁 POST /api/rule */
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
/** 缴费续费租赁接口 POST /api/rule */
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

/** 续租租赁 POST /api/rule */
export async function reletLeaseResult(body:any, options?: { [key: string]: any }) {
  return request('/api/lease/relet_lease/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 退租租赁 POST /api/rule */
export async function deleteLeaseResult(body:any, options?: { [key: string]: any }) {
  return request('/api/lease/delete_lease/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 更新租赁信息 POST /api/rule */
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



/** 缴费记录查询 POST /api/rule */
export async function getPaymentRecords(body:any, options?: { [key: string]: any }) {
  return request('/api/lease/get_payment_records/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
// /** 获取当前的用户 GET /api/currentUser */
// export async function currentUser(options?: { [key: string]: any }) {
//   return request<{
//     data: API.CurrentUser;
//   }>('/api/user/get_user_info/', {
//     method: 'GET',
//     ...(options || {}),
//   });
// }

// /** 退出登录接口 POST /api/login/outLogin */
// export async function outLogin(options?: { [key: string]: any }) {
//   return request<Record<string, any>>('/api/login/outLogin', {
//     method: 'POST',
//     ...(options || {}),
//   });
// }


// /** 此处后端没有提供注释 GET /api/notices */
// export async function getNotices(options?: { [key: string]: any }) {
//   return request<API.NoticeIconList>('/api/notices', {
//     method: 'GET',
//     ...(options || {}),
//   });
// }

// /** 获取规则列表 GET /api/rule */
// export async function rule(
//   params: {
//     // query
//     /** 当前的页码 */
//     current?: number;
//     /** 页面的容量 */
//     pageSize?: number;
//   },
//   options?: { [key: string]: any },
// ) {
//   return request<API.RuleList>('/api/rule', {
//     method: 'GET',
//     params: {
//       ...params,
//     },
//     ...(options || {}),
//   });
// }

// /** 新建规则 PUT /api/rule */
// export async function updateRule(options?: { [key: string]: any }) {
//   return request<API.RuleListItem>('/api/rule', {
//     method: 'PUT',
//     ...(options || {}),
//   });
// }

// /** 新建规则 POST /api/rule */
// export async function addRule(options?: { [key: string]: any }) {
//   return request<API.RuleListItem>('/api/rule', {
//     method: 'POST',
//     ...(options || {}),
//   });
// }

// /** 删除规则 DELETE /api/rule */
// export async function removeRule(options?: { [key: string]: any }) {
//   return request<Record<string, any>>('/api/rule', {
//     method: 'DELETE',
//     ...(options || {}),
//   });
// }
