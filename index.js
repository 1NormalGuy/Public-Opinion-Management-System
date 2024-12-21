// 您提供的JSON数据
const weiboData = [
    {
        "id": 1,
        "time": "2024-06-01",
        "content": "人工智能在未来将改变世界。",
        "sentiment": "正面",
        "entities": ["人工智能", "未来"],
        "events": ["科技创新"],
        "reposts": 1200,
        "comments": 800
    },
    {
        "id": 2,
        "time": "2024-06-02",
        "content": "世界杯决赛带来了无与伦比的激情。",
        "sentiment": "正面",
        "entities": ["世界杯", "决赛"],
        "events": ["体育赛事"],
        "reposts": 1500,
        "comments": 1100
    },
    {
        "id": 3,
        "time": "2024-06-03",
        "content": "网络安全问题需要得到重视。",
        "sentiment": "中性",
        "entities": ["网络安全"],
        "events": ["安全漏洞"],
        "reposts": 500,
        "comments": 300
    }
];

// 对数据进行统计
const totalCount = weiboData.length;
const sentimentCount = { positive: 0, neutral: 0, negative: 0 };
weiboData.forEach(item => {
    if (item.sentiment === "正面") sentimentCount.positive++;
    else if (item.sentiment === "中性") sentimentCount.neutral++;
    else sentimentCount.negative++;
});

const positiveRatio = (sentimentCount.positive / totalCount) * 100;
const neutralRatio = (sentimentCount.neutral / totalCount) * 100;
const negativeRatio = (sentimentCount.negative / totalCount) * 100;

// 简单的时间维度统计示例(周、月、年)：
function getTimeStats(dimension) {
    let totalReposts = 0;
    let totalComments = 0;
    weiboData.forEach(item => {
        totalReposts += item.reposts;
        totalComments += item.comments;
    });

    // 根据dimension可以做更复杂的分组统计，这里仅示例
    if (dimension === "周") {
        return `周统计：访问量 ${totalReposts + totalComments}，转发 ${totalReposts}，评论 ${totalComments}`;
    } else if (dimension === "月") {
        return `月统计：访问量 ${totalReposts + totalComments}，转发 ${totalReposts}，评论 ${totalComments}`;
    } else if (dimension === "年") {
        return `年统计：访问量 ${totalReposts + totalComments}，转发 ${totalReposts}，评论 ${totalComments}`;
    }
}

// 互动分析：按转发数排序的前2条
const sortedByReposts = [...weiboData].sort((a,b) => b.reposts - a.reposts);
const topN = 2;
const topInteractionPreview = sortedByReposts.slice(0, topN).map(d => `内容: "${d.content.slice(0,6)}..."<br>转发: ${d.reposts} 评论: ${d.comments}`).join('<br>');

// 关键词统计
const entityCountMap = {};
weiboData.forEach(item => {
    item.entities.forEach(entity => {
        if(!entityCountMap[entity]) entityCountMap[entity] = 0;
        entityCountMap[entity]++;
    });
});
const entityArray = Object.keys(entityCountMap).map(key => ({ keyword: key, count: entityCountMap[key] }));
entityArray.sort((a,b) => b.count - a.count);
const topKeywordsPreview = entityArray.map(e => `${e.keyword}: ${e.count}次`).join('<br>');

// 将预览数据填入盒子
document.addEventListener("DOMContentLoaded", () => {
    // 数据总览预览
    document.getElementById("overviewPreview").innerHTML = `
        总数: ${totalCount}<br>
        正面: ${sentimentCount.positive} (${positiveRatio.toFixed(1)}%)<br>
        中性: ${sentimentCount.neutral} (${neutralRatio.toFixed(1)}%)<br>
        负面: ${sentimentCount.negative} (${negativeRatio.toFixed(1)}%)
    `;

    // 时间维度统计预览（默认周统计）
    document.getElementById("timeContent").textContent = getTimeStats("周");

    // 互动分析预览
    document.getElementById("interactionPreview").innerHTML = topInteractionPreview;

    // 关键词分析预览
    document.getElementById("keywordsPreview").innerHTML = topKeywordsPreview;

    // 加载地图
    loadMap();
});

function openModal(boxId) {
    const modalBody = document.getElementById("modal-body");
    const modalChart = document.getElementById("modal-chart");
    modalBody.innerHTML = ""; // 清空模态框内容

    if (boxId === 1) {
        modalBody.innerHTML = `
            <h3>数据总览</h3>
            <p>总微博数: ${totalCount}</p>
            <p>正面情感比例: ${positiveRatio.toFixed(1)}%</p>
            <p>中性情感比例: ${neutralRatio.toFixed(1)}%</p>
            <p>负面情感比例: ${negativeRatio.toFixed(1)}%</p>
        `;
        showModalChart('overview');
    } else if (boxId === 2) {
        modalBody.innerHTML = `<h3>时间维度数据统计</h3>`;
        const dimensions = ["周", "月", "年"];
        dimensions.forEach(dim => {
            modalBody.innerHTML += `<p>${getTimeStats(dim)}</p>`;
        });
        showModalChart('time');
    } else if (boxId === 3) {
        modalBody.innerHTML = `<h3>互动分析</h3>`;
        sortedByReposts.forEach(item => {
            modalBody.innerHTML += `
                <p>时间: ${item.time}<br>内容: "${item.content}"<br>转发: ${item.reposts}, 评论: ${item.comments}</p>
            `;
        });
        showModalChart('interaction');
    } else if (boxId === 4) {
        modalBody.innerHTML = `<h3>关键词分析</h3>`;
        entityArray.forEach(item => {
            modalBody.innerHTML += `<p>${item.keyword}: ${item.count} 次</p>`;
        });
        showModalChart('keywords');
    }

    document.getElementById("modal").style.display = "block";

    // 延迟调用 resize 确保图表正确渲染
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

// 展示时间维度预览数据（在左侧盒子中预览）
function displayTimeStats() {
    const dimension = document.getElementById("timeDimension").value;
    const displayText = getTimeStats(dimension === "week" ? "周" : (dimension === "month" ? "月" : "年"));
    document.getElementById("timeContent").textContent = displayText;
}

// 初始化地图
function loadMap() {
    const chart = echarts.init(document.getElementById('mapContainer'));
    chart.setOption({
        tooltip: { trigger: 'item', formatter: '{b}<br/>数据: {c}' },
        visualMap: {
            min: 0,
            max: 1500,
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
                { name: '北京', value: 500 },
                { name: '上海', value: 300 },
                { name: '广东', value: 800 }
            ]
        }]
    });
}

// 根据不同类型展示不同的柱状图
function showModalChart(type) {
    const chartDom = document.getElementById('modal-chart');
    const modalChart = echarts.init(chartDom);

    let option = {};

    if (type === 'overview') {
        option = {
            title: { text: '微博情感分布', textStyle: { color: '#00e5ff' }},
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
        // 这里用访问量(转发+评论)在三种维度下显示同一个值以示例
        let totalReposts = 0, totalComments = 0;
        weiboData.forEach(item => {
            totalReposts += item.reposts;
            totalComments += item.comments;
        });
        const total = totalReposts + totalComments;
        // 假设周=total, 月=2*total, 年=4*total（仅为演示，不是实际逻辑）
        option = {
            title: { text: '时间维度统计', textStyle: { color: '#00e5ff' }},
            tooltip: {},
            xAxis: {
                type: 'category',
                data: ['周', '月', '年'],
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
                data: [total, total*2, total*4],
                itemStyle: { color: '#00e5ff' },
                barWidth: '50%'
            }]
        };
    } else if (type === 'interaction') {
        const xData = weiboData.map(d => d.content.slice(0,6) + '...');
        const repostData = weiboData.map(d => d.reposts);
        const commentData = weiboData.map(d => d.comments);

        option = {
            title: { text: '互动分析（转发/评论）', textStyle: { color: '#00e5ff' }},
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
        const xData = entityArray.map(k => k.keyword);
        const countData = entityArray.map(k => k.count);

        option = {
            title: { text: '关键词分析', textStyle: { color: '#00e5ff' }},
            tooltip: {},
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
            series: [{
                type: 'bar',
                data: countData,
                itemStyle: { color: '#00e5ff' },
                barWidth: '50%'
            }]
        };
    }

    modalChart.setOption(option);
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
});


