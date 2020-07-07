async function getStateWithCounties(state)
{
	const res=await fetch("/populousInState/"+state+"/5");
	const data = await res.json(); 
	//await vm.addLocation(state);
	
	for(let idx=0;idx<data.length;idx++)
	{
		let county=data[idx];
		console.log(county);
		await vm.addLocation(county.UID);
	}
	console.log(data);
	
}

function heatToClass(heat)
{
	console.log(heat);
	if(heat <-0.5)
	{
		return "mapStatusNegative2"
	}
	if(heat <-0.05)
	{
		return "mapStatusNegative1"
	}
	if(heat <0.05)
	{
		return "mapStatusNeutral"
	}
	if(heat <=0.50)
	{
		return "mapStatusPositive1"
	}
	return "mapStatusPositive2";
}
async function highlightCountyMap()
{
	const res = await fetch("/countyheat/");
	const data = await res.json();
	const current = data[0]
	for(let idx=0;idx<current.length;idx++)
	{
		let curItem=current[idx];
		let location=curItem.location;
		if((location>=84000000) && (location < 84060000))
		{
			let locationString = location.toString();
			let classId="c"+locationString.substring(3);
			console.log(classId);
			let mapObservable=	dc.countyClass[classId];
			mapObservable(heatToClass(curItem.number));
		
			
		}
	}
}
function rateToClass(rate)
{
	if(rate<=1)
	{
		return "mapStatusNegative2";
	}
	if(rate<=3)
	{
		return "mapStatusNegative1";
	}
	if(rate<=10)
	{
		return "mapStatusNeutral";
	}
	if(rate<=25)
	{
		return "mapStatusPositive1";
	}
	return "mapStatusPositive2";
}
async function highlightCountyRates(day=null)
{
	let res;
	if(day===null)
	{
		res = await fetch("/countyrates/");
	}
	else
	{
		res = await fetch("/countyrates/"+ day);
	}

	const data = await res.json();
	console.log(data);
	const current = data
	for(let idx=0;idx<current.length;idx++)
	{
		let curItem=current[idx];
		let location=curItem.location;
		if((location>=84000000) && (location < 84060000))
		{
			let locationString = location.toString();
			let classId="c"+locationString.substring(3);
			let mapObservable=	dc.countyClass[classId];
			mapObservable(rateToClass(curItem.number));
		
			
		}
	}
}

async function highlightMap()
{
	const res = await fetch("/stateheat/");
	const data = await res.json();
	const current = data[0]
	for(let idx=0;idx<current.length;idx++)
	{
		let curItem=current[idx];
		console.log(curItem)
		let mapObservable=	dc.stateClass[curItem.location];
		console.log(curItem.day)
		console.log(heatToClass(curItem.number)+":"+curItem.number);
		mapObservable(heatToClass(curItem.number));
	}
}

async function cycleRates(date)
{
	let curDate;
	if(date===null)
	{
		curDate = new Date();
		curDate.setMonth(3);
		curDate.setDate(1);
		
	}
	else
	{
		curDate = date;
	}
	let endDate = new Date();
	endDate.setDate(4);
	console.log(curDate);
	let dateString = "2020-"+(curDate.getMonth() +1) + "-"+curDate.getDate();
	await highlightCountyRates(dateString);
	
	if(curDate<endDate)
	{
		curDate = new Date(curDate.valueOf() + (24 * 3600000));
		console.log(dateString);
		setTimeout(()=>{cycleRates(curDate)},100);
		//alert(curDate);
	}
	
	
}