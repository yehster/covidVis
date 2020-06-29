

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
class covidVisViewModel
{
	public mainDisplay : Chart;
	public mainContext : CanvasRenderingContext2D;
	constructor (mainContext : CanvasRenderingContext2D)
	{
		this.mainContext = mainContext;
	}
	
	public async display(UID : number)
	{
		
	let info  = await getLocationInfo(UID)
	let results : dataSet = info.dbData as dataSet;
	let trajectory=[];
	console.log(results);
	let data=results.results[2];
	let total=results.results[0];
	let offset = total.length-data.length;
	for(let idx=0;idx<data.length;idx++)
	{
//		trajectory.push({t:new Date(data[idx].day),y:data[idx].number});
		trajectory.push({x:total[idx+offset].number,y:data[idx].number,label:new Date(data[idx].day)});
		console.log(trajectory[trajectory.length-1]);
	}
		this.mainDisplay = new Chart(this.mainContext, {
    type: 'line',
    data: {
        datasets: [{
            label: 'New Cases',
            data: trajectory,
            borderWidth: 1,
			fill: false,
			borderColor : "rgba(200,0,0)",
			lineTension : 0
        }]
    },
    options: {
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
	//this.mainDisplay.update();
	}
	
}

