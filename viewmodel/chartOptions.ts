

class chartOptions
{
	public type : string;
	public data : object;
	public options: object;
	constructor(chartType : string,yLabel : string)
	{
		this.type=chartType;
		this.data = {datasets:[]};
		this.options = {
			responsive: true,
			scales: {
				xAxes: [{
		type: 'time',
			display: true,
			ticks: {
			    beginAtZero: true
			},
			scaleLabel: {
			    display: true,
			    labelString: 'Date'
			}
			}],
			yAxes: [{
			    type: 'linear',
			    ticks: {
					beginAtZero: true
				}
					,scaleLabel: {
					display: true,
					labelString: yLabel
				}
			}]
		}
		};
	}
}