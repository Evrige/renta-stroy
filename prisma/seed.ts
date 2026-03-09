import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
	ListingType,
	PrismaClient,
	PropertyStatus,
	RentPeriod,
	RequestStatus,
	RequestType,
	TransactionStatus,
	TransactionType,
	UserRole,
} from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
	throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
	console.log("Seeding...");

	const admin = await prisma.user.upsert({
		where: { email: "admin@example.com" },
		update: {},
		create: {
			name: "Admin",
			email: "admin@example.com",
			password: "123456",
			role: UserRole.ADMIN,
		},
	});

	const manager = await prisma.user.upsert({
		where: { email: "manager@example.com" },
		update: {},
		create: {
			name: "Manager",
			email: "manager@example.com",
			password: "123456",
			phone: "+380991112233",
			role: UserRole.MANAGER,
		},
	});

	const user = await prisma.user.upsert({
		where: { email: "user@example.com" },
		update: {},
		create: {
			name: "User",
			email: "user@example.com",
			password: "123456",
			phone: "+380991234567",
			role: UserRole.USER,
		},
	});

	const location1 = await prisma.location.create({
		data: {
			country: "Ukraine",
			city: "Dnipro",
			district: "Center",
			street: "Yavornytskoho Ave",
			building: "15",
			latitude: 48.4647,
			longitude: 35.0462,
		},
	});

	const location2 = await prisma.location.create({
		data: {
			country: "Ukraine",
			city: "Dnipro",
			district: "Sobornyi",
			street: "Sicheslavska Naberezhna",
			building: "27",
			latitude: 48.4675,
			longitude: 35.0501,
		},
	});

	const rentProperty = await prisma.property.create({
		data: {
			title: "2-room apartment in city center",
			slug: "2-room-apartment-city-center",
			description: "Modern furnished apartment for monthly rent in the center of Dnipro.",
			listingType: ListingType.RENT,
			rentPeriod: RentPeriod.MONTHLY,
			price: "18000",
			area: "64.5",
			rooms: 2,
			floor: 5,
			totalFloors: 9,
			bathrooms: 1,
			parking: true,
			furnished: true,
			status: PropertyStatus.AVAILABLE,
			managerId: manager.id,
			locationId: location1.id,
			images: {
				create: [
					{
						url: "/images/apartment-1.jpg",
						alt: "Living room",
						isMain: true,
					},
					{
						url: "/images/apartment-2.jpg",
						alt: "Bedroom",
						isMain: false,
					},
				],
			},
		},
	});

	const saleProperty = await prisma.property.create({
		data: {
			title: "Commercial property for sale",
			slug: "commercial-property-for-sale",
			description: "Commercial property suitable for office or retail business.",
			listingType: ListingType.SALE,
			price: "125000",
			area: "145.0",
			rooms: 5,
			floor: 1,
			totalFloors: 3,
			bathrooms: 2,
			parking: true,
			furnished: false,
			status: PropertyStatus.AVAILABLE,
			managerId: manager.id,
			locationId: location2.id,
			images: {
				create: [
					{
						url: "/images/commercial-1.jpg",
						alt: "Facade",
						isMain: true,
					},
				],
			},
		},
	});

	await prisma.request.create({
		data: {
			type: RequestType.RENT,
			message: "I want to rent this apartment for a long term.",
			status: RequestStatus.PENDING,
			userId: user.id,
			propertyId: rentProperty.id,
		},
	});

	await prisma.request.create({
		data: {
			type: RequestType.BUY,
			message: "I am interested in buying this commercial property.",
			status: RequestStatus.IN_PROGRESS,
			userId: user.id,
			propertyId: saleProperty.id,
		},
	});

	await prisma.favorite.create({
		data: {
			userId: user.id,
			propertyId: rentProperty.id,
		},
	});

	await prisma.favorite.create({
		data: {
			userId: user.id,
			propertyId: saleProperty.id,
		},
	});

	await prisma.review.create({
		data: {
			rating: 5,
			comment: "Great apartment and very good location.",
			userId: user.id,
			propertyId: rentProperty.id,
		},
	});

	await prisma.message.create({
		data: {
			content: "Hello, is this apartment still available?",
			senderId: user.id,
			receiverId: manager.id,
		},
	});

	await prisma.message.create({
		data: {
			content: "Yes, it is available. Would you like to schedule a viewing?",
			senderId: manager.id,
			receiverId: user.id,
		},
	});

	await prisma.transaction.create({
		data: {
			type: TransactionType.RENT,
			status: TransactionStatus.ACTIVE,
			price: "18000",
			startDate: new Date("2026-03-10"),
			endDate: new Date("2026-04-10"),
			propertyId: rentProperty.id,
			buyerId: user.id,
			sellerId: manager.id,
		},
	});

	console.log({
		admin,
		manager,
		user,
		rentProperty,
		saleProperty,
	});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});