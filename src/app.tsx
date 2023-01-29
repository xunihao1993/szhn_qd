import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import { notification, message} from 'antd';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchUserInfo = async () => {
    try {
      console.log("调取获取用户接口")
      const msg = await queryCurrentUser();

      // return msg.data;
      return {...msg.data, name:msg.data?.short_name};
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };
  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }
  return {
    fetchUserInfo,
    settings: {},
  };
}



// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    // links:<Link to="" target="_blank">
    //  <LinkOutlined />
    // <span>OpenAPI 文档</span>
    // </Link>,
    links: [
      <div><LinkOutlined /><span onClick={() => {
        window.open('https://www.yuque.com/eggdan/kfm74n?# 《粮油市场网站操作指南》');
      }} >详细教程文档</span></div>,
          // <Link to="/~docs">
          //   <BookOutlined />
          //   <span>业务组件文档</span>
          // </Link>,
        ],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    // childrenRender: (children) => {
    //   if (initialState.loading) return <PageLoading />;
    //   return children;
    // },
    ...initialState?.settings,
  };
};

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: any) => {
  const { response, data} = error;

  console.log('统一异常处理',response);
  console.log('统一异常处理2',data)
  var request_id = data.requestId? data.requestId:''
  if (response && response.status !== 200 && response.status !== 422) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    if (response.status === 401 || response.status === 403) {
      notification.error({
        message: `认证超时或者禁示访问`,
        description: '认证超时或者禁示访问，请重新登录',
      });
      history.push('/user/login');
    } else {
      notification.error({
        message: `请求错误 ${status}: ${url}`,
        description: `${errorText}\n错误代码:${request_id}`,
      });
      if(data.ErrorInfo && data.ErrorInfo.errDec){
        message.error(data.ErrorInfo.errDec)
      }
    }
  }

  if (!response) {
    console.log('拉拉')
    console.log(response)
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  throw error;
};

// const DOMAIN =
//   process.env.NODE_ENV === 'production' ? `http://staging.qiuzhi99.com` : `http://localhost:6060`;
const DOMAIN = process.env.REQUST_BASE_URL;

export const request: RequestConfig = {
  errorHandler,
  prefix: `${DOMAIN}`,
  headers: {
    Authorization: `token ${localStorage.getItem('token')}`,
  },
};
