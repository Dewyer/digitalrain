
abstract class RandomManager
{

	public static getRandomInt(min: number = 0, max: number = 1): number
	{
		return Math.floor(Math.random() * max) + min;
	}
}

export default RandomManager;
