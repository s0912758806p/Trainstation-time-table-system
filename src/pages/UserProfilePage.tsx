import React, { useState } from 'react';
import {
  Card,
  Typography,
  Form,
  Input,
  Button,
  Avatar,
  Tabs,
  Divider,
  message,
  Upload,
  Row,
  Col,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  LockOutlined,
  SaveOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { login } from '../store/authSlice';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';

const { Title, Text } = Typography;

interface ProfileFormValues {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const UserProfilePage: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordLoading, setPasswordLoading] = useState<boolean>(false);
  const [profileForm] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  // 處理個人資料更新
  const handleProfileUpdate = (values: ProfileFormValues) => {
    setLoading(true);

    // 模擬 API 請求
    setTimeout(() => {
      // 更新 Redux 狀態
      dispatch(
        login({
          username: user?.username || '',
          ...user,
          ...values,
        })
      );

      setLoading(false);
      message.success('個人資料已更新');
    }, 1000);
  };

  // 處理密碼更新
  const handlePasswordUpdate = (values: PasswordFormValues) => {
    setPasswordLoading(true);

    // 驗證新密碼與確認密碼是否一致
    if (values.newPassword !== values.confirmPassword) {
      message.error('新密碼與確認密碼不一致');
      setPasswordLoading(false);
      return;
    }

    // 模擬 API 請求
    setTimeout(() => {
      setPasswordLoading(false);
      message.success('密碼已更新');
      passwordForm.resetFields();
    }, 1000);
  };

  // 處理頭像上傳
  const handleAvatarChange: UploadProps['onChange'] = ({
    fileList: newFileList,
  }) => {
    setFileList(newFileList);
    if (newFileList.length > 0 && newFileList[0].status === 'done') {
      message.success('頭像已更新');
    }
  };

  // 上傳按鈕
  const uploadButton = (
    <div>
      <UploadOutlined />
      <div style={{ marginTop: 8 }}>上傳頭像</div>
    </div>
  );

  // 定義標籤頁項目
  const items = [
    {
      key: 'profile',
      label: '個人資料',
      children: (
        <Form
          form={profileForm}
          layout="vertical"
          initialValues={{
            name: user?.name || user?.username || '',
            email: user?.email || '',
            phone: user?.phone || '',
            address: user?.address || '',
          }}
          onFinish={handleProfileUpdate}
        >
          <Form.Item
            name="name"
            label="姓名"
            rules={[{ required: true, message: '請輸入姓名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="姓名" />
          </Form.Item>

          <Form.Item
            name="email"
            label="電子郵件"
            rules={[
              { required: true, message: '請輸入電子郵件' },
              { type: 'email', message: '請輸入有效的電子郵件' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="電子郵件" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="聯絡電話"
            rules={[{ required: true, message: '請輸入聯絡電話' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="聯絡電話" />
          </Form.Item>

          <Form.Item name="address" label="聯絡地址">
            <Input.TextArea rows={3} placeholder="聯絡地址" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
              block
            >
              保存變更
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'password',
      label: '修改密碼',
      children: (
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handlePasswordUpdate}
        >
          <Form.Item
            name="currentPassword"
            label="目前密碼"
            rules={[{ required: true, message: '請輸入目前密碼' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="目前密碼" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="新密碼"
            rules={[
              { required: true, message: '請輸入新密碼' },
              { min: 8, message: '密碼至少需要8個字符' },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="新密碼" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="確認新密碼"
            rules={[
              { required: true, message: '請確認新密碼' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('兩次輸入的密碼不一致'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="確認新密碼"
            />
          </Form.Item>

          <Divider />

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={passwordLoading}
              icon={<SaveOutlined />}
              block
            >
              更新密碼
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'promotions',
      label: '會員優惠',
      children: (
        <div className="text-center p-4">
          <Title level={4}>會員優惠資訊</Title>
          <Divider />
          <Text>目前您有以下優惠：</Text>
          <ul className="text-left p-4">
            <li>新會員優惠券：單次購票9折</li>
            <li>生日優惠：生日當月購票85折</li>
            <li>累積點數：{user?.points || 0} 點 (可折抵購票金額)</li>
          </ul>
          <Button type="primary" className="mt-4">
            查看更多優惠
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Title level={2} style={{ marginBottom: 24, textAlign: 'center' }}>
        會員中心
      </Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card className="shadow-sm text-center">
            <Avatar
              size={120}
              src={fileList[0]?.thumbUrl}
              icon={<UserOutlined />}
              style={{ marginBottom: 16 }}
            />
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              fileList={fileList}
              onChange={handleAvatarChange}
              beforeUpload={(file) => {
                // 模擬上傳
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                  const newFile = {
                    uid: file.uid,
                    name: file.name,
                    status: 'done',
                    url: reader.result,
                    thumbUrl: reader.result,
                  } as UploadFile;
                  setFileList([newFile]);
                };
                return false;
              }}
            >
              {fileList.length >= 1 ? null : uploadButton}
            </Upload>
            <Title level={4} style={{ marginTop: 16, marginBottom: 8 }}>
              {user?.username || '使用者'}
            </Title>
            <Text type="secondary">會員ID: {user?.id || 'TW10001'}</Text>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card className="shadow-sm">
            <Tabs defaultActiveKey="profile" items={items} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserProfilePage;
