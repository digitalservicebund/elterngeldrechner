const basePath = import.meta.env.BASE_URL;
const isStagingEnvironment = import.meta.env.MODE === "staging";
const isProductionEnvironment = import.meta.env.MODE === "production";

export const imageAntrag = isProductionEnvironment
  ? "https://familienportal.de/resource/image/268156/uncropped/416/517/2855b052b7b158e7837e408aa99da72/A75DE9654F3FF4D375EEC17CAF074398/antrag-dbelx2vc.webp"
  : `${isStagingEnvironment ? basePath : ""}/images/elterngeldantrag.png`;

export const imageSeite = isProductionEnvironment
  ? "https://familienportal.de/resource/image/268158/uncropped/365/517/f6976e854397a0d72dc0c6ed67618b3d/07B27D863D09408289D2141CD4C5B92F/seite-dpzgavdq.webp"
  : `${isStagingEnvironment ? basePath : ""}/images/planungsseite.png`;
