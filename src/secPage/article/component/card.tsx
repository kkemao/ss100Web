import React, { useEffect, useState } from "react";
import * as H from "history";
import "./card.scss";

interface Props {
  info: any;
  onClick: () => void;
}
function Card(props: Props) {
  const { info, onClick } = props;

  return (
    <div className="article-card" onClick={() => onClick()}>
      <div className="card-left">
        <img alt="" src={info.cover || ""} />
      </div>
      <div className="card-right">
        <h5 className="cart-title">{info.title}</h5>
        <h5 className="cart-sketch">{info.sketch}</h5>
      </div>
    </div>
  );
}

export default Card;
