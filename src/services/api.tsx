import request from '@/utils/request';
import {
  Code,
  loginInfo,
  registerAdminInfo,
  registerUserInfo,
  getList,
  getStuSearch,
  deleteInfo,
  interviewItem,
  interviewSearchInfo,
  questionSearchInfo,
} from './data';
// const baseUrl = 'http://sensuos.top:8085'

/**
 * @description 管理员登录
 * @param data
 */
export async function adminLogin(data: loginInfo): Promise<Code> {
  return request(`/api/vbm/admin/login`, {
    method: 'POST',
    data,
  });
}
/**
 * @description 学员登录
 */
export async function userLogin(data: loginInfo): Promise<Code> {
  return request(`/api/vbm/user/login`, {
    method: 'POST',
    data,
  });
}
/**
 * @description 管理员注册
 * @param data
 */
export async function adminRegister(data: registerAdminInfo): Promise<Code> {
  return request(`/api/vbm/admin/register`, {
    method: 'POST',
    data,
  });
}
/**
 * @description 学员注册
 * @param data
 */
export async function userRegister(data: registerUserInfo): Promise<Code> {
  return request(`/api/vbm/user/register`, {
    method: 'POST',
    data,
  });
}
/**
 * @description 获取学员列表
 * @param params
 */
export async function userGetList(params: getList): Promise<Code> {
  const token = localStorage.getItem('token') || 'is not token';
  console.log('token', token);
  return request(`/api/vbm/user/list`, {
    method: 'GET',
    headers: {
      token: token,
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    params,
  });
}
export async function userGetSearch(params: getStuSearch): Promise<Code> {
  const token = localStorage.getItem('token') || '';
  return request(`/api/vbm/user/search`, {
    headers: { token },
    params,
  });
}
export async function userDelete(params: deleteInfo): Promise<Code> {
  const token = localStorage.getItem('token') || '';
  return request(`/api/vbm/user/delete`, {
    headers: { token },
    params,
  });
}

// 面试记录
export async function interviewGetList(params: getList): Promise<Code> {
  const token = localStorage.getItem('token') || '';
  return request(`/api/vbm/interview/list`, {
    headers: { token },
    params,
  });
}
export async function interviewSearchById(params: { id: number }): Promise<Code> {
  return request(`/api/vbm/interview/searchById`, {
    headers: { token: localStorage.getItem('token') || '' },
    params,
  });
}
export async function interviewSearchByName(params: interviewSearchInfo): Promise<Code> {
  return request(`/api/vbm/interview/search`, {
    headers: { token: localStorage.getItem('token') || '' },
    params,
  });
}

export async function interviewEdit(data: interviewItem): Promise<Code> {
  return request(`/api/vbm/interview/update`, {
    method: 'POST',
    headers: { token: localStorage.getItem('token') || '' },
    data,
  });
}
export async function interviewDelete(params: { interviewId: number }): Promise<Code> {
  return request(`/api/vbm/interview/delete`, {
    headers: { token: localStorage.getItem('token') || '' },
    params,
  });
}

export async function interviewAdd(data: interviewItem): Promise<Code> {
  return request(`/api/vbm/interview/insert`, {
    method: 'POST',
    headers: { token: localStorage.getItem('token') || '' },
    data,
  });
}

// question
export async function questionList(params: getList): Promise<Code> {
  return request(`/api/vbm/question/list`, {
    params,
    headers: { token: localStorage.getItem('token') || '' },
  });
}
export async function questionSearch(params: questionSearchInfo): Promise<Code> {
  return request(`/api/vbm/question/searchByType`, {
    params,
    headers: { token: localStorage.getItem('token') || '' },
  });
}
export async function questionDelete(params: { id: number }): Promise<Code> {
  return request(`/api/vbm/question/delete`, {
    params,
    headers: { token: localStorage.getItem('token') || '' },
  });
}
export async function questionAdd(data: any): Promise<Code> {
  return request(`/api/vbm/question/insert`, {
    method: 'POST',
    data,
    headers: { token: localStorage.getItem('token') || '' },
  });
}
