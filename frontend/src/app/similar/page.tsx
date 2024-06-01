import Article, { ArticleSkeleton } from "@/components/article";
import { Button } from "@/components/ui/button";
import { ArticleType } from "@/lib/types";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const runtime = "edge";

async function SimilarArticles({ article }: { article: string }) {
	const response = await fetch(
		`https://api.unusualsearch.org/similar?article_name=${article}`
	);
	let result: ArticleType[];

	if (response.ok) {
		result = (await response.json()) as ArticleType[];

		if (!result) {
			return <p>No results found</p>;
		}
	} else {
		return <p>No results found</p>;
	}

	return (
		<div className="flex flex-col gap-4">
			{result.map((res) => {
				return <Article key={res.url} article={res} />;
			})}
		</div>
	);
}

async function Skeletons() {
	return [...Array(5)].map((_, i) => <ArticleSkeleton key={i} />);
}

export default async function Page({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined };
}) {
	const article = searchParams.article as string;

	if (!article) {
		return notFound();
	}

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-2 py-12 md:py-24">
			<div className="max-w-2xl w-full p-2">
				<div className="flex flex-col gap-4">
					<h1 className="text-xl font-semibold">
						Articles similar to{" "}
						{decodeURI(article.replace(/_/g, "%20"))
							.replace(/%3F/g, "?")
							.replace(/%26/g, "&")
							.replace(/%2B/g, "+")
							.replace(/%3D/g, "=")}
					</h1>
					<Suspense fallback={<Skeletons />} key={article}>
						<SimilarArticles article={article} />
					</Suspense>
					<div className="flex gap-2">
						<Link href="/" className="grow">
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
