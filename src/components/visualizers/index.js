// Category-based visualizer index
// These components provide step-by-step interactive visualizations
// grouped by algorithm category. Use getVisualizerByCategory(category, problemId)
// or getVisualizerByProblemId(problemId) to get the right component.

import PrefixSumViz from "./PrefixSumViz";
import PivotIndexViz from "./PivotIndexViz";
import TwoPointersViz from "./TwoPointersViz";
import SlidingWindowViz from "./SlidingWindowViz";
import MonotonicStackViz from "./MonotonicStackViz";
import ParenthesesViz from "./ParenthesesViz";
import BinarySearchViz from "./BinarySearchViz";
import LinkedListViz from "./LinkedListViz";
import TreeViz from "./TreeViz";
import BSTViz from "./BSTViz";
import TrieViz from "./TrieViz";
import HeapViz from "./HeapViz";
import BacktrackingViz from "./BacktrackingViz";
import GraphViz from "./GraphViz";
import DPViz from "./DPViz";
import GreedyViz from "./GreedyViz";
import BitManipulationViz from "./BitManipulationViz";

// Map from problem ID to specialised visualizer component
const PROBLEM_VISUALIZER_MAP = {
    // Prefix Sum
    560: PrefixSumViz,
    724: PivotIndexViz,

    // Two Pointers
    167: TwoPointersViz,
    26: TwoPointersViz,

    // Sliding Window
    3: SlidingWindowViz,
    209: SlidingWindowViz,

    // Monotonic Stack
    739: MonotonicStackViz,
    503: MonotonicStackViz,

    // Stack / Parentheses
    20: ParenthesesViz,
    32: ParenthesesViz,

    // Binary Search
    153: BinarySearchViz,
    704: BinarySearchViz,
    1011: BinarySearchViz,

    // Linked List
    876: LinkedListViz,
    206: LinkedListViz,
    141: LinkedListViz,

    // Tree
    104: TreeViz,
    226: TreeViz,
    102: TreeViz,
    124: TreeViz,
    297: TreeViz,

    // BST
    98: BSTViz,
    230: BSTViz,

    // Trie
    208: TrieViz,
    211: TrieViz,
    212: TrieViz,

    // Heap
    215: HeapViz,
    295: HeapViz,

    // Backtracking
    78: BacktrackingViz,
    46: BacktrackingViz,
    79: BacktrackingViz,
    51: BacktrackingViz,

    // Graph
    200: GraphViz,
    207: GraphViz,
    133: GraphViz,
    417: GraphViz,

    // Dynamic Programming
    70: DPViz,
    322: DPViz,
    300: DPViz,
    1143: DPViz,

    // Greedy
    55: GreedyViz,
    53: GreedyViz,
    134: GreedyViz,

    // Bit Manipulation
    191: BitManipulationViz,
    338: BitManipulationViz,
};

// Map from category string to default visualizer
const CATEGORY_VISUALIZER_MAP = {
    "Prefix Sum": PrefixSumViz,
    "Two Pointers": TwoPointersViz,
    "Sliding Window": SlidingWindowViz,
    "Monotonic Stack": MonotonicStackViz,
    "Stack": ParenthesesViz,
    "Binary Search": BinarySearchViz,
    "Linked List": LinkedListViz,
    "Tree": TreeViz,
    "BST": BSTViz,
    "Trie": TrieViz,
    "Heap": HeapViz,
    "Backtracking": BacktrackingViz,
    "Graph": GraphViz,
    "Dynamic Programming": DPViz,
    "Greedy": GreedyViz,
    "Bit Manipulation": BitManipulationViz,
};

/**
 * Get a visualizer component for a specific problem ID.
 * Falls back to the category-level visualizer if not found.
 * @param {number} problemId
 * @param {string} category
 * @returns {React.ComponentType|null}
 */
export function getVisualizerByProblemId(problemId, category) {
    return PROBLEM_VISUALIZER_MAP[problemId]
        || CATEGORY_VISUALIZER_MAP[category]
        || null;
}

/**
 * Get the default visualizer for an algorithm category.
 * @param {string} category
 * @returns {React.ComponentType|null}
 */
export function getVisualizerByCategory(category) {
    return CATEGORY_VISUALIZER_MAP[category] || null;
}

export {
    PrefixSumViz,
    PivotIndexViz,
    TwoPointersViz,
    SlidingWindowViz,
    MonotonicStackViz,
    ParenthesesViz,
    BinarySearchViz,
    LinkedListViz,
    TreeViz,
    BSTViz,
    TrieViz,
    HeapViz,
    BacktrackingViz,
    GraphViz,
    DPViz,
    GreedyViz,
    BitManipulationViz,
};

export default PROBLEM_VISUALIZER_MAP;
