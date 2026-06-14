import logging
from app.services.ai.base_provider import BaseRoadmapProvider, GeneratedRoadmap, GeneratedRoadmapNode

logger = logging.getLogger(__name__)

ROADMAP_LIBRARY: dict[str, GeneratedRoadmap] = {
    "kalman filter": GeneratedRoadmap(
        topic="Kalman Filter",
        summary="A staged path from math foundations to recursive state estimation.",
        nodes=[
            GeneratedRoadmapNode(
                title="Linear Algebra",
                description="Review vectors, matrices, eigenvalues, and linear transformations used in state updates.",
                subtopics=["Vectors", "Matrices", "Eigenvalues", "Linear Transformations"],
            ),
            GeneratedRoadmapNode(
                title="Probability",
                description="Learn Gaussian distributions, expectation, variance, and covariance matrices.",
                subtopics=["Gaussian distributions", "Expectation", "Variance", "Covariance matrices"],
            ),
            GeneratedRoadmapNode(
                title="Bayesian Estimation",
                description="Understand priors, posteriors, and recursive belief updates for uncertain systems.",
                subtopics=["Priors", "Posteriors", "Recursive belief updates", "Uncertain systems"],
            ),
            GeneratedRoadmapNode(
                title="State Space Models",
                description="Model dynamic systems with hidden states, transitions, controls, and observations.",
                subtopics=["Hidden states", "Transitions", "Controls", "Observations"],
            ),
            GeneratedRoadmapNode(
                title="Kalman Filter",
                description="Combine prediction and correction steps to estimate state from noisy measurements.",
                subtopics=["Prediction step", "Correction step", "State estimation", "Noisy measurements"],
            ),
        ],
    ),
    "computer vision": GeneratedRoadmap(
        topic="Computer Vision",
        summary="A progression from implementation basics to modern visual recognition systems.",
        nodes=[
            GeneratedRoadmapNode(
                title="Python",
                description="Build fluency with NumPy, plotting, and data pipelines for vision experiments.",
                subtopics=["NumPy", "Plotting", "Data pipelines", "Vision experiments"],
            ),
            GeneratedRoadmapNode(
                title="Linear Algebra",
                description="Cover vectors, matrices, convolutions, and geometric transformations for images.",
                subtopics=["Vectors", "Matrices", "Convolutions", "Geometric transformations"],
            ),
            GeneratedRoadmapNode(
                title="Image Processing",
                description="Study filtering, edge detection, color spaces, and feature extraction techniques.",
                subtopics=["Filtering", "Edge detection", "Color spaces", "Feature extraction"],
            ),
            GeneratedRoadmapNode(
                title="CNNs",
                description="Understand convolutional neural networks for representation learning on images.",
                subtopics=["Convolutional layers", "Pooling layers", "Activation functions", "Backpropagation"],
            ),
            GeneratedRoadmapNode(
                title="Object Detection",
                description="Learn region-based and one-stage detectors for locating and classifying objects.",
                subtopics=["Region-based detectors", "One-stage detectors", "Locating objects", "Classifying objects"],
            ),
        ],
    ),
    "reinforcement learning": GeneratedRoadmap(
        topic="Reinforcement Learning",
        summary="A path from probabilistic decision making to policy optimization.",
        nodes=[
            GeneratedRoadmapNode(
                title="Python",
                description="Practice vectorized environments, plotting, and experiment tracking in Python.",
                subtopics=["Vectorized environments", "Plotting", "Experiment tracking", "Python"],
            ),
            GeneratedRoadmapNode(
                title="Probability and Statistics",
                description="Review expected return, sampling, distributions, and uncertainty in sequential data.",
                subtopics=["Expected return", "Sampling", "Distributions", "Uncertainty"],
            ),
            GeneratedRoadmapNode(
                title="Dynamic Programming",
                description="Learn Bellman equations, value iteration, and policy iteration for MDPs.",
                subtopics=["Bellman equations", "Value iteration", "Policy iteration", "MDPs"],
            ),
            GeneratedRoadmapNode(
                title="Temporal Difference Learning",
                description="Bridge Monte Carlo ideas and bootstrapping for online value estimation.",
                subtopics=["Monte Carlo", "Bootstrapping", "Online value estimation", "TD learning"],
            ),
            GeneratedRoadmapNode(
                title="Policy Optimization",
                description="Move into actor-critic methods and gradient-based learning for control policies.",
                subtopics=["Actor-critic methods", "Gradient-based learning", "Control policies", "Policy optimization"],
            ),
        ],
    ),
}


class MockRoadmapProvider(BaseRoadmapProvider):
    provider_name = "mock"

    def generate_roadmap(self, topic: str) -> GeneratedRoadmap:
        logger.warning(f"USING MOCK PROVIDER for topic: {topic}")
        normalized = topic.strip().lower()
        if normalized in ROADMAP_LIBRARY:
            roadmap = ROADMAP_LIBRARY[normalized]
            logger.debug(f"Found mock roadmap in library for: {normalized}")
            return GeneratedRoadmap(topic=topic.strip(), summary=roadmap.summary, nodes=roadmap.nodes)

        logger.debug(f"No mock roadmap found in library for: {normalized}. Generating default roadmap.")
        return GeneratedRoadmap(
            topic=topic.strip(),
            summary=f"A structured foundation-to-application roadmap for {topic.strip()}.",
            nodes=[
                GeneratedRoadmapNode(
                    title="Mathematical Foundations",
                    description="Identify the core math concepts that underpin the topic.",
                    subtopics=["Core math concepts", "Formulas", "Equations"],
                ),
                GeneratedRoadmapNode(
                    title="Programming and Tooling",
                    description="Learn the software stack, libraries, and experimentation workflow used in practice.",
                    subtopics=["Software stack", "Libraries", "Experimentation workflow"],
                ),
                GeneratedRoadmapNode(
                    title="Core Theory",
                    description="Study the main principles, models, and assumptions behind the topic.",
                    subtopics=["Main principles", "Models", "Assumptions"],
                ),
                GeneratedRoadmapNode(
                    title="Applied Practice",
                    description="Build projects or simulations that connect theory to realistic STEM problems.",
                    subtopics=["Projects", "Simulations", "Realistic STEM problems"],
                ),
                GeneratedRoadmapNode(
                    title="Research Extensions",
                    description="Explore open problems, recent papers, and advanced variants of the topic.",
                    subtopics=["Open problems", "Recent papers", "Advanced variants"],
                ),
            ],
        )
