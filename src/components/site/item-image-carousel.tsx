"use client";

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
  const image = images[safeIndex];

  return (
    <div>
      <img
        src={image}
        alt={`${name} image ${safeIndex + 1}`}
        className="aspect-[4/3] w-full rounded-2xl object-cover"
      />
      {images.length > 1 ? (
        <div className="mt-3 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setCurrent((value) => value - 1)}
            className="rounded-full border border-[#d4dde6] px-3 py-1.5 text-xs text-[#1f4568] hover:bg-[#edf2f8]"
          >
            Prev
          </button>
          <p className="text-xs text-[#4f6479]">
            {safeIndex + 1} / {images.length}
          </p>
          <button
            type="button"
            onClick={() => setCurrent((value) => value + 1)}
            className="rounded-full border border-[#d4dde6] px-3 py-1.5 text-xs text-[#1f4568] hover:bg-[#edf2f8]"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
