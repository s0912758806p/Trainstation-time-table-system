import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Row,
  Col,
  Statistic,
  Button,
  List,
  Avatar,
  Carousel,
  Tag,
  Space,
  Input,
  Divider,
  Empty,
  Calendar,
  Badge,
  Alert,
  Skeleton,
} from 'antd';
import type { CellRenderInfo } from 'rc-picker/lib/interface';
import {
  RocketOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  SearchOutlined,
  CalendarOutlined,
  UserOutlined,
  HeartOutlined,
  HeartFilled,
  StarOutlined,
  StarFilled,
  RightOutlined,
  FireOutlined,
  CloseCircleOutlined,
  SoundOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import dayjs, { Dayjs } from 'dayjs';
import { getAllStations } from '../api/train';
import type { Station } from '../api/train';

const { Title, Text, Paragraph } = Typography;

interface PopularRoute {
  id: string;
  from: string;
  fromId: string;
  to: string;
  toId: string;
  travelTime: string;
  price: number;
  frequency: string;
  isFavorite: boolean;
}

interface RecentSearchItem {
  id: string;
  type: 'route' | 'station' | 'train';
  content: string;
  date: string;
}

interface Promotion {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  expireDate: string;
  tag: string;
}

const DashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const [stations, setStations] = useState<Station[]>([]);
  const [popularRoutes, setPopularRoutes] = useState<PopularRoute[]>([]);
  const [recentSearches, setRecentSearches] = useState<RecentSearchItem[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [holidayEvents, setHolidayEvents] = useState<Record<string, string[]>>(
    {}
  );
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // 載入資料
  useEffect(() => {
    const loadData = async () => {
      try {
        // 載入車站資料
        const stationData = await getAllStations();
        setStations(stationData);

        // 模擬載入熱門路線
        const mockPopularRoutes: PopularRoute[] = [
          {
            id: 'route1',
            from: '臺北',
            fromId: '1000',
            to: '臺中',
            toId: '1100',
            travelTime: '1小時40分',
            price: 375,
            frequency: '每小時1班',
            isFavorite: false,
          },
          {
            id: 'route2',
            from: '臺北',
            fromId: '1000',
            to: '高雄',
            toId: '1200',
            travelTime: '4小時30分',
            price: 843,
            frequency: '每日12班',
            isFavorite: true,
          },
          {
            id: 'route3',
            from: '臺北',
            fromId: '1000',
            to: '花蓮',
            toId: '1260',
            travelTime: '2小時5分',
            price: 440,
            frequency: '每日8班',
            isFavorite: false,
          },
          {
            id: 'route4',
            from: '桃園',
            fromId: '1040',
            to: '臺中',
            toId: '1100',
            travelTime: '1小時10分',
            price: 259,
            frequency: '每日15班',
            isFavorite: false,
          },
          {
            id: 'route5',
            from: '臺中',
            fromId: '1100',
            to: '高雄',
            toId: '1200',
            travelTime: '2小時15分',
            price: 469,
            frequency: '每日14班',
            isFavorite: false,
          },
        ];
        setPopularRoutes(mockPopularRoutes);

        // 模擬最近搜尋記錄
        const mockRecentSearches: RecentSearchItem[] = [
          {
            id: 'search1',
            type: 'route',
            content: '臺北 → 花蓮',
            date: '2023-10-15',
          },
          {
            id: 'search2',
            type: 'train',
            content: '車次 408',
            date: '2023-10-14',
          },
          {
            id: 'search3',
            type: 'station',
            content: '新竹站',
            date: '2023-10-12',
          },
          {
            id: 'search4',
            type: 'route',
            content: '臺中 → 高雄',
            date: '2023-10-10',
          },
          {
            id: 'search5',
            type: 'route',
            content: '板橋 → 臺中',
            date: '2023-10-08',
          },
        ];
        setRecentSearches(mockRecentSearches);

        // 模擬促銷活動
        const mockPromotions: Promotion[] = [
          {
            id: 'promo1',
            title: '秋季旅遊優惠',
            description: '10月至11月期間，週間自由座車票75折優惠',
            imageUrl:
              'https://images.pexels.com/photos/2790396/pexels-photo-2790396.jpeg?auto=compress&cs=tinysrgb&w=800&h=400',
            expireDate: '2023-11-30',
            tag: '限時優惠',
          },
          {
            id: 'promo2',
            title: '新會員專屬',
            description:
              '新會員首次訂票享9折優惠，首次購買對號座車票送站前輕食券',
            imageUrl:
              'https://images.pexels.com/photos/669996/pexels-photo-669996.jpeg?auto=compress&cs=tinysrgb&w=800&h=400',
            expireDate: '2023-12-31',
            tag: '新會員優惠',
          },
          {
            id: 'promo3',
            title: '週末家庭票',
            description: '週末期間，2大2小同行可享家庭套票優惠',
            imageUrl:
              'https://images.pexels.com/photos/1004584/pexels-photo-1004584.jpeg?auto=compress&cs=tinysrgb&w=800&h=400',
            expireDate: '2023-12-15',
            tag: '團體優惠',
          },
        ];
        setPromotions(mockPromotions);

        // 模擬節日與活動資料
        const today = dayjs();
        const mockHolidayEvents: Record<string, string[]> = {};

        // 本月的一些假日活動
        const thisMonth = today.format('YYYY-MM');
        mockHolidayEvents[`${thisMonth}-10`] = ['國慶日'];
        mockHolidayEvents[`${thisMonth}-15`] = ['花蓮太魯閣馬拉松'];
        mockHolidayEvents[`${thisMonth}-20`] = ['臺中爵士音樂節'];
        mockHolidayEvents[`${thisMonth}-28`] = ['萬聖節列車活動'];

        // 下個月的一些假日活動
        const nextMonth = today.add(1, 'month').format('YYYY-MM');
        mockHolidayEvents[`${nextMonth}-05`] = ['臺南美食節'];
        mockHolidayEvents[`${nextMonth}-15`] = ['冬季限定列車'];
        mockHolidayEvents[`${nextMonth}-25`] = ['聖誕節'];
        mockHolidayEvents[`${nextMonth}-31`] = ['跨年活動'];

        setHolidayEvents(mockHolidayEvents);

        // 模擬API載入延遲
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('載入資料失敗:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 切換收藏路線
  const toggleFavorite = (routeId: string) => {
    setPopularRoutes(
      popularRoutes.map((route) =>
        route.id === routeId
          ? { ...route, isFavorite: !route.isFavorite }
          : route
      )
    );
  };

  // 處理日曆單元格渲染
  const dateCellRender = (date: Dayjs) => {
    const dateStr = date.format('YYYY-MM-DD');
    const events = holidayEvents[dateStr];

    return events ? (
      <ul className="events">
        {events.map((event) => (
          <li key={event}>
            <Badge status="success" text={event} />
          </li>
        ))}
      </ul>
    ) : null;
  };

  // 日曆單元格渲染（使用新API）
  const cellRender = (current: Dayjs, info: CellRenderInfo<Dayjs>) => {
    if (info.type === 'date') {
      const dateStr = current.format('YYYY-MM-DD');
      const events = holidayEvents[dateStr];

      return events ? (
        <ul className="events">
          {events.map((event) => (
            <li key={event}>
              <Badge status="success" text={event} />
            </li>
          ))}
        </ul>
      ) : null;
    }
    return null;
  };

  // 移除最近搜尋
  const removeRecentSearch = (searchId: string) => {
    setRecentSearches(
      recentSearches.filter((search) => search.id !== searchId)
    );
  };

  return (
    <div className="p-6">
      <div className="text-center mb-8 mt-2">
        <Title level={2} className="mb-0">
          <RocketOutlined style={{ marginRight: 12 }} />
          台鐵列車資訊系統
        </Title>
        <Text type="secondary">快速查詢、訂票，開啟您的旅程</Text>
      </div>

      {/* 快速搜尋區 */}
      <Card className="mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <Title level={4} className="mb-4 sm:mb-0">
            <SearchOutlined /> 快速搜尋
          </Title>
          <div className="flex gap-2 w-full sm:w-auto">
            <Input
              placeholder="輸入車站名稱或車次"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
              prefix={<SearchOutlined />}
              style={{ maxWidth: 300 }}
            />
            <Button type="primary">搜尋</Button>
          </div>
        </div>

        <Divider />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/schedule">
            <Button block className="h-auto py-3 text-left flex items-center">
              <EnvironmentOutlined style={{ fontSize: 24, marginRight: 8 }} />
              <div>
                <div className="font-bold">車站時刻表</div>
                <div className="text-xs text-gray-500">查詢各車站發車資訊</div>
              </div>
            </Button>
          </Link>
          <Link to="/tickets">
            <Button block className="h-auto py-3 text-left flex items-center">
              <ClockCircleOutlined style={{ fontSize: 24, marginRight: 8 }} />
              <div>
                <div className="font-bold">車票查詢與訂購</div>
                <div className="text-xs text-gray-500">查詢票價與購票</div>
              </div>
            </Button>
          </Link>
          <Link to="/orders">
            <Button block className="h-auto py-3 text-left flex items-center">
              <UserOutlined style={{ fontSize: 24, marginRight: 8 }} />
              <div>
                <div className="font-bold">我的訂單</div>
                <div className="text-xs text-gray-500">管理已購買的車票</div>
              </div>
            </Button>
          </Link>
          <Link to="/faq">
            <Button block className="h-auto py-3 text-left flex items-center">
              <FireOutlined style={{ fontSize: 24, marginRight: 8 }} />
              <div>
                <div className="font-bold">幫助中心</div>
                <div className="text-xs text-gray-500">常見問題與服務</div>
              </div>
            </Button>
          </Link>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        {/* 熱門路線 */}
        <Col xs={24} lg={16}>
          <Card
            className="shadow-sm dashboard-card"
            title={
              <Space>
                <RocketOutlined />
                <span>熱門路線</span>
              </Space>
            }
            extra={<Link to="/schedule">查看更多</Link>}
          >
            {loading ? (
              <>
                <Skeleton active />
                <Skeleton active />
              </>
            ) : (
              <List
                dataSource={popularRoutes}
                renderItem={(route) => (
                  <List.Item
                    actions={[
                      <Button
                        type="text"
                        onClick={() => toggleFavorite(route.id)}
                        icon={
                          route.isFavorite ? (
                            <HeartFilled style={{ color: '#ff4d4f' }} />
                          ) : (
                            <HeartOutlined />
                          )
                        }
                      />,
                      <Link
                        to={`/tickets?from=${route.fromId}&to=${route.toId}`}
                      >
                        <Button type="primary" size="small">
                          查詢車票
                        </Button>
                      </Link>,
                    ]}
                  >
                    <List.Item.Meta
                      title={
                        <span>
                          {route.from} <RightOutlined /> {route.to}
                        </span>
                      }
                      description={
                        <Space size={[8, 16]} wrap>
                          <span>
                            <ClockCircleOutlined /> {route.travelTime}
                          </span>
                          <span>
                            <CalendarOutlined /> {route.frequency}
                          </span>
                          <Tag color="orange">NT$ {route.price}</Tag>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>

        {/* 使用者資訊和統計 */}
        <Col xs={24} lg={8}>
          <Card
            className="shadow-sm dashboard-card"
            title={
              <Space>
                <UserOutlined />
                <span>{user?.name || user?.username || '歡迎使用'}</span>
              </Space>
            }
          >
            {loading ? (
              <Skeleton active avatar paragraph={{ rows: 4 }} />
            ) : (
              <div>
                <div className="flex items-center mb-4">
                  <Avatar
                    size={64}
                    icon={<UserOutlined />}
                    src={user?.avatar}
                    className="mr-4"
                  />
                  <div>
                    <Text strong className="text-lg">
                      {user?.name || user?.username || '訪客'}
                    </Text>
                    {user ? (
                      <div>
                        <Tag color="blue">會員</Tag>
                        <Tag color="gold">
                          <StarFilled /> 一般會員
                        </Tag>
                      </div>
                    ) : (
                      <div>
                        <Link to="/login">
                          <Button type="primary" size="small">
                            登入/註冊
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {user && (
                  <Row gutter={16} className="mb-4">
                    <Col span={12}>
                      <Statistic
                        title="優惠點數"
                        value={user.points || 0}
                        suffix="點"
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="已購車票"
                        value={user.ticketCount || 0}
                        suffix="張"
                      />
                    </Col>
                  </Row>
                )}

                <div className="mt-4">
                  <Text strong>最近搜尋</Text>
                  {recentSearches.length > 0 ? (
                    <List
                      size="small"
                      dataSource={recentSearches.slice(0, 3)}
                      renderItem={(item) => (
                        <List.Item
                          actions={[
                            <Button
                              type="text"
                              size="small"
                              icon={<CloseCircleOutlined />}
                              onClick={() => removeRecentSearch(item.id)}
                            />,
                          ]}
                        >
                          <div>
                            <Text>{item.content}</Text>
                            <div>
                              <Text type="secondary" className="text-xs">
                                {item.date}
                              </Text>
                            </div>
                          </div>
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="無搜尋記錄"
                    />
                  )}
                </div>
              </div>
            )}
          </Card>
        </Col>

        {/* 促銷活動 */}
        <Col xs={24}>
          <Card
            className="shadow-sm dashboard-card"
            title={
              <Space>
                <CalendarOutlined />
                <span>優惠與活動</span>
              </Space>
            }
          >
            {loading ? (
              <Skeleton active paragraph={{ rows: 4 }} />
            ) : (
              <Carousel autoplay className="promotion-carousel">
                {promotions.map((promo) => (
                  <div key={promo.id} className="promotion-slide">
                    <div className="relative overflow-hidden rounded-lg">
                      <img
                        src={promo.imageUrl}
                        alt={promo.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-0 right-0 p-2">
                        <Tag color="volcano">{promo.tag}</Tag>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 p-4 text-white">
                        <Title level={5} style={{ color: 'white', margin: 0 }}>
                          {promo.title}
                        </Title>
                        <Paragraph
                          ellipsis={{ rows: 2 }}
                          style={{
                            color: 'rgba(255, 255, 255, 0.85)',
                            margin: 0,
                          }}
                        >
                          {promo.description}
                        </Paragraph>
                        <div className="mt-2">
                          <Tag color="gold">有效期至: {promo.expireDate}</Tag>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>
            )}
          </Card>
        </Col>

        {/* 節日與活動日曆 */}
        <Col xs={24} lg={12}>
          <Card
            className="shadow-sm dashboard-card"
            title={
              <Space>
                <CalendarOutlined />
                <span>節日與特別活動</span>
              </Space>
            }
          >
            {loading ? (
              <Skeleton active paragraph={{ rows: 8 }} />
            ) : (
              <Calendar fullscreen={false} cellRender={cellRender} />
            )}
          </Card>
        </Col>

        {/* 系統公告 */}
        <Col xs={24} lg={12}>
          <Card
            className="shadow-sm dashboard-card"
            title={
              <Space>
                <SoundOutlined />
                <span>系統公告</span>
              </Space>
            }
          >
            {loading ? (
              <Skeleton active paragraph={{ rows: 8 }} />
            ) : (
              <List
                dataSource={[
                  {
                    id: 'notice1',
                    title: '系統維護通知',
                    content:
                      '系統將於11月15日凌晨1:00-5:00進行例行性維護，期間訂票系統將暫時停止服務，造成不便敬請見諒。',
                    date: '2023-11-05',
                    type: 'warning',
                  },
                  {
                    id: 'notice2',
                    title: '票務調整公告',
                    content:
                      '自2023年12月1日起，部分自強號列車將調整票價，詳情請參閱各車站公告或本網站說明頁面。',
                    date: '2023-10-28',
                    type: 'info',
                  },
                  {
                    id: 'notice3',
                    title: '新會員服務上線',
                    content:
                      '全新會員中心頁面已上線，提供更方便的訂單管理與個人資料設定功能，歡迎會員試用。',
                    date: '2023-10-20',
                    type: 'success',
                  },
                  {
                    id: 'notice4',
                    title: '颱風期間列車調整',
                    content:
                      '因應颱風來襲，部分列車可能臨時取消或調整班次，請密切注意本站公告或聯繫客服中心查詢。',
                    date: '2023-10-15',
                    type: 'error',
                  },
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <Alert
                      message={item.title}
                      description={
                        <>
                          <div className="mb-2">{item.content}</div>
                          <div className="text-right">
                            <Text type="secondary" className="text-xs">
                              發布日期: {item.date}
                            </Text>
                          </div>
                        </>
                      }
                      type={item.type as any}
                      showIcon
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Col>
      </Row>

      <style>
        {`
        .promotion-carousel .slick-slide {
          padding: 8px;
        }
        .dashboard-card {
          height: 100%;
        }
        `}
      </style>
    </div>
  );
};

export default DashboardPage;
