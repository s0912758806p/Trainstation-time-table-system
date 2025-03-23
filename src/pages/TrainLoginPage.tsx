import { login } from '../store/authSlice';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { Input, Button, Form, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/trainLoginPage.scss';

const { Title } = Typography;

const TrainLoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = (values: { username: string; password: string }) => {
    const { username, password } = values;

    if (!username || !password) {
      message.error('請輸入用戶名和密碼');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      dispatch(login({ username }));
      setLoading(false);
      navigate('/schedule');
      message.success('登錄成功');
    }, 1000);
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
        </Form.Item>
      </Form>
    </div>
  );
};

export default TrainLoginPage;
