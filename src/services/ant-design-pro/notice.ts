// @ts-ignore
/* eslint-disable */
import { request } from 'umi';



/**  短信通知 POST /api/rule */
export async function shortNote(body:any, options?: { [key: string]: any }) {
  return request('/api/notice/short_note/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

