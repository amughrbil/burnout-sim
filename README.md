# 🧠 Occupational Burnout: Cognitive Erosion Simulation

**Live Demo:** (https://burnout-sim.vercel.app/)

## 📌 Project Overview
This project is an interactive 3D web simulation designed to visualize the internal, psychological experience of occupational burnout and cognitive overload. It was created to fulfill the requirement of understanding, diagnosing, preventing, and dealing with burnout.

Rather than a broad overview of workplace stress, this project takes a "vertical" approach, diving deep into **Cognitive Erosion**—the mental fatigue where the brain can no longer process simple information due to an overloaded mental queue.

## ✨ Features & The "Staircase" Logic
The simulation tracks a "Stress Level" that dictates the visual and interactive state of the environment, escalating as the user takes on more tasks without resting.

* **Phase 1: The Mental Space (Healthy)**
  * The central 3D brain pulses gently and rotates calmly.
  * Adding tasks (clicking the UI) spawns uniquely colored, glassy orbs that orbit the brain, representing the physical space tasks take up in working memory.
* **Phase 2: Cognitive Load (Overload)**
  * **Visual Static:** As the mental queue fills up, a CSS-based static overlay fades in, representing "brain fog."
  * **Erratic Throbbing:** The brain's math-driven vertex displacement becomes rapid and irregular.
  * **Camera Jitter:** The Three.js camera begins to shake slightly, simulating anxiety and a loss of focus.
* **Phase 3: Total Burnout (Failure)**
  * **UI Breakdown:** At critical stress levels, the text on the remaining task buttons rapidly scrambles into unreadable symbols (`!@#$%^&*`). This visualizes the moment a burned-out individual looks at a screen and can no longer process the information.
* **Phase 4: Active Recovery (Dealing with Burnout)**
  * **The Breathing Effect:** Clicking "Take a Break" locks the UI. The environment smoothly transitions from a stressful dark void to a calming blue-green (`#0f4c5c`).
  * **Decompression:** The brain shifts to a slow, 4-second pulse (mimicking deep breathing). Tasks slowly uncheck themselves, bubbles pop one by one, and the stress meter gradually drains, demonstrating that genuine recovery takes time.

## 🛠️ Technology Stack
This is a purely front-end application built with zero heavy frameworks, ensuring instant load times and high performance.
* **Three.js** (via CDN) for 3D rendering, scene management, and lighting.
* **Vanilla JavaScript** for simulation logic, UI interaction, and math-based animations (Sine/Cosine waves for pulsing).
* **HTML5 & Modern CSS3** (Glassmorphism UI, CSS variables, linear gradients, and radial static overlays).
* **GLTFLoader** to import and render the high-poly 3D brain model.

## 🚀 How to Run Locally
Because this project uses a `.glb` 3D model, it requires a local web server to bypass browser CORS security policies. You cannot simply double-click the `index.html` file.

1. Open the project folder in Visual Studio Code.
2. Install the Live Server extension by Ritwick Dey.
3. Click "Go Live" in the bottom right corner of VS Code.
4. The simulation will automatically open in your default browser at http://localhost:5500.

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
