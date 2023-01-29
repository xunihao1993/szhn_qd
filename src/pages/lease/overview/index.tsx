import React, { useRef, useState, useEffect } from 'react';
import { PlusOutlined, EllipsisOutlined, DownloadOutlined } from '@ant-design/icons';
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
  TreeSelect,
  Input,
  Tooltip,
  Checkbox,

} from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import  { TableDropdown } from '@ant-design/pro-table';
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
  flag_house_number,
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
} from '@ant-design/pro-form';

import {
  ProFormSegmented,
  ModalForm,
  ProFormTreeSelect,
  ProTable

} from '@ant-design/pro-components';
import type { ProFormInstance } from '@ant-design/pro-form';

export default () => {
  type GithubIssueItem = {
    url?: string;
    key?: string;
    number?: number;
    title?: string;
    labels?: {
      name: string;
      color: string;
    }[];
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
  // 入口初始化 页面东区南区西区根据不同的路由进行适配切换
  useEffect(() => {
    console.log('入口初始化');
    const url_name = history.location.pathname.split('/')[2];
    setUrlName(url_name);
    if (url_name == 'westernArea') {
      setSelectParams({ region: 2 });
    } else if (url_name == 'eastArea') {
      setSelectParams({ region: 1 });
    } else if (url_name == 'southArea') {
      setSelectParams({ region: 3 });
    }
  }, []);
  // 路由变量
  const [urlName, setUrlName] = useState('');
  // 下载按钮转圈圈
  const [Downloadstate, setDownloadstate] = useState(false);
  // 抽屉布局开关
  const [DrawerVisible, setDrawerVisible] = useState(false);
  // 退租弹出框
  const [surrenderModalVisible, setSurrenderModalVisible] = useState(false);
  // 分步表单步骤数
  const [fromCurrent, setFromCurrent] = useState(undefined);
  // 新建分步表单开关
  const [visible, setVisible] = useState(false);
  // 修改分步表单开关
  const [updateVisible, setUpdateVisible] = useState(false);
  // 出租分步表单开关
  const [rentOutVisible, setRentOutVisible] = useState(false);
  // 续租(合同续约)分步表单开关
  const [reletVisible, setReletVisible] = useState(false);
  // 续费(缴费)分步表单开关
  const [paymentVisible, setPaymentVisible] = useState(false);
  // 请求加载中
  const [requestLoading, setRequestLoading] = useState(false);
  // excel弹出框--租赁管理
  const [excelModalVisible, setExcelModalVisible] = useState(false);

  // excel条件过滤表单
  const [excelFormRef] = Form.useForm();
  //出租功能(表单)
  const [rentOutFormRef] = Form.useForm();
  //修改功能(表单)
  const [updateFormRef] = Form.useForm();
  //新建功能(第一步表单)
  const [formRef1] = Form.useForm();
  //新建功能(第二表单)
  const [formRef2] = Form.useForm();
  //续租合同续约功能(表单)
  const [reletFormRef] = Form.useForm();
  //续费缴费功能(表单)
  const [paymentFormRef] = Form.useForm();
  // 标题点击样式化
  const { CheckableTag } = Tag;

  // 查询表格额外参数(用于主动触发请求)
  const [selectParams, setSelectParams] = useState({});

  // 历史记录查询表格额外参数(用于主动出发请求)
  const [historySelectParams, setHistorySelectParams] = useState({});

  // 历史记录抽屉关闭参数
  const onClose = () => {
    setDrawerVisible(false);
  };
  // 退租弹出框 OK按钮
  const handleOk = () => {
    setRequestLoading(true);
    deleteLeaseRequest.run({ ...originData });
    // setSurrenderModalVisible(false);
  };
  // 退租弹出框 取消按钮
  const handleCancel = () => {
    setRequestLoading(false);
    setSurrenderModalVisible(false);
  };


  // 导出excel弹出框 OK按钮
  const excelHandleOk = () => {
    setRequestLoading(true);
    // deleteLeaseRequest.run({ ...originData });
    // setExcelModalVisible(false);
  };
  // 导出excel弹出框 取消按钮
  const excelHandleCancel = () => {
    setRequestLoading(false);
    setExcelModalVisible(false);
  };



  // 缴费时间
  const [paymentDate, setPaymentDate] = useState();
  // 合同时间
  const [contractDate, setContractDate] = useState();

  // 缴费结束时间
  const [paymentEndDate, setPaymentEndDate]: any = useState();

  // 新建功能表单初始化参数
  const fromDataInit: GithubIssueItem = {
    leaseStatus: null, // 租赁状态
    leaseFullName: '错误门牌号', // 房屋标题
    payCostMonths: 0, // 缴费日期月数
    contractMonths: 0, // 合同日期月数
    userName: null, // 承租人
    phone: null, // 手机号码
    cashPledgeNum: null, // 押金单号
    cashPledgeMoney: null, //押金金额
    onHireDate: null, // 起租时间
    contractNum: null, // 合同编号
    contractStartDate: null, // 合同开始时间
    contractEndDate: null, // 合同结束时间
    contractDate: [null, null], // 合同时间
    payCostDate: null, // 缴费时间间隔
    rent: null, // 租金/月
    sanitationCost: null, // 卫生费
    property: null, // 物业费
    paymentMethod: 'xj', // 缴费方式
    shroffAccount: null, // 缴费账号
    invoice: true, // 是否开票
    spaceNum: null, // 间数
    paymentStartDate: null, // 缴费开始时间
    paymentEndDate: null, // 缴费结束时间
    paymentDate: null, // 缴费时间
    amountOfFree: null, // 免租金额
    accountReceivable: null, // 合同总应收款
    thisAccountReceivable: null, // 缴费期内应收款
    thisMoneyReceivable: null, // 缴费期内实收款
    moneyReceivable: null, // 实收金额
    squareMeter: null, // 平方米
    squareMeterPrice: null, // 平方米/元
    ascending: null, // 递增
    remark: null, // 备注
  };
  // 续租功能表单初始化参数
  const reletFromDataInit = {
    ...fromDataInit,
    originContractDate: [null, null], // 原合同时间
    originPaymentDate: [null, null], // 原缴费时间
    paymentDateUpdate: false, // 新缴费时间与原缴费时间是否不一致即被更新
    originRent: 0,
    originSanitationCost: 0,
    originProperty: 0,
    asc: 0,
    ascType: 'yz'

  };

  // 新建功能表单值
  const [fromData, setFromData] = useState({ ...fromDataInit });
  // 修改功能表单值
  const [updateFromData, setUpdateFromData] = useState({ ...fromDataInit });
  // 续租功能表单值
  const [reletFromData, setReletFromData] = useState({ ...reletFromDataInit });
  // 缴费功能表单值
  const [paymentFromData, setPaymentFromData] = useState({ ...reletFromDataInit });
  // 出租功能表单值
  const [rentOutFromData, setRentOutFromData] = useState({ ...fromDataInit });
  // 单一原始数据相关信息
  const [originData, setOriginData] = useState({ ...fromDataInit });

  // 重置相关初始化useState数据
  const reset_init_data = (reset_select = true) => {
    // reset_select:是否重置查询
    setFromData(fromDataInit);
    setOriginData(fromDataInit);
    setReletFromData(reletFromDataInit);
    setPaymentFromData(reletFromDataInit);
    setRentOutFromData(fromDataInit);
    setUpdateFromData(fromDataInit);
    rentOutFormRef.setFieldsValue(fromDataInit);
    updateFormRef.setFieldsValue(fromDataInit);

    // 刷新数据
    if (reset_select) {
      actionRef.current?.reload();
      actionHistoryRef.current?.reload();
    }
  };
  const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  };

  // 合同时间与月租金计算应收款金额函数

  const sum_amount = (contractDate: any, rent: any, sanitationCost: any, property: any) => {
    moment.defaultFormat = 'YYYY-MM-DD';
    var values = 0;
    if (
      sanitationCost != null &&
      sanitationCost != undefined &&
      property != null &&
      property != undefined &&
      rent &&
      contractDate &&
      contractDate[0] &&
      contractDate[1]
    ) {
      const data_flag = moment(contractDate[1], moment.defaultFormat).diff(
        moment(contractDate[0], moment.defaultFormat),
        'months',
      ); // 不带小数点
      const data_flag2 = moment(contractDate[1], moment.defaultFormat).diff(
        moment(contractDate[0], moment.defaultFormat),
        'months',
        true,
      ); // 带小数点
      console.log('data_flag:', data_flag);
      console.log('data_flag2:', data_flag2);
      if (data_flag2 >= data_flag + 0.8) {
        return (values = Math.ceil(data_flag2) * (rent + sanitationCost + property));
      } else {
        return (values = data_flag * (rent + sanitationCost + property));
      }
    } else {
      return values;
    }
  };

  // 缴费日期赋值函数
  const disabledDate = (current: any) => {
    console.log('测试缴费日期', current);
    setPaymentDate(current ? current[0] : null);
    const month_num = get_month_num_format(current);
    var month_num_format = '0个月';
    if (month_num == 6) {
      month_num_format = '半年';
    } else if (month_num == 12) {
      month_num_format = '一年';
    } else if (month_num == 24) {
      month_num_format = '二年';
    } else {
      month_num_format = `${month_num}个月`;
    }
    formRef2.setFieldsValue({
      payCostDate: month_num_format,
    });
    // 出租表单
    rentOutFormRef?.setFieldsValue({
      payCostDate: month_num_format,
    });
  };
  // 根据递增计算出月租、卫生费、物业费
  const ascUpdateRent = (e: any, types: any) => {
    if (types == "relet") {
      const asc = reletFormRef.getFieldValue("asc")
      const ascType = reletFormRef.getFieldValue("ascType")
      const rent = reletFormRef.getFieldValue("rent")
      const sanitationCost = reletFormRef.getFieldValue("sanitationCost")
      const originRent = reletFromData.originRent
      const originSanitationCost = reletFromData.originSanitationCost
      const originProperty = reletFromData.originProperty
      console.log("递增:", asc)
      console.log("递增:", asc)
      if (asc && asc != 0) {
        if (ascType == "yz") {
          reletFormRef.setFieldsValue({
            rent: originRent * (1 + asc / 100),
            sanitationCost: originSanitationCost,
            property: originProperty,
          })
        } else if (ascType == "yzwy") {
          reletFormRef.setFieldsValue({
            rent: originRent * (1 + asc / 100),
            sanitationCost: originSanitationCost,
            property: originProperty * (1 + asc / 100),
          })
        } else if (ascType == "yzwswy") {
          reletFormRef.setFieldsValue({
            rent: originRent * (1 + asc / 100),
            sanitationCost: originSanitationCost * (1 + asc / 100),
            property: originProperty * (1 + asc / 100),
          })
        }
      } else {
        reletFormRef.setFieldsValue({
          rent: originRent,
          sanitationCost: originSanitationCost,
          property: originProperty,
        })
      }

    }

  }
  // 计算出月租   平方米 * 单价
  const updateRent = (e: any, types: any) => {
    if (types == "newCreate") {
      // console.log("计算月租:", e.target.value)
      // console.log("计算类型:", types)
      const squareMeter = formRef2.getFieldValue("squareMeter")
      const squareMeterPrice = formRef2.getFieldValue("squareMeterPrice")
      console.log("squareMeter", squareMeter)
      if (squareMeter && squareMeterPrice) {
        formRef2.setFieldsValue({
          rent: squareMeter * squareMeterPrice * 0.68,
          property: squareMeter * squareMeterPrice * 0.32,
        });
      }
    }
    else if (types == "rent") {
      const squareMeter = rentOutFormRef.getFieldValue("squareMeter")
      const squareMeterPrice = rentOutFormRef.getFieldValue("squareMeterPrice")
      console.log("squareMeter", squareMeter)
      if (squareMeter && squareMeterPrice) {
        rentOutFormRef.setFieldsValue({
          rent: squareMeter * squareMeterPrice * 0.68,
          property: squareMeter * squareMeterPrice * 0.32,
        });
      }

    }



  }
  // 合同日期赋值函数
  const disableContracdDate = (current: any) => {
    console.log('测试缴费日期', current);
    setContractDate(current ? current[0] : null);
  };
  // 颜色名称相关枚举
  const nameColor = (key: any) => {
    if (key == 'gratis') {
      return { name: '免费', color: 'green' };
    } else if (key == 'underway') {
      return { name: '租赁中', color: 'red' };
    } else if (key == 'temporary') {
      return { name: '临时', color: 'purple' };
    } else if (key == 'idle') {
      return { name: '闲置', color: 'blue' };
    } else if (key == 'addUnderway') {
      return { name: '新增出租房屋', color: 'red' };
    } else if (key == 'addTemporary') {
      return { name: '新增临时房屋', color: 'purple' };
    } else if (key == 'addGratis') {
      return { name: '新增免费房屋', color: 'red' };
    } else if (key == 'addIdle') {
      return { name: '新增闲置房屋', color: 'red' };
    } else if (key == 'surrender') {
      return { name: '退租', color: 'green' };
    } else if (key == 'rentOut') {
      return { name: '出租', color: 'red' };
    } else if (key == 'relet') {
      return { name: '合同续约(续租)', color: 'blue' };
    } else if (key == 'payment') {
      return { name: '续费(缴费)', color: 'blue' };
    } else if (key == 'alterInfo') {
      return { name: '修改信息', color: 'blue' };
    } else {
      return { name: '未知', color: '#f50' };
    }
  };
  // 跳转说明
  const windowsOpen = (leaseStatus: any) => {
    // 新录入租赁信息功能
    if (leaseStatus == "addHouse") {
      window.open("https://www.yuque.com/docs/share/ca78208f-c096-4800-8f33-24a70d8ac9e6?#")
    } else if (leaseStatus == "rentOut") {
      // 出租
      window.open("https://www.yuque.com/docs/share/f04ec668-d774-4721-aebf-8c85eb6ed052?#")
    } else if (leaseStatus == "relet") {
      // 续租(合同续约)
      window.open("https://www.yuque.com/docs/share/29a75479-b791-47c3-b975-7ac0e15ab19c?#")
    } else if (leaseStatus == "payment") {
      // 续费
      window.open("https://www.yuque.com/docs/share/9eb73403-153f-452d-8164-d098d3bd24d9?#")
    } else if (leaseStatus == "surrender") {
      // 退租
      window.open("https://www.yuque.com/docs/share/8122865f-ce3e-468f-a87b-4dfaeedfdb5b?#")
    }
  }
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
    temporary: {
      name: '临时',
      colour: 'purple',
      text: '临时',
      status: 'temporary',
    },
    idle: {
      name: '闲置',
      colour: 'blue',
      text: '闲置',
      status: 'idle',
    },
  };
  // 租赁概要信息操作系列ref
  const actionRef = useRef<ActionType>();

  // 租赁历史操作信息操作系列ref
  const actionHistoryRef = useRef<ActionType>();
  // 查询数据总条数--租赁信息
  const [requeTotal, setrequeTotal] = useState(100);
  // 当前全局变量
  const [globalDict, setGlobalDict] = useState({
    totalSpaceNum:0,
  })
  // 查询数据总条数--历史记录
  const [requeOriginTotal, setRequeOriginTotal] = useState(100);
  //租赁概要信息excel导出
  const downRequest = useRequest(downDetailsExcel, {
    manual: true,
    onSuccess: (data: any, params: any) => {
      console.log('这是下载excel文件成功响应');
      console.log('收到响应数据data:', data);
      console.log('这是params:', params);
      // console.log(ErrorHandle)
      // console.log(data.ErrorInfo)
      console.log('************');
      setDownloadstate(false);
      if (data) {
        window.open(data);
        notification.info({
          description: '下载成功',
          message: '下载成功',
        });
      } else {
        notification.info({
          description: '下载失败',
          message: '无法获取到下载路径',
        });
      }
    },
    onError: (error: any, params: any) => {
      setDownloadstate(false);
      console.log('导出excel失败');
      console.log('收到响应数据error:', error.data);
      notification.error({
        description: error.data.ErrorInfo.errDec,
        message: '下载失败',
      });
    },
  });
  // 导出excel
  const Download = () => {
    setDownloadstate(true);
    downRequest.run({
      // ...fromData,
      // ...form.getFieldsValue(),
    });
  };
  //退租请求use
  const deleteLeaseRequest = useRequest(deleteLeaseResult, {
    manual: true,
    onSuccess: (data: any, params: any) => {
      console.log('这是下载excel文件成功响应');
      console.log('收到响应数据data:', data);
      console.log('这是params:', params);
      // console.log(ErrorHandle)
      // console.log(data.ErrorInfo)
      console.log('************');
      if (data) {
        setRequestLoading(false);
        reset_init_data();
        setSurrenderModalVisible(false);
        notification.info({
          description: '退租成功',
          message: '退租成功',
        });
      } else {
        setRequestLoading(false);
        notification.info({
          description: '退租失败',
          message: '退租失败',
        });
      }
    },
    onError: (error: any, params: any) => {
      setRequestLoading(false);
      console.log('退租失败');
      console.log('退租失败error:', error.data);
      notification.error({
        description: error.data?.ErrorInfo?.errDec,
        message: '退租失败',
      });
      Modal.error({
        title: '退租失败',
        content: (
          <div>
            <p>{`失败原因: ${error.data?.ErrorInfo?.errDec}`}</p>
            <p>{`失败代码: ${error.data?.requestId}`}</p>
          </div>
        ),
      });
    },
  });
  // 租赁概要信息查询
  const columns: ProColumns<GithubIssueItem>[] = [
    // {
    //   dataIndex: 'index',
    //   valueType: 'indexBorder',
    //   width: 48,
    // },
    {
      title: '标题',
      width: 200,
      dataIndex: 'leaseFullName',
      // copyable: true, //是否支持复制
      // ellipsis: true, //标题过长会自动收缩
      hideInSearch: true,
      fixed: 'left',
      tip: '标题过长会自动收缩',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
      render: (_, record) => {
        return (
          <Tooltip title={_}>
          <CheckableTag
            style={{ fontSize: 14 }}
            checked={false}
            onChange={() => {
              console.log('测试标题点击事件');
              setOriginData({ ...record });
              setHistorySelectParams({ key: record?.key });
              setDrawerVisible(true);
            }}
          >
            {_.toString().length>=20? _.toString().substring(0, 20)+"...":_}
          </CheckableTag>
          </Tooltip>
        );
      },
    },

    {
      title: '租赁状态',
      dataIndex: 'leaseStatus',
      fixed: 'left',
      // copyable: true, // 是否复制
      // hideInSearch:true, // 查询表单中不展示此项
      hideInTable: true, // 在查询表格不显示
      valueType: 'select',
      initialValue: 'all',
      valueEnum: leaseStatusMap,
    },
    {
      title: '租赁状态',
      width: 80,
      dataIndex: 'leaseStatus',
      fixed: 'left',
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
      render: (_: any, record: any) => (
        <Space>
          <Tag color={leaseStatusMap[_].colour} key={leaseStatusMap[_].name}>
            {leaseStatusMap[_].name}
          </Tag>
        </Space>
      ),
    },

    {
      title: '区域',
      order: 100,
      dataIndex: 'region',
      hideInSearch: urlName == 'overview' ? false : true, // 查询表单中不展示此项
      hideInTable: urlName == 'overview' ? false : true, // 在查询表格不显示
      filters: true,
      onFilter: true,
      valueType: 'select',
      initialValue: 'all',
      valueEnum: {
        all: { text: '全部', status: 'Default' },
        1: {
          text: '东区',
          status: 1,
        },
        2: {
          text: '西区',
          status: 2,
        },
        3: {
          text: '南区',
          status: 3,
        },
      },
    },
    {
      title: '房屋类型',
      dataIndex: 'className',
      order: 99,
      filters: true,
      onFilter: true,
      valueType: 'select',
      initialValue: 'all',
      valueEnum: {
        all: { text: '全部', status: 'Default' },
        1: {
          text: '铺面',
          status: 1,
        },
        2: {
          text: '仓库',
          status: 2,
          // disabled: true,
        },
        3: {
          text: '房屋',
          status: 3,
        },
      },
    },
    {
      title: '栋号',
      dataIndex: 'ridgepoleNum',
      // copyable: true, // 是否复制
      // hideInSearch:true, // 查询表单中不展示此项
      hideInTable: true, // 在查询表格不显示
      valueType: 'digit',
    },
    {
      title: '门牌号',
      dataIndex: 'houseNum',
      // copyable: true, // 是否复制
      // hideInSearch:true, // 查询表单中不展示此项
      hideInTable: true, // 在查询表格不显示
      // valueType: 'digit',
    },
    {
      title: '承租人',
      dataIndex: 'userName',
      width: 80,
      // copyable: true, // 是否复制
      // hideInSearch:true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '承租人联系方式',
      dataIndex: 'phone',
      width: 100,
      // copyable: true, // 是否复制
      // hideInSearch:true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '押金单号',
      dataIndex: 'cashPledgeNum',
      width: 80,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '押金金额',
      width: 80,
      dataIndex: 'cashPledgeMoney',
      valueType: 'money',
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '平方米',
      dataIndex: 'squareMeter',
      width: 100,
      hideInSearch: true, // 查询表单中不展示此项
      valueType: 'text',
      render: (_: any) => {
        return <span> {_ != '-' ? `${_}m\u00b2` : _}</span>;
      },
    },
    {
      title: '每平方米单价',
      valueType: 'money',
      dataIndex: 'squareMeterPrice',
      width: 100,
      hideInSearch: true, // 查询表单中不展示此项
    },
    {
      title: '起租时间',
      dataIndex: 'onHireDate',
      width: 100,
      key: 'since',
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
      valueType: 'date',
    },
    {
      title: '合同编号',
      dataIndex: 'contractNum',
      width: 100,
      hideInSearch: true, // 查询表单中不展示此项
    },
    {
      title: '合同时间',
      key: 'contractDate',
      dataIndex: 'contractDate',
      width: 100,
      hideInSearch: true, // 查询表单中不展示此项
      valueType: 'dateRange',
    },

    {
      title: '上次缴费时间',
      dataIndex: 'paymentDate',
      width: 100,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
      valueType: 'dateRange',
    },
    {
      title: '预计下次缴费时间',
      dataIndex: 'paymentDateNext',
      width: 100,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
      valueType: 'dateRange',
    },
    {
      title: '缴费时间间隔',
      dataIndex: 'payCostDate',
      width: 80,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '租金/月',
      dataIndex: 'rent',
      valueType: 'money',
      tip: '面积 * 平方米单价 * 0.68',
      width: 90,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '卫生费',
      dataIndex: 'sanitationCost',
      valueType: 'money',
      tip: '面积 * 平方米单价 * 0.32',
      width: 80,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '物业费',
      dataIndex: 'property',
      valueType: 'money',
      width: 80,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '间数',
      dataIndex: 'spaceNum',
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '缴费期内应收款',
      dataIndex: 'thisAccountReceivable',
      valueType: 'money',
      tip: '缴费期内应收款金额,(月租+卫生费)*缴费月数',
      width: 100,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '缴费期内实收款',
      dataIndex: 'thisMoneyReceivable',
      tip: '缴费期内实收款金额',
      valueType: 'money',
      width: 100,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '合同总应收款',
      dataIndex: 'accountReceivable',
      valueType: 'money',
      tip: '(月租+卫生费)*合同月数',
      width: 100,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '免租金额',
      dataIndex: 'amountOfFree',
      valueType: 'money',
      width: 100,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '总实收金额',
      dataIndex: 'moneyReceivable',
      valueType: 'money',
      width: 100,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '缴费方式',
      width: 80,
      dataIndex: 'paymentMethod',
      hideInSearch: true, // 查询表单中不展示此项
      valueEnum: {
        xj: { text: '现金' },
        yh: { text: '银行' },
      },
    },
    {
      title: '收款账号',
      width: 80,
      dataIndex: 'shroffAccount',
      ellipsis: true, //标题过长会自动收缩
      hideInSearch: true, // 查询表单中不展示此项
    },
    {
      title: '是否开票',
      width: 80,
      dataIndex: 'invoice',
      hideInSearch: true, // 查询表单中不展示此项
      valueEnum: {
        true: { text: '需要开票' },
        false: { text: '不开票' },
      },
    },
    {
      title: '缴费到租时间',
      dataIndex: 'payCountDow',
      width: 100,
      // fixed: 'right',
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
      render: (_: any, record: any) => {
        if (!record.payCountDowDict) {
          return record.payCountDowDict
        }
        return (<Space>
          <Tag color={record.payCountDowDict.color}>{record.payCountDowDict.name}</Tag>
        </Space>)

      },
    },
    {
      title: '合同到期时间',
      dataIndex: 'countDow',
      width: 100,
      // fixed: 'right',
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
      render: (_: any, record: any) => {
        if (!record.countDowDict) {
          return undefined
        }
        return (
          <Space>
            <Tag color={record.countDowDict.color}>{record.countDowDict.name}</Tag>
          </Space>
        )
      },
    },

    // {
    //   title: '递增',
    //   dataIndex: 'ascending',
    //   // copyable: true, // 是否复制
    //   hideInSearch: true, // 查询表单中不展示此项
    //   // hideInTable:true, // 在查询表格不显示
    // },
    {
      title: '备注',
      dataIndex: 'remark',
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    // {
    //   title: '动态表单',
    //   hideInTable: true,
    //   hideInSearch: false, // 查询表单中不展示此项
    //   dataIndex: 'expireStatus',
    //   renderFormItem: (item, { type, defaultRender, fieldProps, ...rest }, form) => {
    //     if (type === 'form') {
    //       return null;
    //     }
    //     // const stateType = form.getFieldValue('state');
    //     // if (stateType === 3) {
    //     //   return <Input />;
    //     // }
    //     // if (stateType === 4) {
    //     //   return null;
    //     // }
    //     const options = [
    //       { label: '合同快到期', value: 'contractPredict' },
    //       { label: '合同已逾期', value: 'contractOverdue' },
    //       { label: '缴费快到期', value: 'payPredict' },
    //       { label: '缴费已逾期', value: 'payOverdue' },
    //     ];
    //     const onChange = (checkedValues:any) => {
    //       console.log('checked = ', checkedValues);
    //       form.setFieldsValue({"expireStatus":checkedValues})
    //     };
    //     return (<Checkbox.Group {...fieldProps} options={options}  onChange={onChange} />);
    //     // return (<Checkbox onChange={onChange}>Checkbox</Checkbox>);
    //   },
    // },
    {
      title: '到租状态',
      dataIndex: 'expireStatus',
      hideInSearch: false, // 查询表单中不展示此项
      hideInTable: true, // 在查询表格不显示
      // filters: true,
      // onFilter: true,
      valueType: 'checkbox',
      valueEnum: {
        contractPredict: { text: '合同快到期', status: 'Default' },
        contractOverdue: {
          text: '合同已逾期',
          status: 1,
        },
        payPredict: {
          text: '缴费快到期',
          status: 2,
        },
        payOverdue: {
          text: '缴费已逾期',
          status: 3,
        },
      },
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
            setUpdateFromData({
              ...updateFromData,
              leaseFullName: record.leaseFullName,
              key: record.key,
              leaseStatus: record.leaseStatus,
            });
            updateFormRef.setFieldsValue(record);
            // if(record.invoice){
            //   updateFormRef.setFieldsValue({invoice: 'true'})
            // }else{

            // }
            setUpdateVisible(true);
          }}
        >
          修改
        </a>,
        <a
          onClick={() => {
            setOriginData({ ...record });
            setHistorySelectParams({ key: record?.key });
            setDrawerVisible(true);
          }}
          target="_blank"
          rel="noopener noreferrer"
          key="view"
        >
          历史记录
        </a>,
        <TableDropdown
          key="actionGroup"
          onSelect={(item: any) => {
            setOriginData({ ...record }); // 设置目前选择的唯一标识相关信息
            console.log('item', item);
            console.log('contractNum', record.contractNum);
            console.log('contractDate', record.contractDate);
            console.log('record', record);
            // 进行续租(合同续约)操作
            if (item == 'relet') {
              setReletVisible(true);
              // 设置表单全局变量
              setReletFromData({
                ...reletFromData,
                ...record,
                originContractDate: record.contractDate,
                leaseFullName: record.leaseFullName,
                contractDate: [moment(record.contractDate[1], 'YYYY-MM-DD'), null],
                paymentDate: record.paymentDate,
                payCostDate: record.payCostDate,
                originPaymentDate: record.paymentDate,
                originRent: record.rent,
                originSanitationCost: record.sanitationCost,
                originProperty: record.property,
              });
              setPaymentEndDate(moment(record.paymentDate[1], 'YYYY-MM-DD'));
              // 设置续租表单值
              reletFormRef.setFieldsValue({
                contractNum: record.contractNum,
                originContractDate: record.contractDate,
                contractDate: [moment(record.contractDate[1], 'YYYY-MM-DD'), null],
                paymentDate: record.paymentDate,
                payCostDate: record.payCostDate,
                rent: record.rent,
                sanitationCost: record.sanitationCost,
                property: record.property,
                ascending: record.ascending,
                remark: record.remark,
                asc: 0,
                asctype: 'yz'
              });
              console.log('contractDate', moment(record.contractDate[1], 'YYYY-MM-DD'));
              setReletVisible(true);
              // 缴费续费操作
            } else if (item == 'payment') {
              // 设置表单全局变量
              if (record.leaseStatus == "temporary"){
                // 租赁状态为临时时 不需要合同时间
                setPaymentFromData({
                  ...reletFromData,
                  ...record,
                  paymentMethod: "xj",
                  originContractDate: record.contractDate,
                  leaseFullName: record.leaseFullName,
                  // contractDate: [moment(record.contractDate[0], 'YYYY-MM-DD'), moment(record.contractDate[1], 'YYYY-MM-DD')],
                  paymentDate: record.paymentDate,
                  payCostDate: record.payCostDate,
                  originPaymentDate: record.paymentDate,
                  originThisAccountReceivable: record.thisAccountReceivable,
                  originThisMoneyReceivable: record.thisMoneyReceivable,
                  originRent: record.rent,
                  originSanitationCost: record.sanitationCost,
                  originProperty: record.property,
                });
                setPaymentEndDate(moment(record.paymentDate[1], 'YYYY-MM-DD'));
                // 设置续费表单值
                paymentFormRef.setFieldsValue({
                  paymentMethod: "xj",
                  contractNum: record.contractNum,
                  originContractDate: record.contractDate,
                  // contractDate: [moment(record.contractDate[0], 'YYYY-MM-DD'), moment(record.contractDate[1], 'YYYY-MM-DD')],
                  paymentDate: record.paymentDate,
                  payCostDate: record.payCostDate,
                  originPaymentDate: record.paymentDate,
                  property: record.property,
                  rent: record.rent,
                  sanitationCost: record.sanitationCost,
                  ascending: record.ascending,
                  remark: record.remark,
                  originThisAccountReceivable: record.thisAccountReceivable,
                  originThisMoneyReceivable: record.thisMoneyReceivable,
                  asc: 0,
                  asctype: 'yz'
                });
              }else{
                setPaymentFromData({
                  ...reletFromData,
                  ...record,
                  paymentMethod: "xj",
                  originContractDate: record.contractDate,
                  leaseFullName: record.leaseFullName,
                  contractDate: [moment(record.contractDate[0], 'YYYY-MM-DD'), moment(record.contractDate[1], 'YYYY-MM-DD')],
                  paymentDate: record.paymentDate,
                  payCostDate: record.payCostDate,
                  originPaymentDate: record.paymentDate,
                  originThisAccountReceivable: record.thisAccountReceivable,
                  originThisMoneyReceivable: record.thisMoneyReceivable,
                  originRent: record.rent,
                  originSanitationCost: record.sanitationCost,
                  originProperty: record.property,
                });
                setPaymentEndDate(moment(record.paymentDate[1], 'YYYY-MM-DD'));
                // 设置续费表单值
                paymentFormRef.setFieldsValue({
                  paymentMethod: "xj",
                  contractNum: record.contractNum,
                  originContractDate: record.contractDate,
                  contractDate: [moment(record.contractDate[0], 'YYYY-MM-DD'), moment(record.contractDate[1], 'YYYY-MM-DD')],
                  paymentDate: record.paymentDate,
                  originPaymentDate: record.paymentDate,
                  payCostDate: record.payCostDate,
                  property: record.property,
                  rent: record.rent,
                  sanitationCost: record.sanitationCost,
                  ascending: record.ascending,
                  remark: record.remark,
                  originThisAccountReceivable: record.thisAccountReceivable,
                  originThisMoneyReceivable: record.thisMoneyReceivable,
                  asc: 0,
                  asctype: 'yz'
                });

              }

              // console.log('contractDate', moment(record.contractDate[1], 'YYYY-MM-DD'));
              setPaymentVisible(true);
            } else if (item == 'surrender') {
              setSurrenderModalVisible(true);
              // 概要查询页面 出租按钮
            } else if (item == 'rentOut') {
              // 设置表单值
              rentOutFormRef.setFieldsValue({
                leaseStatus: 'underway', // 初始化
                paymentMethod: 'xj',
                invoice: true,
                spaceNum: 1,
                squareMeter: record.squareMeter,
                squareMeterPrice: record.squareMeterPrice,
                rent: record.rent,
                sanitationCost: record.sanitationCost,
                property: record.property,
                ascending: record.ascending,
                remark: record.remark,
              });
              setRentOutFromData({
                ...rentOutFromData,
                paymentMethod: 'xj',
                invoice: true,
                leaseStatus: 'underway',
                leaseFullName: record.leaseFullName,
                key: record.key,
              });
              setRentOutVisible(true);
            }
          }}
          menus={[
            { key: 'rentOut', name: '出租', title: '只有闲置中的房屋才能进行出租操作', disabled: record.leaseStatus == "idle" ? false : true },
            { key: 'relet', name: '合同续约', title: '只有租赁中的房屋才能进行续租操作', disabled: record.leaseStatus == "underway" ? false : true },
            { key: 'payment', name: '缴费(续费)', title: '只有租赁中或临时的房屋才能进行续费操作', disabled: record.leaseStatus == "underway" || record.leaseStatus == "temporary" ? false : true },
            { key: 'surrender', name: '退租', title: '只有租赁中或免费的房屋才能进行退租操作', disabled: record.leaseStatus == "idle" ? true : false },
          ]}
        />,
      ],
    },
  ];
  // 历史记录查询columns
  const historyColumns: ProColumns<GithubIssueItem>[] = [
    // {
    //   dataIndex: 'index',
    //   valueType: 'indexBorder',
    //   width: 48,
    // },
    {
      title: '操作记录',
      width: 100,
      dataIndex: 'operateStatus',
      // fixed: 'left',
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
      title: '操作记录',
      dataIndex: 'operateStatus',
      initialValue: 'all',
      filters: true,
      onFilter: true,
      // hideInSearch:true, // 查询表单中不展示此项
      hideInTable: true, // 在查询表格不显示
      valueType: 'select',
      valueEnum: {
        all: { text: '全部', status: 'Default' },
        addGratis: { text: '新增免费房屋', status: 'Default' },
        addUnderway: { text: '新增出租房屋', status: 'Processing' },
        addIdle: { text: '新增闲置房屋', status: 'Success' },
        surrender: { text: '退租', status: 'Error' },
        rentOut: { text: '出租', status: 'Error' },
        relet: { text: '合同续约(续租)', status: 'Error' },
        payment: { text: '缴费(续费)', status: 'Error' },
        alterInfo: { text: '修改信息', status: 'Error' },
      },
    },

    {
      title: '操作人',
      dataIndex: 'creator',
      fixed: 'left',
      width: 80,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      fixed: 'left',
      width: 150,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
      valueType: 'dateTime',
    },
    {
      title: '批次流水',
      width: 90,
      dataIndex: 'uidSeq',
      copyable: true, //是否支持复制
      ellipsis: true, //标题过长会自动收缩
      hideInSearch: false, // 查询表单中不展示此项
      fixed: 'left',
      tip: '同一批次表示出租至退租的所有操作记录',
    },
    {
      title: '租赁门牌号',
      width: 170,
      dataIndex: 'leaseFullName',
      // copyable: true, //是否支持复制
      ellipsis: true, //标题过长会自动收缩
      hideInSearch: true,
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
      title: '租赁状态',
      width: 80,
      dataIndex: 'leaseStatus',
      // fixed: 'left',
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
      title: '承租人',
      dataIndex: 'userName',
      width: 80,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '承租人联系方式',
      dataIndex: 'phone',
      width: 100,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '押金单号',
      dataIndex: 'cashPledgeNum',
      width: 80,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '押金金额',
      width: 80,
      dataIndex: 'cashPledgeMoney',
      valueType: 'money',
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },

    {
      title: '平方米',
      dataIndex: 'squareMeter',
      width: 100,
      hideInSearch: true, // 查询表单中不展示此项
      render: (_: any) => {
        return <span> {`${_}m\u00b2`}</span>;
      },
    },
    {
      title: '每平方米单价',
      valueType: 'money',
      dataIndex: 'squareMeterPrice',
      width: 100,
      hideInSearch: true, // 查询表单中不展示此项
    },
    {
      title: '起租时间',
      dataIndex: 'onHireDate',
      width: 100,
      key: 'since',
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
      valueType: 'date',
    },
    {
      title: '合同编号',
      dataIndex: 'contractNum',
      width: 100,
      hideInSearch: true, // 查询表单中不展示此项
    },
    {
      title: '合同时间',
      key: 'contractDate',
      dataIndex: 'contractDate',
      width: 100,
      hideInSearch: true, // 查询表单中不展示此项
      valueType: 'dateRange',
    },
    {
      title: '缴费时间',
      dataIndex: 'paymentDate',
      width: 100,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
      valueType: 'dateRange',
    },
    {
      title: '缴费时间间隔',
      dataIndex: 'payCostDate',
      width: 80,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '租金/月',
      dataIndex: 'rent',
      valueType: 'money',
      tip: '面积 * 平方米单价 * 0.68',
      width: 90,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '卫生费',
      dataIndex: 'sanitationCost',
      valueType: 'money',
      width: 80,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '物业费',
      dataIndex: 'property',
      valueType: 'money',
      tip: '面积 * 平方米单价 * 0.32',
      width: 80,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '间数',
      dataIndex: 'spaceNum',
      width: 80,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '本次应收金额',
      dataIndex: 'thisAccountReceivable',
      valueType: 'money',
      width: 100,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '本次实收金额',
      dataIndex: 'thisMoneyReceivable',
      valueType: 'money',
      width: 100,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },

    {
      title: '合同总应收款',
      dataIndex: 'accountReceivable',
      valueType: 'money',
      tip: '(月租+卫生费)*合同月数',
      width: 100,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '免租金额',
      dataIndex: 'amountOfFree',
      valueType: 'money',
      width: 100,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '总实收金额',
      dataIndex: 'moneyReceivable',
      valueType: 'money',
      width: 100,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },

    {
      title: '缴费方式',
      width: 80,
      dataIndex: 'paymentMethod',
      hideInSearch: true, // 查询表单中不展示此项
      valueEnum: {
        xj: { text: '现金' },
        yh: { text: '银行' },
      },
    },
    {
      title: '收款账号',
      width: 80,
      dataIndex: 'shroffAccount',
      ellipsis: true, //标题过长会自动收缩
      hideInSearch: true, // 查询表单中不展示此项
    },
    {
      title: '是否开票',
      width: 80,
      dataIndex: 'invoice',
      hideInSearch: true, // 查询表单中不展示此项
      valueEnum: {
        true: { text: '需要开票' },
        false: { text: '不开票' },
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 80,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
  ];
  const menu = (
    <Menu>
      <Menu.Item key="1">导出excel文件</Menu.Item>
      {/* <Menu.Item key="2">2nd item</Menu.Item> */}
      {/* <Menu.Item key="3">3rd item</Menu.Item> */}
    </Menu>
  );

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
          const res = await getLeaseResult({ ...params, sorter, filter });
          console.log('测试查询结果：', res.data);
          setrequeTotal(res.data.total);
          setGlobalDict({...globalDict, totalSpaceNum:res.data.totalSpaceNum})
          return {
            success: true,
            data: res.data.items,
          };
        }}
        editable={{
          type: 'multiple',
        }}
        scroll={{ x: 2900 }}
        columnsState={{
          persistenceKey: 'pro-table-singe-demos',
          persistenceType: 'localStorage',
        }}
        rowKey="key"
        search={{
          labelWidth: 'auto',
          collapseRender: false,
          defaultCollapsed: false,
          // span:3,
        }}
        // search={false}
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
          // pageSize: 10,
          defaultPageSize: 10,
          showQuickJumper: true,
          total: requeTotal,
        }}
        dateFormatter="string"
        headerTitle="租赁概要查询--全部区域"
        toolBarRender={() => [
          <Tag>总间数:{globalDict.totalSpaceNum}</Tag>,
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setVisible(true)}
          >
            新录入租赁信息
          </Button>,
          // 租赁概要的excel导出
          // <But345rton
          //   type="primary"
          //   icon={<DownloadOutlined />}
          //   loading={Downloadstate}
          //   onClick={() => setExcelModalVisible(true)}
          // >
          //   导出excel
          // </Button>,
          <ModalForm<{
            name: string;
            company: string;
          }>
            title="导出excel--条件过滤"
            trigger={
              <Button type="primary">
                <DownloadOutlined />
                导出excel
              </Button>
            }

            form={excelFormRef}
            autoFocusFirstInput
            modalProps={{
              destroyOnClose: true,
              // onCancel: () => console.log('run'),
              okText: "导出excel"
            }}
            submitTimeout={2000}
            onFinish={async (values) => {
              await downRequest.run({ ...excelFormRef.getFieldsValue() });
              console.log(values.name);
              message.success('提交成功');
              return true;
            }}
          >
            <ProFormTreeSelect
              name="region"
              initialValue={['all']}
              label="区域分类"
              width='md'
              request={async () => [{
                title: '不限',
                value: 'all',
                key: 'all',
                children: [
                  {
                    title: '东区',
                    value: 1,
                    key: 1,
                  },
                  {
                    title: '西区',
                    value: 2,
                    key: 2,
                  },
                  {
                    title: "南区",
                    value: 3,
                    key: 3,
                  },
                ],
              },]}
              fieldProps={{
                fieldNames: {
                  label: 'title',
                },
                treeCheckable: true,
                treeDefaultExpandAll: true,
                showCheckedStrategy: TreeSelect.SHOW_PARENT,
                placeholder: 'Please select',
              }}
            />
            <ProFormTreeSelect
              name="expireStatus"
              initialValue={['all']}
              label="到租状态"
              width='md'
              request={async () => [{
                title: '不限',
                value: 'all',
                key: 'all',
                children: [
                  {
                    title: '合同快到期',
                    value: "contractPredict",
                    key: "contractPredict",
                  },
                  {
                    title: '合同已逾期',
                    value: 'contractOverdue',
                    key: 'contractOverdue',
                  },
                  {
                    title: "缴费快到期",
                    value: 'payPredict',
                    key: 'payPredict',
                  },
                  {
                    title: "缴费已逾期",
                    value: 'payOverdue',
                    key: 'payOverdue',
                  },

                  {
                    title: "合同及缴费未到期",
                    value: 'null',
                    key: 'null',
                  },
                ],
              },]}
              fieldProps={{
                fieldNames: {
                  label: 'title',
                },
                treeCheckable: true,
                treeDefaultExpandAll: true,
                showCheckedStrategy: TreeSelect.SHOW_PARENT,
                placeholder: 'Please select',
              }}
            />
          </ModalForm>
          // <Dropdown key="menu" overlay={menu}>
          //   <Button>
          //     <EllipsisOutlined />
          //   </Button>
          // </Dropdown>,
        ]}
      />
      {/* 新建功能分步表单 */}
      <StepsForm
        onFinish={async (values) => {
          console.log('提交的所有数据', values);

          // 新增租赁接口
          try {
            console.log('发送参数', fromData);
            const res = await addLeaseResult(fromData);
            console.log('请求结束', res);
            console.log(formRef2.getFieldsValue());

            if (res.resSuccess) {
              message.success('租赁数据新建成功');
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
              title={<a onClick={() => { windowsOpen("addHouse") }}>新建租赁信息---[点击可查看功能说明]</a>}
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
          name="base"
          title="确定房屋类型"
          form={formRef1}
          onFinish={async () => {
            console.log('这是第一步', formRef1.getFieldsValue());
            const request_data = formRef1.getFieldsValue();
            // const res = await getLeaseResult({...fromData, ...formRef.current?.getFieldsValue(), leaseFullName:"改变前"})
            // 查询接口
            try {
              const res = await flag_house_number({
                region: request_data.region ? request_data.region : null,
                ridgepoleNum: request_data.ridgepoleNum ? request_data.ridgepoleNum : null,
                className: request_data.className ? request_data.className : null,
                houseNum: request_data.houseNum ? request_data.houseNum : null,
              });
              console.log('请求结束', res);
              console.log(formRef1.getFieldsValue());

              if (res.resSuccess && res.data.selectFlag == false) {
                setFromData({
                  ...fromData,
                  ...formRef1.getFieldsValue(),
                  leaseFullName: res.data.leaseFullName,
                });
                console.log(fromData);
                return true;
              } else if (res.resSuccess && res.data.selectFlag) {
                notification.error({
                  message: `当前租赁信息[${res.data.leaseFullName}]已存在`,
                  description: `当前租赁信息[${res.data.leaseFullName}]已存在,无需进行新建操作`,
                });
                message.error(`当前租赁信息[${res.data.leaseFullName}]已存在,无需进行新建操作`);
                return false;
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
        >
          <ProFormSelect
            label="租赁状态"
            name="leaseStatus"
            rules={[
              {
                required: true,
              },
            ]}
            width="md"
            initialValue="underway"
            options={[
              {
                value: 'underway',
                label: '租赁中',
              },
              { value: 'gratis', label: '免费' },
              { value: 'idle', label: '闲置' },
              { value: 'temporary', label: '临时', disabled:true },
            ]}
          />
          <ProFormSelect
            label="区域"
            name="region"
            rules={[
              {
                required: true,
              },
            ]}
            width="md"
            initialValue="1"
            options={[
              {
                value: '1',
                label: '东区',
              },
              { value: '2', label: '西区' },
              { value: '3', label: '南区' },
            ]}
          />
           <ProFormSelect
            label="房屋分类"
            name="className"
            rules={[
              {
                required: true,
              },
            ]}
            width="md"
            initialValue="1"
            options={[
              {
                value: '1',
                label: '铺面',
              },
              { value: '2', label: '仓库' },
              { value: '3', label: '房屋' },
            ]}
          />
          <ProFormDigit
            name="ridgepoleNum"
            width="xl"
            label="栋号"
            placeholder="例如【东区-1栋铺面103号】 则 栋号填 1 若无栋号则填0"
            tooltip="如【东区-1栋铺面103号】 则 栋号填 1,  若无栋号则填0, 例如【加油站】"
            rules={[{ required: true }]}
          />

          <ProFormText
            name="houseNum"
            width="xl"
            label="门牌号"
            placeholder="例如【东区-1栋铺面103号】 则填 103"
            tooltip = "例如【东区-1栋铺面103号】 则填 103"
            rules={[{ required: true }]}
          />
          <ProFormText
            name="houseNumBak"
            width="xl"
            label="门牌号备注"
            placeholder="例如：东区-2栋铺面104号(含三楼301至312号房) 则填 含三楼301至312号房"
            tooltip = "例如：东区-2栋铺面104号(含三楼301至312号房) 则填 含三楼301至312号房"
            rules={[{ required: false }]}
          />
        </StepsForm.StepForm>
        <StepsForm.StepForm
          layout="vertical"
          name="checkbox"
          title="录入租赁信息"
          form={formRef2}
          onFinish={async () => {
            console.log('这是第二步');
            console.log(formRef2.getFieldsValue());

            const getFieldsValue = formRef2.getFieldsValue();

            // 将合约日期跟缴费日期 起租时间格式化
            const request_post = {
              ...formRef2.getFieldsValue(),
              accountReceivable: sum_amount(
                getFieldsValue.contractDate,
                getFieldsValue.rent,
                getFieldsValue.sanitationCost,
                getFieldsValue.property,

              ), // 合同应收款金额
              thisAccountReceivable: sum_amount(
                getFieldsValue.paymentDate,
                getFieldsValue.rent,
                getFieldsValue.sanitationCost,
                getFieldsValue.property,
              ), // 合同应收款金额
              paymentDate: getFieldsValue.paymentDate
                ? [
                  getFieldsValue.paymentDate[0].format('YYYY-MM-DD'),
                  getFieldsValue.paymentDate[1].format('YYYY-MM-DD'),
                ]
                : undefined,
              contractDate: getFieldsValue.contractDate
                ? [
                  getFieldsValue.contractDate[0].format('YYYY-MM-DD'),
                  getFieldsValue.contractDate[1].format('YYYY-MM-DD'),
                ]
                : undefined,
              onHireDate: getFieldsValue.onHireDate
                ? getFieldsValue.onHireDate.format('YYYY-MM-DD')
                : undefined,
            };
            console.log('合同时间', getFieldsValue.onHireDate);
            console.log(
              '第二步->计算应收款',
              sum_amount(
                getFieldsValue.onHireDate,
                getFieldsValue.rent,
                getFieldsValue.sanitationCost,
                getFieldsValue.property,
              ),
            );
            setFromData({
              ...fromData,
              ...request_post,
            });
            console.log('第二步变量值', {
              ...fromData,
              ...request_post,
            });
            return true;
          }}
        >
          {console.log('准备跳转到第二步', fromData.leaseStatus)}
          <ProForm.Group title={fromData.leaseFullName}>
            {(fromData.leaseStatus == 'underway' || fromData.leaseStatus == 'gratis') && (
              <>
                <ProFormText
                  width="xs"
                  name="userName"
                  label="承租人"
                  rules={[{ required: true }]}
                />
                <ProFormText
                  width="lg"
                  name="phone"
                  label="承租人联系电话"
                  rules={[{ required: true }]}
                />
                <ProFormSegmented
                  name="invoice"
                  label="是否开票"
                  initialValue={true}
                  request={async () => [
                    { label: '需要开票', value: true },
                    { label: '不开票', value: false },
                  ]}
                  rules={[{ required: true }]}
                />
              </>
            )}
            <ProFormText
              width="xs"
              name="squareMeter"
              label="平方米"
              fieldProps={{
                suffix: 'm\u00b2',
                onChange: (e) => updateRent(e, "newCreate")
              }}
            />
            <ProFormMoney width="sm" label="平方米/元" name="squareMeterPrice" locale="zh-CN"
              fieldProps={{
                onChange: (e) => updateRent(e, "newCreate")
              }}
            />
            {fromData.leaseStatus == 'underway' && (
              <>
                <ProFormText width="sm" name="cashPledgeNum" label="押金单号" />
                <ProFormMoney width="sm" label="押金金额" name="cashPledgeMoney" locale="zh-CN" />
              </>
            )}



            {(fromData.leaseStatus == 'underway' || fromData.leaseStatus == 'gratis') && (
              <>
                <ProFormDatePicker
                  name="onHireDate"
                  label="起租时间"
                  width="sm"
                  fieldProps={{ showToday: true }}
                  rules={[{ required: true }]}
                />
              </>
            )}

            {fromData.leaseStatus == 'underway' && (
              <>
                <ProFormText width="sm" name="contractNum" label="合同编号" />
                <ProFormDateRangePicker
                  width="md"
                  name="contractDate"
                  label="合同时间"
                  rules={[{ required: true }]}
                  fieldProps={{
                    ranges: {
                      三个月: [
                        contractDate ? contractDate : moment(),
                        contractDate ? moment(contractDate).add(3, 'M') : moment().add(3, 'M'),
                      ],
                      半年: [
                        contractDate ? contractDate : moment(),
                        contractDate ? moment(contractDate).add(6, 'M') : moment().add(6, 'M'),
                      ],
                      一年: [
                        contractDate ? contractDate : moment(),
                        contractDate ? moment(contractDate).add(12, 'M') : moment().add(12, 'M'),
                      ],
                      二年: [
                        contractDate ? contractDate : moment(),
                        contractDate ? moment(contractDate).add(24, 'M') : moment().add(24, 'M'),
                      ],
                    },
                    onCalendarChange: disableContracdDate, //每次改变触发
                  }}
                />
                <ProFormDateRangePicker
                  width="md"
                  name="paymentDate"
                  label="缴费时间"
                  // rules={[{ required: true }]}
                  fieldProps={{
                    ranges: {
                      三个月: [
                        paymentDate ? paymentDate : moment(),
                        paymentDate ? moment(paymentDate).add(3, 'M') : moment().add(3, 'M'),
                      ],
                      半年: [
                        paymentDate ? paymentDate : moment(),
                        paymentDate ? moment(paymentDate).add(6, 'M') : moment().add(6, 'M'),
                      ],
                      一年: [
                        paymentDate ? paymentDate : moment(),
                        paymentDate ? moment(paymentDate).add(12, 'M') : moment().add(12, 'M'),
                      ],
                    },
                    onCalendarChange: disabledDate, //每次改变触发
                  }}
                  // 必输项模板
                  rules={[{ required: true, message: "这是必填项" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      console.log('自定义校验')
                      console.log('getFieldValue:', getFieldValue('contractDate'))
                      const contractDate = getFieldValue('contractDate')
                      if (!(contractDate instanceof Array)) {
                        return Promise.reject(new Error('合同日期必须先输入'))
                      }
                      if (value) {
                        if ((moment(value[0].format()) < moment(contractDate[0].format()) || moment(value[1].format()) > moment(contractDate[1].format()))) {
                          return Promise.reject(new Error('缴费时间区间必须在合同时间区间内'))
                        }
                      } else {
                        return Promise.reject(new Error('缴费时间为必输项'))
                      }
                      // // 自定义校验
                      return Promise.resolve()  // 校验通过
                      // return Promise.reject(new Error('校验不通过'))
                    }
                  })
                  ]}
                />
                <ProFormText width="md" name="payCostDate" label="缴费时间间隔" />
              </>
            )}

            <ProFormMoney
              width="sm"
              label="租金/月"
              tooltip="面积 * 平方米单价  可以删掉重填"
              name="rent"
              locale="zh-CN"
              min={0}
              rules={[{ required: fromData.leaseStatus == 'underway' ? true : false }]}
            />
            <ProFormMoney
              width="sm"
              label="卫生费"
              name="sanitationCost"
              locale="zh-CN"
              initialValue={0}
              min={0}
              rules={[{ required: fromData.leaseStatus == 'underway' ? true : false }]}
            />

            <ProFormMoney
              width="sm"
              label="管理费"

              name="property"
              locale="zh-CN"
              initialValue={0}
              min={0}
              rules={[{ required: fromData.leaseStatus == 'underway' ? true : false }]}
            />

            {fromData.leaseStatus == 'underway' && (
              <>
                <ProFormMoney width="xs" label="免租金额" name="amountOfFree" locale="zh-CN" />
              </>
            )}

            <ProFormDigit width="xs" label="间数" name="spaceNum" initialValue={1} />

            {fromData.leaseStatus == 'underway' && (
              <>
                <ProFormDependency name={['rent', 'contractDate', 'sanitationCost', 'property']}>
                  {({ rent, contractDate, sanitationCost, property }) => {
                    console.log('合同日期', contractDate);
                    console.log('rent', rent);
                    console.log('sanitationCost', sanitationCost);

                    var values = 0;
                    values = sum_amount(contractDate, rent, sanitationCost, property);
                    console.log('应收款:', values);
                    // formRef2?.current?.setFieldsValue({
                    //   accountReceivable: values,
                    // });
                    return (
                      <ProFormMoney
                        width="xs"
                        label={`合同总应收款`}
                        name="accountReceivable"
                        tooltip="合同总应收款=(租金+卫生费)*合同月数"
                        locale="zh-CN"
                        disabled
                        fieldProps={{ value: values, style: { color: 'red' }, readOnly: false }}
                      />
                    );
                  }}
                </ProFormDependency>
                <ProFormDependency name={['rent', 'contractDate', 'sanitationCost', 'paymentDate', 'property']}>
                  {({ rent, sanitationCost, paymentDate, property }) => {
                    console.log('合同日期', contractDate);
                    console.log('rent', rent);
                    console.log('sanitationCost', sanitationCost);

                    var payValues = 0;
                    payValues = sum_amount(paymentDate, rent, sanitationCost, property);
                    // formRef2?.current?.setFieldsValue({
                    //   accountReceivable: values,
                    // });
                    return (
                      <ProFormMoney
                        width="xs"
                        label={`缴费期建议应收款`}
                        name="thisAccountReceivable"
                        tooltip="缴费期内应收金额=(租金+卫生费)*缴费月数"
                        locale="zh-CN"
                        disabled
                        min={0}
                        fieldProps={{ value: payValues, style: { color: 'red' }, readOnly: false }}
                      />
                    );
                  }}

                </ProFormDependency>
                <ProFormMoney width="sm" label="实收款金额" name="moneyReceivable" locale="zh-CN" min={0} rules={[{ required: true }]} />
                <ProFormSegmented
                  name="paymentMethod"
                  label="缴费方式"
                  initialValue={'xj'}
                  valueEnum={{
                    xj: '现金',
                    yh: '银行',
                  }}
                  fieldProps={{
                    // onChange: (values) => {setFromData({...fromData, paymentMethod: values})}
                    onChange: (values) => { setFromData({ ...fromData, paymentMethod: values }) }

                  }}

                />
                {fromData.paymentMethod == 'yh' && (<>

                  <Space.Compact block>
                  <ProFormText width="xl" name="shroffAccount" label="收款账号" />
                    <Form.Item label=" ">
                      <Button type="primary">添加收款账号[开发中]</Button>
                    </Form.Item>
                  </Space.Compact>
                </>)}
              </>
            )}
            <ProFormText width="xl" name="remark" label="备注" />
          </ProForm.Group>
        </StepsForm.StepForm>
        <StepsForm.StepForm name="time" title="确定新录入租赁信息">
          <ProDescriptions
            column={2}
            title={fromData.leaseFullName}
            tooltip="包含了从服务器请求，columns等功能"
          >
            <ProDescriptions.Item span={1} label="租赁门牌信息">
              {fromData.leaseFullName}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label="租赁状态"
              valueEnum={{
                all: { text: '全部', status: 'Default' },
                underway: {
                  text: '租赁中',
                  status: 'Error',
                },
                temporary: {
                  text: '临时',
                  status: 'Success',
                },
                gratis: {
                  text: '免费',
                  status: 'Success',
                },
                idle: {
                  text: '闲置',
                  status: 'Processing',
                },
              }}
            >
              {console.log('第三步信息', fromData)}
              {fromData.leaseStatus}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={1} label="承租人姓名">
              {fromData.userName}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={1} label="承租人手机号码">
              {fromData.phone}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={1} label="押金单号" valueType="text">
              {fromData.cashPledgeNum}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="押金金额" valueType="money">
              {fromData.cashPledgeMoney}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              span={1}
              label="平方米"
              valueType="text"
              fieldProps={{ suffix: 'm\u00b2' }}
            >
              {fromData.squareMeter}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="平方米/元" valueType="money">
              {fromData.squareMeterPrice}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="起租时间" span={2} valueType="date">
              {fromData.onHireDate}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={1} label="合同编号">
              {fromData.contractNum}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="合同时间" valueType="dateRange">
              {fromData.contractDate}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={1} label="缴费时间间隔">
              {fromData.payCostDate}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="缴费时间" valueType="dateRange">
              {fromData.paymentDate}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="租金/月" valueType="money">
              {fromData.rent}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="卫生费" valueType="money">
              {fromData.sanitationCost}
            </ProDescriptions.Item>

            <ProDescriptions.Item label="免租金额" valueType="money">
              {fromData.amountOfFree}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={1} label="间数">
              {fromData.spaceNum}
            </ProDescriptions.Item>

            <ProDescriptions.Item label="合同总应收款" valueType="money">
              {fromData.accountReceivable}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="缴费应收款" valueType="money">
              {fromData.thisAccountReceivable}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="实收金额" valueType="money">
              {fromData.moneyReceivable}
            </ProDescriptions.Item>

            <ProDescriptions.Item span={2} label="递增">
              {fromData.ascending}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={2} label="备注">
              {fromData.remark}
            </ProDescriptions.Item>
          </ProDescriptions>
        </StepsForm.StepForm>
      </StepsForm>
      {/* 合同续约功能分步表单 */}
      <StepsForm
        onFinish={async (values) => {
          console.log('提交的所有数据', values);
          try {
            console.log('发送参数', reletFromData);

            const res = await reletLeaseResult(reletFromData);
            console.log('请求结束', res);

            if (res.resSuccess) {
              message.success('续租成功');
              // 初始化参数
              reset_init_data();
              // 刷新数据
              actionRef.current?.reload();
              actionHistoryRef.current?.reload();
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
            console.log('续租操作中接口异常抛出', error);
            notification.error({
              message: '通讯异常',
              description: '与客户端通讯链接异常',
            });
            message.error('与客户端连接异常');
            Modal.error({
              title: '续租失败',
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
              // title="续租(合同续约)"
              title={<a onClick={() => { windowsOpen("relet") }}>续租(合同续约)---[点击可查看功能说明]</a>}
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
        <StepsForm.StepForm
          name="base"
          title="确定续租(合同续约)参数"
          form={reletFormRef}
          onFinish={async () => {
            try {
              const getFieldsValue = reletFormRef.getFieldsValue();
              console.log('这是第一步', reletFormRef.getFieldsValue());
              // const res = await getLeaseResult({...fromData, ...formRef.current?.getFieldsValue(), leaseFullName:"改变前"})
              // 校验合同日期是否正常
              console.log(reletFormRef.getFieldsValue()['contractDate']);
              if (
                !reletFormRef.getFieldsValue().contractDate ||
                !(reletFormRef.getFieldsValue().contractDate instanceof Array)
              ) {
                message.error('合同日期是必输项');
                return false;
              } else if (reletFormRef.getFieldsValue().contractDate.includes(null)) {
                message.error('合同日期是必输项');
                return false;
                // 校验应收款是否正常
              } else if (get_month_num_format(reletFormRef.getFieldsValue().contractDate) == 0) {
                message.error('应收款金额异常,可能合同日期不满一个月');
                return false;
              }
              // 缴费应收款
              var thisValues = 0
              if (reletFromData.paymentDateUpdate) {
                var thisValues = sum_amount(reletFormRef.getFieldsValue().paymentDate, reletFormRef.getFieldsValue().rent, reletFormRef.getFieldsValue().sanitationCost, reletFormRef.getFieldsValue().property);
              } else {
                var thisValues = 0
              }
              setReletFromData({
                ...reletFromData,
                ...reletFormRef.getFieldsValue(),
                accountReceivable: sum_amount(
                  reletFormRef.getFieldsValue().contractDate,
                  reletFormRef.getFieldsValue().rent,
                  reletFormRef.getFieldsValue().sanitationCost,
                  reletFormRef.getFieldsValue().property,

                ), // 应收款金额
                // 合同日期格式化
                contractDate: getFieldsValue.contractDate
                  ? [
                    getFieldsValue.contractDate[0].format('YYYY-MM-DD'),
                    getFieldsValue.contractDate[1].format('YYYY-MM-DD'),
                  ]
                  : undefined,
                paymentDate: getFieldsValue.paymentDate ? [getFieldsValue.paymentDate[0] instanceof moment ? getFieldsValue.paymentDate[0].format('YYYY-MM-DD') : getFieldsValue.paymentDate[0],
                getFieldsValue.paymentDate[1] instanceof moment ? getFieldsValue.paymentDate[1].format('YYYY-MM-DD') : getFieldsValue.paymentDate[1],] : undefined,
                thisAccountReceivable: thisValues,
              });
              return true;

            } catch (error) {
              console.log(error)
              message.error("异常抛出");
              return false
            }
          }}
        >
          <ProForm.Group title={reletFromData.leaseFullName}>
            <ProFormText width="lg" name="contractNum" key="contractNum" label="合同编号" />
            <ProFormText width="md" name="cashPledgeNum" label="押金单号" placeholder="不填则还是原来的押金单号" />
            <ProFormMoney width="md" label="押金金额" min={0} name="cashPledgeMoney" locale="zh-CN" placeholder="不填则还是原来的押金金额" />
            <ProFormDateRangePicker
              width="md"
              name="originContractDate"
              disabled
              label="原合同时间"
              rules={[{ required: true }]}
            />
            <ProFormDateRangePicker
              name="contractDate"
              label="新合同时间(续约)"
              width="md"
              fieldProps={{
                disabled: [true, false],
                ranges: {
                  三个月: [
                    reletFromData.contractDate[0] ? reletFromData.contractDate[0] : null,
                    reletFromData.contractDate[0]
                      ? moment(reletFromData.contractDate[0]).add(3, 'M')
                      : null,
                  ],
                  半年: [
                    reletFromData.contractDate[0] ? reletFromData.contractDate[0] : null,
                    reletFromData.contractDate[0]
                      ? moment(reletFromData.contractDate[0]).add(6, 'M')
                      : null,
                  ],
                  一年: [
                    reletFromData.contractDate[0] ? reletFromData.contractDate[0] : null,
                    reletFromData.contractDate[0]
                      ? moment(reletFromData.contractDate[0]).add(12, 'M')
                      : null,
                  ],
                  两年: [
                    reletFromData.contractDate[0] ? reletFromData.contractDate[0] : null,
                    reletFromData.contractDate[0]
                      ? moment(reletFromData.contractDate[0]).add(24, 'M')
                      : null,
                  ],
                },
              }}
              rules={[{ required: true }]}
            />
            {/* <ProFormDateRangePicker
              width="md"
              name="paymentDate"
              label="缴费时间"
              fieldProps={{
                ranges: {
                  原缴费时间: [moment(reletFromData.originPaymentDate[0]), moment(reletFromData.originPaymentDate[1])],
                  三个月: [
                    paymentDate ? paymentDate : paymentEndDate,
                    paymentDate
                      ? moment(paymentDate).add(3, 'M')
                      : moment(paymentEndDate).add(3, 'M'),
                  ],
                  半年: [
                    paymentDate ? paymentDate : paymentEndDate,
                    paymentDate
                      ? moment(paymentDate).add(6, 'M')
                      : moment(paymentEndDate).add(6, 'M'),
                  ],
                  一年: [
                    paymentDate ? paymentDate : paymentEndDate,
                    paymentDate
                      ? moment(paymentDate).add(12, 'M')
                      : moment(paymentEndDate).add(12, 'M'),
                  ],
                },
                onCalendarChange: (current: any) => {
                  setPaymentDate(current ? current[0] : null);
                  console.log(current);
                  console.log(get_month_num_format(current));
                  const month_num = get_month_num_format(current);
                  var month_num_format = '0个月';
                  if (month_num == 6) {
                    month_num_format = '半年';
                  } else if (month_num == 12) {
                    month_num_format = '一年';
                  } else if (month_num == 24) {
                    month_num_format = '二年';
                  } else {
                    month_num_format = `${month_num}个月`;
                  }
                  reletFormRef.setFieldsValue({
                    payCostDate: month_num_format,
                  });
                  const originPaymentDate = reletFromData.originPaymentDate // 原缴费日期
                  // 校验新缴费时间是否与原缴费时间不一致
                  if (current instanceof Array) {
                    if ((originPaymentDate[0] != (current[0] instanceof moment ? current[0].format("YYYY-MM-DD") : current[0])) || (originPaymentDate[1] != (current[1] instanceof moment ? current[1].format("YYYY-MM-DD") : current[1]))) {
                      setReletFromData({ ...reletFromData, paymentDateUpdate: true })
                    } else {
                      setReletFromData({ ...reletFromData, paymentDateUpdate: false })
                    }
                  }
                }, //每次改变触发
              }}
              // 必输项模板
              rules={[{ required: true, message: "这是必填项" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  console.log('自定义校验')
                  console.log('getFieldValue:', getFieldValue('contractDate'))
                  const contractDate = getFieldValue('contractDate')
                  const originContractDate = getFieldValue('originContractDate') // 原合同时间
                  const originPaymentDate = reletFromData.originPaymentDate // 原缴费日期
                  if (!((contractDate instanceof Array) && contractDate[1])) {
                    return Promise.reject(new Error('新合同日期必须先输入'))
                  }
                  if (value) {
                    if ((moment(value[0] instanceof moment ? value[0].format() : value[0]) < moment(originContractDate[0]) || moment(value[1] instanceof moment ? value[1].format() : value[1]) > moment(contractDate[1].format()))) {
                      return Promise.reject(new Error(`必须在合同时间区间内:${originContractDate[0]}~${contractDate[1].format()}`))
                    }
                    if ((originPaymentDate[0] != (value[0] instanceof moment ? value[0].format("YYYY-MM-DD") : value[0])) || (originPaymentDate[1] != (value[1] instanceof moment ? value[1].format("YYYY-MM-DD") : value[1]))) {
                      if ((value[0] instanceof moment ? value[0].format('YYYY-MM-DD') : value[0]) != originPaymentDate[1]) {
                        return Promise.reject(new Error(`缴费区间发生变化后, 起始时间只能是${originPaymentDate[1]}, 如需恢复原缴费时间,请点击时间框里原缴费时间`))
                      }
                    }
                  } else {
                    return Promise.reject(new Error('缴费时间为必输项'))
                  }
                  // // 自定义校验
                  return Promise.resolve() // 校验通过
                  // return Promise.reject(new Error('校验不通过'))
                }
              })
              ]}
            />
            <ProFormText width="md" name="payCostDate" key="contractNum" label="缴费时间间隔" /> */}
            <ProFormDigit width="md" label="递增" name="asc" initialValue={0}
              fieldProps={{
                formatter: value => `${value}%`,
                parser: value => value!.replace('%', ''),
                onChange: (e) => ascUpdateRent(e, "relet")
              }}

            />
            <ProFormRadio.Group
              width="md"
              name="ascType"
              label="递增类型"
              initialValue={'yz'}
              fieldProps={{
                onChange: (e) => ascUpdateRent(e, "relet")
              }}
              options={[
                {
                  label: '只递增-月租',
                  value: 'yz',
                },
                {
                  label: '递增月租+物业费',
                  value: 'yzwy',
                },
                {
                  label: '递增月租+卫生费+物业费',
                  value: 'yzwswy',
                },
              ]}
            />
            <ProFormMoney width="md" label="租金/月" min={0} name="rent" locale="zh-CN" rules={[{ required: true }]} />
            <ProFormMoney width="md" label="卫生费" min={0} name="sanitationCost" locale="zh-CN" rules={[{ required: true }]} />
            <ProFormMoney width="md" label="物业费" min={0} name="property" locale="zh-CN" rules={[{ required: true }]} />
            <ProFormMoney
              width="md"
              label="免租金额"
              name="amountOfFree"
              locale="zh-CN"
              min={0}
              initialValue={0}
            />
            <ProFormDependency name={['rent', 'contractDate', 'sanitationCost', 'property']}>
              {({ rent, contractDate, sanitationCost, property }) => {
                console.log('合同日期', contractDate);
                var values = 0;

                values = sum_amount(contractDate, rent, sanitationCost, property);
                // formRef2?.current?.setFieldsValue({
                //   accountReceivable: values,
                // });
                return (
                  <ProFormMoney
                    width="md"
                    label={`新增合同应收款 [(租金+卫生费)*合同月数]`}
                    name="accountReceivable"
                    locale="zh-CN"
                    disabled
                    fieldProps={{ value: values, style: { color: 'red' }, readOnly: false }}

                  />
                );
              }}
            </ProFormDependency>
            {/* <ProFormMoney width="md" label="实收款金额" min={0} name="moneyReceivable" locale="zh-CN" initialValue={0} rules={[{ required: true }]} /> */}
            {/* <ProFormDependency name={['rent', 'paymentDate', 'sanitationCost', 'property']}>
              {({ rent, paymentDate, sanitationCost, property}) => {
                var values = 0;
                if (reletFromData.paymentDateUpdate) {
                  values = sum_amount(paymentDate, rent, sanitationCost, property);
                } else {
                  var values = 0;
                }
                // formRef2?.current?.setFieldsValue({
                //   accountReceivable: values,
                // });
                return (
                  <ProFormMoney
                    width="md"
                    label={`缴费应收款 [(租金+卫生费)*缴费月数]`}
                    name="thisAccountReceivable"
                    locale="zh-CN"
                    min={0}
                    disabled
                    fieldProps={{ value: values, style: { color: 'red' }, readOnly: false }}

                  />
                );
              }}
            </ProFormDependency> */}
            <ProFormText width="lg" name="remark" label="备注" />
          </ProForm.Group>
        </StepsForm.StepForm>
        <StepsForm.StepForm name="time" title="确定续租信息">
          <ProDescriptions
            column={2}
            title={reletFromData.leaseFullName}
            tooltip="包含了从服务器请求，columns等功能"
          >
            <ProDescriptions.Item span={1} label="租赁门牌信息">
              {reletFromData.leaseFullName}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label="租赁状态"
              valueEnum={{
                all: { text: '全部', status: 'Default' },
                underway: {
                  text: '租赁中',
                  status: 'Error',
                },
                temporary: {
                  text: '临时',
                  status: 'Success',
                },
                gratis: {
                  text: '免费',
                  status: 'Success',
                },
                idle: {
                  text: '闲置',
                  status: 'Processing',
                },
              }}
            >
              {/* {console.log('第三步信息', fromData)} */}
              {reletFromData.leaseStatus}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={1} label="合同编号">
              {reletFromData.contractNum}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="合同时间" valueType="dateRange">
              {reletFromData.contractDate}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={1} label="缴费时间间隔">
              {reletFromData.payCostDate}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="缴费时间" valueType="dateRange">
              {reletFromData.paymentDate}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="递增" valueType="percent">
              {reletFromData.asc}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="递增类型" valueType="radioButton"
              request={async () => [
                { label: '只递增-月租', value: 'yz' },
                { label: '递增月租+卫生费', value: 'yzwsf' },
              ]}>
              {reletFromData.ascType}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="租金/月" valueType="money">
              {reletFromData.rent}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="卫生费" valueType="money">
              {reletFromData.sanitationCost}
            </ProDescriptions.Item>

            <ProDescriptions.Item label="免租金额" valueType="money">
              {reletFromData.amountOfFree}
            </ProDescriptions.Item>

            <ProDescriptions.Item label="新增合同总应收款" valueType="money">
              {reletFromData.accountReceivable}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="缴费应收款" valueType="money">
              {reletFromData.thisAccountReceivable}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="实收金额" valueType="money">
              {reletFromData.moneyReceivable}
            </ProDescriptions.Item>

            <ProDescriptions.Item span={2} label="递增">
              {reletFromData.ascending}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={2} label="备注">
              {reletFromData.remark}
            </ProDescriptions.Item>
          </ProDescriptions>
        </StepsForm.StepForm>
      </StepsForm>
      {/* 缴费(续费)功能分步表单 */}
      <StepsForm
        onFinish={async (values) => {
          console.log('提交的所有数据', values);
          try {
            console.log('发送参数', paymentFromData);
            // 清除缴费字典中的合同时间、合同应收款
            delete paymentFromData.contractDate
            delete paymentFromData.accountReceivable
            paymentDate
            const res = await paymentLeaseResult(paymentFromData);
            console.log('请求结束', res);
            if (res.resSuccess) {
              message.success('续租成功');
              // 初始化参数
              reset_init_data();
              // 刷新数据
              actionRef.current?.reload();
              actionHistoryRef.current?.reload();
              setPaymentVisible(false); // 关闭弹出框
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
            console.log('续费操作中接口异常抛出', error);
            notification.error({
              message: '通讯异常',
              description: '与客户端通讯链接异常',
            });
            message.error('与客户端连接异常');
            Modal.error({
              title: '续费失败',
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
              // title="缴费(续费)"
              title={<a onClick={() => { windowsOpen("payment") }}>缴费(续费)---[点击可查看功能说明]</a>} width={800}
              onCancel={() => setPaymentVisible(false)}
              visible={paymentVisible}
              footer={submitter}
              destroyOnClose
            >
              {/* <Button type="link">Link</Button> */}
              {dom}
            </Modal>
          );
        }}
      >
        <StepsForm.StepForm
          name="base"
          title="确定续费参数"
          form={paymentFormRef}
          onFinish={async () => {
            try {
              const getFieldsValue = paymentFormRef.getFieldsValue();
              console.log('这是第一步', paymentFormRef.getFieldsValue());
              // const res = await getLeaseResult({...fromData, ...formRef.current?.getFieldsValue(), leaseFullName:"改变前"})
              // 校验合同日期是否正常 (只有租赁中才需要校验 合同日期)
              console.log(paymentFormRef.getFieldsValue()['contractDate']);
              if (paymentFromData.leaseStatus == "underway"){
                if (
                  !paymentFormRef.getFieldsValue().contractDate ||
                  !(paymentFormRef.getFieldsValue().contractDate instanceof Array)
                ) {
                  message.error('合同日期是必输项1');
                  return false;
                } else if (paymentFormRef.getFieldsValue().contractDate.includes(null)) {
                  message.error('合同日期是必输项2');
                  return false;
                  // 校验应收款是否正常
                } else if (get_month_num_format(paymentFormRef.getFieldsValue().contractDate) == 0) {
                  message.error('应收款金额异常,可能合同日期不满一个月');
                  return false;
                }
              }

              // 缴费应收款
              var thisValues = 0
              if (paymentFromData.paymentDateUpdate) {
                var thisValues = sum_amount(paymentFormRef.getFieldsValue().paymentDate, paymentFormRef.getFieldsValue().rent, paymentFormRef.getFieldsValue().sanitationCost, paymentFormRef.getFieldsValue().property);
              } else {
                var thisValues = 0
              }
              setPaymentFromData({
                ...paymentFromData,
                ...paymentFormRef.getFieldsValue(),
                // 缴费日期格式化
                paymentDate: getFieldsValue.paymentDate ? [getFieldsValue.paymentDate[0] instanceof moment ? getFieldsValue.paymentDate[0].format('YYYY-MM-DD') : getFieldsValue.paymentDate[0],
                getFieldsValue.paymentDate[1] instanceof moment ? getFieldsValue.paymentDate[1].format('YYYY-MM-DD') : getFieldsValue.paymentDate[1],] : undefined,
                thisAccountReceivable: thisValues,
              });
              return true;

            } catch (error) {
              console.log(error)
              message.error("异常抛出");
              return false
            }
          }}
        >

          <ProForm.Group title={paymentFromData.leaseFullName}>
          {paymentFromData.leaseStatus == "underway" && (
            <>
                        <ProFormDateRangePicker
                        width="md"
                        name="contractDate"
                        disabled
                        label="合同时间"
                        rules={[{ required: true }]}
                      />
                      </>

          )}
            <ProFormDateRangePicker
            width="md"
            name="originPaymentDate"
            disabled
            label="上次缴费时间"
            rules={[{ required: false }]}
          />
            <ProFormDateRangePicker
              width="md"
              name="paymentDate"
              label="缴费时间"
              fieldProps={{
                ranges: {
                  原缴费时间: [moment(paymentFromData.originPaymentDate[0]), moment(paymentFromData.originPaymentDate[1])],
                  三个月: [
                    paymentDate ? paymentDate : paymentEndDate,
                    paymentDate
                      ? moment(paymentDate).add(3, 'M')
                      : moment(paymentEndDate).add(3, 'M'),
                  ],
                  半年: [
                    paymentDate ? paymentDate : paymentEndDate,
                    paymentDate
                      ? moment(paymentDate).add(6, 'M')
                      : moment(paymentEndDate).add(6, 'M'),
                  ],
                  一年: [
                    paymentDate ? paymentDate : paymentEndDate,
                    paymentDate
                      ? moment(paymentDate).add(12, 'M')
                      : moment(paymentEndDate).add(12, 'M'),
                  ],
                },
                onCalendarChange: (current: any) => {
                  setPaymentDate(current ? current[0] : null);
                  console.log(current);
                  console.log(get_month_num_format(current));
                  const month_num = get_month_num_format(current);
                  var month_num_format = '0个月';
                  if (month_num == 6) {
                    month_num_format = '半年';
                  } else if (month_num == 12) {
                    month_num_format = '一年';
                  } else if (month_num == 24) {
                    month_num_format = '二年';
                  } else {
                    month_num_format = `${month_num}个月`;
                  }
                  paymentFormRef.setFieldsValue({
                    payCostDate: month_num_format,
                  });
                  const originPaymentDate = paymentFromData.originPaymentDate // 原缴费日期
                  console.log("原缴费日期", originPaymentDate)
                  console.log("现缴费日期", current)
                  // 校验新缴费时间是否与原缴费时间不一致
                  if (current instanceof Array) {
                    if ((originPaymentDate[0] != (current[0] instanceof moment ? current[0].format("YYYY-MM-DD") : current[0])) || (originPaymentDate[1] != (current[1] instanceof moment ? current[1].format("YYYY-MM-DD") : current[1]))) {
                      setPaymentFromData({ ...paymentFromData, paymentDateUpdate: true })
                    } else {
                      setPaymentFromData({ ...paymentFromData, paymentDateUpdate: false })
                    }
                  }
                }, //每次改变触发
              }}
              // 必输项模板
              rules={[{ required: true, message: "这是必填项" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  console.log('自定义校验')
                  console.log('getFieldValue:', getFieldValue('contractDate'))
                  const contractDate = getFieldValue('contractDate')
                  const originContractDate = getFieldValue('originContractDate') // 原合同时间
                  const originPaymentDate = paymentFromData.originPaymentDate // 原缴费日期
                  const leaseStatus = paymentFromData.leaseStatus // 原缴费日期
                  // 租赁中需要校验新合同必须先输入
                  if (leaseStatus == "underway"){
                    if (!((contractDate instanceof Array) && contractDate[1])) {
                      return Promise.reject(new Error('新合同日期必须先输入'))
                    }
                  }

                  if (value) {
                    // 租赁中需要校验缴费周期在合同期内
                    if (leaseStatus == "underway"){
                      if ((moment(value[0] instanceof moment ? value[0].format() : value[0]) < moment(originContractDate[0]) || moment(value[1] instanceof moment ? value[1].format() : value[1]) > moment(contractDate[1].format()))) {
                        return Promise.reject(new Error(`必须在合同时间区间内:${originContractDate[0]}~${contractDate[1].format()}`))
                      }
                    }

                    if ((originPaymentDate[0] != (value[0] instanceof moment ? value[0].format("YYYY-MM-DD") : value[0])) || (originPaymentDate[1] != (value[1] instanceof moment ? value[1].format("YYYY-MM-DD") : value[1]))) {
                      if ((value[0] instanceof moment ? value[0].format('YYYY-MM-DD') : value[0]) != originPaymentDate[1]) {
                        return Promise.reject(new Error(`缴费区间发生变化后, 起始时间只能是${originPaymentDate[1]}, 如需恢复原缴费时间,请点击时间框里原缴费时间`))
                      }
                    }
                  } else {
                    return Promise.reject(new Error('缴费时间为必输项'))
                  }
                  // // 自定义校验
                  return Promise.resolve() // 校验通过
                  // return Promise.reject(new Error('校验不通过'))
                }
              })
              ]}
            />
            <ProFormText width="md" name="payCostDate" key="contractNum" label="缴费时间间隔" />
            <ProFormMoney width="md" label="租金/月" min={0} name="rent" locale="zh-CN" rules={[{ required: true }]} disabled={true} />
            <ProFormMoney width="md" label="卫生费" min={0} name="sanitationCost" locale="zh-CN" rules={[{ required: true }]} disabled={true} />
            <ProFormMoney width="md" label="物业费" min={0} name="property" locale="zh-CN" rules={[{ required: true }]} disabled={true} />

            <ProFormMoney
              width="md"
              label="免租金额"
              name="amountOfFree"
              locale="zh-CN"
              min={0}
              initialValue={0}
            />
            <ProFormDependency name={['rent', 'paymentDate', 'sanitationCost', 'property']}>
              {({ rent, paymentDate, sanitationCost, property }) => {
                console.log('缴费日期', paymentDate);
                console.log('缴费日期更新判断值', paymentFromData.paymentDateUpdate);
                var values = 0;
                if (paymentFromData.paymentDateUpdate) {
                  values = sum_amount(paymentDate, rent, sanitationCost, property);
                } else {
                  var values = 0;
                }
                if (values != 0) {
                  return (
                    <ProFormMoney
                      width="md"
                      label={`本次缴费应收款[(租金+卫生费)*缴费月数]`}
                      name="accountReceivable"
                      locale="zh-CN"
                      min={0}
                      disabled
                      fieldProps={{ value: values, style: { color: 'red' }, readOnly: false }}
                    />
                  );
                }

              }}
            </ProFormDependency>
            {paymentFromData.paymentDateUpdate == false && (
              <>
                <ProFormMoney width="md" label="原缴费期内应收款" name="originThisAccountReceivable" locale="zh-CN" disabled fieldProps={{ style: { color: 'red' } }} />
                <ProFormMoney width="md" label="原缴费期内实收款" name="originThisMoneyReceivable" locale="zh-CN" disabled fieldProps={{ style: { color: 'red' } }} />


              </>
            )}
            <ProFormMoney width="md" min={0} label="实收款金额" name="moneyReceivable" locale="zh-CN" rules={[{ required: true }]} />
            <ProFormSegmented
              name="paymentMethod"
              label="缴费方式"
              valueEnum={{
                xj: '现金',
                yh: '银行',
              }}
              fieldProps={{
                // onChange: (values) => {setFromData({...fromData, paymentMethod: values})}
                onChange: (values) => { setPaymentFromData({ ...paymentFromData, paymentMethod: values }) }

              }}

            />
            {paymentFromData.paymentMethod == 'yh' && (<><ProFormText width="xl" name="shroffAccount" label="收款账号" /></>)}
            <ProFormText width="lg" name="remark" label="备注" />
          </ProForm.Group>
        </StepsForm.StepForm>
        <StepsForm.StepForm name="time" title="确定续费信息">
          <ProDescriptions
            column={2}
            title={paymentFromData.leaseFullName}
            tooltip="包含了从服务器请求，columns等功能"
          >
            <ProDescriptions.Item span={1} label="租赁门牌信息">
              {paymentFromData.leaseFullName}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label="租赁状态"
              valueEnum={{
                all: { text: '全部', status: 'Default' },
                underway: {
                  text: '租赁中',
                  status: 'Error',
                },
                gratis: {
                  text: '免费',
                  status: 'Success',
                },
                temporary: {
                  text: '临时',
                  status: 'Success',
                },
                idle: {
                  text: '闲置',
                  status: 'Processing',
                },
              }}
            >
              {console.log('第三步信息', paymentFromData)}
              {paymentFromData.leaseStatus}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={1} label="合同编号">
              {paymentFromData.contractNum}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="合同时间" valueType="dateRange">
              {paymentFromData.contractDate}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={1} label="缴费时间间隔">
              {paymentFromData.payCostDate}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="缴费时间" valueType="dateRange">
              {paymentFromData.paymentDate}
            </ProDescriptions.Item>

            <ProDescriptions.Item label="租金/月" valueType="money">
              {paymentFromData.rent}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="卫生费" valueType="money">
              {paymentFromData.sanitationCost}
            </ProDescriptions.Item>

            <ProDescriptions.Item label="免租金额" valueType="money">
              {paymentFromData.amountOfFree}
            </ProDescriptions.Item>

            <ProDescriptions.Item label="新增合同总应收款" valueType="money">
              {paymentFromData.accountReceivable}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="缴费应收款" valueType="money">
              {paymentFromData.thisAccountReceivable}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="实收金额" valueType="money">
              {paymentFromData.moneyReceivable}
            </ProDescriptions.Item>

            <ProDescriptions.Item span={2} label="递增">
              {paymentFromData.ascending}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={2} label="备注">
              {paymentFromData.remark}
            </ProDescriptions.Item>
          </ProDescriptions>
        </StepsForm.StepForm>
      </StepsForm>
      {/* 抽屉布局--历史记录 */}
      <Drawer
        title={`【${originData.leaseFullName}】历史操作记录`}
        placement="right"
        onClose={onClose}
        visible={DrawerVisible}
        width={'70%'}
      >
        <ProTable<GithubIssueItem>
          params={historySelectParams}
          columns={historyColumns}
          actionRef={actionHistoryRef}
          // defaultSize={10}
          request={async (params, sorter, filter) => {
            // 表单搜索项会从 params 传入，传递给后端接口。
            console.log(params, sorter, filter);
            const res = await getHistoryLeaseResult({ ...params, sorter, filter });
            console.log('测试查询结果：', res.data);
            setRequeOriginTotal(res.data.total);
            return {
              success: true,
              data: res.data.items,
            };
          }}
          editable={{
            type: 'multiple',
          }}
          scroll={{ x: 2600 }}
          columnsState={{
            persistenceKey: 'pro-table-singe-demos',
            persistenceType: 'localStorage',
          }}
          rowKey="key"
          search={{
            labelWidth: 'auto',
            collapseRender: false,
            defaultCollapsed: false,
            // span:3,
          }}
          // search={false}
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
            total: requeOriginTotal,
          }}
          dateFormatter="string"
          // headerTitle="全部区域"
          toolBarRender={() => [
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              loading={Downloadstate}
              onClick={() => setExcelModalVisible(true)}
              disabled
            >
              导出excel
            </Button>,
            // <Dropdown key="menu" overlay={menu}>
            //   <Button>
            //     <EllipsisOutlined />
            //   </Button>
            // </Dropdown>,
          ]}
        />
      </Drawer>
      {/* 租赁退租弹出框 */}

      <Modal
        // title="退租"
        title={<a onClick={() => { windowsOpen("surrender") }}>退租---[点击可查看功能说明]</a>}
        visible={surrenderModalVisible}
        confirmLoading={requestLoading}
        okText={'确定退租'}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
      >
        <ProDescriptions
          column={2}
          title={`请确定[${originData.leaseFullName}]的退租信息`}
          tooltip="包含了从服务器请求，columns等功能"
        >
          <ProDescriptions.Item span={1} label="租赁门牌信息">
            {originData.leaseFullName}
          </ProDescriptions.Item>
          <ProDescriptions.Item
            label="租赁状态"
            valueEnum={{
              all: { text: '全部', status: 'Default' },
              underway: {
                text: '租赁中',
                status: 'Error',
              },
              gratis: {
                text: '免费',
                status: 'Success',
              },
              idle: {
                text: '闲置',
                status: 'Processing',
              },
              temporary: {
                text: '临时',
                status: 'Success',
              },

            }}
          >
            {console.log('第三步信息', originData)}
            {originData.leaseStatus}
          </ProDescriptions.Item>
          <ProDescriptions.Item span={1} label="承租人姓名">
            {originData.userName}
          </ProDescriptions.Item>
          <ProDescriptions.Item span={1} label="承租人手机号码">
            {originData.phone}
          </ProDescriptions.Item>
          <ProDescriptions.Item span={1} label="押金单号" valueType="text">
            {originData.cashPledgeNum}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="押金金额" valueType="money">
            {originData.cashPledgeMoney}
          </ProDescriptions.Item>
          <ProDescriptions.Item
            span={1}
            label="平方米"
            valueType="text"
            fieldProps={{ suffix: 'm\u00b2' }}
          >
            {originData.squareMeter}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="平方米/元" valueType="money">
            {originData.squareMeterPrice}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="起租时间" span={2} valueType="date">
            {originData.onHireDate}
          </ProDescriptions.Item>
          <ProDescriptions.Item span={1} label="合同编号">
            {originData.contractNum}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="合同时间" valueType="dateRange">
            {originData.contractDate}
          </ProDescriptions.Item>
          <ProDescriptions.Item span={1} label="缴费时间间隔">
            {originData.payCostDate}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="缴费时间" valueType="dateRange">
            {originData.paymentDate}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="租金/月" valueType="money">
            {originData.rent}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="卫生费" valueType="money">
            {originData.sanitationCost}
          </ProDescriptions.Item>

          <ProDescriptions.Item label="免租金额" valueType="money">
            {originData.amountOfFree}
          </ProDescriptions.Item>
          <ProDescriptions.Item span={1} label="间数">
            {originData.spaceNum}
          </ProDescriptions.Item>

          <ProDescriptions.Item label="应收款金额" valueType="money">
            {originData.accountReceivable}
          </ProDescriptions.Item>
          <ProDescriptions.Item label="实收金额" valueType="money">
            {originData.moneyReceivable}
          </ProDescriptions.Item>

          <ProDescriptions.Item span={2} label="递增">
            {originData.ascending}
          </ProDescriptions.Item>
          <ProDescriptions.Item span={2} label="备注">
            {originData.remark}
          </ProDescriptions.Item>
        </ProDescriptions>
      </Modal>

      {/* 出租功能分步表单 */}
      <StepsForm
        onFinish={async (values) => {
          console.log('提交的所有数据', values);
          // 出租租赁接口
          try {
            console.log('发送参数', rentOutFromData);
            const res = await rentOutLeaseResult(rentOutFromData);
            console.log('请求结束', res);

            if (res.resSuccess) {
              message.success('出租成功');
              // // 初始化参数
              // setFromData(fromDataInit);
              // // 刷新数据
              // actionRef.current?.reload();
              reset_init_data();
              setRentOutVisible(false); // 关闭出租弹出框
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
            console.log('新增操作中接口异常抛出', error);
            notification.error({
              message: '通讯异常',
              description: '与客户端通讯链接异常',
            });
            message.error('与客户端连接异常');
            Modal.error({
              title: '出租失败',
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
              // title="出租租赁信息"
              title={<a onClick={() => { windowsOpen("rentOut") }}>房屋出租---[点击可查看功能说明]</a>}
              width={900}
              onCancel={() => {
                reset_init_data(false);
                setRentOutVisible(false);
              }}
              visible={rentOutVisible}
              footer={submitter}
              destroyOnClose
              maskClosable={false}
            >
              {dom}
            </Modal>
          );
        }}
      >
        <StepsForm.StepForm
          name="checkbox"
          title="录入出租信息"
          form={rentOutFormRef}
          onFinish={async () => {
            console.log('这是出租第一步');
            const getFieldsValue = rentOutFormRef.getFieldsValue();
            // 将合约日期跟缴费日期 起租时间格式化
            const request_post = {
              ...getFieldsValue,
              accountReceivable: sum_amount(
                getFieldsValue.contractDate,
                getFieldsValue.rent,
                getFieldsValue.sanitationCost,
                getFieldsValue.property,
              ), // 合同应收款金额
              // 缴费应收款
              thisAccountReceivable: sum_amount(getFieldsValue.paymentDate, getFieldsValue.rent, getFieldsValue.sanitationCost, getFieldsValue.property),
              paymentDate: getFieldsValue.paymentDate
                ? [
                  getFieldsValue.paymentDate[0].format('YYYY-MM-DD'),
                  getFieldsValue.paymentDate[1].format('YYYY-MM-DD'),
                ]
                : undefined,
              contractDate: getFieldsValue.contractDate
                ? [
                  getFieldsValue.contractDate[0].format('YYYY-MM-DD'),
                  getFieldsValue.contractDate[1].format('YYYY-MM-DD'),
                ]
                : undefined,
              onHireDate: getFieldsValue.onHireDate
                ? getFieldsValue.onHireDate.format('YYYY-MM-DD')
                : undefined,
            };
            console.log('合同时间', getFieldsValue.onHireDate);
            console.log(
              '第二步->计算应收款',
              sum_amount(
                getFieldsValue.onHireDate,
                getFieldsValue.rent,
                getFieldsValue.sanitationCost,
                getFieldsValue.property,
              ),
            );
            setRentOutFromData({
              ...rentOutFromData,
              ...request_post,
            });
            console.log('第二步变量值', {
              ...rentOutFromData,
              ...request_post,
            });
            return true;
          }}
        >
          <ProForm.Group title={rentOutFromData.leaseFullName}>
            <ProFormSelect
              label="租赁状态"
              name="leaseStatus"
              rules={[
                {
                  required: true,
                },
              ]}
              width="xs"
              initialValue="underway"
              options={[
                {
                  value: 'underway',
                  label: '租赁中',
                },
                { value: 'gratis', label: '免费' },
                { value: 'temporary', label: '临时', disabled:true },
              ]}
              fieldProps={{
                onChange: (value: any) => {
                  console.log('下拉框', value);
                  setRentOutFromData({ ...rentOutFromData, leaseStatus: value });
                },
              }}
            />
            {(rentOutFromData.leaseStatus == 'underway' ||
              rentOutFromData.leaseStatus == 'gratis') && (
                <>
                  <ProFormText
                    width="xs"
                    name="userName"
                    label="承租人"
                    rules={[{ required: true }]}
                  />
                  <ProFormText
                    width="md"
                    name="phone"
                    label="承租人联系电话"
                    rules={[{ required: true }]}
                  />
                  <ProFormSegmented
                    name="invoice"
                    label="是否开票"
                    initialValue={true}
                    request={async () => [
                      { label: '需要开票', value: true },
                      { label: '不开票', value: false },
                    ]}
                  />
                </>
              )}

            <ProFormText
              width="xs"
              name="squareMeter"
              label="平方米"
              fieldProps={{
                suffix: 'm\u00b2',
                onChange: (e) => updateRent(e, "rent")

              }}
            />
            <ProFormMoney width="sm" label="平方米/元" name="squareMeterPrice" locale="zh-CN" fieldProps={{
              onChange: (e) => updateRent(e, "rent")

            }} />
            {rentOutFromData.leaseStatus == 'underway' && (
              <>
                <ProFormText width="sm" name="cashPledgeNum" label="押金单号" />
                <ProFormMoney width="sm" label="押金金额" name="cashPledgeMoney" locale="zh-CN" />
              </>
            )}
            {(rentOutFromData.leaseStatus == 'underway' ||
              rentOutFromData.leaseStatus == 'gratis') && (
                <>
                  <ProFormDatePicker
                    name="onHireDate"
                    label="起租时间"
                    width="sm"
                    fieldProps={{ showToday: true }}
                    rules={[{ required: true }]}
                  />
                </>
              )}

            {rentOutFromData.leaseStatus == 'underway' && (
              <>
                <ProFormText width="sm" name="contractNum" label="合同编号" />
                <ProFormDateRangePicker
                  width="md"
                  name="contractDate"
                  label="合同时间"
                  rules={[{ required: true }]}
                  fieldProps={{
                    ranges: {
                      三个月: [
                        contractDate ? contractDate : moment(),
                        contractDate ? moment(contractDate).add(3, 'M') : moment().add(3, 'M'),
                      ],
                      半年: [
                        contractDate ? contractDate : moment(),
                        contractDate ? moment(contractDate).add(6, 'M') : moment().add(6, 'M'),
                      ],
                      一年: [
                        contractDate ? contractDate : moment(),
                        contractDate ? moment(contractDate).add(12, 'M') : moment().add(12, 'M'),
                      ],
                      二年: [
                        contractDate ? contractDate : moment(),
                        contractDate ? moment(contractDate).add(24, 'M') : moment().add(24, 'M'),
                      ],
                    },
                    onCalendarChange: disableContracdDate, //每次改变触发
                  }}
                />
                <ProFormDateRangePicker
                  width="md"
                  name="paymentDate"
                  label="缴费时间"
                  fieldProps={{
                    ranges: {
                      三个月: [
                        paymentDate ? paymentDate : moment(),
                        paymentDate ? moment(paymentDate).add(3, 'M') : moment().add(3, 'M'),
                      ],
                      半年: [
                        paymentDate ? paymentDate : moment(),
                        paymentDate ? moment(paymentDate).add(6, 'M') : moment().add(6, 'M'),
                      ],
                      一年: [
                        paymentDate ? paymentDate : moment(),
                        paymentDate ? moment(paymentDate).add(12, 'M') : moment().add(12, 'M'),
                      ],
                    },
                    onCalendarChange: disabledDate, //每次改变触发
                  }}
                  // 必输项模板
                  rules={[{ required: true, message: "这是必填项" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      console.log('自定义校验')
                      console.log('getFieldValue:', getFieldValue('contractDate'))
                      const contractDate = getFieldValue('contractDate')
                      if (!((contractDate instanceof Array) && contractDate[0] && contractDate[1])) {
                        return Promise.reject(new Error('合同日期必须先输入'))
                      }
                      if (value) {
                        if ((moment(value[0].format()) < moment(contractDate[0].format()) || moment(value[1].format()) > moment(contractDate[1].format()))) {
                          return Promise.reject(new Error('缴费时间区间必须在合同时间区间内'))
                        }
                      } else {
                        return Promise.reject(new Error('缴费时间为必输项'))
                      }
                      // // 自定义校验
                      return Promise.resolve()  // 校验通过
                      // return Promise.reject(new Error('校验不通过'))
                    }
                  })
                  ]}
                />
                <ProFormText width="md" name="payCostDate" label="缴费时间间隔" />
              </>
            )}

            <ProFormMoney
              width="sm"
              label="租金/月"
              tooltip="面积 * 平方米单价  可以删掉重填"
              name="rent"
              locale="zh-CN"
              min={0}
              rules={[{ required: rentOutFromData.leaseStatus == 'underway' ? true : false }]}
            />
            <ProFormMoney
              width="sm"
              label="卫生费"
              name="sanitationCost"
              locale="zh-CN"
              initialValue={0}
              min={0}
              rules={[{ required: rentOutFromData.leaseStatus == 'underway' ? true : false }]}
            />
            <ProFormMoney
              width="sm"
              label="物业费"
              name="property"
              locale="zh-CN"
              initialValue={0}
              min={0}
              rules={[{ required: fromData.leaseStatus == 'underway' ? true : false }]}
            />


            {rentOutFromData.leaseStatus == 'underway' && (
              <>
                <ProFormMoney width="xs" min={0} label="免租金额" name="amountOfFree" locale="zh-CN" />
              </>
            )}

            <ProFormDigit width="xs" label="间数" name="spaceNum" initialValue={1} />

            {rentOutFromData.leaseStatus == 'underway' && (
              <>
                <ProFormDependency name={['rent', 'contractDate', 'sanitationCost', 'property']}>
                  {({ rent, contractDate, sanitationCost, property }) => {
                    console.log('合同日期', contractDate);
                    console.log('rent', rent);
                    console.log('sanitationCost', sanitationCost);

                    var values = 0;

                    values = sum_amount(contractDate, rent, sanitationCost, property);
                    console.log('应收款:', values);
                    // formRef2?.current?.setFieldsValue({
                    //   accountReceivable: values,
                    // });
                    return (
                      <ProFormMoney
                        width="xs"
                        label={`合同总应收款`}
                        name="accountReceivable"
                        tooltip="(租金+卫生费)*合同月数"
                        locale="zh-CN"
                        disabled
                        fieldProps={{ value: values, style: { color: 'red' }, readOnly: false }}
                      />
                    );
                  }}
                </ProFormDependency>
                <ProFormDependency name={['rent', 'paymentDate', 'sanitationCost', 'property']}>
                  {({ rent, paymentDate, sanitationCost, property }) => {
                    console.log('合同日期', paymentDate);
                    console.log('rent', rent);
                    console.log('sanitationCost', sanitationCost);

                    var values = 0;

                    values = sum_amount(paymentDate, rent, sanitationCost, property);
                    console.log('应收款:', values);
                    // formRef2?.current?.setFieldsValue({
                    //   accountReceivable: values,
                    // });
                    return (
                      <ProFormMoney
                        width="xs"
                        label={`缴费应收款`}
                        name="thisAccountReceivable"
                        tooltip="(租金+卫生费)*缴费月数"
                        locale="zh-CN"
                        min={0}
                        disabled
                        fieldProps={{ value: values, style: { color: 'red' }, readOnly: false }}
                      />
                    );
                  }}
                </ProFormDependency>
                <ProFormMoney width="sm" min={0} label="实收款金额" name="moneyReceivable" locale="zh-CN" rules={[{ required: true }]} />
                <ProFormSegmented
                  name="paymentMethod"
                  label="缴费方式"
                  valueEnum={{
                    xj: '现金',
                    yh: '银行',
                  }}
                  fieldProps={{
                    // onChange: (values) => {setFromData({...fromData, paymentMethod: values})}
                    onChange: (values) => { setRentOutFromData({ ...rentOutFromData, paymentMethod: values }) }

                  }}

                />
                {rentOutFromData.paymentMethod == 'yh' && (<><ProFormText width="xl" name="shroffAccount" label="收款账号" /></>)}
              </>
            )}

            <ProFormText width="lg" name="remark" label="备注" />
          </ProForm.Group>
        </StepsForm.StepForm>
        <StepsForm.StepForm name="time" title="确定出租信息">
          <ProDescriptions
            column={2}
            title={rentOutFromData.leaseFullName}
            tooltip="包含了从服务器请求，columns等功能"
          >
            <ProDescriptions.Item span={1} label="租赁门牌信息">
              {rentOutFromData.leaseFullName}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label="租赁状态"
              valueEnum={{
                all: { text: '全部', status: 'Default' },
                underway: {
                  text: '租赁中',
                  status: 'Error',
                },
                gratis: {
                  text: '免费',
                  status: 'Success',
                },
                temporary: {
                  text: '临时',
                  status: 'Success',
                },
                idle: {
                  text: '闲置',
                  status: 'Processing',
                },
              }}
            >
              {console.log('第三步信息', rentOutFromData)}
              {rentOutFromData.leaseStatus}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={1} label="承租人姓名">
              {rentOutFromData.userName}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={1} label="承租人手机号码">
              {rentOutFromData.phone}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={1} label="押金单号" valueType="text">
              {rentOutFromData.cashPledgeNum}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="押金金额" valueType="money">
              {rentOutFromData.cashPledgeMoney}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              span={1}
              label="平方米"
              valueType="text"
              fieldProps={{ suffix: 'm\u00b2' }}
            >
              {rentOutFromData.squareMeter}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="平方米/元" valueType="money">
              {rentOutFromData.squareMeterPrice}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="起租时间" span={2} valueType="date">
              {rentOutFromData.onHireDate}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={1} label="合同编号">
              {rentOutFromData.contractNum}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="合同时间" valueType="dateRange">
              {rentOutFromData.contractDate}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={1} label="缴费时间间隔">
              {rentOutFromData.payCostDate}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="缴费时间" valueType="dateRange">
              {rentOutFromData.paymentDate}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="租金/月" valueType="money">
              {rentOutFromData.rent}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="卫生费" valueType="money">
              {rentOutFromData.sanitationCost}
            </ProDescriptions.Item>

            <ProDescriptions.Item label="免租金额" valueType="money">
              {rentOutFromData.amountOfFree}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={1} label="间数">
              {rentOutFromData.spaceNum}
            </ProDescriptions.Item>

            <ProDescriptions.Item label="应收款金额" valueType="money">
              {rentOutFromData.accountReceivable}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="实收金额" valueType="money">
              {rentOutFromData.moneyReceivable}
            </ProDescriptions.Item>

            <ProDescriptions.Item span={2} label="递增">
              {rentOutFromData.ascending}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={2} label="备注">
              {rentOutFromData.remark}
            </ProDescriptions.Item>
          </ProDescriptions>
        </StepsForm.StepForm>
      </StepsForm>
      {/* 普通信息修改表单 */}
      <StepsForm
        onFinish={async (values) => {
          console.log('提交的所有数据', values);
          // 修改租赁信息接口
          try {
            console.log('发送参数', updateFromData);
            const res = await updateLeaseResult(updateFromData);
            console.log('请求结束', res);

            if (res.resSuccess) {
              message.success('修改成功');
              reset_init_data(true);
              setUpdateVisible(false); // 关闭更新弹出框
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
            console.log('修改操作中接口异常抛出', error);
            notification.error({
              message: '通讯异常',
              description: '与客户端通讯链接异常',
            });
            message.error('与客户端连接异常');
            Modal.error({
              title: '修改失败',
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
              title="更新基本租赁信息"
              width={800}
              onCancel={() => {
                setUpdateVisible(false);
              }}
              visible={updateVisible}
              footer={submitter}
              destroyOnClose
            >
              {dom}
            </Modal>
          );
        }}
      >
        <StepsForm.StepForm
          name="checkbox"
          title="普通信息修改"
          form={updateFormRef}
          onFinish={async () => {
            console.log('普通信息修改');
            const getFieldsValue = updateFormRef.getFieldsValue();
            const request_post = {
              ...getFieldsValue,
            };
            setUpdateFromData({
              ...updateFromData,
              ...request_post,
            });
            console.log('第二步变量值', {
              ...updateFromData,
              ...request_post,
            });
            return true;
          }}
        >
          <ProForm.Group title={updateFromData.leaseFullName}>
          <ProFormSelect
              label="租赁状态"
              name="leaseStatus"
              disabled
              rules={[
                {
                  required: true,
                },
              ]}
              width="xs"
              initialValue="underway"
              options={[
                {
                  value: 'underway',
                  label: '租赁中',
                },
                { value: 'gratis', label: '免费' },
                { value: 'idle', label: '闲置' },
                { value: 'temporary', label: '临时' },
              ]}
            />
          <ProFormText width="sm" name="houseNumBak" label="门牌号备注"
            placeholder="例如：东区2栋1号(含三楼301至312号房) 则填 含三楼301至312号房"
            tooltip = "例如：东区2栋1号(含三楼301至312号房) 则填 含三楼301至312号房" />

            <ProFormSegmented
              name="invoice"
              label="是否开票"
              request={async () => [
                { label: '需要开票', value: true },
                { label: '不开票', value: false },
              ]}

            // valueEnum={{
            //   true: '需要开票',
            //   false: '不开票',
            // }}
            />
            {updateFromData.leaseStatus != 'idle' && (
              <>
                <ProFormText
                  width="md"
                  name="userName"
                  label="承租人"
                  rules={[{ required: true }]}
                />
                <ProFormText
                  width="md"
                  name="phone"
                  label="承租人联系电话"
                  rules={[{ required: true }]}
                />
              </>
            )}
            {updateFromData.leaseStatus != 'idle' && (
              <>
                <ProFormText width="md" name="cashPledgeNum" label="押金单号" />
                <ProFormMoney width="md" label="押金金额" name="cashPledgeMoney" locale="zh-CN" />
              </>
            )}

            <ProFormText
              width="md"
              name="squareMeter"
              label="平方米"
              fieldProps={{ suffix: 'm\u00b2' }}
            />
            <ProFormMoney width="md" label="平方米/元" name="squareMeterPrice" locale="zh-CN" />
            {updateFromData.leaseStatus != 'idle' && (
              <>
                <ProFormDatePicker
                  disabled
                  name="onHireDate"
                  label="起租时间"
                  width="lg"
                  fieldProps={{ showToday: true }}
                  rules={[{ required: true }]}
                />
              </>
            )}
            {fromData.leaseStatus == 'underway' && (
              <>
                <ProFormText width="md" name="contractNum" label="合同编号" />
                <ProFormDateRangePicker disabled width="md" name="contractDate" label="合同时间" />
                <ProFormDateRangePicker disabled width="md" name="paymentDate" label="缴费时间" />
                <ProFormText disabled width="md" name="payCostDate" label="缴费时间间隔" />
              </>
            )}

            <ProFormMoney
              disabled={updateFromData.leaseStatus == 'idle' ? false : true}
              width="md"
              label="租金/月"
              name="rent"
              locale="zh-CN"
            />
            <ProFormMoney
              disabled={updateFromData.leaseStatus == 'idle' ? false : true}
              width="md"
              label="卫生费"
              name="sanitationCost"
              locale="zh-CN"
            />
            <ProFormMoney
              disabled={updateFromData.leaseStatus == 'idle' ? false : true}
              width="md"
              label="物业费"
              name="property"
              locale="zh-CN"
            />
            {updateFromData.leaseStatus == 'underway' && (
              <>
                <ProFormMoney
                  disabled
                  width="md"
                  label="免租金额"
                  name="amountOfFree"
                  locale="zh-CN"
                />
              </>
            )}

            <ProFormDigit disabled width="md" label="间数" name="spaceNum" initialValue={1} />
            {updateFromData.leaseStatus == 'underway' && (
              <>
                <ProFormMoney
                  width="md"
                  label={`应收款金额`}
                  name="accountReceivable"
                  tooltip="应收款金额=(租金+卫生费)*月数"
                  locale="zh-CN"
                  disabled
                  fieldProps={{ style: { color: 'red' }, readOnly: false }}
                />

                <ProFormMoney
                  width="md"
                  disabled
                  label="实收款金额"
                  name="moneyReceivable"
                  locale="zh-CN"
                />
              </>
            )}

            <ProFormText width="lg" name="remark" label="备注" />
          </ProForm.Group>
        </StepsForm.StepForm>
        <StepsForm.StepForm name="time" title="确定修改信息">
          <ProDescriptions
            column={2}
            title={updateFromData.leaseFullName}
            tooltip="包含了从服务器请求，columns等功能"
          >
            <ProDescriptions.Item span={1} label="租赁门牌信息">
              {updateFromData.leaseFullName}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label="租赁状态"
              valueEnum={{
                all: { text: '全部', status: 'Default' },
                underway: {
                  text: '租赁中',
                  status: 'Error',
                },
                gratis: {
                  text: '免费',
                  status: 'Success',
                },
                temporary: {
                  text: '临时',
                  status: 'Success',
                },
                idle: {
                  text: '闲置',
                  status: 'Processing',
                },
              }}
            >
              {console.log('第三步信息', updateFromData)}
              {updateFromData.leaseStatus}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={1} label="承租人姓名">
              {updateFromData.userName}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={1} label="承租人手机号码">
              {updateFromData.phone}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={1} label="押金单号" valueType="text">
              {updateFromData.cashPledgeNum}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="押金金额" valueType="money">
              {updateFromData.cashPledgeMoney}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              span={1}
              label="平方米"
              valueType="text"
              fieldProps={{ suffix: 'm\u00b2' }}
            >
              {updateFromData.squareMeter}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="平方米/元" valueType="money">
              {updateFromData.squareMeterPrice}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="起租时间" span={2} valueType="date">
              {updateFromData.onHireDate}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={1} label="合同编号">
              {updateFromData.contractNum}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="合同时间" valueType="dateRange">
              {updateFromData.contractDate}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={1} label="缴费时间间隔">
              {updateFromData.payCostDate}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="缴费时间" valueType="dateRange">
              {updateFromData.paymentDate}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="租金/月" valueType="money">
              {updateFromData.rent}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="卫生费" valueType="money">
              {updateFromData.sanitationCost}
            </ProDescriptions.Item>

            <ProDescriptions.Item label="免租金额" valueType="money">
              {updateFromData.amountOfFree}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={1} label="间数">
              {updateFromData.spaceNum}
            </ProDescriptions.Item>

            <ProDescriptions.Item label="应收款金额" valueType="money">
              {updateFromData.accountReceivable}
            </ProDescriptions.Item>
            <ProDescriptions.Item label="实收金额" valueType="money">
              {updateFromData.moneyReceivable}
            </ProDescriptions.Item>

            <ProDescriptions.Item span={2} label="递增">
              {updateFromData.ascending}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={2} label="备注">
              {updateFromData.remark}
            </ProDescriptions.Item>
          </ProDescriptions>
        </StepsForm.StepForm>
      </StepsForm>

      {/* <Modal
        title="导出excel"
        visible={excelModalVisible}
        confirmLoading={requestLoading}
        okText={'导出excel'}
        onOk={excelHandleOk}
        onCancel={excelHandleCancel}
      >
      </Modal> */}
    </>
  );
};
