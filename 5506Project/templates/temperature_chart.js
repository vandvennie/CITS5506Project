// 设定温度范围
const minTemperature = 36.0;  // 最低温度
const maxTemperature = 38.0;  // 最高温度
const initialTemperature = 37.0;  // 初始温度

let barChart3_data = [37.0];  // Newborn starts with ~3.5 kg

// Generate weight data for each day until today
for (let i = 1; base + oneDay * i <= Date.now(); i++) {
     // 计算温度，整体保持在范围内并加入波动
     let dailyVariation = (Math.random() - 0.5) * 0.5;  // 波动范围为 ±0.5°C
     let newTemperature = barChart3_data[i - 1] + dailyVariation;
 
     // 确保温度值在设定的最小和最大范围内
     newTemperature = Math.max(minTemperature, Math.min(maxTemperature, newTemperature));
 
     barChart3_data.push(newTemperature);
}

let barChart3_option = {
    tooltip: {
        trigger: 'axis',
        show:true,
        position: [2, 2],
        renderMode:'html',
        appendTo:'tooltip1',
        formatter: (data)=>{
            const value = data[0].axisValue+":"+Math.round(data[0].value * 100) / 100+'°C'
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
        name: '°C'
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
            data: barChart3_data
        }
    ]
};

let barChart3_chart = echarts.init(document.getElementById('barChart3'));

barChart3_chart.setOption(barChart3_option);