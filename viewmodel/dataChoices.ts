
class dataChoices
{
	public states;
	public selectedState;
	public charts;
	public stateClass;
	constructor (charts)
	{
		this.charts = charts;
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
	}
	
	async getNewState(newState : number)
	{
		vm.clearData();
		await getStateWithCounties(newState.UID);

		vm.updateAll();
	}
}