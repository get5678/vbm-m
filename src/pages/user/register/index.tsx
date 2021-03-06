import { Button, Form, Input, Popover, Progress, Select, message } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import React, { Component } from 'react';
import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import Link from 'umi/link';
import { connect } from 'dva';
import router from 'umi/router';

import { StateType } from './model';
import styles from './style.less';


const FormItem = Form.Item;
const { Option } = Select;

const passwordStatusMap = {
  ok: (
    <div className={styles.success}>
      <FormattedMessage id="user-register.strength.strong" />
    </div>
  ),
  pass: (
    <div className={styles.warning}>
      <FormattedMessage id="user-register.strength.medium" />
    </div>
  ),
  poor: (
    <div className={styles.error}>
      <FormattedMessage id="user-register.strength.short" />
    </div>
  ),
};

const passwordProgressMap: {
  ok: 'success';
  pass: 'normal';
  poor: 'exception';
} = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

interface quer {
  type: string;
}
interface locationProp {
  hash: string;
  key: string;
  pathname: string;
  query: quer;
  search: string;
  state: any;
}

interface RegisterProps extends FormComponentProps {
  location: locationProp;
  dispatch: Dispatch<any>;
  userRegister: StateType;
  submitting: boolean;
}
interface RegisterState {
  count: number;
  confirmDirty: boolean;
  visible: boolean;
  help: string;
  prefix: string;
}

export interface UserRegisterParams {
  mail: string;
  password: string;
  confirm: string;
  mobile: string;
  captcha: string;
  prefix: string;
}

@connect(
  ({
    userRegister,
    loading,
  }: {
    userRegister: StateType;
    loading: {
      effects: {
        [key: string]: string;
      };
    };
  }) => ({
    userRegister,
    submitting: loading.effects['userRegister/submit'],
  }),
)
class Register extends Component<
  RegisterProps,
  RegisterState
> {
  state: RegisterState = {
    count: 0,
    confirmDirty: false,
    visible: false,
    help: '',
    prefix: '86',
  };

  interval: number | undefined = undefined;

  componentDidUpdate() {
    const { userRegister, form } = this.props;
    const account = form.getFieldValue('mail');
    if (userRegister.status === 'ok') {
      message.success('???????????????');
      router.push({
        pathname: '/user/login',
        state: {
          account,
        },
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { form, dispatch, location: { query } } = this.props;
    const identify = query.type || ''
    form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        if(identify === 'admin') {
          dispatch({
            type: 'userRegister/adminRegist',
            payload: {
              phone: values.phone,
              password: values.password,
              name: values.name
            }
          })
        }
        else if(identify === 'user') {
          dispatch({
            type: 'userRegister/userRegiste',
            payload: {
              userPhone: values.phone,
              userPassword: values.password,
              userName: values.name,
              userSex: Number(values.sex)
            }
          })
        }
      }
    });
  };

  checkConfirm = (rule: any, value: string, callback: (messgae?: string) => void) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback(formatMessage({ id: 'user-register.password.twice' }));
    } else {
      callback();
    }
  };

  checkPassword = (rule: any, value: string, callback: (messgae?: string) => void) => {
    const { visible, confirmDirty } = this.state;
    if (!value) {
      this.setState({
        help: formatMessage({ id: 'user-register.password.required' }),
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };


  changePrefix = (value: string) => {
    this.setState({
      prefix: value,
    });
  };


  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const { form, submitting, location: { query } } = this.props;
    const { getFieldDecorator } = form;
    const { help, visible } = this.state;
    const type = query.type || '';
    return (
      <div className={styles.main}>
        <h3>
          <FormattedMessage id={`user-register.register.register.${type}`} />
        </h3>
        <Form onSubmit={this.handleSubmit}>
          <FormItem>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'user-register.userName.required' })
                }
              ]
            }) (
              <Input 
                size="large"
                placeholder={formatMessage({ id: 'user-register.userName.required' })}
              />
            )}
          </FormItem>
          <FormItem>
            {getFieldDecorator('sex', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'user-register.userSex.required' })
                }
              ],
              initialValue: '0'
            })(
              <Select size="large">
                <Option value="0">???</Option>
                <Option value="1">???</Option>
              </Select>
            )}
          </FormItem>
          <FormItem>
            {
              getFieldDecorator('phone', {
                rules: [
                  {
                    required: true,
                    message: formatMessage({ id: 'user-register.confirm-phone.required' }),
                    min: 11
                  }
                ],
              })(
                <Input 
                 size="large"
                 placeholder={formatMessage({ id: 'user-register.confirm-phone.required' })}
                 />
              )
            }
          </FormItem>
          <FormItem help={help}>
            <Popover
              getPopupContainer={node => {
                if (node && node.parentNode) {
                  return node.parentNode as HTMLElement;
                }
                return node;
              }}
              content={
                <div style={{ padding: '4px 0' }}>
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>
                    <FormattedMessage id="user-register.strength.msg" />
                  </div>
                </div>
              }
              overlayStyle={{ width: 240 }}
              placement="right"
              visible={visible}
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    validator: this.checkPassword,
                  },
                ],
              })(
                <Input
                  size="large"
                  type="password"
                  placeholder={formatMessage({ id: 'user-register.password.placeholder' })}
                />,
              )}
            </Popover>
          </FormItem>
          <FormItem>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: formatMessage({ id: 'user-register.confirm-password.required' }),
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(
              <Input
                size="large"
                type="password"
                placeholder={formatMessage({ id: 'user-register.confirm-password.placeholder' })}
              />,
            )}
          </FormItem>
          <FormItem>
            <Button
              size="large"
              loading={submitting}
              className={styles.submit}
              type="primary"
              htmlType="submit"
            >
              <FormattedMessage id="user-register.register.register" />
            </Button>
            <Link className={styles.login} to="/user/login">
              <FormattedMessage id="user-register.register.sign-in" />
            </Link>
          </FormItem>
        </Form>
      </div>
    );
  }
}

export default Form.create<RegisterProps>()(Register);
