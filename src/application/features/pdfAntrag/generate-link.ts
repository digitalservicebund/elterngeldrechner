import { isFamilienportalAssetStorage } from "@/application/feature-flags";

const baseUrl = import.meta.env.BASE_URL;

/**
 * Generates a valid url to a static asset depending on the asset fetching strategy.
 *
 * When the familienportal assets feature flag is enabled, assets are resolved via
 * the cms at familienportal.de. Due to technical limitations of the hosting provider,
 * static assets must be uploaded manually before they can be used. During this process
 * the provider adds the asset to their resource api and generates a new filename
 * including a hash. Because of this, we cannot rely on vites default asset
 * handling and must construct asset urls manually.
 *
 * When disabled, this function returns the public path directly using the vite base url.
 *
 * @param familienportalPath - The path to the asset relative to the familienportal resource api.
 * @param publicPath - The path to the asset file as it exists in the local public folder.
 *
 * @returns a valid asset url appropriate for the current environment.
 */
export function generateLink(linkGenerationProps: GenerateLinkProps) {
  const { familienportalPath, publicPath } = linkGenerationProps;

  if (isFamilienportalAssetStorage()) {
    return `https://familienportal.de/resource/${familienportalPath}`;
  } else {
    return `${baseUrl}${publicPath}`;
  }
}

type GenerateLinkProps = {
  familienportalPath: string;
  publicPath: string;
};
