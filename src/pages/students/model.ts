import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { updateRule,  } from './service';
import { userGetList, userGetSearch, userDelete } from '@/services/api'
import { message } from 'antd';
export interface StateType {
  studentList?: any
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    update: Effect;
    getStudentList: Effect;
    getStudentSearch: Effect;
    getStudentDelete: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  };
}


const Model: ModelType = {
  namespace: 'students',
  state: {
    studentList: [],
  },

  effects: {
    *getStudentList({payload}, { call, put }) {
      const response = yield call(userGetList, payload);
      if(response.code !== 0) {
        message.error(response.message)
      }
      yield put({
        type: 'save',
        payload: {
          attr: 'studentList',
          data: response.data
        }
      })
    },
    *getStudentSearch({ payload }, { call, put }) {
      const response = yield call(userGetSearch, payload);
      yield put({
        type: 'save',
        payload: {
          attr: 'studentList',
          data: response.data
        }
      })
    },

    *getStudentDelete({ payload: { successCallback, ...payload } }, { call, put }) {
      const response = yield call(userDelete, payload);
      if(response && response.code === 0) {
        successCallback()
      } else {
        message.error(response.message)
      }
      yield put({
        type: 'save',
        payload: response.data
      })
    },
    
    *update({ payload, callback }, { call, put }) {
      const response = yield call(updateRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },

  reducers: {
    save(state, { payload: { attr, data}}) {
      return {
        ...state,
        [attr]: data
      };
    },
  },
};

export default Model;
