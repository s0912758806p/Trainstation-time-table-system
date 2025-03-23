import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Form,
  Input,
  Select,
  DatePicker,
  Button,
  Table,
  Tag,
  Empty,
  Segmented,
  message,
} from 'antd';
import {
  SearchOutlined,
  FileTextOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { getAllStations } from '../api/train';

const { Title } = Typography;
const { Option } = Select;

interface TicketInfo {
  id: string;
  trainNo: string;
  departureStation: string;
  arrivalStation: string;
  departureTime: string;
  arrivalTime: string;
  ticketType: string;
  price: number;
  status: 'available' | 'limited' | 'sold_out';
}

interface SearchFormValues {
  departureStation?: string;
  arrivalStation?: string;
  departureDate?: Date;
  ticketNumber?: string;
  idNumber?: string;
}

const TicketQueryPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState<TicketInfo[]>([]);
  const [stations, setStations] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [queryMode, setQueryMode] = useState<string | number>('date');
  const [form] = Form.useForm();

  useEffect(() => {
    // 載入車站資料
    const loadStations = async () => {
      try {
        const stationData = await getAllStations();
        const formattedStations = stationData.map((station) => ({
          value: station.StationID,
          label: station.StationName.Zh_tw,
        }));
        setStations(formattedStations);
      } catch (error) {
        message.error('無法載入車站資料');
        console.error(error);
      }
    };

    loadStations();
  }, []);

  const handleSearch = (values: SearchFormValues) => {
    setLoading(true);

    // 模擬API請求
    setTimeout(() => {
      // 模擬票價和狀態資料
      const mockTickets: TicketInfo[] = Array(5)
        .fill(null)
        .map((_, index) => {
          const departureStationName = values.departureStation
            ? stations.find((s) => s.value === values.departureStation)
                ?.label || ''
            : '臺北';
          const arrivalStationName = values.arrivalStation
            ? stations.find((s) => s.value === values.arrivalStation)?.label ||
              ''
            : '高雄';

          const baseHour = 8 + index;
          const departureTime = `${baseHour}:00`;
          const arrivalTime = `${baseHour + 2}:30`;

          const statuses: Array<'available' | 'limited' | 'sold_out'> = [
            'available',
            'limited',
            'sold_out',
          ];
          const status = statuses[Math.floor(Math.random() * statuses.length)];

          const ticketTypes = ['標準', '商務', '對號座'];
          const ticketType =
            ticketTypes[Math.floor(Math.random() * ticketTypes.length)];

          return {
            id: `ticket-${index}`,
            trainNo: `${100 + index * 2}`,
            departureStation: departureStationName,
            arrivalStation: arrivalStationName,
            departureTime,
            arrivalTime,
            ticketType,
            price: 100 + index * 50,
            status,
          };
        });

      setTickets(mockTickets);
      setLoading(false);
    }, 1000);
  };

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'available':
        return <Tag color="success">充足</Tag>;
      case 'limited':
        return <Tag color="warning">有限</Tag>;
      case 'sold_out':
        return <Tag color="error">已售完</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };

  const renderForm = () => {
    if (queryMode === 'date') {
      return (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSearch}
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
        >
          <Form.Item
            name="departureStation"
            label="出發站"
            rules={[{ required: true, message: '請選擇出發站' }]}
          >
            <Select
              showSearch
              placeholder="選擇出發站"
              optionFilterProp="children"
            >
              {stations.map((station) => (
                <Option key={station.value} value={station.value}>
                  {station.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="arrivalStation"
            label="抵達站"
            rules={[{ required: true, message: '請選擇抵達站' }]}
          >
            <Select
              showSearch
              placeholder="選擇抵達站"
              optionFilterProp="children"
            >
              {stations.map((station) => (
                <Option key={station.value} value={station.value}>
                  {station.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="departureDate"
            label="出發日期"
            rules={[{ required: true, message: '請選擇出發日期' }]}
          >
            <DatePicker className="w-full" />
          </Form.Item>

          <Form.Item className="flex items-end">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SearchOutlined />}
              className="w-full"
            >
              查詢車票
            </Button>
          </Form.Item>
        </Form>
      );
    } else {
      return (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSearch}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Form.Item
            name="ticketNumber"
            label="訂票號碼"
            rules={[{ required: true, message: '請輸入訂票號碼' }]}
          >
            <Input placeholder="請輸入訂票號碼" />
          </Form.Item>

          <Form.Item
            name="idNumber"
            label="證件號碼"
            rules={[{ required: true, message: '請輸入證件號碼' }]}
          >
            <Input placeholder="請輸入證件號碼" />
          </Form.Item>

          <Form.Item className="flex items-end">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<FileTextOutlined />}
              className="w-full"
            >
              查詢訂單
            </Button>
          </Form.Item>
        </Form>
      );
    }
  };

  const columns = [
    {
      title: '車次',
      dataIndex: 'trainNo',
      key: 'trainNo',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '出發站',
      dataIndex: 'departureStation',
      key: 'departureStation',
    },
    {
      title: '抵達站',
      dataIndex: 'arrivalStation',
      key: 'arrivalStation',
    },
    {
      title: '出發時間',
      dataIndex: 'departureTime',
      key: 'departureTime',
    },
    {
      title: '抵達時間',
      dataIndex: 'arrivalTime',
      key: 'arrivalTime',
    },
    {
      title: '票種',
      dataIndex: 'ticketType',
      key: 'ticketType',
      render: (text: string) => (
        <span>
          <TagOutlined style={{ marginRight: 8 }} />
          {text}
        </span>
      ),
    },
    {
      title: '票價',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `NT$ ${price}`,
    },
    {
      title: '狀態',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Button type="primary" size="small">
          購票
        </Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Title level={2} style={{ marginBottom: 24, textAlign: 'center' }}>
        火車票查詢與訂購
      </Title>

      <Card className="mb-6 shadow-sm">
        <Segmented
          options={[
            {
              label: '依日期查詢車票',
              value: 'date',
              icon: <SearchOutlined />,
            },
            {
              label: '訂票號碼查詢',
              value: 'order',
              icon: <FileTextOutlined />,
            },
          ]}
          value={queryMode}
          onChange={setQueryMode}
          block
          className="mb-6"
        />

        {renderForm()}
      </Card>

      <Card>
        <Title level={4} className="mb-4">
          查詢結果
        </Title>
        {tickets.length > 0 ? (
          <Table
            dataSource={tickets}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 5 }}
            bordered
          />
        ) : (
          <Empty description="尚無查詢結果" />
        )}
      </Card>
    </div>
  );
};

export default TicketQueryPage;
