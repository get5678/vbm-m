import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  Row,
  message,
  Popconfirm,
} from 'antd';
import React, { Component, Fragment } from 'react';
import router from 'umi/router';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import moment from 'moment';
import { StateType } from './model';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import { FormValsType } from './components/UpdateForm';
import { TableListItem, TableListPagination, TableListParams } from './data.d';

import styles from './style.less';

const FormItem = Form.Item;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  students: StateType;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  expandForm: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
}


/* eslint react/no-multi-comp:0 */
@connect(
  ({
    students,
    loading,
  }: {
    students: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    students,
    loading: loading.models.rule,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '学员姓名',
      dataIndex: 'userName',
    },
    {
      title: '学员性别',
      dataIndex: 'userSex',
      align: 'center',
      render: val => val === 0 ? '男' : '女'
    },
    {
      title: '学员组长',
      dataIndex: 'user_admin_id',
      render: val => val ? val : '无'
    },
    {
      title: '学员账号',
      dataIndex: 'userPhone'
    },
    {
      title: '上次调度时间',
      dataIndex: 'userCreateTime',
      render: (val: string) => <span>{moment(val).format('YYYY-MM-DD HH:mm')}</span>,
    },
    {
      title: '操作',
      render: (record) => (
        <Fragment>
          
          <a onClick={() => this.handleToAddInterview(record)}>添加面试记录</a>
          <Divider type="vertical" />
          <Popconfirm title="确定删除？" onConfirm={() => this.handleDeleteItem(record.userId)}>
            <a className={styles.deleteButton}>删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'students/getStudentList',
    });
  }

  handleStandardTableChange = (
    pagination: Partial<TableListPagination>,
    filtersArg: Record<keyof TableListItem, string[]>,
    sorter: SorterResult<TableListItem>,
  ) => {
    
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params: Partial<TableListParams> = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }
    dispatch({
      type: 'students/getStudentList',
      payload: {
        current: pagination.current,
        pageSize: pagination.pageSize
      },
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'students/fetch',
      payload: {},
    });
  };


  handleMenuClick = (e: { key: string }) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'students/remove',
          payload: {
            key: selectedRows.map(row => row.userId),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = (rows: TableListItem[]) => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      if (fieldsValue.name) {
        dispatch({
        type: 'students/getStudentSearch',
          payload: fieldsValue,
       });
      }
    });
  };

  handleModalVisible = (flag?: boolean) => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag?: boolean, record?: FormValsType) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = (fields: { desc: any }) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'students/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  /**
   * @description 删除
   * @memberof TableList
   */
  handleDeleteItem = (item: string) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'students/getStudentDelete',
      payload: {
        userId: Number(item),
        successCallback() {
          message.success('删除成功'),
          dispatch({
            type: 'students/getStudentList'
          })
        }
      }
    })
  }
  handleToInterview = (val: any) => {
    router.push({
      pathname: './interview',
      query: val
    })
  }
  handleToAddInterview = (val: any) => {
    router.push({
      pathname: '/interviewedits',
      query: {
        userId: val.userId,
        userName: val.userName
      }
    })
  }

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="学员姓名">
              {getFieldDecorator('name')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }


  render() {
    const {
      students: { studentList },
      loading,
    } = this.props;
    
    const { selectedRows } = this.state;

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={studentList}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create<TableListProps>()(TableList);
