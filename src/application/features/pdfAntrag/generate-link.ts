const relativeBasePath = import.meta.env.BASE_URL;
const familienportalBasePath = "https://familienportal.de/resource";

const isStagingEnvironment = import.meta.env.MODE === "staging";
const isProductionEnvironment = import.meta.env.MODE === "production";

/**
 * Due to technical limitations on the side of the hosting provider we
 * cannot import static assets as we're used to using the vite build
 * chain but generate links ourselves. In order to have valid links
 * for all environments we need to either use the familienportal,
 * github or no base path.
 *
 * @param familienportalPath is the relative path starting after resource part
 * @param relativePath is the relative path pointing towards the public folder
 *
 * @returns a valid link to the asset based on the given environment
 */
export function generateLink({
  familienportalPath,
  relativePath,
}: {
  familienportalPath: string;
  relativePath: string;
}) {
  if (isProductionEnvironment) {
    return familienportalBasePath + familienportalPath;
  } else if (isStagingEnvironment) {
    return relativeBasePath + relativePath;
  } else {
    return relativePath;
  }
}
