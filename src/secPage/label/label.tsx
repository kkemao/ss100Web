import React, { useEffect, useState } from "react";
import * as H from "history";
import {
  Button,
  Empty,
  Dropdown,
  message,
  Table,
  Tag,
  Tabs,
  Popconfirm,
  Collapse,
} from "antd";
import { BaseApi } from "../../requests/base-api";
import { showLabelModal, ModeType } from "./addLabel";

const { Panel } = Collapse;

interface Props {
  history: H.History;
}
function Label(props: Props) {
  const { history } = props;
  const [labelList, setLabelList] = useState<any>([]);

  useEffect(() => {
    getallLabel();
  }, []);
  const getallLabel = async () => {
    try {
      const res = await BaseApi.getLabelList();
      setLabelList(res.data);
    } catch (error) {
      message.error(error.message);
    }
  };

  const deleteLabel = async (id: number) => {
    try {
      const res = await BaseApi.deleteLabelList(id);
      if (res.statusCode === 200) {
        getallLabel();
      }
      message.info(res.msg);
    } catch (error) {
      message.error(error.message);
    }
  };

  const callback = (key: any) => {
    console.log(key);
  };

  const addOrEditLabelFun = (param: {
    mode: ModeType;
    parentId: number;
    labelInfo?: any;
    id?: number;
    labelList?: any[];
  }) => {
    const instance = showLabelModal({
      mode: param.mode,
      parentId: param.parentId,
      labelInfo: param.labelInfo,
      labelList,
      onClose: () => {
        instance.destory();
      },
      refresh: () => getallLabel(),
    });
  };

  return (
    <div className="label-secpage-wrap">
      <div className="sec-header">
        <span className="sec-header-title">标签管理</span>
        <div>
          <Button
            type="primary"
            size="small"
            onClick={() =>
              addOrEditLabelFun({
                mode: ModeType.CREATE,
                parentId: 0,
              })
            }
          >
            添加类别
          </Button>
          <Button size="small" type="link">
            批量导入
          </Button>
        </div>
      </div>
      <div className="secpage-content">
        {labelList.length ? (
          <Collapse
            defaultActiveKey={[labelList[0]?.id]}
            className="collapse-box"
            onChange={callback}
          >
            {labelList.map((label: any) => (
              <Panel
                header={
                  <h5 className="first-line">
                    <span>{label.name}</span>
                    <span
                      className="fl-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        type="link"
                        size="small"
                        onClick={() =>
                          addOrEditLabelFun({
                            mode: ModeType.CREATE,
                            parentId: label.id,
                            labelInfo: label,
                          })
                        }
                      >
                        添加
                      </Button>
                      <Button
                        type="link"
                        size="small"
                        onClick={() =>
                          addOrEditLabelFun({
                            mode: ModeType.MODIFY,
                            id: label.id,
                            parentId: label.id,
                            labelInfo: label,
                            labelList,
                          })
                        }
                      >
                        编辑
                      </Button>
                      <Popconfirm
                        title="是否删除?"
                        onConfirm={() => deleteLabel(label.id)}
                        onCancel={() => {}}
                        okText="确定"
                        cancelText="取消"
                      >
                        <Button type="link" size="small" danger>
                          删除
                        </Button>
                      </Popconfirm>
                    </span>
                  </h5>
                }
                key={label.id}
              >
                {label.children.map((lc: any) => (
                  <div className="second-label-box" key={lc.id}>
                    <div className="seclabel-name">{lc.name}</div>
                    <div className="seclabel-description">
                      <span className="sd-left">{lc.description}</span>
                      <div className="sd-right">
                        <Button
                          type="link"
                          size="small"
                          onClick={() =>
                            addOrEditLabelFun({
                              mode: ModeType.MODIFY,
                              id: lc.id,
                              parentId: lc.id,
                              labelInfo: lc,
                              labelList,
                            })
                          }
                        >
                          编辑
                        </Button>
                        <Popconfirm
                          title="是否删除?"
                          onConfirm={() => deleteLabel(lc.id)}
                          onCancel={() => {}}
                          okText="确定"
                          cancelText="取消"
                        >
                          <Button type="link" size="small" danger>
                            删除
                          </Button>
                        </Popconfirm>
                      </div>
                    </div>
                  </div>
                ))}
              </Panel>
            ))}
          </Collapse>
        ) : (
          <Empty style={{ marginTop: "25vh" }} />
        )}
      </div>
    </div>
  );
}

export default Label;
