import React, { useRef, useState, useEffect } from 'react';
import { PlusOutlined, EllipsisOutlined, DownloadOutlined, createFromIconfontCN } from '@ant-design/icons';
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
    console.log('入口初始化');
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
      setRequestParams({...requestParams, sendMessage:false}) // 恢复置为不发送短信
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
      setRequestParams({...requestParams, sendMessage:false}) // 恢复置为不发送短信
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
  const RadioOnChange = e => {
    console.log('radio checked', e.target.value);
    setInitData({ ...initData, recentlSent: e.target.value });
    setRequestParams({...requestParams, recentlSent:e.target.value})
    shortNoteRequest.run({...requestParams, recentlSent:e.target.value})
  };
  function CheckboxOnChange(checkedValues) {
    console.log('checked = ', checkedValues);
    setInitData({ ...initData, dueToState: checkedValues });
    setRequestParams({...requestParams, dueToState: checkedValues})
    shortNoteRequest.run({...requestParams, dueToState: checkedValues})
  }
  const options = [
    { label: '缴费已逾期', value: 'payOverdue' },
    { label: '缴费快到期', value: 'payAlmostHere' },
    { label: '合同已逾期', value: 'contractOverdue' },
    { label: '合同快到期', value: 'contractAlmostHere' },
  ];
  // const options = [
  //   { label: 'Apple', value: 'Apple' },
  //   { label: 'Pear', value: 'Pear' },
  //   { label: 'Orange', value: 'Orange' },
  // ];
  const plainOptions = ['Apple', 'Pear', 'Orange'];
  return (
    <>
      <ProCard gutter={8} title="短信通知过滤条件" style={{ marginTop: 8 }}>
        <ProCard colSpan={24} >
          <Form
            name="basic"
            layout="horizontal"
            // labelCol={{ span: 8 }}
            // wrapperCol={{ span: 5 }}
            initialValues={{ remember: true }}
            autoComplete="off"
          >
            <Form.Item
              label="只发送最近一个月未发送"
              name="recentlSent"
            >
              <Radio.Group onChange={RadioOnChange} value={initData.recentlSent} defaultValue={requestParams.recentlSent}>
                <Radio value={true}>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>
            </Form.Item>
            <Form.Item
              label="到租状态"
              name="dueToState"
            >
              <Checkbox.Group options={options} defaultValue={initData.dueToState} onChange={CheckboxOnChange} />
              <Checkbox.Group/>
            </Form.Item>
            <Form.Item >
              <Button type="primary" onClick={()=>{shortNoteRequest.run({...requestParams, sendMessage:true})}} >发送短信</Button>
            </Form.Item>


          </Form>
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
          headerTitle="短信通知预览"
          dataSource={noteData}
        />
        </Spin>
      </ProCard>
    </>
  );
};
