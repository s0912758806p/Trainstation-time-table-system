import './ButtonStyle.scss';

type ButtonProps = {
  text: string;
  propsType: string;
};

/**
 * 處理按鈕邏輯
 * @param propsType
 */
const handleButton = (propsType: string) => {
  console.log(propsType);
};

const Button: React.FC<ButtonProps> = ({ text = '按鈕', propsType = '' }) => {
  return (
    <div className="button-box" onClick={() => handleButton(propsType)}>
      <div className="button-text">{text}</div>
    </div>
  );
};

export default Button;
