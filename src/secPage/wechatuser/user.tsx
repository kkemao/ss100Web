import React, { useEffect, useState } from "react";
import * as H from "history";
import {
  Layout,
  Menu,
  Dropdown,
  message,
  Table,
  Tag,
  Space,
  Popconfirm,
  Button,
} from "antd";
import { BaseApi } from "../../requests/base-api";
import { showWechatUserModal, ModeType } from "./addWechatUser";
import { imageAddPrefix } from "../../utils";

interface Props {
  history: H.History;
}
function User(props: Props) {
  const { history } = props;
  const [userList, setUserList] = useState<any>([]);

  useEffect(() => {
    getallWechatUser();
  }, []);
  const getallWechatUser = async () => {
    try {
      const res = await BaseApi.getWechatUserList();
      setUserList(res.data);
    } catch (error) {
      message.error(error.message);
    }
  };

  const deleteWechatUser = async (id: number) => {
    try {
      await BaseApi.deleteWechatUser(id);
      getallWechatUser();
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
      title: "头像",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar: string) => (
        <img
          src={imageAddPrefix(avatar)}
          style={{ width: 40, height: 40, borderRadius: "50%" }}
        />
      ),
    },
    {
      title: "用户名",
      dataIndex: "accountName",
      key: "accountName",
    },
    {
      title: "姓名",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "性别",
      dataIndex: "gender",
      key: "gender",
      render: (gender: any) => ["男", "女"][gender || 0],
    },
    {
      title: "角色",
      key: "role",
      dataIndex: "role",
      render: (role: any) => (
        <Tag color={["#a8ff35", "#a8ff35", "", ""][role]}>
          {["超级会员", "会员", "普通用户", "普通用户"][role]}
        </Tag>
      ),
    },
    {
      title: "手机",
      key: "phone",
      dataIndex: "phone",
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
          <Button
            type="link"
            size="small"
            onClick={() =>
              addOrEditUserFun({
                mode: ModeType.MODIFY,
                userInfo: record,
              })
            }
          >
            编辑
          </Button>
          <Popconfirm
            title="是否删除?"
            onConfirm={() => deleteWechatUser(record.id)}
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
  const addOrEditUserFun = (param: { mode: ModeType; userInfo?: any }) => {
    const instance = showWechatUserModal({
      mode: param.mode,
      userInfo: param.userInfo,
      onClose: () => {
        instance.destory();
      },
      refresh: () => getallWechatUser(),
    });
  };
  return (
    <div className="user-secpage-wrap">
      <div className="sec-header">
        <span className="sec-header-title">用户管理</span>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            type="link"
            size="small"
            onClick={() => {
              addOrEditUserFun({
                mode: ModeType.CREATE,
              });
            }}
          >
            添加微信用户
          </Button>
        </div>
      </div>
      <div className="secpage-content">
        <Table columns={columns} dataSource={userList} />
      </div>
    </div>
  );
}

export default User;
