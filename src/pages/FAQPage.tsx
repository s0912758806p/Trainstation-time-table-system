import React, { useState } from 'react';
import {
  Card,
  Typography,
  Collapse,
  Input,
  Button,
  Tag,
  Empty,
  Divider,
  Space,
  Tabs,
  List,
  Avatar,
  Alert,
  message,
} from 'antd';
import {
  SearchOutlined,
  QuestionCircleOutlined,
  SolutionOutlined,
  FileTextOutlined,
  CreditCardOutlined,
  ScheduleOutlined,
  UserOutlined,
  RightOutlined,
  CarOutlined,
  PhoneOutlined,
  MailOutlined,
  RocketOutlined,
  MessageOutlined,
} from '@ant-design/icons';

const { Title, Paragraph, Text, Link } = Typography;
const { Panel } = Collapse;

// 常見問題資料
interface FAQ {
  id: string;
  question: string;
  answer: React.ReactNode;
  category: string;
  tags: string[];
}

const FAQPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchResults, setSearchResults] = useState<
    Array<{ category: string; items: FAQ[] }>
  >([]);

  // 常見問題列表
  const faqData: FAQ[] = [
    {
      id: 'faq-1',
      question: '如何查詢列車時刻表？',
      answer: (
        <>
          <p>查詢列車時刻表有以下幾種方式：</p>
          <ol>
            <li>
              在首頁或時刻表頁面，選擇出發站、到達站和日期，點擊「查詢」按鈕。
            </li>
            <li>直接輸入車次號碼進行查詢。</li>
            <li>使用台鐵官方APP。</li>
            <li>撥打台鐵客服專線：4133333轉9。</li>
          </ol>
          <p>
            時刻表查詢功能支援30天內的列車班次，若需查詢更遠日期的班次，請待台鐵公告。
          </p>
        </>
      ),
      category: 'schedule',
      tags: ['時刻表', '查詢', '班次'],
    },
    {
      id: 'faq-2',
      question: '如何購買車票？',
      answer: (
        <>
          <p>您可以透過以下方式購買台鐵車票：</p>
          <ul>
            <li>本網站：登入會員後，在「車票查詢」頁面選擇車次並完成付款。</li>
            <li>台鐵車站售票窗口：直接前往各車站的售票窗口購票。</li>
            <li>自動售票機：在各車站的自動售票機購票。</li>
            <li>超商代售：7-11、全家、萊爾富等超商的ibon、FamiPort等機台。</li>
            <li>台鐵官方APP：下載台鐵官方APP進行購票。</li>
          </ul>
          <Alert
            message="提醒您"
            description="網路訂票請提前於乘車日14天前至2小時前完成。為避免向隅，建議提早訂票。"
            type="info"
            showIcon
            style={{ marginTop: 16 }}
          />
        </>
      ),
      category: 'ticket',
      tags: ['購票', '訂票', '付款'],
    },
    {
      id: 'faq-3',
      question: '台鐵車票有哪些種類？',
      answer: (
        <>
          <p>台鐵車票主要分為以下幾種：</p>
          <ul>
            <li>
              <strong>對號座車票</strong>
              ：自強號、莒光號、復興號等列車，有固定座位。
            </li>
            <li>
              <strong>非對號座車票</strong>：區間車、普快車等，無固定座位。
            </li>
            <li>
              <strong>站票</strong>：無座位，只能站立乘車。
            </li>
            <li>
              <strong>團體票</strong>：10人以上可訂購團體票。
            </li>
            <li>
              <strong>定期票</strong>：適合固定區間通勤族。
            </li>
            <li>
              <strong>優惠票</strong>：包括敬老票、愛心票、兒童票等。
            </li>
          </ul>
          <p>不同種類的車票有不同的使用規定，請在購買前詳閱說明。</p>
        </>
      ),
      category: 'ticket',
      tags: ['票種', '對號座', '站票'],
    },
    {
      id: 'faq-4',
      question: '如何退票或換票？',
      answer: (
        <>
          <p>退票和換票的方式如下：</p>
          <ul>
            <li>
              <strong>網路退票</strong>
              ：在「訂單管理」中選擇要退票的訂單，點擊「退票」按鈕。
            </li>
            <li>
              <strong>車站退票</strong>
              ：攜帶車票和證件到台鐵各車站售票窗口辦理。
            </li>
            <li>
              <strong>換票</strong>：請先辦理退票，再重新購票。
            </li>
          </ul>
          <p>
            <strong>退票手續費規定：</strong>
          </p>
          <ul>
            <li>乘車日前1天（含）以前退票：收取票價10%</li>
            <li>乘車當日列車出發前2小時以上退票：收取票價20%</li>
            <li>乘車當日列車出發前2小時內退票：收取票價50%</li>
            <li>列車出發後退票：無法退票</li>
          </ul>
          <Alert
            message="注意"
            description="使用超商購票或取票者，僅能至車站辦理退票。"
            type="warning"
            showIcon
            style={{ marginTop: 16 }}
          />
        </>
      ),
      category: 'ticket',
      tags: ['退票', '換票', '手續費'],
    },
    {
      id: 'faq-5',
      question: '我可以攜帶寵物或自行車上車嗎？',
      answer: (
        <>
          <p>
            <strong>寵物攜帶規定：</strong>
          </p>
          <ul>
            <li>小型寵物需放置在寵物籠內，且體重加籠重不超過15公斤。</li>
            <li>導盲犬、導聾犬及肢體輔助犬不受此限。</li>
          </ul>
          <p>
            <strong>自行車攜帶規定：</strong>
          </p>
          <ul>
            <li>需搭乘有「自行車標誌」的列車。</li>
            <li>需購買自行車票，票價為半票。</li>
            <li>有些列車需預約自行車掛車服務。</li>
            <li>摺疊自行車完全摺疊後，總長不超過165公分可免費攜帶。</li>
          </ul>
          <p>詳細規定請參考台鐵最新公告。</p>
        </>
      ),
      category: 'service',
      tags: ['寵物', '自行車', '攜帶'],
    },
    {
      id: 'faq-6',
      question: '如何申請台鐵會員？',
      answer: (
        <>
          <p>申請台鐵會員的步驟如下：</p>
          <ol>
            <li>點擊網站右上角的「註冊」按鈕。</li>
            <li>填寫基本資料，包括姓名、身分證字號、電子郵件、手機號碼等。</li>
            <li>設定密碼。</li>
            <li>接受服務條款與隱私權政策。</li>
            <li>點擊「註冊」按鈕完成會員註冊。</li>
            <li>至電子郵件信箱收取驗證信並點擊驗證連結。</li>
          </ol>
          <p>成為會員後，您可以享有以下權益：</p>
          <ul>
            <li>網路訂票、查詢訂票紀錄</li>
            <li>會員專屬優惠</li>
            <li>快速付款</li>
            <li>常用乘車資訊儲存</li>
          </ul>
        </>
      ),
      category: 'member',
      tags: ['會員', '註冊', '權益'],
    },
    {
      id: 'faq-7',
      question: '忘記密碼怎麼辦？',
      answer: (
        <>
          <p>如果您忘記了密碼，可以通過以下步驟重設：</p>
          <ol>
            <li>點擊登入頁面的「忘記密碼」連結。</li>
            <li>輸入您註冊時使用的電子郵件地址。</li>
            <li>系統會寄送密碼重設連結到您的電子郵件。</li>
            <li>點擊郵件中的連結，設定新密碼。</li>
            <li>使用新密碼登入系統。</li>
          </ol>
          <p>如果您仍無法登入，請聯繫客服協助處理。</p>
        </>
      ),
      category: 'member',
      tags: ['密碼', '重設', '登入'],
    },
    {
      id: 'faq-8',
      question: '台鐵有哪些優惠方案？',
      answer: (
        <>
          <p>台鐵提供多種優惠方案，主要包括：</p>
          <ul>
            <li>
              <strong>敬老優惠</strong>：65歲以上長者，憑身分證享有半價優惠。
            </li>
            <li>
              <strong>兒童優惠</strong>
              ：6-12歲兒童半價，未滿6歲兒童免費（不佔位）。
            </li>
            <li>
              <strong>愛心優惠</strong>
              ：身心障礙者及其陪同者一人可享有半價優惠。
            </li>
            <li>
              <strong>學生優惠</strong>：特定節日或寒暑假期間，學生可享有優惠。
            </li>
            <li>
              <strong>團體優惠</strong>：10人以上團體，可享有優惠。
            </li>
            <li>
              <strong>定期票優惠</strong>：針對固定區間通勤族的優惠方案。
            </li>
          </ul>
          <p>
            各項優惠可能有特定使用規定和限制，搭乘時請攜帶相關證件以備查驗。
          </p>
        </>
      ),
      category: 'ticket',
      tags: ['優惠', '折扣', '敬老', '愛心'],
    },
    {
      id: 'faq-9',
      question: '遺失物品如何協尋？',
      answer: (
        <>
          <p>在台鐵列車或車站遺失物品的處理方式：</p>
          <ol>
            <li>請立即向乘車列車長或車站站務人員報告。</li>
            <li>可撥打台鐵失物招領中心電話：02-23815226#3665。</li>
            <li>可至台鐵各車站「旅客服務中心」或「服務台」查詢。</li>
            <li>
              可上台鐵「失物招領系統」網站查詢：
              <Link
                href="https://www.railway.gov.tw/tra-tip-web/tip/tip00H/tipH41/viewLost"
                target="_blank"
              >
                失物招領系統
              </Link>
            </li>
          </ol>
          <p>
            <strong>提供遺失物品協尋時，請準備以下資訊：</strong>
          </p>
          <ul>
            <li>遺失日期、時間</li>
            <li>搭乘車次或遺失地點</li>
            <li>物品詳細描述（形狀、顏色、品牌等）</li>
            <li>聯絡方式</li>
          </ul>
          <Alert
            message="請注意"
            description="遺失物品尋獲後，請於3個月內持有效證件前往領取，超過期限將依法處理。"
            type="info"
            showIcon
            style={{ marginTop: 16 }}
          />
        </>
      ),
      category: 'service',
      tags: ['遺失物', '協尋', '失物招領'],
    },
    {
      id: 'faq-10',
      question: '列車延誤如何處理？',
      answer: (
        <>
          <p>當列車發生延誤時，台鐵將視情況提供以下處理方式：</p>
          <ul>
            <li>
              <strong>退票處理</strong>
              ：因列車延誤無法如期搭乘時，可辦理全額退票，不收取手續費。
            </li>
            <li>
              <strong>延誤證明</strong>
              ：如需列車延誤證明，可向車站人員或列車長索取。
            </li>
            <li>
              <strong>轉乘安排</strong>
              ：重大延誤時，台鐵可能安排其他交通工具接駁。
            </li>
          </ul>
          <p>
            <strong>不同延誤時間的處理方式：</strong>
          </p>
          <ul>
            <li>延誤30分鐘以上：可辦理全額退票</li>
            <li>延誤2小時以上：可獲得延誤補償（依台鐵最新規定）</li>
          </ul>
          <p>列車延誤資訊將透過車站廣播、官方網站和APP通知旅客。</p>
        </>
      ),
      category: 'service',
      tags: ['延誤', '退票', '補償'],
    },
    {
      id: 'faq-11',
      question: '行動不便者搭乘服務有哪些？',
      answer: (
        <>
          <p>台鐵為行動不便者提供以下服務：</p>
          <ul>
            <li>
              <strong>無障礙設施</strong>
              ：多數車站設有電梯、斜坡道、無障礙廁所等設施。
            </li>
            <li>
              <strong>輪椅服務</strong>：車站提供輪椅借用服務。
            </li>
            <li>
              <strong>專人協助</strong>：可預約站務人員協助上下車。
            </li>
            <li>
              <strong>愛心座位</strong>：列車上設有優先座位。
            </li>
            <li>
              <strong>身心障礙者優惠</strong>
              ：持有身心障礙證明者及其陪同者一人可享半價優惠。
            </li>
          </ul>
          <p>
            <strong>預約協助服務：</strong>
          </p>
          <p>
            如需預約協助服務，請提前3天致電台鐵客服中心（4133333轉9）或直接聯繫乘車車站。
          </p>
          <Alert
            message="備註"
            description="部分老舊車站可能無法提供完整無障礙設施，請提前查詢或聯繫確認。"
            type="info"
            showIcon
            style={{ marginTop: 16 }}
          />
        </>
      ),
      category: 'service',
      tags: ['無障礙', '輪椅', '愛心座位'],
    },
    {
      id: 'faq-12',
      question: '如何查詢列車即時動態？',
      answer: (
        <>
          <p>查詢列車即時動態的方式：</p>
          <ol>
            <li>
              <strong>官方網站</strong>：台鐵官網的「列車動態」頁面。
            </li>
            <li>
              <strong>台鐵App</strong>
              ：下載官方APP，可查詢列車即時位置和延誤情況。
            </li>
            <li>
              <strong>車站大型顯示器</strong>：各車站的電子顯示板。
            </li>
            <li>
              <strong>客服專線</strong>：撥打4133333轉9查詢。
            </li>
          </ol>
          <p>即時動態資訊包括：</p>
          <ul>
            <li>列車目前位置</li>
            <li>預計到站時間</li>
            <li>是否延誤</li>
            <li>誤點原因（如有）</li>
          </ul>
          <p>系統通常每3-5分鐘更新一次資料，請以實際車站廣播為準。</p>
        </>
      ),
      category: 'schedule',
      tags: ['即時', '動態', '誤點'],
    },
  ];

  // 聯絡資訊
  const contactInfo = [
    {
      title: '客服電話',
      description: '(02) 1234-5678 (週一至週五 9:00-18:00)',
      icon: <PhoneOutlined />,
    },
    {
      title: '客服信箱',
      description: 'service@train.example.com',
      icon: <MailOutlined />,
    },
    {
      title: '線上客服',
      description: '每日 9:00-22:00',
      icon: <MessageOutlined />,
    },
  ];

  // 處理搜尋
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results: Record<string, FAQ[]> = {};

    faqData.forEach((faq) => {
      const matchQuestion = faq.question.toLowerCase().includes(query);
      const matchAnswer =
        typeof faq.answer === 'string'
          ? faq.answer.toLowerCase().includes(query)
          : false;
      const matchTags = faq.tags.some((tag) =>
        tag.toLowerCase().includes(query)
      );

      if (matchQuestion || matchAnswer || matchTags) {
        if (!results[faq.category]) {
          results[faq.category] = [];
        }
        results[faq.category].push(faq);
      }
    });

    const formattedResults = Object.entries(results).map(
      ([category, items]) => ({
        category,
        items,
      })
    );

    setSearchResults(formattedResults);
  };

  // 處理聯絡表單提交
  const handleContactFormSubmit = () => {
    message.success('您的諮詢已送出，我們會盡快回覆您！');
  };

  // 取得分類名稱
  const getCategoryName = (key: string) => {
    const categories: Record<string, string> = {
      schedule: '時刻表',
      ticket: '訂票/退票',
      service: '乘車服務',
      member: '會員相關',
      other: '其他',
    };
    return categories[key] || '其他';
  };

  // 處理下載PDF
  const handleExportPDF = () => {
    message.success('FAQ文件已開始下載');
  };

  // 定義FAQ標籤項目
  const faqTabItems = [
    {
      key: 'booking',
      label: (
        <span>
          <CreditCardOutlined /> 訂票相關
        </span>
      ),
      children: (
        <Collapse accordion>
          {faqData
            .filter((faq) => faq.category === 'ticket')
            .map((item, index) => (
              <Panel
                header={
                  <Text strong>
                    <QuestionCircleOutlined
                      style={{ color: 'var(--brand)', marginRight: 8 }}
                    />
                    {item.question}
                  </Text>
                }
                key={`booking-${index}`}
              >
                <Paragraph>{item.answer}</Paragraph>
              </Panel>
            ))}
        </Collapse>
      ),
    },
    {
      key: 'refund',
      label: (
        <span>
          <FileTextOutlined /> 退票相關
        </span>
      ),
      children: (
        <Collapse accordion>
          {faqData
            .filter((faq) => faq.category === 'ticket')
            .map((item, index) => (
              <Panel
                header={
                  <Text strong>
                    <QuestionCircleOutlined
                      style={{ color: 'var(--brand)', marginRight: 8 }}
                    />
                    {item.question}
                  </Text>
                }
                key={`refund-${index}`}
              >
                <Paragraph>{item.answer}</Paragraph>
              </Panel>
            ))}
        </Collapse>
      ),
    },
    {
      key: 'ticketTypes',
      label: (
        <span>
          <FileTextOutlined /> 票種說明
        </span>
      ),
      children: (
        <Collapse accordion>
          {faqData
            .filter((faq) => faq.category === 'ticket')
            .map((item, index) => (
              <Panel
                header={
                  <Text strong>
                    <QuestionCircleOutlined
                      style={{ color: 'var(--brand)', marginRight: 8 }}
                    />
                    {item.question}
                  </Text>
                }
                key={`ticketTypes-${index}`}
              >
                <Paragraph>{item.answer}</Paragraph>
              </Panel>
            ))}
        </Collapse>
      ),
    },
    {
      key: 'travel',
      label: (
        <span>
          <CarOutlined /> 旅行資訊
        </span>
      ),
      children: (
        <Collapse accordion>
          {faqData
            .filter((faq) => faq.category === 'service')
            .map((item, index) => (
              <Panel
                header={
                  <Text strong>
                    <QuestionCircleOutlined
                      style={{ color: 'var(--brand)', marginRight: 8 }}
                    />
                    {item.question}
                  </Text>
                }
                key={`travel-${index}`}
              >
                <Paragraph>{item.answer}</Paragraph>
              </Panel>
            ))}
        </Collapse>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Title level={2} style={{ marginBottom: 24, textAlign: 'center' }}>
        常見問題
      </Title>

      <Card className="mb-6 shadow-sm">
        <div className="flex items-center mb-4">
          <Input
            placeholder="搜尋常見問題..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: '80%' }}
            prefix={<SearchOutlined />}
          />
          <Button
            type="primary"
            onClick={handleSearch}
            style={{ marginLeft: 8 }}
          >
            搜尋
          </Button>
        </div>

        <div className="mb-4">
          <Space size={[0, 8]} wrap>
            <Button
              type={activeCategory === 'all' ? 'primary' : 'default'}
              onClick={() => setActiveCategory('all')}
            >
              全部
            </Button>
            <Button
              type={activeCategory === 'ticket' ? 'primary' : 'default'}
              onClick={() => setActiveCategory('ticket')}
              icon={<CreditCardOutlined />}
            >
              訂票/退票
            </Button>
            <Button
              type={activeCategory === 'schedule' ? 'primary' : 'default'}
              onClick={() => setActiveCategory('schedule')}
              icon={<ScheduleOutlined />}
            >
              時刻表
            </Button>
            <Button
              type={activeCategory === 'service' ? 'primary' : 'default'}
              onClick={() => setActiveCategory('service')}
              icon={<SolutionOutlined />}
            >
              乘車服務
            </Button>
            <Button
              type={activeCategory === 'member' ? 'primary' : 'default'}
              onClick={() => setActiveCategory('member')}
              icon={<UserOutlined />}
            >
              會員相關
            </Button>
          </Space>
        </div>

        {searchResults.length > 0 ? (
          <div>
            <Title level={4}>搜尋結果：</Title>
            {searchResults.map((categoryGroup, index) => (
              <div key={index} className="mb-4">
                <Title level={5} className="mb-2">
                  {getCategoryName(categoryGroup.category)}
                </Title>
                <Collapse accordion>
                  {categoryGroup.items.map((item, idx) => (
                    <Panel
                      header={
                        <Text strong>
                          <QuestionCircleOutlined
                            style={{ color: 'var(--brand)', marginRight: 8 }}
                          />
                          {item.question}
                        </Text>
                      }
                      key={`search-${index}-${idx}`}
                    >
                      <Paragraph>{item.answer}</Paragraph>
                    </Panel>
                  ))}
                </Collapse>
              </div>
            ))}
            <Button
              type="link"
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
              }}
            >
              清除搜尋結果，返回所有常見問題
            </Button>
          </div>
        ) : (
          <Tabs defaultActiveKey="booking" items={faqTabItems} />
        )}

        <div className="mt-6 text-center">
          <Text type="secondary">沒有找到您需要的答案？</Text>
          <Button
            type="link"
            onClick={handleExportPDF}
            icon={<FileTextOutlined />}
          >
            下載完整FAQ文件
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <Title level={4}>
            <RocketOutlined /> 快速導航
          </Title>
          <Divider />
          <div className="grid grid-cols-2 gap-4">
            <Button
              type="default"
              icon={<CreditCardOutlined />}
              block
              className="text-left h-auto py-2"
            >
              訂票說明
            </Button>
            <Button
              type="default"
              icon={<UserOutlined />}
              block
              className="text-left h-auto py-2"
            >
              會員權益
            </Button>
            <Button
              type="default"
              icon={<CarOutlined />}
              block
              className="text-left h-auto py-2"
            >
              車站資訊
            </Button>
            <Button
              type="default"
              icon={<ScheduleOutlined />}
              block
              className="text-left h-auto py-2"
            >
              列車種類說明
            </Button>
            <Button
              type="default"
              icon={<FileTextOutlined />}
              block
              className="text-left h-auto py-2"
            >
              乘車規則
            </Button>
            <Button
              type="default"
              icon={<CreditCardOutlined />}
              block
              className="text-left h-auto py-2"
            >
              付款方式
            </Button>
          </div>
        </Card>

        <Card className="shadow-sm">
          <Title level={4}>
            <PhoneOutlined /> 聯繫我們
          </Title>
          <Divider />
          <List
            itemLayout="horizontal"
            dataSource={contactInfo}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      icon={item.icon}
                      style={{ background: 'var(--brand)' }}
                    />
                  }
                  title={item.title}
                  description={item.description}
                />
              </List.Item>
            )}
          />
          <Divider />
          <Text>如有其他問題或建議，請聯繫我們的客服團隊</Text>
          <div className="flex justify-center mt-4">
            <Button type="primary" onClick={handleContactFormSubmit}>
              在線諮詢
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FAQPage;
