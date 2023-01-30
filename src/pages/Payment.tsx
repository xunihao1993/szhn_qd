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
  Checkbox,
  TreeSelect
} from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import { useModel, useRequest, history } from 'umi';
import {
  getPaymentRecords,
  sysUserAdd,
  sysUserDeleteById

} from '@/services/ant-design-pro/lease';
import { changeToChinese } from '@/toolkit/publicUtil'
// import { get_month_num_format } from '@/toolkit/publicUtil';
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
import {
  ProFormSegmented,
  ModalForm,
  ProFormTreeSelect

} from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import ProList from '@ant-design/pro-list';
import { shortNote } from '@/services/ant-design-pro/notice';

export default () => {

  // 入口初始化 页面东区南区西区根据不同的路由进行适配切换
  useEffect(() => {
    console.log('入口初始化');
  }, []);
  type GithubIssueItem = {
    url?: string;
    key?: string;
    number?: number;
    title?: string;
    labels?: {
      name: string;
      color: string;
    }[];
    id?: number;
    state?: string;
    comments?: number;
    updated_at?: string;
    closed_at?: string;
    leaseStatus?: any;
    leaseFullName: any; // 房屋标题
    payCostMonths: any; // 缴费日期月数
    contractMonths: any; // 合同日期月数
    userName: any; // 承租人
    phone: any; // 手机号码
    cashPledgeNum: any; // 押金单号
    cashPledgeMoney: any; //押金金额
    onHireDate: any; // 起租时间
    contractNum: any; // 合同编号
    contractStartDate: any; // 合同开始时间
    contractEndDate: any; // 合同结束时间
    contractDate: any; // 合同时间
    payCostDate: any; // 缴费时间间隔
    rent: any; // 租金/月
    sanitationCost: any; // 卫生费
    property?: any; // 物业费
    paymentMethod?: any; // 缴费方式
    shroffAccount?: any; // 缴费账号
    invoice?: any;  // 是否开票
    spaceNum: any; // 间数
    paymentStartDate: any; // 缴费开始时间
    paymentEndDate: any; // 缴费结束时间
    paymentDate: any; // 缴费时间
    amountOfFree: any; // 免租金额
    accountReceivable: any; // 应收款金额
    thisAccountReceivable: any; // 缴费期内应收款
    thisMoneyReceivable?: any // 缴费期内实收款
    moneyReceivable: any; // 实收金额
    squareMeter: any; // 平方米
    squareMeterPrice: any; // 平方米/元
    ascending: any; // 递增
    remark: any; // 备注

    originPayCostDate?: any;
    originThisAccountReceivable?: any;
    originThisMoneyReceivable?: any;
  };
  const iconUrl = process.env.iconUrl;
  const MyIcon = createFromIconfontCN({
    scriptUrl: iconUrl, // 在iconfont.cn 上生成
  });
  const [cardActionProps, setCardActionProps] = useState<'actions' | 'extra'>('extra');
  // 查询表格额外参数(用于主动触发请求)
  const [selectParams, setSelectParams] = useState({});
  // 租赁概要信息操作系列ref
  const actionRef = useRef<ActionType>();
  // 查询数据总条数--缴费记录页面
  const [requeTotal, setrequeTotal] = useState(100);
  // excel条件过滤表单
  const [excelFormRef] = Form.useForm();
  // 标题点击样式化
  const { CheckableTag } = Tag;
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
  //新建功能(第一步表单)
  const [formRef1] = Form.useForm();
  //新建功能(第二表单)
  const [formRef2] = Form.useForm();

  // 新建功能表单初始化参数
  const fromDataInit: GithubIssueItem = {
    username: null,
    password: null,
    juese: "xuesheng",
    bookType: null
  };
  // 归还/借阅功能表单初始化参数
  const reletFromDataInit = {
    ...fromDataInit,

  };
  // 重置相关初始化useState数据
  const reset_init_data = (reset_select = true) => {
    // reset_select:是否重置查询
    setFromData(fromDataInit);


    // 刷新数据
    if (reset_select) {
      actionRef.current?.reload();

    }
  };
  // 跳转说明
  const windowsOpen = (leaseStatus: any) => {
    // 新录入图书信息功能
    if (leaseStatus == "addHouse") {
      window.open("https://www.yuque.com/eggdan/il28ya?# 《数字海南--图书管理系统笔试题》")
    } else if (leaseStatus == "rentOut") {
      // 出租
      window.open("https://www.yuque.com/eggdan/il28ya?# 《数字海南--图书管理系统笔试题》")
    } else if (leaseStatus == "relet") {
      // 续租(合同续约)
      window.open("https://www.yuque.com/eggdan/il28ya?# 《数字海南--图书管理系统笔试题》")
    } else if (leaseStatus == "payment") {
      // 续费
      window.open("https://www.yuque.com/eggdan/il28ya?# 《数字海南--图书管理系统笔试题》")
    } else if (leaseStatus == "surrender") {
      // 删除图书
      window.open("https://www.yuque.com/eggdan/il28ya?# 《数字海南--图书管理系统笔试题》")
    }
  }
  // 新建功能表单值
  const [fromData, setFromData] = useState({ ...fromDataInit });
  // 颜色名称相关枚举
  const nameColor = (key: any) => {
    if (key == '管理员') {
      return { name: '管理员', color: 'red' };
    } else if (key == '学生') {
      return { name: '学生', color: 'green' };
    } else if (key == 'payment') {
      return { name: '续费(缴费)', color: 'green' };
    } else if (key == 'paymentSupplement') {
      return { name: '缴费(续费)-补款', color: 'cyan' };
    } else if (key == 'clockAuto') {
      return { name: '定时自动生成预缴费', color: 'purple' };
    } else if (key == 'xj') {
      return { name: '现金', color: 'purple' };
    } else if (key == 'yh') {
      return { name: '银行', color: 'purple' };
    } else {
      return { name: '未知', color: '#f50' };
    }
  };

  const leaseStatusMap = {
    all: {
      name: '全部',
      colour: 'green',
      text: '全部',
      status: 'Default',
    },
    gratis: {
      name: '免费',
      colour: 'green',
      text: '免费',
      status: 'gratis',
    },
    underway: {
      name: '租赁中',
      colour: 'red',
      text: '租赁中',
      status: 'underway',
    },
    idle: {
      name: '闲置',
      colour: 'blue',
      text: '闲置',
      status: 'idle',
    },
  };
  // 新建分步表单开关
  const [visible, setVisible] = useState(false);

  // 归还/借阅功能表单值
  const [reletFromData, setReletFromData] = useState({ ...reletFromDataInit });
  // 归还/借阅(合同续约)分步表单开关
  const [reletVisible, setReletVisible] = useState(false);
  // 租赁概要信息查询
  const columns: ProColumns<GithubIssueItem>[] = [
    // {
    //   dataIndex: 'index',
    //   valueType: 'indexBorder',
    //   width: 48,
    // },
    {
      title: '用户名',
      width: 150,
      dataIndex: 'username',
      // copyable: true, //是否支持复制
      // ellipsis: true, //标题过长会自动收缩
      hideInSearch: true,
      editable: false, // 是否可编辑
      // fixed: 'left',
      tip: '标题过长会自动收缩',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      // fixed: 'left',
      width: 150,
      editable: false, // 是否可编辑
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
      valueType: 'dateTime',
    },
    {
      title: '权限列表',
      width: 120,
      dataIndex: 'roleList',
      // fixed: 'left',
      editable: false, // 是否可编辑
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
      render: (_: any, record: any) => (
        <Space>
          <Tag color={nameColor(_).color}>{nameColor(_).name}</Tag>
        </Space>
      ),
    },

    {
      title: '操作',
      valueType: 'option',
      width: 150,
      fixed: 'right',
      render: (text, record, _, action) => [
        <a
          key="editable"
          aria-disabled
          onClick={() => {
            setReletVisible(true);
            // 设置表单全局变量
            setReletFromData({
              ...record,
              id:record.id
            });
            setReletVisible(true);
          }}
        >
          删除用户
        </a>,
      ],
    },
  ];



  const RadioOnChange = e => {
    console.log('radio checked', e.target.value);
    setInitData({ ...initData, recentlSent: e.target.value });
    setRequestParams({ ...requestParams, recentlSent: e.target.value })
    shortNoteRequest.run({ ...requestParams, recentlSent: e.target.value })
  };
  function CheckboxOnChange(checkedValues) {
    console.log('checked = ', checkedValues);
    setInitData({ ...initData, dueToState: checkedValues });
    setRequestParams({ ...requestParams, dueToState: checkedValues })
    shortNoteRequest.run({ ...requestParams, dueToState: checkedValues })
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
      <ProTable<GithubIssueItem>
        params={selectParams}
        columns={columns}
        actionRef={actionRef}
        // defaultSize={10}
        request={async (params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          console.log(params, sorter, filter);
          const res = await getPaymentRecords({ ...params, sorter, filter });
          console.log('测试查询结果：', res.data);
          setrequeTotal(res.data.total);
          return {
            success: true,
            data: res.data.records,
          };
        }}
        editable={{
          type: 'multiple',
          actionRender: (row, config, defaultDom) => [defaultDom.save, defaultDom.cancel],
        }}
        scroll={{ x: 500 }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
        }}
        rowKey="receiptId"
        search={{
          labelWidth: 'auto',
          collapseRender: false,
          defaultCollapsed: false,
          // span:3,
        }}
        search={false}
        form={{
          // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
          syncToUrl: (values, type) => {
            console.log('测试syncToUrl-type', type);
            console.log('测试syncToUrl-values', values);
            if (type === 'get') {
              return {
                ...values,
                created_at: [values.startTime, values.endTime],
                test: '额外添加参数',
              };
            }
            return values;
          },
        }}
        pagination={{
          defaultPageSize: 10,
          showQuickJumper: true,
          total: requeTotal,
        }}
        dateFormatter="string"
        headerTitle="用户列表"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setVisible(true)}
          >
            新增用户
          </Button>,
        ]}
      />
      {/* 新建功能分步表单 */}
      <StepsForm
        onFinish={async (values) => {
          console.log('提交的所有数据', values);

          // 新增图书接口
          try {
            console.log('发送参数', fromData);
            const res = await sysUserAdd(fromData);
            console.log('请求结束', res);
            console.log(formRef2.getFieldsValue());

            if (res.resSuccess) {
              message.success('数据新建成功');
              // // 初始化参数
              // setFromData(fromDataInit);
              // // 刷新数据
              // actionRef.current?.reload();
              reset_init_data();
              setVisible(false); // 关闭弹出框
              return true;
            } else {
              notification.error({
                message: '接口异常',
                description: '接口返回数据异常',
              });
              message.error('接口返回数据异常');
              return false;
            }
          } catch (error) {
            console.log('新增操作中接口异常抛出', error);
            notification.error({
              message: '通讯异常',
              description: '与客户端通讯链接异常',
            });
            message.error('与客户端连接异常');
            return false;
          }
        }}
        formProps={{
          validateMessages: {
            required: '此项为必填项',
          },
        }}
        stepsFormRender={(dom, submitter) => {
          return (
            <Modal
              title={<a onClick={() => { windowsOpen("addHouse") }}>新建图书信息---[点击可查看功能说明]</a>}
              width={900}
              onCancel={() => setVisible(false)}
              maskClosable={false}
              visible={visible}
              footer={submitter}
              destroyOnClose
            >
              {dom}
            </Modal>
          );
        }}
      >
        <StepsForm.StepForm
          layout="vertical"
          name="checkbox"
          title="录入图书信息"
          form={formRef2}
          onFinish={async () => {
            console.log('这是第二步');
            console.log(formRef2.getFieldsValue());
            const getData = formRef2.getFieldsValue()
            // 将合约日期跟缴费日期 起租时间格式化
            if (getData.juese == "admin") {
              const request_post = {
                ...formRef2.getFieldsValue(),
                roleIds: [1],
              };
              setFromData({
                ...fromData,
                ...request_post,
              });
            } else {
              const request_post = {
                ...formRef2.getFieldsValue(),
                roleIds: [2],
              };
              setFromData({
                ...fromData,
                ...request_post,
              });
            }



            return true;
          }}
        >
          {console.log('准备跳转到第二步', fromData.leaseStatus)}
          <ProForm.Group >
            <ProFormText width="xl" name="username" label="用户名" />
            <ProFormText width="xl" name="password" label="密码" />
            <ProFormSelect
              label="对应角色"
              name="juese"
              rules={[
                {
                  required: true,
                },
              ]}
              width="md"
              initialValue="xuesheng"
              options={[
                { value: 'xuesheng', label: '学生' },
                { value: 'admin', label: '管理员' },
              ]}
            />
          </ProForm.Group>
        </StepsForm.StepForm>
        <StepsForm.StepForm name="time" title="确定图书信息">
          <ProDescriptions
            column={2}
          // tooltip="包含了从服务器请求，columns等功能"
          >

            <ProDescriptions.Item span={2} label="用户">
              {fromData.username}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={2} label="密码">
              {fromData.password}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label="图书类型"
              span={2}
              valueEnum={{
                admin: {
                  text: '管理员',
                  status: 'Error',
                },
                xuesheng: {
                  text: '学生',
                  status: 'Success',
                },
              }}
            >
              {/* {console.log('第三步信息', fromData)} */}
              {fromData.juese}
            </ProDescriptions.Item>

          </ProDescriptions>
        </StepsForm.StepForm>
      </StepsForm>
      {/* 删除功能分步表单 */}
      <StepsForm
        onFinish={async (values) => {
          console.log('提交的所有数据', values);
          try {
            console.log('发送参数', reletFromData);

            const res = await sysUserDeleteById(reletFromData);
            console.log('请求结束', res);

            if (res.resSuccess) {
              message.success('删除用户成功');
              // 初始化参数
              reset_init_data();
              // 刷新数据
              actionRef.current?.reload();
              setReletVisible(false); // 关闭弹出框
              return true;
            } else {
              notification.error({
                message: '接口异常',
                description: '接口返回数据异常',
              });
              message.error('接口返回数据异常');

              return false;
            }
          } catch (error: any) {
            console.log('删除用户操作中接口异常抛出', error);
            notification.error({
              message: '通讯异常',
              description: '与客户端通讯链接异常',
            });
            message.error('与客户端连接异常');
            Modal.error({
              title: '删除用户失败',
              content: (
                <div>
                  <p>{`失败原因: ${error.data.ErrorInfo.errDec}`}</p>
                  <p>{`失败代码: ${error.data.requestId}`}</p>
                </div>
              ),
            });
            return false;
          }
        }}
        formProps={{
          validateMessages: {
            required: '此项为必填项',
          },
        }}
        stepsFormRender={(dom, submitter) => {
          return (
            <Modal
              // title="删除用户"
              title={<a onClick={() => { windowsOpen("relet") }}>删除用户---[点击可查看功能说明]</a>}
              width={800}
              maskClosable={false}
              onCancel={() => setReletVisible(false)}
              visible={reletVisible}
              footer={submitter}
              destroyOnClose
            >
              {dom}
            </Modal>
          );
        }}
      >
        <StepsForm.StepForm name="time" title="确定删除信息">
          <ProDescriptions
            column={2}
          >
            <ProDescriptions.Item span={2} label="用户名">
              {reletFromData.username}
            </ProDescriptions.Item>
          </ProDescriptions>
        </StepsForm.StepForm>
      </StepsForm>
    </>
  );
};
