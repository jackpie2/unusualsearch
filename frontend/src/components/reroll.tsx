"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

export default function Reroll() {
	const router = useRouter();

	const handleClick = () => {
		router.refresh();
	};

	return (
		<Button onClick={handleClick} className="flex-1">
			Reroll
		</Button>
	);
}
