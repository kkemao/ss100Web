import React, { useEffect, useState } from "react";
import * as H from "history";
import {
  Button,
  Select,
  message,
  Input,
  Spin,
  Upload,
  Pagination,
  Popconfirm,
  Empty,
} from "antd";
import { BaseApi } from "../../requests/base-api";
import { showArticleModal, ModeType } from "./add";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import Card from "./component/card";
import { showBatchImport, ModeType as MT } from "../batchImport/import";
import { imageAddPrefix } from "../../utils";
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
  const [currentInfoContent, setCurrentInfoContent] = useState<any>([]);

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
      if (!data.length) {
        setCurrentFun();
      }
      if (page === 1 && data.length) {
        setCurrentFun(data[0]);
      }
      setArticleList(data);
      setTotal(total);
    } catch (error) {
      message.error(error.message);
    }
  };
  const setCurrentFun = (info?: any) => {
    if (!info) {
      setCurrentId(0);
      setCurrentInfo({});
      setCurrentInfoContent([]);
      return;
    }
    setCurrentId(info.id);
    setCurrentInfo(info);
    try {
      const arr = JSON.parse(
        info.content.replace(/\n/g, "\\n").replace(/\r/g, "\\r")
      );
      setCurrentInfoContent(arr);
    } catch (error) {
      setCurrentInfoContent([{ type: 2, content: error.message }]);
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
  };

  return (
    <div className="article-secpage-wrap">
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
            onClick={() => getallArticle()}
          >
            ??????
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={() =>
              addOrEditArticleFun({
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
              // showBatchImport({
              //   mode: MT.ARTICLE,

              // })
              const instance = showBatchImport({
                mode: MT.ARTICLE,
                onClose: () => {
                  instance.destory();
                },
                refresh: () => getallArticle(),
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
        <div className="content-list">
          <h5 className="title">??????</h5>
          <div className="list-wrap">
            {articleList.length ? (
              articleList.map((item: any) => (
                <Card
                  active={item.id === currentId}
                  info={item}
                  onClick={() => {
                    setCurrentFun(item);
                  }}
                />
              ))
            ) : (
              <Empty style={{ marginTop: "10vh" }} />
            )}
          </div>
          <div className="pagination-div">
            <span style={{ fontSize: 12, marginRight: 5 }}>???{total}???</span>
            <span style={{ fontSize: 12, marginRight: 5 }}>
              ??????{pageSize}???
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
        <div
          className="content-info"
          style={{ display: currentInfo.id ? "" : "none" }}
        >
          <div className="title">
            <div>
              <span style={{ fontSize: 16, marginRight: 10 }}>
                {currentInfo.title}
              </span>
            </div>
            <div className="edit-tool">
              <Button
                type="link"
                onClick={() => {
                  addOrEditArticleFun({
                    mode: ModeType.MODIFY,
                    labelList: Object.values(labelObject),
                    articleInfo: currentInfo,
                  });
                }}
              >
                ??????
              </Button>
              <Popconfirm
                title="?????????????"
                onConfirm={() => deleteArticle(currentInfo.id)}
                onCancel={() => {}}
                okText="??????"
                cancelText="??????"
              >
                <Button type="link" size="small" danger>
                  ??????
                </Button>
              </Popconfirm>
            </div>
          </div>
          <div className="label-box">
            <span className="label-tag">
              {currentInfo.auth ? currentInfo.auth : "??????"}
            </span>
            <span style={{ margin: "0 10px" }}>{currentInfo.create_time}</span>
            <span className="label-content">
              {labelObject[currentInfo.parent_id]?.name}
            </span>{" "}
            -
            <span className="label-content">
              {labelObject[currentInfo.label_id]?.name}
            </span>
            {/* <span style={{ marginLeft: 10, fontWeight: "bold", color: "#333" }}>
              ?????????{currentInfo.auth}
            </span> */}
            <span className="label-content" style={{ marginLeft: 15 }}>
              ????????????{currentInfo.count || 0}
            </span>
          </div>
          <div className="info-wrap">
            <p className="info-sketch">{currentInfo.sketch}</p>
            {currentInfo &&
              currentInfoContent.map((item: any) => {
                return (
                  <p className="info-section-text">
                    {item.type === 1 ? (
                      <img
                        alt="??????"
                        src={imageAddPrefix(item.content || "")}
                        className="info-section-img"
                      />
                    ) : (
                      item.content
                        .split("||||")
                        .map((item: any) => <p className="text-box">{item}</p>)
                    )}
                  </p>
                );
              })}
          </div>
        </div>
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

export default Article;
