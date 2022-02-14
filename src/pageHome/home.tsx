import React, { useEffect, useRef, useState } from "react";
import * as H from "history";
import { Layout, Menu, Dropdown, message } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  CopyOutlined,
  BankOutlined,
  TagsOutlined,
  FileWordOutlined,
  PayCircleOutlined,
  CalculatorOutlined,
  DownOutlined,
} from "@ant-design/icons";
import { Route } from "react-router-dom";
import Dashboard from "../../src/secPage/dashboard";
import User from "../../src/secPage/user";
import Label from "../../src/secPage/label";
import Question from "../../src/secPage/question";
import Article from "../../src/secPage/article";
import moment from "moment";
import { imageAddPrefix } from "../utils";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

interface Props {
  history: H.History;
}
function Home(props: Props) {
  const { history } = props;
  const [date, setDate] = useState("");
  const [userInfo, setUserInfo] = useState<any>({});
  const timeRef = useRef<any>(null);
  useEffect(() => {
    const info = window.localStorage.getItem("ss100_userInfo");
    if (info) {
      try {
        setUserInfo(JSON.parse(info));
      } catch (error) {
        message.info(error);
      }
    }

    timeRef.current = setInterval(() => {
      setDate(moment().format("YYYY-MM-DD HH:mm:ss"));
    }, 1000);
    return () => {
      clearInterval(timeRef.current);
    };
  }, []);

  const gotoPage = (url: string) => {
    history.push(url);
  };

  const menuList = [
    {
      key: "dashboard",
      icon: <BankOutlined />,
      text: "首页",
      url: "/home/dashboard",
    },
    {
      key: "user",
      icon: <UserOutlined />,
      text: "用户管理",
      url: "/home/user",
    },
    {
      key: "label",
      icon: <TagsOutlined />,
      text: "标签管理",
      url: "/home/label",
    },
    {
      key: "question",
      icon: <CopyOutlined />,
      text: "试题管理",
      url: "/home/question",
    },
    {
      key: "article",
      icon: <FileWordOutlined />,
      text: "文章管理",
      url: "/home/article",
    },
    {
      key: "order",
      icon: <PayCircleOutlined />,
      text: "订单管理",
      url: "/home/order",
    },
    {
      key: "test",
      icon: <CalculatorOutlined />,
      text: "测评管理",
      url: "/home/test",
    },
    {
      key: "setting",
      icon: <SettingOutlined />,
      text: "系统设置",
      url: "/home/setting",
    },
  ];
  return (
    <Layout style={{ height: "100%" }}>
      <Header className="header custom-style">
        <div className="logo">数商100 - 后台管理系统</div>
        <div className="user-box">
          <span style={{ fontSize: 14, marginRight: 15 }}>{date}</span>
          <img
            className="user-avatar"
            alt=""
            src={
              userInfo.image
                ? imageAddPrefix(userInfo.image || "")
                : `${process.env.PUBLIC_URL}/user.png`
            }
          />
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item>
                  <a
                    href="#"
                    onClick={() => {
                      window.localStorage.setItem("ss100_token", "");
                      window.localStorage.setItem("ss100_userInfo", "");
                      history.push("/");
                    }}
                  >
                    退出
                  </a>
                </Menu.Item>
              </Menu>
            }
          >
            <a
              className="ant-dropdown-link account-text"
              onClick={(e) => e.preventDefault()}
            >
              {userInfo.username || "--"} <DownOutlined />
            </a>
          </Dropdown>
        </div>
      </Header>
      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
            defaultSelectedKeys={menuList
              .filter((menu) => menu.url === history.location.pathname)
              .map((menu) => menu.key)}
            // defaultOpenKeys={["sub1"]}
            style={{ height: "100%", borderRight: 0 }}
          >
            {menuList.map((menu) => {
              return (
                <Menu.Item
                  key={menu.key}
                  icon={menu.icon}
                  onClick={() => gotoPage(menu.url)}
                >
                  {menu.text}
                </Menu.Item>
              );
            })}
          </Menu>
        </Sider>
        <Layout style={{ padding: "0 12px 12px" }}>
          <Content
            className="site-layout-background"
            style={{
              padding: 12,
              margin: "16px 0 0 0",
              minHeight: 280,
              borderRadius: 15,
            }}
          >
            <Route path={"/home/dashboard"} component={Dashboard}></Route>
            <Route path={"/home/user"} component={User}></Route>
            <Route path={"/home/label"} component={Label}></Route>
            <Route path={"/home/question"} component={Question}></Route>
            <Route path={"/home/article"} component={Article}></Route>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default Home;
