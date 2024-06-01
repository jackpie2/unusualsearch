import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	let articles: {
		url: string;
		lastModified: Date;
		changeFrequency: "daily" | "weekly" | "monthly";
	}[] = [
		{
			url: "https://unusualsearch.org/",
			lastModified: new Date(),
			changeFrequency: "daily",
		},
		{
			url: "https://unusualsearch.org/random",
			lastModified: new Date(),
			changeFrequency: "daily",
		},
	];

	const allArticles = await fetch("https://api.unusualsearch.org/all");

	if (allArticles.ok) {
		const result = (await allArticles.json()) as string[];

		const newArticles = result.map((url) => {
			return {
				url: `https://unusualsearch.org/similar?article=${url}`,
				lastModified: new Date("2024-05-12T00:00:00.000Z"),
				changeFrequency: "monthly",
			};
		}) as {
			url: string;
			lastModified: Date;
			changeFrequency: "daily" | "weekly" | "monthly";
		}[];

		articles = [...articles, ...newArticles];
	}

	return articles;
}
