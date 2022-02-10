import React from "react";
import * as H from "history";

/**
 * 技术/设计服务->
 * @params 无参
 */

interface Props extends React.Props<any> {
  title: string;
  content?: string;
  img: string;
  color?: string;
  history: H.History;
  url: string;
}

function TextArrow(props: Props) {
  const { title, img, color = "", history, url } = props;
  return (
    <div className="textarrow-box">
      <div
        className="textarrow-content"
        onClick={e => {
          history.push(url);
        }}
      >
        <span className={`${color}`}>{title}</span>
        <span
          style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/${img})`
          }}
          className="textarrow-content-icon"
        ></span>
      </div>
    </div>
  );
}

export default TextArrow;
