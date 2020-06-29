import express from "express";
import cors from "cors";
import helmet from "helmet";
import * as fs from 'fs';
import * as covidDB from "../covid19/covidDB";


const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());


const resource_path : string  = "C:/Users/Kevin/eclipse-workspace/covidVis/";
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


async function setupController(req : express.Request,res :express.Response)
{
	res.set({'Content-Type': 'text/html'});	
	res.write("<script type=\"text/javascript\">");
	await sendScripts(req,res);
	res.write("</script>");
	await sendTemplates(req,res);
	await streamToResponse(resource_path + "resources/body.htm",res);
	res.status(200).send();
};

async function getTrajectory(req : express.Request, res:express.Response)
{
	let data = await covidDB.get_trajectory(84036061);
	console.log(data);
}
app.all("/trajectory", (req,res) => {getTrajectory(req,res)});

app.all("/controller",(req,res)=>{  setupController(req,res)});

async function locationQuery(req : express.Request, res:express.Response)
{
	const UID : number = parseInt(req.params.UID);
	
	let results = await covidDB.get_location_info(UID);
	
	res.json(results);
}

app.all("/locationQuery/:UID",(req,res) => {locationQuery(req,res);});

const server = app.listen(8080,()=> { console.log("Listening on 8080");});
