import Link from "next/link";
import Image from "next/image";

interface Props {
	imageUrl: string;
	title: string;
	count: number;
	countLabel: string;
	href: string;
	className?: string;
}

const PropertyTypeItem = ({
														imageUrl,
														title,
														count,
														countLabel,
														href,
														className,
													}: Props) => {
	return (
		<Link
			href={href}
			className={`group relative row-span-1 overflow-hidden rounded-2xl ${className}`}
		>
			<Image
				src={imageUrl}
				alt={title}
				fill
				className="object-cover transition duration-300 group-hover:scale-105"
			/>

			<div className="absolute inset-0 bg-black/35 transition duration-300 group-hover:bg-black/45" />

			<div className="absolute left-4 top-4 z-10 text-white">
				<h3 className="text-lg font-semibold">{title}</h3>
				<span className="text-sm">
          {count} {countLabel}
        </span>
			</div>
		</Link>
	);
};

export default PropertyTypeItem;
