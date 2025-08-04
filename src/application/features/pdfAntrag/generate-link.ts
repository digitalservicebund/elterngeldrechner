const baseUrl = import.meta.env.BASE_URL;

const isStagingEnvironment = import.meta.env.MODE === "staging";
const isProductionEnvironment = import.meta.env.MODE === "production";

/**
 * Generates a valid url to a static asset depending on the deployment environment.
 *
 * Due to technical limitations of the hosting provider, static assets must be uploaded manually
 * before they can be used. During this process the provider adds the asset to their resource api
 * and generates a new filename including a hash. Because of this, we cannot rely on vites default
 * asset handling and must construct asset urls manually. This function helps resolve the correct
 * asset url depending on whether we're running in a local environment, on familienportal, or via
 * github pages.
 *
 * @param familienportalPath - The provider assigned path to the asset relative to their resource api.
 * @param publicPath - The path to the asset file as it exists in the local public folder.
 *
 * @returns a valid asset url appropriate for the current environment.
 */
export function generateLink({
  familienportalPath,
  publicPath,
}: {
  familienportalPath: string;
  publicPath: string;
}) {
  if (isProductionEnvironment) {
    return "/resource" + familienportalPath;
  } else if (isStagingEnvironment) {
    return baseUrl + publicPath;
  } else {
    return publicPath;
  }
}
