export function formatCount(count: number) {
	const last = count % 10;
	const lastTwo = count % 100;

	if (last === 1 && lastTwo !== 11) return "оголошення";
	if (last >= 2 && last <= 4 && (lastTwo < 10 || lastTwo >= 20))
		return "оголошення";
	return "оголошень";
}