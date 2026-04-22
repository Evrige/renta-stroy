import Link from "next/link";
import Image from "next/image";
import {getCurrentUser} from "@/lib/auth";
import { UserRole } from "@/generated/prisma/client";
import {LogoutButton} from "@/components/auth/LogoutButton";
import {NAV_ITEMS} from "@/lib/constants/navigation";
import {ROUTES} from "@/lib/constants/routes";
import {Container} from "./Container";

export async function Header() {
	const currentUser = await getCurrentUser();

	return (
		<header className="absolute top-0 left-0 z-50 w-full">
			<Container className="flex items-center justify-between py-2 ">
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
							className="inline-flex h-11 items-center border-b-2 border-transparent text-lg font-medium leading-none text-primary transition-colors duration-300 hover:border-primary"
						>
							{item.label}
						</Link>
					))}
				</nav>

				<div className="flex items-center gap-3">
					{currentUser ? (
						<div className="hidden items-center gap-2 md:flex">
							{currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.MANAGER ? (
								<Link
									href={ROUTES.CRM}
									className="inline-flex h-10 items-center rounded-lg border border-black/10 px-4 text-sm font-semibold text-primary transition-colors duration-300 hover:border-primary hover:bg-primary hover:text-white"
								>
									CRM
								</Link>
							) : null}
							<div className="flex items-center gap-2 rounded-lg border border-black/10 px-3 py-1 shadow-sm">
							<Link
								href={ROUTES.ACCOUNT}
								className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1 text-sm font-medium text-primary transition-colors duration-300 hover:bg-primary/6"
							>
								<Image
									src={currentUser.avatar}
									width={32}
									height={32}
									alt={currentUser.name}
									className="h-8 w-8 rounded-full object-cover"
								/>
								<span className="text-base">{currentUser.name}</span>
							</Link>
							<LogoutButton
								className="h-10 w-10 rounded-md text-primary transition-colors duration-300 hover:bg-primary hover:text-white"
							/>
							</div>
						</div>
					) : (
						<div className="flex items-center gap-3">
							<Link
								href={ROUTES.REGISTER}
								className="hidden cursor-pointer h-11 items-center rounded-lg border border-transparent px-4 text-lg font-medium leading-none text-primary transition-[background-color,color] duration-300 hover:bg-primary/8 hover:text-primary/75 md:inline-flex"
							>
								Реєстрація
							</Link>
							<Link
								href={ROUTES.LOGIN}
								className="inline-flex cursor-pointer h-11 items-center rounded-lg border border-primary px-4 text-lg font-medium leading-none text-primary transition-[background-color,color,border-color] duration-300 hover:border-primary hover:bg-primary hover:text-white"
							>
								Увійти
							</Link>
						</div>
					)}
				</div>

			</Container>
		</header>
	);
}
