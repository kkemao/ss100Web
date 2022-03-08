import React, { useEffect, useState } from "react";
import ReactDom from "react-dom";
import * as H from "history";
import { Select, message, Button, Modal, Upload } from "antd";
import {
  InboxOutlined,
  FileExcelOutlined,
  FileZipOutlined,
} from "@ant-design/icons";
import { BaseApi } from "../../requests/base-api";
import "./index.scss";
const { Dragger } = Upload;

export enum ModeType {
  ARTICLE = "article",
  QEUSTION = "question",
}
interface Props {
  mode: ModeType;
  onClose: () => void; //的地方就不用重新请求列表
  refresh: () => void; //兼容拓展，在用到的地方就不用重新请求列表
}

function BatchImport({ onClose, refresh, mode = ModeType.ARTICLE }: Props) {
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<any>(null);
  const [doc, setDoc] = useState<any>(null);

  useEffect(() => {}, []);
  const handleOk = async () => {
    if (!doc && !images) {
      message.info("未选择任何文件以及压缩包");
      shut();
      return;
    }
    if (!doc) {
      message.info("未选择excel文件，将只导入图片");
    }
    if (!images) {
      message.info(
        `未选择图片压缩包，导入的相关的${
          mode === ModeType.ARTICLE ? "文章" : "试题"
        }图片可能无法显示`
      );
    }
    setLoading(true);
    await imagesImport();
    await docImport();
  };

  const handleCancel = () => {
    shut();
  };

  const docImport = async () => {
    if (!doc) return;
    setLoading(true);
    try {
      const server =
        mode === ModeType.ARTICLE
          ? BaseApi.articleImport
          : BaseApi.questionImport;

      let formdata = new FormData();
      formdata.append("file", doc);
      const res = await server(formdata);
      if (res && res.msg) {
        message.info(res.msg);
        refresh();
      } else {
        message.error("导入失败");
      }
      setLoading(false);
      shut();
    } catch (error) {
      setLoading(false);
      message.error(error.message);
    }
  };

  const imagesImport = async () => {
    if (!images) return;
    setLoading(true);
    try {
      let formdata = new FormData();
      formdata.append("file", images);
      const res = await BaseApi.uploadImages(formdata);
      if (res && res.msg) {
        message.info(res.msg);
        refresh();
      } else {
        message.error("导入失败");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(error.message);
    }
  };

  const shut = () => {
    setVisible(false);
    setTimeout(() => onClose(), 2000);
  };
  return (
    <Modal
      title={`批量导入${mode === ModeType.ARTICLE ? "文章" : "试题"}`}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="确定"
      cancelText="取消"
      footer={[
        <Button key="back" onClick={handleCancel}>
          取消
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleOk}
        >
          确定
        </Button>,
      ]}
    >
      <div className="batch-upload-item">
        <label>选择EXCEL文件：</label>
        <Dragger
          {...{
            name: "file",
            multiple: true,
            beforeUpload: (file) => {
              setDoc(file);
              return false;
            },
            onRemove: () => setDoc(null),
            onDrop(e) {
              console.log("zkf Dropped files", e.dataTransfer.files);
            },
          }}
        >
          <p className="ant-upload-drag-icon">
            <FileExcelOutlined />
          </p>
          <p className="ant-upload-text">单击或者拖拽文件到此处</p>
          <p className="ant-upload-hint">仅支持单个excel文件的上传</p>
        </Dragger>
        {/* <Upload
          name="doc"
          listType="picture"
          beforeUpload={(file) => {
            setDoc(file);
            return false;
          }}
          onRemove={() => setDoc(null)}
        >
          <Button size="small" type="link" icon={<InboxOutlined />}>
            选择{mode === ModeType.ARTICLE ? "文章" : "试题"}
          </Button>
        </Upload> */}
      </div>
      <div className="batch-upload-item">
        <label>选择ZIP压缩包：</label>
        <Dragger
          {...{
            name: "file",
            multiple: true,
            beforeUpload: (file) => {
              setImages(file);
              return false;
            },
            onRemove: () => setImages(null),
            onDrop(e) {
              console.log("zkf Dropped files", e.dataTransfer.files);
            },
          }}
        >
          <p className="ant-upload-drag-icon">
            <FileZipOutlined />
          </p>
          <p className="ant-upload-text">单击或者拖拽zip压缩包到此处</p>
          <p className="ant-upload-hint">仅支持单个压缩包的上传，且格式为zip</p>
        </Dragger>
        {/* <Upload
          name="images"
          listType="picture"
          beforeUpload={(file) => {
            // uploadFile(file);
            let formdata = new FormData();
            formdata.append("file", file);
            setImages(file);
            return false;
          }}
        >
          <Button size="small" type="link">
            批量导入图片zip
          </Button>
        </Upload> */}
      </div>
    </Modal>
  );
}

export const showBatchImport = (props: Props) => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  ReactDom.render(<BatchImport {...props} />, container);
  return {
    destory: () => {
      ReactDom.unmountComponentAtNode(container);
      container.remove();
    },
  };
};
