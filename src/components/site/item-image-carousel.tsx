"use client";

import Image from "next/image";
import { optimizeCloudinaryImageUrl } from "@/lib/cloudinary-url";
import { useState } from "react";

type ItemImageCarouselProps = {
  images: string[];
  name: string;
};

export function ItemImageCarousel({ images, name }: ItemImageCarouselProps) {
  const [current, setCurrent] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-[4/3] w-full rounded-2xl bg-gradient-to-br from-[#dbe5f0] to-[#a7bcd1]" />
    );
  }

  const safeIndex = ((current % images.length) + images.length) % images.length;
  const image = optimizeCloudinaryImageUrl(images[safeIndex], { width: 1200, height: 900 });

  return (
    <div>
      <Image
        src={image}
        alt={`${name} image ${safeIndex + 1}`}
        className="aspect-[4/3] w-full rounded-2xl object-cover"
        width={1200}
        height={900}
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
      {images.length > 1 ? (
        <div className="mt-4 space-y-2">
          <p className="text-xs text-[#4f6479]">
            {safeIndex + 1} / {images.length}
          </p>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {images.map((img, index) => {
              const isActive = index === safeIndex;
              return (
                <button
                  key={`${img}-${index}`}
                  type="button"
                  onClick={() => setCurrent(index)}
                  className={`relative shrink-0 overflow-hidden rounded-lg border-2 transition ${
                    isActive
                      ? "border-[#d3b06a] ring-2 ring-[#d3b06a]/25"
                      : "border-[#d4dde6] hover:border-[#d3b06a]/60"
                  }`}
                >
                  <Image
                    src={optimizeCloudinaryImageUrl(img, { width: 240, height: 180 })}
                    alt={`${name} thumbnail ${index + 1}`}
                    width={120}
                    height={90}
                    className="h-[72px] w-[96px] object-cover"
                    sizes="96px"
                  />
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
