import React from 'react';
import Image from "next/image";

interface Props {
	title: string,
	description: string,
	icon: string,
	alt: string,
	buttonText: string,
	buttonVariant?: "filled" | "outline";
}

const RieltorCard = ({title, description, icon, alt, buttonText, buttonVariant = "outline"}: Props) => {
	return (
		<div
			className="flex h-full flex-col items-center rounded-3xl bg-background/80 p-8 text-center shadow-sm ring-1 ring-black/5">
			<Image src={icon} alt={alt} width={170} height={170}/>
			<h3 className="mt-3 text-lg font-medium text-primary">{title}</h3>
			<p className="mt-3 flex-1 text-secondary">
				{description}
			</p>
			<button
				className={
					buttonVariant === "filled"
						? "mt-6 rounded-xl border border-primary bg-primary px-5 py-2 text-white transition hover:opacity-90 cursor-pointer"
						: "mt-6 rounded-xl border border-primary px-5 py-2 text-primary transition hover:bg-primary hover:text-white cursor-pointer"
				}>
				{buttonText}
			</button>
		</div>
	);
};

export default RieltorCard;
