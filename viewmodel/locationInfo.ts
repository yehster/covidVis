async function queryLocationInfo(UID:number)
{
	const data =await fetch("/locationQuery/"+UID);
	return await data.json();
}



class locationInfo
{
	private UID :number;
	private type : string = "state";
	private displayName : string="";
	private population : number = -1;
	public dbData : object = {};
	constructor(UID : number)
	{
		this.UID=UID;

	}
	async populate()
	{
		// getData
		let dbData = await queryLocationInfo(this.UID);
		this.dbData=dbData;
		this.displayName=this.dbData.location[0].display;
		let trimPos = this.displayName.indexOf(",");
		if(trimPos>0)
		{
			this.displayName=this.displayName.substring(0,trimPos);
		}			
		this.population=this.dbData.location[0].population;
		for(let resIdx=0;resIdx<this.dbData.results.length;resIdx++)
		{
			this[dbData.tables[resIdx]]=dbData.results[resIdx];
		}
	}
	public name() : string
	{
		return this.displayName;
	}
	
	public totalCases() : number
	{
		let confirmed=this["confirmed"];
		return confirmed[confirmed.length-1];
	}
	
	public totalDeaths() : number
	{
		let deaths=this["deaths"];
		return deaths[deaths.length-1];
	}
	public trajectory()
	{
		let retVal=[];
		let offset = this.confirmed.length-this.confirmed_delta_ma.length;
		for(let idx=0;idx<this.confirmed_delta_ma.length;idx++)
		{
			retVal.push({x:this.confirmed[idx+offset].number,y:this.confirmed_delta_ma[idx].number,label:new Date(this.confirmed_delta_ma[idx].day)});
		}
		return retVal;
	}
	public getTimeSeries(name : string,population : boolean = false)
	{
		let retVal=[];
		let data = this[name];
		console.log(this);
		console.log(name);
		for(let idx=0;idx<data.length;idx++)
		{
			retVal.push({t:new Date(data[idx].day),y: population ? (data[idx].number/this.population *100000) : data[idx].number});
		}
		return retVal;
	}
	public chartSetTrajectory(color : string = "rgba(200,0,0)")
	{
		return {
            label: this.name(),
            data: this.trajectory(),
            borderWidth: 1,
			fill: false,
			borderColor : color,
			lineTension : 0
        };
	}
	public chartSetByName(name : string , color : string = "rgba(200,0,0)",population : boolean = false,hidden : boolean = false)
	{
		console.log(hidden);
		return {
            label: this.name(),
            data: this.getTimeSeries(name,population),
            borderWidth: 1,
			fill: false,
			hidden: hidden,
			borderColor : color,
			lineTension : 0
		};		
	}
}

async function getLocationInfo(UID:number)
{
	let retVal=new locationInfo(UID);
	await retVal.populate();
	return retVal;
}
interface dataPairs
{
	day : string;
	number : number;
}
interface dataSet
{
	results : Array<Array<dataPairs>>;
}
/*let 	chartColors = {
		red: 'rgb(255, 99, 132)',
		orange: 'rgb(255, 159, 64)',
		yellow: 'rgb(255, 205, 86)',
		green: 'rgb(75, 192, 192)',
		blue: 'rgb(54, 162, 235)',
		purple: 'rgb(153, 102, 255)',
		grey: 'rgb(201, 203, 207)'
	};
*/
let ctx : any;