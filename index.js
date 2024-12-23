// 数据总数
const totalCount = 20731; // 固定年总数

// 情感分类统计（从 weiboData 计算）
const sentimentCount = { positive: 0, neutral: 0, negative: 0 };
weiboData.forEach(item => {
    if (item.sentiment === "正面") sentimentCount.positive++;
    else if (item.sentiment === "中性") sentimentCount.neutral++;
    else sentimentCount.negative++;
});
const positiveRatio = (sentimentCount.positive / totalCount) * 100;
const neutralRatio = (sentimentCount.neutral / totalCount) * 100;
const negativeRatio = (sentimentCount.negative / totalCount) * 100;

// 时间维度统计数据（模拟数据）
const timeStats = {
    week: { reposts: 400, comments: 200 },
    month: { reposts: 1600, comments: 800 },
    year: { total: 20731 }
};

// 2024年每月的数据（模拟数据，总和为20731）
const monthlyData = [1700, 1800, 1900, 2000, 2100, 2200, 2300, 2400, 2500, 2600, 2700, 2831];

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
    const modalChart = document.getElementById("modal-chart");

    // 清空之前的内容和样式
    modalBody.innerHTML = "";
    modalBody.className = "modal-body";
    if (echarts.getInstanceByDom(modalChart)) {
        echarts.dispose(modalChart);
    }

    if (boxId === 1) {
        // 数据总览
        modalBody.classList.add("overview");
        modalBody.innerHTML = `
            <h3>数据总览</h3>
            <p>总微博数: ${totalCount}</p>
            <p>正面情感比例: ${positiveRatio.toFixed(1)}%</p>
            <p>中性情感比例: ${neutralRatio.toFixed(1)}%</p>
            <p>负面情感比例: ${negativeRatio.toFixed(1)}%</p>
        `;
        showModalChart('overview');
    } else if (boxId === 2) {
        // 时间维度数据
        modalBody.classList.add("time-stats");
        modalBody.innerHTML = `
            <h3>时间维度数据统计</h3>
            <p>周平均转发: ${timeStats.week.reposts} 条</p>
            <p>周平均评论: ${timeStats.week.comments} 条</p>
            <p>月平均转发: ${timeStats.month.reposts} 条</p>
            <p>月平均评论: ${timeStats.month.comments} 条</p>
            <p>年总数: ${timeStats.year.total} 条</p>
        `;
        showModalChart('time');
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
            <div class="chart-section"></div>
        `;
        showModalChart('keywords');
    }
    

    document.getElementById("modal").style.display = "block";
    setTimeout(() => {
        const modalChartInstance = echarts.getInstanceByDom(modalChart);
        if (modalChartInstance) {
            modalChartInstance.resize();
        }
    }, 100);
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

// 根据选择显示时间统计
function displayTimeStats() {
    const dimensionValue = document.getElementById("timeDimension").value;
    let displayText = '';
    if (dimensionValue === "week") {
        displayText = `
            转发平均: ${timeStats.week.reposts} 条<br>
            评论平均: ${timeStats.week.comments} 条
        `;
    } else if (dimensionValue === "month") {
        displayText = `
            转发平均: ${timeStats.month.reposts} 条<br>
            评论平均: ${timeStats.month.comments} 条
        `;
    } else if (dimensionValue === "year") {
        displayText = `年总数：${timeStats.year.total} 条`;
    }
    document.getElementById("timeContent").innerHTML = displayText;
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
function showModalChart(type) {
    let chartDom;
    let modalChart;

    if (type === 'keywords') {
        chartDom = document.querySelector('.chart-section');
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
                data: [sentimentCount.positive, sentimentCount.neutral, sentimentCount.negative],
                itemStyle: { color: '#00e5ff' },
                barWidth: '50%'
            }]
        };
    } else if (type === 'time') {
        // 2024年1-12月的折线图（使用模拟数据）
        option = {
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                axisLabel: { color: '#00e5ff' },
                axisLine: { lineStyle: { color: '#00e5ff' } }
            },
            yAxis: {
                type: 'value',
                axisLabel: { color: '#00e5ff' },
                axisLine: { lineStyle: { color: '#00e5ff' } }
            },
            series: [{
                type: 'line',
                data: monthlyData,
                itemStyle: { color: '#00e5ff' },
                lineStyle: { color: '#00e5ff' },
                smooth: true
            }]
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
                axisLabel: { color: '#00e5ff', rotate: 30 },
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
    
        // 设置图表选项
        modalChart.setOption(option, { notMerge: true });
    

    }
    

    modalChart.setOption(option, { notMerge: true });
}

// 语言切换功能
function toggleWordCloud() {
    const iframe = document.getElementById('wordCloudIframe');
    const button = document.getElementById('toggleLanguageBtn');

    if (currentLanguage === 'zh') {
        // 切换到英文词云
        iframe.src = wordCloudSources['en'];
        button.textContent = '切换到中文词云';
        currentLanguage = 'en';
    } else {
        // 切换到中文词云
        iframe.src = wordCloudSources['zh'];
        button.textContent = '切换到英文词云';
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
    const mapChart = echarts.getInstanceByDom(document.getElementById('mapContainer'));
    if (mapChart) {
        mapChart.resize();
    }

    const modalChart = echarts.getInstanceByDom(document.getElementById('modal-chart'));
    if (modalChart) {
        modalChart.resize();
    }

    const keywordChart = echarts.getInstanceByDom(document.querySelector('.chart-section'));
    if (keywordChart) {
        keywordChart.resize();
    }
});


// 显示加载界面
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.add('active');
}

// 隐藏加载界面
function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    loadingScreen.classList.remove('active');
}

// 自定义导航函数
function navigateTo(url) {
    showLoadingScreen();
    // 生成2到5秒的随机延迟
    const delay = Math.floor(Math.random() * 3000) + 2000; // 2000ms到5000ms
    setTimeout(() => {
        window.location.href = url;
    }, delay);
}
