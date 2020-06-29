

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
	
	constructor (newCasesByPopulation: CanvasRenderingContext2D, newCases : CanvasRenderingContext2D, deaths : CanvasRenderingContext2D,deathsByPop : CanvasRenderingContext2D,trajectory: CanvasRenderingContext2D,trajectoryTime: CanvasRenderingContext2D)
	{
		this.newCasesByPopulation = new Chart(newCasesByPopulation,new chartOptions("line","New Cases/100,000 Population"));
		this.newCases = new Chart(newCases,new chartOptions("line","New Cases"));

		console.log(this.newCases);
		this.newDeaths = new Chart(deaths,new chartOptions("line","Deaths"));
		this.deathsByPop = new Chart(deathsByPop,new chartOptions("line","Deaths/100,000 Population"));
		this.trajectory = new Chart(trajectory, trajectoryOptions);
		
		this.trajectoryTime= new Chart(trajectoryTime, new chartOptions("line","New Cases"));
		this.trajectoryTime.options.scales.yAxes[0].type="logarithmic";
		
	}
	
	public async addLocation(UID : number)
	{
		let color = chartColors[this.newCasesByPopulation.data.datasets.length % chartColors.length];
		let info  = await getLocationInfo(UID);
		this.newCases.data.datasets.push(info.chartSetByName("confirmed_delta_ma",color,false));
		this.newCasesByPopulation.data.datasets.push(info.chartSetByName("confirmed_delta_ma",color,true));

		this.newDeaths.data.datasets.push(info.chartSetByName("deaths_delta_ma",color,false));
		this.deathsByPop.data.datasets.push(info.chartSetByName("deaths_delta_ma",color,true));

		this.trajectory.data.datasets.push(info.chartSetTrajectory(color));
		this.trajectoryTime.data.datasets.push(info.chartSetByName("confirmed_delta_ma",color,false));

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
