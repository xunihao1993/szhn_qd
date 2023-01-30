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
import { TableDropdown } from '@ant-design/pro-table';
import { useModel, useRequest, history } from 'umi';
import {
  getPage,
  libraryAddOrUpdate,
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
      setSelectParams({ bookType: "zw" });
    } else if (url_name == 'eastArea') {
      setSelectParams({ regbookTypeion: "we" });
    }
  }, []);
  // 路由变量
  const [urlName, setUrlName] = useState('');
  // 下载按钮转圈圈
  const [Downloadstate, setDownloadstate] = useState(false);
  // 抽屉布局开关
  const [DrawerVisible, setDrawerVisible] = useState(false);
  // 删除图书弹出框
  const [surrenderModalVisible, setSurrenderModalVisible] = useState(false);
  // 分步表单步骤数
  const [fromCurrent, setFromCurrent] = useState(undefined);
  // 新建分步表单开关
  const [visible, setVisible] = useState(false);
  // 修改分步表单开关
  const [updateVisible, setUpdateVisible] = useState(false);
  // 出租分步表单开关
  const [rentOutVisible, setRentOutVisible] = useState(false);
  // 归还/借阅(合同续约)分步表单开关
  const [reletVisible, setReletVisible] = useState(false);
  // 续费(缴费)分步表单开关
  const [paymentVisible, setPaymentVisible] = useState(false);
  // 请求加载中
  const [requestLoading, setRequestLoading] = useState(false);
  // excel弹出框--图书管理
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
  //归还/借阅合同续约功能(表单)
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
  // 删除图书弹出框 OK按钮
  const handleOk = () => {
    setRequestLoading(true);
    deleteLeaseRequest.run({ id: originData.id });
    // setSurrenderModalVisible(false);
  };
  // 删除图书弹出框 取消按钮
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
    bookName: null,
    author: null,
    price: null,
    bookType: null
  };
  // 归还/借阅功能表单初始化参数
  const reletFromDataInit = {
    ...fromDataInit,

  };

  // 新建功能表单值
  const [fromData, setFromData] = useState({ ...fromDataInit });
  // 修改功能表单值
  const [updateFromData, setUpdateFromData] = useState({ ...fromDataInit });
  // 归还/借阅功能表单值
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
      return { name: '图书中', color: 'red' };
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
      return { name: '删除图书', color: 'green' };
    } else if (key == 'rentOut') {
      return { name: '出租', color: 'red' };
    } else if (key == 'relet') {
      return { name: '合同续约(归还/借阅)', color: 'blue' };
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
    // 新录入图书信息功能
    if (leaseStatus == "addHouse") {
      window.open("https://www.yuque.com/eggdan/il28ya?# 《数字海南--图书管理系统笔试题》")
    } else if (leaseStatus == "rentOut") {
      // 出租
      window.open("https://www.yuque.com/eggdan/il28ya?# 《数字海南--图书管理系统笔试题》")
    } else if (leaseStatus == "relet") {
      // 归还/借阅(合同续约)
      window.open("https://www.yuque.com/eggdan/il28ya?# 《数字海南--图书管理系统笔试题》")
    } else if (leaseStatus == "payment") {
      // 续费
      window.open("https://www.yuque.com/eggdan/il28ya?# 《数字海南--图书管理系统笔试题》")
    } else if (leaseStatus == "surrender") {
      // 删除图书
      window.open("https://www.yuque.com/eggdan/il28ya?# 《数字海南--图书管理系统笔试题》")
    }
  }
  const leaseStatusMap = {
    all: {
      name: '全部',
      colour: 'green',
      text: '全部',
      status: 'Default',
    },
    zw: {
      name: '中文图书',
      colour: 'green',
      text: '中文图书',
      status: 'zw',
    },
    we: {
      name: '外文图书',
      colour: 'red',
      text: '外文图书',
      status: 'we',
    },
    0: {
      name: '否',
      colour: 'green',
      text: '否',
      status: 'Default',
    },
    1: {
      name: '被借阅',
      colour: 'red',
      text: '被借阅',
      status: 'Default',
    },
  };
  const leaseStatusMap2 = {
    all: {
      name: '全部',
      colour: 'green',
      text: '全部',
      status: 'Default',
    },
    zw: {
      name: '中文图书',
      colour: 'green',
      text: '中文图书',
      status: 'zw',
    },
    we: {
      name: '外文图书',
      colour: 'red',
      text: '外文图书',
      status: 'we',
    },
  };
  // 图书概要信息操作系列ref
  const actionRef = useRef<ActionType>();

  // 图书历史操作信息操作系列ref
  const actionHistoryRef = useRef<ActionType>();
  // 查询数据总条数--图书信息
  const [requeTotal, setrequeTotal] = useState(100);
  // 当前全局变量
  const [globalDict, setGlobalDict] = useState({
    totalSpaceNum: 0,
  })
  // 查询数据总条数--历史记录
  const [requeOriginTotal, setRequeOriginTotal] = useState(100);
  //图书概要信息excel导出
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
  //删除图书请求use
  const deleteLeaseRequest = useRequest(deleteLeaseResult, {
    manual: true,
    onSuccess: (data: any, params: any) => {
      console.log('收到响应数据data:', data);
      console.log('收到响应数据data2:', deleteLeaseRequest.data);
      console.log('这是params:', params);
      // console.log(ErrorHandle)
      // console.log(data.ErrorInfo)
      console.log('************');
      if (data) {
        setRequestLoading(false);
        reset_init_data();
        setSurrenderModalVisible(false);
        notification.info({
          description: '删除图书成功',
          message: '删除图书成功',
        });
      } else {
        setRequestLoading(false);
        notification.info({
          description: '删除图书失败',
          message: '删除图书失败',
        });
      }
    },
    onError: (error: any, params: any) => {
      setRequestLoading(false);
      console.log('删除图书失败');
      console.log('删除图书失败error:', error.data);
      notification.error({
        description: error.data?.ErrorInfo?.errDec,
        message: '删除图书失败',
      });
      Modal.error({
        title: '删除图书失败',
        content: (
          <div>
            <p>{`失败原因: ${error.data?.ErrorInfo?.errDec}`}</p>
            <p>{`失败代码: ${error.data?.requestId}`}</p>
          </div>
        ),
      });
    },
  });
  // 图书概要信息查询
  const columns: ProColumns<GithubIssueItem>[] = [
    // {
    //   dataIndex: 'index',
    //   valueType: 'indexBorder',
    //   width: 48,
    // },
    {
      title: '书名',
      width: 200,
      dataIndex: 'bookName',
      // copyable: true, //是否支持复制
      // ellipsis: true, //标题过长会自动收缩
      // hideInSearch: true,
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
              {_.toString().length >= 20 ? _.toString().substring(0, 20) + "..." : _}
            </CheckableTag>
          </Tooltip>
        );
      },
    },

    {
      title: '图书类型',
      dataIndex: 'bookType',
      fixed: 'left',
      // copyable: true, // 是否复制
      // hideInSearch:true, // 查询表单中不展示此项
      hideInTable: true, // 在查询表格不显示
      valueType: 'select',
      initialValue: null,
      valueEnum: leaseStatusMap2,
    },
    {
      title: '图书类型',
      width: 80,
      dataIndex: 'bookType',
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
      title: '作者',
      dataIndex: 'author',
      width: 80,
      // copyable: true, // 是否复制
      // hideInSearch:true, // 查询表单中不展示此项
      // hideInTable: true, // 在查询表格不显示
      // valueType: 'digit',
    },
    {
      title: '价格',
      width: 80,
      dataIndex: 'price',
      valueType: 'money',
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '是否被借阅',
      width: 80,
      dataIndex: 'state',
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
      title: '新增时间',
      dataIndex: 'createTime',
      width: 100,
      key: 'id',
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
      valueType: 'date',
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 100,
      key: 'id',
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
      valueType: 'date',
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
              id: record.id
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
          key="editable"
          aria-disabled
          onClick={() => {
            setReletVisible(true);
            // 设置表单全局变量
            setReletFromData({
              ...reletFromData,
              ...record,
              operateFlag:"LOAN_IN",
              bookId:record.id
            });
            setReletVisible(true);
          }}
        >
          归还
        </a>,
        <a
          key="editable"
          aria-disabled
          onClick={() => {
              setReletVisible(true);
              // 设置表单全局变量
              setReletFromData({
                ...reletFromData,
                ...record,
                operateFlag:"LOAN_OUT",
                bookId:record.id
              });
              setReletVisible(true);
          }}
        >
          借阅
        </a>,
        <a
          onClick={() => {
            setOriginData({ ...record });
            setHistorySelectParams({ id: record?.id });
            setDrawerVisible(true);
          }}
          target="_blank"
          rel="noopener noreferrer"
          key="view"
        >
          历史记录借阅记录
        </a>,
        <a
          key="editable"
          aria-disabled
          onClick={() => {
            console.log("删除接口参数", record)
            setOriginData({ ...record });
            setSurrenderModalVisible(true);
          }}
        >
          删除
        </a>,
        // <TableDropdown
        //   key="actionGroup"
        //   onSelect={(item: any) => {
        //     setOriginData({ ...record }); // 设置目前选择的唯一标识相关信息
        //     console.log('item', item);
        //     console.log('contractNum', record.contractNum);
        //     console.log('contractDate', record.contractDate);
        //     console.log('record', record);
        //     // 进行归还/借阅(合同续约)操作
        //     if (item == 'relet') {
        //       setReletVisible(true);
        //       // 设置表单全局变量
        //       setReletFromData({
        //         ...reletFromData,
        //         ...record,
        //         originContractDate: record.contractDate,
        //         leaseFullName: record.leaseFullName,
        //         contractDate: [moment(record.contractDate[1], 'YYYY-MM-DD'), null],
        //         paymentDate: record.paymentDate,
        //         payCostDate: record.payCostDate,
        //         originPaymentDate: record.paymentDate,
        //         originRent: record.rent,
        //         originSanitationCost: record.sanitationCost,
        //         originProperty: record.property,
        //       });
        //       setPaymentEndDate(moment(record.paymentDate[1], 'YYYY-MM-DD'));
        //       // 设置归还/借阅表单值
        //       reletFormRef.setFieldsValue({
        //         contractNum: record.contractNum,
        //         originContractDate: record.contractDate,
        //         contractDate: [moment(record.contractDate[1], 'YYYY-MM-DD'), null],
        //         paymentDate: record.paymentDate,
        //         payCostDate: record.payCostDate,
        //         rent: record.rent,
        //         sanitationCost: record.sanitationCost,
        //         property: record.property,
        //         ascending: record.ascending,
        //         remark: record.remark,
        //         asc: 0,
        //         asctype: 'yz'
        //       });
        //       console.log('contractDate', moment(record.contractDate[1], 'YYYY-MM-DD'));
        //       setReletVisible(true);
        //       // 缴费续费操作
        //     } else if (item == 'payment') {
        //       // 设置表单全局变量
        //       if (record.leaseStatus == "temporary"){
        //         // 图书状态为临时时 不需要合同时间
        //         setPaymentFromData({
        //           ...reletFromData,
        //           ...record,
        //           paymentMethod: "xj",
        //           originContractDate: record.contractDate,
        //           leaseFullName: record.leaseFullName,
        //           // contractDate: [moment(record.contractDate[0], 'YYYY-MM-DD'), moment(record.contractDate[1], 'YYYY-MM-DD')],
        //           paymentDate: record.paymentDate,
        //           payCostDate: record.payCostDate,
        //           originPaymentDate: record.paymentDate,
        //           originThisAccountReceivable: record.thisAccountReceivable,
        //           originThisMoneyReceivable: record.thisMoneyReceivable,
        //           originRent: record.rent,
        //           originSanitationCost: record.sanitationCost,
        //           originProperty: record.property,
        //         });
        //         setPaymentEndDate(moment(record.paymentDate[1], 'YYYY-MM-DD'));
        //         // 设置续费表单值
        //         paymentFormRef.setFieldsValue({
        //           paymentMethod: "xj",
        //           contractNum: record.contractNum,
        //           originContractDate: record.contractDate,
        //           // contractDate: [moment(record.contractDate[0], 'YYYY-MM-DD'), moment(record.contractDate[1], 'YYYY-MM-DD')],
        //           paymentDate: record.paymentDate,
        //           payCostDate: record.payCostDate,
        //           originPaymentDate: record.paymentDate,
        //           property: record.property,
        //           rent: record.rent,
        //           sanitationCost: record.sanitationCost,
        //           ascending: record.ascending,
        //           remark: record.remark,
        //           originThisAccountReceivable: record.thisAccountReceivable,
        //           originThisMoneyReceivable: record.thisMoneyReceivable,
        //           asc: 0,
        //           asctype: 'yz'
        //         });
        //       }else{
        //         setPaymentFromData({
        //           ...reletFromData,
        //           ...record,
        //           paymentMethod: "xj",
        //           originContractDate: record.contractDate,
        //           leaseFullName: record.leaseFullName,
        //           contractDate: [moment(record.contractDate[0], 'YYYY-MM-DD'), moment(record.contractDate[1], 'YYYY-MM-DD')],
        //           paymentDate: record.paymentDate,
        //           payCostDate: record.payCostDate,
        //           originPaymentDate: record.paymentDate,
        //           originThisAccountReceivable: record.thisAccountReceivable,
        //           originThisMoneyReceivable: record.thisMoneyReceivable,
        //           originRent: record.rent,
        //           originSanitationCost: record.sanitationCost,
        //           originProperty: record.property,
        //         });
        //         setPaymentEndDate(moment(record.paymentDate[1], 'YYYY-MM-DD'));
        //         // 设置续费表单值
        //         paymentFormRef.setFieldsValue({
        //           paymentMethod: "xj",
        //           contractNum: record.contractNum,
        //           originContractDate: record.contractDate,
        //           contractDate: [moment(record.contractDate[0], 'YYYY-MM-DD'), moment(record.contractDate[1], 'YYYY-MM-DD')],
        //           paymentDate: record.paymentDate,
        //           originPaymentDate: record.paymentDate,
        //           payCostDate: record.payCostDate,
        //           property: record.property,
        //           rent: record.rent,
        //           sanitationCost: record.sanitationCost,
        //           ascending: record.ascending,
        //           remark: record.remark,
        //           originThisAccountReceivable: record.thisAccountReceivable,
        //           originThisMoneyReceivable: record.thisMoneyReceivable,
        //           asc: 0,
        //           asctype: 'yz'
        //         });

        //       }

        //       // console.log('contractDate', moment(record.contractDate[1], 'YYYY-MM-DD'));
        //       setPaymentVisible(true);
        //     } else if (item == 'surrender') {
        //       setSurrenderModalVisible(true);
        //       // 概要查询页面 出租按钮
        //     } else if (item == 'rentOut') {
        //       // 设置表单值
        //       rentOutFormRef.setFieldsValue({
        //         leaseStatus: 'underway', // 初始化
        //         paymentMethod: 'xj',
        //         invoice: true,
        //         spaceNum: 1,
        //         squareMeter: record.squareMeter,
        //         squareMeterPrice: record.squareMeterPrice,
        //         rent: record.rent,
        //         sanitationCost: record.sanitationCost,
        //         property: record.property,
        //         ascending: record.ascending,
        //         remark: record.remark,
        //       });
        //       setRentOutFromData({
        //         ...rentOutFromData,
        //         paymentMethod: 'xj',
        //         invoice: true,
        //         leaseStatus: 'underway',
        //         leaseFullName: record.leaseFullName,
        //         key: record.key,
        //       });
        //       setRentOutVisible(true);
        //     }
        //   }}
        //   menus={[
        //     { key: 'rentOut', name: '出租', title: '只有闲置中的房屋才能进行出租操作', disabled: record.leaseStatus == "idle" ? false : true },
        //     { key: 'relet', name: '合同续约', title: '只有图书中的房屋才能进行归还/借阅操作', disabled: record.leaseStatus == "underway" ? false : true },
        //     { key: 'payment', name: '缴费(续费)', title: '只有图书中或临时的房屋才能进行续费操作', disabled: record.leaseStatus == "underway" || record.leaseStatus == "temporary" ? false : true },
        //     { key: 'surrender', name: '删除图书', title: '只有图书中或免费的房屋才能进行删除图书操作', disabled: record.leaseStatus == "idle" ? true : false },
        //   ]}
        // />,
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
      dataIndex: 'typeFlag',
      initialValue: null,
      // fixed: 'left',
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      hideInTable:true, // 在查询表格不显示
      render: (_: any, record: any) => (
        <Space>
          <Tag color={nameColor(_).color}>{nameColor(_).name}</Tag>
        </Space>
      ),
    },
    {
      title: '操作记录',
      dataIndex: 'typeFlag',
      initialValue: null,
      filters: true,
      onFilter: true,
      width: 150,
      hideInSearch:true, // 查询表单中不展示此项
      // hideInTable: true, // 在查询表格不显示
      valueType: 'select',
      valueEnum: {
        LOAN_IN: { text: '归还', status: 'Success' },
        LOAN_OUT: { text: '借出', status: 'Error' },
      },
    },

    {
      title: '操作人',
      dataIndex: 'userName',
      // fixed: 'left',
      width: 80,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '操作时间',
      dataIndex: 'createTime',
      width: 150,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
      valueType: 'dateTime',
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
          const res = await getPage({ ...params, sorter, filter });
          console.log('测试查询结果：', res.data);
          setrequeTotal(res.data.total);
          setGlobalDict({ ...globalDict, totalSpaceNum: res.data.totalSpaceNum })
          return {
            success: true,
            data: res.data.records,
          };
        }}
        editable={{
          type: 'multiple',
        }}
        scroll={{ x: 500 }}
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
        headerTitle="图书查询"
        toolBarRender={() => [
          // <Tag>总间数:{globalDict.totalSpaceNum}</Tag>,
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => setVisible(true)}
          >
            新增图书信息
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
            const res = await libraryAddOrUpdate(fromData);
            console.log('请求结束', res);
            console.log(formRef2.getFieldsValue());

            if (res.resSuccess) {
              message.success('图书数据新建成功');
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

            // 将合约日期跟缴费日期 起租时间格式化
            const request_post = {
              ...formRef2.getFieldsValue(),
              stock: 1,
            };

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
          <ProForm.Group >
            <ProFormText width="xl" name="bookName" label="书名" />
            <ProFormText width="xl" name="author" label="作者" />
            <ProFormMoney
              width="xl"
              label="图书价格"
              name="price"
              locale="zh-CN"
              initialValue={0}
              min={0}
            />
            <ProFormSelect
              label="图书类型"
              name="bookType"
              rules={[
                {
                  required: true,
                },
              ]}
              width="md"
              initialValue="zw"
              options={[
                { value: 'zw', label: '中文图书' },
                { value: 'we', label: '外文图书' },
              ]}
            />
          </ProForm.Group>
        </StepsForm.StepForm>
        <StepsForm.StepForm name="time" title="确定图书信息">
          <ProDescriptions
            column={2}
          // tooltip="包含了从服务器请求，columns等功能"
          >

            <ProDescriptions.Item span={2} label="图书名称">
              {fromData.bookName}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={2} label="作者">
              {fromData.author}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={2} label="图书价格" valueType="money">
              {fromData.price}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label="图书类型"
              span={2}
              valueEnum={{
                zw: {
                  text: '中文图书',
                  status: 'Error',
                },
                we: {
                  text: '外文图书',
                  status: 'Success',
                },
              }}
            >
              {/* {console.log('第三步信息', fromData)} */}
              {fromData.bookType}
            </ProDescriptions.Item>

          </ProDescriptions>
        </StepsForm.StepForm>
      </StepsForm>
      {/* 归还/借阅功能分步表单 */}
      <StepsForm
        onFinish={async (values) => {
          console.log('提交的所有数据', values);
          try {
            console.log('发送参数', reletFromData);

            const res = await reletLeaseResult(reletFromData);
            console.log('请求结束', res);

            if (res.resSuccess) {
              message.success('归还/借阅成功');
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
            console.log('归还/借阅操作中接口异常抛出', error);
            notification.error({
              message: '通讯异常',
              description: '与客户端通讯链接异常',
            });
            message.error('与客户端连接异常');
            Modal.error({
              title: '归还/借阅失败',
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
              // title="归还/借阅(合同续约)"
              title={<a onClick={() => { windowsOpen("relet") }}>归还/借阅(合同续约)---[点击可查看功能说明]</a>}
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
        <StepsForm.StepForm name="time" title="确定归还/借阅信息">
          <ProDescriptions
            column={2}
          >
            <ProDescriptions.Item span={2} label="图书名称">
              {reletFromData.bookName}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={2} label="作者">
              {reletFromData.author}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={2} label="图书价格" valueType="money">
              {reletFromData.price}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label="图书类型"
              span={2}
              valueEnum={{
                zw: {
                  text: '中文图书',
                  status: 'Error',
                },
                we: {
                  text: '外文图书',
                  status: 'Success',
                },
              }}
            >
              {/* {console.log('第三步信息', fromData)} */}
              {reletFromData.bookType}
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
              message.success('归还/借阅成功');
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
        <StepsForm.StepForm name="time" title="确定续费信息">
          <ProDescriptions
            column={2}
            title={paymentFromData.leaseFullName}
            tooltip="包含了从服务器请求，columns等功能"
          >
            <ProDescriptions.Item span={1} label="图书门牌信息">
              {paymentFromData.leaseFullName}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label="图书状态"
              valueEnum={{
                all: { text: '全部', status: 'Default' },
                underway: {
                  text: '图书中',
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
        title={`历史操作记录`}
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
              data: res.data.records,
            };
          }}
          editable={{
            type: 'multiple',
          }}
          scroll={{ x: 500 }}
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
      {/* 图书删除图书弹出框 */}

      <Modal
        // title="删除图书"
        title={<a onClick={() => { windowsOpen("surrender") }}>删除图书---[点击可查看功能说明]</a>}
        visible={surrenderModalVisible}
        confirmLoading={requestLoading}
        okText={'确定删除图书'}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
      >
        <ProDescriptions
          column={2}
        >
          <ProDescriptions.Item span={2} label="图书名称">
            {originData.bookName}
          </ProDescriptions.Item>
          <ProDescriptions.Item span={2} label="作者">
            {originData.author}
          </ProDescriptions.Item>
          <ProDescriptions.Item span={2} label="图书价格" valueType="money">
            {originData.price}
          </ProDescriptions.Item>
          <ProDescriptions.Item
            label="图书类型"
            span={2}
            valueEnum={{
              zw: {
                text: '中文图书',
                status: 'Error',
              },
              we: {
                text: '外文图书',
                status: 'Success',
              },
            }}
          >
            {/* {console.log('第三步信息', fromData)} */}
            {originData.bookType}
          </ProDescriptions.Item>
        </ProDescriptions>
      </Modal>

      {/* 出租功能分步表单 */}
      <StepsForm
        onFinish={async (values) => {
          console.log('提交的所有数据', values);
          // 出租图书接口
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
              // title="出租图书信息"
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
        <StepsForm.StepForm name="time" title="确定出租信息">
          <ProDescriptions
            column={2}
            title={rentOutFromData.leaseFullName}
            tooltip="包含了从服务器请求，columns等功能"
          >
            <ProDescriptions.Item span={1} label="图书门牌信息">
              {rentOutFromData.leaseFullName}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label="图书状态"
              valueEnum={{
                all: { text: '全部', status: 'Default' },
                underway: {
                  text: '图书中',
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
          // 修改图书信息接口
          try {
            console.log('发送参数', updateFromData);
            const res = await libraryAddOrUpdate(updateFromData);
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
              title="更新基本图书信息"
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
              ...updateFromData,
              ...getFieldsValue,
            };
            setUpdateFromData({ ...request_post })
            return true;
          }}
        >
          <ProForm.Group>
            <ProFormText width="xl" name="bookName" label="书名" />
            <ProFormText width="xl" name="author" label="作者" />
            <ProFormMoney
              width="xl"
              label="图书价格"
              name="price"
              locale="zh-CN"
              initialValue={0}
              min={0}
            />
            <ProFormSelect
              label="图书类型"
              name="bookType"
              rules={[
                {
                  required: true,
                },
              ]}
              width="md"
              initialValue="zw"
              options={[
                { value: 'zw', label: '中文图书' },
                { value: 'we', label: '外文图书' },
              ]}
            />
          </ProForm.Group>
        </StepsForm.StepForm>
        <StepsForm.StepForm name="time" title="确定修改信息">
          <ProDescriptions
            column={2}
          >
            <ProDescriptions.Item span={2} label="图书名称">
              {updateFromData.bookName}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={2} label="作者">
              {updateFromData.author}
            </ProDescriptions.Item>
            <ProDescriptions.Item span={2} label="图书价格" valueType="money">
              {updateFromData.price}
            </ProDescriptions.Item>
            <ProDescriptions.Item
              label="图书类型"
              span={2}
              valueEnum={{
                zw: {
                  text: '中文图书',
                  status: 'Error',
                },
                we: {
                  text: '外文图书',
                  status: 'Success',
                },
              }}
            >
              {/* {console.log('第三步信息', fromData)} */}
              {updateFromData.bookType}
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
