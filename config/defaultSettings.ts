import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: "dark",
  layout: "side",
  contentWidth: "Fluid",
  headerHeight: 48,
  primaryColor: "#1890ff",
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  title: '数字海南笔试',
  pwa: false,
  logo: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
  iconfontUrl: '',
};

export default Settings;
