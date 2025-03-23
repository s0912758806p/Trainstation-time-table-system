import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Table, Card, Typography, Spin, Alert } from 'antd';
import { getTrainByNumber, TrainSchedule } from '../api/train';

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
  const state = location.state as RouteState;
  const { trainNo, date } = state || { trainNo: '', date: '' };

  const [loading, setLoading] = useState(true);
  const [trainData, setTrainData] = useState<TrainSchedule | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrainDetails = async () => {
      if (!trainNo || !date) {
        setError('缺少必要的查詢參數');
        setLoading(false);
        return;
      }

      try {
        const result = await getTrainByNumber(trainNo, date);
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
        <Alert message="錯誤" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div className="p-4">
      <Card>
        <div className="mb-6">
          <Title level={3}>
            {trainData?.DailyTrainInfo.TrainNo} 次列車詳細資訊
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
            {trainData?.DailyTrainInfo.Note && (
              <div>
                <Text strong>備註：</Text>
                <Text>{trainData.DailyTrainInfo.Note}</Text>
              </div>
            )}
          </div>
        </div>

        <Title level={4}>停靠站資訊</Title>
        <Table
          columns={columns}
          dataSource={getStopData()}
          pagination={false}
          size="middle"
          bordered
        />
      </Card>
    </div>
  );
};

export default TrainDetailsPage;
