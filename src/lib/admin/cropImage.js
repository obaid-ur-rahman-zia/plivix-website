/**
 * Draw the cropped region from an image (object URL or remote URL) to a blob.
 * Used after react-easy-crop produces pixel coordinates.
 */

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    if (/^https?:\/\//i.test(src) && !src.startsWith("blob:")) {
      img.crossOrigin = "anonymous";
    }
    img.src = src;
  });
}

/**
 * @param {string} imageSrc
 * @param {{ x: number, y: number, width: number, height: number }} pixelCrop
 * @param {string} [mimeType]
 * @param {number} [quality]
 */
export async function getCroppedImageBlob(imageSrc, pixelCrop, mimeType = "image/jpeg", quality = 0.92) {
  const image = await loadImage(imageSrc);
  const w = Math.max(1, Math.round(pixelCrop.width));
  const h = Math.max(1, Math.round(pixelCrop.height));
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    w,
    h
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Could not export image"));
      },
      mimeType,
      mimeType === "image/jpeg" ? quality : undefined
    );
  });
}
