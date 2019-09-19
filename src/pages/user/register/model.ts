import { AnyAction, Reducer } from 'redux';
import Jsencrypt from 'jsencrypt';
import publicKey from '@/utils/public_key';
import { EffectsCommandMap } from 'dva';
import { fakeRegister } from './service';
import { adminRegister, userRegister } from '@/services/api'
import { message } from 'antd';

const jsencrypt = new Jsencrypt();
export interface StateType {
  status?: 'ok' | 'error';
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
    submit: Effect;
    userRegiste: Effect;
    adminRegist: Effect;
  };
  reducers: {
    registerHandle: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'userRegister',

  state: {
    status: undefined,
  },

  effects: {
    *submit({ payload }, { call, put }) {
      const response = yield call(fakeRegister, payload);
      yield put({
        type: 'registerHandle',
        payload: response,
      });
    },
    *userRegiste({ payload }, { call, put }) {
      const { userPassword: pas } = payload
      jsencrypt.setPublicKey(publicKey)
      const userPassword = jsencrypt.encrypt(pas);
      payload.userPassword = userPassword
      const response = yield call(userRegister, payload);
      let stauts = '';
      if(response && response.code === 0) {
        stauts = 'ok'
      }else {
        message.error(response.message)
        stauts = 'error'
      }
      yield put({
        type: 'registerHandle',
        payload: {
          status: stauts
        }
      })
    },
    *adminRegist({ payload }, { call, put }) {
      const { password: pas } = payload;
      jsencrypt.setPublicKey(publicKey)
      const password = jsencrypt.encrypt(pas);
      payload.password = password;
      const response = yield call(adminRegister, payload);
      let stauts = ''
      if(response && response.code === 0) {
        stauts = 'ok'
      } else {
        message.error(response.message);
        stauts = 'error'
      }
      yield put({
        type: 'registerHandle',
        payload: {
          status: stauts
        }
      })
    }
  },

  reducers: {
    registerHandle(state, { payload }) {
      return {
        ...state,
        status: payload.status,
      };
    },
  },
};

export default Model;
