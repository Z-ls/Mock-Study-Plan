import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppRoute } from './components/Views';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route
					path='/'
					element={<AppRoute />}
				/>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
