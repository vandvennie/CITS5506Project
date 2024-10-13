let base = +new Date(new Date().getFullYear(), 0, 1); // January 1 of this year
let oneDay = 24 * 3600 * 1000;
let date = [];
let data = [3.5];  // Newborn starts with ~3.5 kg

// Generate weight data for each day until today
for (let i = 1; base + oneDay * i <= Date.now(); i++) {
    let now = new Date(base + oneDay * i);
    date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));

    // Weight gain trend with small daily fluctuations
    let dailyGain = 0.025 + (Math.random() - 0.5) * 0.01;  // ~25-30 grams/day on average
    let newWeight = Math.min(data[i - 1] + dailyGain, 12);  // Upper limit for realism

    data.push(newWeight);
}

let option = {
    tooltip: {
        trigger: 'axis',
        show:true,
        position: [2, 2],
        formatter: (data)=>{
            const value = data[0].axisValue+":"+Math.round(data[0].value * 100) / 100+'kg'
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
        name: 'Weight (kg)'
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
            name: 'Weight',
            type: 'line',
            symbol: 'none',
            sampling: 'lttb',
            itemStyle: {
                color: 'rgb(0, 123, 255)'
            },
            data: data
        }
    ]
};

let chart = echarts.init(document.getElementById('barChart1'));

chart.setOption(option);