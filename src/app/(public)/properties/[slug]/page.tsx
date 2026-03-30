import {Armchair, Bath, BedDouble, Building2, Calendar, CarFront, MapPin, Ruler} from "lucide-react";
import {notFound} from "next/navigation";

import {formatDate, formatListingType, formatPrice, formatRentPeriod} from "@/app/utils/formatters";
import PropertyGallery from "@/components/home/PropertyGallery";
import {Container} from "@/components/layout/Container";
import {prisma} from "@/lib/prisma";
import BackButton from "@/components/buttons/BackButton";

const Page = async ({params}: { params: Promise<{ slug: string }> }) => {
	const {slug} = await params;

	const property = await prisma.property.findUnique({
		where: {
			slug,
		},
		include: {
			location: true,
			images: true,
		},
	});

	if (!property) {
		notFound();
	}

	const latitude = property.location.latitude ? Number(property.location.latitude) : null;
	const longitude = property.location.longitude ? Number(property.location.longitude) : null;
	const hasCoordinates = latitude !== null && longitude !== null;
	return (
		<Container className="py-8 sm:py-10">
			<div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
				<div className="min-w-0">
					<div className="mb-6 flex flex-col gap-3">
						<div className="flex justify-between">
							<div className="flex flex-wrap items-center gap-3 text-sm text-secondary">
								<BackButton/>
								<span
									className="rounded-full border border-gray-200 bg-bg-secondary px-3 py-1 font-medium text-primary">
								{formatListingType(property.listingType)}
							</span>
								{property.rentPeriod ? (
									<span className="rounded-full border border-gray-200 px-3 py-1">
									{formatRentPeriod(property.rentPeriod)}
								</span>
								) : null}
								<span className="inline-flex items-center gap-2">
								<MapPin size={16}/>
									{property.location.city}, {property.location.street} {property.location.building}
							</span>
							</div>
							<div className="text-secondary flex gap-1 items-center">
								{property.updatedAt ? <span>{formatDate(property.updatedAt)}</span> :
									<span>{formatDate(property.createdAt)}</span>}
								<Calendar size={18}/>
							</div>
						</div>
						<h1 className="max-w-4xl text-3xl font-semibold leading-tight text-primary sm:text-4xl">
							{property.title}
						</h1>
					</div>

					<PropertyGallery images={property.images}/>
					<div className="text-secondary mt-5">
						{property.description}
					</div>

					{hasCoordinates ? (
						<div className="mt-10 overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-[0_20px_60px_rgba(24,26,32,0.08)]">
							<div className="border-b border-gray-200 px-6 py-5 sm:px-7">
								<h2 className="text-2xl font-semibold text-primary">Розташування на карті</h2>
								<p className="mt-2 text-sm text-secondary">
									{property.location.city}
									{property.location.district ? `, ${property.location.district}` : ""}
									{property.location.street ? `, ${property.location.street}` : ""}
									{property.location.building ? ` ${property.location.building}` : ""}
								</p>
							</div>
							<iframe
								title={`Карта розташування ${property.title}`}
								src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
								loading="lazy"
								referrerPolicy="no-referrer-when-downgrade"
								className="h-[360px] w-full border-0"
							/>
						</div>
					) : null}
				</div>

				<aside className="xl:sticky xl:top-6">
					<div
						className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-[0_20px_60px_rgba(24,26,32,0.08)]">
						<div className="bg-[linear-gradient(135deg,#181a20_0%,#2a2d36_100%)] px-6 py-6 text-white sm:px-7">
							<p className="text-sm font-medium uppercase tracking-[0.18em] text-white/65">
								{property.rentPeriod ? "Вартість оренди" : "Ціна продажу"}
							</p>
							<p className="mt-3 text-3xl font-semibold sm:text-4xl">
								{formatPrice(property.price)} грн
							</p>
							<p className="mt-3 text-sm leading-6 text-white/70">
								{property.rentPeriod
									? "Актуальна ставка для оренди. Уточнюйте умови заселення та доступні дати."
									: "Об'єкт доступний для перегляду та детального обговорення умов купівлі."}
							</p>
						</div>

						<div className="space-y-6 px-6 py-6 sm:px-7">
							<div className="grid grid-cols-2 gap-3">
								<div className="rounded-2xl bg-bg-secondary p-4">
									<div
										className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
										<Ruler size={18}/>
									</div>
									<p className="text-xs uppercase tracking-[0.16em] text-secondary">Площа</p>
									<p className="mt-1 text-lg font-semibold text-primary">
										{property.area.toString()} м2
									</p>
								</div>

								<div className="rounded-2xl bg-bg-secondary p-4">
									<div
										className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
										<BedDouble size={18}/>
									</div>
									<p className="text-xs uppercase tracking-[0.16em] text-secondary">Кімнати</p>
									<p className="mt-1 text-lg font-semibold text-primary">
										{property.rooms ?? "Не вказано"}
									</p>
								</div>

								<div className="rounded-2xl bg-bg-secondary p-4">
									<div
										className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
										<Building2 size={18}/>
									</div>
									<p className="text-xs uppercase tracking-[0.16em] text-secondary">Поверх</p>
									<p className="mt-1 text-lg font-semibold text-primary">
										{property.floor ?? "Не вказано"}
										{property.totalFloors ? ` / ${property.totalFloors}` : ""}
									</p>
								</div>

								<div className="rounded-2xl bg-bg-secondary p-4">
									<div
										className="mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
										<Bath size={18}/>
									</div>
									<p className="text-xs uppercase tracking-[0.16em] text-secondary">Санвузли</p>
									<p className="mt-1 text-lg font-semibold text-primary">
										{property.bathrooms ?? "Не вказано"}
									</p>
								</div>
							</div>

							<div className="rounded-2xl border border-gray-200 p-4">
								<p className="text-sm font-semibold text-primary">Що включено</p>
								<div className="mt-4 flex flex-col gap-3 text-sm text-secondary">
									<div className="flex items-center justify-between gap-3">
										<span className="inline-flex items-center gap-2">
											<CarFront size={16} className="text-primary"/>
											Паркінг
										</span>
										<span className="font-medium text-primary">
											{property.parking ? "Доступний" : "Немає"}
										</span>
									</div>
									<div className="flex items-center justify-between gap-3">
										<span className="inline-flex items-center gap-2">
											<Armchair size={16} className="text-primary"/>
											Меблювання
										</span>
										<span className="font-medium text-primary">
											{property.furnished ? "Повністю мебльовано" : "Без меблів"}
										</span>
									</div>
								</div>
							</div>

							<div className="space-y-3">
								<button
									className="w-full rounded-2xl bg-primary px-5 py-4 text-sm font-semibold text-white transition hover:opacity-92">
									{property.rentPeriod ? "Залишити заявку на оренду" : "Записатися на перегляд"}
								</button>
								<button
									className="w-full rounded-2xl border border-gray-300 bg-white px-5 py-4 text-sm font-semibold text-primary transition hover:border-gray-400">
									Зв&apos;язатися з менеджером
								</button>
							</div>
						</div>
					</div>
				</aside>
			</div>
		</Container>
	);
};

export default Page;
