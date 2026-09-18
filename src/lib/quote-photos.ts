export const MAX_PHOTOS = 5;
export const MAX_SOURCE_BYTES = 10 * 1024 * 1024;
export const MAX_ATTACHMENT_BYTES = 1500 * 1024;
export const PHOTO_ACCEPT = "image/jpeg,image/png,image/webp";

/** Resize locally and re-encode: original filenames and EXIF/GPS are not uploaded. */
export async function prepareQuotePhoto(source: File): Promise<File> {
  if (!PHOTO_ACCEPT.split(",").includes(source.type)) {
    throw new Error("Choose a JPG, PNG or WebP photo. For HEIC, export a JPG first.");
  }
  if (source.size > MAX_SOURCE_BYTES) {
    throw new Error("Each original photo must be under 10 MB.");
  }
  const localUrl = URL.createObjectURL(source);
  try {
    const image = new Image();
    image.src = localUrl;
    await image.decode();
    if (!image.naturalWidth || !image.naturalHeight) throw new Error("Empty image");
    const scale = Math.min(1, 1600 / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Image processing unavailable");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.82),
    );
    if (!blob || blob.size > MAX_ATTACHMENT_BYTES) {
      throw new Error("That photo is too detailed to attach. Try a smaller photo.");
    }
    return new File([blob], `property-${crypto.randomUUID()}.jpg`, { type: "image/jpeg" });
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("That photo")) throw error;
    throw new Error("This photo could not be opened. Try another JPG, PNG or WebP image.");
  } finally {
    URL.revokeObjectURL(localUrl);
  }
}
