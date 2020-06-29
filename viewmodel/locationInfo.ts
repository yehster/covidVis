async function queryLocationInfo(UID:number)
{
	const data =await fetch("/locationQuery/"+UID);
	return await data.json();
}

class trajectoryPoint
{
	public day : Date;
	public confirmed: number;
	public deaths : number;
	public confirmed_ma : number;
	public deaths_ma : number;
	constructor(day : Date,confirmed : number, deaths : number, confirmed_ma : number, deaths_ma : number)
	{
		this.day = day;
		this.confirmed=confirmed;
		this.deaths=deaths;
		this.confirmed_ma=confirmed_ma;
		this.deaths_ma=deaths_ma;
	}
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
		this.dbData = await queryLocationInfo(this.UID);	
	}
}

async function getLocationInfo(UID:number)
{
	let retVal=new locationInfo(UID);
	await retVal.populate();
	console.log(retVal);
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
let 	chartColors = {
		red: 'rgb(255, 99, 132)',
		orange: 'rgb(255, 159, 64)',
		yellow: 'rgb(255, 205, 86)',
		green: 'rgb(75, 192, 192)',
		blue: 'rgb(54, 162, 235)',
		purple: 'rgb(153, 102, 255)',
		grey: 'rgb(201, 203, 207)'
	};

let ctx : any;
async function draw()
{
	let info=await getLocationInfo(36); //84034021
	let results : dataSet = info.dbData as dataSet;
	let trajectory=[];
	console.log(results);
	let data=results.results[2];
	let total=results.results[0];
	let offset = total.length-data.length;
	for(let idx=0;idx<data.length;idx++)
	{
//		trajectory.push({t:new Date(data[idx].day),y:data[idx].number});
		trajectory.push({x:total[idx+offset].number,y:data[idx].number});
		console.log(trajectory[trajectory.length-1]);
	}
	console.log(trajectory)
	


	return trajectory;
}