import Article, { ArticleSkeleton } from "@/components/article";
import Search from "@/components/search";
import { Button } from "@/components/ui/button";
import { ArticleType } from "@/lib/types";
import { Rubik_Mono_One } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";

export const runtime = "edge";

const rubik = Rubik_Mono_One({
	weight: "400",
	subsets: ["latin"],
});

async function Results({ query, mode }: { query: string; mode: string }) {
	let result: ArticleType[] | null = null;

	const matchedMode = mode === "tfidf" ? null : "openai";

	const response = await fetch(
		`https://api.unusualsearch.org?q=${query}${
			matchedMode ? `&mode=${matchedMode}` : ""
		}`
	);

	if (response.ok) {
		result = (await response.json()) as ArticleType[];
	}

	if (!result) {
		return <p>No results found</p>;
	}

	return result.map((res) => {
		return <Article key={res.url} article={res} />;
	});
}

async function Skeletons() {
	return [...Array(10)].map((_, i) => <ArticleSkeleton key={i} />);
}

export default async function Home({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const query = searchParams.q as string;
	const mode =
		(searchParams.mode as string) === "openai" ? "openai" : "tfidf";

	return (
		<main className="flex min-h-screen flex-col items-center p-2 pb-24 pt-[40%] md:pt-[15%]">
			<div className="max-w-3xl w-full flex flex-col gap-8">
				<div className="text-center">
					<h1
						className={`
						${rubik.className} text-4xl
					`}
					>
						Unusual Search
					</h1>
					<p className="text-sm italic text-muted-foreground max-w-xl mx-auto mt-2">
						&ldquo;Of the over six million articles in the English
						Wikipedia there are some articles that Wikipedians have
						identified as being somewhat{" "}
						<span className="font-semibold">unusual</span>
						.&ldquo;
					</p>
				</div>
				<div className="grow flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<Search query={query} currentMode={mode} />
						<div className="flex flex-col md:flex-row gap-2">
							<Link
								href="/random"
								className="flex-1"
								prefetch={true}
							>
								<Button className="w-full" variant={"outline"}>
									Random Article
								</Button>
							</Link>
							<Link
								href="https://en.wikipedia.org/wiki/Wikipedia:Unusual_articles"
								className="flex-1"
								target="_blank"
							>
								<Button className="w-full" variant={"outline"}>
									Full list
								</Button>
							</Link>
						</div>
					</div>
					{query && query.length < 300 && (
						<div className="flex flex-col gap-4">
							<h2 className="text-xl font-semibold">
								Results for &ldquo;{query}&ldquo;
							</h2>
							<Suspense
								fallback={<Skeletons />}
								key={query + mode}
							>
								<Results query={query} mode={mode} />
							</Suspense>
						</div>
					)}
				</div>
			</div>
		</main>
	);
}
