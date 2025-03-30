import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Table,
  Tag,
  Button,
  Space,
  Tabs,
  Input,
  DatePicker,
  Empty,
  Drawer,
  Descriptions,
  message,
  Popconfirm,
  Badge,
  Radio,
} from 'antd';
import {
  SearchOutlined,
  FileTextOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  CreditCardOutlined,
  InfoCircleOutlined,
  PrinterOutlined,
  CloseCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import dayjs from 'dayjs';
import { getAllStations } from '../api/train';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface TicketOrder {
  id: string;
  orderNumber: string;
  orderDate: string;
  passengerName: string;
  passengerID: string;
  ticketCount: number;
  totalAmount: number;
  status: 'unpaid' | 'paid' | 'completed' | 'cancelled' | 'refunded';
  tickets: {
    ticketId: string;
    trainNo: string;
    departureStation: string;
    arrivalStation: string;
    departureTime: string;
    arrivalTime: string;
    seatType: string;
    seatNumber: string;
    price: number;
    date: string;
  }[];
}

const OrdersPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [orders, setOrders] = useState<TicketOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<TicketOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<TicketOrder | null>(null);
  const [dateRange, setDateRange] = useState<
    [dayjs.Dayjs | null, dayjs.Dayjs | null] | null
  >(null);
  const [stationMap, setStationMap] = useState<Record<string, string>>({});

  useEffect(() => {
    // 載入車站資料
    const loadStations = async () => {
      try {
        const stationData = await getAllStations();
        const stationMapData: Record<string, string> = {};
        stationData.forEach((station) => {
          stationMapData[station.StationID] = station.StationName.Zh_tw;
        });
        setStationMap(stationMapData);
      } catch (error) {
        console.error('無法載入車站資料', error);
      }
    };

    loadStations();
    fetchOrdersData();
  }, []);

  // 模擬獲取訂單數據
  const fetchOrdersData = () => {
    setLoading(true);

    // 模擬API請求延遲
    setTimeout(() => {
      // 模擬訂單數據
      const mockOrders: TicketOrder[] = Array(12)
        .fill(null)
        .map((_, index) => {
          const today = dayjs();
          // 隨機生成訂單日期，距今0-30天
          const orderDate = today.subtract(
            Math.floor(Math.random() * 30),
            'day'
          );
          // 隨機生成車票日期，距訂單日期0-14天
          const ticketDate = orderDate.add(
            Math.floor(Math.random() * 14),
            'day'
          );

          // 隨機狀態
          const statuses: TicketOrder['status'][] = [
            'unpaid',
            'paid',
            'completed',
            'cancelled',
            'refunded',
          ];
          const randomStatus =
            statuses[Math.floor(Math.random() * statuses.length)];

          // 隨機車站對
          const stationPairs = [
            { dep: '1000', arr: '1100' }, // 台北-台中
            { dep: '1100', arr: '1180' }, // 台中-台南
            { dep: '1000', arr: '1260' }, // 台北-花蓮
            { dep: '1000', arr: '1080' }, // 台北-苗栗
            { dep: '1060', arr: '1100' }, // 新竹-台中
          ];
          const randomPair =
            stationPairs[Math.floor(Math.random() * stationPairs.length)];

          // 隨機生成票數(1-3張)
          const ticketCount = Math.floor(Math.random() * 3) + 1;

          // 隨機生成車票信息
          const tickets = Array(ticketCount)
            .fill(null)
            .map((_, ticketIndex) => {
              const baseHour = 8 + Math.floor(Math.random() * 10); // 8:00 - 18:00
              const travelHours = 1 + Math.floor(Math.random() * 3); // 1-3小時旅程

              const seatTypes = ['標準座', '商務座', '自由座'];
              const randomSeatType =
                seatTypes[Math.floor(Math.random() * seatTypes.length)];

              return {
                ticketId: `T${1000 + index * 10 + ticketIndex}`,
                trainNo: `${100 + Math.floor(Math.random() * 900)}`,
                departureStation: randomPair.dep,
                arrivalStation: randomPair.arr,
                departureTime: `${baseHour}:${
                  Math.floor(Math.random() * 6) * 10
                }`,
                arrivalTime: `${baseHour + travelHours}:${
                  Math.floor(Math.random() * 6) * 10
                }`,
                seatType: randomSeatType,
                seatNumber:
                  randomSeatType === '自由座'
                    ? '-'
                    : `${String.fromCharCode(
                        65 + Math.floor(Math.random() * 10)
                      )}${Math.floor(Math.random() * 50) + 1}`,
                price:
                  300 +
                  Math.floor(Math.random() * 700) -
                  (randomSeatType === '自由座' ? 100 : 0),
                date: ticketDate.format('YYYY-MM-DD'),
              };
            });

          // 計算總金額
          const totalAmount = tickets.reduce(
            (sum, ticket) => sum + ticket.price,
            0
          );

          return {
            id: `order-${1000 + index}`,
            orderNumber: `TIX${today.year()}${100000 + index}`,
            orderDate: orderDate.format('YYYY-MM-DD HH:mm:ss'),
            passengerName: user?.name || `乘客${index + 1}`,
            passengerID: `A${
              Math.floor(Math.random() * 900000000) + 100000000
            }`,
            ticketCount,
            totalAmount,
            status: randomStatus,
            tickets,
          };
        });

      setOrders(mockOrders);
      setFilteredOrders(mockOrders);
      setLoading(false);
    }, 1000);
  };

  // 篩選訂單
  useEffect(() => {
    let result = [...orders];

    // 根據Tab篩選
    if (activeTab !== 'all') {
      result = result.filter((order) => order.status === activeTab);
    }

    // 根據搜尋文字篩選
    if (searchText) {
      result = result.filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchText.toLowerCase()) ||
          order.tickets.some(
            (ticket) =>
              ticket.trainNo.toLowerCase().includes(searchText.toLowerCase()) ||
              stationMap[ticket.departureStation]
                ?.toLowerCase()
                .includes(searchText.toLowerCase()) ||
              stationMap[ticket.arrivalStation]
                ?.toLowerCase()
                .includes(searchText.toLowerCase())
          )
      );
    }

    // 根據日期範圍篩選
    if (dateRange && dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].startOf('day');
      const endDate = dateRange[1].endOf('day');

      result = result.filter((order) => {
        const orderDate = dayjs(order.orderDate);
        return orderDate.isAfter(startDate) && orderDate.isBefore(endDate);
      });
    }

    setFilteredOrders(result);
  }, [orders, activeTab, searchText, dateRange, stationMap]);

  // 查看訂單詳情
  const showOrderDetail = (order: TicketOrder) => {
    setSelectedOrder(order);
    setDrawerVisible(true);
  };

  // 關閉抽屜
  const onCloseDrawer = () => {
    setDrawerVisible(false);
  };

  // 取消訂單
  const handleCancelOrder = (orderId: string) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        return { ...order, status: 'cancelled' as const };
      }
      return order;
    });

    setOrders(updatedOrders);
    message.success('訂單已取消');

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: 'cancelled' });
    }
  };

  // 獲取訂單狀態標籤
  const getStatusTag = (status: TicketOrder['status']) => {
    switch (status) {
      case 'unpaid':
        return <Tag color="warning">待付款</Tag>;
      case 'paid':
        return <Tag color="processing">已付款</Tag>;
      case 'completed':
        return <Tag color="success">已完成</Tag>;
      case 'cancelled':
        return <Tag color="error">已取消</Tag>;
      case 'refunded':
        return <Tag color="default">已退款</Tag>;
      default:
        return <Tag>未知</Tag>;
    }
  };

  // 表格列定義
  const columns = [
    {
      title: '訂單編號',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      render: (text: string) => (
        <a
          onClick={() =>
            showOrderDetail(filteredOrders.find((o) => o.orderNumber === text)!)
          }
        >
          {text}
        </a>
      ),
    },
    {
      title: '訂購日期',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (text: string) => (
        <span>
          <CalendarOutlined style={{ marginRight: 8 }} />
          {dayjs(text).format('YYYY-MM-DD')}
        </span>
      ),
    },
    {
      title: '車次/路線',
      key: 'route',
      render: (_: any, record: TicketOrder) => (
        <>
          {record.tickets.map((ticket, index) => (
            <div
              key={index}
              style={{
                marginBottom: index < record.tickets.length - 1 ? 8 : 0,
              }}
            >
              <Tag color="blue">{ticket.trainNo}</Tag>
              <span>
                {stationMap[ticket.departureStation]} →{' '}
                {stationMap[ticket.arrivalStation]}
              </span>
            </div>
          ))}
        </>
      ),
    },
    {
      title: '日期/時間',
      key: 'datetime',
      render: (_: any, record: TicketOrder) => (
        <>
          {record.tickets.map((ticket, index) => (
            <div
              key={index}
              style={{
                marginBottom: index < record.tickets.length - 1 ? 8 : 0,
              }}
            >
              <CalendarOutlined style={{ marginRight: 4 }} />
              {ticket.date}
              <br />
              <ClockCircleOutlined style={{ marginRight: 4 }} />
              {ticket.departureTime} - {ticket.arrivalTime}
            </div>
          ))}
        </>
      ),
    },
    {
      title: '票數',
      dataIndex: 'ticketCount',
      key: 'ticketCount',
      render: (count: number) => (
        <Badge count={count} style={{ backgroundColor: '#52c41a' }} />
      ),
    },
    {
      title: '金額',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => (
        <Text strong style={{ color: '#f50' }}>
          NT$ {amount}
        </Text>
      ),
    },
    {
      title: '狀態',
      dataIndex: 'status',
      key: 'status',
      render: (status: TicketOrder['status']) => getStatusTag(status),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: TicketOrder) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            onClick={() => showOrderDetail(record)}
          >
            詳情
          </Button>

          {record.status === 'unpaid' && (
            <Button
              type="primary"
              size="small"
              style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
              onClick={() => message.info('跳轉至付款頁面')}
            >
              付款
            </Button>
          )}

          {(record.status === 'unpaid' || record.status === 'paid') && (
            <Popconfirm
              title="確定要取消此訂單嗎？"
              onConfirm={() => handleCancelOrder(record.id)}
              okText="確定"
              cancelText="取消"
            >
              <Button danger size="small">
                取消
              </Button>
            </Popconfirm>
          )}

          {record.status === 'paid' && (
            <Button
              type="default"
              size="small"
              icon={<PrinterOutlined />}
              onClick={() => message.info('準備打印車票')}
            >
              列印
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Title level={2} style={{ marginBottom: 24, textAlign: 'center' }}>
        我的訂單
      </Title>

      <Card className="mb-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <Space size="middle">
            <Input
              placeholder="搜尋訂單編號或車次"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              allowClear
            />
            <RangePicker
              placeholder={['開始日期', '結束日期']}
              onChange={(dates) =>
                setDateRange(dates as [dayjs.Dayjs | null, dayjs.Dayjs | null])
              }
              style={{ width: 280 }}
            />
          </Space>

          <Radio.Group
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            <Radio.Button value="all">全部</Radio.Button>
            <Radio.Button value="unpaid">待付款</Radio.Button>
            <Radio.Button value="paid">已付款</Radio.Button>
            <Radio.Button value="completed">已完成</Radio.Button>
            <Radio.Button value="cancelled">已取消</Radio.Button>
          </Radio.Group>
        </div>

        <Table
          columns={columns}
          dataSource={filteredOrders}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 8,
            showTotal: (total) => `共 ${total} 筆訂單`,
          }}
          locale={{
            emptyText: <Empty description="暫無訂單記錄" />,
          }}
        />
      </Card>

      <Drawer
        title={
          <span>
            <FileTextOutlined /> 訂單詳情
          </span>
        }
        placement="right"
        closable={true}
        onClose={onCloseDrawer}
        open={drawerVisible}
        width={600}
      >
        {selectedOrder && (
          <div>
            <Card className="mb-4">
              <Descriptions
                title="訂單信息"
                bordered
                column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}
              >
                <Descriptions.Item label="訂單編號">
                  {selectedOrder.orderNumber}
                </Descriptions.Item>
                <Descriptions.Item label="訂購日期">
                  {dayjs(selectedOrder.orderDate).format('YYYY-MM-DD HH:mm:ss')}
                </Descriptions.Item>
                <Descriptions.Item label="乘客姓名">
                  <UserOutlined /> {selectedOrder.passengerName}
                </Descriptions.Item>
                <Descriptions.Item label="證件號碼">
                  {selectedOrder.passengerID}
                </Descriptions.Item>
                <Descriptions.Item label="訂單狀態" span={2}>
                  {getStatusTag(selectedOrder.status)}
                </Descriptions.Item>
                <Descriptions.Item label="總金額" span={2}>
                  <Text strong style={{ color: '#f50', fontSize: 16 }}>
                    NT$ {selectedOrder.totalAmount}
                  </Text>
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Title level={5}>車票信息</Title>
            {selectedOrder.tickets.map((ticket, index) => (
              <Card
                key={ticket.ticketId}
                className="mb-3"
                style={{
                  backgroundColor:
                    selectedOrder.status === 'cancelled'
                      ? '#f5f5f5'
                      : selectedOrder.status === 'completed'
                      ? '#f6ffed'
                      : '#fff',
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <Space>
                    <Tag color="blue">{ticket.trainNo}</Tag>
                    <Text strong>{ticket.date}</Text>
                  </Space>
                  <Text type="secondary">票號: {ticket.ticketId}</Text>
                </div>

                <Descriptions column={1} bordered size="small">
                  <Descriptions.Item
                    label={
                      <>
                        <EnvironmentOutlined /> 路線
                      </>
                    }
                  >
                    <Space direction="vertical">
                      <Text strong>{stationMap[ticket.departureStation]}</Text>
                      <div style={{ textAlign: 'center' }}>↓</div>
                      <Text strong>{stationMap[ticket.arrivalStation]}</Text>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <>
                        <ClockCircleOutlined /> 時間
                      </>
                    }
                  >
                    <Space direction="vertical">
                      <Text>{ticket.departureTime}</Text>
                      <div style={{ textAlign: 'center' }}>↓</div>
                      <Text>{ticket.arrivalTime}</Text>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <>
                        <InfoCircleOutlined /> 座位
                      </>
                    }
                  >
                    {ticket.seatType} {ticket.seatNumber}
                  </Descriptions.Item>
                  <Descriptions.Item
                    label={
                      <>
                        <CreditCardOutlined /> 票價
                      </>
                    }
                  >
                    <Text strong style={{ color: '#f50' }}>
                      NT$ {ticket.price}
                    </Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            ))}

            <div className="mt-4 flex justify-end">
              {selectedOrder.status === 'unpaid' && (
                <Space>
                  <Button
                    type="primary"
                    onClick={() => message.info('跳轉至付款頁面')}
                  >
                    前往付款
                  </Button>
                  <Popconfirm
                    title="確定要取消此訂單嗎？"
                    onConfirm={() => handleCancelOrder(selectedOrder.id)}
                    okText="確定"
                    cancelText="取消"
                  >
                    <Button danger icon={<CloseCircleOutlined />}>
                      取消訂單
                    </Button>
                  </Popconfirm>
                </Space>
              )}

              {selectedOrder.status === 'paid' && (
                <Space>
                  <Button
                    icon={<PrinterOutlined />}
                    onClick={() => message.info('準備打印車票')}
                  >
                    列印車票
                  </Button>
                  <Popconfirm
                    title="確定要取消此訂單嗎？"
                    onConfirm={() => handleCancelOrder(selectedOrder.id)}
                    okText="確定"
                    cancelText="取消"
                  >
                    <Button danger icon={<CloseCircleOutlined />}>
                      取消訂單
                    </Button>
                  </Popconfirm>
                </Space>
              )}
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default OrdersPage;
