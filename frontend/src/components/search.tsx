"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeftRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Search({
	query,
	currentMode,
}: {
	query: string;
	currentMode: string;
}) {
	const [search, setSearch] = useState(query ?? "");
	const [mode, setMode] = useState(currentMode ?? "tfidf");
	const router = useRouter();

	return (
		<div className="flex gap-2 flex-col">
			<div className="flex gap-2">
				<Input
					placeholder="Search for an article..."
					value={search}
					onChange={(e) => {
						setSearch(e.target.value);
						router.prefetch(
							!search || search.length === 0
								? `/`
								: `/?q=${search}` +
										`${mode ? `&mode=${mode}` : ""}`
						);
					}}
					name="q"
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							router.push(
								!search || search.length === 0
									? `/`
									: `/?q=${search}` +
											`${mode ? `&mode=${mode}` : ""}`
							);
						}
					}}
				/>
				<Button
					onClick={() =>
						setMode(mode === "tfidf" ? "openai" : "tfidf")
					}
					variant={"outline"}
					className="max-w-[110px] w-full items-center justify-center gap-2 hidden sm:flex"
				>
					{mode === "tfidf" ? "TFIDF" : "OpenAI"}
					<ArrowLeftRight size={16} />
				</Button>
				<Button
					onClick={() =>
						router.push(
							!search || search.length === 0
								? `/`
								: `/?q=${search}${mode ? `&mode=${mode}` : ""}`
						)
					}
					className="hidden sm:flex"
				>
					Search
				</Button>
			</div>
			<div className="flex gap-2 items-center sm:hidden">
				<Button
					onClick={() =>
						setMode(mode === "tfidf" ? "openai" : "tfidf")
					}
					variant={"outline"}
					className="flex-1 items-center justify-center gap-2 sm:hidden"
				>
					{mode === "tfidf" ? "TFIDF" : "OpenAI"}
					<ArrowLeftRight size={16} />
				</Button>
				<Button
					onClick={() =>
						router.push(
							!search || search.length === 0
								? `/`
								: `/?q=${search}${mode ? `&mode=${mode}` : ""}`
						)
					}
					className="sm:hidden flex-1"
				>
					Search
				</Button>
			</div>
		</div>
	);
}
