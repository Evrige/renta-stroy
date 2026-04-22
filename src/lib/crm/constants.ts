export const LISTING_TYPES = ["SALE", "RENT"] as const;
export const PROPERTY_TYPES = [
	"APARTMENT",
	"HOUSE",
	"OFFICE",
	"COMMERCIAL",
	"WAREHOUSE",
	"MALL",
] as const;
export const RENT_PERIODS = ["DAILY", "MONTHLY"] as const;
export const PROPERTY_STATUSES = [
	"AVAILABLE",
	"RESERVED",
	"SOLD",
	"RENTED",
	"INACTIVE",
] as const;
export const PROPERTY_APPROVAL_STATUSES = [
	"DRAFT",
	"PENDING_REVIEW",
	"NEEDS_REVISION",
	"APPROVED",
	"REJECTED",
] as const;
export const USER_ROLES = ["ADMIN", "MANAGER", "USER"] as const;

export type ListingTypeValue = (typeof LISTING_TYPES)[number];
export type PropertyTypeValue = (typeof PROPERTY_TYPES)[number];
export type RentPeriodValue = (typeof RENT_PERIODS)[number];
export type PropertyStatusValue = (typeof PROPERTY_STATUSES)[number];
export type PropertyApprovalStatusValue = (typeof PROPERTY_APPROVAL_STATUSES)[number];
export type UserRoleValue = (typeof USER_ROLES)[number];
