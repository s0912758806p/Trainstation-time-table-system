import { login } from '../store/authSlice';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { Input, Button, Form, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { loginApi, LoginRequestParams } from '../api/auth';
import '../assets/styles/trainLoginPage.scss';

const { Title } = Typography;

interface LoginFormValues extends LoginRequestParams {
  remember?: boolean;
}

const TrainLoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (values: LoginFormValues) => {
    const { username, password } = values;

    if (!username || !password) {
      message.error('請輸入用戶名和密碼');
      return;
    }

    setLoading(true);

    try {
      // 調用登入 API
      const response = await loginApi({ username, password });

      // 成功後更新 Redux 狀態
      dispatch(
        login({
          ...response.user,
          token: response.token,
          refreshToken: response.refreshToken,
          expiresIn: response.expiresIn,
        })
      );

      setLoading(false);
      navigate('/schedule');
      message.success('登錄成功');
    } catch (error) {
      console.error('Login failed:', error);
      setLoading(false);
      message.error('登錄失敗，請檢查用戶名和密碼');
    }
  };

  return (
    <div className="login-page">
      <Title level={2} style={{ textAlign: 'center' }}>
        火車時刻表登錄
      </Title>
      <Form
        name="login_form"
        className="login-form"
        initialValues={{ remember: true }}
        onFinish={handleLogin}
        style={{ maxWidth: 300, margin: '0 auto' }}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: '請輸入用戶名' }]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="用戶名"
            disabled={loading}
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: '請輸入密碼' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="密碼"
            disabled={loading}
          />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Button type="link" style={{ padding: 0 }} disabled={loading}>
              記住我
            </Button>
          </Form.Item>
          <Button
            type="link"
            style={{ float: 'right', padding: 0 }}
            disabled={loading}
          >
            忘記密碼?
          </Button>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
            block
            loading={loading}
          >
            登錄
          </Button>
          或 <Link to="/register">立即註冊</Link>
        </Form.Item>
      </Form>
    </div>
  );
};

export default TrainLoginPage;
