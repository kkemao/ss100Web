import React, { useEffect, useState } from "react";
import * as H from "history";
import { Button, Select, message, Input, Spin, Upload, Pagination } from "antd";
import { BaseApi } from "../../requests/base-api";
import { showArticleModal, ModeType } from "./add";
import { SearchOutlined } from "@ant-design/icons";
import Card from "./component/card";
const { Option } = Select;

interface Props {
  history: H.History;
}
function Article(props: Props) {
  const { history } = props;
  const [loading, setLoading] = useState(false);
  const [labelList, setLabelList] = useState<any>([]);
  const [labelObject, setLabelObject] = useState<any>({});
  const [articleList, setArticleList] = useState<any>([]);
  const [label_id, setLabel_id] = useState<number | null>(null);
  const [label_children_id, setLabel_children_id] = useState<number | null>(
    null
  );
  const [total, setTotal] = useState<number | null>(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [currentId, setCurrentId] = useState(0);
  const [currentInfo, setCurrentInfo] = useState<any>({});

  useEffect(() => {
    getallLabel();
  }, []);

  useEffect(() => {
    getallArticle();
  }, [page, pageSize, label_id, label_children_id, searchText]);
  const getallArticle = async () => {
    try {
      const res = await BaseApi.queryArticleList({
        page,
        pageSize,
        searchText,
        label_id,
        label_children_id,
      });
      let { data, total } = res;
      data = data.map((item, index) => ({ ...item, index: index + 1 }));
      if (page === 1 && data.length) {
        setCurrentId(data[0]?.id);
        setCurrentInfo(data[0]);
      }
      setArticleList(data);
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

  const deleteArticle = async (id: number) => {
    try {
      const res = await BaseApi.deleteArticle(id);
      if (res.statusCode === 200) {
        getallArticle();
      }
      message.info(res.msg);
    } catch (error) {
      message.error(error.message);
    }
  };

  const callback = (key: any) => {
    console.log(key);
  };

  const addOrEditArticleFun = (param: {
    mode: ModeType;
    articleInfo?: any;
    labelList: any;
  }) => {
    const instance = showArticleModal({
      mode: param.mode,
      articleInfo: param.articleInfo,
      labelList: param.labelList,
      onClose: () => {
        instance.destory();
      },
      refresh: () => getallArticle(),
    });
  };

  const uploadFile = async (file: any) => {
    setLoading(true);
    try {
      let formdata = new FormData();
      formdata.append("file", file);
      const res = await BaseApi.articleImport(formdata);
      if (res && res.msg) {
        message.info(res.msg);
        getallArticle();
      } else {
        message.error("导入失败");
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
  };

  return (
    <div className="article-secpage-wrap">
      <div className="sec-header">
        <span className="sec-header-title">文章管理</span>
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
          <Input
            placeholder="输入关键词进行搜索"
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
            重置
          </Button>
          <Button
            icon={<SearchOutlined />}
            size="small"
            style={{ marginRight: 5 }}
            onClick={() => getallArticle()}
          >
            筛选
          </Button>
          <Button
            type="primary"
            size="small"
            onClick={() =>
              addOrEditArticleFun({
                mode: ModeType.CREATE,
                labelList: Object.values(labelObject),
              })
            }
          >
            添加文章
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
        <div className="content-list">
          <h5 className="title">列表</h5>
          <div className="list-wrap">
            {articleList.map((item: any) => (
              <Card
                info={item}
                onClick={() => {
                  console.log("zkf-console");
                  setCurrentId(item.id);
                  setCurrentInfo(item);
                }}
              />
            ))}
          </div>
          <div className="pagination-div">
            <span style={{ fontSize: 12, marginRight: 5 }}>共{total}条</span>
            <span style={{ fontSize: 12, marginRight: 5 }}>
              每页{pageSize}条
            </span>
            <Pagination
              simple
              current={page}
              pageSize={10}
              total={total || 0}
              onChange={(page) => setPage(page)}
            />
          </div>
        </div>
        <div className="content-info">
          <h5 className="title">详情</h5>
          <div className="info-wrap">{JSON.stringify(currentInfo)}</div>
        </div>
      </div>
      <div
        className="article-loading"
        style={{ display: loading ? "" : "none" }}
      >
        <Spin spinning={loading} tip="正在处理..."></Spin>
      </div>
    </div>
  );
}

export default Article;
