import { AnyAction, Reducer } from 'redux';

import { EffectsCommandMap } from 'dva';
import { ListDataType } from './data.d';
import { questionList, questionSearch, questionDelete, questionAdd } from '@/services/api'
import { message } from 'antd';

export interface StateType {
  data: ListDataType
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    getList: Effect;
    search: Effect;
    delete: Effect;
    add: Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'questions',

  state: {
    data: {
      list: [],
      pagination: {
        current: 1,
        pageSize: 5,
        total: 0
      }
    }
  },

  effects: {
    *getList({payload}, {call, put}){
      const response = yield call(questionList, payload);
      if (response && response.code === 0) {
        yield put({
          type: 'queryList',
          payload: {
            list: response.data.list,
            pagination: {
              current: response.data.current,
              total: response.data.total,
              pageSize: response.data.pageSize
            }
          },
        });
      }
    },
    *search({payload},{call, put}){
      const response = yield call(questionSearch, payload)
      if(response && response.code === 0) {
        yield put({
          type: 'queryList',
          payload: {
            list: response.data.list,
            pagination: {
              current: response.data.current,
              total: response.data.total,
              pageSize: response.data.pageSize
            }
          },
        })
      } else {
        message.error(response.message)
      }
    },
    *add({ payload, callback}, {call}) {
      const response = yield call(questionAdd, payload)
      if(response && response.code === 0) {
        callback();
      }else {
        message.error(response.message)
      }
    },
    *delete({payload, successCallback}, {call}) {
      const response = yield call(questionDelete, payload);
      if(response && response.code === 0) {
        successCallback()
      } else {
        message.error(response.message)
      }
    }
  
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        data: action.payload,
      };
    }
  }
};

export default Model;
