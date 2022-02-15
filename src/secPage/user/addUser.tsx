import React, { useEffect, useState } from "react";
import ReactDom from "react-dom";
import * as H from "history";
import {
  Form,
  Select,
  Radio,
  message,
  Input,
  Modal,
  Button,
  Upload,
} from "antd";
import { BaseApi } from "../../requests/base-api";
import TextArea from "antd/lib/input/TextArea";
import { roleConstans } from "../../types";
import { FormInstance } from "antd/es/form";
import { UploadOutlined, DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import { imageAddPrefix } from "../../utils";

const { Option } = Select;
export enum ModeType {
  CREATE = "create",
  MODIFY = "modify",
}
interface Props {
  mode: ModeType;
  userInfo?: any;
  onClose: () => void; //的地方就不用重新请求列表
  refresh: () => void; //兼容拓展，在用到的地方就不用重新请求列表
}

function AddUser({
  onClose,
  refresh,
  mode = ModeType.CREATE,
  userInfo = {},
}: Props) {
  const [visible, setVisible] = useState(true);
  const [info, setInfo] = useState<any>({});
  const formRef = React.createRef<FormInstance>();

  useEffect(() => {
    if (mode === ModeType.MODIFY) {
      console.log("zkf", userInfo);
      formRef.current!.setFieldsValue(userInfo);
      setInfo(userInfo);
    }
  }, []);
  const handleOk = () => {};

  const handleCancel = () => {
    shut();
  };

  const createUser = async () => {
    try {
      const res = await BaseApi.addUser({
        ...info,
        time: moment().format("YYYY-MM-DD HH:mm:ss"),
      });
      console.log("zkf", res);
      if (res.statusCode === 200) {
        refresh();
      }
      message.info(res.msg);
      shut();
    } catch (error) {
      message.error(error.message);
      shut();
    }
  };

  const editUser = async () => {
    try {
      const res = await BaseApi.updateUser(info);
      if (res.statusCode === 200) {
        refresh();
      }
      message.info(res.msg);
      shut();
    } catch (error) {
      message.error(error.message);
      shut();
    }
  };

  const shut = () => {
    setVisible(false);
    setTimeout(() => onClose(), 2000);
  };

  const onFinish = (values: any) => {
    console.log("zkf - Success:", values, info);
    mode === ModeType.CREATE ? createUser() : editUser();
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("zkf - Failed:", errorInfo, info);
  };
  const onTypeChange = (e: any) => setInfo({ ...info, role: e.target.value });

  const normFile = (e: any) => {
    console.log("zkf Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };
  const uploadFile = async (file: any) => {
    try {
      let formdata = new FormData();
      formdata.append("file", file);
      const res = await BaseApi.uploadFile(formdata);
      console.log("zkf", res);
      if (res.statusCode === 200) {
        setInfo({ ...info, image: res.url });
        formRef.current!.setFieldsValue({
          image: res.url,
        });
      }
    } catch (error) {}
  };
  return (
    <Modal
      title={`${mode === ModeType.CREATE ? "新增" : "编辑"}用户`}
      visible={visible}
      width={600}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="确定"
      cancelText="取消"
      footer={null}
      maskClosable={false}
    >
      <Form
        name="basic"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ ...info }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        ref={formRef}
      >
        <Form.Item
          label="用户名"
          name="accountName"
          rules={[{ required: true, message: "用户名不能为空!" }]}
        >
          <Input
            placeholder="请输入用户名"
            value={info.accountName}
            onChange={(e) => setInfo({ ...info, accountName: e.target.value })}
          />
        </Form.Item>
        <Form.Item
          label="姓名"
          name="username"
          rules={[{ required: true, message: "用户名不能为空!" }]}
        >
          <Input
            placeholder="请输入姓名"
            value={info.username}
            onChange={(e) => setInfo({ ...info, username: e.target.value })}
          />
        </Form.Item>
        <Form.Item
          label="手机号"
          name="phone"
          rules={[{ required: true, message: "手机号不能为空!" }]}
        >
          <Input
            placeholder="请输入手机号"
            value={info.phone}
            onChange={(e) => setInfo({ ...info, phone: e.target.value })}
          />
        </Form.Item>
        {mode === ModeType.CREATE ? (
          <Form.Item
            label="密码"
            name="password"
            rules={[{ required: true, message: "密码不能为空!" }]}
          >
            <Input.Password
              autoComplete="new-password"
              value={info.password}
              onChange={(e) => setInfo({ ...info, password: e.target.value })}
            />
          </Form.Item>
        ) : (
          ""
        )}
        {mode === ModeType.CREATE ? (
          <Form.Item
            label="确认密码"
            name="repassword"
            rules={[{ required: true, message: "确认密码不能为空!" }]}
          >
            <Input.Password
              autoComplete="new-password"
              value={info.repassword}
              onChange={(e) => setInfo({ ...info, repassword: e.target.value })}
            />
          </Form.Item>
        ) : (
          ""
        )}
        <Form.Item
          label="角色"
          name="role"
          rules={[{ required: true, message: "用户名不能为空!" }]}
        >
          <Radio.Group onChange={onTypeChange} value={info.role}>
            <Radio value={roleConstans.HUMAN}>普通用户</Radio>
            <Radio value={roleConstans.ADMIN}>管理员</Radio>
            <Radio value={roleConstans.SUPER_ADMIN}>超级管理员</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item name="image" label="头像" rules={[{ required: false }]}>
          {info.image ? (
            <h5
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <img
                style={{ maxWidth: 200, maxHeight: 100 }}
                src={imageAddPrefix(info.image || "")}
              />
              <Button
                icon={<DeleteOutlined />}
                type="link"
                onClick={() => {
                  setInfo({ ...info, image: null });
                }}
              >
                删除
              </Button>
            </h5>
          ) : (
            <Upload
              name="logo"
              listType="picture"
              beforeUpload={(file) => {
                uploadFile(file);
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>点击选择图片</Button>
            </Upload>
          )}
        </Form.Item>
        <div className="user-form">
          <Button
            style={{ marginRight: 17 }}
            type="default"
            onClick={() => shut()}
          >
            取消
          </Button>
          <Button type="primary" htmlType="submit">
            确定
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export const showUserModal = (props: Props) => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  ReactDom.render(<AddUser {...props} />, container);
  return {
    destory: () => {
      ReactDom.unmountComponentAtNode(container);
      container.remove();
    },
  };
};
