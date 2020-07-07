import express from "express";
import cors from "cors";
import helmet from "helmet";
import * as fs from 'fs';
import * as covidDB from "../covid19/covidDB";


const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());


const resource_path : string  = "./";
app.all("/html/:file",(req,res)=>
{
	res.set({'Content-Type': 'text/html'});
	const filePath : string = resource_path+ "html/"+ req.params.file; 
	fs.createReadStream(filePath).on("data",(data)=>{res.write(data);})
								.on("end",()=>{res.status(200).send();});
});

function streamToResponse(filename : string ,res : express.Response)
{
	return new Promise((resolve,reject)=>
	{
		fs.createReadStream(filename).on("data",(data)=>{res.write(data);})
									.on("end",()=>{resolve();});
	});
}
async function streamDirectory(dirPath : string,res : express.Response)
{
	const fileEntries = fs.readdirSync(dirPath);
	for(let fileIdx=0;fileIdx<fileEntries.length;fileIdx++)
	{
		await streamToResponse(dirPath + fileEntries[fileIdx],res);		
	}
}
async function sendScripts(req : express.Request,res : express.Response)
{
	await streamDirectory(resource_path + "external/",res);
	await streamDirectory(resource_path + "built/",res);
	
}

async function sendTemplates(req : express.Request, res : express.Response)
{
	const path = resource_path+"knockoutTemplates/";
	const templateEntries = fs.readdirSync(path);
	for(let fileIdx=0;fileIdx<templateEntries.length;fileIdx++)
	{
		let filename=templateEntries[fileIdx]
		let extensionPosition = filename.lastIndexOf(".htm");
		if(extensionPosition>0)
		{
			let templateName = filename.substring(0,extensionPosition);
			res.write("<script type=\"text/html\" id=\""+templateName+"\">\n");
			await streamToResponse(path + filename,res); 
			res.write("</script>\n"); 

		}
	}
}

async function sendCSS(req : express.Request,res : express.Response)
{
	await streamDirectory(resource_path + "css/",res);
}

async function setupController(req : express.Request,res :express.Response)
{
	res.set({'Content-Type': 'text/html'});
	res.write('<style>');
		await sendCSS(req,res);
	res.write('</style>');	
	res.write("<script type=\"text/javascript\">");
		await sendScripts(req,res);
	res.write("</script>");
	
	await sendTemplates(req,res);
	await streamToResponse(resource_path + "resources/body.htm",res);
	res.status(200).send();
};


app.all("/controller",(req,res)=>{  setupController(req,res)});

async function locationQuery(req : express.Request, res:express.Response)
{
	const UID : number = parseInt(req.params.UID);
	
	let results = await covidDB.get_location_info(UID);
	
	res.json(results);
}

app.all("/locationQuery/:UID",(req,res) => {locationQuery(req,res);});

async function popluousQuery(UID: number, count : number, req : express.Request, res:express.Response)
{
	
	let results = await covidDB.get_populous_counties(UID,count);
	
	res.json(results);
	
} 
app.all("/populousInState/:UID/:count",(req,res) => {
	const UID : number = parseInt(req.params.UID);
	const count : number = parseInt(req.params.count);

	popluousQuery(UID,count,req,res);
});

async function getStateCodes(req : express.Request,res :express.Response){
	let states = await covidDB.get_states();
	res.json(states);
}
app.all("/stateCodes/",(req,res)=>{getStateCodes(req,res)
	
});

app.all("/populousInState/:UID",(req,res) => {
	const UID : number = parseInt(req.params.UID);

	popluousQuery(UID,5,req,res);
});


async function get_state_heat(req : express.Request, res:express.Response)
{
//	let data = await covidDB.get_state_event_pct_changes("confirmed_states_delta_ma_7_pct_change_7",7)
	let data = await covidDB.get_state_event_pct_changes("confirmed_states_delta_ma_14_pct_change_14",14)
	console.log(data);
	res.json(data);
}
app.all("/stateheat/",(req,res) => {get_state_heat(req,res)});


async function get_county_heat(req : express.Request, res:express.Response)
{
	let data = await covidDB.get_state_event_pct_changes("confirmed_delta_ma_14_pct_change_14",14)
	console.log(data);
	res.json(data);
}
app.all("/countyheat/",(req,res) => {get_county_heat(req,res)});

async function get_counties_case_rates(req : express.Request, res: express.Response)
{
	let data = await covidDB.get_county_case_rates();
	res.json(data);
}
async function get_counties_case_rates_day(req : express.Request, res: express.Response)
{
	let date = req.params.day;
	let data = await covidDB.get_count_case_rates_day(date);
	res.json(data);
}

app.all("/countyrates/",get_counties_case_rates);

app.all("/countyrates/:day",get_counties_case_rates_day);



const server = app.listen(8080,()=> { console.log("Listening on 8080");});
