"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { PropertyImage } from "@prisma/client";

interface Props {
	images: PropertyImage[];
}

const TRANSITION_MS = 450;

type GalleryState = {
	activeImageId: number | null;
	prevImage: PropertyImage | null;
	signature: string;
};

const PropertyGallery = ({ images }: Props) => {
	const orderedImages = useMemo(() => {
		if (!images.length) return [];
		const main = images.find((img) => img.isMain) || images[0];
		return [main, ...images.filter((img) => img.id !== main.id)];
	}, [images]);

	const signature = orderedImages.map((image) => image.id).join(",");
	const [galleryState, setGalleryState] = useState<GalleryState>({
		activeImageId: orderedImages[0]?.id ?? null,
		prevImage: null,
		signature,
	});

	const isSignatureChanged = galleryState.signature !== signature;
	const activeImage =
		(isSignatureChanged
			? orderedImages[0]
			: orderedImages.find((image) => image.id === galleryState.activeImageId)) ??
		orderedImages[0] ??
		null;
	const prevImage = isSignatureChanged ? null : galleryState.prevImage;

	useEffect(() => {
		if (!prevImage) return;

		const timer = setTimeout(() => {
			setGalleryState((current) => ({ ...current, prevImage: null }));
		}, TRANSITION_MS);

		return () => clearTimeout(timer);
	}, [prevImage]);

	if (!activeImage) {
		return null;
	}

	const previewImages = orderedImages.filter((img) => img.id !== activeImage.id).slice(0, 4);

	const handleSelect = (image: PropertyImage) => {
		if (image.id === activeImage.id) return;
		setGalleryState({
			activeImageId: image.id,
			prevImage: activeImage,
			signature,
		});
	};

	return (
		<div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_132px]">
			<div className="rounded-xl ring-1 ring-black/10">
				<div className="relative aspect-4/3 overflow-hidden rounded-xl bg-bg-secondary">
					<div className="absolute inset-0">
						<Image
							src={activeImage.url}
							fill
							alt={activeImage.alt || "Property image"}
							className="object-cover"
							sizes="(max-width: 768px) 100vw, 900px"
							priority
						/>
					</div>

					{prevImage ? (
						<div className="absolute inset-0 animate-fade-out">
							<Image
								src={prevImage.url}
								fill
								alt={prevImage.alt || "Property image"}
								className="object-cover"
								sizes="(max-width: 768px) 100vw, 900px"
								priority
							/>
						</div>
					) : null}

					<div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-black/8" />
				</div>
			</div>

			<div className="flex gap-3 md:flex-col">
				{previewImages.map((image) => (
					<button
						key={image.id}
						type="button"
						onClick={() => handleSelect(image)}
						className="group relative h-20 flex-1 overflow-hidden rounded-xl bg-white ring-1 ring-black/10 transition-all duration-300 hover:ring-primary/50 md:h-24"
					>
						<div className="absolute inset-0 overflow-hidden rounded-xl">
							<Image
								src={image.url}
								fill
								alt={image.alt || "Property preview"}
								className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
								sizes="132px"
							/>
						</div>
						<div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-black/8" />
					</button>
				))}
			</div>

			<style jsx>{`
          .animate-fade-out {
              animation: fadeOut ${TRANSITION_MS}ms ease forwards;
              will-change: opacity;
          }

          @keyframes fadeOut {
              from {
                  opacity: 1;
              }
              to {
                  opacity: 0;
              }
          }
			`}</style>
		</div>
	);
};

export default PropertyGallery;
