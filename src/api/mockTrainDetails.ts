import { TrainSchedule } from './train';

// 創建模擬列車數據
export const mockTrainDetails: Record<string, TrainSchedule> = {
  '1202': {
    TrainDate: '2023-11-15',
    DailyTrainInfo: {
      TrainNo: '1202',
      Direction: 0,
      TrainTypeID: '1',
      StartingStationID: '0990',
      StartingStationName: {
        Zh_tw: '基隆',
        En: 'Keelung',
      },
      EndingStationID: '1070',
      EndingStationName: {
        Zh_tw: '高雄',
        En: 'Kaohsiung',
      },
      TrainTypeName: {
        Zh_tw: '自強號',
        En: 'Tze-Chiang Limited Express',
      },
      TripHeadSign: '往高雄',
      WheelchairFlag: 1,
      BikeFlag: 0,
      BreastFeedingFlag: 1,
      DailyFlag: 1,
      ServiceAddedFlag: 0,
      Note: '假日行駛',
    },
    StopTimes: [
      {
        StopSequence: 1,
        StationID: '0990',
        StationName: {
          Zh_tw: '基隆站',
          En: 'Keelung Station',
        },
        ArrivalTime: '06:00',
        DepartureTime: '06:05',
        SuspendFlag: 0,
      },
      {
        StopSequence: 2,
        StationID: '1000',
        StationName: {
          Zh_tw: '臺北站',
          En: 'Taipei Station',
        },
        ArrivalTime: '06:30',
        DepartureTime: '06:35',
        SuspendFlag: 0,
      },
      {
        StopSequence: 3,
        StationID: '1010',
        StationName: {
          Zh_tw: '板橋站',
          En: 'Banqiao Station',
        },
        ArrivalTime: '06:45',
        DepartureTime: '06:48',
        SuspendFlag: 0,
      },
      {
        StopSequence: 4,
        StationID: '1020',
        StationName: {
          Zh_tw: '桃園站',
          En: 'Taoyuan Station',
        },
        ArrivalTime: '07:10',
        DepartureTime: '07:13',
        SuspendFlag: 0,
      },
      {
        StopSequence: 5,
        StationID: '1030',
        StationName: {
          Zh_tw: '新竹站',
          En: 'Hsinchu Station',
        },
        ArrivalTime: '07:35',
        DepartureTime: '07:38',
        SuspendFlag: 0,
      },
      {
        StopSequence: 6,
        StationID: '1035',
        StationName: {
          Zh_tw: '苗栗站',
          En: 'Miaoli Station',
        },
        ArrivalTime: '08:00',
        DepartureTime: '08:03',
        SuspendFlag: 0,
      },
      {
        StopSequence: 7,
        StationID: '1040',
        StationName: {
          Zh_tw: '臺中站',
          En: 'Taichung Station',
        },
        ArrivalTime: '08:40',
        DepartureTime: '08:45',
        SuspendFlag: 0,
      },
      {
        StopSequence: 8,
        StationID: '1050',
        StationName: {
          Zh_tw: '彰化站',
          En: 'Changhua Station',
        },
        ArrivalTime: '09:05',
        DepartureTime: '09:08',
        SuspendFlag: 0,
      },
      {
        StopSequence: 9,
        StationID: '1060',
        StationName: {
          Zh_tw: '臺南站',
          En: 'Tainan Station',
        },
        ArrivalTime: '10:15',
        DepartureTime: '10:20',
        SuspendFlag: 0,
      },
      {
        StopSequence: 10,
        StationID: '1070',
        StationName: {
          Zh_tw: '高雄站',
          En: 'Kaohsiung Station',
        },
        ArrivalTime: '11:00',
        DepartureTime: '11:00',
        SuspendFlag: 0,
      },
    ],
  },
  '2201': {
    TrainDate: '2023-11-15',
    DailyTrainInfo: {
      TrainNo: '2201',
      Direction: 1,
      TrainTypeID: '1',
      StartingStationID: '1070',
      StartingStationName: {
        Zh_tw: '高雄',
        En: 'Kaohsiung',
      },
      EndingStationID: '0990',
      EndingStationName: {
        Zh_tw: '基隆',
        En: 'Keelung',
      },
      TrainTypeName: {
        Zh_tw: '自強號',
        En: 'Tze-Chiang Limited Express',
      },
      TripHeadSign: '往基隆',
      WheelchairFlag: 1,
      BikeFlag: 0,
      BreastFeedingFlag: 1,
      DailyFlag: 1,
      ServiceAddedFlag: 0,
      Note: '',
    },
    StopTimes: [
      {
        StopSequence: 1,
        StationID: '1070',
        StationName: {
          Zh_tw: '高雄站',
          En: 'Kaohsiung Station',
        },
        ArrivalTime: '14:00',
        DepartureTime: '14:05',
        SuspendFlag: 0,
      },
      {
        StopSequence: 2,
        StationID: '1060',
        StationName: {
          Zh_tw: '臺南站',
          En: 'Tainan Station',
        },
        ArrivalTime: '14:45',
        DepartureTime: '14:48',
        SuspendFlag: 0,
      },
      {
        StopSequence: 3,
        StationID: '1050',
        StationName: {
          Zh_tw: '彰化站',
          En: 'Changhua Station',
        },
        ArrivalTime: '15:55',
        DepartureTime: '15:58',
        SuspendFlag: 0,
      },
      {
        StopSequence: 4,
        StationID: '1040',
        StationName: {
          Zh_tw: '臺中站',
          En: 'Taichung Station',
        },
        ArrivalTime: '16:20',
        DepartureTime: '16:25',
        SuspendFlag: 0,
      },
      {
        StopSequence: 5,
        StationID: '1035',
        StationName: {
          Zh_tw: '苗栗站',
          En: 'Miaoli Station',
        },
        ArrivalTime: '17:00',
        DepartureTime: '17:03',
        SuspendFlag: 0,
      },
      {
        StopSequence: 6,
        StationID: '1030',
        StationName: {
          Zh_tw: '新竹站',
          En: 'Hsinchu Station',
        },
        ArrivalTime: '17:30',
        DepartureTime: '17:33',
        SuspendFlag: 0,
      },
      {
        StopSequence: 7,
        StationID: '1020',
        StationName: {
          Zh_tw: '桃園站',
          En: 'Taoyuan Station',
        },
        ArrivalTime: '17:55',
        DepartureTime: '17:58',
        SuspendFlag: 0,
      },
      {
        StopSequence: 8,
        StationID: '1010',
        StationName: {
          Zh_tw: '板橋站',
          En: 'Banqiao Station',
        },
        ArrivalTime: '18:20',
        DepartureTime: '18:23',
        SuspendFlag: 0,
      },
      {
        StopSequence: 9,
        StationID: '1000',
        StationName: {
          Zh_tw: '臺北站',
          En: 'Taipei Station',
        },
        ArrivalTime: '18:35',
        DepartureTime: '18:40',
        SuspendFlag: 0,
      },
      {
        StopSequence: 10,
        StationID: '0990',
        StationName: {
          Zh_tw: '基隆站',
          En: 'Keelung Station',
        },
        ArrivalTime: '19:10',
        DepartureTime: '19:10',
        SuspendFlag: 0,
      },
    ],
  },
  '3102': {
    TrainDate: '2023-11-15',
    DailyTrainInfo: {
      TrainNo: '3102',
      Direction: 0,
      TrainTypeID: '2',
      StartingStationID: '1000',
      StartingStationName: {
        Zh_tw: '臺北',
        En: 'Taipei',
      },
      EndingStationID: '1210',
      EndingStationName: {
        Zh_tw: '花蓮',
        En: 'Hualien',
      },
      TrainTypeName: {
        Zh_tw: '莒光號',
        En: 'Chu-Kuang Express',
      },
      TripHeadSign: '往花蓮',
      WheelchairFlag: 1,
      BikeFlag: 0,
      BreastFeedingFlag: 1,
      DailyFlag: 1,
      ServiceAddedFlag: 0,
      Note: '',
    },
    StopTimes: [
      {
        StopSequence: 1,
        StationID: '1000',
        StationName: {
          Zh_tw: '臺北站',
          En: 'Taipei Station',
        },
        ArrivalTime: '08:00',
        DepartureTime: '08:05',
        SuspendFlag: 0,
      },
      {
        StopSequence: 2,
        StationID: '1080',
        StationName: {
          Zh_tw: '宜蘭站',
          En: 'Yilan Station',
        },
        ArrivalTime: '09:15',
        DepartureTime: '09:18',
        SuspendFlag: 0,
      },
      {
        StopSequence: 3,
        StationID: '1090',
        StationName: {
          Zh_tw: '羅東站',
          En: 'Luodong Station',
        },
        ArrivalTime: '09:30',
        DepartureTime: '09:33',
        SuspendFlag: 0,
      },
      {
        StopSequence: 4,
        StationID: '1100',
        StationName: {
          Zh_tw: '蘇澳站',
          En: 'Suao Station',
        },
        ArrivalTime: '09:45',
        DepartureTime: '09:48',
        SuspendFlag: 0,
      },
      {
        StopSequence: 5,
        StationID: '1210',
        StationName: {
          Zh_tw: '花蓮站',
          En: 'Hualien Station',
        },
        ArrivalTime: '11:00',
        DepartureTime: '11:00',
        SuspendFlag: 0,
      },
    ],
  },
};

// 模擬API調用
export const getMockTrainByNumber = (
  trainNo: string,
  date: string
): Promise<TrainSchedule[]> => {
  return new Promise((resolve, reject) => {
    // 模擬網絡延遲
    setTimeout(() => {
      const train = mockTrainDetails[trainNo];
      if (train) {
        // 複製一份數據並更新日期
        const result = { ...train, TrainDate: date };
        resolve([result]);
      } else {
        // 如果沒有找到對應車次，則返回替代數據
        const defaultTrain = { ...mockTrainDetails['1202'], TrainDate: date };
        defaultTrain.DailyTrainInfo.TrainNo = trainNo;
        resolve([defaultTrain]);
      }
    }, 500);
  });
};
