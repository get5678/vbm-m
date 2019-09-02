import { Card, Form, List, Tag, Skeleton, Radio, message, Button, Popconfirm } from 'antd';
import React, { Component } from 'react';

import { Dispatch } from 'redux';
import { FormComponentProps } from 'antd/es/form';
import { connect } from 'dva';
import { StateType } from './model';
import { ListItemDataType } from './data.d';
import StandardFormRow from './components/StandardFormRow';
import CreateForm, { addInfo } from './components/CreateForm'
import styles from './style.less';

interface QuestionsProps extends FormComponentProps {
  dispatch: Dispatch<any>;
  questions: StateType;
  loading: boolean;
}


class Questions extends Component<QuestionsProps> {

  state = {
    paginations: {
      total: 0,
      current: 1,
      pageSize: 1,
      defaultCurrent: 1
    },
    type: 5,
    showAdd: false,
    loading: false,
    imageUrl: '',
    addButton: true,
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { paginations: {pageSize, current} } = this.state;
    const identify = localStorage.getItem('antd-pro-authority') || '';
    if (identify !== '["user"]') {
      this.setState({
        addButton: false
      })
    }
    dispatch({
      type: 'questions/getList',
      payload: {
        pageSize,
        current,
      }
    });
  }

  handleSearch = (e: any) => {
    const type = e.target.value
    const { dispatch } = this.props;
    this.setState({
      type
    })
    if (type !== 5) {
      dispatch({
        type: 'questions/search',
        payload: {
          type
        }
      })
    } else if(type === 5){
      dispatch({
        type: 'questions/getList',
      })
    }
  }

  handleChange = (page:number, pageSize:number | undefined) => {
    const { paginations, type } = this.state;
    const { dispatch } = this.props;
    const pagination = Object.assign({}, paginations);
    pagination.current = page;
    pagination.defaultCurrent = page;
    this.setState({
      paginations: pagination
    }, () => {
      if(type === 5) {
        dispatch({
          type: 'questions/getList',
          payload: {
            current: this.state.paginations.current
          }
        })
      }
      else {
        dispatch({
          type: 'questions/search',
          payload: {
            type,
            current: this.state.paginations.current
          }
        })
      }
      
    })
  }

  handleDelete = (id: number | string) => {
    const { dispatch } = this.props;
    const { paginations: { pageSize, current } } = this.state;
    dispatch({
      type: 'questions/delete',
      payload: {
        id: Number(id)
      },
      successCallback() {
        message.success('删除成功');
        dispatch({
          type: 'questions/getList',
          payload: {
            current,
            pageSize
          }
        })
      }
    })
  }

  handleModalVisible = () => {
    const { showAdd } = this.state;
    this.setState({
      showAdd: !showAdd,
      imageUrl: ''
    })
  }

  getBase64 = (img:any, callback:any) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

  handleAdd = (fieldsValue: addInfo) => {
    const { dispatch } = this.props;
    const { paginations: { pageSize, current } } = this.state;
    const data = new FormData();
    
    fieldsValue.userId = Number(localStorage.getItem('id') || undefined)
    fieldsValue.file = fieldsValue.file.fileList[0].originFileObj;
    
    Object.keys(fieldsValue).forEach(key => {
      data.append(key, fieldsValue[key])
    })
    dispatch({
      type: 'questions/add',
      payload: data,
      callback() {
        message.success('添加成功');
        dispatch({
          type: 'questions/getList',
          payload: {
            pageSize,
            current
          }
        })
      }
    })
  }

  
  beforeUpload = (file:any) => {
    const isJpg = file.type === 'image/jpeg' || file.type === 'image/png';
    if(!isJpg) {
      message.error('只能上传jpg或者png')
    }
    const is2M = file.size / 1024 / 1024 < 2;
    if(!is2M) {
      message.error('不能超过2M')
    }
    return isJpg && is2M;
  }

  handleUpload = (info: any) => {
    const { file } = info;
    if (file.status === 'uploading') {
      this.setState({
        loading: true
      })
    }
    if(file.status === 'done') {
      this.getBase64(info.file.originFileObj, (imageUrl:string) =>
        this.setState({
          imageUrl,
          loading: false,
        })
      );
    }
  }


  render() {
    const {
      questions: { data:{list, pagination} }
    } = this.props;
    const { paginations, showAdd, loading, imageUrl, addButton } = this.state;
    paginations.pageSize = pagination.pageSize;
    paginations.total = pagination.total;
    
    const type = ['html', 'css', 'javascript', 'git', 'other']
    const grade = ['A','B','C','D','E','F']

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
      handleUpload: this.handleUpload,
      beforeUpload: this.beforeUpload,
    }
    
    return (
      <>
        <Card bordered={false}>
            <StandardFormRow title="所属类型" block style={{ paddingBottom: 11 }}>
                <Radio.Group onChange={this.handleSearch} defaultValue={5}>
                  <Radio.Button value={5}>全部</Radio.Button>
                  {type.map((item,index) => {
                    return (
                      <Radio.Button key={index} value={index}>{item}</Radio.Button>
                    )
                  })}
                </Radio.Group>
            </StandardFormRow>
          {addButton ? <Button type="primary" onClick={() => this.handleModalVisible()}>添加</Button> : null }
          
        </Card>
        <Card
          style={{ marginTop: 24 }}
          bordered={false}
          bodyStyle={{ padding: '8px 32px 32px 32px' }}
        >
          <List<ListItemDataType>
            size="large"
            loading={list.length < 0 }
            rowKey="id"
            itemLayout="horizontal"
            dataSource={list}
            pagination={{
              onChange: (page, pageSize) => this.handleChange(page, pageSize),
              ...paginations
            }}
            renderItem={item => (
              <List.Item
                key={item.questionId}
                actions={[
                  <a >编辑</a>,
                  <Popconfirm title='确认删除？' onConfirm={() => this.handleDelete(item.questionId)}>
                    <a style={{color: 'red'}}>删除</a>
                  </Popconfirm>
                ]}
              >
                <Skeleton avatar title={false} loading={item.deleted} active>
                  <List.Item.Meta
                    avatar={<img className={styles.listItemExtra} src={item.questionPic} />}
                    title={
                      <p className={styles.listItemMetaTitle} >
                        {item.questionDetail}
                      </p>
                    }
                    description={
                      <span>
                        <Tag>{type[item.questionType]}</Tag>
                        <Tag>{grade[item.questionGrade]}级</Tag>
                      </span>
                    }
                  />
                </Skeleton>
              </List.Item>
            )}
          />
        </Card>
        <CreateForm {...parentMethods} 
          modalVisible={showAdd} 
          types={type} 
          grades={grade}
          loading={loading}
          imageUrl={imageUrl}
          />
      </>
    );
  }
}

const WarpForm = Form.create<QuestionsProps>({
  onValuesChange({ dispatch }: QuestionsProps) {
    // 表单项变化时请求数据
    // 模拟查询表单生效
    dispatch({
      type: 'questions/fetch',
      payload: {
        count: 8,
      },
    });
  },
})(Questions);

export default connect(
  ({
    questions,
    loading,
  }: {
    questions: StateType;
    loading: { models: { [key: string]: boolean } };
  }) => ({
    questions,
    loading: loading.models.questions,
  }),
)(WarpForm);
