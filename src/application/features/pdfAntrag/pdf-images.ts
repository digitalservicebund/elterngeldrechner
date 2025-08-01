import { generateLink } from "@/application/features/pdfAntrag/generate-link";

export const imageAntrag = generateLink({
  familienportalPath:
    "/image/268156/uncropped/416/517/2855b052b7b158e7837e408aa99da72/A75DE9654F3FF4D375EEC17CAF074398/antrag-dbelx2vc.webp",
  publicPath: "/images/elterngeldantrag.png",
});

export const imageSeite = generateLink({
  familienportalPath:
    "/image/268158/uncropped/365/517/f6976e854397a0d72dc0c6ed67618b3d/07B27D863D09408289D2141CD4C5B92F/seite-dpzgavdq.webp",
  publicPath: "/images/planungsseite.png",
});
