

const baseOptions = {
	scales: {
	xAxes: [{
		type: 'logarithmic',
	    display: true,
	    ticks: {
	        beginAtZero: true
	    },
	    scaleLabel: {
	        display: true,
	        labelString: 'Total Cases'
	    }
	}],
	yAxes: [{
	    type: 'logarithmic',
	    ticks: {
			beginAtZero: true
		}
			,scaleLabel: {
			display: true,
			labelString: 'New Cases'
		}
	}]
	}
}
Chart.defaults.global.animation.duration=0;
let trajectoryOptions = {
    type: 'line',
    data: {
        datasets: []
    },
    options: {
	responsive: true,
	scales: {
	xAxes: [{
		type: 'logarithmic',
	    display: true,
	    ticks: {
	        beginAtZero: true
	    },
	    scaleLabel: {
	        display: true,
	        labelString: 'Total Cases'
	    }
	}],
	yAxes: [{
	    type: 'logarithmic',
	    ticks: {
			beginAtZero: true
		}
			,scaleLabel: {
			display: true,
			labelString: 'New Cases'
		}
	}]
	}
    }
};
let eventChartOptions = {
    type: 'line',
    data: {
        datasets: [
            //info.chartSetByName("confirmed_delta_ma",chartColors[0],true)
		]
    },
    options: {
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
			labelString: 'New Cases/100,000 Population'
		}
	}]
	}
    }
};
function chartColor(r:number,g:number,b)
{
	return "rgba("+r+","+g+","+b+")";
}
const chartColors : Array<string> = [chartColor(57,106,177),chartColor(218,124,48),chartColor(62,150,81),chartColor(204,37,41)
	,chartColor(83,81,84),chartColor(107,76,154),chartColor(146,36,40),chartColor(148,139,61)];
class covidVisViewModel
{
	public newCases : Chart;
	public newCasesByPopulation : Chart;
	public newDeaths : Chart;
	public deathsByPop : Chart;
	public trajectory: Chart;
	public trajectoryTime : Chart;
	
	public allCharts : Array<Chart>;
	constructor (newCasesByPopulation: CanvasRenderingContext2D, newCases : CanvasRenderingContext2D, deaths : CanvasRenderingContext2D,deathsByPop : CanvasRenderingContext2D,trajectory: CanvasRenderingContext2D,trajectoryTime: CanvasRenderingContext2D)
	{
		this.allCharts = new Array<Chart>();
		this.newCasesByPopulation = new Chart(newCasesByPopulation,new chartOptions("line","New Cases/100,000 Population"));
		this.allCharts.push(this.newCasesByPopulation);
		
		this.newCases = new Chart(newCases,new chartOptions("line","New Cases"));
		this.allCharts.push(this.newCases);

		this.newDeaths = new Chart(deaths,new chartOptions("line","Deaths"));
		this.allCharts.push(this.newDeaths);
		
		this.deathsByPop = new Chart(deathsByPop,new chartOptions("line","Deaths/100,000 Population"));
		this.allCharts.push(this.deathsByPop);


		this.trajectory = new Chart(trajectory, trajectoryOptions);
		this.allCharts.push(this.trajectory);
		
		this.trajectoryTime= new Chart(trajectoryTime, new chartOptions("line","New Cases"));
		this.trajectoryTime.options.scales.yAxes[0].type="logarithmic";
		this.allCharts.push(this.trajectoryTime);
		
	}
	
	public async addLocation(UID : number,hidden : boolean = false)
	{
		let color = chartColors[this.newCasesByPopulation.data.datasets.length % chartColors.length];
		let info  = await getLocationInfo(UID);
		this.newCases.data.datasets.push(info.chartSetByName("confirmed_delta_ma",color,false,hidden));
		this.newCasesByPopulation.data.datasets.push(info.chartSetByName("confirmed_delta_ma",color,true,hidden));

		this.newDeaths.data.datasets.push(info.chartSetByName("deaths_delta_ma",color,false,hidden));
		this.deathsByPop.data.datasets.push(info.chartSetByName("deaths_delta_ma",color,true,hidden));

		this.trajectory.data.datasets.push(info.chartSetTrajectory(color));
		this.trajectoryTime.data.datasets.push(info.chartSetByName("confirmed_delta_ma",color,false,hidden));

	}
	public clearData()
	{
		for(let idx=0;idx<this.allCharts.length;idx++)
		{
			this.allCharts[idx].data.datasets=[];
		}
	}
	
	public updateAll(){
		this.newCasesByPopulation.update();	
		this.newCases.update();	
		this.newDeaths.update();
		this.deathsByPop.update();
		this.trajectory.update();	
		this.trajectoryTime.update();
	}
}
