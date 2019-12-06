
export class Config
{
	drawTimerMs:number = 12;
	fgColor:string = "#00ff00";
	bgColor:string = "#000000";
	tipColor:string="#FFFFFF";
	fontSize:number = 15;
	bgAlpha:number=0.3;
	rainbow:boolean=false;
	maxCycle:number = 100;
	yVelocity:number = 2;
	maxTrailLenght:number = 11;
	minTrailLength:number = 3;
	word:string = "";

	rainCharacters: string = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρσςτυφχψωアァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン";
	spawnChance:number = 0.05;
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
		let query = url.split("?")[1];
		if (query === undefined)
		{
			return {};
		}

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
		for (let elKey in params)
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
