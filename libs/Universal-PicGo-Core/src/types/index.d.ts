/*
 *            GNU GENERAL PUBLIC LICENSE
 *               Version 3, 29 June 2007
 *
 *  Copyright (C) 2024 Terwer, Inc. <https://terwer.space/>
 *  Everyone is permitted to copy and distribute verbatim copies
 *  of this license document, but changing it is not allowed.
 */


import { Buffer, EventEmitter } from "../utils/nodePolyfill"
import { ILogger } from "zhi-lib-base"
import { AxiosRequestConfig } from "axios"
import { IJSON } from "universal-picgo-store"
import { PicgoTypeEnum } from "../utils/enums"
import { ObjectCannedACL } from "@aws-sdk/client-s3/dist-types/models/models_0"

export interface IPicGo extends EventEmitter {
  /**
   * picgo configPath
   *
   * if do not provide, then it will use default configPath
   */
  configPath: string
  /**
   * the picgo configPath's baseDir
   */
  baseDir: string
  /**
   * default is baseDir, when set, using this value
   *
   * the picgo plugins baseDir, not to be confused with configPath's baseDir
   */
  pluginBaseDir: string
  /**
   * picgo logger factory
   */
  log: ILogger
  /**
   * picgo commander, for cli
   */
  // cmd: ICommander
  /**
   * after transformer, the input will be output
   */
  output: IImgInfo[]
  /**
   * the origin input
   */
  input: any[]
  /**
   * register\unregister\get picgo's plugin
   */
  pluginLoader: IPluginLoader
  /**
   * install\uninstall\update picgo's plugin via npm
   */
  pluginHandler: IPluginHandler
  /**
   * request based on axios
   */
  request: IPicGoRequest
  /**
   * plugin system core part transformer\uploader\beforeTransformPlugins...
   */
  helper: IHelper
  /**
   * picgo-core version
   */
  VERSION: string
  /**
   * electron picgo's version
   */
  // GUI_VERSION?: string
  i18n: II18nManager

  /**
   * get logger for debug
   *
   * @param name - logger bame
   */
  getLogger: (name?: string) => ILogger
  /**
   * get picgo config
   */
  getConfig: <T>(name?: string) => T
  /**
   * save picgo config to configPath
   */
  saveConfig: (config: IStringKeyMap<any>) => void
  /**
   * remove some [propName] in config[key] && save config to configPath
   */
  removeConfig: (key: string, propName: string) => void
  /**
   * set picgo config to ctx && will not save to configPath
   */
  setConfig: (config: IStringKeyMap<any>) => void
  /**
   * unset picgo config to ctx && will not save to configPath
   */
  unsetConfig: (key: string, propName: string) => void
  /**
   * upload gogogo
   */
  upload: (input?: any[]) => Promise<IImgInfo[] | Error>
}

export type Nullable<T> = T | null
export type Undefinable<T> = T | undefined

export interface IStringKeyMap<T> {
  [key: string]: T extends T ? T : any
}

/** SM.MS 图床配置项 */
export interface ISmmsConfig {
  token: string
  backupDomain?: string
}

/** 七牛云图床配置项 */
export interface IQiniuConfig {
  accessKey: string
  secretKey: string
  /** 存储空间名 */
  bucket: string
  /** 自定义域名 */
  url: string
  /** 存储区域编号 */
  area: "z0" | "z1" | "z2" | "na0" | "as0" | string
  /** 网址后缀，比如使用 `?imageslim` 可进行[图片瘦身](https://developer.qiniu.com/dora/api/1271/image-thin-body-imageslim) */
  options: string
  /** 自定义存储路径，比如 `img/` */
  path: string
}

/** 又拍云图床配置项 */
export interface IUpyunConfig {
  /** 存储空间名，及你的服务名 */
  bucket: string
  /** 操作员 */
  operator: string
  /** 密码 */
  password: string
  /** 针对图片的一些后缀处理参数 */
  options: string
  /** 自定义存储路径，比如 `img/` */
  path: string
  /** 加速域名，注意要加 `http://` 或者 `https://` */
  url: string
}

/** 腾讯云图床配置项 */
export interface ITcyunConfig {
  secretId: string
  secretKey: string
  /** 存储桶名，v4 和 v5 版本不一样 */
  bucket: string
  appId: string
  /** 存储区域，例如 ap-beijing-1 */
  area: string
  /** 请求的 ENDPOINT，设置后 `area` 字段会失效 */
  endpoint: string
  /** 自定义存储路径，比如 img/ */
  path: string
  /** 自定义域名，注意要加 `http://` 或者 `https://` */
  customUrl: string
  /** COS 版本，v4 或者 v5 */
  version: "v5" | "v4"
  /** 针对图片的一些后缀处理参数 PicGo 2.4.0+ PicGo-Core 1.5.0+ */
  options: string
  /** 是否支持极智压缩 */
  slim: boolean
}

/** GitHub 图床配置项 */
export interface IGithubConfig {
  /** 仓库名，格式是 `username/reponame` */
  repo: string
  /** github token */
  token: string
  /** 自定义存储路径，比如 `img/` */
  path: string
  /** 自定义域名，注意要加 `http://` 或者 `https://` */
  customUrl: string
  /** 分支名，默认是 `main` */
  branch: string
}

/** Gitlab 图床配置项 */
export interface IGitlabConfig {
  /** gitlab 地址，例如：http://localhost:8002 */
  url: string
  /** 仓库名，格式是 `username/reponame` */
  repo: string
  /** 分支名，默认是 `main` */
  branch: string
  /** gitlab token */
  token: string
  /** 自定义存储路径，比如 `img/` */
  path: string
  /** 作者邮箱  */
  authorMail: string
  /** 作者姓名 */
  authorName: string
  /** 提交信息 */
  commitMessage: string
}

/** 阿里云图床配置项 */
export interface IAliyunConfig {
  accessKeyId: string
  accessKeySecret: string
  /** 存储空间名 */
  bucket: string
  /** 存储区域代号 */
  area: string
  /** 自定义存储路径 */
  path: string
  /** 自定义域名，注意要加 `http://` 或者 `https://` */
  customUrl: string
  /** 针对图片的一些后缀处理参数 PicGo 2.2.0+ PicGo-Core 1.4.0+ */
  options: string
}

/** Imgur 图床配置项 */
export interface IImgurConfig {
  /** imgur 的 `clientId` */
  clientId: string
  /** 代理地址，仅支持 http 代理 */
  proxy: string
}

/** 内置 AWS S3 图床配置项 */
export interface IAwsS3Config {
  accessKeyID: string
  secretAccessKey: string
  bucketName: string
  uploadPath: string
  region?: string
  endpoint?: string
  customUrl?: string
  pathStyleAccess?: boolean
  rejectUnauthorized?: boolean
  acl?: ObjectCannedACL | undefined
  // S3或S3兼容服务一般支持对桶设置CORS策略，优先修改桶的CORS策略
  // SiYuan 桌面版没有CORS问题
  // SiYuan 内置的 CORS Proxy 在iOS版上没跑通
  // 桌面浏览器访问桌面版或iOS版是支持使用内置的 CORS Proxy 的
  corsProxy?: boolean
}

/** 兰空图床配置项 */
export interface ILskyConfig {
  server: string
  email: string
  password: string
  strategyId?: string
}

/** PicGo 配置文件类型定义 */
export interface IConfig {
  picBed: {
    uploader: string
    current?: string
    smms?: ISmmsConfig
    qiniu?: IQiniuConfig
    upyun?: IUpyunConfig
    tcyun?: ITcyunConfig
    github?: IGithubConfig
    aliyun?: IAliyunConfig
    imgur?: IImgurConfig
    awss3?: IAwsS3Config
    transformer?: string
    /** for uploader */
    proxy?: string
    [others: string]: any
  }
  picgoPlugins: {
    [pluginName: string]: boolean
  }
  debug?: boolean
  silent?: boolean
  settings?: {
    logLevel?: string[]
    logPath?: string
    /** for npm */
    npmRegistry?: string
    /** for npm */
    npmProxy?: string
    [others: string]: any
  }

  [configOptions: string]: any
}

/**
 * for an uploader/transformer/beforeTransformHandler/beforeUploadHandler/afterUploadHandler
 */
export interface IPlugin {
  handle: ((ctx: IPicGo) => Promise<any>) | ((ctx: IPicGo) => void)
  /** The name of this handler */
  name?: string
  /** The config of this handler */
  config?: (ctx: IPicGo) => IPluginConfig[]

  [propName: string]: any
}

export type IPluginNameType = "simple" | "scope" | "normal" | "unknown"

export interface ILocale {
  [key: string]: any
}

export interface IBrowserLocal {
  /**
   * local name
   */
  name: string;
  /**
   * local string in yaml format
   */
  yaml: string;
}

/**
 * for uploading image info
 */
export interface IImgInfo {
  buffer?: Buffer
  base64Image?: string
  fileName?: string
  width?: number
  height?: number
  extname?: string
  imgUrl?: string

  [propName: string]: any
}

export interface IPluginLoader {
  /**
   * register [local plugin] or [provided plugin]
   *
   * if the second param (plugin) is provided
   *
   * then picgo will register this plugin and enable it by default
   *
   * but picgo won't write any config to config file
   *
   * you should use ctx.setConfig to change the config context
   */
  registerPlugin: (name: string, plugin?: IPicGoPlugin) => void
  unregisterPlugin: (name: string) => void
  getPlugin: (name: string) => IPicGoPluginInterface | undefined
  /**
   * get enabled plugin list
   */
  getList: () => string[]
  /**
   * get all plugin list (enabled or not)
   */
  getFullList: () => string[]
  hasPlugin: (name: string) => boolean
}

/**
 * for picgo npm plugins
 */
export type IPicGoPlugin = (ctx: IPicGo) => IPicGoPluginInterface

/**
 * interfaces for PicGo plugin
 */
export interface IPicGoPluginInterface {
  /**
   * since PicGo-Core v1.5, register will inject ctx
   */
  register: (ctx: IPicGo) => void
  /**
   * this plugin's config
   */
  config?: (ctx: IPicGo) => IPluginConfig[]
  /**
   * register uploader name
   */
  uploader?: string
  /**
   * register transformer name
   */
  transformer?: string
  /**
   * for picgo gui plugins
   */

  // guiMenu?: (ctx: IPicGo) => IGuiMenuItem[]

  /**
   * for picgo gui plugins
   * short key -> command
   */
  // commands?: (ctx: IPicGo) => ICommandItem[]

  [propName: string]: any
}

/**
 * for plugin config
 */
export interface IPluginConfig {
  name: string
  type: string
  required: boolean
  default?: any
  alias?: string
  message?: string

  // prefix?: string // for cli options
  [propName: string]: any
}

export interface IPluginHandler {
  install: (plugins: string[], options: IPluginHandlerOptions, env?: IProcessEnv) => Promise<IPluginHandlerResult<boolean>>
  update: (plugins: string[], options: IPluginHandlerOptions, env?: IProcessEnv) => Promise<IPluginHandlerResult<boolean>>
  uninstall: (plugins: string[]) => Promise<IPluginHandlerResult<boolean>>
}

export interface IPluginHandlerResult<T> {
  success: T
  body: T extends true ? string[] : string
}

export interface IPluginHandlerOptions {
  npmProxy?: string
  npmRegistry?: string
}

/**
 * for clipboard image
 */
export interface IClipboardImage {
  imgPath: string
  /**
   * if the path is generate by picgo -> false
   * if the path is a real file path in system -> true
   */
  shouldKeepAfterUploading: boolean
}

/**
 * for install command environment variable
 */
export interface IProcessEnv {
  [propName: string]: Undefinable<string>
}

/**
 * for an uploader/transformer/beforeTransformHandler/beforeUploadHandler/afterUploadHandler
 */
export interface IPlugin {
  handle: ((ctx: IPicGo) => Promise<any>) | ((ctx: IPicGo) => void)
  /** The name of this handler */
  name?: string
  /** The config of this handler */
  config?: (ctx: IPicGo) => IPluginConfig[]

  [propName: string]: any
}

/**
 * for lifecycle plugins
 */
export interface ILifecyclePlugins {
  register: (id: string, plugin: IPlugin) => void
  unregister: (id: string) => void
  getName: () => string
  get: (id: string) => IPlugin | undefined
  getList: () => IPlugin[]
  getIdList: () => string[]
}

export interface IHelper {
  transformer: ILifecyclePlugins
  uploader: ILifecyclePlugins
  beforeTransformPlugins: ILifecyclePlugins
  beforeUploadPlugins: ILifecyclePlugins
  afterUploadPlugins: ILifecyclePlugins
}

export interface II18nManager {
  /**
   * translate text
   */
  translate: <T extends string>(key: T, args?: IStringKeyMap<string>) => string
  /**
   * add locale to current i18n language
   * default locale list
   * - zh-CN
   * - en
   */
  addLocale: (language: string, locales: ILocale) => boolean
  /**
   * set current language
   */
  setLanguage: (language: string) => void
  /**
   * dynamic add new language & locales
   */
  addLanguage: (language: string, locales: ILocale) => boolean
  /**
   * get language list
   */
  getLanguageList: () => string[]
}

/**
 * for transformer - path
 */
export interface IImgSize {
  width: number
  height: number
  real?: boolean
  extname?: string
}

export interface IPathTransformedImgInfo extends IImgInfo {
  success: boolean
}

export interface IConfigChangePayload<T> {
  configName: string
  value: T
}

// =====================================================================================================================
// request start

export type IPicGoRequest = <T, U extends AxiosRequestConfig>(config: U) => Promise<IResponse<T, U>>

/**
 * for PicGo new request api, the response will be json format
 */
export type IReqOptions<T = any> = AxiosRequestConfig<T> & {
  resolveWithFullResponse: true
}

/**
 * for PicGo new request api, the response will be Buffer
 */
export type IReqOptionsWithArrayBufferRes<T = any> = IReqOptions<T> & {
  responseType: "arraybuffer"
}

/**
 * for PicGo new request api, the response will be just response data. (not statusCode, headers, etc.)
 */
export type IReqOptionsWithBodyResOnly<T = any> = AxiosRequestConfig<T>

export type IFullResponse<T = any, U = any> = AxiosResponse<T, U> & {
  statusCode: number
  body: T
}

type AxiosResponse<T = any, U = any> = import("axios").AxiosResponse<T, U>

type AxiosRequestConfig<T = any> = import("axios").AxiosRequestConfig<T>

interface IRequestOptionsWithFullResponse {
  resolveWithFullResponse: true
}

interface IRequestOptionsWithJSON {
  json: true
}

interface IRequestOptionsWithResponseTypeArrayBuffer {
  responseType: "arraybuffer"
}

/**
 * T is the response data type
 * U is the config type
 */
export type IResponse<T, U> = U extends IRequestOptionsWithFullResponse ? IFullResponse<T, U>
  : U extends IRequestOptionsWithJSON ? T
    : U extends IRequestOptionsWithResponseTypeArrayBuffer ? Buffer
      : U extends IReqOptionsWithBodyResOnly ? T
        : string

// request end

/**
 * 外部 Picgo 配置接口
 */
interface IExternalPicgoConfig {
  useBundledPicgo?: boolean

  picgoType?: PicgoTypeEnum

  /**
   * extPicgoApiUrl 是一个字符串，表示外部 Picgo API 的 URL
   */
  extPicgoApiUrl?: string


  /**
   * 其他配置项，可以是任意类型
   */
  [key: string]: any
}

/**
 * PicGo 统一存储接口
 */
interface IPicgoDb<T> {
  key: string

  initialValue: any

  read(flush?: boolean): IJSON

  get(key: string): any

  set(key: string, value: any): void

  has(key: string): boolean

  unset(key: string, value: any): boolean

  saveConfig(config: Partial<T>): void

  removeConfig(config: T): void
}

/**
 * 图床类型定义
 */
interface IPicBedType {
  type: string
  name: string
  visible: boolean
}

/**
 * 某个PicGO平台配置列表
 */
interface IUploaderConfigItem {
  configList: IUploaderConfigListItem[]
  defaultId: string
}

type IUploaderConfigListItem = IStringKeyMap & IUploaderListItemMetaInfo

interface IUploaderListItemMetaInfo {
  _id: string
  _configName: string
  _updatedAt: number
  _createdAt: number
}

export interface IPluginProcessResult {
  success: boolean
  /**
   * the package.json's name filed
   */
  pkgName: string
  /**
   * the plugin name or the fs absolute path
   */
  fullName: string
}
