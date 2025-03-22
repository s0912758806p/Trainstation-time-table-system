import { useState, useEffect } from 'react';
import { Space, Table, Select } from 'antd';

interface TrainScheduleItem {
  trainNumber: string;
  departureStation: string;
  arrivalStation: string;
  departureTime: string;
  arrivalTime: string;
  departureStationCode?: string;
  arrivalStationCode?: string;
}

interface TrainStationItem {
  stationName: string;
  stationCode: string;
}

const TrainSchedule: React.FC = () => {
  const [trainScheduleTableList, setTrainScheduleTableList] = useState<
    TrainScheduleItem[]
  >([]);
  const [trainStationList, setTrainStationList] = useState<TrainStationItem[]>(
    []
  );
  const [trainStationValue, setTrainStationValue] = useState<string>('');
  const [filteredTrainScheduleTableList, setFilteredTrainScheduleTableList] =
    useState<TrainScheduleItem[]>([]);

  useEffect(() => {
    // Initial data setup
    setTrainScheduleTableList([
      {
        trainNumber: '1234',
        departureStation: '台北',
        arrivalStation: '高雄',
        departureTime: '08:00',
        arrivalTime: '10:00',
        departureStationCode: 'taipei',
        arrivalStationCode: 'kaohsiung',
      },
      {
        trainNumber: '5678',
        departureStation: '高雄',
        arrivalStation: '台北',
        departureTime: '12:00',
        arrivalTime: '14:00',
        departureStationCode: 'kaohsiung',
        arrivalStationCode: 'taipei',
      },
    ]);

    setTrainStationList([
      { stationName: '全部', stationCode: 'all' },
      { stationName: '台北', stationCode: 'taipei' },
      { stationName: '台中', stationCode: 'taichung' },
      { stationName: '台南', stationCode: 'tainan' },
      { stationName: '高雄', stationCode: 'kaohsiung' },
    ]);

    setTrainStationValue('all');
  }, []);

  useEffect(() => {
    // filter the train schedule based on the selected station
    if (trainStationValue === 'all') {
      setFilteredTrainScheduleTableList(trainScheduleTableList);
    } else {
      const filteredList = trainScheduleTableList.filter((item) => {
        return item.departureStationCode === trainStationValue;
      });
      setFilteredTrainScheduleTableList(filteredList);
    }
  }, [trainStationValue, trainScheduleTableList]);

  return (
    <>
      <div className="train-schedule-page">
        <div>火車時刻表</div>
        <div>
          <label htmlFor="departureStation">出發站</label>
          <Space wrap>
            <Select
              value={trainStationValue}
              onChange={(value) => setTrainStationValue(value)}
              options={trainStationList.map((item) => ({
                label: item.stationName,
                value: item.stationCode,
              }))}
            />
          </Space>
        </div>
        <div>
          <Table
            dataSource={filteredTrainScheduleTableList}
            columns={[
              { title: '車次', dataIndex: 'trainNumber', key: 'trainNumber' },
              {
                title: '出發站',
                dataIndex: 'departureStation',
                key: 'departureStation',
              },
              {
                title: '到達站',
                dataIndex: 'arrivalStation',
                key: 'arrivalStation',
              },
              {
                title: '出發時間',
                dataIndex: 'departureTime',
                key: 'departureTime',
              },
              {
                title: '到達時間',
                dataIndex: 'arrivalTime',
                key: 'arrivalTime',
              },
            ]}
          />
        </div>
      </div>
    </>
  );
};

export default TrainSchedule;
