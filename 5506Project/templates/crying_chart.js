// 根据年龄段设定哭闹次数范围
let minCryingTimes, maxCryingTimes;

if (ageInMonths <= 2) {
    minCryingTimes = 8;  // 新生儿阶段
    maxCryingTimes = 10;
} else if (ageInMonths <= 6) {
    minCryingTimes = 5;  // 婴儿阶段
    maxCryingTimes = 8;
} else {
    minCryingTimes = 2;  // 较大婴儿阶段
    maxCryingTimes = 5;
}

let barChart4_data = [];  // Newborn starts with ~3.5 kg

// Generate weight data for each day until today
for (let i = 1; base + oneDay * i <= Date.now(); i++) {
     // 生成随机哭闹次数，保证在设定的范围内
    let cryingTimes = Math.floor(Math.random() * (maxCryingTimes - minCryingTimes + 1)) + minCryingTimes;
    barChart4_data.push(cryingTimes);
}

let barChart4_option = {
    tooltip: {
        trigger: 'axis',
        show:true,
        position: [2, 2],
        renderMode:'html',
        appendTo:'tooltip1',
        formatter: (data)=>{
            const value = data[0].axisValue+":"+Math.round(data[0].value * 100) / 100+'times'
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
        name: 'times'
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
            type: 'bar',
            symbol: 'none',
            itemStyle: {
                color: 'rgb(0, 123, 255)'
            },
            data: barChart4_data
        }
    ]
};

let barChart4_chart = echarts.init(document.getElementById('barChart6'));

barChart4_chart.setOption(barChart4_option);