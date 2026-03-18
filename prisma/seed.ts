import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
	ListingType,
	PrismaClient,
	PropertyStatus,
	PropertyType,
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
	await prisma.transaction.deleteMany();
	await prisma.message.deleteMany();
	await prisma.review.deleteMany();
	await prisma.favorite.deleteMany();
	await prisma.request.deleteMany();
	await prisma.propertyImage.deleteMany();
	await prisma.property.deleteMany();
	await prisma.location.deleteMany();
	await prisma.user.deleteMany();
	

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

	const location3 = await prisma.location.create({
		data: {
			country: "Ukraine",
			city: "Kyiv",
			district: "Pecherskyi",
			street: "Lesi Ukrainky Blvd",
			building: "7",
			latitude: 50.4266,
			longitude: 30.5381,
		},
	});

	const location4 = await prisma.location.create({
		data: {
			country: "Ukraine",
			city: "Lviv",
			district: "Halytskyi",
			street: "Shevchenka Street",
			building: "102",
			latitude: 49.8397,
			longitude: 24.0297,
		},
	});

	const location5 = await prisma.location.create({
		data: {
			country: "Ukraine",
			city: "Odesa",
			district: "Prymorskyi",
			street: "Deribasivska Street",
			building: "21",
			latitude: 46.4825,
			longitude: 30.7233,
		},
	});

	const rentApartment = await prisma.property.create({
		data: {
			title: "2-room apartment in city center",
			slug: "2-room-apartment-city-center",
			description: "Modern furnished apartment for monthly rent in the center of Dnipro.",
			listingType: ListingType.RENT,
			propertyType: PropertyType.APARTMENT,
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

	const saleCommercial = await prisma.property.create({
		data: {
			title: "Commercial property for sale",
			slug: "commercial-property-for-sale",
			description: "Commercial property suitable for office or retail business.",
			listingType: ListingType.SALE,
			propertyType: PropertyType.COMMERCIAL,
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

	const saleHouse = await prisma.property.create({
		data: {
			title: "Modern family house with garden",
			slug: "modern-family-house-with-garden",
			description: "Spacious modern house with garage, garden and terrace in Kyiv.",
			listingType: ListingType.SALE,
			propertyType: PropertyType.HOUSE,
			price: "285000",
			area: "220.0",
			rooms: 6,
			totalFloors: 2,
			bathrooms: 3,
			parking: true,
			furnished: true,
			status: PropertyStatus.AVAILABLE,
			managerId: manager.id,
			locationId: location3.id,
			images: {
				create: [
					{
						url: "/images/house-1.jpg",
						alt: "House front view",
						isMain: true,
					},
					{
						url: "/images/house-2.jpg",
						alt: "House terrace",
						isMain: false,
					},
				],
			},
		},
	});

	const rentApartmentDaily = await prisma.property.create({
		data: {
			title: "Cozy studio apartment for daily rent",
			slug: "cozy-studio-apartment-daily-rent",
			description: "Small but cozy studio apartment in Lviv for short stays.",
			listingType: ListingType.RENT,
			propertyType: PropertyType.APARTMENT,
			rentPeriod: RentPeriod.DAILY,
			price: "2200",
			area: "38.0",
			rooms: 1,
			floor: 3,
			totalFloors: 6,
			bathrooms: 1,
			parking: false,
			furnished: true,
			status: PropertyStatus.AVAILABLE,
			managerId: manager.id,
			locationId: location4.id,
			images: {
				create: [
					{
						url: "/images/studio-1.jpg",
						alt: "Studio interior",
						isMain: true,
					},
				],
			},
		},
	});

	const saleMall = await prisma.property.create({
		data: {
			title: "Shopping mall building in Odesa",
			slug: "shopping-mall-building-odesa",
			description: "Large shopping center building with multiple retail spaces and parking.",
			listingType: ListingType.SALE,
			propertyType: PropertyType.MALL,
			price: "950000",
			area: "1800.0",
			rooms: 20,
			totalFloors: 4,
			bathrooms: 8,
			parking: true,
			furnished: false,
			status: PropertyStatus.AVAILABLE,
			managerId: manager.id,
			locationId: location5.id,
			images: {
				create: [
					{
						url: "/images/mall-1.jpg",
						alt: "Mall exterior",
						isMain: true,
					},
					{
						url: "/images/mall-2.jpg",
						alt: "Mall interior",
						isMain: false,
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
			propertyId: rentApartment.id,
		},
	});

	await prisma.request.create({
		data: {
			type: RequestType.BUY,
			message: "I am interested in buying this commercial property.",
			status: RequestStatus.IN_PROGRESS,
			userId: user.id,
			propertyId: saleCommercial.id,
		},
	});

	await prisma.request.create({
		data: {
			type: RequestType.VIEWING,
			message: "Can I schedule a viewing for this house next week?",
			status: RequestStatus.PENDING,
			userId: user.id,
			propertyId: saleHouse.id,
		},
	});

	await prisma.favorite.create({
		data: {
			userId: user.id,
			propertyId: rentApartment.id,
		},
	});

	await prisma.favorite.create({
		data: {
			userId: user.id,
			propertyId: saleCommercial.id,
		},
	});

	await prisma.favorite.create({
		data: {
			userId: user.id,
			propertyId: saleHouse.id,
		},
	});

	await prisma.review.create({
		data: {
			rating: 5,
			comment: "Great apartment and very good location.",
			userId: user.id,
			propertyId: rentApartment.id,
		},
	});

	await prisma.review.create({
		data: {
			rating: 4,
			comment: "Very promising property for business.",
			userId: user.id,
			propertyId: saleCommercial.id,
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
			propertyId: rentApartment.id,
			buyerId: user.id,
			sellerId: manager.id,
		},
	});

	console.log({
		admin,
		manager,
		user,
		rentApartment,
		saleCommercial,
		saleHouse,
		rentApartmentDaily,
		saleMall,
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