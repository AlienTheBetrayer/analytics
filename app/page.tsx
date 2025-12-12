import { supabaseServer } from "@/server/supabase";

export const Home = async () => {
	const { data, error } = await supabaseServer.from("analytics").select("*");

	return (
		<main className="w-full h-full max-w-80 min-h-48 m-auto bg-background-2 rounded-xl p-2">
			<h1>{JSON.stringify(data)}</h1>
			<h1>{JSON.stringify(error)}</h1>
		</main>
	);
};

export default Home;
