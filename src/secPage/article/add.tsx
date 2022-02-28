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
import { EQStatus } from "../../types";
import { FormInstance } from "antd/es/form";
import {
  UploadOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  PictureOutlined,
  FileWordOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { imageAddPrefix } from "../../utils";

const { Option } = Select;
export enum ModeType {
  CREATE = "create",
  MODIFY = "modify",
}
interface Props {
  mode: ModeType;
  articleInfo?: any;
  labelList: any;
  onClose: () => void; //的地方就不用重新请求列表
  refresh: () => void; //兼容拓展，在用到的地方就不用重新请求列表
}

function AddArticle({
  onClose,
  refresh,
  mode = ModeType.CREATE,
  articleInfo = {},
  labelList = [],
}: Props) {
  const [visible, setVisible] = useState(true);
  const [info, setInfo] = useState<any>({});
  const formRef = React.createRef<FormInstance>();

  useEffect(() => {
    if (mode === ModeType.MODIFY) {
      const _info = {
        ...articleInfo,
        content: JSON.parse(
          articleInfo.content.replace(/\n/g, "\\n").replace(/\r/g, "\\r")
        ),
      };
      formRef.current!.setFieldsValue(_info);
      setInfo(_info);
    }
  }, []);
  const handleOk = () => {};

  const handleCancel = () => {
    shut();
  };

  const createArticle = async () => {
    try {
      const res = await BaseApi.addArticle({
        ...info,
        content: JSON.stringify(info.content),
        imageUrl: "",
        time: moment().format("YYYY-MM-DD HH:mm:ss"),
      });
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

  const editArticle = async () => {
    try {
      const _i = { ...info, content: JSON.stringify(info.content) };
      const res = await BaseApi.updateArticle(_i);
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
    mode === ModeType.CREATE ? createArticle() : editArticle();
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
  const uploadFile = async (file: any, isCover: boolean) => {
    try {
      let formdata = new FormData();
      formdata.append("file", file);
      const res = await BaseApi.uploadFile(formdata);
      console.log("zkf", res);
      if (res.statusCode === 200) {
        if (isCover) {
          setInfo({ ...info, cover: res.url });
          formRef.current!.setFieldsValue({
            cover: res.url,
          });
        } else {
          const content = info.content || [];
          content.push({ type: 1, content: res.url });
          setInfo({ ...info, content });
        }
      }
    } catch (error) {}
  };
  const controlSort = (
    index: number,
    d: "up" | "down" | "del" | "edit",
    value?: string
  ) => {
    const { content } = info;
    if (d === "del" && content.length <= 1) {
      message.info("内容不能为空，请至少保留一条.");
      return;
    }
    if (d === "up") {
      const item = content[index];
      content[index] = content[index - 1];
      content[index - 1] = item;
    } else if (d === "down") {
      const item = content[index];
      content[index] = content[index + 1];
      content[index + 1] = item;
    } else if (d === "del") {
      content.splice(index, 1);
    } else if (d === "edit") {
      content[index].content = value;
    }
    setInfo({ ...info, content: content });
  };
  return (
    <Modal
      title={`${mode === ModeType.CREATE ? "新增" : "编辑"}文章`}
      visible={visible}
      width={900}
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
          label="标题"
          name="title"
          rules={[{ required: true, message: "标题不能为空!" }]}
        >
          <Input
            value={info.title}
            onChange={(e) => setInfo({ ...info, title: e.target.value })}
          />
        </Form.Item>
        <Form.Item
          label="作者"
          name="auth"
          rules={[{ required: false, message: "" }]}
        >
          <Input
            value={info.auto}
            onChange={(e) => setInfo({ ...info, auth: e.target.value })}
          />
        </Form.Item>
        <Form.Item
          label="简述"
          name="sketch"
          rules={[{ required: true, message: "答案不能为空!" }]}
        >
          <TextArea
            rows={2}
            value={info.sketch}
            onChange={(e) => setInfo({ ...info, sketch: e.target.value })}
          />
        </Form.Item>
        <Form.Item name="cover" label="封面" rules={[{ required: false }]}>
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
                uploadFile(file, true);
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>点击选择文件</Button>
            </Upload>
          )}
        </Form.Item>
        <Form.Item
          label="内容"
          name="content"
          rules={[{ required: true, message: "所属内容不能为空!" }]}
        >
          <div
            style={{
              // background: "whitesmoke",
              padding: 5,
              borderRadius: 5,
            }}
          >
            {info?.content?.map((item: any, index: number) => {
              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    margin: "5px 0",
                    background: "#fdfbfb",
                    borderRadius: 5,
                  }}
                >
                  {item.type === 1 ? (
                    <img
                      alt=""
                      style={{ maxWidth: 400, maxHeight: 200 }}
                      src={imageAddPrefix(item.content || "")}
                    />
                  ) : (
                    <TextArea
                      rows={2}
                      value={item.content}
                      style={{ maxWidth: "75%" }}
                      onChange={(e) =>
                        controlSort(index, "edit", e.target.value)
                      }
                    />
                  )}
                  <span>
                    {index === 0 ? (
                      ""
                    ) : (
                      <Button
                        type="link"
                        title="向上移动"
                        icon={<ArrowUpOutlined />}
                        onClick={() => controlSort(index, "up")}
                      />
                    )}
                    {index === info.content.length - 1 ? (
                      ""
                    ) : (
                      <Button
                        type="link"
                        title="向下移动"
                        icon={<ArrowDownOutlined />}
                        onClick={() => controlSort(index, "down")}
                      />
                    )}
                    <Button
                      type="link"
                      title="删除"
                      icon={<DeleteOutlined />}
                      onClick={() => controlSort(index, "del")}
                    />
                  </span>
                </div>
              );
            })}
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                background: "rgb(251,251,251)",
                padding: 5,
                borderRadius: 5,
              }}
            >
              <Button
                type="link"
                icon={<FileWordOutlined />}
                onClick={() => {
                  const content = info.content || [];
                  content.push({ type: 2, content: "" });
                  setInfo({ ...info, content });
                }}
              >
                插入段落
              </Button>
              <Upload
                name="logo"
                listType="picture"
                showUploadList={false}
                beforeUpload={(file) => {
                  uploadFile(file, false);
                  return false;
                }}
              >
                <Button
                  style={{ marginLeft: 10 }}
                  type="link"
                  icon={<PictureOutlined />}
                >
                  插入图片
                </Button>
              </Upload>
            </div>
          </div>
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
        <Form.Item
          label="备注"
          name="description"
          rules={[{ required: true, message: "备注不能为空!" }]}
        >
          <TextArea
            rows={4}
            value={info.description}
            onChange={(e) => setInfo({ ...info, description: e.target.value })}
          />
        </Form.Item>
        <div className="article-form">
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

export const showArticleModal = (props: Props) => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  ReactDom.render(<AddArticle {...props} />, container);
  return {
    destory: () => {
      ReactDom.unmountComponentAtNode(container);
      container.remove();
    },
  };
};
