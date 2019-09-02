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

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table';
import { connect } from 'dva';
import { StateType } from './model';
import StandardTable, { StandardTableColumnProps } from './components/StandardTable';
import  { FormValsType } from './components/UpdateForm';
import { TableListItem, TableListPagination, TableListParams } from './data.d';

import styles from './style.less';
import { router } from 'umi';

const FormItem = Form.Item;
const getValue = (obj: { [x: string]: string[] }) =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


interface TableListProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  loading: boolean;
  interview: StateType;
}

interface TableListState {
  modalVisible: boolean;
  updateModalVisible: boolean;
  selectedRows: TableListItem[];
  formValues: { [key: string]: string };
  stepFormValues: Partial<TableListItem>;
}

/* eslint react/no-multi-comp:0 */
@connect(
  ({
    interview,
    loading,
  }: {
    interview: StateType;
    loading: {
      models: {
        [key: string]: boolean;
      };
    };
  }) => ({
    interview,
    loading: loading.models.rule,
  }),
)
class TableList extends Component<TableListProps, TableListState> {
  state: TableListState = {
    modalVisible: false,
    updateModalVisible: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  columns: StandardTableColumnProps[] = [
    {
      title: '学员名称',
      dataIndex: 'interviewUserName',
    },
    {
      title: '面试组长',
      dataIndex: 'interviewAdminName',
    },
    {
      title: '面试次数',
      dataIndex: 'interviewTimes'
    },
    {
      title: '自学能力',
      dataIndex: 'interviewStudyAbility'
    },
    {
      title: '沟通能力',
      dataIndex: 'interviewChatAbility'
    },
    {
      title: '钻研能力',
      dataIndex: 'interviewDigAbility'
    },
    {
      title: '总结能力',
      dataIndex: 'interviewSumAbility'
    },
    {
      title: '操作',
      render: (record) => (
        <Fragment>
          <a onClick={() => this.handleEdit(record.interviewId)}>编辑/查看</a>
          <Divider type="vertical" />
          <Popconfirm title="确认删除？" onConfirm={() => this.handleDelete(record.interviewId)}>
            <a className={styles.red} >删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'interview/fetch',
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
      type: 'interview/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
  };

  handleMenuClick = (e: { key: string }) => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'interview/remove',
          payload: {
            key: selectedRows.map(row => row.key),
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

  handleDelete = (id: number) => {
    
    const { dispatch } = this.props;
    dispatch({
      type:'interview/remove',
      payload: {
        interviewId: id
      },
      callback() {
        message.success('删除成功');
        dispatch({
          type: 'interview/fetch'
        })
      }
    })
  }

  handleEdit = (record: FormValsType) => {
    router.push({
      pathname: '/interviewedits',
      query: {
        interviewId: Number(record),
      }
    })
  }

  handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'interview/searchByName',
        payload: fieldsValue,
      });     
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
      type: 'interview/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = (fields: FormValsType) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'interview/update',
      payload: {
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  renderSimpleForm() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={10} >
            <FormItem label="学员姓名">
              {getFieldDecorator('userName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={10}>
            <FormItem label="组长姓名">
              {getFieldDecorator('adminName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={4} >
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
      interview: { data },
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
              data={data}
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
