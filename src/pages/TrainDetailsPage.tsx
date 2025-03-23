import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Table, Card, Typography, Spin, Alert } from 'antd';
import { getTrainByNumber, TrainSchedule } from '../api/train';

const { Title, Text } = Typography;

const TrainDetailsPage = () => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trainData, setTrainData] = useState<TrainSchedule | null>(null);

  useEffect(() => {
    const fetchTrainDetails = async () => {
      const queryParams = new URLSearchParams(location.search);
      const trainNo = queryParams.get('trainNo');
      const date =
        queryParams.get('date') || new Date().toISOString().split('T')[0];

      if (!trainNo) {
        setError('未提供車次號碼');
        return;
      }

      try {
        setLoading(true);
        const data = await getTrainByNumber(trainNo, date);
        if (data && data.length > 0) {
          setTrainData(data[0]);
        } else {
          setError('找不到該列車資料');
        }
      } catch (err) {
        setError('獲取列車資料時出錯');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainDetails();
  }, [location.search]);

  const columns = [
    {
      title: '停靠序號',
      dataIndex: 'StopSequence',
      key: 'stopSequence',
    },
    {
      title: '站點名稱',
      dataIndex: ['StationName', 'Zh_tw'],
      key: 'stationName',
    },
    {
      title: '抵達時間',
      dataIndex: 'ArrivalTime',
      key: 'arrivalTime',
    },
    {
      title: '離開時間',
      dataIndex: 'DepartureTime',
      key: 'departureTime',
    },
  ];

  if (loading) {
    return (
      <Spin
        tip="加載中..."
        size="large"
        className="flex justify-center items-center h-screen"
      />
    );
  }

  if (error) {
    return <Alert message="錯誤" description={error} type="error" showIcon />;
  }

  return (
    <div className="p-6">
      {trainData && (
        <>
          <Card className="mb-6">
            <Title level={3}>
              {trainData.TrainInfo.TrainTypeName.Zh_tw}{' '}
              {trainData.TrainInfo.TrainNo}
            </Title>
            <div className="flex flex-wrap gap-4">
              <Text className="text-lg">
                <strong>起點站：</strong>{' '}
                {trainData.TrainInfo.StartingStationName.Zh_tw}
              </Text>
              <Text className="text-lg">
                <strong>終點站：</strong>{' '}
                {trainData.TrainInfo.EndingStationName.Zh_tw}
              </Text>
            </div>
          </Card>

          <Table
            dataSource={trainData.StopTimes}
            columns={columns}
            rowKey="StopSequence"
            pagination={false}
          />
        </>
      )}
    </div>
  );
};

export default TrainDetailsPage;
