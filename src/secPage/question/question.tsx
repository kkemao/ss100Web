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
} from "antd";
import { BaseApi } from "../../requests/base-api";
import { showQuestionModal, ModeType } from "./addQuestion";
import { EQuestionType } from "../../types";
import { SearchOutlined } from "@ant-design/icons";
const { Option } = Select;

interface Props {
  history: H.History;
}
function Question(props: Props) {
  const { history } = props;
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
    getallQuestion();
  }, []);

  useEffect(() => {
    getallQuestion();
  }, [page, pageSize, type, label_id, label_children_id]);
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
      title: "编号",
      dataIndex: "index",
      key: "index",
      render: (text: any, record: any) => {
        return <span>{record.index + (page - 1) * pageSize}</span>;
      },
    },
    {
      title: "题型",
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
              ? "单选"
              : record.type === EQuestionType.TF
              ? "判断"
              : "多选"}
          </Tag>
        );
      },
    },
    {
      title: "题目",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "选项",
      dataIndex: "options",
      key: "options",
    },
    {
      title: "答案",
      key: "answer",
      dataIndex: "answer",
    },
    {
      title: "来源",
      key: "origin",
      dataIndex: "origin",
    },
    {
      title: "解释",
      key: "description",
      dataIndex: "description",
    },
    {
      title: "类别",
      key: "register_time",
      dataIndex: "register_time",
      render: (text: any, record: any) => {
        return <span>{labelObject[record.parent_id]?.name}</span>;
      },
    },
    {
      title: "子类别",
      key: "label_id",
      dataIndex: "label_id",
      render: (text: any, record: any) => {
        return <span>{labelObject[record.label_id]?.name}</span>;
      },
    },
    {
      title: "创建时间",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "操作",
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
            编辑
          </Button>
          <Popconfirm
            title="是否删除?"
            onConfirm={() => deleteQuestion(record.id)}
            onCancel={() => {}}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];
  const uploadFile = async (file: any) => {
    try {
      let formdata = new FormData();
      formdata.append("file", file);
      const res = await BaseApi.questionImport(formdata);
      console.log("zkf", res);
      message.info(res.msg);
    } catch (error) {
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
        <span className="sec-header-title">试题管理</span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ whiteSpace: "nowrap", marginRight: 5 }}>类别:</span>
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
          <span style={{ whiteSpace: "nowrap", marginRight: 5 }}>子类:</span>
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
          <span style={{ whiteSpace: "nowrap", marginRight: 5 }}>题型:</span>
          <Select
            size="small"
            style={{ width: 70, marginRight: 10, fontSize: 12 }}
            value={type}
            onChange={(value) => setType(value)}
          >
            <Option value={EQuestionType.SINGLESELECT}>单选题</Option>
            <Option value={EQuestionType.MULTISELECT}>多选题</Option>
            <Option value={EQuestionType.TF}>判断题</Option>
          </Select>
          <Input
            placeholder="输入关键词进行搜索"
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
            重置
          </Button>
          <Button
            icon={<SearchOutlined />}
            size="small"
            style={{ marginRight: 5 }}
            onClick={() => getallQuestion()}
          >
            筛选
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={() =>
              addOrEditQuestionFun({
                mode: ModeType.CREATE,
                labelList: Object.values(labelObject),
              })
            }
          >
            添加试题
          </Button>
          <Upload
            name="logo"
            listType="picture"
            beforeUpload={(file) => {
              uploadFile(file);
              return false;
            }}
          >
            <Button size="small" type="link">
              批量导入
            </Button>
          </Upload>
        </div>
      </div>
      <div className="secpage-content">
        <Table
          columns={columns}
          dataSource={questionList}
          pagination={{
            total: total || 0,
            current: page,
            showTotal: (total, range) => <span>共{total}条</span>,
            pageSize,
            pageSizeOptions: [10, 15, 20, 30, 50],
            onChange: (page, pageSize) => {
              setPage(page);
            },
            onShowSizeChange: (current, size) => {
              setPageSize(size);
              setPage(1);
            },
          }}
        />
      </div>
    </div>
  );
}

export default Question;
