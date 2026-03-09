import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { Container } from "./Container";
import Image from "next/image";

export function Header() {
	return (
		<header className="">
			<Container className="flex items-center justify-between py-2 bg-amber-200">
				<Link
					href={ROUTES.HOME}
				>
					<Image src="/images/logo.png"
								 width={100}
								 height={50}
								 alt="Logo"
					/>
				</Link>



				<nav className="hidden items-center gap-10 md:flex">
					{NAV_ITEMS.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className="text-lg font-medium text-white border-b-2 border-transparent hover:border-white transition pb-2"
						>
							{item.label}
						</Link>
					))}
				</nav>

				<div className="flex items-center gap-3">
					<Link
						href={ROUTES.LOGIN}
						className="rounded-lg border px-4 py-2 text-sm font-medium"
					>
						Войти
					</Link>
				</div>

			</Container>
		</header>
	);
}