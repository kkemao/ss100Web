import React, { ReactPropTypes, useContext } from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { UserContext } from "../../UserContext";
import { BaseApi } from "../../../src/requests";
import { withRouter } from "react-router-dom";

function Banner(props: any) {
  const { title, content, bannerImg, imgMode } = props;
  const { handleChangeIsShowEmailBox } = useContext(UserContext);

  const onFinish = async (values: any) => {
    console.log("Success:", values);
    try {
      const res = await BaseApi.loginFun({
        accountName: values.username,
        password: values.password,
      });
      if (res && res.statusCode === 200) {
        message.success(res.msg);
        window.localStorage.setItem("ss100_token", res.data.token);
        window.localStorage.setItem(
          "ss100_userInfo",
          JSON.stringify(res.data.userInfo)
        );
        props.history.push("/home/dashboard");
      } else {
        message.error(res.msg);
      }
    } catch (error) {
      console.log(error);
      message.error(error.message);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="Main-container">
      <div
        className={`${
          imgMode && imgMode === "centerright" ? "center-right" : ""
        } Banner-container`}
        style={{
          color: "#333",
          backgroundImage: `url(${process.env.PUBLIC_URL}/${bannerImg})`,
        }}
      >
        <h5 className="banner-title">{title}</h5>
        <div className="banner-box">
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 32 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label={<span style={{ color: "white" }}>用户名</span>}
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
              style={{ padding: "10px 0" }}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>

            <Form.Item
              label={<span style={{ color: "white" }}>密码</span>}
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
              style={{ padding: "10px 0" }}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>

            <Form.Item
              name="remember"
              valuePropName="checked"
              wrapperCol={{ offset: 8, span: 16 }}
            >
              <Checkbox style={{ color: "white" }}>记住密码</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 2, span: 32 }}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Banner);
