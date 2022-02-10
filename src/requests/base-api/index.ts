import {
  request,
  IListResType,
  IDataResType,
  IUploadType,
} from "../base-request";
import {
  IFLabel,
  IFAlgorithm,
  ELabelType,
  GovernStatus,
  EQuestionType,
} from "../../types";

export interface IGetCameraListPayload {
  cameraName?: string;
  selectValue?: string; // 摄像头名称或国标码
  page: number;
  pageSize: number;
  governStatus?: GovernStatus;
}
export interface IGetCameraListWithLabelPayload extends IGetCameraListPayload {
  labelIds?: number[];
}

export interface IGetLabelListPayload {
  labelTypes?: ELabelType[];
}

class BaseApiClass {
  loginFun = (payload: { accountName: string; password: string }) => {
    return request
      .post<IDataResType<any>>("/api/login", payload)
      .then((res) => res.data);
  };
  getUserList = () => {
    return request
      .get<IDataResType<any>>("/api/user/find-all")
      .then((res) => res.data);
  };
  getLabelList = () => {
    return request
      .get<IListResType<IFLabel>>("/api/label/all")
      .then((res) => res.data);
  };
  addLabel = (payload: {
    parent_id: number;
    name: string;
    description: string;
    level: number;
    remark?: string;
  }) => {
    return request
      .post<IDataResType<any>>("api/label/add", payload)
      .then((res) => res.data);
  };
  updateLabel = (payload: {
    id: number;
    parent_id: number;
    name: string;
    description: string;
    level: number;
    remark?: string;
  }) => {
    return request
      .post<IDataResType<any>>("api/label/update", payload)
      .then((res) => res.data);
  };
  deleteLabelList = (id: number) => {
    return request
      .get<IListResType<IFLabel>>(`/api/label/delete?id=${id}`)
      .then((res) => res.data);
  };
  getQuestionList = () => {
    return request
      .get<IListResType<any>>("/api/question/all")
      .then((res) => res.data);
  };
  queryQuestionList = (payload: {
    page: number;
    pageSize: number;
    searchText: string;
    label_id?: number | null;
    label_children_id?: number | null;
    type?: EQuestionType | null;
  }) => {
    return request
      .post<IListResType<any>>("/api/question/all", payload)
      .then((res) => res.data);
  };
  addQuestion = (payload: any) => {
    return request
      .post<IDataResType<any>>("api/question/add", payload)
      .then((res) => res.data);
  };
  updateQuestion = (payload: any) => {
    return request
      .post<IDataResType<any>>("api/question/update", payload)
      .then((res) => res.data);
  };
  deleteQuestion = (id: number) => {
    return request
      .get<IListResType<any>>(`/api/question/delete?id=${id}`)
      .then((res) => res.data);
  };
  uploadFile = (formdata: any) => {
    return request
      .post<IUploadType>(`/api/file/upload`, formdata, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  };
  questionImport = (formdata: any) => {
    return request
      .post<IUploadType>(`/api/file/import`, formdata, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data);
  };

  getAllCount = () => {
    return request
      .get<IDataResType<any>>(`/api/dashboard/count`)
      .then((res) => res.data);
  };

  // 获取算法详情
  getAlgorithmDetails = (id: number) => {
    return request
      .get<IListResType<IFAlgorithm>>(`/aios/alginfo/apiinfo/${id}`)
      .then((res) => res.data);
  };
}

export const BaseApi = new BaseApiClass();
