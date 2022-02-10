import React, { useEffect, useState } from "react";
import ReactDom from "react-dom";
import * as H from "history";
import { Select, message, Input, Modal, Collapse } from "antd";
import { BaseApi } from "../../requests/base-api";

export enum ModeType {
  CREATE = "create",
  MODIFY = "modify",
}
interface Props {
  id?: number;
  mode: ModeType;
  parentId: number;
  labelInfo?: any;
  labelList?: any[];
  onClose: () => void; //的地方就不用重新请求列表
  refresh: () => void; //兼容拓展，在用到的地方就不用重新请求列表
}

function AddLabel({
  onClose,
  refresh,
  mode = ModeType.CREATE,
  parentId,
  id,
  labelList = [],
  labelInfo,
}: Props) {
  const [visible, setVisible] = useState(true);
  const [name, setName] = useState("");
  const [parent_id, setParent_id] = useState(0);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (mode === ModeType.MODIFY) {
      setName(labelInfo.name);
      setDescription(labelInfo.description);
      setParent_id(labelInfo.parent_id);
    }
  }, []);
  const handleOk = () => {
    mode === ModeType.CREATE ? createLabel() : editLabel();
  };

  const handleCancel = () => {
    shut();
  };

  const createLabel = async () => {
    if (!name) {
      message.info("请填写名称");
      return;
    }
    if (!description) {
      message.info("请填写描述");
      return;
    }
    try {
      const res = await BaseApi.addLabel({
        parent_id: parentId,
        level: parentId === 0 ? 1 : 2,
        name,
        description,
        remark: "",
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

  const editLabel = async () => {
    if (!name) {
      message.info("请填写名称");
      return;
    }
    if (!description) {
      message.info("请填写描述");
      return;
    }
    try {
      const res = await BaseApi.updateLabel({
        id: labelInfo.id,
        parent_id: parent_id,
        level: parent_id === 0 ? 1 : 2,
        name,
        description,
        remark: "",
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

  const shut = () => {
    setVisible(false);
    setTimeout(() => onClose(), 2000);
  };

  return (
    <Modal
      title={`${mode === ModeType.CREATE ? "新增" : "编辑"} ${
        labelInfo?.name ? "【" + labelInfo.name + "】" : ""
      } 标签`}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="确定"
      cancelText="取消"
    >
      {mode === ModeType.MODIFY && labelInfo?.level > 1 ? (
        <div>
          <label>类别</label>
          <div style={{ width: "100%" }}>
            <Select
              style={{ width: "100%" }}
              value={parent_id}
              onChange={(value) => setParent_id(value)}
            >
              {labelList.map((item: any) => {
                return (
                  <Select.Option value={item.id} key={item.id}>
                    {item.name}
                  </Select.Option>
                );
              })}
              {/* <Select.Option value="demo">Demo</Select.Option> */}
            </Select>
          </div>
        </div>
      ) : (
        ""
      )}
      <p>
        <label>名称</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </p>
      <p>
        <label>描述</label>
        <Input.TextArea
          value={description}
          rows={5}
          onChange={(e) => setDescription(e.target.value)}
        />
      </p>
    </Modal>
  );
}

export const showLabelModal = (props: Props) => {
  const container = document.createElement("div");
  document.body.appendChild(container);
  ReactDom.render(<AddLabel {...props} />, container);
  return {
    destory: () => {
      ReactDom.unmountComponentAtNode(container);
      container.remove();
    },
  };
};
