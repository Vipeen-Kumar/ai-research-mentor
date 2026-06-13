/**
 * Curated Learning Content Provider
 * Provides detailed learning content for various topics
 * Topics are organized by subject area for easy maintenance
 */

import type { LearningContent } from "@/features/learning/types/learning";

/**
 * Linear Algebra Content
 */
export const linearAlgebraContent: LearningContent = {
  nodeId: "linear-algebra",
  title: "Linear Algebra",
  difficulty: "Beginner",
  estimatedDuration: 2,
  description:
    "Mathematical study of vectors, matrices, and linear transformations that form the foundation of data science and machine learning.",
  whyMatters:
    "Linear algebra is essential for understanding how neural networks process data, how machine learning algorithms optimize parameters, and how data is represented and transformed in computational systems.",
  keyConcepts: [
    {
      title: "Vectors and Matrices",
      description:
        "Fundamental data structures for representing and manipulating numerical information",
    },
    {
      title: "Matrix Operations",
      description:
        "Addition, multiplication, transposition, and inversion operations that are core to all algorithms",
    },
    {
      title: "Eigenvalues and Eigenvectors",
      description:
        "Special properties that unlock dimensionality reduction and understanding of system behavior",
    },
    {
      title: "Vector Spaces and Subspaces",
      description:
        "Geometric intuition for understanding high-dimensional data and linear relationships",
    },
  ],
  recommendedResources: [
    {
      title: "Essence of Linear Algebra",
      type: "video",
      author: "3Blue1Brown",
      url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab",
    },
    {
      title: "Introduction to Linear Algebra",
      type: "book",
      author: "Gilbert Strang",
    },
    {
      title: "Linear Algebra Review and Reference",
      type: "article",
      author: "Stanford CS229",
    },
    {
      title: "NumPy Linear Algebra Tutorial",
      type: "course",
      author: "DataCamp",
    },
  ],
  relatedTopics: [
    { id: "matrices", title: "Matrix Decomposition", difficulty: "Intermediate" },
    { id: "eigenvalues", title: "Eigenvalue Problems", difficulty: "Intermediate" },
    { id: "probability", title: "Probability Basics", difficulty: "Beginner" },
  ],
};

/**
 * Probability Content
 */
export const probabilityContent: LearningContent = {
  nodeId: "probability",
  title: "Probability Theory",
  difficulty: "Beginner",
  estimatedDuration: 2,
  description:
    "Mathematical framework for quantifying uncertainty and making predictions based on incomplete information.",
  whyMatters:
    "Probability is the foundation of all machine learning and statistical inference. Understanding probability enables you to design robust algorithms, quantify uncertainty, and make data-driven decisions.",
  keyConcepts: [
    {
      title: "Probability Fundamentals",
      description:
        "Basic rules, axioms, and definitions that govern probabilistic reasoning",
    },
    {
      title: "Distributions",
      description:
        "Binomial, normal, exponential, and other distributions that model real-world phenomena",
    },
    {
      title: "Conditional Probability",
      description:
        "How to update beliefs when new information becomes available",
    },
    {
      title: "Independence and Dependence",
      description:
        "Understanding when events affect each other and how to model these relationships",
    },
    {
      title: "Expected Value and Variance",
      description:
        "Key statistical measures that characterize uncertainty and variability",
    },
  ],
  recommendedResources: [
    {
      title: "Probability for Data Science",
      type: "course",
      author: "MIT OpenCourseWare",
    },
    {
      title: "Introduction to Probability",
      type: "book",
      author: "Dimitri Bertsekas & John Tsitsiklis",
    },
    {
      title: "Probability Cheat Sheet",
      type: "article",
      author: "Stanford CS109",
    },
    {
      title: "Interactive Probability Visualizations",
      type: "video",
      author: "3Blue1Brown",
    },
  ],
  relatedTopics: [
    { id: "bayesian", title: "Bayesian Estimation", difficulty: "Intermediate" },
    { id: "statistics", title: "Statistics", difficulty: "Intermediate" },
    { id: "calculus", title: "Calculus Review", difficulty: "Beginner" },
  ],
};

/**
 * Bayesian Estimation Content
 */
export const bayesianContent: LearningContent = {
  nodeId: "bayesian-estimation",
  title: "Bayesian Estimation",
  difficulty: "Intermediate",
  estimatedDuration: 3,
  description:
    "Statistical approach to updating beliefs using Bayes' theorem and prior knowledge to make probabilistic inferences.",
  whyMatters:
    "Bayesian methods are fundamental to many modern applications including spam filtering, medical diagnosis, autonomous vehicles, and state estimation in robotics. They provide a principled way to combine prior knowledge with observed data.",
  keyConcepts: [
    {
      title: "Bayes' Theorem",
      description:
        "The fundamental equation relating conditional probabilities: P(A|B) = P(B|A)P(A)/P(B)",
    },
    {
      title: "Prior, Likelihood, and Posterior",
      description:
        "The three components of Bayesian inference and their roles in updating beliefs",
    },
    {
      title: "Conjugate Priors",
      description:
        "Clever choices of priors that make computation tractable and interpretable",
    },
    {
      title: "Maximum A Posteriori (MAP)",
      description:
        "Finding the most likely explanation given data and prior knowledge",
    },
    {
      title: "Bayesian Networks",
      description:
        "Graphical models that represent probabilistic relationships between variables",
    },
  ],
  recommendedResources: [
    {
      title: "Bayesian Methods for Hackers",
      type: "book",
      author: "Cam Davidson-Pilon",
    },
    {
      title: "Bayesian Estimation",
      type: "course",
      author: "UC Berkeley EECS",
    },
    {
      title: "Bayes' Theorem Explanation",
      type: "video",
      author: "3Blue1Brown",
      url: "https://www.youtube.com/watch?v=HZGCoVwiada",
    },
    {
      title: "PyMC3 Tutorial",
      type: "article",
      author: "DataCamp",
    },
  ],
  relatedTopics: [
    { id: "state-space", title: "State Space Models", difficulty: "Intermediate" },
    { id: "kalman", title: "Kalman Filter", difficulty: "Advanced" },
    { id: "probability", title: "Probability Theory", difficulty: "Beginner" },
  ],
};

/**
 * State Space Models Content
 */
export const stateSpaceContent: LearningContent = {
  nodeId: "state-space-models",
  title: "State Space Models",
  difficulty: "Intermediate",
  estimatedDuration: 3,
  description:
    "Mathematical framework for modeling dynamic systems where the internal state evolves over time and produces observable outputs.",
  whyMatters:
    "State space models are the foundation for understanding dynamical systems, time series analysis, and control theory. They're essential for modeling anything that changes over time, from stock prices to robot motion.",
  keyConcepts: [
    {
      title: "State Representation",
      description:
        "Capturing the minimal information needed to describe a system at any time",
    },
    {
      title: "State Transition Models",
      description:
        "How the system evolves from one state to the next based on dynamics and noise",
    },
    {
      title: "Observation Models",
      description:
        "The relationship between hidden states and what we can actually measure",
    },
    {
      title: "Markov Property",
      description:
        "The assumption that future states depend only on the current state, not history",
    },
    {
      title: "Hidden Markov Models (HMM)",
      description:
        "A specific class of state space models widely used in speech recognition and bioinformatics",
    },
  ],
  recommendedResources: [
    {
      title: "Introduction to State Space Modeling",
      type: "course",
      author: "MIT OpenCourseWare",
    },
    {
      title: "State Space Methods",
      type: "book",
      author: "Stochastic Modeling & Control",
    },
    {
      title: "HMM Comprehensive Guide",
      type: "article",
      author: "Machine Learning Mastery",
    },
    {
      title: "Markov Chains Explained",
      type: "video",
      author: "Normalized Nerd",
    },
  ],
  relatedTopics: [
    { id: "kalman", title: "Kalman Filter", difficulty: "Advanced" },
    { id: "bayesian", title: "Bayesian Estimation", difficulty: "Intermediate" },
    { id: "dynamics", title: "System Dynamics", difficulty: "Advanced" },
  ],
};

/**
 * Kalman Filter Content
 */
export const kalmanFilterContent: LearningContent = {
  nodeId: "kalman-filter",
  title: "Kalman Filter",
  difficulty: "Advanced",
  estimatedDuration: 4,
  description:
    "Optimal recursive algorithm for estimating the state of a linear system from noisy measurements by combining predictions with observations.",
  whyMatters:
    "The Kalman filter is one of the most important algorithms in modern technology. It's used in GPS navigation, autonomous vehicles, aircraft control, robotics, weather prediction, and countless other applications where you need to estimate hidden state from noisy observations.",
  keyConcepts: [
    {
      title: "Prediction Step",
      description:
        "Using the system model to predict the next state based on the current state estimate",
    },
    {
      title: "Update Step",
      description:
        "Correcting the prediction based on new measurements and their uncertainty",
    },
    {
      title: "Kalman Gain",
      description:
        "The optimal weighting between prediction and measurement that minimizes estimation error",
    },
    {
      title: "Covariance Matrices",
      description:
        "Quantifying uncertainty in state estimates and measurements",
    },
    {
      title: "Extended Kalman Filter (EKF)",
      description:
        "Extending Kalman filtering to nonlinear systems through linearization",
    },
    {
      title: "Unscented Kalman Filter (UKF)",
      description:
        "An alternative approach to nonlinear filtering using deterministic sampling",
    },
  ],
  recommendedResources: [
    {
      title: "Kalman and Bayesian Filters in Python",
      type: "book",
      author: "Roger R. Labbe Jr.",
      url: "https://filterpy.readthedocs.io/",
    },
    {
      title: "Kalman Filter Intuitive Explanation",
      type: "video",
      author: "3Blue1Brown (Applied Science)",
    },
    {
      title: "The Kalman Filter: An Intuitive Introduction",
      type: "article",
      author: "Medium - Towards Data Science",
    },
    {
      title: "Kalman Filter in Robotics",
      type: "course",
      author: "University of Minnesota",
    },
  ],
  relatedTopics: [
    { id: "state-space", title: "State Space Models", difficulty: "Intermediate" },
    { id: "bayesian", title: "Bayesian Estimation", difficulty: "Intermediate" },
    { id: "robotics", title: "Robotics Basics", difficulty: "Advanced" },
  ],
};

/**
 * Python Programming Content
 */
export const pythonContent: LearningContent = {
  nodeId: "python",
  title: "Python Programming",
  difficulty: "Beginner",
  estimatedDuration: 2,
  description:
    "Learn Python programming language fundamentals and best practices essential for data science and machine learning.",
  whyMatters:
    "Python has become the de facto standard language for data science and machine learning. Learning Python enables you to implement algorithms, work with data, and leverage powerful libraries like NumPy, SciPy, and TensorFlow.",
  keyConcepts: [
    {
      title: "Syntax and Data Types",
      description:
        "Variables, strings, numbers, lists, dictionaries, and other fundamental data structures",
    },
    {
      title: "Control Flow",
      description:
        "Conditional statements, loops, and functions for controlling program execution",
    },
    {
      title: "Object-Oriented Programming",
      description:
        "Classes, objects, inheritance, and polymorphism for organizing code",
    },
    {
      title: "Python Libraries",
      description:
        "NumPy, Pandas, Matplotlib, and other essential libraries for scientific computing",
    },
  ],
  recommendedResources: [
    {
      title: "Python Official Tutorial",
      type: "article",
      author: "Python Software Foundation",
      url: "https://docs.python.org/3/tutorial/",
    },
    {
      title: "Python for Data Analysis",
      type: "book",
      author: "Wes McKinney",
    },
    {
      title: "Automate the Boring Stuff with Python",
      type: "course",
      author: "Udemy",
    },
    {
      title: "Python Programming Crash Course",
      type: "video",
      author: "Real Python",
    },
  ],
  relatedTopics: [
    { id: "numpy", title: "NumPy Fundamentals", difficulty: "Beginner" },
    { id: "pandas", title: "Pandas Data Manipulation", difficulty: "Intermediate" },
    { id: "cv", title: "Computer Vision", difficulty: "Intermediate" },
  ],
};

/**
 * Computer Vision Content
 */
export const computerVisionContent: LearningContent = {
  nodeId: "computer-vision",
  title: "Computer Vision",
  difficulty: "Intermediate",
  estimatedDuration: 3,
  description:
    "Techniques for extracting meaningful information from images and videos to enable machines to understand visual content.",
  whyMatters:
    "Computer vision powers applications from facial recognition to autonomous vehicles to medical imaging. Understanding visual processing principles enables you to build systems that can interpret and act on visual information.",
  keyConcepts: [
    {
      title: "Image Representation",
      description:
        "How images are digitally represented as pixels, channels, and color spaces",
    },
    {
      title: "Image Filtering and Enhancement",
      description:
        "Techniques to extract features and improve image quality",
    },
    {
      title: "Edge Detection and Segmentation",
      description:
        "Identifying boundaries and regions of interest in images",
    },
    {
      title: "Feature Extraction",
      description:
        "Extracting distinctive patterns and characteristics from images",
    },
    {
      title: "Deep Learning for Vision",
      description:
        "Using neural networks for image classification, detection, and segmentation",
    },
  ],
  recommendedResources: [
    {
      title: "Computer Vision: Algorithms and Applications",
      type: "book",
      author: "Richard Szeliski",
    },
    {
      title: "OpenCV Tutorials",
      type: "article",
      author: "OpenCV Documentation",
      url: "https://docs.opencv.org/master/d9/df8/tutorial_root.html",
    },
    {
      title: "Deep Learning for Computer Vision",
      type: "course",
      author: "Stanford CS231N",
    },
    {
      title: "Image Processing Playlist",
      type: "video",
      author: "StatQuest",
    },
  ],
  relatedTopics: [
    { id: "cnn", title: "Convolutional Neural Networks", difficulty: "Advanced" },
    { id: "object-detection", title: "Object Detection", difficulty: "Advanced" },
    { id: "python", title: "Python Programming", difficulty: "Beginner" },
  ],
};

/**
 * CNNs Content
 */
export const cnnContent: LearningContent = {
  nodeId: "cnns",
  title: "Convolutional Neural Networks",
  difficulty: "Advanced",
  estimatedDuration: 4,
  description:
    "Deep learning architecture specialized for processing grid-like data (images) through convolutional filters and pooling operations.",
  whyMatters:
    "CNNs are the state-of-the-art approach for image recognition, medical imaging, and autonomous vehicle perception. Understanding CNNs is essential for working with modern computer vision systems.",
  keyConcepts: [
    {
      title: "Convolution Operation",
      description:
        "Sliding filters across images to extract local features and patterns",
    },
    {
      title: "Pooling Layers",
      description:
        "Downsampling operations that reduce spatial dimensions and extract invariant features",
    },
    {
      title: "Activation Functions",
      description:
        "ReLU, sigmoid, and other functions that introduce non-linearity",
    },
    {
      title: "Architecture Design",
      description:
        "Building effective CNN architectures like VGG, ResNet, and MobileNet",
    },
    {
      title: "Transfer Learning",
      description:
        "Leveraging pre-trained models to solve new vision tasks efficiently",
    },
  ],
  recommendedResources: [
    {
      title: "CS231N: Convolutional Neural Networks for Visual Recognition",
      type: "course",
      author: "Stanford University",
      url: "http://cs231n.stanford.edu/",
    },
    {
      title: "Deep Learning",
      type: "book",
      author: "Ian Goodfellow, Yoshua Bengio, Aaron Courville",
    },
    {
      title: "CNN Architecture Explained",
      type: "article",
      author: "Towards Data Science",
    },
    {
      title: "Convolutional Neural Networks Explained",
      type: "video",
      author: "StatQuest with Josh Starmer",
    },
  ],
  relatedTopics: [
    { id: "object-detection", title: "Object Detection", difficulty: "Advanced" },
    { id: "computer-vision", title: "Computer Vision", difficulty: "Intermediate" },
    { id: "deep-learning", title: "Deep Learning Basics", difficulty: "Intermediate" },
  ],
};

/**
 * Object Detection Content
 */
export const objectDetectionContent: LearningContent = {
  nodeId: "object-detection",
  title: "Object Detection",
  difficulty: "Advanced",
  estimatedDuration: 4,
  description:
    "Computer vision techniques to localize and classify multiple objects within an image using bounding boxes and confidence scores.",
  whyMatters:
    "Object detection is crucial for autonomous vehicles, surveillance systems, robotics, and retail analytics. It combines localization and classification to understand what objects are present and where they are located.",
  keyConcepts: [
    {
      title: "Region-based Methods",
      description:
        "R-CNN family of architectures that generate region proposals",
    },
    {
      title: "Single-shot Detection",
      description:
        "Fast methods like YOLO and SSD that detect objects in one pass",
    },
    {
      title: "Anchor Boxes",
      description:
        "Predefined boxes of various sizes to match objects at different scales",
    },
    {
      title: "Non-Maximum Suppression",
      description:
        "Eliminating redundant detections and keeping only the most confident predictions",
    },
    {
      title: "Evaluation Metrics",
      description:
        "mAP, precision, recall, and IoU for measuring detection performance",
    },
  ],
  recommendedResources: [
    {
      title: "You Only Look Once (YOLO) Papers",
      type: "paper",
      author: "Redmon et al.",
    },
    {
      title: "Object Detection with Deep Learning",
      type: "course",
      author: "Coursera - Andrew Ng",
    },
    {
      title: "Object Detection Explained",
      type: "article",
      author: "Machine Learning Mastery",
    },
    {
      title: "YOLO v8 Complete Guide",
      type: "video",
      author: "Roboflow YouTube",
    },
  ],
  relatedTopics: [
    { id: "cnn", title: "Convolutional Neural Networks", difficulty: "Advanced" },
    { id: "computer-vision", title: "Computer Vision", difficulty: "Intermediate" },
    { id: "reinforcement", title: "Reinforcement Learning", difficulty: "Advanced" },
  ],
};

/**
 * Reinforcement Learning Content
 */
export const reinforcementLearningContent: LearningContent = {
  nodeId: "reinforcement-learning",
  title: "Reinforcement Learning",
  difficulty: "Advanced",
  estimatedDuration: 4,
  description:
    "Machine learning paradigm where agents learn optimal behaviors through interaction with an environment by receiving rewards and penalties.",
  whyMatters:
    "Reinforcement learning enables systems to learn complex behaviors autonomously, from game-playing AIs (AlphaGo, AlphaZero) to robot control to resource optimization. It's fundamental to building intelligent autonomous agents.",
  keyConcepts: [
    {
      title: "Agents and Environments",
      description:
        "The interaction model where agents take actions and receive rewards",
    },
    {
      title: "Markov Decision Processes",
      description:
        "The mathematical framework underlying reinforcement learning",
    },
    {
      title: "Value Functions",
      description:
        "Estimating expected long-term rewards from states or state-action pairs",
    },
    {
      title: "Q-Learning",
      description:
        "Model-free algorithm for learning optimal actions without knowing environment dynamics",
    },
    {
      title: "Policy Gradient Methods",
      description:
        "Directly optimizing the policy that determines action selection",
    },
    {
      title: "Actor-Critic Methods",
      description:
        "Combining value-based and policy-based approaches for better learning",
    },
  ],
  recommendedResources: [
    {
      title: "Reinforcement Learning: An Introduction",
      type: "book",
      author: "Richard Sutton & Andrew Barto",
    },
    {
      title: "Deep Reinforcement Learning Specialization",
      type: "course",
      author: "Coursera - University of Alberta",
    },
    {
      title: "Spinning Up in Deep RL",
      type: "article",
      author: "OpenAI",
      url: "https://spinningup.openai.com/",
    },
    {
      title: "Reinforcement Learning Explained",
      type: "video",
      author: "StatQuest with Josh Starmer",
    },
  ],
  relatedTopics: [
    { id: "markov", title: "Markov Chains", difficulty: "Intermediate" },
    { id: "optimization", title: "Optimization Methods", difficulty: "Advanced" },
    { id: "python", title: "Python Programming", difficulty: "Beginner" },
  ],
};

/**
 * Content Lookup Map
 * Easily extensible: add topic → content mappings here
 */
export const learningContentMap: Record<string, LearningContent> = {
  "linear-algebra": linearAlgebraContent,
  "linear algebra": linearAlgebraContent,
  probability: probabilityContent,
  "probability theory": probabilityContent,
  "bayesian-estimation": bayesianContent,
  "bayesian estimation": bayesianContent,
  "state-space-models": stateSpaceContent,
  "state space models": stateSpaceContent,
  "kalman-filter": kalmanFilterContent,
  "kalman filter": kalmanFilterContent,
  python: pythonContent,
  "computer-vision": computerVisionContent,
  "computer vision": computerVisionContent,
  cnns: cnnContent,
  "convolutional neural networks": cnnContent,
  "object-detection": objectDetectionContent,
  "object detection": objectDetectionContent,
  "reinforcement-learning": reinforcementLearningContent,
  "reinforcement learning": reinforcementLearningContent,
};

/**
 * Get learning content for a topic
 * Returns curated content if available, otherwise returns placeholder
 */
export function getLearningContent(
  nodeId: string,
  title: string,
  difficulty: "Beginner" | "Intermediate" | "Advanced",
  estimatedDuration: number,
  description: string,
): LearningContent {
  // Normalize the lookup key (lowercase, trim)
  const lookupKey = title.toLowerCase().trim();

  // Check if we have curated content for this topic
  if (learningContentMap[lookupKey]) {
    return learningContentMap[lookupKey];
  }

  // Check if nodeId matches any curated content
  if (learningContentMap[nodeId]) {
    return learningContentMap[nodeId];
  }

  // Return placeholder content for unknown topics
  return {
    nodeId,
    title,
    difficulty,
    estimatedDuration,
    description,
    whyMatters: `Understanding ${title} is crucial for developing a strong foundation in this subject. This topic forms the basis for more advanced concepts and practical applications in machine learning, data science, and related fields.`,
    keyConcepts: [
      {
        title: "Fundamentals",
        description: `Core principles and foundational concepts of ${title}`,
      },
      {
        title: "Theory",
        description: `Theoretical framework and mathematical foundations`,
      },
      {
        title: "Applications",
        description: `Real-world applications and practical use cases`,
      },
      {
        title: "Advanced Topics",
        description: `Advanced concepts and frontier research areas`,
      },
    ],
    recommendedResources: [
      {
        title: `Introduction to ${title}`,
        type: "article",
        author: "Educational Resources",
      },
      {
        title: `${title} Complete Guide`,
        type: "course",
        author: "Online Learning Platform",
      },
      {
        title: `${title} Deep Dive`,
        type: "video",
        author: "Educational Channel",
      },
      {
        title: `${title} Research Papers`,
        type: "paper",
        author: "Academic Community",
      },
    ],
    relatedTopics: [
      {
        id: "foundations",
        title: "Foundational Concepts",
        difficulty: "Beginner",
      },
      {
        id: "applications",
        title: "Applied Topics",
        difficulty: difficulty,
      },
      {
        id: "advanced",
        title: "Advanced Techniques",
        difficulty: "Advanced",
      },
    ],
  };
}
