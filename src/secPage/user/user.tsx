import React, { useEffect, useState } from "react";
import * as H from "history";
import { Layout, Menu, Dropdown, message, Table, Tag, Space } from "antd";
import { BaseApi } from "../../requests/base-api";

interface Props {
  history: H.History;
}
function User(props: Props) {
  const { history } = props;
  const [userList, setUserList] = useState<any>([]);

  useEffect(() => {
    getallUser();
  }, []);
  const getallUser = async () => {
    try {
      const res = await BaseApi.getUserList();
      setUserList(res.data);
    } catch (error) {
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "用户名",
      dataIndex: "accountName",
      key: "accountName",
    },
    {
      title: "name",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "角色",
      key: "role",
      dataIndex: "role",
      render: (role: any) => (
        <Tag color={["#a8ff35", "#a8ff35", "", ""][role]}>
          {["超级管理员", "管理员", "开发者", "普通用户"][role]}
        </Tag>
      ),
    },
    {
      title: "注册时间",
      key: "register_time",
      dataIndex: "register_time",
    },
    {
      title: "上次登录",
      dataIndex: "last_login",
      key: "last_login",
    },
    {
      title: "操作",
      key: "action",
      render: (text: any, record: any) => (
        <Space size="middle">
          <a>删除</a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={userList} />
    </div>
  );
}

export default User;
