/*使用factory封装highchart中部分可视化图谱*/
var highcharts = angular.module("highcharts", []);
/*heatmap图谱*/
highcharts.factory('highchart', function(){
    return {
        heatmap: function(container,data){
        	/*highchart绘图方法*/
            container.highcharts({
		        chart: {
		            type: 'heatmap',
		            marginTop: 40,
		            marginBottom: 80
		        },

		        title: {
		            text: data.title
		        },

		        xAxis: {
		            categories: data.xAxis.data,
		            title: function () {
		            	if (xAxis.title) {
		            		return data.xAxis.title;
		            	} else{
		            		return null;
		            	};
		            }
		        },

		        yAxis: {
		            categories: data.yAxis.data,
		            title: function () {
		            	if (yAxis.title) {
		            		return data.yAxis.title;
		            	} else{
		            		return null;
		            	};
		            }
		        },

		        colorAxis: {
		            min: 0,
		            minColor: '#FFFFFF',
		            maxColor: Highcharts.getOptions().colors[0]
		        },

		        legend: {
		            align: 'right',
		            layout: 'vertical',
		            margin: 0,
		            verticalAlign: 'top',
		            y: 25,
		            symbolHeight: 280
		        },

		        tooltip: {
		            formatter: function () {
		                return '<b>' + this.series.xAxis.categories[this.point.x] + '</b> sold <br><b>' +
		                    this.point.value + '</b> items on <br><b>' + this.series.yAxis.categories[this.point.y] + '</b>';
		            }
		        },

		        series: [{
		            name: data.series.name,
		            borderWidth: 1,
		            data: data.series.data,
		            dataLabels: {
		                enabled: true,
		                color: '#000000'
		            }
		        }]

		    });
        },
        /*barline: function(container,data){
            ....
        },
        bubble: function(container,data){
            ....
        }  */ 
    }               
});