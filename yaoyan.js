let rumorData, trustData, trustDetailedData, rumorPathData;

// 初始化页面
document.addEventListener("DOMContentLoaded", () => {
  loadData();
});

// 加载数据
function loadData() {
  fetch('page4.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      rumorData = data.rumorData;
      trustData = data.trustData;
      trustDetailedData = data.trustDetailedData;
      rumorPathData = data.rumorPathData;

      renderScrollingText();
      renderTrustChart();
      renderRumorPathChart();
      attachTrustChartEvents();
      startScrollingRumors();
    })
    .catch(error => {
      console.error('Error loading JSON data:', error);
    });
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
