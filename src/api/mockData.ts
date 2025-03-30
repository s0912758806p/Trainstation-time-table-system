import { Station, TrainSchedule } from './train';

/**
 * 模擬站點數據
 */
export const mockStations: Station[] = [
  {
    StationUID: 'TRA-1000',
    StationID: '1000',
    StationName: {
      Zh_tw: '臺北',
      En: 'Taipei',
    },
    StationPosition: {
      PositionLat: 25.047923,
      PositionLon: 121.517081,
    },
    StationAddress: '臺北市中正區黎明里北平西路3號',
    LocationCity: '臺北市',
    LocationCityCode: 'TPE',
    LocationTown: '中正區',
    LocationTownCode: '100',
    StationClass: '1',
    StationPhone: '02-23713558',
  },
  {
    StationUID: 'TRA-1020',
    StationID: '1020',
    StationName: {
      Zh_tw: '板橋',
      En: 'Banqiao',
    },
    StationPosition: {
      PositionLat: 25.015056,
      PositionLon: 121.464926,
    },
    StationAddress: '新北市板橋區縣民大道二段7號',
    LocationCity: '新北市',
    LocationCityCode: 'NWT',
    LocationTown: '板橋區',
    LocationTownCode: '220',
    StationClass: '1',
    StationPhone: '02-89691731',
  },
  {
    StationUID: 'TRA-1040',
    StationID: '1040',
    StationName: {
      Zh_tw: '桃園',
      En: 'Taoyuan',
    },
    StationPosition: {
      PositionLat: 24.989246,
      PositionLon: 121.314234,
    },
    StationAddress: '桃園市桃園區武昌里中正路1號',
    LocationCity: '桃園市',
    LocationCityCode: 'TAO',
    LocationTown: '桃園區',
    LocationTownCode: '330',
    StationClass: '1',
    StationPhone: '03-3767050',
  },
  {
    StationUID: 'TRA-1060',
    StationID: '1060',
    StationName: {
      Zh_tw: '新竹',
      En: 'Hsinchu',
    },
    StationPosition: {
      PositionLat: 24.801574,
      PositionLon: 120.971872,
    },
    StationAddress: '新竹市東區榮光里中華路二段445號',
    LocationCity: '新竹市',
    LocationCityCode: 'HSZ',
    LocationTown: '東區',
    LocationTownCode: '300',
    StationClass: '1',
    StationPhone: '03-5237441',
  },
  {
    StationUID: 'TRA-1080',
    StationID: '1080',
    StationName: {
      Zh_tw: '苗栗',
      En: 'Miaoli',
    },
    StationPosition: {
      PositionLat: 24.570196,
      PositionLon: 120.822499,
    },
    StationAddress: '苗栗縣苗栗市上苗里為公路一號',
    LocationCity: '苗栗縣',
    LocationCityCode: 'MIA',
    LocationTown: '苗栗市',
    LocationTownCode: '360',
    StationClass: '1',
    StationPhone: '037-260031',
  },
  {
    StationUID: 'TRA-1100',
    StationID: '1100',
    StationName: {
      Zh_tw: '台中',
      En: 'Taichung',
    },
    StationPosition: {
      PositionLat: 24.136781,
      PositionLon: 120.685011,
    },
    StationAddress: '臺中市中區綠川里臺灣大道一段1號',
    LocationCity: '臺中市',
    LocationCityCode: 'TXG',
    LocationTown: '中區',
    LocationTownCode: '400',
    StationClass: '1',
    StationPhone: '04-22232101',
  },
  {
    StationUID: 'TRA-1120',
    StationID: '1120',
    StationName: {
      Zh_tw: '彰化',
      En: 'Changhua',
    },
    StationPosition: {
      PositionLat: 24.0816,
      PositionLon: 120.538288,
    },
    StationAddress: '彰化縣彰化市長安里中山路一段288號',
    LocationCity: '彰化縣',
    LocationCityCode: 'CHA',
    LocationTown: '彰化市',
    LocationTownCode: '500',
    StationClass: '1',
    StationPhone: '04-7624381',
  },
  {
    StationUID: 'TRA-1140',
    StationID: '1140',
    StationName: {
      Zh_tw: '斗六',
      En: 'Douliu',
    },
    StationPosition: {
      PositionLat: 23.707417,
      PositionLon: 120.540564,
    },
    StationAddress: '雲林縣斗六市信義里民生路187號',
    LocationCity: '雲林縣',
    LocationCityCode: 'YUN',
    LocationTown: '斗六市',
    LocationTownCode: '640',
    StationClass: '2',
    StationPhone: '05-5332900',
  },
  {
    StationUID: 'TRA-1160',
    StationID: '1160',
    StationName: {
      Zh_tw: '嘉義',
      En: 'Chiayi',
    },
    StationPosition: {
      PositionLat: 23.479286,
      PositionLon: 120.440702,
    },
    StationAddress: '嘉義市西區興業里公明路2號',
    LocationCity: '嘉義市',
    LocationCityCode: 'CYI',
    LocationTown: '西區',
    LocationTownCode: '600',
    StationClass: '1',
    StationPhone: '05-2228904',
  },
  {
    StationUID: 'TRA-1180',
    StationID: '1180',
    StationName: {
      Zh_tw: '台南',
      En: 'Tainan',
    },
    StationPosition: {
      PositionLat: 22.997145,
      PositionLon: 120.212926,
    },
    StationAddress: '臺南市中西區成功里北門路二段4號',
    LocationCity: '臺南市',
    LocationCityCode: 'TNN',
    LocationTown: '中西區',
    LocationTownCode: '700',
    StationClass: '1',
    StationPhone: '06-2261314',
  },
  {
    StationUID: 'TRA-1200',
    StationID: '1200',
    StationName: {
      Zh_tw: '高雄',
      En: 'Kaohsiung',
    },
    StationPosition: {
      PositionLat: 22.619744,
      PositionLon: 120.313722,
    },
    StationAddress: '高雄市苓雅區成功一路100號',
    LocationCity: '高雄市',
    LocationCityCode: 'KHH',
    LocationTown: '苓雅區',
    LocationTownCode: '800',
    StationClass: '1',
    StationPhone: '07-5211111',
  },
  {
    StationUID: 'TRA-1220',
    StationID: '1220',
    StationName: {
      Zh_tw: '屏東',
      En: 'Pingtung',
    },
    StationPosition: {
      PositionLat: 22.672999,
      PositionLon: 120.485681,
    },
    StationAddress: '屏東縣屏東市中正路1號',
    LocationCity: '屏東縣',
    LocationCityCode: 'PIF',
    LocationTown: '屏東市',
    LocationTownCode: '900',
    StationClass: '1',
    StationPhone: '08-7611111',
  },
  {
    StationUID: 'TRA-1240',
    StationID: '1240',
    StationName: {
      Zh_tw: '宜蘭',
      En: 'Yilan',
    },
    StationPosition: {
      PositionLat: 24.75979,
      PositionLon: 121.750038,
    },
    StationAddress: '宜蘭縣宜蘭市中山路一段1號',
    LocationCity: '宜蘭縣',
    LocationCityCode: 'ILA',
    LocationTown: '宜蘭市',
    LocationTownCode: '260',
    StationClass: '1',
    StationPhone: '03-9611111',
  },
  {
    StationUID: 'TRA-1260',
    StationID: '1260',
    StationName: {
      Zh_tw: '花蓮',
      En: 'Hualien',
    },
    StationPosition: {
      PositionLat: 23.973947,
      PositionLon: 121.600492,
    },
    StationAddress: '花蓮縣花蓮市中山路一段1號',
    LocationCity: '花蓮縣',
    LocationCityCode: 'HUA',
    LocationTown: '花蓮市',
    LocationTownCode: '300',
    StationClass: '1',
    StationPhone: '03-8361111',
  },
  {
    StationUID: 'TRA-1280',
    StationID: '1280',
    StationName: {
      Zh_tw: '台東',
      En: 'Taitung',
    },
    StationPosition: {
      PositionLat: 22.764722,
      PositionLon: 121.145808,
    },
    StationAddress: '台東縣台東市中山路一段1號',
    LocationCity: '台東縣',
    LocationCityCode: 'TTT',
    LocationTown: '台東市',
    LocationTownCode: '400',
    StationClass: '1',
    StationPhone: '089-361111',
  },
];

/**
 * 生成模擬列車時刻表數據
 * @param date 日期，格式為YYYY-MM-DD
 */
export function generateMockTrainSchedules(date: string): TrainSchedule[] {
  // 定義一些北上和南下列車
  const trainTypes = [
    { id: '1', name: { Zh_tw: '自強號', En: 'Tze-Chiang' } },
    { id: '2', name: { Zh_tw: '莒光號', En: 'Chu-Kuang' } },
    { id: '3', name: { Zh_tw: '復興號', En: 'Fu-Hsing' } },
    { id: '4', name: { Zh_tw: '太魯閣號', En: 'Taroko' } },
    { id: '5', name: { Zh_tw: '普悠瑪號', En: 'Puyuma' } },
    { id: '6', name: { Zh_tw: '區間車', En: 'Intermediate' } },
  ];

  // 定義所有主要車站 ID，確保能覆蓋到所有搜尋
  const mainStations = [
    { id: '1000', name: { Zh_tw: '臺北', En: 'Taipei' } },
    { id: '1020', name: { Zh_tw: '板橋', En: 'Banqiao' } },
    { id: '1040', name: { Zh_tw: '桃園', En: 'Taoyuan' } },
    { id: '1060', name: { Zh_tw: '新竹', En: 'Hsinchu' } },
    { id: '1080', name: { Zh_tw: '苗栗', En: 'Miaoli' } },
    { id: '1100', name: { Zh_tw: '台中', En: 'Taichung' } },
    { id: '1120', name: { Zh_tw: '彰化', En: 'Changhua' } },
    { id: '1140', name: { Zh_tw: '斗六', En: 'Douliu' } },
    { id: '1160', name: { Zh_tw: '嘉義', En: 'Chiayi' } },
    { id: '1180', name: { Zh_tw: '台南', En: 'Tainan' } },
    { id: '1200', name: { Zh_tw: '高雄', En: 'Kaohsiung' } },
    { id: '1220', name: { Zh_tw: '屏東', En: 'Pingtung' } },
    { id: '1240', name: { Zh_tw: '宜蘭', En: 'Yilan' } },
    { id: '1260', name: { Zh_tw: '花蓮', En: 'Hualien' } },
    { id: '1280', name: { Zh_tw: '台東', En: 'Taitung' } },
  ];

  const schedules: TrainSchedule[] = [];

  // 建立西部幹線北上列車 (高屏->台北)
  const generateWestNorthboundTrain = (index: number, prefix = '') => {
    const trainNo = `${prefix}${index}000`;
    const randomTypeIndex = Math.floor(Math.random() * trainTypes.length);
    const trainType = trainTypes[randomTypeIndex];
    const startTime = 6 + Math.floor(index / 3); // 讓出發時間分散在一天中

    const schedule: TrainSchedule = {
      TrainDate: date,
      DailyTrainInfo: {
        TrainNo: trainNo,
        Direction: 0, // 0:北上
        TrainTypeID: trainType.id,
        TrainTypeName: trainType.name,
        StartingStationID: '1200', // 高雄
        StartingStationName: {
          Zh_tw: '高雄',
          En: 'Kaohsiung',
        },
        EndingStationID: '1000', // 台北
        EndingStationName: {
          Zh_tw: '臺北',
          En: 'Taipei',
        },
        TripHeadSign: '開往臺北',
        WheelchairFlag: 1,
        BikeFlag: 1,
        BreastFeedingFlag: 1,
        DailyFlag: 1,
        ServiceAddedFlag: 0,
        Note: '',
      },
      StopTimes: [
        {
          StopSequence: 1,
          StationID: '1200',
          StationName: {
            Zh_tw: '高雄',
            En: 'Kaohsiung',
          },
          ArrivalTime: `${startTime}:00`,
          DepartureTime: `${startTime}:05`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 2,
          StationID: '1180',
          StationName: {
            Zh_tw: '台南',
            En: 'Tainan',
          },
          ArrivalTime: `${startTime + 1}:00`,
          DepartureTime: `${startTime + 1}:05`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 3,
          StationID: '1160',
          StationName: {
            Zh_tw: '嘉義',
            En: 'Chiayi',
          },
          ArrivalTime: `${startTime + 1}:40`,
          DepartureTime: `${startTime + 1}:45`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 4,
          StationID: '1100',
          StationName: {
            Zh_tw: '台中',
            En: 'Taichung',
          },
          ArrivalTime: `${startTime + 2}:30`,
          DepartureTime: `${startTime + 2}:35`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 5,
          StationID: '1060',
          StationName: {
            Zh_tw: '新竹',
            En: 'Hsinchu',
          },
          ArrivalTime: `${startTime + 3}:20`,
          DepartureTime: `${startTime + 3}:25`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 6,
          StationID: '1040',
          StationName: {
            Zh_tw: '桃園',
            En: 'Taoyuan',
          },
          ArrivalTime: `${startTime + 3}:50`,
          DepartureTime: `${startTime + 3}:55`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 7,
          StationID: '1020',
          StationName: {
            Zh_tw: '板橋',
            En: 'Banqiao',
          },
          ArrivalTime: `${startTime + 4}:10`,
          DepartureTime: `${startTime + 4}:15`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 8,
          StationID: '1000',
          StationName: {
            Zh_tw: '臺北',
            En: 'Taipei',
          },
          ArrivalTime: `${startTime + 4}:30`,
          DepartureTime: `${startTime + 4}:30`,
          SuspendFlag: 0,
        },
      ],
    };

    return schedule;
  };

  // 建立西部幹線南下列車 (台北->高屏)
  const generateWestSouthboundTrain = (index: number, prefix = '') => {
    const trainNo = `${prefix}${index}100`;
    const randomTypeIndex = Math.floor(Math.random() * trainTypes.length);
    const trainType = trainTypes[randomTypeIndex];
    const startTime = 7 + Math.floor(index / 3); // 讓出發時間分散在一天中

    const schedule: TrainSchedule = {
      TrainDate: date,
      DailyTrainInfo: {
        TrainNo: trainNo,
        Direction: 1, // 1:南下
        TrainTypeID: trainType.id,
        TrainTypeName: trainType.name,
        StartingStationID: '1000', // 台北
        StartingStationName: {
          Zh_tw: '臺北',
          En: 'Taipei',
        },
        EndingStationID: '1200', // 高雄
        EndingStationName: {
          Zh_tw: '高雄',
          En: 'Kaohsiung',
        },
        TripHeadSign: '開往高雄',
        WheelchairFlag: 1,
        BikeFlag: 1,
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
            Zh_tw: '臺北',
            En: 'Taipei',
          },
          ArrivalTime: `${startTime}:00`,
          DepartureTime: `${startTime}:05`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 2,
          StationID: '1020',
          StationName: {
            Zh_tw: '板橋',
            En: 'Banqiao',
          },
          ArrivalTime: `${startTime}:20`,
          DepartureTime: `${startTime}:25`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 3,
          StationID: '1040',
          StationName: {
            Zh_tw: '桃園',
            En: 'Taoyuan',
          },
          ArrivalTime: `${startTime}:45`,
          DepartureTime: `${startTime}:50`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 4,
          StationID: '1060',
          StationName: {
            Zh_tw: '新竹',
            En: 'Hsinchu',
          },
          ArrivalTime: `${startTime + 1}:10`,
          DepartureTime: `${startTime + 1}:15`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 5,
          StationID: '1100',
          StationName: {
            Zh_tw: '台中',
            En: 'Taichung',
          },
          ArrivalTime: `${startTime + 2}:00`,
          DepartureTime: `${startTime + 2}:05`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 6,
          StationID: '1160',
          StationName: {
            Zh_tw: '嘉義',
            En: 'Chiayi',
          },
          ArrivalTime: `${startTime + 2}:50`,
          DepartureTime: `${startTime + 2}:55`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 7,
          StationID: '1180',
          StationName: {
            Zh_tw: '台南',
            En: 'Tainan',
          },
          ArrivalTime: `${startTime + 3}:30`,
          DepartureTime: `${startTime + 3}:35`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 8,
          StationID: '1200',
          StationName: {
            Zh_tw: '高雄',
            En: 'Kaohsiung',
          },
          ArrivalTime: `${startTime + 4}:30`,
          DepartureTime: `${startTime + 4}:30`,
          SuspendFlag: 0,
        },
      ],
    };

    return schedule;
  };

  // 建立東部幹線北上列車 (台東->花蓮->宜蘭->台北)
  const generateEastNorthboundTrain = (index: number) => {
    const trainNo = `${index}500`;
    const randomTypeIndex = Math.floor(Math.random() * trainTypes.length);
    const trainType = trainTypes[randomTypeIndex];
    const startTime = 6 + Math.floor(index / 2);

    const schedule: TrainSchedule = {
      TrainDate: date,
      DailyTrainInfo: {
        TrainNo: trainNo,
        Direction: 0,
        TrainTypeID: trainType.id,
        TrainTypeName: trainType.name,
        StartingStationID: '1280', // 台東
        StartingStationName: {
          Zh_tw: '台東',
          En: 'Taitung',
        },
        EndingStationID: '1000', // 台北
        EndingStationName: {
          Zh_tw: '臺北',
          En: 'Taipei',
        },
        TripHeadSign: '開往臺北',
        WheelchairFlag: 1,
        BikeFlag: 1,
        BreastFeedingFlag: 1,
        DailyFlag: 1,
        ServiceAddedFlag: 0,
        Note: '',
      },
      StopTimes: [
        {
          StopSequence: 1,
          StationID: '1280',
          StationName: {
            Zh_tw: '台東',
            En: 'Taitung',
          },
          ArrivalTime: `${startTime}:00`,
          DepartureTime: `${startTime}:05`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 2,
          StationID: '1260',
          StationName: {
            Zh_tw: '花蓮',
            En: 'Hualien',
          },
          ArrivalTime: `${startTime + 2}:00`,
          DepartureTime: `${startTime + 2}:10`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 3,
          StationID: '1240',
          StationName: {
            Zh_tw: '宜蘭',
            En: 'Yilan',
          },
          ArrivalTime: `${startTime + 3}:30`,
          DepartureTime: `${startTime + 3}:35`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 4,
          StationID: '1000',
          StationName: {
            Zh_tw: '臺北',
            En: 'Taipei',
          },
          ArrivalTime: `${startTime + 4}:30`,
          DepartureTime: `${startTime + 4}:30`,
          SuspendFlag: 0,
        },
      ],
    };

    return schedule;
  };

  // 建立東部幹線南下列車 (台北->宜蘭->花蓮->台東)
  const generateEastSouthboundTrain = (index: number) => {
    const trainNo = `${index}600`;
    const randomTypeIndex = Math.floor(Math.random() * trainTypes.length);
    const trainType = trainTypes[randomTypeIndex];
    const startTime = 7 + Math.floor(index / 2);

    const schedule: TrainSchedule = {
      TrainDate: date,
      DailyTrainInfo: {
        TrainNo: trainNo,
        Direction: 1,
        TrainTypeID: trainType.id,
        TrainTypeName: trainType.name,
        StartingStationID: '1000', // 台北
        StartingStationName: {
          Zh_tw: '臺北',
          En: 'Taipei',
        },
        EndingStationID: '1280', // 台東
        EndingStationName: {
          Zh_tw: '台東',
          En: 'Taitung',
        },
        TripHeadSign: '開往台東',
        WheelchairFlag: 1,
        BikeFlag: 1,
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
            Zh_tw: '臺北',
            En: 'Taipei',
          },
          ArrivalTime: `${startTime}:00`,
          DepartureTime: `${startTime}:05`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 2,
          StationID: '1240',
          StationName: {
            Zh_tw: '宜蘭',
            En: 'Yilan',
          },
          ArrivalTime: `${startTime + 1}:00`,
          DepartureTime: `${startTime + 1}:05`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 3,
          StationID: '1260',
          StationName: {
            Zh_tw: '花蓮',
            En: 'Hualien',
          },
          ArrivalTime: `${startTime + 2}:30`,
          DepartureTime: `${startTime + 2}:35`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 4,
          StationID: '1280',
          StationName: {
            Zh_tw: '台東',
            En: 'Taitung',
          },
          ArrivalTime: `${startTime + 4}:30`,
          DepartureTime: `${startTime + 4}:30`,
          SuspendFlag: 0,
        },
      ],
    };

    return schedule;
  };

  // 建立區間車 (台北-桃園)
  const generateLocalTrain = (index: number) => {
    const trainNo = `${index}800`;
    const startTime = 5 + (index % 18); // 5:00-23:00 每小時一班

    const schedule: TrainSchedule = {
      TrainDate: date,
      DailyTrainInfo: {
        TrainNo: trainNo,
        Direction: index % 2, // 交替北上南下
        TrainTypeID: '6',
        TrainTypeName: { Zh_tw: '區間車', En: 'Local Train' },
        StartingStationID: index % 2 === 0 ? '1040' : '1000',
        StartingStationName: {
          Zh_tw: index % 2 === 0 ? '桃園' : '臺北',
          En: index % 2 === 0 ? 'Taoyuan' : 'Taipei',
        },
        EndingStationID: index % 2 === 0 ? '1000' : '1040',
        EndingStationName: {
          Zh_tw: index % 2 === 0 ? '臺北' : '桃園',
          En: index % 2 === 0 ? 'Taipei' : 'Taoyuan',
        },
        TripHeadSign: index % 2 === 0 ? '開往臺北' : '開往桃園',
        WheelchairFlag: 1,
        BikeFlag: 1,
        BreastFeedingFlag: 1,
        DailyFlag: 1,
        ServiceAddedFlag: 0,
        Note: '',
      },
      StopTimes:
        index % 2 === 0
          ? [
              {
                StopSequence: 1,
                StationID: '1040',
                StationName: {
                  Zh_tw: '桃園',
                  En: 'Taoyuan',
                },
                ArrivalTime: `${startTime}:00`,
                DepartureTime: `${startTime}:05`,
                SuspendFlag: 0,
              },
              {
                StopSequence: 2,
                StationID: '1020',
                StationName: {
                  Zh_tw: '板橋',
                  En: 'Banqiao',
                },
                ArrivalTime: `${startTime}:30`,
                DepartureTime: `${startTime}:32`,
                SuspendFlag: 0,
              },
              {
                StopSequence: 3,
                StationID: '1000',
                StationName: {
                  Zh_tw: '臺北',
                  En: 'Taipei',
                },
                ArrivalTime: `${startTime}:45`,
                DepartureTime: `${startTime}:45`,
                SuspendFlag: 0,
              },
            ]
          : [
              {
                StopSequence: 1,
                StationID: '1000',
                StationName: {
                  Zh_tw: '臺北',
                  En: 'Taipei',
                },
                ArrivalTime: `${startTime}:00`,
                DepartureTime: `${startTime}:05`,
                SuspendFlag: 0,
              },
              {
                StopSequence: 2,
                StationID: '1020',
                StationName: {
                  Zh_tw: '板橋',
                  En: 'Banqiao',
                },
                ArrivalTime: `${startTime}:15`,
                DepartureTime: `${startTime}:17`,
                SuspendFlag: 0,
              },
              {
                StopSequence: 3,
                StationID: '1040',
                StationName: {
                  Zh_tw: '桃園',
                  En: 'Taoyuan',
                },
                ArrivalTime: `${startTime}:45`,
                DepartureTime: `${startTime}:45`,
                SuspendFlag: 0,
              },
            ],
    };

    return schedule;
  };

  // 生成特殊車次（確保特定車次可被搜尋）
  const specialTrainNumbers = [
    '101',
    '202',
    '303',
    '404',
    '505',
    '606',
    '707',
    '808',
    '909',
  ];
  specialTrainNumbers.forEach((trainNo, index) => {
    const schedule = generateWestNorthboundTrain(index + 1, trainNo);
    schedule.DailyTrainInfo.TrainNo = trainNo;
    schedules.push(schedule);
  });

  // 建立南迴線北上列車 (屏東->台東)
  const generateSouthLinkNorthboundTrain = (index: number) => {
    const trainNo = `${index}700`;
    const randomTypeIndex = Math.floor(Math.random() * trainTypes.length);
    const trainType = trainTypes[randomTypeIndex];
    const startTime = 6 + Math.floor(index / 2);

    const schedule: TrainSchedule = {
      TrainDate: date,
      DailyTrainInfo: {
        TrainNo: trainNo,
        Direction: 0,
        TrainTypeID: trainType.id,
        TrainTypeName: trainType.name,
        StartingStationID: '1220', // 屏東
        StartingStationName: {
          Zh_tw: '屏東',
          En: 'Pingtung',
        },
        EndingStationID: '1280', // 台東
        EndingStationName: {
          Zh_tw: '台東',
          En: 'Taitung',
        },
        TripHeadSign: '開往台東',
        WheelchairFlag: 1,
        BikeFlag: 1,
        BreastFeedingFlag: 1,
        DailyFlag: 1,
        ServiceAddedFlag: 0,
        Note: '',
      },
      StopTimes: [
        {
          StopSequence: 1,
          StationID: '1220',
          StationName: {
            Zh_tw: '屏東',
            En: 'Pingtung',
          },
          ArrivalTime: `${startTime}:00`,
          DepartureTime: `${startTime}:05`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 2,
          StationID: '1200',
          StationName: {
            Zh_tw: '高雄',
            En: 'Kaohsiung',
          },
          ArrivalTime: `${startTime}:30`,
          DepartureTime: `${startTime}:35`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 3,
          StationID: '1280',
          StationName: {
            Zh_tw: '台東',
            En: 'Taitung',
          },
          ArrivalTime: `${startTime + 2}:30`,
          DepartureTime: `${startTime + 2}:30`,
          SuspendFlag: 0,
        },
      ],
    };

    return schedule;
  };

  // 建立南迴線南下列車 (台東->屏東)
  const generateSouthLinkSouthboundTrain = (index: number) => {
    const trainNo = `${index}710`;
    const randomTypeIndex = Math.floor(Math.random() * trainTypes.length);
    const trainType = trainTypes[randomTypeIndex];
    const startTime = 7 + Math.floor(index / 2);

    const schedule: TrainSchedule = {
      TrainDate: date,
      DailyTrainInfo: {
        TrainNo: trainNo,
        Direction: 1,
        TrainTypeID: trainType.id,
        TrainTypeName: trainType.name,
        StartingStationID: '1280', // 台東
        StartingStationName: {
          Zh_tw: '台東',
          En: 'Taitung',
        },
        EndingStationID: '1220', // 屏東
        EndingStationName: {
          Zh_tw: '屏東',
          En: 'Pingtung',
        },
        TripHeadSign: '開往屏東',
        WheelchairFlag: 1,
        BikeFlag: 1,
        BreastFeedingFlag: 1,
        DailyFlag: 1,
        ServiceAddedFlag: 0,
        Note: '',
      },
      StopTimes: [
        {
          StopSequence: 1,
          StationID: '1280',
          StationName: {
            Zh_tw: '台東',
            En: 'Taitung',
          },
          ArrivalTime: `${startTime}:00`,
          DepartureTime: `${startTime}:05`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 2,
          StationID: '1200',
          StationName: {
            Zh_tw: '高雄',
            En: 'Kaohsiung',
          },
          ArrivalTime: `${startTime + 2}:00`,
          DepartureTime: `${startTime + 2}:05`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 3,
          StationID: '1220',
          StationName: {
            Zh_tw: '屏東',
            En: 'Pingtung',
          },
          ArrivalTime: `${startTime + 2}:30`,
          DepartureTime: `${startTime + 2}:30`,
          SuspendFlag: 0,
        },
      ],
    };

    return schedule;
  };

  // 建立縱谷線北上列車 (台東->花蓮)
  const generateValleyNorthboundTrain = (index: number) => {
    const trainNo = `${index}720`;
    const randomTypeIndex = Math.floor(Math.random() * trainTypes.length);
    const trainType = trainTypes[randomTypeIndex];
    const startTime = 8 + Math.floor(index / 3);

    const schedule: TrainSchedule = {
      TrainDate: date,
      DailyTrainInfo: {
        TrainNo: trainNo,
        Direction: 0,
        TrainTypeID: trainType.id,
        TrainTypeName: trainType.name,
        StartingStationID: '1280', // 台東
        StartingStationName: {
          Zh_tw: '台東',
          En: 'Taitung',
        },
        EndingStationID: '1260', // 花蓮
        EndingStationName: {
          Zh_tw: '花蓮',
          En: 'Hualien',
        },
        TripHeadSign: '開往花蓮',
        WheelchairFlag: 1,
        BikeFlag: 1,
        BreastFeedingFlag: 1,
        DailyFlag: 1,
        ServiceAddedFlag: 0,
        Note: '',
      },
      StopTimes: [
        {
          StopSequence: 1,
          StationID: '1280',
          StationName: {
            Zh_tw: '台東',
            En: 'Taitung',
          },
          ArrivalTime: `${startTime}:00`,
          DepartureTime: `${startTime}:05`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 2,
          StationID: '1260',
          StationName: {
            Zh_tw: '花蓮',
            En: 'Hualien',
          },
          ArrivalTime: `${startTime + 2}:00`,
          DepartureTime: `${startTime + 2}:00`,
          SuspendFlag: 0,
        },
      ],
    };

    return schedule;
  };

  // 建立縱谷線南下列車 (花蓮->台東)
  const generateValleySouthboundTrain = (index: number) => {
    const trainNo = `${index}730`;
    const randomTypeIndex = Math.floor(Math.random() * trainTypes.length);
    const trainType = trainTypes[randomTypeIndex];
    const startTime = 9 + Math.floor(index / 3);

    const schedule: TrainSchedule = {
      TrainDate: date,
      DailyTrainInfo: {
        TrainNo: trainNo,
        Direction: 1,
        TrainTypeID: trainType.id,
        TrainTypeName: trainType.name,
        StartingStationID: '1260', // 花蓮
        StartingStationName: {
          Zh_tw: '花蓮',
          En: 'Hualien',
        },
        EndingStationID: '1280', // 台東
        EndingStationName: {
          Zh_tw: '台東',
          En: 'Taitung',
        },
        TripHeadSign: '開往台東',
        WheelchairFlag: 1,
        BikeFlag: 1,
        BreastFeedingFlag: 1,
        DailyFlag: 1,
        ServiceAddedFlag: 0,
        Note: '',
      },
      StopTimes: [
        {
          StopSequence: 1,
          StationID: '1260',
          StationName: {
            Zh_tw: '花蓮',
            En: 'Hualien',
          },
          ArrivalTime: `${startTime}:00`,
          DepartureTime: `${startTime}:05`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 2,
          StationID: '1280',
          StationName: {
            Zh_tw: '台東',
            En: 'Taitung',
          },
          ArrivalTime: `${startTime + 2}:00`,
          DepartureTime: `${startTime + 2}:00`,
          SuspendFlag: 0,
        },
      ],
    };

    return schedule;
  };

  // 建立屏東線北上列車 (屏東->高雄)
  const generatePingtungNorthboundTrain = (index: number) => {
    const trainNo = `${index}740`;
    // 區間車較適合屏東線
    const startTime = 5 + (index % 18); // 5:00-23:00，每小時一班

    const schedule: TrainSchedule = {
      TrainDate: date,
      DailyTrainInfo: {
        TrainNo: trainNo,
        Direction: 0,
        TrainTypeID: '6',
        TrainTypeName: { Zh_tw: '區間車', En: 'Local Train' },
        StartingStationID: '1220', // 屏東
        StartingStationName: {
          Zh_tw: '屏東',
          En: 'Pingtung',
        },
        EndingStationID: '1200', // 高雄
        EndingStationName: {
          Zh_tw: '高雄',
          En: 'Kaohsiung',
        },
        TripHeadSign: '開往高雄',
        WheelchairFlag: 1,
        BikeFlag: 1,
        BreastFeedingFlag: 1,
        DailyFlag: 1,
        ServiceAddedFlag: 0,
        Note: '',
      },
      StopTimes: [
        {
          StopSequence: 1,
          StationID: '1220',
          StationName: {
            Zh_tw: '屏東',
            En: 'Pingtung',
          },
          ArrivalTime: `${startTime}:00`,
          DepartureTime: `${startTime}:05`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 2,
          StationID: '1200',
          StationName: {
            Zh_tw: '高雄',
            En: 'Kaohsiung',
          },
          ArrivalTime: `${startTime}:30`,
          DepartureTime: `${startTime}:30`,
          SuspendFlag: 0,
        },
      ],
    };

    return schedule;
  };

  // 建立屏東線南下列車 (高雄->屏東)
  const generatePingtungSouthboundTrain = (index: number) => {
    const trainNo = `${index}750`;
    // 區間車較適合屏東線
    const startTime = 5 + (index % 18); // 5:00-23:00，每小時一班

    const schedule: TrainSchedule = {
      TrainDate: date,
      DailyTrainInfo: {
        TrainNo: trainNo,
        Direction: 1,
        TrainTypeID: '6',
        TrainTypeName: { Zh_tw: '區間車', En: 'Local Train' },
        StartingStationID: '1200', // 高雄
        StartingStationName: {
          Zh_tw: '高雄',
          En: 'Kaohsiung',
        },
        EndingStationID: '1220', // 屏東
        EndingStationName: {
          Zh_tw: '屏東',
          En: 'Pingtung',
        },
        TripHeadSign: '開往屏東',
        WheelchairFlag: 1,
        BikeFlag: 1,
        BreastFeedingFlag: 1,
        DailyFlag: 1,
        ServiceAddedFlag: 0,
        Note: '',
      },
      StopTimes: [
        {
          StopSequence: 1,
          StationID: '1200',
          StationName: {
            Zh_tw: '高雄',
            En: 'Kaohsiung',
          },
          ArrivalTime: `${startTime}:00`,
          DepartureTime: `${startTime}:05`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 2,
          StationID: '1220',
          StationName: {
            Zh_tw: '屏東',
            En: 'Pingtung',
          },
          ArrivalTime: `${startTime}:30`,
          DepartureTime: `${startTime}:30`,
          SuspendFlag: 0,
        },
      ],
    };

    return schedule;
  };

  // 建立中部區間車 (台中-彰化-斗六)
  const generateCentralLocalTrain = (index: number) => {
    const trainNo = `${index}760`;
    // 區間車
    const startTime = 6 + (index % 16); // 6:00-22:00，每小時一班
    const isNorthbound = index % 2 === 0;

    const schedule: TrainSchedule = {
      TrainDate: date,
      DailyTrainInfo: {
        TrainNo: trainNo,
        Direction: isNorthbound ? 0 : 1,
        TrainTypeID: '6',
        TrainTypeName: { Zh_tw: '區間車', En: 'Local Train' },
        StartingStationID: isNorthbound ? '1140' : '1100', // 斗六 or 台中
        StartingStationName: {
          Zh_tw: isNorthbound ? '斗六' : '台中',
          En: isNorthbound ? 'Douliu' : 'Taichung',
        },
        EndingStationID: isNorthbound ? '1100' : '1140', // 台中 or 斗六
        EndingStationName: {
          Zh_tw: isNorthbound ? '台中' : '斗六',
          En: isNorthbound ? 'Taichung' : 'Douliu',
        },
        TripHeadSign: isNorthbound ? '開往台中' : '開往斗六',
        WheelchairFlag: 1,
        BikeFlag: 1,
        BreastFeedingFlag: 1,
        DailyFlag: 1,
        ServiceAddedFlag: 0,
        Note: '',
      },
      StopTimes: isNorthbound
        ? [
            {
              StopSequence: 1,
              StationID: '1140',
              StationName: {
                Zh_tw: '斗六',
                En: 'Douliu',
              },
              ArrivalTime: `${startTime}:00`,
              DepartureTime: `${startTime}:05`,
              SuspendFlag: 0,
            },
            {
              StopSequence: 2,
              StationID: '1120',
              StationName: {
                Zh_tw: '彰化',
                En: 'Changhua',
              },
              ArrivalTime: `${startTime}:40`,
              DepartureTime: `${startTime}:42`,
              SuspendFlag: 0,
            },
            {
              StopSequence: 3,
              StationID: '1100',
              StationName: {
                Zh_tw: '台中',
                En: 'Taichung',
              },
              ArrivalTime: `${startTime + 1}:15`,
              DepartureTime: `${startTime + 1}:15`,
              SuspendFlag: 0,
            },
          ]
        : [
            {
              StopSequence: 1,
              StationID: '1100',
              StationName: {
                Zh_tw: '台中',
                En: 'Taichung',
              },
              ArrivalTime: `${startTime}:00`,
              DepartureTime: `${startTime}:05`,
              SuspendFlag: 0,
            },
            {
              StopSequence: 2,
              StationID: '1120',
              StationName: {
                Zh_tw: '彰化',
                En: 'Changhua',
              },
              ArrivalTime: `${startTime}:35`,
              DepartureTime: `${startTime}:37`,
              SuspendFlag: 0,
            },
            {
              StopSequence: 3,
              StationID: '1140',
              StationName: {
                Zh_tw: '斗六',
                En: 'Douliu',
              },
              ArrivalTime: `${startTime + 1}:15`,
              DepartureTime: `${startTime + 1}:15`,
              SuspendFlag: 0,
            },
          ],
    };

    return schedule;
  };

  // 建立北部區間車 (台北-新竹-苗栗)
  const generateNorthLocalTrain = (index: number) => {
    const trainNo = `${index}770`;
    // 區間車
    const startTime = 6 + (index % 16); // 6:00-22:00，每小時一班
    const isNorthbound = index % 2 === 0;

    const schedule: TrainSchedule = {
      TrainDate: date,
      DailyTrainInfo: {
        TrainNo: trainNo,
        Direction: isNorthbound ? 0 : 1,
        TrainTypeID: '6',
        TrainTypeName: { Zh_tw: '區間車', En: 'Local Train' },
        StartingStationID: isNorthbound ? '1080' : '1000', // 苗栗 or 台北
        StartingStationName: {
          Zh_tw: isNorthbound ? '苗栗' : '臺北',
          En: isNorthbound ? 'Miaoli' : 'Taipei',
        },
        EndingStationID: isNorthbound ? '1000' : '1080', // 台北 or 苗栗
        EndingStationName: {
          Zh_tw: isNorthbound ? '臺北' : '苗栗',
          En: isNorthbound ? 'Taipei' : 'Miaoli',
        },
        TripHeadSign: isNorthbound ? '開往臺北' : '開往苗栗',
        WheelchairFlag: 1,
        BikeFlag: 1,
        BreastFeedingFlag: 1,
        DailyFlag: 1,
        ServiceAddedFlag: 0,
        Note: '',
      },
      StopTimes: isNorthbound
        ? [
            {
              StopSequence: 1,
              StationID: '1080',
              StationName: {
                Zh_tw: '苗栗',
                En: 'Miaoli',
              },
              ArrivalTime: `${startTime}:00`,
              DepartureTime: `${startTime}:05`,
              SuspendFlag: 0,
            },
            {
              StopSequence: 2,
              StationID: '1060',
              StationName: {
                Zh_tw: '新竹',
                En: 'Hsinchu',
              },
              ArrivalTime: `${startTime}:35`,
              DepartureTime: `${startTime}:37`,
              SuspendFlag: 0,
            },
            {
              StopSequence: 3,
              StationID: '1040',
              StationName: {
                Zh_tw: '桃園',
                En: 'Taoyuan',
              },
              ArrivalTime: `${startTime + 1}:00`,
              DepartureTime: `${startTime + 1}:02`,
              SuspendFlag: 0,
            },
            {
              StopSequence: 4,
              StationID: '1020',
              StationName: {
                Zh_tw: '板橋',
                En: 'Banqiao',
              },
              ArrivalTime: `${startTime + 1}:25`,
              DepartureTime: `${startTime + 1}:27`,
              SuspendFlag: 0,
            },
            {
              StopSequence: 5,
              StationID: '1000',
              StationName: {
                Zh_tw: '臺北',
                En: 'Taipei',
              },
              ArrivalTime: `${startTime + 1}:45`,
              DepartureTime: `${startTime + 1}:45`,
              SuspendFlag: 0,
            },
          ]
        : [
            {
              StopSequence: 1,
              StationID: '1000',
              StationName: {
                Zh_tw: '臺北',
                En: 'Taipei',
              },
              ArrivalTime: `${startTime}:00`,
              DepartureTime: `${startTime}:05`,
              SuspendFlag: 0,
            },
            {
              StopSequence: 2,
              StationID: '1020',
              StationName: {
                Zh_tw: '板橋',
                En: 'Banqiao',
              },
              ArrivalTime: `${startTime}:20`,
              DepartureTime: `${startTime}:22`,
              SuspendFlag: 0,
            },
            {
              StopSequence: 3,
              StationID: '1040',
              StationName: {
                Zh_tw: '桃園',
                En: 'Taoyuan',
              },
              ArrivalTime: `${startTime}:45`,
              DepartureTime: `${startTime}:47`,
              SuspendFlag: 0,
            },
            {
              StopSequence: 4,
              StationID: '1060',
              StationName: {
                Zh_tw: '新竹',
                En: 'Hsinchu',
              },
              ArrivalTime: `${startTime + 1}:15`,
              DepartureTime: `${startTime + 1}:17`,
              SuspendFlag: 0,
            },
            {
              StopSequence: 5,
              StationID: '1080',
              StationName: {
                Zh_tw: '苗栗',
                En: 'Miaoli',
              },
              ArrivalTime: `${startTime + 1}:45`,
              DepartureTime: `${startTime + 1}:45`,
              SuspendFlag: 0,
            },
          ],
    };

    return schedule;
  };

  // 生成西部幹線北上和南下列車
  for (let i = 1; i <= 15; i++) {
    schedules.push(generateWestNorthboundTrain(i));
    schedules.push(generateWestSouthboundTrain(i));
  }

  // 生成東部幹線北上和南下列車
  for (let i = 1; i <= 10; i++) {
    schedules.push(generateEastNorthboundTrain(i));
    schedules.push(generateEastSouthboundTrain(i));
  }

  // 生成南迴線列車
  for (let i = 1; i <= 8; i++) {
    schedules.push(generateSouthLinkNorthboundTrain(i));
    schedules.push(generateSouthLinkSouthboundTrain(i));
  }

  // 生成縱谷線列車
  for (let i = 1; i <= 8; i++) {
    schedules.push(generateValleyNorthboundTrain(i));
    schedules.push(generateValleySouthboundTrain(i));
  }

  // 生成屏東線列車
  for (let i = 1; i <= 12; i++) {
    schedules.push(generatePingtungNorthboundTrain(i));
    schedules.push(generatePingtungSouthboundTrain(i));
  }

  // 生成中部區間車
  for (let i = 1; i <= 16; i++) {
    schedules.push(generateCentralLocalTrain(i));
  }

  // 生成北部區間車
  for (let i = 1; i <= 16; i++) {
    schedules.push(generateNorthLocalTrain(i));
  }

  // 生成台北到桃園區間車
  for (let i = 1; i <= 18; i++) {
    schedules.push(generateLocalTrain(i));
  }

  return schedules;
}

/**
 * 獲取特定路線的列車時刻
 */
export function getMockTrainsByRoute(
  originID: string,
  destinationID: string,
  date: string
): TrainSchedule[] {
  const allTrains = generateMockTrainSchedules(date);

  return allTrains.filter((train) => {
    // 檢查車站停靠順序
    const stopStations = train.StopTimes.map((stop) => stop.StationID);
    const originIndex = stopStations.indexOf(originID);
    const destIndex = stopStations.indexOf(destinationID);

    // 確保兩個站都在停靠站中，且目的地站在始發站之後
    return originIndex >= 0 && destIndex >= 0 && destIndex > originIndex;
  });
}

/**
 * 獲取特定車次的列車時刻
 */
export function getMockTrainByNumber(
  trainNo: string,
  date: string
): TrainSchedule[] {
  const allTrains = generateMockTrainSchedules(date);
  return allTrains.filter((train) => train.DailyTrainInfo.TrainNo === trainNo);
}
