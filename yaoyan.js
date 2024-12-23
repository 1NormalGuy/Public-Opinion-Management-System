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

const rumorPathData = {
  nodes: [
      { id: '来源X', name: '来源X', symbolSize: 50, category: 0 },
      { id: '来源Y', name: '来源Y', symbolSize: 50, category: 0 },
      { id: '来源Z', name: '来源Z', symbolSize: 50, category: 0 },
      { id: '用户1', name: '用户1', symbolSize: 30, category: 1 },
      { id: '用户2', name: '用户2', symbolSize: 30, category: 1 },
      { id: '用户3', name: '用户3', symbolSize: 30, category: 1 }
  ],
  links: [
      { source: '来源X', target: '用户1' },
      { source: '来源Y', target: '用户2' },
      { source: '来源Z', target: '用户3' },
      { source: '用户1', target: '用户2' },
      { source: '用户2', target: '用户3' }
  ],
  categories: [
      { name: '来源' },
      { name: '用户' }
  ]
};

// 初始化页面
document.addEventListener("DOMContentLoaded", () => {
  renderScrollingText();
  renderTrustChart();
  renderRumorPathChart();
  attachTrustChartEvents();
  startScrollingRumors();
});

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
