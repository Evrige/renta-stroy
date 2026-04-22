import type { Metadata } from "next";
import { UserRole } from "@/generated/prisma/client";
import { UserManagementTable } from "@/components/crm/UserManagementTable";
import { Container } from "@/components/layout/Container";
import { requireRole } from "@/lib/auth";
import { ROUTES } from "@/lib/constants/routes";
import { getCrmUsers } from "@/lib/queries/crm";

export const metadata: Metadata = {
	title: "Користувачі | CRM",
};

export default async function CrmUsersPage() {
	const currentUser = await requireRole(UserRole.ADMIN, ROUTES.CRM_USERS);
	const users = await getCrmUsers();

	return (
		<section className="py-12">
			<Container className="space-y-8">
				<div className="max-w-3xl">
					<p className="text-sm font-semibold uppercase tracking-[0.28em] text-secondary">
						Адмін панель
					</p>
					<h1 className="mt-4 text-4xl font-semibold text-primary">
						Керування користувачами, ролями та статусами акаунтів
					</h1>
					<p className="mt-4 text-base leading-7 text-secondary">
						Адміністратор може оновлювати профілі, змінювати ролі, блокувати акаунти та
						контролювати загальну якість доступу до системи.
					</p>
				</div>

				<UserManagementTable users={users} currentUserId={currentUser.id} />
			</Container>
		</section>
	);
}
