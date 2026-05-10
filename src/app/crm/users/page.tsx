import type { Metadata } from "next";
import { UserRole } from "@/generated/prisma/client";
import { UserManagementTable } from "@/components/crm/UserManagementTable";
import { Container } from "@/components/layout/Container";
import { PageHeading } from "@/components/layout/PageHeading";
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
				<PageHeading
					eyebrow="Адмін панель"
					title="Керування користувачами, ролями та статусами акаунтів"
					description="Адміністратор може оновлювати профілі, змінювати ролі, блокувати акаунти та контролювати загальну якість доступу до системи."
					backHref={ROUTES.CRM}
					backLabel="До CRM"
				/>

				<UserManagementTable users={users} currentUserId={currentUser.id} />
			</Container>
		</section>
	);
}
