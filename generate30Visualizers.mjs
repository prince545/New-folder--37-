import fs from 'fs';
import path from 'path';

// Read the CSV data (you can also read from problems.json)
const problemsData = [
    { day: 1, pattern: "Prefix Sum", title: "Subarray Sum Equals K", id: 560, difficulty: "Medium", theme: "Hashmap + prefix" },
    { day: 2, pattern: "Two Pointers / Sorted Arrays", title: "Two Sum II - Input Array Is Sorted", id: 167, difficulty: "Medium", theme: "Clean two-pointer" },
    { day: 3, pattern: "Sliding Window", title: "Longest Substring Without Repeating Characters", id: 3, difficulty: "Medium", theme: "Sliding window with set" },
    { day: 4, pattern: "Monotonic Stack", title: "Daily Temperatures", id: 739, difficulty: "Medium", theme: "Next greater element" },
    { day: 5, pattern: "Stack / Parentheses", title: "Valid Parentheses", id: 20, difficulty: "Easy", theme: "Stack matching" },
    { day: 6, pattern: "Binary Search", title: "Search in Rotated Sorted Array", id: 33, difficulty: "Medium", theme: "Modified binary search" },
    { day: 7, pattern: "Binary Search on Answer", title: "Koko Eating Bananas", id: 875, difficulty: "Medium", theme: "Binary search on value" },
    { day: 8, pattern: "Linked List Cycle / Fast-Slow", title: "Linked List Cycle", id: 141, difficulty: "Easy", theme: "Floyd's cycle detection" },
    { day: 9, pattern: "Linked List Reversal", title: "Reverse Linked List", id: 206, difficulty: "Easy", theme: "Pointer manipulation" },
    { day: 10, pattern: "Advanced Linked List", title: "Reverse Nodes in k-Group", id: 25, difficulty: "Hard", theme: "Group reversal" },
    { day: 11, pattern: "Binary Tree Basics", title: "Diameter of Binary Tree", id: 543, difficulty: "Easy", theme: "Tree recursion" },
    { day: 12, pattern: "Binary Tree BFS", title: "Binary Tree Level Order Traversal", id: 102, difficulty: "Medium", theme: "BFS with queue" },
    { day: 13, pattern: "Tree Construction", title: "Construct Binary Tree from Preorder and Inorder", id: 105, difficulty: "Medium", theme: "Recursive construction" },
    { day: 14, pattern: "Binary Search Tree", title: "Validate Binary Search Tree", id: 98, difficulty: "Medium", theme: "BST property check" },
    { day: 15, pattern: "Trie", title: "Implement Trie (Prefix Tree)", id: 208, difficulty: "Medium", theme: "Tree of characters" },
    { day: 16, pattern: "Heap / Top K", title: "Kth Largest Element in an Array", id: 215, difficulty: "Medium", theme: "Quick-select or heap" },
    { day: 17, pattern: "Advanced Heap", title: "Find Median from Data Stream", id: 295, difficulty: "Hard", theme: "Two heaps design" },
    { day: 18, pattern: "Backtracking Subsets", title: "Subsets", id: 78, difficulty: "Medium", theme: "Backtracking template" },
    { day: 19, pattern: "Backtracking Permutations", title: "Permutations", id: 46, difficulty: "Medium", theme: "Permutation pattern" },
    { day: 20, pattern: "Hard Backtracking", title: "N-Queens", id: 51, difficulty: "Hard", theme: "Chessboard backtracking" },
    { day: 21, pattern: "Graph DFS / Islands", title: "Number of Islands", id: 200, difficulty: "Medium", theme: "DFS on grid" },
    { day: 22, pattern: "Graph BFS / Multi-source", title: "Rotting Oranges", id: 994, difficulty: "Medium", theme: "Multi-source BFS" },
    { day: 23, pattern: "Topological Sort", title: "Course Schedule", id: 207, difficulty: "Medium", theme: "Cycle detection" },
    { day: 24, pattern: "Union-Find", title: "Number of Provinces", id: 547, difficulty: "Medium", theme: "Disjoint sets" },
    { day: 25, pattern: "1D Dynamic Programming", title: "House Robber", id: 198, difficulty: "Medium", theme: "Linear DP" },
    { day: 26, pattern: "2D DP / LCS", title: "Longest Common Subsequence", id: 1143, difficulty: "Medium", theme: "2D DP table" },
    { day: 27, pattern: "Knapsack / Partition", title: "Partition Equal Subset Sum", id: 416, difficulty: "Medium", theme: "0/1 knapsack" },
    { day: 28, pattern: "Greedy + Intervals", title: "Merge Intervals", id: 56, difficulty: "Medium", theme: "Interval sorting" },
    { day: 29, pattern: "Bit Manipulation", title: "Single Number", id: 136, difficulty: "Easy", theme: "XOR trick" },
    { day: 30, pattern: "Signature Hard", title: "Trapping Rain Water", id: 42, difficulty: "Hard", theme: "Two-pointer / stack" }
];

const outputDir = './src/components/visualizers/problems';

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Generate problem name from title
function getComponentName(title) {
    return title.replace(/[^a-zA-Z0-9]/g, '');
}

// Generate visualization steps for each problem type
function generateSteps(problem) {
    const steps = [];
    const numSteps = 8;

    switch (problem.pattern) {
        case "Prefix Sum": // 560. Subarray Sum Equals K
            for (let i = 0; i < numSteps; i++) {
                const data = [1, 1, 1, 2, -1, 1];
                const prefixSum = data.slice(0, i + 1).reduce((a, b) => a + b, 0);
                steps.push({
                    desc: i === 0 ? "Initialize prefix sum map with {0:1}" : `Process index ${i}, current sum = ${prefixSum}`,
                    formula: `prefixSum[${i}] = ${prefixSum}, looking for sum - k = ${prefixSum - 3}`,
                    data: data,
                    pointers: { i: i },
                    scalars: {
                        prefixSum: prefixSum,
                        target: 3,
                        count: i > 0 ? Math.floor(Math.random() * 3) : 0
                    }
                });
            }
            break;

        case "Two Pointers / Sorted Arrays": // 167. Two Sum II
            for (let i = 0; i < numSteps; i++) {
                const data = [2, 7, 11, 15, 18, 22];
                const left = Math.min(i, data.length - 2);
                const right = data.length - 1 - Math.min(i, 2);
                steps.push({
                    desc: `Checking sum at left=${left} (${data[left]}) and right=${right} (${data[right]})`,
                    formula: `${data[left]} + ${data[right]} = ${data[left] + data[right]}`,
                    data: data,
                    pointers: { left: left, right: right },
                    scalars: { target: 9, sum: data[left] + data[right] }
                });
            }
            break;

        case "Sliding Window": // 3. Longest Substring
            for (let i = 0; i < numSteps; i++) {
                const data = ['a', 'b', 'c', 'a', 'b', 'c', 'b', 'b'];
                const left = Math.max(0, i - 2);
                const right = i;
                const window = data.slice(left, right + 1);
                const unique = new Set(window).size;
                steps.push({
                    desc: `Window [${left},${right}]: "${window.join('')}"`,
                    formula: `unique chars = ${unique}, length = ${window.length}`,
                    data: data,
                    pointers: { left: left, right: right },
                    scalars: {
                        maxLength: Math.max(3, unique),
                        currentSet: `{${[...new Set(window)].join(',')}}`
                    }
                });
            }
            break;

        case "Monotonic Stack": // 739. Daily Temperatures
            for (let i = 0; i < numSteps; i++) {
                const data = [73, 74, 75, 71, 69, 72, 76, 73];
                const stack = data.slice(0, i).filter((_, idx) => idx % 2 === 0);
                steps.push({
                    desc: `Processing index ${i}: temp=${data[i]}, stack has ${stack.length} elements`,
                    formula: data[i] > data[i - 1] ? `Found warmer: ${data[i]} > ${data[i - 1]}` : "Pushing to stack",
                    data: data,
                    pointers: { i: i, top: stack.length - 1 },
                    scalars: {
                        stack: `[${stack.join(',')}]`,
                        result: i > 0 ? i - (i - 1) : 0
                    }
                });
            }
            break;

        case "Stack / Parentheses": // 20. Valid Parentheses
            for (let i = 0; i < numSteps; i++) {
                const data = ['(', '{', '[', ']', '}', ')'];
                const stack = data.slice(0, i).filter((_, idx) => idx < 3);
                steps.push({
                    desc: i < 3 ? `Pushing ${data[i]} to stack` : `Popping ${data[i]} matches ${stack[stack.length - 1]}`,
                    formula: i >= 3 ? `${stack[stack.length - 1]} matches ${data[i]}? ${stack[stack.length - 1] === data[i] ? '✓' : '✗'}` : "",
                    data: data,
                    pointers: { i: i, top: stack.length - 1 },
                    scalars: {
                        stackTop: stack.length > 0 ? stack[stack.length - 1] : 'empty',
                        stackSize: stack.length
                    }
                });
            }
            break;

        case "Binary Search": // 33. Search in Rotated Sorted Array
            for (let i = 0; i < numSteps; i++) {
                const data = [4, 5, 6, 7, 0, 1, 2];
                const mid = Math.floor(i * data.length / numSteps);
                steps.push({
                    desc: `Binary search step: checking middle at index ${mid}`,
                    formula: `data[${mid}] = ${data[mid]}`,
                    data: data,
                    pointers: {
                        left: 0,
                        right: data.length - 1,
                        mid: mid
                    },
                    scalars: { target: 0, found: data[mid] === 0 ? 1 : 0 }
                });
            }
            break;

        case "Binary Search on Answer": // 875. Koko Eating Bananas
            for (let i = 0; i < numSteps; i++) {
                const data = [3, 6, 7, 11];
                const speed = Math.max(1, Math.floor(i * 15 / numSteps));
                const hours = data.reduce((sum, pile) => sum + Math.ceil(pile / speed), 0);
                steps.push({
                    desc: `Testing eating speed = ${speed} bananas/hour`,
                    formula: `Total hours = ${hours}, target hours = 8`,
                    data: data,
                    pointers: { i: i },
                    scalars: {
                        speed: speed,
                        totalHours: hours,
                        feasible: hours <= 8 ? '✓' : '✗'
                    }
                });
            }
            break;

        case "Linked List Cycle / Fast-Slow": // 141. Linked List Cycle
            for (let i = 0; i < numSteps; i++) {
                const data = [3, 2, 0, -4];
                const slow = i % data.length;
                const fast = (i * 2) % data.length;
                steps.push({
                    desc: `Slow pointer at ${slow}, fast pointer at ${fast}`,
                    formula: slow === fast ? "Cycle detected!" : "Moving pointers...",
                    data: data,
                    pointers: { slow: slow, fast: fast },
                    scalars: { hasCycle: slow === fast ? 1 : 0 }
                });
            }
            break;

        case "Linked List Reversal": // 206. Reverse Linked List
            for (let i = 0; i < numSteps; i++) {
                const data = [1, 2, 3, 4, 5];
                const prev = Math.max(-1, i - 1);
                const curr = i;
                steps.push({
                    desc: `Reversing: prev=${prev >= 0 ? data[prev] : 'null'}, curr=${data[curr]}`,
                    formula: `curr.next = prev`,
                    data: data,
                    pointers: { prev: prev, curr: curr, next: i + 1 < data.length ? i + 1 : -1 },
                    scalars: { reversed: `[${data.slice(0, i + 1).reverse().join(',')}]` }
                });
            }
            break;

        case "Advanced Linked List": // 25. Reverse Nodes in k-Group
            for (let i = 0; i < numSteps; i++) {
                const data = [1, 2, 3, 4, 5, 6, 7];
                const k = 3;
                const groupStart = Math.floor(i / k) * k;
                const groupEnd = groupStart + k - 1;
                steps.push({
                    desc: `Processing group ${Math.floor(i / k) + 1}: indices [${groupStart},${groupEnd}]`,
                    formula: `Reversing ${k} nodes in this group`,
                    data: data,
                    pointers: {
                        start: groupStart,
                        end: groupEnd,
                        current: i
                    },
                    scalars: { group: Math.floor(i / k) + 1, k: k }
                });
            }
            break;

        case "Binary Tree Basics": // 543. Diameter of Binary Tree
            for (let i = 0; i < numSteps; i++) {
                const data = [1, 2, 3, 4, 5];
                steps.push({
                    desc: `Computing height at node ${data[i % data.length]}`,
                    formula: `leftHeight = ${i % 3}, rightHeight = ${i % 2}, diameter = ${i % 3 + i % 2}`,
                    data: data,
                    pointers: { node: i % data.length },
                    scalars: {
                        maxDiameter: i,
                        leftHeight: i % 3,
                        rightHeight: i % 2
                    }
                });
            }
            break;

        case "Binary Tree BFS": // 102. Binary Tree Level Order
            for (let i = 0; i < numSteps; i++) {
                const data = [3, 9, 20, null, null, 15, 7];
                const level = Math.floor(i / 2);
                const levelNodes = data.filter((_, idx) => Math.floor(Math.log2(idx + 1)) === level);
                steps.push({
                    desc: `Processing level ${level}: [${levelNodes.filter(n => n !== null).join(',')}]`,
                    formula: `Queue size = ${levelNodes.length}`,
                    data: data,
                    pointers: { level: level, i: i },
                    scalars: {
                        currentLevel: level,
                        nodesInLevel: levelNodes.length
                    }
                });
            }
            break;

        case "Tree Construction": // 105. Construct Binary Tree
            for (let i = 0; i < numSteps; i++) {
                const preorder = [3, 9, 20, 15, 7];
                const inorder = [9, 3, 15, 20, 7];
                steps.push({
                    desc: `Building tree: root = ${preorder[0]}, left subtree from inorder[0...${i}]`,
                    formula: `inorder index of root = ${i}`,
                    data: preorder,
                    pointers: { preIdx: i, inIdx: i },
                    scalars: {
                        root: preorder[0],
                        leftSize: i,
                        rightSize: preorder.length - i - 1
                    }
                });
            }
            break;

        case "Binary Search Tree": // 98. Validate BST
            for (let i = 0; i < numSteps; i++) {
                const data = [2, 1, 3];
                steps.push({
                    desc: `Checking node ${data[i % data.length]}: valid range [${i - 5}, ${i + 5}]`,
                    formula: `${data[i % data.length]} between ${i - 5} and ${i + 5}? ${data[i % data.length] > i - 5 && data[i % data.length] < i + 5 ? '✓' : '✗'}`,
                    data: data,
                    pointers: { node: i % data.length },
                    scalars: {
                        minVal: i - 5,
                        maxVal: i + 5,
                        isValid: 1
                    }
                });
            }
            break;

        case "Trie": // 208. Implement Trie
            for (let i = 0; i < numSteps; i++) {
                const words = ['apple', 'app', 'apricot'];
                const chars = words[i % words.length].split('');
                steps.push({
                    desc: `Inserting '${chars[0]}' → '${chars.slice(0, 2).join('')}' → '${chars.slice(0, 3).join('')}'`,
                    formula: `Creating nodes for each character`,
                    data: chars,
                    pointers: { level: i % chars.length },
                    scalars: {
                        word: words[i % words.length],
                        prefix: chars.slice(0, i % chars.length + 1).join(''),
                        exists: i % 3 === 0 ? '✓' : '✗'
                    }
                });
            }
            break;

        case "Heap / Top K": // 215. Kth Largest
            for (let i = 0; i < numSteps; i++) {
                const data = [3, 2, 1, 5, 6, 4];
                const k = 2;
                const heap = data.slice(0, i + 1).sort((a, b) => a - b);
                steps.push({
                    desc: `Processing element ${data[i]}, heap size = ${heap.length}`,
                    formula: `Heap: [${heap.join(',')}], kth largest = ${heap[heap.length - k] || 'N/A'}`,
                    data: data,
                    pointers: { i: i },
                    scalars: {
                        heapSize: heap.length,
                        kthLargest: heap[heap.length - k] || 0,
                        k: k
                    }
                });
            }
            break;

        case "Advanced Heap": // 295. Find Median
            for (let i = 0; i < numSteps; i++) {
                const data = [1, 2, 3, 4, 5, 6, 7];
                const smallHeap = data.slice(0, Math.ceil(i / 2));
                const largeHeap = data.slice(Math.ceil(i / 2), i);
                steps.push({
                    desc: `Adding ${data[i]}: balancing two heaps`,
                    formula: `small: [${smallHeap.join(',')}], large: [${largeHeap.join(',')}]`,
                    data: data,
                    pointers: { i: i },
                    scalars: {
                        median: i % 2 === 0 ? smallHeap[smallHeap.length - 1] : (smallHeap[smallHeap.length - 1] + largeHeap[0]) / 2,
                        smallSize: smallHeap.length,
                        largeSize: largeHeap.length
                    }
                });
            }
            break;

        case "Backtracking Subsets": // 78. Subsets
            for (let i = 0; i < numSteps; i++) {
                const data = [1, 2, 3];
                const subsets = [];
                for (let j = 0; j <= i; j++) {
                    subsets.push(data.slice(0, j));
                }
                steps.push({
                    desc: `Generating subsets of length ${i}`,
                    formula: `Adding ${i === 0 ? 'empty set' : `[${data.slice(0, i).join(',')}]`}`,
                    data: data,
                    pointers: { i: i % data.length },
                    scalars: {
                        subsetsCount: Math.pow(2, i),
                        currentSubset: `[${data.slice(0, i).join(',')}]`
                    }
                });
            }
            break;

        case "Backtracking Permutations": // 46. Permutations
            for (let i = 0; i < numSteps; i++) {
                const data = [1, 2, 3];
                steps.push({
                    desc: `Building permutation: swapping indices ${i % 3} and ${(i + 1) % 3}`,
                    formula: `swap(${data[i % 3]}, ${data[(i + 1) % 3]})`,
                    data: data,
                    pointers: { i: i % 3, j: (i + 1) % 3 },
                    scalars: {
                        permutation: `[${data[(i + 0) % 3]},${data[(i + 1) % 3]},${data[(i + 2) % 3]}]`,
                        depth: i
                    }
                });
            }
            break;

        case "Hard Backtracking": // 51. N-Queens
            for (let i = 0; i < numSteps; i++) {
                const n = 4;
                const board = Array(n).fill().map(() => Array(n).fill('.'));
                if (i < n) board[i][i] = 'Q';
                steps.push({
                    desc: `Placing queen at row ${i}, col ${i}`,
                    formula: `Checking conflicts: ${i === 0 ? 'none' : 'diagonal conflict?'}`,
                    data: board.flat(),
                    pointers: { row: i, col: i },
                    scalars: {
                        queensPlaced: i,
                        valid: i < 3 ? 1 : 0
                    }
                });
            }
            break;

        case "Graph DFS / Islands": // 200. Number of Islands
            for (let i = 0; i < numSteps; i++) {
                const grid = [
                    [1, 1, 0, 0],
                    [1, 1, 0, 0],
                    [0, 0, 1, 0],
                    [0, 0, 0, 1]
                ];
                const r = Math.floor(i / 4) % 4;
                const c = i % 4;
                steps.push({
                    desc: `DFS exploring cell (${r},${c})`,
                    formula: grid[r][c] === 1 ? "Land found! Mark visited" : "Water, skip",
                    data: grid.flat(),
                    pointers: { r: r, c: c },
                    scalars: {
                        islandsFound: i > 5 ? 2 : 1,
                        visited: `[${r},${c}]`
                    }
                });
            }
            break;

        case "Graph BFS / Multi-source": // 994. Rotting Oranges
            for (let i = 0; i < numSteps; i++) {
                const grid = [
                    [2, 1, 1],
                    [1, 1, 0],
                    [0, 1, 1]
                ];
                const minute = i;
                steps.push({
                    desc: `Minute ${minute}: rotting adjacent oranges`,
                    formula: `Fresh oranges: ${Math.max(0, 7 - minute * 2)}`,
                    data: grid.flat(),
                    pointers: { minute: minute },
                    scalars: {
                        freshCount: Math.max(0, 7 - minute * 2),
                        rottenCount: 2 + minute * 2
                    }
                });
            }
            break;

        case "Topological Sort": // 207. Course Schedule
            for (let i = 0; i < numSteps; i++) {
                const courses = [0, 1, 2, 3, 4];
                const prereqs = [[1, 0], [2, 1], [3, 2], [4, 3]];
                steps.push({
                    desc: `Processing course ${i} with indegree = ${i}`,
                    formula: i === 0 ? "No prerequisites" : `Depends on course ${i - 1}`,
                    data: courses,
                    pointers: { course: i },
                    scalars: {
                        indegree: i,
                        processed: i,
                        hasCycle: i === 4 ? 0 : 1
                    }
                });
            }
            break;

        case "Union-Find": // 547. Number of Provinces
            for (let i = 0; i < numSteps; i++) {
                const cities = [0, 1, 2, 3];
                const connected = [[1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 1, 1], [0, 0, 1, 1]];
                steps.push({
                    desc: `Union city ${i} with ${(i + 1) % 4}`,
                    formula: `parent[${i}] = ${Math.floor(i / 2)}`,
                    data: cities,
                    pointers: { i: i, j: (i + 1) % 4 },
                    scalars: {
                        provinces: 2,
                        unions: Math.floor(i / 2) + 1
                    }
                });
            }
            break;

        case "1D Dynamic Programming": // 198. House Robber
            for (let i = 0; i < numSteps; i++) {
                const houses = [2, 7, 9, 3, 1];
                const dp = [houses[0]];
                for (let j = 1; j <= i; j++) {
                    dp[j] = Math.max((dp[j - 2] || 0) + houses[j], dp[j - 1]);
                }
                steps.push({
                    desc: `Deciding to rob house ${i} (value: ${houses[i]})`,
                    formula: `dp[${i}] = max(dp[${i - 2}] + ${houses[i]}, dp[${i - 1}]) = ${dp[i] || 0}`,
                    data: houses,
                    pointers: { i: i },
                    scalars: {
                        dp: dp[i] || 0,
                        prev1: dp[i - 1] || 0,
                        prev2: dp[i - 2] || 0
                    }
                });
            }
            break;

        case "2D DP / LCS": // 1143. Longest Common Subsequence
            for (let i = 0; i < numSteps; i++) {
                const text1 = ['a', 'b', 'c', 'd', 'e'];
                const text2 = ['a', 'c', 'e'];
                const row = Math.min(i, text1.length - 1);
                const col = Math.min(i, text2.length - 1);
                steps.push({
                    desc: `Comparing '${text1[row]}' with '${text2[col]}'`,
                    formula: text1[row] === text2[col] ? "Match! +1" : "No match, take max",
                    data: text1,
                    pointers: { i: row, j: col },
                    scalars: {
                        lcs: Math.min(row, col),
                        match: text1[row] === text2[col] ? 1 : 0
                    }
                });
            }
            break;

        case "Knapsack / Partition": // 416. Partition Equal Subset Sum
            for (let i = 0; i < numSteps; i++) {
                const nums = [1, 5, 11, 5];
                const target = 11;
                const dp = Array(target + 1).fill(false);
                dp[0] = true;
                for (let j = 0; j <= i && j < nums.length; j++) {
                    for (let s = target; s >= nums[j]; s--) {
                        if (dp[s - nums[j]]) dp[s] = true;
                    }
                }
                steps.push({
                    desc: `Processing number ${nums[i]}, target=${target}`,
                    formula: `Can we make sum = ${i * 3}? ${dp[i * 3] ? '✓' : '✗'}`,
                    data: nums,
                    pointers: { i: i },
                    scalars: {
                        currentSum: i * 3,
                        possible: dp[i * 3] ? 1 : 0,
                        target: target
                    }
                });
            }
            break;

        case "Greedy + Intervals": // 56. Merge Intervals
            for (let i = 0; i < numSteps; i++) {
                const intervals = [[1, 3], [2, 6], [8, 10], [15, 18], [17, 20], [21, 24], [25, 27], [28, 30]];
                const merged = intervals.slice(0, i + 1).reduce((acc, curr) => {
                    if (acc.length === 0) return [curr];
                    const last = acc[acc.length - 1];
                    if (curr[0] <= last[1]) {
                        last[1] = Math.max(last[1], curr[1]);
                        return acc;
                    }
                    return [...acc, curr];
                }, []);
                steps.push({
                    desc: `Merging interval [${intervals[i][0]},${intervals[i][1]}]`,
                    formula: `Merged: [${merged.map(m => `[${m[0]},${m[1]}]`).join(',')}]`,
                    data: intervals.flat(),
                    pointers: { i: i },
                    scalars: {
                        mergedCount: merged.length,
                        current: `[${intervals[i][0]},${intervals[i][1]}]`
                    }
                });
            }
            break;

        case "Bit Manipulation": // 136. Single Number
            for (let i = 0; i < numSteps; i++) {
                const data = [4, 1, 2, 1, 2];
                let xor = 0;
                for (let j = 0; j <= i; j++) {
                    xor ^= data[j];
                }
                steps.push({
                    desc: `XOR so far: ${xor} (binary: ${xor.toString(2)})`,
                    formula: `${xor} ^ ${data[i + 1] || 0} = ${xor ^ (data[i + 1] || 0)}`,
                    data: data,
                    pointers: { i: i },
                    scalars: {
                        xor: xor,
                        binary: xor.toString(2),
                        result: i === data.length - 1 ? xor : 0
                    }
                });
            }
            break;

        case "Signature Hard": // 42. Trapping Rain Water
            for (let i = 0; i < numSteps; i++) {
                const data = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1];
                const leftMax = Math.max(...data.slice(0, i + 1));
                const rightMax = Math.max(...data.slice(i));
                const water = Math.max(0, Math.min(leftMax, rightMax) - data[i]);
                steps.push({
                    desc: `At index ${i}: height=${data[i]}, leftMax=${leftMax}, rightMax=${rightMax}`,
                    formula: `water = min(${leftMax},${rightMax}) - ${data[i]} = ${water}`,
                    data: data,
                    pointers: { i: i },
                    scalars: {
                        total: water * (i + 1),
                        leftMax: leftMax,
                        rightMax: rightMax,
                        currentWater: water
                    }
                });
            }
            break;

        default:
            // Generic fallback
            for (let i = 0; i < numSteps; i++) {
                steps.push({
                    desc: `Processing step ${i + 1}`,
                    formula: `current value = ${i}`,
                    data: [1, 2, 3, 4, 5],
                    pointers: { i: i % 5 },
                    scalars: { count: i }
                });
            }
    }

    return steps;
}

// Generate the JSX file content
function generateJSX(problem) {
    const componentName = getComponentName(problem.title);
    const steps = generateSteps(problem);
    const stepsJSON = JSON.stringify(steps, null, 4);

    return `import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Info } from "lucide-react";

const CHART_PX = 260;

function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
}

// Problem: ${problem.title} (LeetCode ${problem.id})
// Pattern: ${problem.pattern}
// Difficulty: ${problem.difficulty}
// Theme: ${problem.theme}

const VISUALIZATION_STEPS = ${stepsJSON};

export default function ${componentName}() {
    const [stepIndex, setStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speedMs, setSpeedMs] = useState(1200);
    const [showInfo, setShowInfo] = useState(true);

    const maxIndex = VISUALIZATION_STEPS.length - 1;
    const currentStep = VISUALIZATION_STEPS[stepIndex] || VISUALIZATION_STEPS[0];
    const maxValue = Math.max(...currentStep.data.filter(v => typeof v === 'number'));

    useEffect(() => {
        let timer;
        if (isPlaying && stepIndex < maxIndex) {
            timer = setTimeout(() => setStepIndex(s => s + 1), speedMs);
        } else if (stepIndex >= maxIndex) {
            setIsPlaying(false);
        }
        return () => clearTimeout(timer);
    }, [isPlaying, stepIndex, maxIndex, speedMs]);

    const renderData = () => {
        return (
            <div className="flex items-end justify-center gap-2 overflow-x-auto py-4">
                {currentStep.data.map((val, idx) => {
                    const isActive = Object.values(currentStep.pointers || {}).includes(idx);
                    const pointerName = Object.keys(currentStep.pointers || {}).find(key => currentStep.pointers[key] === idx);
                    
                    return (
                        <div key={idx} className="flex flex-col items-center">
                            <div className="relative w-12" style={{ height: CHART_PX }}>
                                {/* Value bar */}
                                <motion.div
                                    animate={{ height: (Math.abs(val) / maxValue) * CHART_PX }}
                                    transition={{ duration: 0.35 }}
                                    className={\`absolute bottom-0 left-0 right-0 rounded-t-md border \${
                                        isActive 
                                            ? "bg-gradient-to-t from-purple-500 to-pink-500 border-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.4)]" 
                                            : "bg-gradient-to-t from-cyan-500 to-blue-500 border-cyan-300"
                                    }\`}
                                >
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-white">
                                        {val}
                                    </div>
                                </motion.div>

                                {/* Pointer indicator */}
                                <AnimatePresence>
                                    {isActive && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            className="absolute -top-12 left-1/2 -translate-x-1/2"
                                        >
                                            <div className="bg-pink-500 text-white px-2 py-1 rounded text-xs font-bold whitespace-nowrap">
                                                {pointerName} ↑
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            <span className="mt-2 text-xs text-gray-400 font-mono">{idx}</span>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="w-full h-full flex flex-col justify-between overflow-y-auto pb-6">
            {/* Info Panel */}
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-l-4 border-blue-400 p-5 rounded-md mb-6 shadow-lg relative mx-4 mt-4">
                <div className="absolute -top-3 left-4 bg-[#0B0C10] px-2 text-xs font-bold text-blue-300">
                    Step {stepIndex + 1} of {VISUALIZATION_STEPS.length}
                </div>
                
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-white text-lg font-medium leading-relaxed pr-8">
                            {currentStep.desc}
                        </h3>
                        
                        <div className="flex gap-2 mt-2">
                            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                                ${problem.pattern}
                            </span>
                            <span className={\`text-xs \${
                                '${problem.difficulty}' === 'Easy' ? 'bg-green-500/20 text-green-300' :
                                '${problem.difficulty}' === 'Medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                'bg-red-500/20 text-red-300'
                            } px-2 py-1 rounded\`}>
                                ${problem.difficulty}
                            </span>
                        </div>
                    </div>
                    
                    <button
                        onClick={() => setShowInfo(!showInfo)}
                        className="p-2 rounded-full hover:bg-white/10 transition-colors"
                    >
                        <Info size={16} className={showInfo ? "text-cyan-400" : "text-gray-500"} />
                    </button>
                </div>
                
                {showInfo && currentStep.formula && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 bg-black/40 border border-white/10 rounded px-4 py-3 font-mono text-pink-300 shadow-inner"
                    >
                        {currentStep.formula}
                    </motion.div>
                )}

                {/* Scalars Display */}
                {currentStep.scalars && Object.keys(currentStep.scalars).length > 0 && (
                    <div className="mt-4 flex gap-3 flex-wrap">
                        {Object.entries(currentStep.scalars).map(([key, val]) => (
                            <motion.div 
                                key={key}
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                className="bg-black/40 border border-cyan-500/30 px-3 py-2 rounded-lg"
                            >
                                <span className="text-cyan-400 text-xs mr-2">{key}:</span>
                                <span className="text-white font-mono">{String(val)}</span>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Speed Control */}
                <div className="mt-4 flex items-center gap-4">
                    <div className="ml-auto flex items-center gap-2">
                        <span className="text-xs text-white/70">Speed</span>
                        <select
                            value={speedMs}
                            onChange={(e) => setSpeedMs(Number(e.target.value))}
                            className="rounded-md border border-white/10 bg-black/30 px-2 py-1.5 text-xs text-white"
                        >
                            <option value={1800}>0.7×</option>
                            <option value={1200}>1×</option>
                            <option value={800}>1.5×</option>
                            <option value={500}>2.4×</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Visualization Area */}
            <div className="flex-1 flex flex-col items-center justify-center px-4">
                <div className="w-full max-w-5xl rounded-xl border border-white/10 bg-black/20 p-4">
                    {renderData()}

                    {/* Step Scrubber */}
                    <div className="mt-4 flex items-center gap-3">
                        <span className="text-xs text-white/60 font-mono">
                            {stepIndex + 1}/{VISUALIZATION_STEPS.length}
                        </span>
                        <input
                            type="range"
                            min={0}
                            max={maxIndex}
                            value={stepIndex}
                            onChange={(e) => {
                                setIsPlaying(false);
                                setStepIndex(Number(e.target.value));
                            }}
                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            aria-label="Step scrubber"
                        />
                    </div>
                </div>
            </div>

            {/* Control Buttons */}
            <div className="mt-4 flex justify-center gap-6 pb-4">
                <button
                    className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10"
                    onClick={() => { setStepIndex(0); setIsPlaying(false); }}
                >
                    <RotateCcw size={20} className="text-gray-300" />
                </button>
                
                <button
                    className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10"
                    onClick={() => setStepIndex(s => clamp(s - 1, 0, maxIndex))}
                    disabled={stepIndex === 0}
                >
                    <SkipBack size={20} className="text-gray-300" />
                </button>
                
                <button
                    className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center transition-transform hover:scale-105 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
                    onClick={() => setIsPlaying(!isPlaying)}
                >
                    {isPlaying ? <Pause size={28} className="text-white" /> : <Play size={28} className="text-white ml-1" />}
                </button>
                
                <button
                    className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors border border-white/10"
                    onClick={() => setStepIndex(s => clamp(s + 1, 0, maxIndex))}
                    disabled={stepIndex === maxIndex}
                >
                    <SkipForward size={20} className="text-gray-300" />
                </button>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="text-center text-[10px] text-gray-600">
                <kbd className="px-1.5 py-0.5 bg-gray-800 rounded">Space</kbd> play/pause · 
                <kbd className="px-1.5 py-0.5 bg-gray-800 rounded ml-1">←</kbd>/<kbd className="px-1.5 py-0.5 bg-gray-800 rounded">→</kbd> step ·
                <kbd className="px-1.5 py-0.5 bg-gray-800 rounded ml-1">H</kbd> toggle info
            </div>
        </div>
    );
}
`;
}

// Generate all files
let indexExports = '';
let indexImports = '';

problemsData.forEach(problem => {
    const componentName = getComponentName(problem.title);

    // Generate JSX file
    const jsxContent = generateJSX(problem);
    fs.writeFileSync(path.join(outputDir, `${componentName}.jsx`), jsxContent);

    // Add to index
    indexImports += `import ${componentName} from './${componentName}.jsx';\n`;
    indexExports += `    ${problem.id}: ${componentName},\n`;

    console.log(`✅ Generated Day ${problem.day}: ${componentName}.jsx`);
});

// Write index file
const indexContent = `// Auto-generated visualizers for 30 DSA problems
// Based on 2025-2026 interview trends

${indexImports}

const visualizers = {
${indexExports}};

export default visualizers;
`;

fs.writeFileSync(path.join(outputDir, 'index.js'), indexContent);

console.log(`\n🎉 Success! Generated ${problemsData.length} visualizer components!`);
console.log(`📁 Location: ${outputDir}`);
console.log("\n📊 Summary:");
problemsData.forEach(p => {
    console.log(`   Day ${p.day.toString().padStart(2)}: ${p.pattern.padStart(25)} - ${p.title}`);
});
