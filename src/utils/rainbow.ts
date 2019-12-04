abstract class RainbowManager
{

	public static getRainbowMatrix(differ:number, width: number, height: number) :string[][]
	{
		let matrix: string[][] = [];
		for (let row = 0; row < height; row++)
		{
			matrix.push([]);
			for (var col = 0; col < width; col++)
			{
				/*
				var red = Math.floor(255-(255*(col/width +differ)));
				var grn = Math.floor(255-(255*(row/height -differ)));
				var blu = Math.floor((col / width)*255);*/

				matrix[matrix.length - 1].push(this.getColorsByDiffer((Math.sin((differ+(col/width)) *(differ+(row/height))*2*Math.PI)+1)/2,0));
			}
		}
		return matrix;
	}

	private static getColorsByDiffer(time:number,offset:number) : string
	{
		let red = 255 * ((1 - time));
		let grn = 255 * ((1 - time));
		let blu = 255 * (time);
		return `rgba(${red},${grn},${blu})`;
	}
}

export default RainbowManager;
