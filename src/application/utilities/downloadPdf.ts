export const downloadPdf = (pdfBytes: Uint8Array, fileName: string): void => {
  const blobPart =
    pdfBytes.buffer instanceof ArrayBuffer ? pdfBytes.buffer : pdfBytes;

  const blob = new Blob([blobPart as BlobPart], { type: "application/pdf" });

  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = fileName;

  document.body.appendChild(anchor);
  anchor.click();

  document.body.removeChild(anchor);
  window.URL.revokeObjectURL(url);
};
