import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type PageHeadingProps = {
	eyebrow: string;
	title: string;
	description?: string;
	backHref?: string;
	backLabel?: string;
	actions?: ReactNode;
};

export function PageHeading({
	eyebrow,
	title,
	description,
	backHref,
	backLabel = "Назад",
	actions,
}: PageHeadingProps) {
	return (
		<div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
			<div className="max-w-3xl">
				{backHref ? (
					<Link
						href={backHref}
						className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-4 py-2 text-sm font-medium text-primary transition hover:border-primary hover:bg-primary/5"
					>
						<ArrowLeft size={16} />
						{backLabel}
					</Link>
				) : null}

				<p className="mt-4 text-sm font-semibold uppercase tracking-[0.28em] text-secondary">
					{eyebrow}
				</p>
				<h1 className="mt-4 text-4xl font-semibold text-primary">{title}</h1>
				{description ? (
					<p className="mt-4 text-base leading-7 text-secondary">{description}</p>
				) : null}
			</div>

			{actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
		</div>
	);
}
