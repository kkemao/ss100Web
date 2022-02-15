import { Moment } from "moment";
export enum ELabelType {
  ALL = -1, // 全部
  SITE = 0, //场所
  LABEL = 1, //地点
  INDUSTRY = 2, //行业
  SCENE = 3, //场景
}

// 指定路由显示模块
export enum ShowRouteType {
  ALL = "all", // 全部路由
  Video = "point-manage", // 视频资源
  Task = "task", // 任务模块
  Intelligent = "intelligent",
}
export interface IFLabel {
  cameraIds?: string;
  created: string;
  id: number;
  labelName: string;
  updated: string;
  labelType: ELabelType;
  labelDescribe?: string;
  algManagerInfos?: { id: number }[];
  parentId?: number;
}
export enum ETypeKey {
  IMAGE = 0,
  VIDEO = 1,
  TEXT,
}

export enum OnlineStatus {
  Offline = 0,
  Online = 1,
}

export enum GovernStatus {
  ORIGINAL = 0, // 原始数据
  CHECK = 1, // 已修正后的数据
  ORGANIZAT = 2, // 组织目录
  ONLINE = 3, // 在线状态
  CHOREOGRAPHY = 4, // 编排位置
}

export enum PushType {
  AutoPushAll = 1, //自动推送全量
  AutoPushRight = 2, //自动推送正确
  HandPush = 3, //手动推送
}

export interface IFCamera {
  id: number;
  ip: string;
  name: string;
  port: number;
  loginUser: string;
  password: string;
  updated: string;
  created: string;
  rtsp?: string;
  liveStreaming?: string;
  lng: number;
  lat: number;
}

export interface IFCameraType {
  cameraTypeName: string;
  cameraType: number;
}

export interface LabelDTOList {
  labelIds: string[];
  deviceIds: number[]; // 设备id
  labelType: ELabelType;
}

export interface IFCameraWithLabelList extends IFCamera {
  list: IFLabel[];
  geoString: string;
  installationSite: string; // 安装地点
  policeCode: string; // 派出所代码
  policeSite: string; // 派出所
  internationalCode: string; // 国际编码
  channoid: string;
  cameraType: number;
  cameraCode: string;
  proTypeName: string;
  onlineStatus: OnlineStatus;
  governStatus: number;
  pointName: null; // 点位名称
  district: string;
  street: string;
  community: string;
  errorData: string; // 存放有问题数据的字段名称，可多个  逗号隔开
  checkedData: any; // 是否已操作过数据
  labelDTOList: LabelDTOList[];
}
export interface IFCameraDetail extends IFCamera {
  internationalCode: string;
}
export interface IFAlgorithm {
  algVendor: string;
  body: string;
  created: string;
  id: number;
  name: string;
  stopUrl: string;
  typeId: number;
  typeName: string;
  updated: string;
  url: string;
  version: string;
  algDescribe: string;
  status?: null; //暂时不知道干啥
  eventList?: any[]; //暂时不知道干啥
  algType: ETypeKey;
  type: number;
}

export interface IFUserInfo {
  accountNonExpired?: boolean; //未知
  accountNonLocked?: boolean; //未知
  authorities?: any[]; //权限？
  created: string; //创建日期
  credentialsNonExpired?: boolean; //未知
  department?: number; //未知
  enabled?: boolean; //未知
  endtime?: string; //未知
  expired?: any; //未知
  ipLimit?: any; //未知
  ipv4?: string; //ipv4地址
  ipv6?: string; //ipv6地址
  isLogin?: boolean; //是否在线
  lastLoginTime?: string; //上次登录时间
  loginCount: number; //登录次数
  loginLimit?: any; //未知
  name?: string; //未知
  phone?: string; //未知
  roleId: number; //用户类型
  roles?: any[]; //未知
  starttime?: string; //未知
  uid: number; //用户id
  updated: string; //更新时间
  username: string; //用户名
  authority: any[]; //权限信息
}

export interface IFLoginUserInfo extends IFUserInfo {
  password: string;
  isSuperuser: boolean; // 是否是超级管理员权限
}
export enum EOnineStatus {
  OFFLINE = 0,
  ONLINE = 1,
}
export interface IFCameraBrief {
  count?: number;
  name: string;
  id: number;
  lng: number;
  lat: number;
  wgsLng?: number;
  wgsLat?: number;
  liveStreaming?: string;
  internationalCode?: string;
  onlineStatus: EOnineStatus;
  cameraStatus?: WorkerCameraStatus;
  cameraType?: CameraType.SITE;
  cameraTypeName?: string;
  ip?: string;
}

export interface IFCameraTreeNode {
  id?: string;
  uuid: string;
  areaName: string;
  cameraList: IFCameraBrief[];
  areaList: IFCameraTreeNode[];
  count?: number;
  level?: number;
}

export interface IFAlarmInfoList {
  created: string;
  updated: string;
  id: number;
  taskId: string;
  scheduleId: number;
  cameraId: number;
  apiType: number;
  type: number;
  time: string;
  date: string;
  hour: string;
  imageUrl: string;
  targetType: string;
  rect: null;
  rectFloat: null;
  count: null;
  typeName: string;
  algName: string;
  confidence: number;
  judgment: null;
  cameraName?: string;
  lat?: string;
  lng?: string;
  installSite?: string;
}

export interface IAppLabel {
  algManagerInfos: null;
  cameraIds: null;
  count: number;
  created: null;
  id: number;
  labelDescribe: string;
  labelName: string;
  labelType: number;
  level: number;
  parentId: null;
  subLabels: IAppLabel[];
  updated: null;
}

export interface ILabelMap extends Omit<IAppLabel, "subLabels"> {
  pId: number;
}
interface IEntries extends Omit<IAppLabel, "subLabels"> {
  subLabelIds: number[];
}

export interface ILabelsMap {
  [key: number]: ILabelMap;
}

export interface ILabelData {
  entries: IEntries[];
  childrenIdsMap: {
    [key: number]: number[];
  };
  labelsMap: ILabelsMap;
}

export interface IMarkerItem {
  id: number | string;
  name: string;
  lat: number;
  lng: number;
  wgsLng?: number;
  wgsLat?: number;
}
export interface IFPermission {
  id: number;
  name: string;
  children: IFPermission[];
}
export interface IFRole {
  rid?: number;
  name?: string;
  descprtion: string;
  moduleIds: number[];
}
export interface IFAccount {
  uid?: number;
  username: string;
  accountname: string;
  departmentName?: string;
  departmentId: number;
  roles?: IFRole[]; //角色列表
  rolename?: string; //角色列表转换的名称
  roleId?: number; //角色id
  password?: string;
  algAuthorizeCount?: number; // 算法授权个数
}
export interface IFDepartment {
  id: number;
  departmentName: string;
  departments: IFDepartment[] | null;
}
export interface IRoleItem {
  created: string;
  updated: string;
  rid: number;
  name: string | null;
  descprtion: string;
  permissionModules: [];
  permissions: null;
  permissionList: null;
  permissionNames: null;
  moduleIds: null;
  authority: string;
}
export interface IFAuthData {
  roles: IRoleItem[];
  authCollection: IFAuthCollection;
}
export interface IFAuthCollection {
  authMenuList: IFAuth[];
}
export interface IFAuth {
  name: string;
  id: number;
  resourceCode: string;
}
export interface IPagePayload {
  page: number;
  pageSize: number;
}
export enum WorkerTab {
  DataManage,
  Intelligent,
  DevOpt,
  AlgStore,
}
export enum GlobalTimeType {
  TODAY,
  SEVENDAY,
  HALFYEAR,
  YEAR,
}

export enum WorkerCameraStatus {
  Danger = 20,
  Nomarl = 50,
  Good,
}
export enum CameraType {
  CAMERA,
  SITE,
}
//数据治理的四种模式
export enum WorkerDataMode {
  INIT, //主界面状态
  ALL, //展示四种折叠菜单
  STREET, //展示街道菜单
  LABEL, //展示标签菜单
  STREET_CAMERA, // 街道菜单菜单选中top10摄像头
  LABEL_CAMERA, // 标签菜单选中top10摄像头
}
//智能调度的模式
export enum WorkerIntelligentMode {
  INIT, //主界面状态
  MAIN,
  TASK,
  EVENT,
}
//智能运维模式
export enum WorkerDevOptMode {
  INIT, //主界面状态
  MAIN,
  MACHINE,
  RESOURSE,
}
export interface IBkey {
  image: string;
  duration: number; //过期时间s
  key: string; //每次调用唯一key
  secretKey: string; //秘钥
}

export enum EQuestionType {
  SINGLESELECT = 1, // 单选题
  MULTISELECT = 2, // 多选题
  TF = 3, //判断题
}
export enum EQStatus {
  ONLINE = 1, // 在线
  OFFLINE = 2, // 离线
}
export const roleConstans = {
  SUPER_ADMIN: 0, // 超级管理员
  ADMIN: 1, // 管理员
  DEVELOPER: 2, // 开发者（测试、运营具有同一权限，若提升为 RBAC 1 以上，则可酌情分开）
  HUMAN: 3, // 普通用户
};
