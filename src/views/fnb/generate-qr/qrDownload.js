export function downloadQrFromContainer(container, fileName = "qr-code.png") {
  if (!container || typeof document === "undefined") return false;

  const canvas = container.querySelector("canvas");
  if (canvas) {
    const blob = canvasToBlob(canvas);
    if (!blob) return false;
    triggerBlobDownload(blob, ensureExtension(fileName, "png"));
    return true;
  }

  const svg = container.querySelector("svg");
  if (svg) {
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svg);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    triggerBlobDownload(blob, ensureExtension(fileName, "svg"));
    return true;
  }

  return false;
}

function canvasToBlob(canvas) {
  const dataUrl = canvas.toDataURL("image/png");
  const base64 = dataUrl.split(",")[1];
  if (!base64) return null;
  const binary = atob(base64);
  const len = binary.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return new Blob([bytes], { type: "image/png" });
}

function triggerBlobDownload(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function ensureExtension(fileName, extension) {
  const regex = new RegExp(`\\.${extension}$`, "i");
  if (regex.test(fileName)) return fileName;
  return `${fileName.replace(/\.[a-z0-9]+$/i, "")}.${extension}`;
}
