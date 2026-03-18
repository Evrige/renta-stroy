import React from 'react';
import {Container} from "@/components/layout/Container";
import {Mail, MapPin, Phone} from "lucide-react";

const Page = () => {
	return (
		<Container className="py-12">

			<div className="max-w-2xl mb-10">
				<h1 className="text-3xl font-semibold mb-4 text-primary">
					Контакти
				</h1>
				<p className="text-gray-600">
					Зв&#39;яжіться з нами будь-яким зручним способом або залиште заявку — ми відповімо якнайшвидше.
				</p>
			</div>

			{/* Основной блок */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-10">

				{/* Контактная информация */}
				<div className="space-y-6">

					<div className="flex items-center gap-3">
						<MapPin className="w-5 h-5 text-primary" />
						<span className="text-secondary">Україна, м. Київ</span>
					</div>

					<div className="flex items-center gap-3">
						<Phone className="w-5 h-5 text-primary" />
						<span className="text-secondary">+380 00 000 00 00</span>
					</div>

					<div className="flex items-center gap-3">
						<Mail className="w-5 h-5 text-primary" />
						<span className="text-secondary">info@renta-stroy.ua</span>
					</div>

				</div>

				<form className="space-y-4">

					<input
						type="text"
						placeholder="Ваше ім'я"
						className="w-full border rounded-lg px-4 py-2 text-secondary"
					/>

					<input
						type="email"
						placeholder="Email"
						className="w-full border rounded-lg px-4 py-2 text-secondary"
					/>

					<textarea
						placeholder="Ваше повідомлення"
						className="w-full border rounded-lg px-4 py-2 h-32 text-secondary"
					/>

					<button
						type="submit"
						className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
					>
						Відправити
					</button>

				</form>

			</div>

			<div className="mt-16">
				<div className="w-full h-[300px] bg-gray-200 rounded-xl flex items-center justify-center text-gray-500">
					Карта (Google Maps)
				</div>
			</div>

		</Container>
	);
};

export default Page;