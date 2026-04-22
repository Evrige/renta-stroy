import Link from "next/link";
import Image from "next/image";
import { BedDouble, Heart, LandPlot, SquareArrowOutUpRight, SquaresExclude } from "lucide-react";
import { ListingType, PropertyType } from "@/generated/prisma/client";
import { Container } from "@/components/layout/Container";
import { ROUTES } from "@/lib/constants/routes";
import { getRoomsLabel } from "@/app/utils/getRoomsLabel";
import {
	formatListingType,
	formatPrice,
	formatPropertyType,
	formatRentPeriod,
} from "@/app/utils/formatters";
import { getCities } from "@/lib/queries/locations";
import { getFilteredProperties } from "@/lib/queries/properties";

const listingTypeOptions = [
	{ value: ListingType.SALE, label: "Продаж" },
	{ value: ListingType.RENT, label: "Оренда" },
] as const;

const propertyTypeOptions = [
	{ value: PropertyType.APARTMENT, label: "Квартира" },
	{ value: PropertyType.HOUSE, label: "Будинок" },
	{ value: PropertyType.OFFICE, label: "Офіс" },
	{ value: PropertyType.COMMERCIAL, label: "Комерція" },
	{ value: PropertyType.WAREHOUSE, label: "Склад" },
	{ value: PropertyType.MALL, label: "ТЦ" },
] as const;

type PropertiesPageProps = {
	searchParams: Promise<{
		city?: string;
		listingType?: string;
		propertyType?: string;
		rooms?: string;
		minPrice?: string;
		maxPrice?: string;
	}>;
};

const parsePositiveNumber = (value?: string) => {
	if (!value) return undefined;

	const parsed = Number(value);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

const Page = async ({ searchParams }: PropertiesPageProps) => {
	const params = await searchParams;

	const selectedListingType = listingTypeOptions.some((option) => option.value === params.listingType)
		? (params.listingType as ListingType)
		: undefined;

	const selectedPropertyType = propertyTypeOptions.some((option) => option.value === params.propertyType)
		? (params.propertyType as PropertyType)
		: undefined;

	const selectedRooms = parsePositiveNumber(params.rooms);
	const minPrice = parsePositiveNumber(params.minPrice);
	const maxPrice = parsePositiveNumber(params.maxPrice);
	const city = params.city?.trim() || undefined;

	const [properties, cities] = await Promise.all([
		getFilteredProperties({
			city,
			listingType: selectedListingType,
			propertyType: selectedPropertyType,
			rooms: selectedRooms,
			minPrice,
			maxPrice,
		}),
		getCities(),
	]);

	return (
		<Container className="py-12">
			<div className="mb-8">
				<h1 className="text-3xl font-semibold text-primary">Уся нерухомість</h1>
				<p className="mt-2 text-secondary">
					Знайдіть об&apos;єкт за типом, містом, кількістю кімнат і бюджетом.
				</p>
			</div>

			<form className="mb-8 rounded-3xl border border-black/5 bg-bg-secondary/50 p-5 shadow-sm">
				<div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
					<div className="flex flex-col gap-2">
						<label htmlFor="listingType" className="text-sm font-medium text-primary">
							Тип угоди
						</label>
						<select
							id="listingType"
							name="listingType"
							defaultValue={selectedListingType ?? ""}
							className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-primary outline-none transition focus:border-primary"
						>
							<option value="">Усі</option>
							{listingTypeOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</div>

					<div className="flex flex-col gap-2">
						<label htmlFor="propertyType" className="text-sm font-medium text-primary">
							Тип нерухомості
						</label>
						<select
							id="propertyType"
							name="propertyType"
							defaultValue={selectedPropertyType ?? ""}
							className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-primary outline-none transition focus:border-primary"
						>
							<option value="">Усі</option>
							{propertyTypeOptions.map((option) => (
								<option key={option.value} value={option.value}>
									{option.label}
								</option>
							))}
						</select>
					</div>

					<div className="flex flex-col gap-2">
						<label htmlFor="city" className="text-sm font-medium text-primary">
							Місто
						</label>
						<select
							id="city"
							name="city"
							defaultValue={city ?? ""}
							className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-primary outline-none transition focus:border-primary"
						>
							<option value="">Усі міста</option>
							{cities.map((location) => (
								<option key={location.city} value={location.city}>
									{location.city}
								</option>
							))}
						</select>
					</div>

					<div className="flex flex-col gap-2">
						<label htmlFor="rooms" className="text-sm font-medium text-primary">
							Кімнати
						</label>
						<input
							id="rooms"
							name="rooms"
							type="number"
							min="1"
							defaultValue={selectedRooms?.toString() ?? ""}
							placeholder="Наприклад, 2"
							className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-primary outline-none transition focus:border-primary"
						/>
					</div>

					<div className="flex flex-col gap-2">
						<label htmlFor="minPrice" className="text-sm font-medium text-primary">
							Ціна від
						</label>
						<input
							id="minPrice"
							name="minPrice"
							type="number"
							min="0"
							defaultValue={minPrice?.toString() ?? ""}
							placeholder="0"
							className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-primary outline-none transition focus:border-primary"
						/>
					</div>

					<div className="flex flex-col gap-2">
						<label htmlFor="maxPrice" className="text-sm font-medium text-primary">
							Ціна до
						</label>
						<input
							id="maxPrice"
							name="maxPrice"
							type="number"
							min="0"
							defaultValue={maxPrice?.toString() ?? ""}
							placeholder="Без ліміту"
							className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm text-primary outline-none transition focus:border-primary"
						/>
					</div>
				</div>

				<div className="mt-5 flex flex-wrap items-center justify-between gap-3">
					<p className="text-sm text-secondary">
						Знайдено: <span className="font-semibold text-primary">{properties.length}</span>
					</p>

					<div className="flex flex-wrap gap-3">
						<Link
							href={ROUTES.PROPERTIES}
							className="rounded-xl border border-black/10 bg-white px-5 py-3 text-sm font-medium text-primary transition hover:border-primary"
						>
							Скинути
						</Link>
						<button
							type="submit"
							className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
						>
							Застосувати фільтри
						</button>
					</div>
				</div>
			</form>

			{properties.length ? (
				<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
					{properties.map((property) => (
						<Link
							key={property.id}
							href={ROUTES.PROPERTY_DETAILS(property.slug)}
							className="h-full"
						>
							<div className="flex h-full flex-col overflow-hidden rounded-[28px] border border-black/8 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
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
											<span>{property.rooms ?? 0} {getRoomsLabel(property.rooms || 0)}</span>
										</div>
										<div className="flex items-center gap-1">
											<LandPlot size={18} color="#181a20" />
											<span>{property.area.toString()} m<sup>2</sup></span>
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
											<Heart size={18} color="#181a20" />
											<SquaresExclude size={18} color="#181a20" />
										</div>
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>
			) : (
				<div className="rounded-[28px] border border-dashed border-black/10 bg-bg-secondary/40 px-6 py-16 text-center">
					<h2 className="text-2xl font-semibold text-primary">Нічого не знайдено</h2>
					<p className="mt-3 text-secondary">
						Спробуйте змінити параметри пошуку або скинути фільтри, щоб побачити більше варіантів.
					</p>
				</div>
			)}
		</Container>
	);
};

export default Page;
