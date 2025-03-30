import React, { useState } from 'react';
import {
  Form,
  Input,
  Button,
  Typography,
  Select,
  DatePicker,
  Checkbox,
  Alert,
  Divider,
  Space,
  Card,
  Steps,
  message,
} from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  IdcardOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { Step } = Steps;

interface RegisterFormValues {
  username: string;
  password: string;
  confirmPassword: string;
  email: string;
  name: string;
  idNumber: string;
  phone: string;
  birthdate: dayjs.Dayjs;
  gender: string;
  termsAccepted: boolean;
  verificationCode: string;
}

const RegisterPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [submittedValues, setSubmittedValues] =
    useState<RegisterFormValues | null>(null);

  const onFinish = async (values: RegisterFormValues) => {
    setLoading(true);
    setError(null);

    try {
      // 模擬API請求延遲
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmittedValues(values);
      message.success('註冊成功！請登入您的帳號。');
      navigate('/login');
    } catch (err) {
      setError('註冊時發生錯誤，請檢查您的資料後重試。');
      console.error('註冊失敗:', err);
    } finally {
      setLoading(false);
    }
  };

  const sendVerificationCode = async () => {
    const email = form.getFieldValue('email');
    if (!email) {
      message.error('請先輸入電子郵件地址');
      return;
    }

    setLoading(true);
    try {
      // 實際應用中，這裡會調用API發送驗證碼
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setEmailSent(true);
      message.success(`驗證碼已發送至 ${email}`);
    } catch (err) {
      message.error('發送驗證碼失敗，請稍後重試');
    } finally {
      setLoading(false);
    }
  };

  const checkPassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('請輸入您的密碼'));
    }
    if (value.length < 8) {
      return Promise.reject(new Error('密碼長度不可少於8個字元'));
    }
    if (!/[A-Z]/.test(value)) {
      return Promise.reject(new Error('密碼需包含至少一個大寫字母'));
    }
    if (!/[a-z]/.test(value)) {
      return Promise.reject(new Error('密碼需包含至少一個小寫字母'));
    }
    if (!/\d/.test(value)) {
      return Promise.reject(new Error('密碼需包含至少一個數字'));
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
      return Promise.reject(new Error('密碼需包含至少一個特殊字元'));
    }
    return Promise.resolve();
  };

  const checkConfirmPassword = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('請再次輸入您的密碼'));
    }

    if (value !== form.getFieldValue('password')) {
      return Promise.reject(new Error('兩次輸入的密碼不一致'));
    }

    return Promise.resolve();
  };

  const validateIdNumber = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(new Error('請輸入您的身份證字號'));
    }

    // 台灣身分證驗證規則
    const idNumberPattern = /^[A-Z][12]\d{8}$/;
    if (!idNumberPattern.test(value)) {
      return Promise.reject(new Error('身份證字號格式不正確'));
    }

    return Promise.resolve();
  };

  const nextStep = async () => {
    try {
      if (currentStep === 0) {
        // 驗證第一步的表單
        await form.validateFields([
          'username',
          'email',
          'password',
          'confirmPassword',
          'verificationCode',
        ]);
      } else if (currentStep === 1) {
        // 驗證第二步的表單
        await form.validateFields([
          'name',
          'idNumber',
          'phone',
          'birthdate',
          'gender',
        ]);
      }

      setCurrentStep(currentStep + 1);
    } catch (errorInfo) {
      console.log('表單驗證失敗:', errorInfo);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const steps = [
    {
      title: '帳號資訊',
      content: (
        <>
          <Form.Item
            name="username"
            rules={[
              { required: true, message: '請輸入您的使用者名稱' },
              { min: 4, message: '使用者名稱長度不可少於4個字元' },
              { max: 20, message: '使用者名稱長度不可超過20個字元' },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: '使用者名稱只能包含英文字母、數字及底線',
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="使用者名稱"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: '請輸入您的電子郵件地址' },
              { type: 'email', message: '請輸入有效的電子郵件地址' },
            ]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon" />}
              placeholder="電子郵件"
              size="large"
            />
          </Form.Item>

          <Form.Item name="password" rules={[{ validator: checkPassword }]}>
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="密碼"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[{ validator: checkConfirmPassword }]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              placeholder="確認密碼"
              size="large"
            />
          </Form.Item>

          <div className="flex items-center gap-2">
            <Form.Item
              name="verificationCode"
              rules={[
                { required: true, message: '請輸入驗證碼' },
                { len: 6, message: '驗證碼應為6位數字' },
                { pattern: /^\d+$/, message: '驗證碼應為數字' },
              ]}
              style={{ flex: 1, marginBottom: 0 }}
            >
              <Input
                prefix={<SafetyCertificateOutlined />}
                placeholder="請輸入驗證碼"
                size="large"
              />
            </Form.Item>
            <Button
              type="primary"
              onClick={sendVerificationCode}
              loading={loading && !emailSent}
              disabled={emailSent}
            >
              {emailSent ? '驗證碼已發送' : '獲取驗證碼'}
            </Button>
          </div>
          {emailSent && (
            <Text type="secondary" className="mt-1 block">
              驗證碼已發送到您的郵箱，有效期為10分鐘
            </Text>
          )}
        </>
      ),
    },
    {
      title: '個人資訊',
      content: (
        <>
          <Form.Item
            name="name"
            rules={[
              { required: true, message: '請輸入您的姓名' },
              { min: 2, message: '姓名長度不可少於2個字元' },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="姓名"
              size="large"
            />
          </Form.Item>

          <Form.Item name="idNumber" rules={[{ validator: validateIdNumber }]}>
            <Input
              prefix={<IdcardOutlined className="site-form-item-icon" />}
              placeholder="身份證字號（例如：A123456789）"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="phone"
            rules={[
              { required: true, message: '請輸入您的手機號碼' },
              {
                pattern: /^09\d{8}$/,
                message: '請輸入有效的台灣手機號碼格式（例如：0912345678）',
              },
            ]}
          >
            <Input
              prefix={<PhoneOutlined className="site-form-item-icon" />}
              placeholder="手機號碼"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="birthdate"
            rules={[
              { required: true, message: '請選擇您的出生日期' },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();
                  const age = dayjs().diff(value, 'year');
                  return age >= 12
                    ? Promise.resolve()
                    : Promise.reject(new Error('您必須年滿12歲才能註冊'));
                },
              },
            ]}
          >
            <DatePicker
              placeholder="出生日期"
              style={{ width: '100%' }}
              size="large"
              format="YYYY-MM-DD"
              disabledDate={(current) =>
                current && current > dayjs().endOf('day')
              }
            />
          </Form.Item>

          <Form.Item
            name="gender"
            rules={[{ required: true, message: '請選擇您的性別' }]}
          >
            <Select placeholder="性別" size="large">
              <Option value="male">男</Option>
              <Option value="female">女</Option>
              <Option value="other">其他</Option>
              <Option value="preferNotToSay">不願透露</Option>
            </Select>
          </Form.Item>
        </>
      ),
    },
    {
      title: '條款與隱私',
      content: (
        <>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg max-h-60 overflow-y-auto">
            <Title level={5}>台鐵列車資訊系統使用條款</Title>
            <Paragraph>
              歡迎使用台鐵列車資訊系統（以下簡稱「本系統」）。本條款制定的目的，是為了保障您的權益，並確保台鐵列車資訊系統服務的正常運行。
            </Paragraph>
            <Paragraph>
              <strong>1. 會員註冊與帳號安全</strong>
              <br />
              1.1 您必須提供真實、準確、完整的個人資料，並在資料變更時及時更新。
              <br />
              1.2
              妥善保管您的帳號和密碼，所有使用您帳號密碼進行的活動均由您負責。
            </Paragraph>
            <Paragraph>
              <strong>2. 隱私權保護</strong>
              <br />
              2.1
              本系統重視您的隱私權，未經您的同意，不會將您的個人資料提供給任何第三方。
              <br />
              2.2 本系統收集的資料僅用於改善服務及提供個人化體驗。
            </Paragraph>
            <Paragraph>
              <strong>3. 使用條款</strong>
              <br />
              3.1 您同意遵守中華民國相關法律法規。
              <br />
              3.2 禁止利用本系統進行任何非法活動或侵害他人權益的行為。
            </Paragraph>
            <Paragraph>
              <strong>4. 服務變更與終止</strong>
              <br />
              4.1 本系統保留隨時修改或終止服務的權利，恕不另行通知。
              <br />
              4.2 本系統有權在您違反使用條款的情況下，暫停或終止您的帳號使用權。
            </Paragraph>
            <Paragraph>
              <strong>5. 免責聲明</strong>
              <br />
              5.1 本系統提供的資訊僅供參考，實際情況請以台鐵官方資訊為準。
              <br />
              5.2 本系統不對因信息延遲、系統故障等原因造成的損失承擔責任。
            </Paragraph>
          </div>

          <Form.Item
            name="termsAccepted"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error('請閱讀並同意使用條款與隱私政策')
                      ),
              },
            ]}
          >
            <Checkbox>
              我已閱讀並同意 <Link to="/terms">使用條款</Link> 及{' '}
              <Link to="/privacy">隱私政策</Link>
            </Checkbox>
          </Form.Item>
        </>
      ),
    },
  ];

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-lg shadow-md">
        <div className="text-center mb-6">
          <Title level={2} className="mb-2">
            註冊帳號
          </Title>
          <Text type="secondary">創建新的台鐵列車資訊系統帳號</Text>
        </div>

        <Steps current={currentStep} className="mb-6">
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>

        {error && (
          <Alert
            message="註冊錯誤"
            description={error}
            type="error"
            showIcon
            className="mb-4"
          />
        )}

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          scrollToFirstError
          requiredMark={false}
        >
          <div className="steps-content px-2">{steps[currentStep].content}</div>

          <div className="steps-action mt-6 flex justify-between">
            {currentStep > 0 && <Button onClick={prevStep}>上一步</Button>}

            {currentStep < steps.length - 1 && (
              <Button
                type="primary"
                onClick={nextStep}
                style={{ marginLeft: 'auto' }}
              >
                下一步
              </Button>
            )}

            {currentStep === steps.length - 1 && (
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{ marginLeft: 'auto' }}
              >
                註冊
              </Button>
            )}
          </div>
        </Form>

        <Divider />

        <div className="text-center">
          <Text>已經有帳號？</Text> <Link to="/login">立即登入</Link>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
