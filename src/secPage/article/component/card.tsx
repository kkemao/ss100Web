import React, { useEffect, useState } from "react";
import * as H from "history";
import "./card.scss";
import { imageAddPrefix } from "../../../utils";

interface Props {
  info: any;
  active: boolean;
  onClick: () => void;
}
function Card(props: Props) {
  const { info, active = false, onClick } = props;

  return (
    <div
      className="article-card"
      style={{ background: active ? "rgba(0,0,255,0.05)" : "" }}
      onClick={() => onClick()}
    >
      <div className="card-left">
        <img alt="" src={imageAddPrefix(info.cover || "")} />
      </div>
      <div className="card-right">
        <h5 className="cart-title">{info.title}</h5>
        <h5 className="cart-sketch">{info.sketch}</h5>
      </div>
    </div>
  );
}

export default Card;
