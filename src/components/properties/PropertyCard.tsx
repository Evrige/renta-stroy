import Image from "next/image";
import Link from "next/link";
import { BedDouble, Heart, LandPlot, SquareArrowOutUpRight, SquaresExclude } from "lucide-react";
import { getRoomsLabel } from "@/app/utils/getRoomsLabel";
import {
	formatListingType,
	formatPrice,
	formatPropertyType,
	formatRentPeriod,
} from "@/app/utils/formatters";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { ROUTES } from "@/lib/constants/routes";

type PropertyCardProps = {
	property: {
		id: number;
		slug: string;
		title: string;
		price: { toString(): string };
		listingType: string;
		propertyType: string;
		area: { toString(): string };
		rooms: number | null;
		rentPeriod: string | null;
		location: {
			city: string;
			district: string | null;
		};
		images: Array<{
			url: string;
			alt: string | null;
		}>;
	};
	isFavorite: boolean;
	isAuthenticated: boolean;
};

export function PropertyCard({ property, isFavorite, isAuthenticated }: PropertyCardProps) {
	return (
		<article className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-black/8 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
			<div className="absolute right-4 top-4 z-10">
				<FavoriteButton
					propertyId={property.id}
					initialIsFavorite={isFavorite}
					isAuthenticated={isAuthenticated}
				/>
			</div>

			<Link href={ROUTES.PROPERTY_DETAILS(property.slug)} className="flex h-full flex-col">
				<div className="relative h-56 w-full">
					<Image
						src={property.images[0]?.url || "/images/test.png"}
						width={400}
						height={224}
						alt={property.images[0]?.alt || property.title}
						className="h-full w-full object-cover"
					/>
					<p className="absolute left-4 top-4 rounded-xl bg-white px-3 py-1 text-sm font-semibold text-primary shadow-sm">
						{formatPrice(property.price)} грн
					</p>
				</div>

				<div className="flex flex-1 flex-col px-4 pb-4 pt-3">
					<div className="mb-3">
						<h2 className="line-clamp-2 min-h-[56px] text-lg font-semibold text-primary">
							{property.title}
						</h2>
						<p className="mt-2 text-sm text-secondary">
							{property.location.city}
							{property.location.district ? `, ${property.location.district}` : ""}
						</p>
					</div>

					<div className="mb-4 flex gap-4 border-b border-gray-200 pb-4 text-sm text-primary">
						<div className="flex items-center gap-1">
							<BedDouble size={18} color="#181a20" />
							<span>
								{property.rooms ?? 0} {getRoomsLabel(property.rooms || 0)}
							</span>
						</div>
						<div className="flex items-center gap-1">
							<LandPlot size={18} color="#181a20" />
							<span>
								{property.area.toString()} m<sup>2</sup>
							</span>
						</div>
					</div>

					<div className="mt-auto flex items-center justify-between text-sm text-secondary">
						<div className="flex flex-col gap-1">
							<span>{formatPropertyType(property.propertyType)}</span>
							<span>
								{property.listingType === "RENT"
									? formatRentPeriod(property.rentPeriod)
									: formatListingType(property.listingType)}
							</span>
						</div>

						<div className="flex gap-3">
							<SquareArrowOutUpRight size={18} color="#181a20" />
							<Heart
								size={18}
								color={isFavorite ? "#181a20" : "#181a20"}
								fill={isFavorite ? "#181a20" : "none"}
							/>
							<SquaresExclude size={18} color="#181a20" />
						</div>
					</div>
				</div>
			</Link>
		</article>
	);
}
