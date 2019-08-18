import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { addRule, queryRule, removeRule, updateRule, getStudentList } from './service';

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
    fetch: Effect;
    add: Effect;
    remove: Effect;
    update: Effect;
    getStudentList: Effect;
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
      const response = yield call(getStudentList, payload);
      yield put({
        type: 'save',
        payload: {
          attr: 'studentList',
          data: response
        }
      })
    },
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *add({ payload, callback }, { call, put }) {
      const response = yield call(addRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
    *remove({ payload, callback }, { call, put }) {
      const response = yield call(removeRule, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
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
