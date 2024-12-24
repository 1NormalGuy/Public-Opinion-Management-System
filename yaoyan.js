// 示例数据
const rumorData = {
  "confirmed": [
    {
        "rumor": "手机信号塔会引发附近居民的癌症",
        "source": "B站"
    },
    {
        "rumor": "用花露水洗澡可以防止蚊虫叮咬",
        "source": "其他论坛"
    },
    {
        "rumor": "长期喝速溶咖啡会致癌",
        "source": "其他论坛"
    },
    {
        "rumor": "白发拔一根长十根",
        "source": "贴吧"
    },
    {
        "rumor": "气球放进微波炉会爆炸",
        "source": "B站"
    },
    {
        "rumor": "所有指甲油都有致癌成分",
        "source": "B站"
    },
    {
        "rumor": "用消毒剂漱口可以杀死病毒",
        "source": "微信公众号"
    },
    {
        "rumor": "含糖饮料会瞬间降低免疫力",
        "source": "微信公众号"
    },
    {
        "rumor": "多喝热水能治疗所有感冒症状",
        "source": "贴吧"
    },
    {
        "rumor": "中药材煮的时间越久越有效",
        "source": "微博"
    }
],
  "pending": [
    {
        "rumor": "核能比煤炭更危险",
        "source": "其他自媒体平台"
    },
    {
        "rumor": "海豚是人类失落的智慧种族",
        "source": "B站"
    },
    {
        "rumor": "维生素E能让皮肤更光滑",
        "source": "贴吧"
    },
    {
        "rumor": "微波炉会产生致癌辐射",
        "source": "其他自媒体平台"
    },
    {
        "rumor": "喝碳酸饮料会导致骨折",
        "source": "其他论坛"
    },
    {
        "rumor": "咖啡能“提神醒脑”，适合学生喝",
        "source": "其他论坛"
    },
    {
        "rumor": "用消毒剂漱口可以杀死病毒",
        "source": "贴吧"
    },
    {
        "rumor": "喝咖啡会让骨质疏松",
        "source": "其他论坛"
    },
    {
        "rumor": "气泡水对骨骼健康有害",
        "source": "QQ空间"
    },
    {
        "rumor": "经常晒太阳可以治抑郁",
        "source": "微信公众号"
    }
]
};

const trustData = {
  "官方媒体": 70,
  "自媒体": 30
};



const trustDetailedData = {
  "官方媒体": [
    { "name": "新华社", "trust": 95 },
    { "name": "人民日报", "trust": 90 },
    { "name": "中央电视台(CCTV)", "trust": 88 },
    { "name": "中国日报", "trust": 85 },
    { "name": "经济日报", "trust": 83 },
    { "name": "光明日报", "trust": 82 },
    { "name": "环球时报", "trust": 75 },
    { "name": "解放军报", "trust": 92 },
    { "name": "中华网", "trust": 80 },
    { "name": "中新社(中国新闻社)", "trust": 87 }
  ],
  "自媒体": [
    { "name": "今日头条", "trust": 30 },
    { "name": "知乎", "trust": 40 },
    { "name": "微信公众号", "trust": 28 },
    { "name": "抖音", "trust": 20 },
    { "name": "微博大V", "trust": 25 },
    { "name": "快手", "trust": 18 },
    { "name": "小红书", "trust": 35 },
    { "name": "B站UP主", "trust": 38 },
    { "name": "虎嗅网", "trust": 45 },
    { "name": "36氪", "trust": 48 }
  ]
};
let rumorPathData;
const rumorPathData1 = [
      {
          nodes: [
              { id: '萌娘百科', name: '萌娘百科', symbolSize: 50, category: 0 },
              { id: 'wiki', name: 'wiki', symbolSize: 50, category: 0 },
              { id: '未知来源', name: '未知来源', symbolSize: 50, category: 0 },
              { id: '用户1', name: '用户1', symbolSize: 30, category: 1 },
              { id: '用户2', name: '用户2', symbolSize: 30, category: 1 },
              { id: '用户3', name: '用户3', symbolSize: 30, category: 1 }
          ],
          links: [
              { source: '萌娘百科', target: '用户1' },
              { source: 'wiki', target: '用户2' },
              { source: '未知来源', target: '用户3' },
              { source: '用户1', target: '用户2' },
              { source: '用户2', target: '用户3' }
          ],
          categories: [
              { name: '来源' },
              { name: '用户' }
          ],
          rumor : "手机信号塔会引发附近居民的癌症"
      },
      {
          nodes: [
              { id: '来源X', name: 'B站', symbolSize: 50, category: 0 },
              { id: '来源Y', name: '微博', symbolSize: 50, category: 0 },
              { id: '来源Z', name: '百度', symbolSize: 50, category: 0 },
              { id: '用户1', name: '用户7', symbolSize: 30, category: 1 },
              { id: '用户2', name: '用户8', symbolSize: 30, category: 1 },
              { id: '用户3', name: '用户9', symbolSize: 30, category: 1 }
          ],
          links: [
              { source: '来源X', target: '用户7' },
              { source: '来源Y', target: '用户8' },
              { source: '来源Z', target: '用户9' },
              { source: '用户7', target: '用户8' },
              { source: '用户8', target: '用户9' }
          ],
          categories: [
              { name: '来源' },
              { name: '用户' }
          ],
          rumor : "切开的水果暴露在空气中会释放致癌物质"
      },
      {
          nodes: [
              { id: '公众号', name: '公众号', symbolSize: 50, category: 0 },
              { id: '微博', name: '微博', symbolSize: 50, category: 0 },
              { id: '贴吧', name: '贴吧', symbolSize: 50, category: 0 },
              { id: '用户4', name: '用户4', symbolSize: 30, category: 1 },
              { id: '用户5', name: '用户5', symbolSize: 30, category: 1 },
              { id: '用户6', name: '用户6', symbolSize: 30, category: 1 }
          ],
          links: [
              { source: '公众号', target: '用户4' },
              { source: '微博', target: '用户5' },
              { source: '贴吧', target: '用户6' },
              { source: '用户6', target: '用户5' },
              { source: '用户5', target: '用户4' }
          ],
          categories: [
              { name: '来源' },
              { name: '用户' }
          ],
          rumor : "香蕉可以治愈癌症"
      },
];
const rumorPathData2 = [
    {
        nodes: [
            { id: "微博", name: "微博", symbolSize: 50, category: 0 },
            { id: "微信公众号", name: "微信公众号", symbolSize: 50, category: 0 },
            { id: "QQ空间", name: "QQ空间", symbolSize: 50, category: 0 },
            { id: "抖音", name: "抖音", symbolSize: 50, category: 0 },
            { id: "user1", name: "user1", symbolSize: 30, category: 1 },
            { id: "user2", name: "user2", symbolSize: 30, category: 1 },
            { id: "user3", name: "user3", symbolSize: 30, category: 1 },
            { id: "user4", name: "user4", symbolSize: 30, category: 1 },
            { id: "user5", name: "user5", symbolSize: 30, category: 1 },
            { id: "user6", name: "user6", symbolSize: 30, category: 1 }
        ],
        links: [
            { source: "微博", target: "user1" },
            { source: "微信公众号", target: "user2" },
            { source: "QQ空间", target: "user3" },
            { source: "抖音", target: "user4" },
            { source: "user1", target: "user2" },
            { source: "user2", target: "user3" },
            { source: "user3", target: "user4" },
            { source: "user4", target: "user5" },
            { source: "user5", target: "user6" }
        ],
        categories: [
            { name: "来源" },
            { name: "用户" }
        ],
        rumor: "喝凉开水会伤害肠胃"
    },
    {
        nodes: [
            { id: "B站", name: "B站", symbolSize: 50, category: 0 },
            { id: "贴吧", name: "贴吧", symbolSize: 50, category: 0 },
            { id: "其他论坛", name: "其他论坛", symbolSize: 50, category: 0 },
            { id: "其他自媒体平台", name: "其他自媒体平台", symbolSize: 50, category: 0 },
            { id: "user7", name: "user7", symbolSize: 30, category: 1 },
            { id: "user8", name: "user8", symbolSize: 30, category: 1 },
            { id: "user9", name: "user9", symbolSize: 30, category: 1 },
            { id: "user10", name: "user10", symbolSize: 30, category: 1 },
            { id: "user11", name: "user11", symbolSize: 30, category: 1 },
            { id: "user12", name: "user12", symbolSize: 30, category: 1 }
        ],
        links: [
            { source: "B站", target: "user7" },
            { source: "贴吧", target: "user8" },
            { source: "其他论坛", target: "user9" },
            { source: "其他自媒体平台", target: "user10" },
            { source: "user7", target: "user8" },
            { source: "user8", target: "user9" },
            { source: "user9", target: "user10" },
            { source: "user10", target: "user11" },
            { source: "user11", target: "user12" }
        ],
        categories: [
            { name: "来源" },
            { name: "用户" }
        ],
        rumor: "吃紫薯可以抗癌"
    },
    {
        nodes: [
            { id: "微博", name: "微博", symbolSize: 50, category: 0 },
            { id: "微信公众号", name: "微信公众号", symbolSize: 50, category: 0 },
            { id: "QQ空间", name: "QQ空间", symbolSize: 50, category: 0 },
            { id: "抖音", name: "抖音", symbolSize: 50, category: 0 },
            { id: "user13", name: "user13", symbolSize: 30, category: 1 },
            { id: "user14", name: "user14", symbolSize: 30, category: 1 },
            { id: "user15", name: "user15", symbolSize: 30, category: 1 },
            { id: "user16", name: "user16", symbolSize: 30, category: 1 },
            { id: "user17", name: "user17", symbolSize: 30, category: 1 },
            { id: "user18", name: "user18", symbolSize: 30, category: 1 }
        ],
        links: [
            { source: "微博", target: "user13" },
            { source: "微信公众号", target: "user14" },
            { source: "QQ空间", target: "user15" },
            { source: "抖音", target: "user16" },
            { source: "user13", target: "user14" },
            { source: "user14", target: "user15" },
            { source: "user15", target: "user16" },
            { source: "user16", target: "user17" },
            { source: "user17", target: "user18" }
        ],
        categories: [
            { name: "来源" },
            { name: "用户" }
        ],
        rumor: "把辣椒贴在肚脐可以减肥"
    },
    {
        nodes: [
            { id: "其他论坛", name: "其他论坛", symbolSize: 50, category: 0 },
            { id: "贴吧", name: "贴吧", symbolSize: 50, category: 0 },
            { id: "B站", name: "B站", symbolSize: 50, category: 0 },
            { id: "微信公众号", name: "微信公众号", symbolSize: 50, category: 0 },
            { id: "user19", name: "user19", symbolSize: 30, category: 1 },
            { id: "user20", name: "user20", symbolSize: 30, category: 1 },
            { id: "user21", name: "user21", symbolSize: 30, category: 1 },
            { id: "user22", name: "user22", symbolSize: 30, category: 1 },
            { id: "user23", name: "user23", symbolSize: 30, category: 1 },
            { id: "user24", name: "user24", symbolSize: 30, category: 1 }
        ],
        links: [
            { source: "其他论坛", target: "user19" },
            { source: "贴吧", target: "user20" },
            { source: "B站", target: "user21" },
            { source: "微信公众号", target: "user22" },
            { source: "user19", target: "user20" },
            { source: "user20", target: "user21" },
            { source: "user21", target: "user22" },
            { source: "user22", target: "user23" },
            { source: "user23", target: "user24" }
        ],
        categories: [
            { name: "来源" },
            { name: "用户" }
        ],
        rumor: "用盐水泡脚可以治疗脚气"
    },
    {
        nodes: [
            { id: "微博", name: "微博", symbolSize: 50, category: 0 },
            { id: "微信公众号", name: "微信公众号", symbolSize: 50, category: 0 },
            { id: "QQ空间", name: "QQ空间", symbolSize: 50, category: 0 },
            { id: "抖音", name: "抖音", symbolSize: 50, category: 0 },
            { id: "user25", name: "user25", symbolSize: 30, category: 1 },
            { id: "user26", name: "user26", symbolSize: 30, category: 1 },
            { id: "user27", name: "user27", symbolSize: 30, category: 1 },
            { id: "user28", name: "user28", symbolSize: 30, category: 1 },
            { id: "user29", name: "user29", symbolSize: 30, category: 1 },
            { id: "user30", name: "user30", symbolSize: 30, category: 1 }
        ],
        links: [
            { source: "微博", target: "user25" },
            { source: "微信公众号", target: "user26" },
            { source: "QQ空间", target: "user27" },
            { source: "抖音", target: "user28" },
            { source: "user25", target: "user26" },
            { source: "user26", target: "user27" },
            { source: "user27", target: "user28" },
            { source: "user28", target: "user29" },
            { source: "user29", target: "user30" }
        ],
        categories: [
            { name: "来源" },
            { name: "用户" }
        ],
        rumor: "喝酸奶可以缓解乳糖不耐"
    },
    {
        nodes: [
            { id: "贴吧", name: "贴吧", symbolSize: 50, category: 0 },
            { id: "其他自媒体平台", name: "其他自媒体平台", symbolSize: 50, category: 0 },
            { id: "B站", name: "B站", symbolSize: 50, category: 0 },
            { id: "其他论坛", name: "其他论坛", symbolSize: 50, category: 0 },
            { id: "user31", name: "user31", symbolSize: 30, category: 1 },
            { id: "user32", name: "user32", symbolSize: 30, category: 1 },
            { id: "user33", name: "user33", symbolSize: 30, category: 1 },
            { id: "user34", name: "user34", symbolSize: 30, category: 1 },
            { id: "user35", name: "user35", symbolSize: 30, category: 1 },
            { id: "user36", name: "user36", symbolSize: 30, category: 1 }
        ],
        links: [
            { source: "贴吧", target: "user31" },
            { source: "其他自媒体平台", target: "user32" },
            { source: "B站", target: "user33" },
            { source: "其他论坛", target: "user34" },
            { source: "user31", target: "user32" },
            { source: "user32", target: "user33" },
            { source: "user33", target: "user34" },
            { source: "user34", target: "user35" },
            { source: "user35", target: "user36" }
        ],
        categories: [
            { name: "来源" },
            { name: "用户" }
        ],
        rumor: "多吃菠菜会导致结石"
    },
    {
        nodes: [
            { id: "微博", name: "微博", symbolSize: 50, category: 0 },
            { id: "微信公众号", name: "微信公众号", symbolSize: 50, category: 0 },
            { id: "QQ空间", name: "QQ空间", symbolSize: 50, category: 0 },
            { id: "抖音", name: "抖音", symbolSize: 50, category: 0 },
            { id: "user37", name: "user37", symbolSize: 30, category: 1 },
            { id: "user38", name: "user38", symbolSize: 30, category: 1 },
            { id: "user39", name: "user39", symbolSize: 30, category: 1 },
            { id: "user40", name: "user40", symbolSize: 30, category: 1 },
            { id: "user41", name: "user41", symbolSize: 30, category: 1 },
            { id: "user42", name: "user42", symbolSize: 30, category: 1 }
        ],
        links: [
            { source: "微博", target: "user37" },
            { source: "微信公众号", target: "user38" },
            { source: "QQ空间", target: "user39" },
            { source: "抖音", target: "user40" },
            { source: "user37", target: "user38" },
            { source: "user38", target: "user39" },
            { source: "user39", target: "user40" },
            { source: "user40", target: "user41" },
            { source: "user41", target: "user42" }
        ],
        categories: [
            { name: "来源" },
            { name: "用户" }
        ],
        rumor: "牛奶和红枣一起吃会中毒"
    },
    {
        nodes: [
            { id: "贴吧", name: "贴吧", symbolSize: 50, category: 0 },
            { id: "其他论坛", name: "其他论坛", symbolSize: 50, category: 0 },
            { id: "B站", name: "B站", symbolSize: 50, category: 0 },
            { id: "微信公众号", name: "微信公众号", symbolSize: 50, category: 0 },
            { id: "user43", name: "user43", symbolSize: 30, category: 1 },
            { id: "user44", name: "user44", symbolSize: 30, category: 1 },
            { id: "user45", name: "user45", symbolSize: 30, category: 1 },
            { id: "user46", name: "user46", symbolSize: 30, category: 1 },
            { id: "user47", name: "user47", symbolSize: 30, category: 1 },
            { id: "user48", name: "user48", symbolSize: 30, category: 1 }
        ],
        links: [
            { source: "贴吧", target: "user43" },
            { source: "其他论坛", target: "user44" },
            { source: "B站", target: "user45" },
            { source: "微信公众号", target: "user46" },
            { source: "user43", target: "user44" },
            { source: "user44", target: "user45" },
            { source: "user45", target: "user46" },
            { source: "user46", target: "user47" },
            { source: "user47", target: "user48" }
        ],
        categories: [
            { name: "来源" },
            { name: "用户" }
        ],
        rumor: "孕妇不能吃螃蟹，否则会流产"
    },
    {
        nodes: [
            { id: "微博", name: "微博", symbolSize: 50, category: 0 },
            { id: "微信公众号", name: "微信公众号", symbolSize: 50, category: 0 },
            { id: "QQ空间", name: "QQ空间", symbolSize: 50, category: 0 },
            { id: "抖音", name: "抖音", symbolSize: 50, category: 0 },
            { id: "user49", name: "user49", symbolSize: 30, category: 1 },
            { id: "user50", name: "user50", symbolSize: 30, category: 1 },
            { id: "user51", name: "user51", symbolSize: 30, category: 1 },
            { id: "user52", name: "user52", symbolSize: 30, category: 1 },
            { id: "user53", name: "user53", symbolSize: 30, category: 1 },
            { id: "user54", name: "user54", symbolSize: 30, category: 1 }
        ],
        links: [
            { source: "微博", target: "user49" },
            { source: "微信公众号", target: "user50" },
            { source: "QQ空间", target: "user51" },
            { source: "抖音", target: "user52" },
            { source: "user49", target: "user50" },
            { source: "user50", target: "user51" },
            { source: "user51", target: "user52" },
            { source: "user52", target: "user53" },
            { source: "user53", target: "user54" }
        ],
        categories: [
            { name: "来源" },
            { name: "用户" }
        ],
        rumor: "多吃海参可以增强免疫力"
    }
]

// 初始化页面
document.addEventListener("DOMContentLoaded", () => {
  update();
  renderScrollingText();
  renderTrustChart();
  renderRumorPathChart();
  attachTrustChartEvents();
  startScrollingRumors();
});
function getRandomInt(max) {
  return Math.floor(Math.random() * (max + 1));
}

function update(){
    rumorPathData = rumorPathData2[getRandomInt(8)];
    document.getElementById("rumor-text").innerText = rumorPathData.rumor;
}
// 渲染滚动文字
function renderScrollingText() {
  const scrollingText = document.getElementById('scrolling-text');
  // 清空现有内容
  scrollingText.innerHTML = '';
  // 合并已证实和待验证的谣言
  const allRumors = [
      ...rumorData.confirmed.map(item => ({ ...item, status: '已证实的谣言' })),
      ...rumorData.pending.map(item => ({ ...item, status: '待验证的谣言' }))
  ];
  // 按时间顺序排列（示例中为静态顺序）
  allRumors.forEach((item, index) => {
      const p = document.createElement('p');
      p.classList.add('rumor-item');
      p.innerHTML = `<strong>${item.status}：</strong>${item.rumor}来自${item.source}。`;
      if (index === 0) p.classList.add('visible'); // 第一个谣言初始可见
      scrollingText.appendChild(p);
  });
}

// 定义当前显示的谣言索引
let currentRumorIndex = 0;

// 开始滚动谣言
function startScrollingRumors() {
  const rumorItems = document.querySelectorAll('.rumor-item');
  const totalRumors = rumorItems.length;
  if (totalRumors === 0) return;

  setInterval(() => {
      // 当前谣言元素
      const currentRumor = rumorItems[currentRumorIndex];
      currentRumor.classList.remove('visible');
      currentRumor.classList.add('hidden');

      // 计算下一个索引
      currentRumorIndex = (currentRumorIndex + 1) % totalRumors;
      const nextRumor = rumorItems[currentRumorIndex];
      nextRumor.classList.remove('hidden');
      nextRumor.classList.add('visible');

      // 滚动到下一个谣言
      const container = document.querySelector('.scrolling-text-container');
      const scrollAmount = nextRumor.offsetTop;
      container.scrollTo({
          top: scrollAmount,
          behavior: 'smooth'
      });
  }, 3000); // 每3秒切换一次
}

// 渲染用户信任度分析饼图
function renderTrustChart() {
  const chartDom = document.getElementById('trust-chart');
  const myChart = echarts.init(chartDom);
  const option = {
      title: {
          text: '用户信任度分析',
          left: 'center',
          top: 20,
          textStyle: { color: '#00e5ff' }
      },
      tooltip: {
          trigger: 'item'
      },
      legend: {
          orient: 'vertical',
          left: 'left',
          textStyle: { color: '#00e5ff' }
      },
      series: [
          {
              name: '信任度',
              type: 'pie',
              radius: '50%',
              data: [
                  { value: trustData['官方媒体'], name: '官方媒体' },
                  { value: trustData['自媒体'], name: '自媒体' }
              ],
              emphasis: {
                  itemStyle: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
              },
              label: {
                  color: '#00e5ff'
              }
          }
      ],
      animation: true,
      animationDuration: 1500
  };
  option && myChart.setOption(option);

  // 保存实例以便后续使用
  window.trustChart = myChart;
}

// 处理用户信任度图表点击事件
function attachTrustChartEvents() {
  window.trustChart.on('click', function(params) {
      const category = params.name;
      const detailedData = trustDetailedData[category];
      let content = `<h3>${category} - 详细信息</h3><ul>`;
      detailedData.forEach(item => {
          content += `<li>${item.name} - 信任度: ${item.trust}%</li>`;
      });
      content += `</ul>`;
      openModal(content);
  });
}

// 渲染谣言传播路径图（知识图谱）
function renderRumorPathChart() {
  const chartDom = document.getElementById('rumor-path-chart');
  const myChart = echarts.init(chartDom);
  const option = {
      title: {
          text: '谣言传播路径',
          left: 'center',
          top: 20,
          textStyle: { color: '#00e5ff' }
      },
      tooltip: {
          trigger: 'item',
          formatter: '{b}'
      },
      legend: [{
          data: rumorPathData.categories.map(function (a) { return a.name; }),
          textStyle: { color: '#00e5ff' }
      }],
      series: [
          {
              name: '谣言传播',
              type: 'graph',
              layout: 'force',
              roam: true,
              symbolSize: 50,
              label: {
                  show: true,
                  color: '#00e5ff'
              },
              edgeSymbol: ['none', 'arrow'],
              edgeSymbolSize: [4, 10],
              edgeLabel: {
                  fontSize: 20
              },
              data: rumorPathData.nodes,
              links: rumorPathData.links,
              categories: rumorPathData.categories,
              lineStyle: {
                  opacity: 0.9,
                  width: 2,
                  curveness: 0
              },
              emphasis: {
                  focus: 'adjacency',
                  lineStyle: {
                      width: 10
                  }
              }
          }
      ],
      animation: true,
      animationDuration: 1500
  };
  option && myChart.setOption(option);

  // 保存实例以便后续使用
  window.rumorPathChart = myChart;
}

// 模态框控制函数
function openModal(content) {
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");
  modalBody.innerHTML = content;
  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
}

// 点击空白处关闭模态框
window.onclick = function(event) {
  const modal = document.getElementById("modal");
  if (event.target == modal) {
      modal.style.display = "none";
  }
}