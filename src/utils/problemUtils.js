/**
 * Generates a LeetCode problem URL from a problem title.
 * @param {string} title - Problem title
 * @returns {string} LeetCode URL
 */
export function getLeetCodeUrl(title) {
    if (!title) return "https://leetcode.com/problemset/";

    const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    return slug
        ? `https://leetcode.com/problems/${slug}`
        : "https://leetcode.com/problemset/";
}
