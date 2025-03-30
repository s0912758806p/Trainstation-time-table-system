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

  const schedules: TrainSchedule[] = [];

  // 生成北上列車
  for (let i = 1; i <= 10; i++) {
    const trainNo = `${i}000`;
    const randomTypeIndex = Math.floor(Math.random() * trainTypes.length);
    const trainType = trainTypes[randomTypeIndex];

    const schedule: TrainSchedule = {
      TrainDate: date,
      DailyTrainInfo: {
        TrainNo: trainNo,
        Direction: 0, // 0:北上，1:南下
        TrainTypeID: trainType.id,
        TrainTypeName: trainType.name,
        StartingStationID: '1180', // 台南
        StartingStationName: {
          Zh_tw: '台南',
          En: 'Tainan',
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
          StationID: '1180',
          StationName: {
            Zh_tw: '台南',
            En: 'Tainan',
          },
          ArrivalTime: `${6 + i}:00`,
          DepartureTime: `${6 + i}:05`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 2,
          StationID: '1160',
          StationName: {
            Zh_tw: '嘉義',
            En: 'Chiayi',
          },
          ArrivalTime: `${6 + i}:40`,
          DepartureTime: `${6 + i}:45`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 3,
          StationID: '1100',
          StationName: {
            Zh_tw: '台中',
            En: 'Taichung',
          },
          ArrivalTime: `${7 + i}:30`,
          DepartureTime: `${7 + i}:35`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 4,
          StationID: '1060',
          StationName: {
            Zh_tw: '新竹',
            En: 'Hsinchu',
          },
          ArrivalTime: `${8 + i}:20`,
          DepartureTime: `${8 + i}:25`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 5,
          StationID: '1020',
          StationName: {
            Zh_tw: '板橋',
            En: 'Banqiao',
          },
          ArrivalTime: `${9 + i}:10`,
          DepartureTime: `${9 + i}:15`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 6,
          StationID: '1000',
          StationName: {
            Zh_tw: '臺北',
            En: 'Taipei',
          },
          ArrivalTime: `${9 + i}:30`,
          DepartureTime: `${9 + i}:30`,
          SuspendFlag: 0,
        },
      ],
    };

    schedules.push(schedule);
  }

  // 生成南下列車
  for (let i = 1; i <= 10; i++) {
    const trainNo = `${i}100`;
    const randomTypeIndex = Math.floor(Math.random() * trainTypes.length);
    const trainType = trainTypes[randomTypeIndex];

    const schedule: TrainSchedule = {
      TrainDate: date,
      DailyTrainInfo: {
        TrainNo: trainNo,
        Direction: 1, // 0:北上，1:南下
        TrainTypeID: trainType.id,
        TrainTypeName: trainType.name,
        StartingStationID: '1000', // 台北
        StartingStationName: {
          Zh_tw: '臺北',
          En: 'Taipei',
        },
        EndingStationID: '1180', // 台南
        EndingStationName: {
          Zh_tw: '台南',
          En: 'Tainan',
        },
        TripHeadSign: '開往台南',
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
          ArrivalTime: `${7 + i}:00`,
          DepartureTime: `${7 + i}:05`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 2,
          StationID: '1020',
          StationName: {
            Zh_tw: '板橋',
            En: 'Banqiao',
          },
          ArrivalTime: `${7 + i}:20`,
          DepartureTime: `${7 + i}:25`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 3,
          StationID: '1060',
          StationName: {
            Zh_tw: '新竹',
            En: 'Hsinchu',
          },
          ArrivalTime: `${8 + i}:10`,
          DepartureTime: `${8 + i}:15`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 4,
          StationID: '1100',
          StationName: {
            Zh_tw: '台中',
            En: 'Taichung',
          },
          ArrivalTime: `${9 + i}:00`,
          DepartureTime: `${9 + i}:05`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 5,
          StationID: '1160',
          StationName: {
            Zh_tw: '嘉義',
            En: 'Chiayi',
          },
          ArrivalTime: `${9 + i}:50`,
          DepartureTime: `${9 + i}:55`,
          SuspendFlag: 0,
        },
        {
          StopSequence: 6,
          StationID: '1180',
          StationName: {
            Zh_tw: '台南',
            En: 'Tainan',
          },
          ArrivalTime: `${10 + i}:30`,
          DepartureTime: `${10 + i}:30`,
          SuspendFlag: 0,
        },
      ],
    };

    schedules.push(schedule);
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
