import { Form, Input, Modal, Button, Icon, Upload, Select } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import React from 'react';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

export interface addInfo{
  userId: number;
  type: number;
  grade: number;
  detail: string;
  file: any;
}

interface CreateFormProps extends FormComponentProps {
  modalVisible: boolean;
  handleAdd: (fieldsValue: addInfo) => void;
  handleModalVisible: () => void;
  handleUpload: (info: any) => void;
  beforeUpload: (file: any) => boolean;
  types: string[];
  grades: string[];
  imageUrl: string;
  loading: boolean;
}
const CreateForm: React.FC<CreateFormProps> = props => {
  const { modalVisible, form, handleAdd, handleModalVisible, handleUpload, types, grades, loading, imageUrl, beforeUpload } = props;
  const { getFieldDecorator } = form;
  const okHandle = () => {
    handleModalVisible()
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };

  const uploadButton = (
    <div>
      <Icon type={loading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">Upload</div>
    </div>
  );

  return (
    <Modal
      destroyOnClose
      title="新建问题"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <Form {...formItemLayout}>
        <FormItem label="用户">
          {getFieldDecorator('userId',{
            rules: [{
              required: true,
              message: '请输入用户id'
            }],
            initialValue: localStorage.getItem('name')
          })(<Input disabled/>)}
        </FormItem>
        <FormItem label='问题类型'>
          {getFieldDecorator('type',{
            rules: [{
              required: true,
              message: '请选择问题类型'
            }],
            initialValue: 0
          })(
            <Select>
              {types.map((item,index) => {
                return (
                  <Option value={index} key={index}>{item}</Option>
                )
              })}
            </Select>
          )}
        </FormItem>
        <FormItem label="问题等级">
          {getFieldDecorator('grade', {
            rules: [{
              required: true,
              message: '请选择问题等级'
            }],
            initialValue: 0
          })(
          <Select>
            {grades.map((item, index) => {
              return (
                <Option value={index} key={index}>{item}</Option>
              )
            })}
          </Select>)}
        </FormItem>
        <FormItem label="问题详情">
          {getFieldDecorator('detail',{
            rules: [{
              required: true,
              message: '请输入问题详情'
            }],
          })(<TextArea />)}
        </FormItem>
        <FormItem label="图片">
          {getFieldDecorator('file',{
            rules: [{
              required: true,
              message: '请输入问题详情'
            }],
          })(
            <Upload
              listType="picture-card"
              showUploadList={false}
              onChange={handleUpload}
              beforeUpload={beforeUpload}
            >
              {imageUrl ? <img style={{width: '100px', height: '100px'}} src={imageUrl} /> : uploadButton}
            </Upload>)}
        </FormItem>
      </Form>
    </Modal>
  );
};

export default Form.create<CreateFormProps>()(CreateForm);
