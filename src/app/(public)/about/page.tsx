import React from 'react';
import {Container} from "@/components/layout/Container";

const Page = () => {
	return (
		<Container className="py-12">

			<div className="max-w-3xl">
				<h1 className="text-3xl font-semibold mb-4 text-primary">
					Про компанію
				</h1>

				<p className="text-gray-600 text-lg">
					Ми — сучасна платформа для пошуку та розміщення нерухомості в Україні.
					Наша мета — зробити процес оренди та купівлі житла максимально простим,
					швидким і зручним для кожного.
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">

				<div className="p-6 border rounded-xl">
					<h3 className="font-medium text-lg mb-2 text-primary">Наша місія</h3>
					<p className="text-gray-600 text-sm">
						Допомогти людям швидко знаходити ідеальне житло без зайвого стресу.
					</p>
				</div>

				<div className="p-6 border rounded-xl">
					<h3 className="font-medium text-lg mb-2 text-primary">Що ми робимо</h3>
					<p className="text-gray-600 text-sm">
						Об'єднуємо орендодавців і покупців в одному зручному сервісі.
					</p>
				</div>

				<div className="p-6 border rounded-xl">
					<h3 className="font-medium text-lg mb-2 text-primary">Чому ми</h3>
					<p className="text-gray-600 text-sm">
						Актуальні оголошення, зручний інтерфейс і швидкий пошук.
					</p>
				</div>

			</div>

			<div className="mt-16 max-w-2xl">
				<h2 className="text-2xl font-semibold mb-4 text-primary">
					Наші цінності
				</h2>

				<ul className="space-y-2 text-gray-600">
					<li>✔ Прозорість і чесність</li>
					<li>✔ Зручність для користувача</li>
					<li>✔ Швидкість і ефективність</li>
					<li>✔ Постійний розвиток</li>
				</ul>
			</div>

		</Container>
	);
};

export default Page;