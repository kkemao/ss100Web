import { useEffect } from "react";
import { withRouter, useLocation } from "react-router-dom";
import { message } from 'antd';

function ScrollToTop(props) {
  const { pathname } = useLocation();
  useEffect(() => {
    const token = window.localStorage.getItem("ss100_token");
    if(!token){
      message.info('您还未登录，请先登录。');
      props.history.push("/login");
    }
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return props.children;
}

export default withRouter(ScrollToTop);
