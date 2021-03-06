import React, { useEffect, useState } from "react";
import * as H from "history";
import { Layout, Menu, Dropdown, message, Table, Tag, Space } from "antd";
import { BaseApi } from "../../requests/base-api";
import {
  ProfileOutlined,
  TeamOutlined,
  TagsOutlined,
  ReadOutlined,
  LikeOutlined,
} from "@ant-design/icons";

interface Props {
  history: H.History;
}
function Dashboard(props: Props) {
  const { history } = props;
  const [article, setArticle] = useState(0);
  const [articleCount, setArticleCount] = useState(0);
  const [label, setLabel] = useState(0);
  const [question, setQuestion] = useState(0);
  const [user, setUser] = useState(0);

  useEffect(() => {
    getAllCount();
  }, []);
  const getAllCount = async () => {
    try {
      const res = await BaseApi.getAllCount();
      if (res?.data) {
        setUser(res.data.user);
        setArticle(res.data.article);
        setArticleCount(res.data.articleCount);
        setQuestion(res.data.question);
        setLabel(res.data.label);
      }
    } catch (error) {
      message.error(error.message);
    }
  };
  return (
    <div className="dashboard">
      <h5 className="header-title">系统概况</h5>
      <div className="content-box">
        <div className="section" style={{ background: "#fe7970" }}>
          <div>
            <TeamOutlined style={{ fontSize: 36 }} />
          </div>
          <div className="box">
            <span className="title">{user}</span>
            <span>微信用户数</span>
          </div>
        </div>
        <div className="section" style={{ background: "#ffd344" }}>
          <div>
            <ProfileOutlined style={{ fontSize: 36 }} />
          </div>
          <div className="box">
            <span className="title">{question}</span>
            <span>总试题数</span>
          </div>
        </div>
        <div className="section" style={{ background: "#e77ab6" }}>
          <div>
            <ReadOutlined style={{ fontSize: 36 }} />
          </div>
          <div className="box">
            <span className="title">{article}</span>
            <span>总文章数</span>
          </div>
        </div>
        <div className="section" style={{ background: "#648cff" }}>
          <div>
            <LikeOutlined style={{ fontSize: 36 }} />
          </div>
          <div className="box">
            <span className="title">{articleCount}</span>
            <span>文章点击数</span>
          </div>
        </div>
        <div className="section" style={{ background: "#4fcbb0" }}>
          <div>
            <TagsOutlined style={{ fontSize: 36 }} />
          </div>
          <div className="box">
            <span className="title">{label}</span>
            <span>总标签数</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
