export function setupTagManager(sourceUrl: string): void {
  const isAlreadyPresent = isTagManagerScriptPresent(sourceUrl);

  if (!isAlreadyPresent) {
    addTagManagerScript(sourceUrl);
  }
}

function isTagManagerScriptPresent(sourceUrl: string): boolean {
  const allScripts = Array.from(document.getElementsByTagName("script"));
  return allScripts.some((script) => script.src === sourceUrl);
}

function addTagManagerScript(sourceUrl: string): void {
  const tagManagerScript = document.createElement("script");
  tagManagerScript.async = true;
  tagManagerScript.src = sourceUrl;

  // We can assume that there is any script, else we would not run here.
  const firstScript = document.getElementsByTagName("script")[0];
  firstScript.parentNode?.insertBefore(tagManagerScript, firstScript);
}
