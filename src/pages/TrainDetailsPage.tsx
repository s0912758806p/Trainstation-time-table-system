import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Table,
  Card,
  Typography,
  Spin,
  Alert,
  Button,
  List,
  Divider,
  Tag,
  Space,
} from 'antd';
import { getTrainByNumber, TrainSchedule } from '../api/train';
import { getMockTrainByNumber } from '../api/mockTrainDetails';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

interface RouteState {
  trainNo: string;
  date: string;
}

interface StopInfo {
  key: string;
  sequence: number;
  stationId: string;
  stationName: string;
  arrivalTime: string;
  departureTime: string;
}

const TrainDetailsPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const locationState = location.state as RouteState | null;

  // 從URL參數或state中獲取車次和日期
  const trainNoFromQuery = queryParams.get('trainNo');
  const dateFromQuery = queryParams.get('date');

  // 優先使用URL參數，其次使用location.state，最後使用默認值
  const trainNo = trainNoFromQuery || locationState?.trainNo || '1202';
  // 默認使用今天的日期，格式：YYYY-MM-DD
  const date =
    dateFromQuery || locationState?.date || dayjs().format('YYYY-MM-DD');

  const [loading, setLoading] = useState(true);
  const [trainData, setTrainData] = useState<TrainSchedule | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const fetchTrainDetails = async () => {
      if (!trainNo) {
        setError('缺少必要的查詢參數');
        setLoading(false);
        return;
      }

      try {
        // 使用模擬數據（替代API調用）
        const result = await getMockTrainByNumber(trainNo, date);
        if (result && result.length > 0) {
          setTrainData(result[0]);
        } else {
          setError('找不到指定的列車資訊');
        }
      } catch (err) {
        console.error('Failed to fetch train details:', err);
        setError('獲取列車資訊時發生錯誤');
      } finally {
        setLoading(false);
      }
    };

    fetchTrainDetails();
  }, [trainNo, date]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const columns = [
    {
      title: '序號',
      dataIndex: 'sequence',
      key: 'sequence',
      width: 80,
    },
    {
      title: '站點',
      dataIndex: 'stationName',
      key: 'stationName',
    },
    {
      title: '到站時間',
      dataIndex: 'arrivalTime',
      key: 'arrivalTime',
      width: 120,
    },
    {
      title: '發車時間',
      dataIndex: 'departureTime',
      key: 'departureTime',
      width: 120,
    },
  ];

  const getStopData = (): StopInfo[] => {
    if (!trainData) return [];

    return trainData.StopTimes.map((stop, index) => ({
      key: `${index}`,
      sequence: stop.StopSequence,
      stationId: stop.StationID,
      stationName: stop.StationName.Zh_tw,
      arrivalTime: stop.ArrivalTime,
      departureTime: stop.DepartureTime,
    }));
  };

  // 處理測試數據按鈕點擊
  const handleTestData = () => {
    const testTrainNumbers = ['1202', '2201', '3102'];
    // 隨機選擇一個車次進行測試
    const randomIndex = Math.floor(Math.random() * testTrainNumbers.length);
    const testTrainNo = testTrainNumbers[randomIndex];

    setLoading(true);

    getMockTrainByNumber(testTrainNo, date)
      .then((result) => {
        if (result && result.length > 0) {
          setTrainData(result[0]);
          setError(null);
        } else {
          setError('找不到指定的列車資訊');
        }
      })
      .catch((err) => {
        console.error('Failed to fetch test train details:', err);
        setError('獲取測試列車資訊時發生錯誤');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const renderMobileStopsList = () => {
    const stopData = getStopData();

    return (
      <List
        dataSource={stopData}
        renderItem={(item) => (
          <List.Item className="py-3 flex flex-col items-start">
            <div className="flex items-center w-full">
              <div className="mr-3">
                <Tag color="blue">{item.sequence}</Tag>
              </div>
              <div className="flex-1">
                <div className="text-base font-medium">{item.stationName}</div>
                <div className="flex justify-between mt-1 text-gray-500 text-sm">
                  <div>
                    <Text type="secondary">到站：</Text>
                    <Text>{item.arrivalTime}</Text>
                  </div>
                  <div>
                    <Text type="secondary">發車：</Text>
                    <Text>{item.departureTime}</Text>
                  </div>
                </div>
              </div>
            </div>
          </List.Item>
        )}
      />
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="載入列車資訊中..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert
          message="錯誤"
          description={error}
          type="error"
          showIcon
          action={
            <Button size="small" type="primary" onClick={handleTestData}>
              載入測試數據
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="p-4">
      <Card>
        <div className="mb-6">
          <Title level={3}>
            {trainData?.DailyTrainInfo.TrainNo} 次列車詳細資訊
            <Button
              type="link"
              onClick={handleTestData}
              style={{ marginLeft: 16 }}
            >
              載入其他測試數據
            </Button>
          </Title>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div>
              <Text strong>列車種類：</Text>
              <Text>{trainData?.DailyTrainInfo.TrainTypeName.Zh_tw}</Text>
            </div>
            <div>
              <Text strong>起點站：</Text>
              <Text>{trainData?.DailyTrainInfo.StartingStationName.Zh_tw}</Text>
            </div>
            <div>
              <Text strong>終點站：</Text>
              <Text>{trainData?.DailyTrainInfo.EndingStationName.Zh_tw}</Text>
            </div>
            <div>
              <Text strong>行駛方向：</Text>
              <Text>
                {trainData?.DailyTrainInfo.Direction === 0 ? '南下' : '北上'}
              </Text>
            </div>
            <div>
              <Text strong>行駛日期：</Text>
              <Text>{trainData?.TrainDate}</Text>
            </div>
            <div>
              <Text strong>車次資訊：</Text>
              <Text>{trainData?.DailyTrainInfo.TripHeadSign}</Text>
            </div>
            {trainData?.DailyTrainInfo.Note && (
              <div>
                <Text strong>備註：</Text>
                <Text>{trainData.DailyTrainInfo.Note}</Text>
              </div>
            )}
          </div>
        </div>

        <Title level={4}>停靠站資訊</Title>
        <div className="overflow-x-auto">
          <Table
            columns={columns}
            dataSource={getStopData()}
            pagination={false}
            size={isMobile ? 'small' : 'middle'}
            bordered
          />
        </div>
      </Card>

      <style>
        {`
        @media (max-width: 768px) {
          .ant-table {
            font-size: 14px;
          }
          .ant-table-cell {
            padding: 8px;
          }
        }
        `}
      </style>
    </div>
  );
};

export default TrainDetailsPage;
