import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import Jsencrypt from 'jsencrypt';
import { routerRedux } from 'dva/router';
import { reloadAuthorized } from '@/utils/Authorized'
import { fakeAccountLogin, getFakeCaptcha } from './service';
import { adminLogin, userLogin } from '../../../services/api';
import { getPageQuery, setAuthority } from './utils/utils';
import { message } from 'antd';
import publicKey from '@/utils/public_key';

const jsencrypt = new Jsencrypt();
export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    getCaptcha: Effect;
    adminLogin: Effect;
    userLogin: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'userLogin',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      
      // Login successfully
      if (response.status === 'ok') {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *userLogin({ payload: { successCallback, ...payload } }, { call, put }) {
      const { password: pas, phone } = payload
      jsencrypt.setPublicKey(publicKey)
      const password = jsencrypt.encrypt(pas);
      const response = yield call(userLogin, { phone, password });
      // const response = yield call(userLogin, payload);
      if(response && response.code === 0) {
        message.success('登录成功')
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('name', response.data.userName)
        localStorage.setItem('id', response.data.userId)
        successCallback()
      } else {
        message.error(response.message)
      }
      yield put({
        type: 'changeLoginStatus',
        payload: {
          currentAuthority: 'user'
        }
      })
      reloadAuthorized()
    },
    *adminLogin({ payload: { successCallback, ...payload } }, { call, put }) {
      // message.loading('登陆中', 0)
      const { password: pas, phone } = payload
      jsencrypt.setPublicKey(publicKey)
      const password = jsencrypt.encrypt(pas);
      const response = yield call(adminLogin, {phone, password});
      if(response && Number(response.code) === 0) {
        message.success('登录成功')
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('name', response.data.adminName)
        localStorage.setItem('id', response.data.adminId)
        successCallback()
      } else {
        message.error(response.message)
      }
      yield put({
        type: 'changeLoginStatus',
        payload: {
          currentAuthority: 'admin'
        }
      })
      reloadAuthorized()
    },
    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

export default Model;
