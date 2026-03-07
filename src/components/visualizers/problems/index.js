// Individual rich visualizers for all 60 DSA problems
// Each problem ID maps to its specific component

// ── Original 30 named rich visualizers ───────────────────────────────────────
import SubarraySumEqualsK from './SubarraySumEqualsK.jsx';
import TwoSumIIInputArrayIsSorted from './TwoSumIIInputArrayIsSorted.jsx';
import LongestSubstringWithoutRepeatingCharacters from './LongestSubstringWithoutRepeatingCharacters.jsx';
import DailyTemperatures from './DailyTemperatures.jsx';
import ValidParentheses from './ValidParentheses.jsx';
import SearchinRotatedSortedArray from './SearchinRotatedSortedArray.jsx';
import KokoEatingBananas from './KokoEatingBananas.jsx';
import LinkedListCycle from './LinkedListCycle.jsx';
import ReverseLinkedList from './ReverseLinkedList.jsx';
import ReverseNodesinkGroup from './ReverseNodesinkGroup.jsx';
import DiameterofBinaryTree from './DiameterofBinaryTree.jsx';
import BinaryTreeLevelOrderTraversal from './BinaryTreeLevelOrderTraversal.jsx';
import ConstructBinaryTreefromPreorderandInorder from './ConstructBinaryTreefromPreorderandInorder.jsx';
import ValidateBinarySearchTree from './ValidateBinarySearchTree.jsx';
import ImplementTriePrefixTree from './ImplementTriePrefixTree.jsx';
import KthLargestElementinanArray from './KthLargestElementinanArray.jsx';
import FindMedianfromDataStream from './FindMedianfromDataStream.jsx';
import Subsets from './Subsets.jsx';
import Permutations from './Permutations.jsx';
import NQueens from './NQueens.jsx';
import NumberofIslands from './NumberofIslands.jsx';
import RottingOranges from './RottingOranges.jsx';
import CourseSchedule from './CourseSchedule.jsx';
import NumberofProvinces from './NumberofProvinces.jsx';
import HouseRobber from './HouseRobber.jsx';
import LongestCommonSubsequence from './LongestCommonSubsequence.jsx';
import PartitionEqualSubsetSum from './PartitionEqualSubsetSum.jsx';
import MergeIntervals from './MergeIntervals.jsx';
import SingleNumber from './SingleNumber.jsx';
import TrappingRainWater from './TrappingRainWater.jsx';

// ── New 30 individual visualizers ─────────────────────────────────────────────
import FindPivotIndex from './FindPivotIndex.jsx';
import RemoveDuplicates from './RemoveDuplicates.jsx';
import MinimumSizeSubarraySum from './MinimumSizeSubarraySum.jsx';
import NextGreaterElementII from './NextGreaterElementII.jsx';
import LongestValidParentheses from './LongestValidParentheses.jsx';
import FindMinimumRotatedArray from './FindMinimumRotatedArray.jsx';
import CapacityToShipPackages from './CapacityToShipPackages.jsx';
import MiddleLinkedList from './MiddleLinkedList.jsx';
import ReverseLinkedListII from './ReverseLinkedListII.jsx';
import ReorderList from './ReorderList.jsx';
import BinaryTreeMaxPathSum from './BinaryTreeMaxPathSum.jsx';
import BinaryTreeRightSideView from './BinaryTreeRightSideView.jsx';
import ConvertSortedArrayToBST from './ConvertSortedArrayToBST.jsx';
import KthSmallestBST from './KthSmallestBST.jsx';
import TopKFrequentElements from './TopKFrequentElements.jsx';
import CombinationSum from './CombinationSum.jsx';
import PermutationsII from './PermutationsII.jsx';
import SudokuSolver from './SudokuSolver.jsx';
import CloneGraph from './CloneGraph.jsx';
import WordLadder from './WordLadder.jsx';
import CourseScheduleII from './CourseScheduleII.jsx';
import RedundantConnection from './RedundantConnection.jsx';
import CoinChange from './CoinChange.jsx';
import EditDistance from './EditDistance.jsx';
import TargetSum from './TargetSum.jsx';
import NonOverlappingIntervals from './NonOverlappingIntervals.jsx';
import MaximumXOR from './MaximumXOR.jsx';
import LargestRectangleHistogram from './LargestRectangleHistogram.jsx';

const visualizers = {
    // ── Prefix Sum ───────────────────────────────────────────────────────────
    560: SubarraySumEqualsK,
    724: FindPivotIndex,

    // ── Two Pointers ─────────────────────────────────────────────────────────
    167: TwoSumIIInputArrayIsSorted,
    26: RemoveDuplicates,

    // ── Sliding Window ────────────────────────────────────────────────────────
    3: LongestSubstringWithoutRepeatingCharacters,
    209: MinimumSizeSubarraySum,

    // ── Monotonic Stack ───────────────────────────────────────────────────────
    739: DailyTemperatures,
    503: NextGreaterElementII,

    // ── Stack / Parentheses ───────────────────────────────────────────────────
    20: ValidParentheses,
    32: LongestValidParentheses,

    // ── Binary Search ─────────────────────────────────────────────────────────
    33: SearchinRotatedSortedArray,
    153: FindMinimumRotatedArray,

    // ── Binary Search on Answer ───────────────────────────────────────────────
    875: KokoEatingBananas,
    1011: CapacityToShipPackages,

    // ── Linked List ───────────────────────────────────────────────────────────
    141: LinkedListCycle,
    876: MiddleLinkedList,
    206: ReverseLinkedList,
    92: ReverseLinkedListII,
    143: ReorderList,
    25: ReverseNodesinkGroup,

    // ── Binary Tree ───────────────────────────────────────────────────────────
    543: DiameterofBinaryTree,
    102: BinaryTreeLevelOrderTraversal,
    105: ConstructBinaryTreefromPreorderandInorder,
    124: BinaryTreeMaxPathSum,
    199: BinaryTreeRightSideView,

    // ── BST ───────────────────────────────────────────────────────────────────
    98: ValidateBinarySearchTree,
    230: KthSmallestBST,
    108: ConvertSortedArrayToBST,

    // ── Trie ─────────────────────────────────────────────────────────────────
    208: ImplementTriePrefixTree,
    212: ImplementTriePrefixTree,   // Word Search II shares Trie viz

    // ── Heap ─────────────────────────────────────────────────────────────────
    215: KthLargestElementinanArray,
    347: TopKFrequentElements,
    295: FindMedianfromDataStream,
    480: FindMedianfromDataStream,  // Sliding Window Median → two-heap viz

    // ── Backtracking ──────────────────────────────────────────────────────────
    78: Subsets,
    39: CombinationSum,
    46: Permutations,
    47: PermutationsII,
    51: NQueens,
    37: SudokuSolver,

    // ── Graph ─────────────────────────────────────────────────────────────────
    200: NumberofIslands,
    133: CloneGraph,
    994: RottingOranges,
    127: WordLadder,

    // ── Topological Sort ──────────────────────────────────────────────────────
    207: CourseSchedule,
    210: CourseScheduleII,

    // ── Union-Find ────────────────────────────────────────────────────────────
    547: NumberofProvinces,
    684: RedundantConnection,

    // ── 1D DP ─────────────────────────────────────────────────────────────────
    198: HouseRobber,
    322: CoinChange,

    // ── 2D DP ─────────────────────────────────────────────────────────────────
    1143: LongestCommonSubsequence,
    72: EditDistance,

    // ── Knapsack ─────────────────────────────────────────────────────────────
    416: PartitionEqualSubsetSum,
    494: TargetSum,

    // ── Greedy / Intervals ────────────────────────────────────────────────────
    56: MergeIntervals,
    435: NonOverlappingIntervals,

    // ── Bit Manipulation ──────────────────────────────────────────────────────
    136: SingleNumber,
    421: MaximumXOR,

    // ── Signature Hard ────────────────────────────────────────────────────────
    42: TrappingRainWater,
    84: LargestRectangleHistogram,
};

export default visualizers;
