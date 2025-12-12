import axios from "axios";

export const Home = async () => {
	const res = await axios.get("http://localhost:3000/api/analytics");

	return (
		<main className="w-full h-full max-w-80 min-h-48 m-auto bg-background-2 rounded-xl p-2">
			<h1>{JSON.stringify(res.data)}</h1>
		</main>
	);
};

export default Home;
