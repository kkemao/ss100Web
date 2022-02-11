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
import { EQuestionType, EQStatus } from "../../types";
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
  questionInfo?: any;
  labelList: any;
  onClose: () => void; //的地方就不用重新请求列表
  refresh: () => void; //兼容拓展，在用到的地方就不用重新请求列表
}

function AddQuestion({
  onClose,
  refresh,
  mode = ModeType.CREATE,
  questionInfo = {},
  labelList = [],
}: Props) {
  const [visible, setVisible] = useState(true);
  const [info, setInfo] = useState<any>({});
  const formRef = React.createRef<FormInstance>();

  useEffect(() => {
    if (mode === ModeType.MODIFY) {
      console.log("zkf", questionInfo);
      formRef.current!.setFieldsValue(questionInfo);
      setInfo(questionInfo);
    }
  }, []);
  const handleOk = () => {};

  const handleCancel = () => {
    shut();
  };

  const createQuestion = async () => {
    try {
      const res = await BaseApi.addQuestion({
        ...info,
        imageUrl: "",
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

  const editQuestion = async () => {
    try {
      const res = await BaseApi.updateQuestion(info);
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
    // 如果是判断题需要删除选项内容
    if (info.type === EQuestionType.TF) setInfo({ ...info, options: "" });
    mode === ModeType.CREATE ? createQuestion() : editQuestion();
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("zkf - Failed:", errorInfo, info);
  };
  const onTypeChange = (e: any) => setInfo({ ...info, type: e.target.value });

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
        setInfo({ ...info, cover: res.url });
        formRef.current!.setFieldsValue({
          cover: res.url,
        });
      }
    } catch (error) {}
  };
  return (
    <Modal
      title={`${mode === ModeType.CREATE ? "新增" : "编辑"}题目`}
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
          label="题型"
          name="type"
          rules={[{ required: true, message: "题型不能为空!" }]}
        >
          <Radio.Group onChange={onTypeChange} value={info.type}>
            <Radio value={EQuestionType.SINGLESELECT}>单选题</Radio>
            <Radio value={EQuestionType.MULTISELECT}>多选题</Radio>
            <Radio value={EQuestionType.TF}>判断题</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="题目"
          name="title"
          rules={[{ required: true, message: "题目不能为空!" }]}
        >
          <Input
            value={info.title}
            onChange={(e) => setInfo({ ...info, title: e.target.value })}
          />
        </Form.Item>
        <Form.Item
          label="选项"
          name="options"
          rules={[
            {
              required: info.type !== EQuestionType.TF,
              message: "选项不能为空!",
            },
          ]}
        >
          <TextArea
            disabled={info.type === EQuestionType.TF}
            rows={4}
            value={info.options}
            onChange={(e) => setInfo({ ...info, options: e.target.value })}
          />
        </Form.Item>
        <Form.Item
          label="答案"
          name="answer"
          rules={[{ required: true, message: "答案不能为空!" }]}
        >
          <Input
            value={info.answer}
            onChange={(e) => setInfo({ ...info, answer: e.target.value })}
          />
        </Form.Item>
        <Form.Item
          label="解释"
          name="description"
          rules={[{ required: true, message: "解释不能为空!" }]}
        >
          <TextArea
            rows={4}
            value={info.description}
            onChange={(e) => setInfo({ ...info, description: e.target.value })}
          />
        </Form.Item>
        <Form.Item
          label="类别"
          name="parent_id"
          rules={[{ required: true, message: "所属类别不能为空!" }]}
        >
          <Select
            value={info.parent_id}
            onChange={(value) => {
              formRef.current!.setFieldsValue({
                label_id: null,
              });
              setInfo({ ...info, parent_id: value, label_id: null });
            }}
            style={{ width: "100%" }}
          >
            {labelList
              .filter((item: any) => item.level === 1)
              .map((item: any) => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                );
              })}
          </Select>
        </Form.Item>
        <Form.Item
          label="子类别"
          name="label_id"
          rules={[{ required: true, message: "所属子类别不能为空!" }]}
        >
          <Select
            value={info.label_id}
            onChange={(value) => setInfo({ ...info, label_id: value })}
            style={{ width: "100%" }}
          >
            {labelList
              .filter(
                (item: any) =>
                  item.level === 2 && item.parent_id === info.parent_id
              )
              .map((item: any) => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                );
              })}
          </Select>
        </Form.Item>
        <Form.Item name="cover" label="配图" rules={[{ required: false }]}>
          {info.cover ? (
            <h5
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              {/* <a style={{ width: "80%" }}>{info.cover}</a> */}
              <img
                style={{ maxWidth: 200, maxHeight: 100 }}
                src={imageAddPrefix(info.cover || "")}
              />
              <Button
                icon={<DeleteOutlined />}
                type="link"
                onClick={() => {
                  setInfo({ ...info, cover: null });
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
              <Button icon={<UploadOutlined />}>点击选择文件</Button>
            </Upload>
          )}
        </Form.Item>
        <Form.Item
          label="来源"
          name="origin"
          rules={[{ required: false, message: "" }]}
        >
          <Input
            value={info.origin}
            onChange={(e) => setInfo({ ...info, origin: e.target.value })}
          />
        </Form.Item>
        <Form.Item
          label="状态"
          name="status"
          rules={[{ required: true, message: "状态不能为空!" }]}
        >
          <Radio.Group
            onChange={(e) => setInfo({ ...info, status: e.target.value })}
            value={info.status}
          >
            <Radio value={EQStatus.ONLINE}>在线</Radio>
            <Radio value={EQStatus.OFFLINE}>下架</Radio>
          </Radio.Group>
        </Form.Item>
        <div className="question-form">
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

export const showQuestionModal = (props: Props) => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  ReactDom.render(<AddQuestion {...props} />, container);
  return {
    destory: () => {
      ReactDom.unmountComponentAtNode(container);
      container.remove();
    },
  };
};
