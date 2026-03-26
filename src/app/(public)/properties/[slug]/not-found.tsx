import Link from "next/link";
import {Building2, Home, SearchX} from "lucide-react";

import {Container} from "@/components/layout/Container";

const NotFound = () => {
	return (
		<Container className="flex min-h-[calc(100vh-220px)] items-center py-16">
			<section
				className="relative w-full overflow-hidden rounded-4xl border border-gray-200 bg-[linear-gradient(135deg,#f7f7f7_0%,#ffffff_55%,#f3f4f6_100%)] px-6 py-10 shadow-[0_24px_80px_rgba(24,26,32,0.08)] sm:px-10 sm:py-14">
				<div className="absolute -right-14 -top-16 h-40 w-40 rounded-full bg-gray-200/70 blur-3xl"/>
				<div className="absolute -bottom-20 left-0 h-48 w-48 rounded-full bg-gray-100 blur-3xl"/>

				<div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
					<div className="max-w-2xl">
						<div
							className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-4 py-2 text-sm font-medium text-secondary backdrop-blur">
							<SearchX size={18} className="text-primary"/>
							Оголошення не знайдено
						</div>

						<p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-secondary">
							Помилка 404
						</p>
						<h1 className="mb-4 text-4xl font-semibold leading-tight text-primary sm:text-5xl">
							Схоже, ця нерухомість уже недоступна або посилання змінилося
						</h1>
						<p className="max-w-xl text-base leading-7 text-secondary sm:text-lg">
							Можливо, оголошення було знято з публікації, переміщено або в адресі є помилка.
							Перейдіть до каталогу та знайдіть схожі варіанти оренди чи продажу.
						</p>

						<div className="mt-8 flex flex-col gap-3 sm:flex-row">
							<Link
								href="/properties"
								className="inline-flex items-center justify-center rounded-2xl bg-primary px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
							>
								Повернутися до каталогу
							</Link>
							<Link
								href="/"
								className="inline-flex items-center justify-center rounded-2xl border border-gray-300 bg-white px-6 py-3 text-sm font-medium text-primary transition hover:border-gray-400"
							>
								На головну
							</Link>
						</div>
					</div>

					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
						<div
							className="rounded-[28px] border border-white/70 bg-white/85 p-6 shadow-[0_16px_48px_rgba(24,26,32,0.06)] backdrop-blur">
							<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white">
								<Building2 size={22}/>
							</div>
							<h2 className="mb-2 text-xl font-semibold text-primary">
								Перегляньте актуальні пропозиції
							</h2>
							<p className="text-sm leading-6 text-secondary">
								У каталозі доступні квартири, будинки й комерційні приміщення з актуальними цінами та фото.
							</p>
						</div>

						<div
							className="rounded-[28px] border border-white/70 bg-primary p-6 text-white shadow-[0_16px_48px_rgba(24,26,32,0.12)]">
							<div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/14">
								<Home size={22}/>
							</div>
							<h2 className="mb-2 text-xl font-semibold">
								Знайдемо інший варіант
							</h2>
							<p className="text-sm leading-6 text-white/80">
								Поверніться на головну сторінку, щоб почати новий пошук і швидко перейти до потрібного типу нерухомості.
							</p>
						</div>
					</div>
				</div>
			</section>
		</Container>
	);
};

export default NotFound;
