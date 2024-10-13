let barChart2_datas= []
let ageInMonths = 1;  // 设置年龄（0-2个月为1，2-12个月为2）

// 根据年龄设置初始睡眠时长和波动范围
let initialSleepHours;
let decreaseRate;
let minHours, maxHours;

if (ageInMonths <= 2) {
    // 新生儿（0-2个月）
    initialSleepHours = 16;  // 初始睡眠时长
    minHours = 14;            // 最低睡眠时长
    maxHours = 17;            // 最高睡眠时长
    decreaseRate = 0.0;       // 新生儿每天不减少
} else {
    // 婴儿（2-12个月）
    initialSleepHours = 14;  // 初始睡眠时长
    minHours = 12;           // 最低睡眠时长
    maxHours = 16;           // 最高睡眠时长
    decreaseRate = 0.1;      // 每天减少 6 分钟（0.1小时）
}

barChart2_datas.push(initialSleepHours);

for (let i = 1; base + oneDay * i <= Date.now(); i++) {
       // 计算睡眠时长，整体递减，但每天会有波动
    let dailyVariation = (Math.random() - 0.5) * 0.5;  // 波动范围为 ±0.5小时
    let newSleepHours = Math.max(barChart2_datas[i - 1] - decreaseRate + dailyVariation, minHours);  // 确保睡眠时长不小于最低值
    // 限制最大睡眠时长
    newSleepHours = Math.min(newSleepHours, maxHours);

    barChart2_datas.push(newSleepHours);
}

let options = {
    tooltip: {
        trigger: 'axis',
        show:true,
        position: [2, 2],
        formatter: (data)=>{
            const value = data[0].axisValue+":"+Math.round(data[0].value * 100) / 100+'h'
            return `
                <div style="width:120px;height:20px">${value}</div>
            `;
          return 
        }        
    },
    grid: {
        left: '13%',  // Adjust space on the left
        right: '10%', // Adjust space on the right
        top: '20%',   // Adjust space at the top (below title)
        bottom: '25%' // Adjust space for the dataZoom slider
    },
    xAxis: {
        type: 'category',
        boundaryGap: false,
        data: date
    },
    yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
        name: 'Hours (h)',
        min: 0,  // Ensure minimum value is 0
        max: 20  // Adjust max value if needed
    },
    dataZoom: [
        {
            type: 'inside',
            start: 90,
            end: 100
        },
        {
            type: 'slider',
            height: 8,  // Adjusted height for a thin-line effect
            bottom: 10, // Position closer to the bottom
            handleSize: '60%',  // Size of the slider handle
            start: 90,
            end: 100,
            tooltip: { show: false }
        }
    ],
    series: [
        {
            type: 'line',
            symbol: 'none',
            itemStyle: {
                color: 'rgb(0, 123, 255)'
            },
            data: barChart2_datas
        }
    ]
};

let barChart2 = echarts.init(document.getElementById('barChart2'));

barChart2.setOption(options);