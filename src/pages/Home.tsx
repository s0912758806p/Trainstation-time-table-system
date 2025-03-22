import { Layout } from 'antd';

const { Header, Content, Footer } = Layout;

const Home = () => {
  return (
    <Layout className="min-h-screen">
      <Header className="bg-white">
        <h1 className="text-2xl font-bold">火車時刻表查詢系統</h1>
      </Header>
      <Content className="p-6">
        <div className="bg-white p-6 rounded-lg shadow">
          {/* 這裡將添加搜尋表單和時刻表顯示 */}
          <p>歡迎使用火車時刻表查詢系統</p>
        </div>
      </Content>
      <Footer className="text-center">
        Train Schedule ©{new Date().getFullYear()} Created by Your Name
      </Footer>
    </Layout>
  );
};

export default Home; 