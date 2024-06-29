import PROJECT_NAMESPACE from "@/projectNamespace";

/**
 * Add project namespace to classNames.
 *
 * Example:
 * ```
 * projectNamespace = "prefix"
 * nsp("class") -> "prefix-class"
 * nsp("A", "B") -> "prefix-A prefix-B"
 * nsp("A B") -> "prefix-A prefix-B"
 * ```
 *
 * @param  {...string} classNames List of classNames to prefix with namespace
 * @returns {string} joined className string
 */
const nsp = (...classNames: string[]) =>
  classNames
    .map((classList) => classList.split(/\s/).filter(Boolean))
    .flat()
    .map((className) => `${PROJECT_NAMESPACE}-${className}`)
    .join(" ");

export default nsp;
