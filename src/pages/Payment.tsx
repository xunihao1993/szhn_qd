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
    id?:number;
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

    // 颜色名称相关枚举
    const nameColor = (key: any) => {
      if (key == 'addUnderway') {
        return { name: '新增出租房屋', color: 'red' };
      } else if (key == 'rentOut') {
        return { name: '出租', color: 'magenta' };
      } else if (key == 'payment') {
        return { name: '续费(缴费)', color: 'green' };
      } else if (key == 'paymentSupplement') {
        return { name: '缴费(续费)-补款', color: 'cyan' };
      } else if (key == 'clockAuto') {
        return { name: '定时自动生成预缴费', color: 'purple' };
      }else if (key == 'xj') {
        return { name: '现金', color: 'purple' };
      }else if (key == 'yh') {
        return { name: '银行', color: 'purple' };
      }else {
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
  // 打印
  const printFun = (record:any)=>{
    function toDecimal2(x:any) {
      var f = parseFloat(x);
      if (isNaN(f)) {
       return false;
      }
      var f = Math.round(x*100)/100;
      var s = f.toString();
      var rs = s.indexOf('.');
      if (rs < 0) {
       rs = s.length;
       s += '.';
      }
      while (s.length <= rs + 2) {
       s += '0';
      }
      return s;
     }
    var Window = window.open("页面打印", "页面打印", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no");
    var style = `    <style type='text/css'>
    .main{width: 960px; height: 480px; margin: 0px auto; margin-top: 20px; padding: 10px; display: flex;}
    .body{width: 95%; height: 480px;}
    .title{width: 100%; height: 40px; display: flex;}
    .title .div1{width: 60%; text-align: right;}
    .title .div1 .divCtn{width: 230px; height: 40px; float: right;}
    .title .div1 .divCtn .titleCtn{width: 230px; height: 30px; line-height: 30px;text-align: center; font-size: 25px; font-weight: bold;}
    .title .div1 .divCtn .titleUdeLine{width: 280px; height: 6px; border-bottom: solid 2px #000000; border-top: solid 2px #000000;}
    .title .div2{width: 40%; text-align: right; height: 40px; line-height: 30px; font-size: 20px; font-weight: bold;}
    .date{width: 100%; height: 40px; display: flex;}
    .date .deDiv1{width: 60%; height: 40px; line-height: 40px; text-align: right; font-size: 18px;}
    .date .deDiv2{width: 40%; height: 40px;line-height: 40px;  text-align: right;font-size: 18px;}
    .tempTr1 td{text-align: center;}
    table tr td{padding: 5px;}
    .tempTr2 td{height: 40px; text-align: center;}
    .end{width: 5%; height: 480px; }
</style>`;
    var user_name = record.userName // 承租人
    var receipt_id = record.receiptId  // 收据单号
    var create_year = moment().year()  // 年
    var create_month = moment().format("MM") // 月
    var create_date = moment().format("DD") // 日
    var paymentMethod = nameColor("xj").name   // 缴费方式
    var leaseFullName = record.leaseFullName  // 门牌号标题
    // var moneyCollection =  Math.round(record.moneyCollection*Math.pow(10, 2))/Math.pow(10, 2); // 收款金额
    var moneyCollection =  toDecimal2(record.moneyCollection); // 收款金额
    var moneyCollectionCn = changeToChinese(moneyCollection.toString()) // 大写收款金额
    var paymentStartDate = record.paymentStartDate  // 缴费开始时间
    var paymentEndDate = record.paymentEndDate    // 缴费结束时间
    var content = `
<div class="main">
<div class="body">
  <div class="title">
    <div class="div1">
      <div class="divCtn">
        <div class="titleCtn">收&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;款&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;收&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;据</div>
        <div class="titleUdeLine"></div>
      </div>
    </div>
  </div>
  <div class="date">
    <div class="deDiv1">${create_year}年&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${create_month}月&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${create_date}日</div>
    <div class="deDiv2">NO：<span style="color: #000000;">${receipt_id.toString().padStart(8,"0")}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
  </div>
  <table border="1" style="width: 100%; border-collapse: collapse;">
    <td>
      <div style="height: 25px;">&nbsp; </div>
      <div style=" display: flex;"><div style="font-size: 20px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;今&nbsp;&nbsp;收&nbsp;&nbsp;到</div><div style="width: 75%; height: 30px; border-bottom: solid #000000 1px; text-align: center;font-size: 20px;">${user_name}</div></div>

      <div style="height: 14px;">&nbsp; </div>
      <div style=" display: flex;"><div style="font-size: 20px;">&nbsp;&nbsp;交&nbsp;&nbsp;&nbsp;&nbsp;来：</div><div style="width: 85%; height: 30px; border-bottom: solid #000000 1px;font-size: 20px;">&nbsp;&nbsp;椰海粮油交易市场${leaseFullName}(${paymentStartDate}至${paymentEndDate})</div></div>

      <div style="height: 14px;">&nbsp; </div>
      <div style=" display: flex;"><div style="font-size: 20px;">&nbsp;&nbsp;金额(大写)</div><div style="width: 85%; height: 30px; border-bottom: solid #000000 1px; font-size: 20px;">&nbsp;&nbsp;${moneyCollectionCn}</div></div>

      <div style="height: 14px;">&nbsp; </div>
      <div style=" display: flex;">
      <div style="font-size: 20px;">&nbsp;&nbsp;￥：</div><div style="width: 20%; height: 30px; border-bottom: solid #000000 1px; ">${moneyCollection}</div>
      <div style="font-size: 20px;">&nbsp;&nbsp;&nbsp;&nbsp;缴费方式：</div><div style="width: 10%; height: 30px; border-bottom: solid #000000 1px; text-align: center;">${paymentMethod}</div>
      <div style="font-size: 10px; margin-top:10px">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;收款单位(盖章)</div>
      </div>
      <div style="height: 5px;">&nbsp; </div>
      </td>
  </table>
  <div style="width: 100%; display: flex; height: 40px; font-size: 13px;">
    <div style="width: 50%; height: 40px; line-height: 40px;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;核准：</div>
    <div style="width: 50%; height: 40px; line-height: 40px;">会计：</div>
    <div style="width: 50%; height: 40px; line-height: 40px;">记账：</div>
    <div style="width: 50%; height: 40px; line-height: 40px;">出纳：林淑爱</div>
    <div style="width: 50%; height: 40px; line-height: 40px;">经手人：</div>



  </div>
</div>
<div class="end"><div style="margin-top: 80px; text-align: center; height: 230px;width: 100%; font-size: 10px;">①<br/>存<br/>根<br/>(白)<br/>②<br/>交<br/>对<br/>方<br/>(红)<br/>③<br/>财<br/>务<br/>(黄)</div></div>
</div>

    `
    Window.document.write(content + style);
    Window.focus();
    Window.document.close();     //关闭document的输出流, 显示选定的数据
    Window.print();               //打印当前窗口
    Window.close()  // 关闭窗口

  }



  // 租赁概要信息查询
  const columns: ProColumns<GithubIssueItem>[] = [
    // {
    //   dataIndex: 'index',
    //   valueType: 'indexBorder',
    //   width: 48,
    // },
    {
      title: '标题',
      width: 150,
      dataIndex: 'leaseFullName',
      // copyable: true, //是否支持复制
      // ellipsis: true, //标题过长会自动收缩
      hideInSearch: true,
      editable:false, // 是否可编辑
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
      // render: (_, record) => {
      //   return (
      //     <CheckableTag
      //       style={{ fontSize: 14 }}
      //       checked={false}
      //       onChange={() => {
      //         // console.log('测试标题点击事件');
      //         // setOriginData({ ...record });
      //         // setHistorySelectParams({ key: record?.key });
      //         // setDrawerVisible(true);
      //       }}
      //     >
      //       {_}
      //     </CheckableTag>
      //   );
      // },
    },
    {
      title: '来源方式',
      width: 120,
      dataIndex: 'createMethods',
      fixed: 'left',
      editable:false, // 是否可编辑
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
      title: '缴费时间',
      dataIndex: 'createTime',
      fixed: 'left',
      width: 150,
      editable:false, // 是否可编辑
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
      valueType: 'dateTime',
    },
    {
      title: '区域',
      order: 100,
      dataIndex: 'region',
      // hideInSearch: urlName == 'overview' ? false : true, // 查询表单中不展示此项
      hideInTable: true, // 在查询表格不显示
      filters: true,
      onFilter: true,
      editable:false, // 是否可编辑
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
      hideInTable: true, // 在查询表格不显示
      editable:false, // 是否可编辑
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
      editable:false, // 是否可编辑

    },
    {
      title: '门牌号',
      dataIndex: 'houseNum',
      // copyable: true, // 是否复制
      // hideInSearch:true, // 查询表单中不展示此项
      hideInTable: true, // 在查询表格不显示
      valueType: 'digit',
      editable:false, // 是否可编辑
    },
    {
      title: '承租人',
      dataIndex: 'userName',
      width: 80,
      editable:false, // 是否可编辑
      // copyable: true, // 是否复制
      // hideInSearch:true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '承租人联系方式',
      dataIndex: 'phone',
      width: 100,
      editable:false, // 是否可编辑
      // copyable: true, // 是否复制
      // hideInSearch:true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '押金单号',
      dataIndex: 'cashPledgeNum',
      width: 80,
      editable:false, // 是否可编辑
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '押金金额',
      width: 80,
      dataIndex: 'cashPledgeMoney',
      valueType: 'money',
      editable:false, // 是否可编辑
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
      editable:false, // 是否可编辑
      render: (_: any) => {
        return <span> {_ != '-' ? `${_}m\u00b2` : _}</span>;
      },
    },
    {
      title: '每平方米单价',
      valueType: 'money',
      dataIndex: 'squareMeterPrice',
      width: 100,
      editable:false, // 是否可编辑
      hideInSearch: true, // 查询表单中不展示此项
    },
    {
      title: '起租时间',
      dataIndex: 'onHireDate',
      width: 100,
      key: 'since',
      editable:false, // 是否可编辑
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
      valueType: 'date',
    },
    {
      title: '合同编号',
      dataIndex: 'contractNum',
      width: 100,
      editable:false, // 是否可编辑
      hideInSearch: true, // 查询表单中不展示此项
    },
    {
      title: '合同时间',
      key: 'contractDate',
      dataIndex: 'contractDate',
      width: 100,
      editable:false, // 是否可编辑
      hideInSearch: true, // 查询表单中不展示此项
      valueType: 'dateRange',
    },

    {
      title: '缴费时间',
      dataIndex: 'paymentDate',
      width: 100,
      editable:false, // 是否可编辑
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
      valueType: 'dateRange',
    },
    {
      title: '缴费时间间隔',
      dataIndex: 'payCostDate',
      width: 80,
      editable:false, // 是否可编辑
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '租金/月',
      dataIndex: 'rent',
      valueType: 'money',
      tip: '面积 * 平方米单价',
      width: 90,
      editable:false,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '卫生费',
      dataIndex: 'sanitationCost',
      valueType: 'money',
      width: 80,
      editable:false,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '物业费',
      dataIndex: 'property',
      valueType: 'money',
      width: 80,
      editable:false,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '免租金额',
      dataIndex: 'amountOfFree',
      valueType: 'money',
      editable:false,
      width: 100,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
    },
    {
      title: '缴费方式',
      width: 80,
      editable:false,
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
      editable:false,
      dataIndex: 'shroffAccount',
      ellipsis: true, //标题过长会自动收缩
      hideInSearch: true, // 查询表单中不展示此项
    },
    {
      title: '收款金额',
      dataIndex: 'moneyCollection',
      valueType: 'money',
      width: 80,
      editable:false,
      // copyable: true, // 是否复制
      hideInSearch: true, // 查询表单中不展示此项
      // hideInTable:true, // 在查询表格不显示
      fixed: 'right',
    },
    {
      title: '是否已收款',
      width: 80,
      dataIndex: 'collection',
      // hideInSearch: true, // 查询表单中不展示此项
      hideInTable:true, // 在查询表格不显示
      valueType: 'select',
      fixed: 'right',
      editable:false,
      fieldProps: {
        options: [
          {
            label: '全部',
            value: "all",

          },
          {
            label: '已收款',
            value: true,
          },
          {
            label: '未收款',
            value: false,

          },
        ],
      },
    },
    {
      title: '是否已收款',
      width: 80,
      dataIndex: 'collection',
      hideInSearch: true, // 查询表单中不展示此项
      valueType: 'select',
      fixed: 'right',
      fieldProps: {
        options: [
          {
            label: '已收款',
            value: true,
          },
          {
            label: '未收款',
            value: false,

          },
        ],
      },
      // render: (_: any, record: any) => (
      //   <Space>
      //     {/* <Tag color={nameColor(_).color}>{nameColor(_).name}</Tag> */}
      //     {/* <Tag >{_}</Tag> */}
      //   </Space>
      // ),
      render: (_: any, record: any) => {
        if(record.collection == false){
          return <Tag color={"#f50"}>{_}</Tag>
        }else{
          return <Tag color={"#2db7f5"}>{_}</Tag>
        }
      },
    },

    // {
    //   title: '备注',
    //   dataIndex: 'remark',
    //   // copyable: true, // 是否复制
    //   hideInSearch: true, // 查询表单中不展示此项
    //   // hideInTable:true, // 在查询表格不显示
    // },

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
            action?.startEditable?.(record.receiptId);
            // setUpdateFromData({
            //   ...updateFromData,
            //   leaseFullName: record.leaseFullName,
            //   key: record.key,
            //   leaseStatus: record.leaseStatus,
            // });
            // updateFormRef.setFieldsValue(record);
            // // if(record.invoice){
            // //   updateFormRef.setFieldsValue({invoice: 'true'})
            // // }else{

            // // }
            // setUpdateVisible(true);
          }}
        >
          修改
        </a>,
        <a
          onClick={() => {
            printFun({...record})
            // setOriginData({ ...record });
            // setHistorySelectParams({ key: record?.key });
            // setDrawerVisible(true);
          }}
          target="_blank"
          rel="noopener noreferrer"
          key="view"
        >
          打印收据
        </a>,
        // <TableDropdown
        //   key="actionGroup"
        //   onSelect={(item: any) => {
        //     console.log(item)
        //   }}
        //   menus={[
        //     { key: 'rentOut', name: '出租', title: '只有闲置中的房屋才能进行出租操作', disabled: record.leaseStatus == "idle" ? false : true },
        //     { key: 'relet', name: '续租(合同续约)', title: '只有租赁中的房屋才能进行续租操作', disabled: record.leaseStatus == "underway" ? false : true },
        //     { key: 'payment', name: '缴费(续费)', title: '只有租赁中的房屋才能进行续费操作', disabled: record.leaseStatus == "underway" ? false : true },
        //     { key: 'surrender', name: '退租', title: '只有租赁中或免费的房屋才能进行退租操作', disabled: record.leaseStatus == "idle" ? true : false },
        //   ]}
        // />,
      ],
    },
  ];



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
            data: res.data.items,
          };
        }}
        editable={{
          type: 'multiple',
          actionRender: (row, config, defaultDom) => [defaultDom.save, defaultDom.cancel],
        }}
        scroll={{ x: 2900 }}
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
          total: requeTotal,
        }}
        dateFormatter="string"
        headerTitle="缴费单记录"
        toolBarRender={() => [
          <ModalForm<{
            name: string;
            company: string;
          }>
            title="导出excel--条件过滤"
            trigger={
              <Button type="primary" disabled>
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
              await downRequest.run({...excelFormRef.getFieldsValue()});
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
                treeDefaultExpandAll:true,
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
                treeDefaultExpandAll:true,
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

    </>
  );
};
