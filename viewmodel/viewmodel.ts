

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

function chartColor(r:number,g:number,b)
{
	return "rgba("+r+","+g+","+b+")";
}
const chartColors : Array<string> = [chartColor(57,106,177),chartColor(218,124,48),chartColor(62,150,81),chartColor(204,37,41)
	,chartColor(83,81,84),chartColor(107,76,154),chartColor(146,36,40),chartColor(148,139,61)];
class covidVisViewModel
{
	public mainDisplay : Chart;
	public mainDisplay2 : Chart;
	public mainContext : CanvasRenderingContext2D;
	public mainContext2 : CanvasRenderingContext2D;
	constructor (mainContext : CanvasRenderingContext2D,context2: CanvasRenderingContext2D)
	{
		this.mainContext = mainContext;
		this.mainContext2=context2;
	}
	
	public async display(UID : number)
	{
		
	let info  = await getLocationInfo(UID)
	let results : dataSet = info.dbData as dataSet;
	this.mainDisplay = new Chart(this.mainContext, {
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
	}
			
		);
		
	this.mainDisplay2 = new Chart(this.mainContext2, {
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
	}
			
		);
	//this.mainDisplay.update();
	}
	
	public async addLocation(UID : number)
	{
		let color = chartColors[this.mainDisplay2.data.datasets.length % chartColors.length];
		let info  = await getLocationInfo(UID);
		this.mainDisplay2.data.datasets.push(info.chartSetByName("confirmed_delta_ma",color,true));

		this.mainDisplay.data.datasets.push(info.chartSetTrajectory(color));
	}
}

