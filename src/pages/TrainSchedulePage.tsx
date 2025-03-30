import React, { useState, useEffect } from 'react';
import {
  DatePicker,
  Select,
  Button,
  Card,
  Table,
  message,
  Typography,
  Input,
  Tag,
  Tabs,
} from 'antd';
import type { Dayjs } from 'dayjs';
import {
  SearchOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  RocketOutlined,
} from '@ant-design/icons';
import {
  getAllStations,
  getTrainsByRoute,
  getTrainByNumber,
  TrainSchedule as ApiTrainSchedule,
} from '../api/train';

const { Option } = Select;
const { Title } = Typography;

// 調整後的列車時刻表接口
interface DisplayTrainSchedule {
  key: string;
  trainNo: string;
  departureTime: string;
  arrivalTime: string;
  departureStation: string;
  arrivalStation: string;
  duration: string;
  trainTypeName: string;
}

const TrainSchedulePage: React.FC = () => {
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [departureStation, setDepartureStation] = useState<string>('');
  const [arrivalStation, setArrivalStation] = useState<string>('');
  const [trainNumber, setTrainNumber] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [schedules, setSchedules] = useState<DisplayTrainSchedule[]>([]);
  const [stations, setStations] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const columns = [
    {
      title: '車次',
      dataIndex: 'trainNo',
      key: 'trainNo',
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '出發時間',
      dataIndex: 'departureTime',
      key: 'departureTime',
      render: (text: string) => (
        <span>
          <ClockCircleOutlined style={{ marginRight: 8 }} />
          {text}
        </span>
      ),
    },
    {
      title: '到達時間',
      dataIndex: 'arrivalTime',
      key: 'arrivalTime',
      render: (text: string) => (
        <span>
          <ClockCircleOutlined style={{ marginRight: 8 }} />
          {text}
        </span>
      ),
    },
    {
      title: '出發站',
      dataIndex: 'departureStation',
      key: 'departureStation',
      render: (text: string) => (
        <span>
          <EnvironmentOutlined style={{ marginRight: 8 }} />
          {text}
        </span>
      ),
    },
    {
      title: '到達站',
      dataIndex: 'arrivalStation',
      key: 'arrivalStation',
      render: (text: string) => (
        <span>
          <EnvironmentOutlined style={{ marginRight: 8 }} />
          {text}
        </span>
      ),
    },
    {
      title: '列車種類',
      dataIndex: 'trainTypeName',
      key: 'trainTypeName',
    },
    {
      title: '行駛時間',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: unknown, record: DisplayTrainSchedule) => (
        <Button
          type="primary"
          size="small"
          onClick={() => handleViewDetails(record)}
        >
          詳情
        </Button>
      ),
    },
  ];

  const handleViewDetails = (record: DisplayTrainSchedule) => {
    message.info(`已選擇車次: ${record.trainNo}`);
    // 這裡可以添加查看詳情的邏輯
  };

  // 計算兩個時間點之間的時間差
  const calculateDuration = (departureTime: string, arrivalTime: string) => {
    const [depHours, depMins] = departureTime.split(':').map(Number);
    const [arrHours, arrMins] = arrivalTime.split(':').map(Number);

    let diffMinutes = arrHours * 60 + arrMins - (depHours * 60 + depMins);

    // 如果是負數，表示跨日
    if (diffMinutes < 0) {
      diffMinutes += 24 * 60;
    }

    const hours = Math.floor(diffMinutes / 60);
    const minutes = diffMinutes % 60;

    return `${hours}小時${minutes}分`;
  };

  // 從API結果轉換為顯示用的時刻表數據
  const formatScheduleData = (
    apiData: ApiTrainSchedule[]
  ): DisplayTrainSchedule[] => {
    return apiData.map((train) => {
      const stopTimes = train.StopTimes || [];

      // 找出符合起點和終點站的站點
      const departureStopIndex = departureStation
        ? stopTimes.findIndex((stop) => stop.StationID === departureStation)
        : 0;

      const arrivalStopIndex = arrivalStation
        ? stopTimes.findIndex((stop) => stop.StationID === arrivalStation)
        : stopTimes.length - 1;

      const departureStop =
        departureStopIndex >= 0 ? stopTimes[departureStopIndex] : stopTimes[0];
      const arrivalStop =
        arrivalStopIndex >= 0
          ? stopTimes[arrivalStopIndex]
          : stopTimes[stopTimes.length - 1];

      const departureTime = departureStop.DepartureTime;
      const arrivalTime = arrivalStop.ArrivalTime;

      return {
        key: train.DailyTrainInfo.TrainNo,
        trainNo: train.DailyTrainInfo.TrainNo,
        departureTime,
        arrivalTime,
        departureStation: departureStop.StationName.Zh_tw,
        arrivalStation: arrivalStop.StationName.Zh_tw,
        duration: calculateDuration(departureTime, arrivalTime),
        trainTypeName: train.DailyTrainInfo.TrainTypeName.Zh_tw,
      };
    });
  };

  const handleRouteSearch = async () => {
    if (!startDate) {
      message.error('請選擇日期');
      return;
    }

    if (!departureStation || !arrivalStation) {
      message.error('請選擇出發站和抵達站');
      return;
    }

    setLoading(true);
    setSchedules([]);
    setError(null);

    try {
      const formattedDate = startDate.format('YYYY-MM-DD');
      const trainData = await getTrainsByRoute(
        departureStation,
        arrivalStation,
        formattedDate
      );

      const formattedData = formatScheduleData(trainData);
      setSchedules(formattedData);

      if (formattedData.length === 0) {
        message.info('查無符合條件的列車');
      } else {
        message.success('查詢成功');
      }
    } catch (error) {
      console.error('查詢失敗，請稍後再試', error);
      setError('無法獲取列車資料，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  const handleTrainSearch = async () => {
    if (!startDate) {
      message.error('請選擇日期');
      return;
    }

    if (!trainNumber) {
      message.error('請輸入車次');
      return;
    }

    setLoading(true);
    setSchedules([]);
    setError(null);

    try {
      const formattedDate = startDate.format('YYYY-MM-DD');
      const trainData = await getTrainByNumber(trainNumber, formattedDate);

      const formattedData = formatScheduleData(trainData);
      setSchedules(formattedData);

      if (formattedData.length === 0) {
        message.info('查無此車次');
      } else {
        message.success('查詢成功');
      }
    } catch (error) {
      console.error('查詢失敗，請稍後再試', error);
      setError('無法獲取列車資料，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  // 車站查詢頁面
  const stationSearchContent = (
    <Card className="mb-6 shadow-sm">
      <div className="flex flex-wrap gap-4">
        <div className={isMobile ? 'w-full' : 'flex-1 min-w-[200px]'}>
          <label className="block mb-2 font-medium">出發日期</label>
          <DatePicker
            className="w-full"
            placeholder="選擇日期"
            onChange={setStartDate}
            value={startDate}
          />
        </div>
        <div className={isMobile ? 'w-full' : 'flex-1 min-w-[200px]'}>
          <label className="block mb-2 font-medium">出發站</label>
          <Select
            className="w-full"
            placeholder="選擇出發站"
            showSearch
            optionFilterProp="children"
            value={departureStation}
            onChange={setDepartureStation}
            options={stations}
          />
        </div>
        <div className={isMobile ? 'w-full' : 'flex-1 min-w-[200px]'}>
          <label className="block mb-2 font-medium">到達站</label>
          <Select
            className="w-full"
            placeholder="選擇到達站"
            showSearch
            optionFilterProp="children"
            value={arrivalStation}
            onChange={setArrivalStation}
            options={stations}
          />
        </div>
        <div className={isMobile ? 'w-full' : 'flex-1 min-w-[200px]'}>
          <label className="block mb-2 font-medium">&nbsp;</label>
          <Button
            type="primary"
            className="w-full"
            onClick={handleRouteSearch}
            loading={loading}
            icon={<SearchOutlined />}
          >
            查詢
          </Button>
        </div>
      </div>
    </Card>
  );

  // 車次查詢頁面
  const trainNumberSearchContent = (
    <Card className="mb-6 shadow-sm">
      <div className="flex flex-wrap gap-4">
        <div className={isMobile ? 'w-full' : 'flex-1 min-w-[200px]'}>
          <label className="block mb-2 font-medium">出發日期</label>
          <DatePicker
            className="w-full"
            placeholder="選擇日期"
            onChange={setStartDate}
            value={startDate}
          />
        </div>
        <div className={isMobile ? 'w-full' : 'flex-1 min-w-[200px]'}>
          <label className="block mb-2 font-medium">車次</label>
          <Input
            placeholder="請輸入車次號碼"
            value={trainNumber}
            onChange={(e) => setTrainNumber(e.target.value)}
          />
        </div>
        <div className={isMobile ? 'w-full' : 'flex-1 min-w-[200px]'}>
          <label className="block mb-2 font-medium">&nbsp;</label>
          <Button
            type="primary"
            className="w-full"
            onClick={handleTrainSearch}
            loading={loading}
            icon={<SearchOutlined />}
          >
            查詢
          </Button>
        </div>
      </div>
    </Card>
  );

  // Tab 項目定義
  const tabItems = [
    {
      key: 'byStation',
      label: '車站查詢',
      children: stationSearchContent,
    },
    {
      key: 'byTrainNumber',
      label: '車次查詢',
      children: trainNumberSearchContent,
    },
  ];

  return (
    <div className="train-schedule-page p-6">
      <Title level={2} style={{ marginBottom: 24, textAlign: 'center' }}>
        <RocketOutlined style={{ fontSize: 32, marginRight: 12 }} />
        台鐵火車時刻表查詢系統
      </Title>

      <Tabs
        items={tabItems}
        defaultActiveKey="byStation"
        centered
        className="mb-6"
      />

      <Card className="shadow-sm">
        <Title level={4} className="mb-4">
          查詢結果
        </Title>
        {error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div className="overflow-x-auto">
            {isMobile && schedules.length > 0 ? (
              <Table
                columns={[
                  {
                    title: '車次/時間',
                    key: 'trainInfo',
                    render: (record: DisplayTrainSchedule) => (
                      <div>
                        <div>
                          <Tag color="blue">{record.trainNo}</Tag>{' '}
                          {record.trainTypeName}
                        </div>
                        <div className="text-sm mt-1">
                          <ClockCircleOutlined className="mr-1" />{' '}
                          {record.departureTime} → {record.arrivalTime}
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: '站點',
                    key: 'stations',
                    render: (record: DisplayTrainSchedule) => (
                      <div>
                        <div className="text-sm">
                          <EnvironmentOutlined className="mr-1" />{' '}
                          {record.departureStation} → {record.arrivalStation}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {record.duration}
                        </div>
                      </div>
                    ),
                  },
                  {
                    title: '',
                    key: 'action',
                    render: (record: DisplayTrainSchedule) => (
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => handleViewDetails(record)}
                      >
                        詳情
                      </Button>
                    ),
                  },
                ]}
                dataSource={schedules}
                rowKey="trainNo"
                loading={loading}
                pagination={{ pageSize: 10, size: 'small' }}
                size="small"
              />
            ) : (
              <Table
                columns={columns}
                dataSource={schedules}
                rowKey="trainNo"
                loading={loading}
                pagination={{ pageSize: 10 }}
                bordered
                scroll={{ x: 'max-content' }}
              />
            )}
          </div>
        )}
      </Card>

      <style>
        {`
        @media (max-width: 768px) {
          .ant-picker, .ant-select, .ant-input {
            width: 100%;
          }
          .train-schedule-page .ant-card-body {
            padding: 16px;
          }
        }
        `}
      </style>
    </div>
  );
};

export default TrainSchedulePage;
