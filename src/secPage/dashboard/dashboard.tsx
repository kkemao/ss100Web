import React, { useEffect, useState } from "react";
import * as H from "history";
import { Layout, Menu, Dropdown, message, Table, Tag, Space } from "antd";
import { BaseApi } from "../../requests/base-api";
import {
  ProfileOutlined,
  TeamOutlined,
  TagsOutlined,
  ReadOutlined,
} from "@ant-design/icons";

interface Props {
  history: H.History;
}
function Dashboard(props: Props) {
  const { history } = props;
  const [article, setArticle] = useState(0);
  const [label, setLabel] = useState(0);
  const [question, setQuestion] = useState(0);
  const [user, setUser] = useState(0);

  useEffect(() => {
    getAllCount();
  }, []);
  const getAllCount = async () => {
    const res = await BaseApi.getAllCount();
    console.log("zkf", res);
    if (res?.data) {
      setUser(res.data.user);
      setArticle(res.data.article);
      setQuestion(res.data.question);
      setLabel(res.data.label);
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
            <span>系统用户数</span>
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
        <div className="section" style={{ background: "#648cff" }}>
          <div>
            <ReadOutlined style={{ fontSize: 36 }} />
          </div>
          <div className="box">
            <span className="title">{article}</span>
            <span>总文章数</span>
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
