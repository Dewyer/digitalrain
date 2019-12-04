
import React from 'react';
import { RouteComponentProps } from "react-router-dom";
import styles from './RainScreen.module.scss';
import { setInterval } from 'timers';
import { Config } from '../../utils/config';

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


export default class RainScreen extends React.Component<Props, State>
{
	constructor(props: Props)
	{
		super(props);
		this.drawLoop = this.drawLoop.bind(this);

		this.state =
		{
			windowSize:{height:window.innerHeight,width:window.innerWidth}
		}
	}

	canvas = React.createRef<HTMLCanvasElement>();
	timer?:any;

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

	drawLoop()
	{
		console.log("Draw loop");
		if (!this.canvas.current)
		{
			return;
		}
		const config = this.props.config;
		let size = this.state.windowSize;
		let ctx = this.canvas.current!.getContext("2d")!;
		const backgroundColor =  this.hexToRgbA(config.bgColor,0.4);
		const fgColor = config.fgColor;
		ctx.fillStyle = backgroundColor;
		ctx.fillRect(0,0,size.width,size.height);

		let cols = Math.floor(size.width/config.fontSize)+1;
		for (let colI = 0; colI < cols;colI++)
		{
			let posX = colI*30;
			ctx.fillStyle = fgColor;
			ctx.font = config.fontSize+"px Arial";
			ctx.fillText("A", 200, config.fontSize);
		}

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

	componentDidMount()
	{
		this.startDraw();
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
