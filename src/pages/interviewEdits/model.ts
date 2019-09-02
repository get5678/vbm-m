import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { message } from 'antd';
import { interviewDetailData } from './data.d'
import { interviewSearchById, interviewAdd, interviewEdit } from '@/services/api';

export interface StateType{
  data: interviewDetailData;
}

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: StateType) => T) => T },
) => void;

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    add: Effect;
    searchById: Effect;
    update: Effect;
  };
  reducers: {
    save: Reducer<StateType>;
  }
}
const Model: ModelType = {
  namespace: 'interviewedits',

  state: { data: {} },

  effects: {
    *add({ payload: { successCallback, ...payload }}, {call}) {
      const response = yield call(interviewAdd, payload);
      if(response && response.code === 0) {
        successCallback()
      } else {
        message.error(response.message)
      }
    },
    *update({ payload: { successCallback, ...payload }}, {call}){
      const response = yield call(interviewEdit, payload)
      if(response && response.code === 0) {
        successCallback();
      } else {
        message.error(response.message)
      }
    },
    *searchById({ payload }, { call, put }) {
      const response = yield call(interviewSearchById, payload);
      yield put({
        type: 'save',
        payload: response.data
      })
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        data: action.payload
      }
    }
  }
};

export default Model;
