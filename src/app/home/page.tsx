"use client";

const HomePage = () => {
	return (
		<main className="relative w-full min-h-screen flex flex-col justify-center items-center">
			<div className="flex flex-col gap-8 text-center max-w-3xl">
				<h2>Reimagination of what I had been doing</h2>

				<div className="flex flex-col gap-4">
					<p>
						This{" "}
						<mark>
							<b>full-stack</b>
						</mark>{" "}
						application reimagines conventional architectures through a strictly
						typed{" "}
						<mark>
							<b>state</b>
						</mark>{" "}
						layer and controlled{" "}
						<mark>
							<b>data</b>
						</mark>{" "}
						flow, designed to be predictable, efficient, and free from
						unnecessary rendering.
					</p>
					<p>
						A custom{" "}
						<mark>
							<b>TypeScript</b>
						</mark>
						-based state system works alongside a purpose-built{" "}
						<mark>
							<b>API</b>
						</mark>{" "}
						and{" "}
						<mark>
							<b>Zustand</b>
						</mark>{" "}
						to deliver a fast, consistent frontend, prioritizing performance,
						clarity, and long-term scalability.
					</p>
				</div>
			</div>
		</main>
	);
};

export default HomePage;
