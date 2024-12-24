// 数据总数
const totalCount = 20731; // 固定年总数

// 情感分类统计（从 weiboData 计算）
const sentimentCount = { positive: 0, neutral: 0, negative: 0 };
weiboData.forEach(item => {
    if (item.sentiment === "正面") sentimentCount.positive++;
    else if (item.sentiment === "中性") sentimentCount.neutral++;
    else sentimentCount.negative++;
});
const positiveRatio = (9418 / totalCount) * 100;
const neutralRatio = (701 / totalCount) * 100;
const negativeRatio = (11055/ totalCount) * 100;


/// 时间维度统计数据（模拟数据）
const timeStats = {
    week: { 
        total: 1870,         // reposts + comments = 1145 + 725
        reposts: 1145, 
        comments: 725 
    },
    month: { 
        total: 30816,        // reposts + comments = 20731 + 10085
        reposts: 20731, 
        comments: 10085 
    },
    year: { 
        total: 30492,        // reposts + comments = 19771 + 10721
        reposts: 19771, 
        comments: 10721 
    }
};


// 各时间维度的折线图数据（模拟数据）
const timeChartData = {
    week: {
        xAxis: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        reposts: [145, 132, 158, 123, 167, 140, 180],
        comments: [95, 88, 102, 76, 119, 110, 135]
    },
    month: {
        xAxis: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
        reposts: [1587, 1423, 1750, 1605, 1902, 1850, 1703, 2001, 1804, 1950, 2102, 1800],
        comments: [820, 760, 910, 845, 980, 900, 875, 1020, 930, 1005, 1150, 870]
    },
    year: {
        xAxis: ['第一季度', '第二季度', '第三季度', '第四季度'],
        reposts: [5000, 4800, 5200, 4771],
        comments: [2500, 2400, 2600, 3221]
    }
};

// 2024年每月的数据（模拟数据，总和为20731）
const monthlyData = [1600, 1500, 1800, 1700, 1900, 1650, 2100, 1950, 1750, 2000, 2200, 20631 - (1600 + 1500 + 1800 + 1700 + 1900 + 1650 + 2100 + 1950 + 1750 + 2000 + 2200)];


/* 
    关键词统计（从 weiboData 计算）
*/
const entityCountMap = {};
weiboData.forEach(item => {
    item.entities.forEach(entity => {
        if (!entityCountMap[entity]) entityCountMap[entity] = 0;
        entityCountMap[entity]++;
    });
});
const entityArray = Object.keys(entityCountMap).map(key => ({ keyword: key, count: entityCountMap[key] }));
entityArray.sort((a, b) => b.count - a.count);

// Fisher-Yates 洗牌算法实现随机选择
function shuffleArray(array) {
    const arr = array.slice(); // 复制数组
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// 随机选择十个关键词
function getRandomKeywords() {
    if (entityArray.length <= 10) return entityArray;
    const shuffled = shuffleArray(entityArray);
    return shuffled.slice(0, 10);
}

let randomKeywordsArray = getRandomKeywords();

// 互动分析：初始随机选择五条数据
let topInteractionData = getRandomInteractions();

// 语言切换变量
let currentLanguage = 'zh'; // 当前语言，'zh' 为中文，'en' 为英文
const wordCloudSources = {
    'zh': 'https://public.flourish.studio/visualisation/20916338/embed', // 中文词云的 Flourish 链接，请替换为实际链接
    'en': 'https://public.flourish.studio/visualisation/20916103/embed'  // 英文词云的 Flourish 链接，请替换为实际链接
};
const wordCloudThumbnails = {
    'zh': 'https://public.flourish.studio/visualisation/20916338/thumbnail', // 中文词云的缩略图链接，请替换为实际链接
    'en': 'https://public.flourish.studio/visualisation/20916103/thumbnail'  // 英文词云的缩略图链接，请替换为实际链接
};

// 将预览数据填入盒子（现已移除预览）
document.addEventListener("DOMContentLoaded", () => {
    // 加载地图
    loadMap();
});

// 互动分析数据随机选择函数
function getRandomInteractions() {
    if (!weiboData || weiboData.length === 0) return [];
    const shuffled = shuffleArray(weiboData);
    return shuffled.slice(0, 5);
}

// 更新互动分析预览（包括文字和图表）
function updateInteractionPreview() {
    topInteractionData = getRandomInteractions();
    console.log("随机选择的互动数据:", topInteractionData); // 调试信息

    if (topInteractionData.length === 0) {
        document.getElementById("interactionTextPreview").innerHTML = `<p>暂无互动数据。</p>`;
        return;
    }

    const previewHTML = topInteractionData.map(item => `
        <p>内容: "${item.content.slice(0, 30)}..."<br>转发: ${item.reposts}, 评论: ${item.comments}</p>
    `).join('');
    document.getElementById("interactionTextPreview").innerHTML = previewHTML;
}

function openModal(boxId) {
    const modalBody = document.getElementById("modal-body");
    const modal = document.getElementById("modal");

    // 清空之前的内容和样式
    modalBody.innerHTML = "";
    modalBody.className = "modal-body";
    // 销毁之前的所有图表实例
    const allCharts = modalBody.querySelectorAll('.modal-chart, #timeChart, #interactionChart, .chart-section');
    allCharts.forEach(chartDom => {
        if (echarts.getInstanceByDom(chartDom)) {
            echarts.dispose(chartDom);
        }
    });

    if (boxId === 1) {
        // 数据总览
        modalBody.classList.add("overview");
        modalBody.innerHTML = `
            <h3>数据总览</h3>
            <p>总微博数: ${totalCount}</p>
            <p>正面情感比例: ${positiveRatio.toFixed(1)}%</p>
            <p>中性情感比例: ${neutralRatio.toFixed(1)}%</p>
            <p>负面情感比例: ${negativeRatio.toFixed(1)}%</p>
            <div id="overviewChart" class="modal-chart"></div>
        `;
        showModalChart('overview');
    } else if (boxId === 2) {
        // 时间维度数据
        modalBody.classList.add("time-stats");
        modalBody.innerHTML = `
            <h3>时间维度数据统计</h3>
            <label for="timeDimensionSelect">选择时间维度:</label>
            <select id="timeDimensionSelect" onchange="updateTimeDimension()">
                <option value="week">周</option>
                <option value="month" selected>月</option>
                <option value="year">年</option>
            </select>
            <div id="timeContent">
                <!-- 动态显示时间维度内容 -->
            </div>
            <div id="timeChart" class="modal-chart"></div>
        `;
        // 默认显示月数据
        displayTimeStats('month');
        showModalChart('time', 'month');
    } else if (boxId === 3) {
        // 互动分析
        modalBody.classList.add("interaction-analysis");
        modalBody.innerHTML = `
            <h3>互动分析</h3>
            <button class="refresh-button" onclick="refreshInteractions()">刷新</button>
            <div id="interactionTextPreview">
                ${topInteractionData.map(item => `
                    <p>内容: "${item.content.slice(0, 30)}..."<br>转发: ${item.reposts}, 评论: ${item.comments}</p>
                `).join('')}
            </div>
            <div id="interactionChart" class="modal-chart"></div>
        `;
        showModalChart('interaction');
    } else if (boxId === 4) {
        // 关键词分析
        modalBody.classList.add("keyword-analysis");
        modalBody.innerHTML = `
            <h3>关键词分析</h3>
            <button class="refresh-button" onclick="refreshKeywords()">刷新</button>
            <div class="keywords-section">
                ${randomKeywordsArray.map(k => `
                    <div class="keyword-item">
                        <div class="keyword">${k.keyword}  ${k.count}次</div>
                    </div>
                `).join('')}
            </div>
            <div class="chart-section modal-chart"></div> <!-- 确保有充足的高度和宽度 -->
        `;
        showModalChart('keywords');
    }

    // 显示模态框
    modal.style.display = "block";

    // 确保图表在模态框完全显示后调整大小
    requestAnimationFrame(() => {
        // 延迟调整以确保模态框渲染完成
        setTimeout(() => {
            if (boxId === 1) {
                const overviewChart = echarts.init(document.getElementById('overviewChart'));
                // 设置数据总览图表
                overviewChart.setOption({
                    tooltip: {},
                    xAxis: {
                        type: 'category',
                        data: ['正面', '中性', '负面'],
                        axisLabel: { color: '#00e5ff' },
                        axisLine: { lineStyle: { color: '#00e5ff' } }
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: { color: '#00e5ff' },
                        axisLine: { lineStyle: { color: '#00e5ff' } }
                    },
                    series: [{
                        type: 'bar',
                        data: [sentimentCount.positive, sentimentCount.neutral, sentimentCount.negative],
                        itemStyle: { color: '#00e5ff' },
                        barWidth: '50%'
                    }]
                });
                overviewChart.resize();
            }
        }, 100);
    });
}

function closeModal() {
    const modal = document.getElementById("modal");
    modal.style.display = "none";
}

// 根据选择显示时间统计
function displayTimeStats(dimension) {
    let displayText = '';
    if (dimension === "week") {
        displayText = `
            总数: ${timeStats.week.total} 条<br>
            转发平均: ${timeStats.week.reposts} 条<br>
            评论平均: ${timeStats.week.comments} 条
        `;
    } else if (dimension === "month") {
        displayText = `
            总数: ${timeStats.month.total} 条<br>
            转发平均: ${timeStats.month.reposts} 条<br>
            评论平均: ${timeStats.month.comments} 条
        `;
    } else if (dimension === "year") {
        displayText = `
            总数: ${timeStats.year.total} 条<br>
            转发平均: ${timeStats.year.reposts} 条<br>
            评论平均: ${timeStats.year.comments} 条
        `;
    }
    document.getElementById("timeContent").innerHTML = displayText;
}

// 更新时间维度选择
function updateTimeDimension() {
    const selectedDimension = document.getElementById("timeDimensionSelect").value;
    displayTimeStats(selectedDimension);
    showModalChart('time', selectedDimension);
}

// 初始化地图
function loadMap() {
    const chart = echarts.init(document.getElementById('mapContainer'));
    chart.setOption({
        tooltip: { trigger: 'item', formatter: '{b}<br/>数据: {c}' },
        visualMap: {
            min: 0,
            max: 1000,
            inRange: { color: ['#0b3d91', '#00e5ff'] },
            textStyle: { color: '#00e5ff' },
            left: 'left',
            top: 'bottom'
        },
        series: [{
            type: 'map',
            map: 'china',
            roam: true,
            emphasis: { itemStyle: { areaColor: '#00e5ff' } },
            label: {
                show: true,
                color: '#fff',
                fontSize: 12
            },
            data: [
                { "name": "北京", "value": 499 },
                { "name": "上海", "value": 445 },
                { "name": "广东", "value": 917 },
                { "name": "江苏", "value": 788 },
                { "name": "浙江", "value": 681 },
                { "name": "山东", "value": 862 },
                { "name": "天津", "value": 609 },
                { "name": "河南", "value": 703 },
                { "name": "河北", "value": 552 },
                { "name": "福建", "value": 407 },
                { "name": "湖南", "value": 602 },
                { "name": "湖北", "value": 511 },
                { "name": "重庆", "value": 655 },
                { "name": "辽宁", "value": 473 },
                { "name": "陕西", "value": 389 },
                { "name": "四川", "value": 501 },
                { "name": "安徽", "value": 298 },
                { "name": "江西", "value": 267 },
                { "name": "广西", "value": 234 },
                { "name": "黑龙江", "value": 397 },
                { "name": "内蒙古", "value": 277 },
                { "name": "甘肃", "value": 208 },
                { "name": "新疆", "value": 254 },
                { "name": "宁夏", "value": 217 },
                { "name": "青海", "value": 179 },
                { "name": "海南", "value": 201 },
                { "name": "山西", "value": 302 },
                { "name": "贵州", "value": 148 },
                { "name": "云南", "value": 222 },
                { "name": "吉林", "value": 298 },
                { "name": "西藏", "value": 101 }
            ]
        }]
    });
}

// 根据不同类型展示不同的图表
function showModalChart(type, dimension = null) {
    let chartDom;
    let modalChart;

    if (type === 'keywords') {
        chartDom = document.querySelector('.chart-section');
    } else if (type === 'interaction') {
        chartDom = document.getElementById('interactionChart');
    } else if (type === 'time') {
        chartDom = document.getElementById('timeChart');
    } else if (type === 'overview') {
        chartDom = document.getElementById('overviewChart');
    } else {
        chartDom = document.getElementById('modal-chart');
    }

    // 销毁之前的图表实例，避免重复实例化
    if (echarts.getInstanceByDom(chartDom)) {
        echarts.dispose(chartDom);
    }

    modalChart = echarts.init(chartDom);

    let option = {};

    if (type === 'overview') {
        option = {
            tooltip: {},
            xAxis: {
                type: 'category',
                data: ['正面', '中性', '负面'],
                axisLabel: { color: '#00e5ff' },
                axisLine: { lineStyle: { color: '#00e5ff' } }
            },
            yAxis: {
                type: 'value',
                axisLabel: { color: '#00e5ff' },
                axisLine: { lineStyle: { color: '#00e5ff' } }
            },
            series: [{
                type: 'bar',
                data: [9418, 701, 11055],
                itemStyle: { color: '#00e5ff' },
                barWidth: '50%'
            }]
        };
    } else if (type === 'time') {
        if (!dimension) dimension = 'year'; // 默认选择月

        const data = timeChartData[dimension];
        option = {
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['转发', '评论'],
                textStyle: { color: '#00e5ff' }
            },
            xAxis: {
                type: 'category',
                data: data.xAxis,
                axisLabel: { color: '#00e5ff' },
                axisLine: { lineStyle: { color: '#00e5ff' } }
            },
            yAxis: {
                type: 'value',
                axisLabel: { color: '#00e5ff' },
                axisLine: { lineStyle: { color: '#00e5ff' } }
            },
            series: [
                {
                    name: '转发',
                    type: 'line',
                    data: data.reposts,
                    itemStyle: { color: '#00e5ff' },
                    lineStyle: { color: '#00e5ff' },
                    smooth: true
                },
                {
                    name: '评论',
                    type: 'line',
                    data: data.comments,
                    itemStyle: { color: '#00bcd4' },
                    lineStyle: { color: '#00bcd4' },
                    smooth: true
                }
            ]
        };
    } else if (type === 'interaction') {
        // 互动分析柱状图
        const xData = topInteractionData.map(d => d.content.slice(0, 30) + '...');
        const repostData = topInteractionData.map(d => d.reposts);
        const commentData = topInteractionData.map(d => d.comments);

        option = {
            tooltip: {},
            legend: {
                data: ['转发', '评论'],
                textStyle: { color: '#00e5ff' }
            },
            xAxis: {
                type: 'category',
                data: xData,
                axisLabel: { color: '#00e5ff', rotate: 30, interval: 0 },
                axisLine: { lineStyle: { color: '#00e5ff' } }
            },
            yAxis: {
                type: 'value',
                axisLabel: { color: '#00e5ff' },
                axisLine: { lineStyle: { color: '#00e5ff' } }
            },
            series: [
                {
                    name: '转发',
                    type: 'bar',
                    data: repostData,
                    itemStyle: { color: '#00e5ff' },
                    barWidth: '30%'
                },
                {
                    name: '评论',
                    type: 'bar',
                    data: commentData,
                    itemStyle: { color: '#00bcd4' },
                    barWidth: '30%'
                }
            ]
        };
    } else if (type === 'keywords') {
        // 验证 randomKeywordsArray 是否有数据
        if (!randomKeywordsArray || randomKeywordsArray.length === 0) {
            console.error('randomKeywordsArray is empty or undefined.');
            option = {
                title: {
                    text: '暂无关键词数据',
                    left: 'center',
                    top: 'center',
                    textStyle: {
                        color: '#00e5ff',
                        fontSize: 20
                    }
                }
            };
        } else {
            option = {
                tooltip: {
                    trigger: 'item',
                    formatter: '{b}: {c}次 ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    textStyle: { color: '#00e5ff' }
                },
                series: [
                    {
                        name: '关键词',
                        type: 'pie',
                        radius: '50%',
                        data: randomKeywordsArray.map(k => ({
                            value: typeof k.count === 'number' ? k.count : 0,
                            name: k.keyword || '未知关键词'
                        })),
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        },
                        label: {
                            color: '#00e5ff',
                            formatter: '{b}: {c}次 ({d}%)'
                        }
                    }
                ]
            };
        }
    }

    modalChart.setOption(option, { notMerge: true });
    modalChart.resize();
}

// 语言切换功能
function toggleWordCloud() {
    const iframe = document.getElementById('wordCloudIframe');
    const button = document.getElementById('toggleLanguageBtn');

    if (currentLanguage === 'zh') {
        // 切换到英文词云
        iframe.src = wordCloudSources['en'];
        button.textContent = 'CN';
        currentLanguage = 'en';
    } else {
        // 切换到中文词云
        iframe.src = wordCloudSources['zh'];
        button.textContent = 'EN';
        currentLanguage = 'zh';
    }
}

// 刷新互动分析数据（包括文字和图表）
function refreshInteractions() {
    updateInteractionPreview();
    showModalChart('interaction');
}

// 刷新关键词分析数据（包括文字和图表）
function refreshKeywords() {
    randomKeywordsArray = getRandomKeywords();
    const keywordsSection = document.querySelector('.keywords-section');
    keywordsSection.innerHTML = randomKeywordsArray.map(k => `
        <div class="keyword-item">
            <div class="keyword">${k.keyword}  ${k.count}次</div>
        </div>
    `).join('');
    showModalChart('keywords');
}

// 确保图表在窗口大小变化时自适应
window.addEventListener('resize', () => {
    const allCharts = [
        echarts.getInstanceByDom(document.getElementById('mapContainer')),
        echarts.getInstanceByDom(document.getElementById('overviewChart')),
        echarts.getInstanceByDom(document.getElementById('timeChart')),
        echarts.getInstanceByDom(document.getElementById('interactionChart')),
        echarts.getInstanceByDom(document.querySelector('.chart-section'))
    ];
    allCharts.forEach(chart => {
        if (chart) {
            chart.resize();
        }
    });
});

// 显示加载界面
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('active');
    }
}

// 隐藏加载界面
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.remove('active');
    }
}

// 自定义导航函数modal-chart
function navigateTo(url) {
    showLoadingScreen();
    // 生成2到5秒的随机延迟
    const delay = Math.floor(Math.random() * 3000) + 2000; // 2000ms到5000ms
    setTimeout(() => {
        window.location.href = url;
    }, delay);
}

// 在页面加载完成后隐藏加载界面
document.addEventListener("DOMContentLoaded", () => {
    hideLoadingScreen();
});
