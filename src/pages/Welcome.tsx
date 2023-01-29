import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography, notification, Spin, Tag } from 'antd';
import { useModel, useRequest, history, FormattedMessage, useIntl } from 'umi';
import styles from './Welcome.less';
import { StatisticCard } from '@ant-design/pro-card';
import { LikeOutlined, createFromIconfontCN } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import moment from 'moment';
import RcResizeObserver from 'rc-resize-observer';
import { DecompositionTreeGraph } from '@ant-design/graphs';
import ProTable, { TableDropdown } from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import {
  getLeaseResult,
  addLeaseResult,
  getHistoryLeaseResult,
  reletLeaseResult,
  deleteLeaseResult,
  rentOutLeaseResult,
  updateLeaseResult,
} from '@/services/ant-design-pro/lease';
import { foundInData, overviewData, getCustomerDetails, getYearFinancialStatistics, getQuarterFinancialStatistics, getMonthFinancialStatistics } from '@/services/ant-design-pro/marker';

const CodePreview: React.FC = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);

const imgStyle = {
  display: 'block',
  width: 42,
  height: 42,
  fontSize: 40,
};
const iconUrl = process.env.iconUrl;
const MyIcon = createFromIconfontCN({
  scriptUrl: iconUrl, // 在iconfont.cn 上生成
});
type GithubIssueItem = {
  userName: any; //承租人
  leaseFullName: []; // 房屋标题
  phone: any; //手机号码
  onHireDate: any; //起租时间
  totalSquareMeter: any; //总平方米
  totalCashPledgeMoney: any; //总押金金额
  totalAmountOfFree: any; // 总免租金额
  totalAccountReceivable: any; //总应收款金额
  totalMoneyReceivable: any; //总实收金额
  totalFloors: any; //房屋间数
  totalPredict: any; //快到期
  totalOverdue: any; // 已逾期
};
type FinanceItem = {
  year: any; //年份
  customerNum: any; //客户数
  totalSquareMeter: any; //总平方米
  totalCashPledgeMoney: any; //总押金金额
  totalAmountOfFree: any; //总免租金额
  totalAccountReceivable: any; // 总应收款金额
  totalMoneyReceivable: any; // 总实收金额
};
type quarterFinanceItem = {
  quarter: any; //季度
  customerNum: any; //客户数
  totalSquareMeter: any; //总平方米
  totalCashPledgeMoney: any; //总押金金额
  totalAmountOfFree: any; //总免租金额
  totalAccountReceivable: any; // 总应收款金额
  totalMoneyReceivable: any; // 总实收金额
};
export default (): React.ReactNode => {
  const [responsive, setResponsive] = useState(false);
  const [ratioResponsive, setRatioResponsive] = useState(false);
  const [yearTotal, setYearTotal] = useState(0); // 年度
  const [quarterTotal, setQuarterTotal] = useState(0); // 季度
  const [monthTotal, setMonthTotal] = useState(0); // 月度

  const [detailsTotal, setDetailsTotal] = useState(0);
  const intl = useIntl();
  // 初始化数据
  const [initData, setInitData] = useState({
    globalWidth: 0,
    globalHeight: 600,
    foundInData: {
      id: "init",
      value: {
        tittle: "初始化加载中",
        items: [{ text: "初始化加载中" }]
      }
    }, //房屋分布数据-区域分组
    foundInClassNameData: {
      id: "init",
      value: {
        tittle: "初始化加载中",
        items: [{ text: "初始化加载中" }]
      }
    }, //房屋分布数据-区域分组

    customerNum: 0, //客户数
    totalSquareMeter: 0, // 房屋总面积
    totalAccountReceivable: 0, // 总应收款金额
    totalMoneyReceivable: 0, // 总应收款金额
    totalFloors: 0, // 房屋间数
    totalPredict: 0, //缴费快到期
    totalOverdue: 0, // 缴费已逾期
    totalContractAlmostHere: 0, // 合同快到期
    totalContractOverdue: 0, // 合同已逾期
    overviewDataLoading: false, // 数据概要loadding
  });
  const DemoDecompositionTreeGraph = () => {
    const data = initData.foundInData
    const config = {
      data,
      markerCfg: (cfg: any) => {
        const { children } = cfg;
        return {
          show: children?.Length,
        };
      },
      behaviors: [],
    };
    return <DecompositionTreeGraph {...config} />;
  };

  const DemoDecompositionTreeGraph2 = () => {
    const data = initData.foundInClassNameData
    const config = {
      data,
      markerCfg: (cfg: any) => {
        const { children } = cfg;
        return {
          show: children?.Length,
        };
      },
      behaviors: [],
    };
    return <DecompositionTreeGraph {...config} />;
  };
  // 网络请求
  //房屋分布统计请求
  const foundInDataRequest = useRequest(foundInData, {
    manual: false,
    onSuccess: (data: any, params: any) => {
      // console.log(ErrorHandle)
      // console.log(data.ErrorInfo)
      console.log('************');
      if (data) {
        console.log(data)
        const height = data.count * 120 // 高度自适应
        setInitData({
          ...initData,
          foundInData: data.regionData,
          foundInClassNameData: data.classNameData,
          globalHeight: height,
        })
        console.log("请求成功")
      } else {
        notification.info({
          description: '房屋分布统计获取数据失败',
          message: '房屋分布统计获取数据失败',
        });
      }
    },
    onError: (error: any, params: any) => {
      console.log('收到响应数据error:', error.data);
      notification.error({
        description: error.data.ErrorInfo.errDec,
        message: '房屋分布统计获取数据失败',
      });
    },
  });
  //数据概览请求
  const overviewDataRequest = useRequest(overviewData, {
    manual: false,

    onSuccess: (data: any, params: any) => {
      // console.log(ErrorHandle)
      // console.log(data.ErrorInfo)
      console.log('************');
      if (data) {
        console.log(data)
        setInitData({ ...initData, ...data })
        console.log("请求成功")
      } else {
        notification.info({
          description: '数据概览计获取数据失败',
          message: '数据概览获取数据失败',
        });
      }
    },
    onError: (error: any, params: any) => {
      console.log('收到响应数据error:', error.data);
      notification.error({
        description: error.data.ErrorInfo.errDec,
        message: '数据概览获取数据失败',
      });
    },
  });

  //客户详情
  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '承租人',
      dataIndex: 'userNamePhone',
      fixed: 'left',
      // width: 150,
    },
    {
      title: '门牌号',
      dataIndex: 'leaseFullName',
      fixed: 'left',
      width: 400,
      render: (_: any) => (
        <>
          {_.map(_ => {
            return (
              <Tag color={"blue"} key={_}>
                {_.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: '起租时间',
      dataIndex: 'onHireDate',
      valueType: 'date',
    },
    {
      title: '总平方米',
      dataIndex: 'totalSquareMeter',
      valueType: 'text',
      render: (_: any) => {
        return <span> {_ != '-' ? `${_}m\u00b2` : _}</span>;
      },
    },
    {
      title: '总押金金额',
      dataIndex: 'totalCashPledgeMoney',
      valueType: 'money',
    },
    {
      title: '总免租金额',
      dataIndex: 'totalAmountOfFree',
      valueType: 'money',
      // width: 100,
    },
    {
      title: '合同总应收款',
      dataIndex: 'totalAccountReceivable',
      valueType: 'money',
      // width: 100,
    },
    {
      title: '总实收金额',
      dataIndex: 'totalMoneyReceivable',
      valueType: 'money',
      // width: 100,
    },
    {
      title: '租赁间数',
      dataIndex: 'totalFloors',
    },
    {
      title: '缴费快到期数',
      dataIndex: 'totalPredict',
    },
    {
      title: '缴费已逾期数',
      dataIndex: 'totalOverdue',
    },
    {
      title: '合同快到期数',
      dataIndex: 'totalContractPredict',
    },
    {
      title: '合同已逾期数',
      dataIndex: 'totalContractOverdue',
    },
  ];
  //年度财务概要
  const financeColumns: ProColumns<FinanceItem>[] = [
    {
      title: '年份',
      dataIndex: 'date',
    },
    {
      title: '客户数',
      dataIndex: 'userNum',
    },

    {
      title: '总押金金额',
      dataIndex: 'cashPledgeMoney',
      valueType: 'money',
    },
    {
      title: '总免租金额',
      dataIndex: 'amountOfFree',
      valueType: 'money',
    },
    {
      title: '总应收款金额',
      dataIndex: 'accountReceivable',
      valueType: 'money',
      width: 100,
    },
    {
      title: '总实收金额',
      dataIndex: 'moneyReceivable',
      valueType: 'money',
      width: 100,
    },
  ];
  //季度财务概要
  const quarterfinanceColumns: ProColumns<FinanceItem>[] = [
    {
      title: '季度',
      dataIndex: 'date',
    },
    {
      title: '客户数',
      dataIndex: 'userNum',
    },

    {
      title: '总押金金额',
      dataIndex: 'cashPledgeMoney',
      valueType: 'money',
    },
    {
      title: '总免租金额',
      dataIndex: 'amountOfFree',
      valueType: 'money',
    },
    {
      title: '总应收款金额',
      dataIndex: 'accountReceivable',
      valueType: 'money',
      width: 100,
    },
    {
      title: '总实收金额',
      dataIndex: 'moneyReceivable',
      valueType: 'money',
      width: 100,
    },
  ];
  return (
    <>
      <RcResizeObserver
        key="resize-observer"
        onResize={(offset) => {
          setResponsive(offset.width < 800);

          setInitData({ ...initData, globalWidth: offset.width })
        }}
      >
        <ProCard
          title="数据概览"
          extra={moment().format('YYYY年MM月DD日\xa0\xa0\xa0\xa0dddd')}
          split={responsive ? 'horizontal' : 'vertical'}
          // wrap
          bordered
          headerBordered
        >
          <Spin tip="加载中..." spinning={overviewDataRequest.loading}>
            <StatisticCard.Group direction={responsive ? 'column' : 'row'}>
              <StatisticCard
                statistic={{
                  title: '客户数',
                  value: initData.customerNum,
                  // prefix: <MyIcon type="icon-yonghu1" />,
                }}
              />
              <StatisticCard
                statistic={{
                  title: '累计总应收款',
                  value: initData.totalAccountReceivable,
                  // prefix: initData.globalWidth >= 596 && initData.globalWidth < 1300 ? false : <MyIcon type="icon-a-zijinqiandai" style={{ color: 'red' }} />,
                  precision: 2,
                  suffix: '万元',
                }}
              />
              <StatisticCard
                statistic={{
                  title: '累计总实收款',
                  value: initData.totalMoneyReceivable,
                  // prefix: initData.globalWidth >= 596 && initData.globalWidth < 1300 ? false : <MyIcon type="icon-a-zijinqiandai" style={{ color: 'red' }} />,
                  precision: 2,
                  suffix: '万元',
                }}
              />
              <StatisticCard
                statistic={{
                  title: '房屋总面积',
                  value: initData.totalSquareMeter,
                  suffix: '万m\u00b2',
                  // prefix: <MyIcon type="icon-mianji-mian" />,
                }}
              />
              <StatisticCard
                statistic={{
                  title: '房屋总数',
                  value: initData.totalFloors,
                  // prefix: <MyIcon type="icon-tuya_huabanfuben" />,
                }}
              />
              <StatisticCard
                statistic={{
                  title: '缴费快到期',
                  value: initData.totalPredict,
                  // prefix: <MyIcon type="icon-ICAtubiao_huodongdaojishi" />,
                }}
              />
              <StatisticCard
                statistic={{
                  title: '缴费已逾期',
                  value: initData.totalOverdue,
                  // prefix: <MyIcon type="icon-yuqi-red" />,
                }}
              />
              <StatisticCard
                statistic={{
                  title: '合同快到期',
                  value: initData.totalContractAlmostHere,
                  // prefix: <MyIcon type="icon-yuqi-red" />,
                }}
              />
              <StatisticCard
                statistic={{
                  title: '合同已到期',
                  value: initData.totalContractOverdue,
                  // prefix: <MyIcon type="icon-yuqi-red" />,
                }}
              />
            </StatisticCard.Group>
          </Spin>
        </ProCard>
      </RcResizeObserver>
      <RcResizeObserver
        key="resize-observer"
        onResize={(offset) => {
          setRatioResponsive(offset.width < 1200);
        }}
      >
        <ProCard
          title="房屋分布统计"
          // split={ratioResponsive ? 'horizontal' : 'vertical'}
          split={'vertical'}
          bordered
          headerBordered
          wrap
          style={{ marginTop: 16 }}
        >
          <ProCard style={{ height: initData.globalHeight }} colSpan={{ xs: 24, sm: 24, md: 24, lg: 24, xl: 12 }} bordered>
            <DemoDecompositionTreeGraph />
          </ProCard>
          <ProCard style={{ height: initData.globalHeight }} colSpan={{ xs: 24, sm: 24, md: 24, lg: 24, xl: 12 }} bordered >
            <DemoDecompositionTreeGraph2 />
          </ProCard>
        </ProCard>
      </RcResizeObserver>
      <ProCard
        split={'vertical'}
        // split={'horizontal'}
        bordered
        headerBordered
        wrap
        style={{ marginTop: 16 }}

      >
        <ProCard colSpan={{ xs: 24, sm: 24, md: 24, lg: 24, xl: 12 }} style={{ marginTop: 0 }} split={'horizontal'}>
          <ProCard title="年度财务统计"  >
            <ProTable<FinanceItem>
              //params={selectParams}
              columns={financeColumns}
              //actionRef={actionRef}
              //defaultSize={10}
              request={async (params, sorter, filter) => {
                //表单搜索项会从 params 传入,传递给后端接口。
                console.log(params, sorter, filter);
                const res = await getYearFinancialStatistics({ ...params, sorter, filter });
                console.log('测试查询结果:', res.data);
                setYearTotal(res.data.total);
                return {
                  success: true,
                  data: res.data.items,
                };
              }}
              editable={{
                type: 'multiple',
              }}
              // scroll={{ x: 600 }}
              columnsState={{
                persistenceKey: 'pro-table-singe-demos',
                persistenceType: 'localStorage',
              }}
              rowKey="key"
              // search={{
              //   LabelWidth: 'auto',
              //   collapseRender: false,
              //   defaultCollapsed: false,
              //   //span:3,
              // }}
              search={false}
              options={false}
              pagination={{
                defaultPageSize: 5,
                showQuickJumper: true,
                total: yearTotal,// 待修改
              }}
              dateFormatter="string"
            />
          </ProCard>
          <ProCard title="季度财务统计" bordered={false}  >
          <ProTable<FinanceItem>
            //params={selectParams}
            columns={quarterfinanceColumns}
            //actionRef={actionRef}
            //defaultSize={10}
            request={async (params, sorter, filter) => {
              //表单搜索项会从 params 传入,传递给后端接口。
              console.log(params, sorter, filter);
              const res = await getQuarterFinancialStatistics({ ...params, sorter, filter });
              console.log('测试查询结果:', res.data);
              setQuarterTotal(res.data.total);
              return {
                success: true,
                data: res.data.items,
              };
            }}
            editable={{
              type: 'multiple',
            }}
            // scroll={{ x: 600 }}
            columnsState={{
              persistenceKey: 'pro-table-singe-demos',
              persistenceType: 'localStorage',
            }}
            rowKey="key"
            // search={{
            //   LabelWidth: 'auto',
            //   collapseRender: false,
            //   defaultCollapsed: false,
            //   //span:3,
            // }}
            search={false}
            options={false}
            pagination={{
              defaultPageSize: 15,
              showQuickJumper: true,
              total: quarterTotal,// 待修改
              // total: 5, //待修改
            }}
            dateFormatter="string"
          />
        </ProCard>
        </ProCard>
        <ProCard title="月度财务统计" colSpan={{ xs: 24, sm: 24, md: 24, lg: 24, xl: 12 }} bordered={false}  >
          <ProTable<FinanceItem>
            //params={selectParams}
            columns={quarterfinanceColumns}
            //actionRef={actionRef}
            //defaultSize={10}
            request={async (params, sorter, filter) => {
              //表单搜索项会从 params 传入,传递给后端接口。
              console.log(params, sorter, filter);
              const res = await getMonthFinancialStatistics({ ...params, sorter, filter });
              console.log('测试查询结果:', res.data);
              setMonthTotal(res.data.total);
              return {
                success: true,
                data: res.data.items,
              };
            }}
            editable={{
              type: 'multiple',
            }}
            // scroll={{ x: 600 }}
            columnsState={{
              persistenceKey: 'pro-table-singe-demos',
              persistenceType: 'localStorage',
            }}
            rowKey="key"
            // search={{
            //   LabelWidth: 'auto',
            //   collapseRender: false,
            //   defaultCollapsed: false,
            //   //span:3,
            // }}
            search={false}
            options={false}
            pagination={{
              defaultPageSize: 20,
              showQuickJumper: true,
              total: monthTotal,// 待修改
              // total: 5, //待修改
            }}
            dateFormatter="string"
          />
        </ProCard>
      </ProCard>

      <ProCard
        title="客户详情"
        split={responsive ? 'horizontal' : 'vertical'}
        bordered
        headerBordered
        style={{ marginTop: 16 }}
      >
        <ProTable<GithubIssueItem>
          //params={selectParams}
          columns={columns}
          //actionRef={actionRef}
          //defaultSize={10}
          request={async (params, sorter, filter) => {
            //表单搜索项会从 params 传入,传递给后端接口。
            console.log(params, sorter, filter);
            const res = await getCustomerDetails({ ...params, sorter, filter });
            console.log('测试查询结果:', res.data);
            setDetailsTotal(res.data.total);
            return {
              success: true,
              data: res.data.items,
            };
          }}
          editable={{
            type: 'multiple',
          }}
          scroll={{ x: 1500 }}
          columnsState={{
            persistenceKey: 'pro-table-singe-demos',
            persistenceType: 'localStorage',
          }}
          rowKey="key"
          // search={{
          //   LabelWidth: 'auto',
          //   collapseRender: false,
          //   defaultCollapsed: false,
          //   //span:3,
          // }}
          search={false}
          options={false}
          pagination={{
            defaultPageSize: 20,
            showQuickJumper: true,
            total: detailsTotal,// 待修改
            // total: 5, //待修改
          }}
          dateFormatter="string"
        />
      </ProCard>
    </>
  );
};
