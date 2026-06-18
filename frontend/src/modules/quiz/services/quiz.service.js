// quiz.service.js
import NetInfo from '@react-native-community/netinfo';

import api from '../../../api/api';

// ─── Mock Question Bank ───────────────────────────────────────────
const QUESTION_BANK = {
  'Database Systems': [
    { question: 'What does ACID stand for in databases?', options: ['Atomicity, Consistency, Isolation, Durability', 'Access, Control, Index, Data', 'Aggregation, Consistency, Integrity, Distribution', 'Atomicity, Correctness, Integrity, Durability'], answer: 0 },
    { question: 'Which SQL command is used to remove a table?', options: ['DELETE', 'REMOVE', 'DROP', 'TRUNCATE'], answer: 2 },
    { question: 'Which of the following is a NoSQL database?', options: ['MySQL', 'PostgreSQL', 'Oracle', 'MongoDB'], answer: 3 },
    { question: 'What is a foreign key?', options: ['A key imported from another DB', 'A key that references a primary key in another table', 'An encrypted primary key', 'A composite key with multiple columns'], answer: 1 },
    { question: 'Which normal form eliminates partial dependencies?', options: ['1NF', '2NF', '3NF', 'BCNF'], answer: 1 },
    { question: 'What does an INDEX do in a database?', options: ['Encrypts data', 'Speeds up data retrieval', 'Deletes duplicate rows', 'Creates backups'], answer: 1 },
    { question: 'Which JOIN returns all rows from both tables?', options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'], answer: 3 },
    { question: 'In a relational DB, a table is also called a:', options: ['Tuple', 'Relation', 'Attribute', 'Schema'], answer: 1 },
  ],
  'Data Structures': [
    { question: 'Which data structure follows LIFO order?', options: ['Queue', 'Stack', 'Linked List', 'Heap'], answer: 1 },
    { question: 'What is the time complexity of binary search?', options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'], answer: 2 },
    { question: 'Which traversal visits root FIRST in a binary tree?', options: ['Inorder', 'Postorder', 'Preorder', 'Level-order'], answer: 2 },
    { question: 'A hash table has average-case lookup of:', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'], answer: 2 },
    { question: 'Which structure is best for implementing a priority queue?', options: ['Stack', 'Array', 'Heap', 'Linked List'], answer: 2 },
    { question: 'What is the worst-case for quicksort?', options: ['O(n log n)', 'O(n)', 'O(n²)', 'O(log n)'], answer: 2 },
    { question: 'Which data structure is used in BFS?', options: ['Stack', 'Queue', 'Tree', 'Graph'], answer: 1 },
    { question: 'A deque supports insertion from:', options: ['Front only', 'Rear only', 'Both ends', 'Middle only'], answer: 2 },
  ],
  'Artificial Intelligence': [
    { question: 'Which search algorithm is both complete and optimal?', options: ['DFS', 'Greedy Best-First', 'A* Search', 'Hill Climbing'], answer: 2 },
    { question: 'What is the Turing Test designed to measure?', options: ['Processing speed', 'Machine intelligence', 'Memory capacity', 'Network bandwidth'], answer: 1 },
    { question: 'Which technique is used in AI game-playing (e.g., chess)?', options: ['Minimax', 'Bubble Sort', 'Linear Regression', 'K-Means'], answer: 0 },
    { question: 'What does NLP stand for?', options: ['Neural Learning Protocol', 'Natural Language Processing', 'Network Logic Programming', 'Numeric Learning Process'], answer: 1 },
    { question: 'A* uses which heuristic property?', options: ['Admissible', 'Consistent only', 'Non-monotonic', 'Random'], answer: 0 },
    { question: 'Which is NOT a type of agent in AI?', options: ['Reflex agent', 'Goal-based agent', 'Hybrid agent', 'Reactive compiler'], answer: 3 },
    { question: 'Knowledge representation using IF-THEN rules is called:', options: ['Frame system', 'Semantic network', 'Production system', 'Ontology'], answer: 2 },
    { question: 'Alpha-beta pruning improves which algorithm?', options: ['A*', 'BFS', 'Minimax', 'DFS'], answer: 2 },
  ],
  'Web Engineering': [
    { question: 'What does REST stand for?', options: ['Remote Execution State Transfer', 'Representational State Transfer', 'Reliable Endpoint Service Technology', 'Resource Encoding Standard Transfer'], answer: 1 },
    { question: 'Which HTTP method is idempotent?', options: ['POST', 'PATCH', 'GET', 'DELETE'], answer: 2 },
    { question: 'What is the purpose of CORS?', options: ['Encrypts HTTP traffic', 'Allows cross-origin resource sharing', 'Caches API responses', 'Manages DNS routing'], answer: 1 },
    { question: 'Which status code means "Not Found"?', options: ['200', '301', '403', '404'], answer: 3 },
    { question: 'JWT stands for:', options: ['Java Web Token', 'JSON Web Token', 'JavaScript Worker Thread', 'Joint Web Transfer'], answer: 1 },
    { question: 'Which is NOT a valid HTTP method?', options: ['GET', 'POST', 'SEND', 'DELETE'], answer: 2 },
    { question: 'CSS Flexbox\'s default flex-direction is:', options: ['column', 'row', 'row-reverse', 'column-reverse'], answer: 1 },
    { question: 'What does DOM stand for?', options: ['Data Object Model', 'Document Object Model', 'Dynamic Output Module', 'Design Object Map'], answer: 1 },
  ],
  'Operating Systems': [
    { question: 'Which scheduling algorithm can cause starvation?', options: ['Round Robin', 'FCFS', 'Priority Scheduling', 'Multilevel Queue'], answer: 2 },
    { question: 'What is a deadlock?', options: ['A system crash', 'When processes wait indefinitely for resources held by each other', 'A slow network connection', 'Memory overflow error'], answer: 1 },
    { question: 'Virtual memory allows:', options: ['Programs to use more memory than physically available', 'Faster CPU execution', 'Disk encryption', 'Network acceleration'], answer: 0 },
    { question: 'Which is NOT a deadlock prevention condition to break?', options: ['Mutual exclusion', 'Hold and wait', 'No preemption', 'CPU scheduling'], answer: 3 },
    { question: 'A process in "waiting" state is:', options: ['Running on CPU', 'Waiting for I/O or event', 'Ready but not scheduled', 'Terminated'], answer: 1 },
    { question: 'Which page replacement algorithm is optimal?', options: ['FIFO', 'LRU', 'OPT (Belady\'s)', 'Clock'], answer: 2 },
    { question: 'Semaphores are used for:', options: ['File compression', 'Process synchronization', 'Memory allocation', 'CPU scheduling'], answer: 1 },
    { question: 'Fork() in Unix creates a:', options: ['Thread', 'File', 'Child process', 'Socket'], answer: 2 },
  ],
  'Computer Networks': [
    { question: 'Which layer of OSI handles routing?', options: ['Data Link', 'Network', 'Transport', 'Session'], answer: 1 },
    { question: 'What does TCP guarantee that UDP does not?', options: ['Speed', 'Reliability & ordering', 'Encryption', 'Low latency'], answer: 1 },
    { question: 'What is the range of a Class A IP address?', options: ['0.0.0.0 – 127.255.255.255', '128.0.0.0 – 191.255.255.255', '192.0.0.0 – 223.255.255.255', '224.0.0.0 – 239.255.255.255'], answer: 0 },
    { question: 'DNS translates:', options: ['IP to MAC address', 'Domain names to IP addresses', 'HTTP to HTTPS', 'Data to packets'], answer: 1 },
    { question: 'Which protocol is used to assign IP addresses automatically?', options: ['FTP', 'SMTP', 'DHCP', 'SNMP'], answer: 2 },
    { question: 'A subnet mask of /24 means:', options: ['8 host bits', '24 host bits', '24 network bits', '8 network bits'], answer: 2 },
    { question: 'HTTP runs on which port by default?', options: ['21', '25', '80', '443'], answer: 2 },
    { question: 'Which topology has a single point of failure at the center?', options: ['Ring', 'Mesh', 'Bus', 'Star'], answer: 3 },
  ],
  'Machine Learning': [
    { question: 'Overfitting occurs when a model:', options: ['Performs well on training but poor on test data', 'Has too few parameters', 'Is trained on too much data', 'Uses linear regression'], answer: 0 },
    { question: 'Which technique reduces overfitting?', options: ['Increasing model complexity', 'Removing training data', 'Regularization (L1/L2)', 'Increasing learning rate'], answer: 2 },
    { question: 'k-Nearest Neighbors is a:', options: ['Unsupervised learning algorithm', 'Supervised learning algorithm', 'Reinforcement learning method', 'Genetic algorithm'], answer: 1 },
    { question: 'What does gradient descent minimize?', options: ['The accuracy', 'The loss/cost function', 'The number of layers', 'The dataset size'], answer: 1 },
    { question: 'A confusion matrix is used for:', options: ['Clustering results', 'Evaluating classification models', 'Reducing dimensions', 'Generating data'], answer: 1 },
    { question: 'Which is an unsupervised learning algorithm?', options: ['SVM', 'Decision Tree', 'K-Means Clustering', 'Logistic Regression'], answer: 2 },
    { question: 'Precision is defined as:', options: ['TP / (TP + FN)', 'TP / (TP + FP)', 'TN / (TN + FP)', 'FP / (FP + TN)'], answer: 1 },
    { question: 'Which activation function is used in output layer for binary classification?', options: ['ReLU', 'Tanh', 'Sigmoid', 'Softmax'], answer: 2 },
  ],
};

// Generic fallback questions for courses not in the bank
const GENERIC_QUESTIONS = [
  { question: 'Which principle in CS promotes code reusability?', options: ['Abstraction', 'Redundancy', 'Hardcoding', 'Mutation'], answer: 0 },
  { question: 'What does "API" stand for?', options: ['Application Program Interface', 'Automated Processing Input', 'Applied Protocol Integration', 'Application Port Interface'], answer: 0 },
  { question: 'Which paradigm treats computation as evaluation of mathematical functions?', options: ['OOP', 'Procedural', 'Functional Programming', 'Event-Driven'], answer: 2 },
  { question: 'Version control systems like Git are used to:', options: ['Compile code', 'Track and manage code changes', 'Run unit tests', 'Deploy applications'], answer: 1 },
  { question: 'A compiler translates:', options: ['Machine code to assembly', 'High-level code to machine code', 'HTML to CSS', 'Python to JavaScript'], answer: 1 },
  { question: 'Which data type stores True or False?', options: ['Integer', 'String', 'Float', 'Boolean'], answer: 3 },
  { question: 'Big-O notation describes:', options: ['Exact runtime', 'Algorithm complexity', 'Memory addresses', 'Compilation time'], answer: 1 },
  { question: 'An IDE stands for:', options: ['Integrated Development Environment', 'Internal Data Engine', 'Interface Design Editor', 'Indexed Document Engine'], answer: 0 },
];

// ─── Helper ─────────────────────────────────────────────────────────
const getOfflineQuestions = (topic, numQuestions) => {
  const bank = QUESTION_BANK[topic] || GENERIC_QUESTIONS;
  const result = [];
  for (let i = 0; i < numQuestions; i++) {
    result.push({ ...bank[i % bank.length], id: `q_${i}` });
  }
  return result;
};

// ─── AI Prompt + Response Parsing ───
const buildPrompt = (topic, difficulty, numQuestions) => [
  {
    role: 'user',
    content: `Generate ${numQuestions} multiple-choice questions about "${topic}" at a ${difficulty} difficulty level, suitable for a Computer Science university student.

Respond with ONLY valid JSON, no markdown formatting, no code fences, no explanation — exactly this shape:

{
  "questions": [
    { "question": "string", "options": ["string", "string", "string", "string"], "answer": 0 }
  ]
}

"answer" is the zero-based index (0-3) of the correct option. Generate exactly ${numQuestions} questions.`,
  },
];

const parseAIResponse = (rawText, numQuestions) => {
  const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
  const parsed = JSON.parse(cleaned);

  if (!parsed.questions || !Array.isArray(parsed.questions) || parsed.questions.length === 0) {
    throw new Error('AI response missing a valid questions array.');
  }

  return parsed.questions.slice(0, numQuestions).map((q, i) => ({
    id: `q_${i}`,
    question: q.question,
    options: q.options,
    answer: q.answer,
  }));
};

// ─── Main Service ───
export const generateQuiz = async (topic, difficulty, numQuestions) => {
  // 1. Check connectivity first — skip the AI attempt entirely if offline
  const netState = await NetInfo.fetch();
  const isOnline = netState.isConnected && netState.isInternetReachable !== false;

  if (!isOnline) {
    return {
      questions: getOfflineQuestions(topic, numQuestions),
      topic, difficulty, numQuestions,
      source: 'offline',
    };
  }

  // 2. Try AI generation with automatic model fallback
try {
  const response = await api.post('/quiz/generate', { topic, difficulty, numQuestions });
  return { ...response.data, topic, difficulty, numQuestions };
} catch (err) {
  console.log('Backend AI generation failed, falling back to offline bank:', err.message);
  return { questions: getOfflineQuestions(topic, numQuestions), topic, difficulty, numQuestions, source: 'offline' };
}
};


