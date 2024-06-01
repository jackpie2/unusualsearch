import Article, { ArticleSkeleton } from "@/components/article";
import Reroll from "@/components/reroll";
import { Button } from "@/components/ui/button";
import { ArticleType } from "@/lib/types";
import Link from "next/link";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const runtime = "edge";

async function RandomArticle() {
	const response = await fetch(`https://api.unusualsearch.org/random`, {
		cache: "no-store",
	});
	let result: ArticleType;

	if (response.ok) {
		result = (await response.json()) as ArticleType;

		if (!result) {
			return <p>No results found</p>;
		}
	} else {
		return <p>No results found</p>;
	}

	return <Article article={result} />;
}

export default async function Page() {
	const random = Math.random();

	return (
		<main className="flex min-h-screen flex-col items-center justify-center p-2 py-12 md:py-24">
			<div className="max-w-2xl w-full p-2">
				<div className="flex flex-col gap-4">
					<h1 className="text-xl font-semibold">
						Your random article
					</h1>
					<Suspense fallback={<ArticleSkeleton />} key={random}>
						<RandomArticle />
					</Suspense>
					<div className="flex flex-col md:flex-row gap-2">
						<Reroll />
						<Link href="/" className="flex-1" prefetch={true}>
							<Button variant={"outline"} className="w-full">
								Go back
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</main>
	);
}
