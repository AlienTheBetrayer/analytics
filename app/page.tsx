"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export const Home = () => {
	const [data, setData] = useState<object>({});

	useEffect(() => {
		axios
			.get("/api/analytics?project=universe")
			.then((res) => setData(res.data));
	}, []);

	return (
		<main className="w-full h-full max-w-80 min-h-48 m-auto bg-background-2 rounded-xl p-2">
			<h1>{JSON.stringify(data)}</h1>
		</main>
	);
};

export default Home;
