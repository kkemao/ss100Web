import React, { ReactPropTypes } from "react";
import Login from "./banner";
import * as H from "history";

interface Props extends ReactPropTypes {
  history: H.History;
}
function Home(props: Props) {
  const { history } = props;
  return (
    <div className="login-wrap">
      <Login
        title={window.systemConfig.systemName || "数商100 - 后台管理系统"}
        content=""
        bannerImg="homebanner.png"
      />
    </div>
  );
}

export default Home;
