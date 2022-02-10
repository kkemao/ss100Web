import React, { createContext, useState } from "react";
// 1. 使用 createContext 创建上下文
export const UserContext = new createContext();

// 2. 创建 Provider
export const UserProvider = props => {
  let [isShowEmailBox, handleChangeIsShowEmailBox] = useState(false);
  return (
    <UserContext.Provider
      value={{ isShowEmailBox, handleChangeIsShowEmailBox }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

// 3. 创建 Consumer
// export const UserConsumer = UserContext.Consumer;
