import { login } from '../store/authSlice';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { Input, Button, Form, message, Divider } from 'antd';
import { UserOutlined, LockOutlined, RocketOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { loginApi, LoginRequestParams } from '../api/auth';
import '../assets/styles/trainLoginPage.scss';

interface LoginFormValues extends LoginRequestParams {
  remember?: boolean;
}

const FEATURES = [
  '全台灣鐵路班次即時查詢',
  '多條件篩選，精準找到您的列車',
  '票務與訂單集中管理',
  '支援訪客快速瀏覽，無需註冊',
];

const TrainLoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);

  const handleLogin = async (values: LoginFormValues) => {
    const { username, password } = values;
    if (!username || !password) {
      message.error('請輸入帳號與密碼');
      return;
    }

    setLoading(true);
    try {
      const response = await loginApi({ username, password });
      dispatch(
        login({
          ...response.user,
          token: response.token,
          refreshToken: response.refreshToken,
          expiresIn: response.expiresIn,
        })
      );
      navigate('/dashboard');
      message.success('歡迎回來！');
    } catch {
      message.error('帳號或密碼錯誤，請再試一次');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    setGuestLoading(true);
    setTimeout(() => {
      dispatch(
        login({
          username: '訪客用戶',
          role: 'guest',
          isGuest: true,
          token: 'guest-token-' + Math.random().toString(36).substring(2),
          expiresIn: 3600,
        })
      );
      setGuestLoading(false);
      navigate('/dashboard');
      message.success('已以訪客身份進入');
    }, 500);
  };

  return (
    <div className="login-root">
      {/* ── Left branding panel ── */}
      <div className="login-left">
        <div className="login-left-content">
          <div className="login-brand-mark">
            <div className="login-brand-icon">
              <RocketOutlined style={{ color: '#fff' }} />
            </div>
            <span className="login-brand-name">台鐵查詢系統</span>
          </div>

          <h1 className="login-headline">
            輕鬆掌握<br />每一班列車
          </h1>
          <p className="login-subline">
            整合時刻、票務、路線資訊，讓您的鐵路旅程規劃更簡單、更準確。
          </p>

          <ul className="login-features" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {FEATURES.map((f) => (
              <li key={f} className="login-feature-item">
                <span className="login-feature-dot" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="login-right">
        <div className="login-form-wrap">
          <div className="login-form-header">
            <h2 className="login-form-title">歡迎回來</h2>
            <p className="login-form-subtitle">請輸入您的帳號資訊以繼續</p>
          </div>

          <Form
            name="login"
            layout="vertical"
            onFinish={handleLogin}
            requiredMark={false}
          >
            <Form.Item
              name="username"
              label="帳號"
              rules={[{ required: true, message: '請輸入帳號' }]}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#94a3b8' }} />}
                placeholder="輸入您的帳號"
                disabled={loading || guestLoading}
                autoComplete="username"
              />
            </Form.Item>

            <Form.Item
              name="password"
              label="密碼"
              rules={[{ required: true, message: '請輸入密碼' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#94a3b8' }} />}
                placeholder="輸入您的密碼"
                disabled={loading || guestLoading}
                autoComplete="current-password"
              />
            </Form.Item>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                marginBottom: 20,
                marginTop: -8,
              }}
            >
              <Button
                type="link"
                style={{ padding: 0, fontSize: 13, color: '#6366f1', height: 'auto' }}
              >
                忘記密碼？
              </Button>
            </div>

            <Form.Item style={{ marginBottom: 12 }}>
              <Button
                type="primary"
                htmlType="submit"
                className="login-submit-btn"
                block
                loading={loading}
                disabled={guestLoading}
              >
                登入
              </Button>
            </Form.Item>

            <div className="login-divider">
              <span>或</span>
            </div>

            <Form.Item style={{ marginBottom: 0 }}>
              <Button
                className="login-guest-btn"
                block
                onClick={handleGuestLogin}
                loading={guestLoading}
                disabled={loading}
              >
                以訪客身份快速瀏覽
              </Button>
            </Form.Item>
          </Form>

          <p className="login-footer-text">
            還沒有帳號？{' '}
            <Link to="/register">立即免費註冊</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrainLoginPage;
