// @ts-ignore
/* eslint-disable */
import { request } from 'umi';



/**  租赁概要信息导出 POST /api/rule */
export async function downDetailsExcel(body:any, options?: { [key: string]: any }) {
  return request('/api/export/details_export/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

