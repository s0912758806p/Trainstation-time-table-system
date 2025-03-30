import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Row,
  Col,
  Tabs,
  List,
  Tag,
  Descriptions,
  Image,
  Spin,
  Empty,
  Select,
  Button,
  Divider,
  Space,
  Alert,
} from 'antd';
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  PhoneOutlined,
  InfoCircleOutlined,
  CompassOutlined,
  BankOutlined,
  CarOutlined,
  ShopOutlined,
  RightOutlined,
} from '@ant-design/icons';
import { getAllStations, Station } from '../api/train';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// 站點周邊設施介面
interface Facility {
  id: string;
  name: string;
  type: 'restaurant' | 'store' | 'attraction' | 'hotel' | 'transport';
  distance: string;
  rating: number;
  address: string;
  image?: string;
}

// 站點轉乘資訊介面
interface Transport {
  id: string;
  type: 'bus' | 'mrt' | 'bike' | 'taxi';
  name: string;
  routes?: string[];
  description: string;
  operationHours?: string;
}

// 定義主頁籤項目
const mainTabItems = [
  {
    key: '1',
    label: '營業時間',
    children: (
      <>
        <Alert
          message="站務中心營業時間"
          description="每日 05:30 - 23:00，詳細時間可能因季節調整，請以現場公告為準。"
          type="info"
          showIcon
          className="mb-4"
        />
        <Descriptions bordered column={1} title="窗口營業時間">
          <Descriptions.Item label="售票窗口">06:00 - 22:00</Descriptions.Item>
          <Descriptions.Item label="客服中心">08:00 - 20:00</Descriptions.Item>
          <Descriptions.Item label="行李託運">08:00 - 20:00</Descriptions.Item>
        </Descriptions>
      </>
    ),
  },
  {
    key: '2',
    label: '周邊設施',
    children: ({
      facilities,
      getFacilityIcon,
      getFacilityTagColor,
      getFacilityTypeName,
    }: {
      facilities: Facility[];
      getFacilityIcon: (type: string) => React.ReactNode;
      getFacilityTagColor: (type: string) => string;
      getFacilityTypeName: (type: string) => string;
    }) => {
      // 建立設施分類籤項目
      const facilityTabItems = [
        {
          key: 'all',
          label: '全部',
          children: (
            <List
              itemLayout="horizontal"
              dataSource={facilities}
              renderItem={(item: Facility) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={getFacilityIcon(item.type)}
                    title={
                      <div className="flex items-center">
                        <span>{item.name}</span>
                        <Tag
                          color={getFacilityTagColor(item.type)}
                          style={{ marginLeft: 8 }}
                        >
                          {getFacilityTypeName(item.type)}
                        </Tag>
                        <Text type="secondary" style={{ marginLeft: 8 }}>
                          <EnvironmentOutlined /> {item.distance}
                        </Text>
                      </div>
                    }
                    description={
                      <div>
                        <p>{item.address}</p>
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={150}
                            height={100}
                            style={{
                              objectFit: 'cover',
                              borderRadius: 4,
                            }}
                          />
                        )}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          ),
        },
        {
          key: 'restaurant',
          label: '餐飲',
          children: (
            <List
              dataSource={facilities.filter((f) => f.type === 'restaurant')}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={getFacilityIcon(item.type)}
                    title={item.name}
                    description={item.address}
                  />
                  <Text type="secondary">{item.distance}</Text>
                </List.Item>
              )}
            />
          ),
        },
        {
          key: 'store',
          label: '商店',
          children: (
            <List
              dataSource={facilities.filter((f) => f.type === 'store')}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={getFacilityIcon(item.type)}
                    title={item.name}
                    description={item.address}
                  />
                  <Text type="secondary">{item.distance}</Text>
                </List.Item>
              )}
            />
          ),
        },
        {
          key: 'attraction',
          label: '景點',
          children: (
            <List
              dataSource={facilities.filter((f) => f.type === 'attraction')}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={getFacilityIcon(item.type)}
                    title={item.name}
                    description={
                      <>
                        <p>{item.address}</p>
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={150}
                            height={100}
                            style={{
                              objectFit: 'cover',
                              borderRadius: 4,
                            }}
                          />
                        )}
                      </>
                    }
                  />
                  <Text type="secondary">{item.distance}</Text>
                </List.Item>
              )}
            />
          ),
        },
        {
          key: 'hotel',
          label: '住宿',
          children: (
            <List
              dataSource={facilities.filter((f) => f.type === 'hotel')}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={getFacilityIcon(item.type)}
                    title={item.name}
                    description={item.address}
                  />
                  <Text type="secondary">{item.distance}</Text>
                </List.Item>
              )}
            />
          ),
        },
      ];

      return <Tabs defaultActiveKey="all" items={facilityTabItems} />;
    },
  },
  {
    key: '3',
    label: '轉乘資訊',
    children: ({
      transports,
      getTransportIcon,
      getTransportTagColor,
    }: {
      transports: Transport[];
      getTransportIcon: (type: string) => React.ReactNode;
      getTransportTagColor: (type: string) => string;
    }) => (
      <List
        itemLayout="vertical"
        dataSource={transports}
        renderItem={(item: Transport) => (
          <List.Item>
            <List.Item.Meta
              avatar={getTransportIcon(item.type)}
              title={
                <div className="flex items-center">
                  <span>{item.name}</span>
                  <Tag
                    color={getTransportTagColor(item.type)}
                    style={{ marginLeft: 8 }}
                  >
                    {item.type}
                  </Tag>
                </div>
              }
              description={item.description}
            />
            {item.operationHours && (
              <div className="mt-2">
                <Text type="secondary">
                  <ClockCircleOutlined /> 營業時間: {item.operationHours}
                </Text>
              </div>
            )}
            {item.routes && item.routes.length > 0 && (
              <div className="mt-2">
                <Text strong>路線:</Text>
                <div className="flex flex-wrap gap-2 mt-1">
                  {item.routes.map((route, index) => (
                    <Tag key={index} color="blue">
                      {route}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
          </List.Item>
        )}
      />
    ),
  },
  {
    key: '4',
    label: '車站公告',
    children: (
      <List
        dataSource={[
          {
            title: '臨時車次異動公告',
            date: '2023-05-15',
            content:
              '因應端午節連續假期，本站將增開臨時車次，詳情請參閱站內公告。',
          },
          {
            title: '設施維修公告',
            date: '2023-05-10',
            content:
              '本站3號電梯進行定期維修，維修期間請改用1、2號電梯，造成不便，敬請見諒。',
          },
          {
            title: '站內廣播系統更新公告',
            date: '2023-04-30',
            content:
              '本站將於5月1日至5月3日進行廣播系統更新，期間可能有短暫的廣播中斷，造成不便，敬請見諒。',
          },
        ]}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={
                <div className="flex justify-between">
                  <span>{item.title}</span>
                  <Tag color="blue">{item.date}</Tag>
                </div>
              }
              description={item.content}
            />
          </List.Item>
        )}
      />
    ),
  },
];

const StationInfoPage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [transports, setTransports] = useState<Transport[]>([]);

  useEffect(() => {
    const loadStations = async () => {
      try {
        const stationData = await getAllStations();
        setStations(stationData);
        if (stationData.length > 0) {
          handleStationSelect(stationData[0].StationID);
        }
      } catch (error) {
        console.error('無法載入車站資料', error);
      } finally {
        setLoading(false);
      }
    };

    loadStations();
  }, []);

  // 當選擇車站時
  const handleStationSelect = (stationId: string) => {
    setLoading(true);

    // 從已載入的站點中找到選中的站點
    const station = stations.find((s) => s.StationID === stationId);
    setSelectedStation(station || null);

    // 模擬取得站點設施數據
    setTimeout(() => {
      const mockFacilities = generateMockFacilities();
      setFacilities(mockFacilities);

      const mockTransports = generateMockTransports();
      setTransports(mockTransports);

      setLoading(false);
    }, 1000);
  };

  // 生成模擬周邊設施數據
  const generateMockFacilities = (): Facility[] => {
    const facilityTypes: Array<
      'restaurant' | 'store' | 'attraction' | 'hotel' | 'transport'
    > = ['restaurant', 'store', 'attraction', 'hotel', 'transport'];

    const restaurantNames = [
      '台鐵便當',
      '鐵路茶餐廳',
      '月台咖啡',
      '列車便當',
      '鐵道食堂',
    ];
    const storeNames = [
      '超商站前店',
      '伴手禮專賣店',
      '台鐵紀念品',
      '旅行用品店',
      '書店',
    ];
    const attractionNames = [
      '鐵道博物館',
      '舊火車站',
      '鐵道藝術園區',
      '鐵道公園',
      '老街',
    ];
    const hotelNames = [
      '站前商務酒店',
      '鐵道旅館',
      '轉運站旅店',
      '商務飯店',
      '青年旅舍',
    ];
    const transportNames = [
      '轉運站',
      '客運總站',
      '停車場',
      '公車站',
      '計程車站',
    ];

    return Array(15)
      .fill(null)
      .map((_, index) => {
        const type =
          facilityTypes[Math.floor(Math.random() * facilityTypes.length)];
        let name = '';

        switch (type) {
          case 'restaurant':
            name =
              restaurantNames[
                Math.floor(Math.random() * restaurantNames.length)
              ];
            break;
          case 'store':
            name = storeNames[Math.floor(Math.random() * storeNames.length)];
            break;
          case 'attraction':
            name =
              attractionNames[
                Math.floor(Math.random() * attractionNames.length)
              ];
            break;
          case 'hotel':
            name = hotelNames[Math.floor(Math.random() * hotelNames.length)];
            break;
          case 'transport':
            name =
              transportNames[Math.floor(Math.random() * transportNames.length)];
            break;
        }

        return {
          id: `facility-${index}`,
          name: `${name} ${index + 1}`,
          type,
          distance: `${(Math.random() * 1000).toFixed(0)}公尺`,
          rating: Math.floor(Math.random() * 20 + 30) / 10,
          address: '站前路123號',
          image:
            type === 'attraction'
              ? `https://picsum.photos/id/${index + 50}/200/150`
              : undefined,
        };
      });
  };

  // 生成模擬轉乘資訊數據
  const generateMockTransports = (): Transport[] => {
    return [
      {
        id: 'transport-1',
        type: 'bus',
        name: '公車',
        routes: ['1路', '2路', '3路', '4路', '5路'],
        description: '車站外設有多條公車路線，可前往市中心及各主要景點。',
        operationHours: '05:30 - 23:00',
      },
      {
        id: 'transport-2',
        type: 'mrt',
        name: '捷運',
        routes: ['紅線', '藍線'],
        description: '與捷運站共構，可轉乘至捷運系統。',
        operationHours: '06:00 - 00:00',
      },
      {
        id: 'transport-3',
        type: 'bike',
        name: 'YouBike 公共自行車',
        description: '站前廣場設有YouBike站點，提供短程接駁服務。',
        operationHours: '24小時',
      },
      {
        id: 'transport-4',
        type: 'taxi',
        name: '計程車排班區',
        description: '東出口處設有計程車排班區，提供便捷接駁服務。',
      },
    ];
  };

  // 根據設施類型取得圖標
  const getFacilityIcon = (type: string) => {
    switch (type) {
      case 'restaurant':
        return <ShopOutlined style={{ color: '#fa8c16' }} />;
      case 'store':
        return <ShopOutlined style={{ color: '#1890ff' }} />;
      case 'attraction':
        return <BankOutlined style={{ color: '#52c41a' }} />;
      case 'hotel':
        return <BankOutlined style={{ color: '#722ed1' }} />;
      case 'transport':
        return <CarOutlined style={{ color: '#eb2f96' }} />;
      default:
        return <InfoCircleOutlined />;
    }
  };

  // 根據設施類型取得標籤顏色
  const getFacilityTagColor = (type: string) => {
    switch (type) {
      case 'restaurant':
        return 'orange';
      case 'store':
        return 'blue';
      case 'attraction':
        return 'green';
      case 'hotel':
        return 'purple';
      case 'transport':
        return 'magenta';
      default:
        return 'default';
    }
  };

  // 根據設施類型取得中文名稱
  const getFacilityTypeName = (type: string) => {
    switch (type) {
      case 'restaurant':
        return '餐廳';
      case 'store':
        return '商店';
      case 'attraction':
        return '景點';
      case 'hotel':
        return '住宿';
      case 'transport':
        return '轉運';
      default:
        return '其他';
    }
  };

  // 根據轉乘類型取得圖標
  const getTransportIcon = (type: string) => {
    switch (type) {
      case 'bus':
        return <CarOutlined style={{ color: '#1890ff' }} />;
      case 'mrt':
        return <CompassOutlined style={{ color: '#fa8c16' }} />;
      case 'bike':
        return <CompassOutlined style={{ color: '#52c41a' }} />;
      case 'taxi':
        return <CarOutlined style={{ color: '#eb2f96' }} />;
      default:
        return <CarOutlined />;
    }
  };

  // 根據轉乘類型取得標籤顏色
  const getTransportTagColor = (type: string) => {
    switch (type) {
      case 'bus':
        return 'blue';
      case 'mrt':
        return 'orange';
      case 'bike':
        return 'green';
      case 'taxi':
        return 'magenta';
      default:
        return 'default';
    }
  };

  // 生成主標籤項目，向item.children傳遞必要的props
  const generateMainTabItems = () => {
    // 定義Tabs.TabsProps['items']類型的items
    const items: {
      key: string;
      label: React.ReactNode;
      children: React.ReactNode;
    }[] = [];

    // 處理第一個標籤(營業時間)
    items.push({
      key: '1',
      label: '營業時間',
      children: (
        <>
          <Alert
            message="站務中心營業時間"
            description="每日 05:30 - 23:00，詳細時間可能因季節調整，請以現場公告為準。"
            type="info"
            showIcon
            className="mb-4"
          />
          <Descriptions bordered column={1} title="窗口營業時間">
            <Descriptions.Item label="售票窗口">
              06:00 - 22:00
            </Descriptions.Item>
            <Descriptions.Item label="客服中心">
              08:00 - 20:00
            </Descriptions.Item>
            <Descriptions.Item label="行李託運">
              08:00 - 20:00
            </Descriptions.Item>
          </Descriptions>
        </>
      ),
    });

    // 處理第二個標籤(周邊設施)
    items.push({
      key: '2',
      label: '周邊設施',
      children: (() => {
        // 建立設施分類籤項目
        const facilityTabItems = [
          {
            key: 'all',
            label: '全部',
            children: (
              <List
                itemLayout="horizontal"
                dataSource={facilities}
                renderItem={(item: Facility) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={getFacilityIcon(item.type)}
                      title={
                        <div className="flex items-center">
                          <span>{item.name}</span>
                          <Tag
                            color={getFacilityTagColor(item.type)}
                            style={{ marginLeft: 8 }}
                          >
                            {getFacilityTypeName(item.type)}
                          </Tag>
                          <Text type="secondary" style={{ marginLeft: 8 }}>
                            <EnvironmentOutlined /> {item.distance}
                          </Text>
                        </div>
                      }
                      description={
                        <div>
                          <p>{item.address}</p>
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={150}
                              height={100}
                              style={{
                                objectFit: 'cover',
                                borderRadius: 4,
                              }}
                            />
                          )}
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ),
          },
          {
            key: 'restaurant',
            label: '餐飲',
            children: (
              <List
                dataSource={facilities.filter((f) => f.type === 'restaurant')}
                renderItem={(item: Facility) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={getFacilityIcon(item.type)}
                      title={item.name}
                      description={item.address}
                    />
                    <Text type="secondary">{item.distance}</Text>
                  </List.Item>
                )}
              />
            ),
          },
          {
            key: 'store',
            label: '商店',
            children: (
              <List
                dataSource={facilities.filter((f) => f.type === 'store')}
                renderItem={(item: Facility) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={getFacilityIcon(item.type)}
                      title={item.name}
                      description={item.address}
                    />
                    <Text type="secondary">{item.distance}</Text>
                  </List.Item>
                )}
              />
            ),
          },
          {
            key: 'attraction',
            label: '景點',
            children: (
              <List
                dataSource={facilities.filter((f) => f.type === 'attraction')}
                renderItem={(item: Facility) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={getFacilityIcon(item.type)}
                      title={item.name}
                      description={
                        <>
                          <p>{item.address}</p>
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.name}
                              width={150}
                              height={100}
                              style={{
                                objectFit: 'cover',
                                borderRadius: 4,
                              }}
                            />
                          )}
                        </>
                      }
                    />
                    <Text type="secondary">{item.distance}</Text>
                  </List.Item>
                )}
              />
            ),
          },
          {
            key: 'hotel',
            label: '住宿',
            children: (
              <List
                dataSource={facilities.filter((f) => f.type === 'hotel')}
                renderItem={(item: Facility) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={getFacilityIcon(item.type)}
                      title={item.name}
                      description={item.address}
                    />
                    <Text type="secondary">{item.distance}</Text>
                  </List.Item>
                )}
              />
            ),
          },
        ];

        return <Tabs defaultActiveKey="all" items={facilityTabItems} />;
      })(),
    });

    // 處理第三個標籤(轉乘資訊)
    items.push({
      key: '3',
      label: '轉乘資訊',
      children: (
        <List
          itemLayout="vertical"
          dataSource={transports}
          renderItem={(item: Transport) => (
            <List.Item>
              <List.Item.Meta
                avatar={getTransportIcon(item.type)}
                title={
                  <div className="flex items-center">
                    <span>{item.name}</span>
                    <Tag
                      color={getTransportTagColor(item.type)}
                      style={{ marginLeft: 8 }}
                    >
                      {item.type}
                    </Tag>
                  </div>
                }
                description={item.description}
              />
              {item.operationHours && (
                <div className="mt-2">
                  <Text type="secondary">
                    <ClockCircleOutlined /> 營業時間: {item.operationHours}
                  </Text>
                </div>
              )}
              {item.routes && item.routes.length > 0 && (
                <div className="mt-2">
                  <Text strong>路線:</Text>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {item.routes.map((route, index) => (
                      <Tag key={index} color="blue">
                        {route}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}
            </List.Item>
          )}
        />
      ),
    });

    // 處理第四個標籤(車站公告)
    items.push({
      key: '4',
      label: '車站公告',
      children: (
        <List
          dataSource={[
            {
              title: '臨時車次異動公告',
              date: '2023-05-15',
              content:
                '因應端午節連續假期，本站將增開臨時車次，詳情請參閱站內公告。',
            },
            {
              title: '設施維修公告',
              date: '2023-05-10',
              content:
                '本站3號電梯進行定期維修，維修期間請改用1、2號電梯，造成不便，敬請見諒。',
            },
            {
              title: '站內廣播系統更新公告',
              date: '2023-04-30',
              content:
                '本站將於5月1日至5月3日進行廣播系統更新，期間可能有短暫的廣播中斷，造成不便，敬請見諒。',
            },
          ]}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <div className="flex justify-between">
                    <span>{item.title}</span>
                    <Tag color="blue">{item.date}</Tag>
                  </div>
                }
                description={item.content}
              />
            </List.Item>
          )}
        />
      ),
    });

    return items;
  };

  if (loading && !selectedStation) {
    return (
      <div className="p-6 flex justify-center items-center h-64">
        <Spin size="large" tip="加載車站資訊中..." />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Title level={2} style={{ marginBottom: 24, textAlign: 'center' }}>
        車站資訊
      </Title>

      <Card className="mb-6 shadow-sm">
        <Row gutter={16}>
          <Col xs={24} sm={12} md={6}>
            <div className="mb-4">
              <Text strong>選擇車站：</Text>
              <Select
                showSearch
                style={{ width: '100%', marginTop: 8 }}
                placeholder="選擇車站"
                optionFilterProp="children"
                value={selectedStation?.StationID}
                onChange={handleStationSelect}
                loading={loading}
              >
                {stations.map((station) => (
                  <Option key={station.StationID} value={station.StationID}>
                    {station.StationName.Zh_tw}
                  </Option>
                ))}
              </Select>
            </div>
          </Col>

          <Col xs={24} sm={12} md={18}>
            <div className="flex flex-wrap gap-2">
              {stations.slice(0, 10).map((station) => (
                <Button
                  key={station.StationID}
                  type={
                    selectedStation?.StationID === station.StationID
                      ? 'primary'
                      : 'default'
                  }
                  onClick={() => handleStationSelect(station.StationID)}
                  size="small"
                >
                  {station.StationName.Zh_tw}
                </Button>
              ))}
              {stations.length > 10 && (
                <Button type="dashed" size="small">
                  更多...
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </Card>

      {selectedStation ? (
        <Spin spinning={loading}>
          <Row gutter={24}>
            <Col xs={24} md={8}>
              <Card className="mb-6 shadow-sm">
                <div className="text-center mb-4">
                  <Title level={3}>{selectedStation.StationName.Zh_tw}</Title>
                  <Text type="secondary">{selectedStation.StationName.En}</Text>
                </div>

                <Descriptions bordered column={1} size="small">
                  <Descriptions.Item label="車站代碼">
                    {selectedStation.StationID}
                  </Descriptions.Item>
                  <Descriptions.Item label="車站地址">
                    <div className="flex items-center">
                      <EnvironmentOutlined className="mr-2" />
                      {selectedStation.StationAddress}
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="聯絡電話">
                    <div className="flex items-center">
                      <PhoneOutlined className="mr-2" />
                      {selectedStation.StationPhone}
                    </div>
                  </Descriptions.Item>
                  <Descriptions.Item label="車站等級">
                    {selectedStation.StationClass === '1'
                      ? '特等站'
                      : selectedStation.StationClass === '2'
                      ? '一等站'
                      : selectedStation.StationClass === '3'
                      ? '二等站'
                      : selectedStation.StationClass === '4'
                      ? '三等站'
                      : '簡易站'}
                  </Descriptions.Item>
                  <Descriptions.Item label="所在縣市">
                    {selectedStation.LocationCity}
                  </Descriptions.Item>
                  <Descriptions.Item label="所在鄉鎮">
                    {selectedStation.LocationTown}
                  </Descriptions.Item>
                </Descriptions>

                <Divider />

                <div>
                  <Title level={5}>車站位置</Title>
                  <div className="mt-4 station-location-card">
                    <Card className="bg-gray-50">
                      <div className="flex flex-col items-center">
                        <EnvironmentOutlined
                          style={{
                            fontSize: '36px',
                            color: '#f5222d',
                            marginBottom: '8px',
                          }}
                        />
                        <div className="text-center mb-2">
                          <Text strong>
                            {selectedStation.StationName.Zh_tw}站位置坐標
                          </Text>
                        </div>
                        <div className="text-center mb-3">
                          <Tag color="blue">
                            緯度:{' '}
                            {selectedStation.StationPosition.PositionLat.toFixed(
                              6
                            )}
                          </Tag>
                          <Tag color="blue">
                            經度:{' '}
                            {selectedStation.StationPosition.PositionLon.toFixed(
                              6
                            )}
                          </Tag>
                        </div>
                        <Divider style={{ margin: '8px 0' }} />
                        <div className="w-full">
                          <div className="flex justify-between items-center mb-2">
                            <Text strong>衛星圖像查看：</Text>
                            <Button
                              type="link"
                              icon={<CompassOutlined />}
                              href={`https://www.google.com/maps?q=${selectedStation.StationPosition.PositionLat},${selectedStation.StationPosition.PositionLon}`}
                              target="_blank"
                            >
                              在 Google Maps 中查看
                            </Button>
                          </div>
                          <div
                            className="location-visual p-4 mb-2 bg-white border rounded-lg"
                            style={{ height: '120px' }}
                          >
                            <div className="h-full flex flex-col justify-center items-center text-center bg-gray-100 rounded-lg relative overflow-hidden">
                              <div
                                className="absolute inset-0"
                                style={{
                                  backgroundImage: `url(https://picsum.photos/seed/${selectedStation.StationID}/500/300)`,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                  opacity: 0.3,
                                }}
                              ></div>
                              <EnvironmentOutlined
                                style={{
                                  fontSize: '24px',
                                  color: '#f5222d',
                                  zIndex: 10,
                                  marginBottom: '8px',
                                }}
                              />
                              <Text strong style={{ zIndex: 10 }}>
                                {selectedStation.StationName.Zh_tw}站
                              </Text>
                              <Text type="secondary" style={{ zIndex: 10 }}>
                                ({selectedStation.LocationCity}{' '}
                                {selectedStation.LocationTown})
                              </Text>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </Card>

              <Card className="mb-6 shadow-sm">
                <Title level={5}>站內設施</Title>
                <List
                  size="small"
                  dataSource={[
                    { name: '售票窗口', available: true, hours: '06:00-22:00' },
                    { name: '自動售票機', available: true, hours: '24小時' },
                    { name: '行李寄存', available: true, hours: '08:00-20:00' },
                    { name: '哺乳室', available: true, hours: '08:00-20:00' },
                    { name: '無障礙設施', available: true, hours: '24小時' },
                    { name: 'ATM', available: true, hours: '24小時' },
                    { name: '洗手間', available: true, hours: '05:00-24:00' },
                  ]}
                  renderItem={(item) => (
                    <List.Item>
                      <div className="flex justify-between w-full">
                        <Text>{item.name}</Text>
                        <Space>
                          {item.available ? (
                            <Tag color="green">有</Tag>
                          ) : (
                            <Tag color="red">無</Tag>
                          )}
                          <Text type="secondary">
                            <ClockCircleOutlined /> {item.hours}
                          </Text>
                        </Space>
                      </div>
                    </List.Item>
                  )}
                />
              </Card>
            </Col>

            <Col xs={24} md={16}>
              <Card className="shadow-sm">
                <Tabs defaultActiveKey="1" items={generateMainTabItems()} />
              </Card>
            </Col>
          </Row>
        </Spin>
      ) : (
        <Empty description="請選擇一個車站以查看詳細資訊" />
      )}
    </div>
  );
};

export default StationInfoPage;
