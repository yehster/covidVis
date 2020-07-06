
class dataChoices
{
	public states;
	public selectedState;
	public charts;
	public stateClass;
	public countyClass;
	constructor (charts)
	{
		this.charts = charts;
	}
	setupCounties()
	{
		this.countyClass={};
		for(let idx=0;idx<county_ids.length;idx++)
		{
			this.countyClass[county_ids[idx]]=new ko.observable();
		}
	}
	async populate()
	{
		let res=await fetch("/stateCodes/");
		this.states = await res.json();
		this.selectedState= new ko.observable(this.states[3]);
		this.selectedState.subscribe(this.getNewState);
		this.stateClass={};
		for(let idx=0;idx<this.states.length;idx++)
		{
			this.stateClass[this.states[idx].UID]=new ko.observable("state");
		}
		this.setupCounties();
	}
	
	async getNewState(newState)
	{
		vm.clearData();
		await getStateWithCounties(newState.UID);

		vm.updateAll();
	}
	chooseStateByCode(code : number)
	{
		for(let idx=0;idx<this.states.length;idx++)
		{
			if (this.states[idx].UID===code)
			{
				this.selectedState(this.states[idx]);
			}
		}
	}
}