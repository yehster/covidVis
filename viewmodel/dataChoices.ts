
class dataChoices
{
	public states;
	public selectedState;
	public charts
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
	}
	
	async getNewState(newState : number)
	{
		vm.clearData();
		await getStateWithCounties(newState.UID);

		vm.updateAll();
	}
}