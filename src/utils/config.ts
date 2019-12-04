
export class Config
{
	drawTimerMs:number = 100;
	fgColor:string = "#00ff00";
	bgColor:string = "#000000";
	fontSize:number = 30;
}

abstract class ConfigManager
{

	public static getDefaultConfig() : Config
	{
		let conf = new Config();
		return conf;
	}

	private static getObjectFromUrl(url:string) : any
	{
		let query = url.substr(1);
		let result:any = {};
		query.split("&").forEach(function (part)
		{
			var item = part.split("=");
			result[item[0]] = decodeURIComponent(item[1]);
		});
		return result;
	}

	public static getConfigFromUrlParams(url:string):Config
	{
		let params = this.getObjectFromUrl(url);
		let conf:any = new Config();
		let confKeys = Object.keys(conf);
		for (let elKey in Object.keys(params))
		{
			if (confKeys.includes(elKey))
			{
				conf[elKey] = params[elKey];
			}
		}

		return conf as Config;
	}
}

export default ConfigManager;
