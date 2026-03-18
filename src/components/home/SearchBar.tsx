import React from 'react';

const SearchBar = () => {
	return (
		<section className="relative mx-auto flex max-w-7xl flex-col justify-end px-6 pb-24 -mt-18">
			<div className="mx-auto w-full max-w-5xl rounded-2xl bg-white shadow-2xl">
				<div className="flex border-b border-gray-200">
					<button className="border-b-2 border-orange-500 px-6 py-4 text-sm font-semibold text-gray-900">
						Все
					</button>
					<button className="px-6 py-4 text-sm font-semibold text-gray-500 transition hover:text-gray-900">
						Для продажу
					</button>
					<button className="px-6 py-4 text-sm font-semibold text-gray-500 transition hover:text-gray-900">
						Для оренди
					</button>
				</div>

				<form className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2 xl:grid-cols-5">
					<div className="flex flex-col border-b border-gray-200 pb-3 md:border-b-0 md:border-r md:pb-0 md:pr-4">
						<label className="mb-2 text-sm font-semibold text-gray-900">
							Назва
						</label>
						<input
							type="text"
							placeholder="Введіть текст..."
							className="bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
						/>
					</div>

					<div className="flex flex-col border-b border-gray-200 pb-3 md:border-b-0 xl:border-r xl:pb-0 xl:pr-4">
						<label className="mb-2 text-sm font-semibold text-gray-900">
							Тип
						</label>
						<select className="bg-transparent text-sm text-gray-700 outline-none">
							<option>Тип</option>
							<option>Apartment</option>
							<option>House</option>
							<option>Villa</option>
						</select>
					</div>

					<div className="flex flex-col border-b border-gray-200 pb-3 md:border-b-0 md:border-r md:pb-0 md:pr-4">
						<label className="mb-2 text-sm font-semibold text-gray-900">
							Місто
						</label>
						<select className="bg-transparent text-sm text-gray-700 outline-none">
							<option>Місто</option>
							<option>Kyiv</option>
							<option>Dnipro</option>
							<option>Lviv</option>
						</select>
					</div>

					<div className="flex flex-col border-b border-gray-200 pb-3 md:border-b-0 xl:border-r xl:pb-0 xl:pr-4">
						<label className="mb-2 text-sm font-semibold text-gray-900">
							Ціна
						</label>
						<select className="bg-transparent text-sm text-gray-700 outline-none">
							<option>$0 - $5,800</option>
							<option>$5,800 - $20,000</option>
							<option>$20,000 - $100,000</option>
						</select>
					</div>

					<div className="flex items-center gap-3 xl:justify-end">
						<button
							type="button"
							className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
						>
							Розширенний
						</button>
						<button
							type="submit"
							className="rounded-xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
						>
							Пошук
						</button>
					</div>
				</form>
			</div>
		</section>
	);
};

export default SearchBar;