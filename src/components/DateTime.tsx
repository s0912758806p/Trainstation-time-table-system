import { useState, useEffect } from 'react';
import { Typography } from 'antd';
import dayjs from 'dayjs';

interface DateTimeProps {
  format?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * 顯示當前日期和時間的組件
 * 支持自定義格式和樣式
 */
const DateTime: React.FC<DateTimeProps> = ({
  format = 'YYYY年MM月DD日 HH:mm:ss',
  className = '',
  style = {},
}) => {
  const [currentTime, setCurrentTime] = useState(dayjs());

  useEffect(() => {
    // 每秒更新一次時間
    const timer = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);

    // 組件卸載時清理定時器
    return () => clearInterval(timer);
  }, []);

  return (
    <Typography.Text className={`datetime-display ${className}`} style={style}>
      {currentTime.format(format)}
    </Typography.Text>
  );
};

export default DateTime;
