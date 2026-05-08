type CloudinaryImageOptions = {
  width?: number;
  height?: number;
  quality?: "auto" | number;
  format?: "auto" | "webp" | "jpg" | "png" | "avif";
};

function isCloudinaryImageUrl(url: URL): boolean {
  return (
    url.hostname.endsWith("res.cloudinary.com") &&
    url.pathname.includes("/image/upload/")
  );
}

export function optimizeCloudinaryImageUrl(
  imageUrl: string,
  options: CloudinaryImageOptions = {},
): string {
  try {
    const parsed = new URL(imageUrl);
    if (!isCloudinaryImageUrl(parsed)) return imageUrl;

    const transformations: string[] = [];
    const quality = options.quality ?? "auto";
    const format = options.format ?? "auto";

    transformations.push(`f_${format}`);
    transformations.push(`q_${quality}`);

    if (options.width && options.height) {
      transformations.push("c_fill");
      transformations.push(`w_${options.width}`);
      transformations.push(`h_${options.height}`);
    } else if (options.width) {
      transformations.push(`w_${options.width}`);
    } else if (options.height) {
      transformations.push(`h_${options.height}`);
    }

    parsed.pathname = parsed.pathname.replace(
      "/image/upload/",
      `/image/upload/${transformations.join(",")}/`,
    );
    return parsed.toString();
  } catch {
    return imageUrl;
  }
}
