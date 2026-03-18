import React from 'react';
import {Container} from "@/components/layout/Container";
import Link from "next/link";
import Image from "next/image";
import {ROUTES} from "@/lib/constants/routes";

const Footer = () => {
	return (
		<footer className="bg-primary text-white mt-20">
			<Container className="py-12">

				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">

					<div>
						<h3 className="text-xl font-semibold mb-3">Renta Stroy</h3>
						<p className="text-gray-400 text-sm">
							Платформа для пошуку та розміщення нерухомості в Україні.
						</p>
						<Image
							src="/images/logo.png"
							width={100}
							height={200}
							alt="Logo"
							className="mt-4 mx-auto"
						/>
					</div>
					<div>
						<h4 className="font-medium mb-3">Навігація</h4>
						<ul className="space-y-2 text-gray-400 text-sm">
							<li><Link href={ROUTES.HOME}>Головна</Link></li>
							<li><Link href={ROUTES.PROPERTIES}>Нерухомість</Link></li>
							<li><Link href={ROUTES.ABOUT}>Про компанію</Link></li>
							<li><Link href={ROUTES.CONTACTS}>Контакти</Link></li>
						</ul>
					</div>
					<div>
						<h4 className="font-medium mb-3">Контакти</h4>
						<ul className="space-y-2 text-gray-400 text-sm">
							<li>📍 Україна Дніпро</li>
							<li>📞 +380 00 000 00 00</li>
							<li>✉️ info@renta-stroy.ua</li>
						</ul>
					</div>

					<div>
						<h4 className="font-medium mb-3">Соцмережі</h4>
						<ul className="space-y-2 text-gray-400 text-sm">
							<li>Instagram</li>
							<li>Telegram</li>
							<li>Facebook</li>
						</ul>
					</div>
				</div>

				<div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between text-sm text-gray-400">
					<span>© {new Date().getFullYear()} Renta Stroy. Всі права захищені.</span>
					<span>Зроблено з ❤️</span>
				</div>

			</Container>
		</footer>
	);
};

export default Footer;