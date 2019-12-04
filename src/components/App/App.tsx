import React from 'react';
import
{
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from "react-router-dom";
import './App.css';
import RainScreen from '../RainScreen';
import ConfigManager from '../../utils/config';

const App: React.FC = () =>
{
	const config = ConfigManager.getConfigFromUrlParams(window.location.href);
	return (
		<Router>
			<Switch>
				<Route exact path="/:color/:background" component={(props: any) => <RainScreen {...props} config={config}/>}/>
			</Switch>
		</Router >
	);
}

export default App;
