import '../styles/globals.css'
import context from "../components/context";
import { useState } from 'react';
function MyApp({ Component, pageProps }) {
	const [selected, setSelected] = useState("A* Search")

	return(
		<context.Provider value={{ selected, setSelected }}>
			<Component {...pageProps} />
		</context.Provider >
	)
	
}

export default MyApp
