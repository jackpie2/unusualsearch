import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArticleType } from "@/lib/types";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "./ui/tooltip";

export async function ArticleSkeleton() {
	return (
		<Card>
			<CardHeader className="h-[98px] relative flex flex-col gap-1.5 justify-center">
				<div className="flex items-center justify-between relative">
					<Skeleton className="h-6 w-32" />
					<Skeleton className="h-9 w-9 absolute right-0 top-0" />
				</div>
				<div>
					<Skeleton className="h-5 w-48 md:w-64" />
				</div>
			</CardHeader>
			<CardContent className="h-12">
				<Skeleton className="h-4 w-64" />
			</CardContent>
		</Card>
	);
}

export default async function Article({ article }: { article: ArticleType }) {
	return (
		<div className="relative">
			<Link
				key={article.url}
				href={article.url}
				target="_blank"
				rel="noreferrer"
			>
				<Card>
					<CardHeader>
						<h2>
							<div className="flex items-center gap-2 max-w-[80%]">
								<p className="font-bold break-words max-w-[80%]">
									{decodeURI(
										article.article_name.replace(
											/_/g,
											"%20"
										)
									)
										.replace(/%3F/g, "?")
										.replace(/%26/g, "&")
										.replace(/%2B/g, "+")
										.replace(/%3D/g, "=")}
								</p>
								{article.distance && (
									<TooltipProvider>
										<Tooltip>
											<TooltipTrigger>
												<Badge>
													{article.distance}
												</Badge>
											</TooltipTrigger>
											<TooltipContent>
												<p>
													Distance from search query
												</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								)}
							</div>
						</h2>
						<CardDescription
							className="break-words 
                        text-sm max-w-[80%]
                    "
						>
							{article.url}
						</CardDescription>
					</CardHeader>
					<CardContent>{article.extract}</CardContent>
				</Card>
			</Link>
			<div className="flex gap-2 items-center absolute right-0 top-0 m-6">
				<TooltipProvider>
					<Tooltip>
						<TooltipTrigger asChild>
							<Link
								href={`/similar?article=${article.article_name}`}
								prefetch={true}
							>
								<Button
									variant={"outline"}
									size={"icon"}
									className="text-xl font-semibold"
									aria-label="Get similar articles"
								>
									~
								</Button>
							</Link>
						</TooltipTrigger>
						<TooltipContent>
							<p>
								Find similar articles to{" "}
								{decodeURI(
									article.article_name.replace(/_/g, "%20")
								)
									.replace(/%3F/g, "?")
									.replace(/%26/g, "&")
									.replace(/%2B/g, "+")
									.replace(/%3D/g, "=")}
								.
							</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		</div>
	);
}
