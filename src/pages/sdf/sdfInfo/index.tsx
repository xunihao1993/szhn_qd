import React, { useRef, useState, useEffect } from 'react';
import { PlusOutlined, EllipsisOutlined, DownloadOutlined, createFromIconfontCN, UploadOutlined } from '@ant-design/icons';
import {
  Button,
  Tag,
  Space,
  Menu,
  message,
  Modal,
  notification,
  InputNumber,
  Form,
  Drawer,
  Spin,
  Progress,
  Input,
  Radio,
  UploadProps,
  Upload,
  Checkbox

} from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { useModel, useRequest, history } from 'umi';
import {
  getLeaseResult,
  addLeaseResult,
  getHistoryLeaseResult,
  reletLeaseResult,
  deleteLeaseResult,
  rentOutLeaseResult,
  updateLeaseResult,
  paymentLeaseResult,
} from '@/services/ant-design-pro/lease';
import { get_month_num_format } from '@/toolkit/publicUtil';
import { downDetailsExcel } from '@/services/ant-design-pro/export';
import moment from 'moment';
import ProDescriptions from '@ant-design/pro-descriptions';
import ProForm, {
  StepsForm,
  ProFormText,
  ProFormDatePicker,
  ProFormDateTimePicker,
  ProFormSelect,
  ProFormTextArea,
  ProFormMoney,
  ProFormCheckbox,
  ProFormDateTimeRangePicker,
  ProFormDigit,
  ProFormDateRangePicker,
  ProFormDependency,
  ProFormRadio,
  ProFormSwitch,
} from '@ant-design/pro-form';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import ProList from '@ant-design/pro-list';
import { shortNote } from '@/services/ant-design-pro/notice';

export default () => {

  // 入口初始化 页面东区南区西区根据不同的路由进行适配切换
  useEffect(() => {
    // console.log('入口初始化');
  }, []);
  const iconUrl = process.env.iconUrl;
  const MyIcon = createFromIconfontCN({
    scriptUrl: iconUrl, // 在iconfont.cn 上生成
  });
  const [cardActionProps, setCardActionProps] = useState<'actions' | 'extra'>('extra');

  const [ghost, setGhost] = useState<boolean>(false);
  const [noteData, setNoteData] = useState([]);
  const [initData, setInitData] = useState({
    recentlSent: true,
    dueToState: ["payOverdue", "payAlmostHere", "contractOverdue", "contractAlmostHere"]

  });
  const [requestParams, setRequestParams] = useState({
    recentlSent: true,
    dueToState: ["payOverdue", "payAlmostHere", "contractOverdue", "contractAlmostHere"],
    sendMessage: false
  });

  //短信请求
  const shortNoteRequest = useRequest(shortNote, {
    manual: false,
    defaultParams: [requestParams],
    onSuccess: (data: any, params: any) => {
      setRequestParams({ ...requestParams, sendMessage: false }) // 恢复置为不发送短信
      console.log('************');
      if (data) {
        console.log(data)
        setNoteData(data.map((item) => {
          console.log("lala")
          var subTitleList = item.subTitle.map((item) => (<Tag color="blue">{item}</Tag>))
          subTitleList.push(<Tag color="magenta">最新发送时间:{item.textMessageDate}</Tag>)
          const subTitle = <>{subTitleList}</>
          console.log("换行分割", item.content.split("\n"))
          const contentList = item.content.split("\n").map((item) => (<p>{item}</p>))
          const content = <div style={{
            flex: 1,
          }}>{contentList}</div>
          console.log("标签", content)
          return {
            title: item.title,
            subTitle: subTitle,
            avatar: <MyIcon type="icon-duanxin2" style={{ fontSize: 20 }} />,
            description: content
          }
        }))
      } else {
        notification.info({
          description: '短信通知获取数据失败',
          message: '短信通知获取数据失败',
        });
      }
    },
    onError: (error: any, params: any) => {
      setRequestParams({ ...requestParams, sendMessage: false }) // 恢复置为不发送短信
      console.log('收到失败响应数据error:', error.data);
      notification.error({
        description: error.data.ErrorInfo.errDec,
        message: '短信通知获取数据',
      });
      Modal.error({
        title: '请求失败',
        content: (
          <div>
            <p>{`失败原因: ${error.data?.ErrorInfo?.errDec}`}</p>
            <p>{`失败代码: ${error.data?.requestId}`}</p>
          </div>
        ),
      });
    },
  });
  const file_url = process.env.REQUST_BASE_URL + '/dj_myapp/api/upload/upload_sdf/'
  console.log("测试url", file_url)
  const props: UploadProps = {
    name: 'file',
    action: file_url,
    headers: {
      // authorization: 'authorization-text',
      Authorization: `token ${localStorage.getItem('token')}`,
    },
    maxCount: 1,
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  return (
    <>
      <ProCard gutter={8} title="水电费数据同步" style={{ marginTop: 8 }} split={'vertical'} layout={'center'} >
        <ProCard colSpan={{ xs: 8, sm: 8, md: 8, lg: 8, xl: 6 }} layout={'center'}>
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>水电费文件上传并同步数据</Button>
          </Upload>
        </ProCard>
        <ProCard colSpan={{ xs: 8, sm: 8, md: 8, lg: 8, xl: 8 }}><Progress percent={70} status="normal" /></ProCard>
        <ProCard split={'horizontal'}>
          <ProCard><span>当前数据时间范围:</span></ProCard>
          <ProCard><span>同步失败信息:</span></ProCard>
        </ProCard>

      </ProCard>

      <ProCard gutter={8} style={{ marginTop: 20 }}>
        <Spin tip="加载中..." spinning={shortNoteRequest.loading}>
          <ProList<any>
            pagination={{
              defaultPageSize: 50,
              showSizeChanger: true,
            }}
            metas={{
              title: {},
              subTitle: {},
              type: {},
              avatar: {},
              content: {},
              actions: {},
              description: {},
            }}
            headerTitle="数据展览"
            dataSource={noteData}
          />
        </Spin>
      </ProCard>
    </>
  );
};

