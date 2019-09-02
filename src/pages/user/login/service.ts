import request from '@/utils/request';
import { FormDataType } from './index';
import { baseUrl } from '../../../utils/utils'

export async function fakeAccountLogin(params: FormDataType) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

// admin登录
export async function adminLogin(params: any) {
  return request(`${baseUrl}/api/vbm/admin/login`, {
    method: 'POST',
    headers: token,
    data: params
  });
}

export async function userLogin() {

}