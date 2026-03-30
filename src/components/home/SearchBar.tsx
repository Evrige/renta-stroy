import { ListingType, PropertyType } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { ROUTES } from "@/lib/constants/routes";

const listingTypeOptions = [
	{ value: "", label: "Все" },
	{ value: ListingType.SALE, label: "Для продажу" },
	{ value: ListingType.RENT, label: "Для оренди" },
] as const;

const propertyTypeOptions = [
	{ value: "", label: "Усі типи" },
	{ value: PropertyType.APARTMENT, label: "Квартира" },
	{ value: PropertyType.HOUSE, label: "Будинок" },
	{ value: PropertyType.OFFICE, label: "Офіс" },
	{ value: PropertyType.COMMERCIAL, label: "Комерція" },
	{ value: PropertyType.WAREHOUSE, label: "Склад" },
	{ value: PropertyType.MALL, label: "Торгівельний центр" },
] as const;

const roomOptions = [
	{ value: "", label: "Будь-яка" },
	{ value: "1", label: "1 кімната" },
	{ value: "2", label: "2 кімнати" },
	{ value: "3", label: "3 кімнати" },
	{ value: "4", label: "4+ кімнати" },
] as const;

const priceOptions = [
	{ value: "", label: "Будь-яка ціна" },
	{ value: "50000", label: "Від 50 000 грн" },
	{ value: "150000", label: "Від 150 000 грн" },
	{ value: "300000", label: "Від 300 000 грн" },
	{ value: "500000", label: "Від 500 000 грн" },
] as const;

const SearchBar = async () => {
	const cities = await prisma.location.findMany({
		select: {
			city: true,
		},
		distinct: ["city"],
		orderBy: {
			city: "asc",
		},
	});

	return (
		<section className="relative mx-auto -mt-18 flex max-w-7xl flex-col justify-end px-6 pb-24">
			<div className="mx-auto w-full max-w-5xl rounded-[28px] bg-white shadow-[0_24px_80px_rgba(24,26,32,0.12)]">
				<form action={ROUTES.PROPERTIES} className="p-5">
					<div className="mb-5 flex flex-wrap gap-3 border-b border-gray-200 pb-5">
						{listingTypeOptions.map((option, index) => (
							<label
								key={option.label}
								className="cursor-pointer"
							>
								<input
									type="radio"
									name="listingType"
									value={option.value}
									defaultChecked={index === 0}
									className="peer sr-only"
								/>
								<span className="inline-flex rounded-xl border border-transparent px-5 py-3 text-sm font-medium text-secondary transition peer-checked:border-primary peer-checked:bg-primary peer-checked:text-white hover:text-primary">
									{option.label}
								</span>
							</label>
						))}
					</div>

					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
						<div className="flex flex-col gap-2 rounded-2xl border border-black/8 px-4 py-3">
							<label htmlFor="propertyType" className="text-sm font-medium text-primary">
								Тип нерухомості
							</label>
							<select
								id="propertyType"
								name="propertyType"
								defaultValue=""
								className="bg-transparent text-sm text-secondary outline-none"
							>
								{propertyTypeOptions.map((option) => (
									<option key={option.label} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>

						<div className="flex flex-col gap-2 rounded-2xl border border-black/8 px-4 py-3">
							<label htmlFor="city" className="text-sm font-medium text-primary">
								Місто
							</label>
							<select
								id="city"
								name="city"
								defaultValue=""
								className="bg-transparent text-sm text-secondary outline-none"
							>
								<option value="">Усі міста</option>
								{cities.map((location) => (
									<option key={location.city} value={location.city}>
										{location.city}
									</option>
								))}
							</select>
						</div>

						<div className="flex flex-col gap-2 rounded-2xl border border-black/8 px-4 py-3">
							<label htmlFor="rooms" className="text-sm font-medium text-primary">
								Кімнати
							</label>
							<select
								id="rooms"
								name="rooms"
								defaultValue=""
								className="bg-transparent text-sm text-secondary outline-none"
							>
								{roomOptions.map((option) => (
									<option key={option.label} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>

						<div className="flex flex-col gap-2 rounded-2xl border border-black/8 px-4 py-3">
							<label htmlFor="minPrice" className="text-sm font-medium text-primary">
								Бюджет
							</label>
							<select
								id="minPrice"
								name="minPrice"
								defaultValue=""
								className="bg-transparent text-sm text-secondary outline-none"
							>
								{priceOptions.map((option) => (
									<option key={option.label} value={option.value}>
										{option.label}
									</option>
								))}
							</select>
						</div>

						<div className="flex items-stretch">
							<button
								type="submit"
								className="w-full rounded-2xl bg-primary px-6 py-4 text-sm font-semibold text-white transition hover:opacity-90"
							>
								Знайти нерухомість
							</button>
						</div>
					</div>
				</form>
			</div>
		</section>
	);
};

export default SearchBar;
