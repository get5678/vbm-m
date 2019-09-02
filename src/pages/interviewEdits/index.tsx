import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Radio,
  message,
} from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';

import router from 'umi/router';
import { Dispatch } from 'redux';
import { StateType } from './model';
import { interviewDetailData } from './data.d'
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';

const FormItem = Form.Item;
const { TextArea } = Input;

interface InterviewEditsProps extends FormComponentProps {
  submitting: boolean;
  interviewedits: StateType;
  dispatch: Dispatch<any>;
  location: {
    query: { 
      interviewId?: number;
      userId?: number; 
      userName?: string;
    }
  }
}
@connect(
  ({ interviewedits }: { interviewedits: StateType;}) => ({
    interviewedits
  })
)
class InterviewEdits extends Component<InterviewEditsProps> {

  state = {
    add: true,
    details: {}
  }

  componentDidMount() {
    const { location: { query }, dispatch } = this.props;
    
    if (query.interviewId) {
      dispatch({
        type: 'interviewedits/searchById',
        payload: { id: query.interviewId }
      })
      this.setState({
        add: false
      })
    } else if(query.userId) {
      let value: interviewDetailData = {
        interviewUserId: Number(query.userId),
        interviewUserName: query.userName
      }
      this.setState({
        add: true,
        details: value
      })
    }
  }

  handleSubmit = (e: React.FormEvent) => {
    const { location: { query }, dispatch, form } = this.props;
    const { add } = this.state;
    e.preventDefault();
    form.validateFields((err, values) => {     
      if (!err) {
        if(add) {
          values.interviewUserId = Number(query.userId);
          dispatch({
            type:'interviewedits/add',
            payload: {
              ...values,
              successCallback() {
                message.success('添加成功');
                router.replace('/interview')
              }
            }
          })
        }else {
          values.interviewId = Number(query.interviewId);
          delete values.interviewAdminName;
          dispatch({
            type: 'interviewedits/update',
            payload: {
              ...values,
              successCallback() {
                message.success('修改成功');
                router.replace('/interview')
              }
            }
          })
        }
      }
    });
  };

  render() {
    const {  interviewedits } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;

    const { add, details } = this.state;
  
    const detail: interviewDetailData  = add ? details : interviewedits.data;

    const abilities = ['interviewTimes', 'interviewStudyAbility', 'interviewChatAbility', 'interviewDigAbility', 'interviewSumAbility']

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };
  
    return (
      <PageHeaderWrapper content={<FormattedMessage id="interviewedits.basic.description" />}>
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
              <FormItem {...formItemLayout} label='学员姓名' >
              {getFieldDecorator('interviewUserName',
                { initialValue: detail.interviewUserName }
              )(<Input style={{ width: '100%' }} disabled={!add} />)}
              </FormItem>
              <FormItem {...formItemLayout} label={<FormattedMessage id='interviewedits.interviewAdminName.label'/>} >
              {getFieldDecorator('interviewAdminName', {
                initialValue: detail.interviewAdminName
              })(<Input style={{ width: '100%' }} />)}
            </FormItem>
            {abilities.map((item) => {
              return (
                <FormItem key={item} {...formItemLayout} label={<FormattedMessage id={`interviewedits.${item}.label`} />}>
                  {getFieldDecorator(item, {
                    rules: [
                      {
                        required: add,
                        message: formatMessage({ id: `interviewedits.${item}.required` }),
                      },
                    ],
                    initialValue: detail[item] || ''
                  })(<InputNumber min={1} style={{ width: '100%' }} />)}
                </FormItem>
              )
            })}
            <FormItem {...formItemLayout} label={formatMessage({ id: 'interviewedits.interviewFuture.label' })} >
              <div>
                {getFieldDecorator('interviewFuture', {
                  rules: [{
                      required: add,
                      message: formatMessage({ id: `interviewedits.interviewFuture.required` }),
                    }],
                  initialValue: detail.interviewFuture || 1,
                })(
                  <Radio.Group>
                    <Radio value={0}>
                      考研
                    </Radio>
                    <Radio value={1}>
                      就业
                    </Radio>
                    <Radio value={2}>
                     不确定
                    </Radio>
                  </Radio.Group>,
                )}
              </div>
            </FormItem>
            <FormItem {...formItemLayout} label={formatMessage({ id: 'interviewedits.interviewIsStay.label' })} >
              <div>
                {getFieldDecorator('interviewIsStay', {
                  rules:[{
                      required: true,
                      message: formatMessage({ id: `interviewedits.interviewIsStay.required` }),
                    }],
                  initialValue: detail.interviewIsStay || 0,
                  })(
                  <Radio.Group>
                    <Radio value={0}>
                      留校
                    </Radio>
                    <Radio value={1}>
                      不留校
                    </Radio>
                    <Radio value={2}>
                      不确定
                    </Radio>
                  </Radio.Group>,
                )}
              </div>
            </FormItem>
            <FormItem {...formItemLayout} label={formatMessage({ id: 'interviewedits.interviewEvaluation.label' })} >
              {getFieldDecorator('interviewEvaluation', {
                rules: [{
                  required: true,
                  message: formatMessage({ id: 'interviewedits.interviewEvaluation.required'})
                }],
                initialValue: detail.interviewEvaluation || ''
              })(<TextArea />)}
            </FormItem>
            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" >
                {add ? '添加' : '修改'}
              </Button>
              <Button style={{ marginLeft: 8 }}>
                <FormattedMessage id="interviewedits.form.delete" />
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<InterviewEditsProps>()(InterviewEdits);
