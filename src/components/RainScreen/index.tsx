
import React from 'react';
import { RouteComponentProps } from "react-router-dom";
import styles from './RainScreen.module.scss';
import { setInterval } from 'timers';
import { Config } from '../../utils/config';
import RandomManager from '../../utils/random';

export interface TParam
{

}

export interface Props extends RouteComponentProps<TParam>
{
	config:Config
}

export interface State
{
	windowSize:{width:number,height:number}
}

export class Drop
{
	xPos:number = 0;
	yPos:number = 0;
	firstChar:string="";
}

export default class RainScreen extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);
		this.drawLoop = this.drawLoop.bind(this);
		this.updateDimensions = this.updateDimensions.bind(this);

		this.state =
		{
			windowSize:{height:window.innerHeight,width:window.innerWidth}
		}
	}

	canvas = React.createRef<HTMLCanvasElement>();
	timer?:any;
	rain: Drop[] = [];

	hexToRgbA(hex:string,alpha:number):string
	{
		let c:any;
		if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex))
		{
			c = hex.substring(1).split('');
			if (c.length == 3)
			{
				c = [c[0], c[0], c[1], c[1], c[2], c[2]];
			}
			c = '0x' + c.join('');
			return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + `,${alpha})`;
		}
		return `rgba(0,0,0,${alpha})`;
	}

	getRainSize() : {columns:number,rows:number}
	{
		let size = this.state.windowSize;
		let cols = Math.floor(size.width / this.props.config.fontSize) + 1;
		let colHeight = Math.floor(size.height / this.props.config.fontSize) + 1;

		return ({
			columns:cols,
			rows:colHeight
		});
	}

	drawLoop()
	{
		if (!this.canvas.current)
		{
			return;
		}
		const config = this.props.config;
		let size = this.state.windowSize;
		let ctx = this.canvas.current!.getContext("2d")!;
		const backgroundColor =  this.hexToRgbA(config.bgColor,config.bgAlpha);
		const fgColor = config.fgColor;

		ctx.fillStyle = backgroundColor;
		ctx.fillRect(0,0,size.width,size.height);

		if (this.rain.length === 0)
		{
			this.initializeDrops();
		}

		this.spawnExtraRain();

		for (let rainIndex in this.rain)
		{
			let drop = this.rain[rainIndex];
			ctx.font = config.fontSize+"px Helvetica";
			if (config.tipColor !== "")
			{
				this.drawDrop(drop.xPos, drop.yPos, config.tipColor, ctx, config.fontSize, drop.firstChar);
				//draw last drop
				ctx.fillStyle = config.bgColor;
				ctx.fillRect((drop.xPos) * config.fontSize, (drop.yPos-1) * config.fontSize, config.fontSize, config.fontSize);
				this.drawDrop(drop.xPos,drop.yPos-1, fgColor, ctx, config.fontSize);

			}
			else
			{
				this.drawDrop(drop.xPos,drop.yPos,fgColor,ctx,config.fontSize);
			}
		}

		this.incrementAllDropsAndKill();
	}

	drawDrop(xPos:number,yPos:number,color:string,ctx:CanvasRenderingContext2D,size:number,fixChar:string="")
	{
		let cha = fixChar;
		if (cha === "")
		{
			cha = this.getNextRandomRainCharacter();
		}
		ctx.fillStyle = color;
		ctx.fillText(cha, (xPos) * size, (yPos + 1) * size);
	}

	getNextRandomRainCharacter() : string
	{
		return this.props.config.rainCharacters[RandomManager.getRandomInt(0,this.props.config.rainCharacters.length-1)];
	}

	initializeDrops()
	{
		let size = this.getRainSize();
		let newRain:Drop[] = [];

		for (let colI = 0; colI < size.columns; colI++)
		{
			let drop = new Drop();
			drop.yPos = RandomManager.getRandomInt(0,size.rows);
			drop.xPos = colI;
			drop.firstChar = this.getNextRandomRainCharacter();
			newRain.push(drop);
		}

		this.rain = newRain;
	}

	incrementAllDropsAndKill()
	{
		let size = this.getRainSize();
		let nextRain:Drop[] = [];

		for (let dropIndex in this.rain)
		{
			let drop = this.rain[dropIndex];
			drop.yPos++;
			if(drop.yPos < size.columns)
			{
				nextRain.push(drop);
			}
		}
		this.rain = nextRain;
	}

	spawnExtraRain()
	{
		let size = this.getRainSize();
		let newRain: Drop[] = Array.from(this.rain);

		for (let colI = 0; colI < size.columns; colI++)
		{
			if (Math.random() <= this.props.config.spawnChance){
				let drop = new Drop();
				drop.yPos = 0;
				drop.xPos = colI;
				drop.firstChar = this.getNextRandomRainCharacter();
				newRain.push(drop);
			}
		}

		this.rain = newRain;
	}

	startDraw()
	{
		if (this.timer)
			this.stopDraw();

		this.timer = setInterval(this.drawLoop, this.props.config.drawTimerMs);
	}

	stopDraw()
	{
		if (this.timer)
			clearInterval(this.timer);
	}

	updateDimensions()
	{
		this.setState({ windowSize:{width: window.innerWidth, height: window.innerHeight} });
	}

	componentDidMount()
	{
		this.startDraw();
		window.addEventListener('resize', this.updateDimensions);
	}

	componentWillUnmount()
	{
		this.stopDraw();
		window.removeEventListener('resize', this.updateDimensions);
	}

	render()
	{
		console.log("redner rain",this.props.config);
		return (
			<div className={styles.container} style={{backgroundColor:this.props.config.bgColor}}>
				<canvas ref={this.canvas} width={this.state.windowSize.width} height={this.state.windowSize.height} />
			</div>
		);
	}
}
