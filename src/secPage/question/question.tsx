import React, { useEffect, useState } from "react";
import * as H from "history";
import {
  Button,
  Select,
  Dropdown,
  message,
  Table,
  Tag,
  Tabs,
  Input,
  Popconfirm,
  Space,
  Upload,
  Spin,
} from "antd";
import { BaseApi } from "../../requests/base-api";
import { showQuestionModal, ModeType } from "./addQuestion";
import { EQuestionType } from "../../types";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { showBatchImport, ModeType as MT } from "../batchImport/import";
const { Option } = Select;

interface Props {
  history: H.History;
}
function Question(props: Props) {
  const { history } = props;
  const [loading, setLoading] = useState(false);
  const [labelList, setLabelList] = useState<any>([]);
  const [labelObject, setLabelObject] = useState<any>({});
  const [questionList, setQuestionList] = useState<any>([]);
  const [label_id, setLabel_id] = useState<number | null>(null);
  const [label_children_id, setLabel_children_id] = useState<number | null>(
    null
  );
  const [type, setType] = useState<EQuestionType | null>(null);
  const [total, setTotal] = useState<number | null>(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    getallLabel();
  }, []);

  useEffect(() => {
    getallQuestion();
  }, [page, pageSize, type, label_id, label_children_id, searchText]);
  const getallQuestion = async () => {
    try {
      const res = await BaseApi.queryQuestionList({
        page,
        pageSize,
        searchText,
        label_id,
        label_children_id,
        type,
      });
      let { data, total } = res;
      data = data.map((item, index) => ({ ...item, index: index + 1 }));
      setQuestionList(data);
      setTotal(total);
    } catch (error) {
      message.error(error.message);
    }
  };
  const getallLabel = async () => {
    try {
      const res = await BaseApi.getLabelList();
      const { data } = res;
      const obj: any = {};
      data.map((item: any) => {
        obj[item.id] = item;
        item.children.map((i: any) => {
          obj[i.id] = i;
        });
      });
      setLabelObject(obj);
      setLabelList(res.data);
    } catch (error) {
      message.error(error.message);
    }
  };

  const deleteQuestion = async (id: number) => {
    try {
      const res = await BaseApi.deleteQuestion(id);
      if (res.statusCode === 200) {
        getallQuestion();
      }
      message.info(res.msg);
    } catch (error) {
      message.error(error.message);
    }
  };

  const callback = (key: any) => {
    console.log(key);
  };

  const addOrEditQuestionFun = (param: {
    mode: ModeType;
    questionInfo?: any;
    labelList: any;
  }) => {
    const instance = showQuestionModal({
      mode: param.mode,
      questionInfo: param.questionInfo,
      labelList: param.labelList,
      onClose: () => {
        instance.destory();
      },
      refresh: () => getallQuestion(),
    });
  };

  const columns = [
    {
      title: "??????",
      dataIndex: "index",
      key: "index",
      render: (text: any, record: any) => {
        return <span>{record.index + (page - 1) * pageSize}</span>;
      },
    },
    {
      title: "??????",
      dataIndex: "type",
      key: "type",
      render: (text: any, record: any) => {
        return (
          <Tag
            color={
              record.type === EQuestionType.SINGLESELECT
                ? "green"
                : record.type === EQuestionType.TF
                ? "blue"
                : "gold"
            }
          >
            {record.type === EQuestionType.SINGLESELECT
              ? "??????"
              : record.type === EQuestionType.TF
              ? "??????"
              : "??????"}
          </Tag>
        );
      },
    },
    {
      title: "??????",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "??????",
      dataIndex: "options",
      key: "options",
    },
    {
      title: "??????",
      key: "answer",
      dataIndex: "answer",
    },
    {
      title: "??????",
      key: "origin",
      dataIndex: "origin",
      render: (text: any, record: any) => {
        console.log("zkf", typeof text, text);
        return text || "-";
      },
    },
    {
      title: "??????",
      key: "description",
      dataIndex: "description",
    },
    {
      title: "??????",
      key: "register_time",
      dataIndex: "register_time",
      render: (text: any, record: any) => {
        return <span>{labelObject[record.parent_id]?.name}</span>;
      },
    },
    {
      title: "?????????",
      key: "label_id",
      dataIndex: "label_id",
      render: (text: any, record: any) => {
        return <span>{labelObject[record.label_id]?.name}</span>;
      },
    },
    {
      title: "????????????",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "??????",
      key: "action",
      render: (text: any, record: any) => (
        <Space size="middle">
          <Button
            type="link"
            size="small"
            onClick={() =>
              addOrEditQuestionFun({
                mode: ModeType.MODIFY,
                labelList: Object.values(labelObject),
                questionInfo: record,
              })
            }
          >
            ??????
          </Button>
          <Popconfirm
            title="?????????????"
            onConfirm={() => deleteQuestion(record.id)}
            onCancel={() => {}}
            okText="??????"
            cancelText="??????"
          >
            <Button type="link" size="small" danger>
              ??????
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const uploadFile = async (file: any) => {
    setLoading(true);
    try {
      let formdata = new FormData();
      formdata.append("file", file);
      const res = await BaseApi.questionImport(formdata);
      console.log("zkf", res);
      if (res && res.msg) {
        message.info(res.msg);
      } else {
        message.error("????????????");
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      message.error(error.message);
    }
  };

  const resetSearchParam = () => {
    setPage(1);
    setPageSize(10);
    setLabel_id(null);
    setLabel_children_id(null);
    setSearchText("");
    setType(null);
  };

  return (
    <div className="question-secpage-wrap">
      <div className="sec-header">
        <span className="sec-header-title">????????????</span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ whiteSpace: "nowrap", marginRight: 5 }}>??????:</span>
          <Select
            size="small"
            value={label_id}
            style={{ width: 80, marginRight: 10, fontSize: 12 }}
            onChange={(value) => {
              setLabel_id(value);
              setLabel_children_id(null);
            }}
          >
            {Object.values(labelObject)
              .filter((item: any) => item.level === 1)
              .map((item: any) => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                );
              })}
          </Select>
          <span style={{ whiteSpace: "nowrap", marginRight: 5 }}>??????:</span>
          <Select
            size="small"
            value={label_children_id}
            style={{ width: 120, marginRight: 10, fontSize: 12 }}
            onChange={(value) => setLabel_children_id(value)}
          >
            {Object.values(labelObject)
              .filter(
                (item: any) => item.level === 2 && item.parent_id === label_id
              )
              .map((item: any) => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                );
              })}
          </Select>
          <span style={{ whiteSpace: "nowrap", marginRight: 5 }}>??????:</span>
          <Select
            size="small"
            style={{ width: 70, marginRight: 10, fontSize: 12 }}
            value={type}
            onChange={(value) => setType(value)}
          >
            <Option value={EQuestionType.SINGLESELECT}>?????????</Option>
            <Option value={EQuestionType.MULTISELECT}>?????????</Option>
            <Option value={EQuestionType.TF}>?????????</Option>
          </Select>
          <Input
            placeholder="???????????????????????????"
            value={searchText}
            onChange={(e: any) => setSearchText(e.target.value)}
            style={{ marginRight: 5, fontSize: 12, width: 160 }}
            size="small"
          />
          <Button
            type="link"
            size="small"
            style={{ marginRight: 5 }}
            onClick={() => resetSearchParam()}
          >
            ??????
          </Button>
          <Button
            icon={<SearchOutlined />}
            size="small"
            style={{ marginRight: 5 }}
            onClick={() => getallQuestion()}
          >
            ??????
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={() =>
              addOrEditQuestionFun({
                mode: ModeType.CREATE,
                labelList: Object.values(labelObject),
              })
            }
          >
            ????????????
          </Button>
          <Button
            size="small"
            type="link"
            onClick={() => {
              const instance = showBatchImport({
                mode: MT.QEUSTION,
                onClose: () => {
                  instance.destory();
                },
                refresh: () => getallQuestion(),
              });
            }}
          >
            ????????????
          </Button>
          {/* <Upload
            name="logo"
            listType="picture"
            beforeUpload={(file) => {
              uploadFile(file);
              return false;
            }}
          >
            <Button size="small" type="link">
              ????????????
            </Button>
          </Upload> */}
        </div>
      </div>
      <div className="secpage-content">
        <Table
          columns={columns}
          dataSource={questionList}
          pagination={{
            total: total || 0,
            current: page,
            showTotal: (total, range) => <span>???{total}???</span>,
            pageSize,
            pageSizeOptions: [10, 15, 20, 30, 50],
            onChange: (page, pageSize) => setPage(page),
            onShowSizeChange: (current, size) => {
              setPageSize(size);
              setPage(1);
            },
          }}
        />
      </div>
      <div
        className="article-loading"
        style={{ display: loading ? "" : "none" }}
      >
        <Spin spinning={loading} tip="????????????..."></Spin>
      </div>
    </div>
  );
}

export default Question;
