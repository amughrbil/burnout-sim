import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// --- 1. Basic Scene Setup ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;


const colorVoid = new THREE.Color(0x050510);     // The stressed dark void
const colorBreathe = new THREE.Color(0x0f4c5c);  // The calming blue-green
scene.background = new THREE.Color(colorVoid);   // Set initial background

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- 2. Lighting ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xff0066, 2, 100); 
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

// --- 3. Load the Brain Model ---
let brainModel;
const loader = new GLTFLoader();

loader.load('brain.glb', function (gltf) {
    brainModel = gltf.scene;
    brainModel.scale.set(1.5, 1.5, 1.5); 
    scene.add(brainModel);
}, undefined, function (error) {
    console.error('Error loading the brain model:', error);
});

// --- 4. Game Logic Variables ---
let stressLevel = 0;
let bubbles = [];
let isCoolingDown = false; // NEW: Tracks if we are taking a break

const originalTaskNames = [
    "Study",
    "Write Report",
    "Start Project",
    "Debug Code",
    "Answer Emails",
    "Work on Assignment",
    "Clean Room"
];
const taskColors = [
    0xff6b81, // Study - Pink
    0x2ed573, // Write Report - Green
    0xeccc68, // Start Project - Yellow
    0x70a1ff, // Debug Code - Light Blue
    0xff7f50, // Answer Emails - Coral/Orange
    0x9b59b6, // Work on Assignment - Purple
    0x1e90ff  // Clean Room - Bright Blue
];

const taskButtons = document.querySelectorAll('.task-btn');
const staticOverlay = document.getElementById('static-overlay');
const breakButton = document.getElementById('break-btn');
const stressFill = document.getElementById('stress-fill');

// --- 5. Interaction: Clicking a Task ---
taskButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
        // Prevent adding tasks while taking a break
        if (isCoolingDown || btn.classList.contains('completed')) return; 

        btn.classList.add('completed');
        stressLevel++;
        
        // NEW: Pass the button's index to the bubble function
        spawnBubble(index); 
        
        const maxTasks = originalTaskNames.length;
        stressFill.style.height = `${(stressLevel / maxTasks) * 100}%`;

        if (stressLevel >= 4) {
            scrambleText();
        }
    });
});


function spawnBubble(taskIndex) {
    const geometry = new THREE.SphereGeometry(0.3, 32, 32);
    const material = new THREE.MeshPhysicalMaterial({
        transmission: 0.9, 
        opacity: 1,
        roughness: 0.1,
        color: taskColors[taskIndex] 
    });
    
    const bubble = new THREE.Mesh(geometry, material);
    bubble.userData = { angle: Math.random() * Math.PI * 2, speed: 0.02 + (Math.random() * 0.03) };
    
    scene.add(bubble);
    bubbles.push(bubble);
}


function scrambleText() {
    const characters = '!@#$%^&*()_+~}{[]:;?><,./-=010101';
    taskButtons.forEach(btn => {
        if (!btn.classList.contains('completed')) {
            let scrambled = '';
            for (let i = 0; i < 12; i++) {
                scrambled += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            btn.innerText = scrambled;
        }
    });
}

// --- 6. Taking a Break (The Reverse Staircase) ---
breakButton.addEventListener('click', () => {
    // Prevent clicking if already resting or if no stress exists
    if (isCoolingDown || stressLevel === 0) return; 

    isCoolingDown = true;
    breakButton.innerText = "Breathing...";
    breakButton.style.backgroundColor = "#2ed573"; // Turn button green for calming effect

    // Immediately restore the text so the user feels cognitive relief
    taskButtons.forEach((btn, index) => {
        btn.innerText = originalTaskNames[index];
    });

    // Step down the stress every 800 milliseconds
    const cooldownTimer = setInterval(() => {
        if (stressLevel > 0) {
            stressLevel--;

            const maxTasks = originalTaskNames.length;
            stressFill.style.height = `${(stressLevel / maxTasks) * 100}%`;
            
            // Remove the most recent bubble
            if (bubbles.length > 0) {
                const poppedBubble = bubbles.pop();
                scene.remove(poppedBubble);
            }

            // Un-cross the most recently completed task
            const completedBtns = document.querySelectorAll('.task-btn.completed');
            if (completedBtns.length > 0) {
                completedBtns[completedBtns.length - 1].classList.remove('completed');
            }

            // Update static immediately
            const overload = Math.max(0, stressLevel - 3);
            staticOverlay.style.opacity = stressLevel * 0.1;

        } else {
            // Once stress is 0, stop the timer and reset the button
            clearInterval(cooldownTimer);
            isCoolingDown = false;
            breakButton.innerText = "Take a Break";
            breakButton.style.backgroundColor = "#ff4757"; // Back to red
            staticOverlay.style.opacity = 0;
            camera.position.set(0, 0, 5); // Ensure camera is perfectly still
        }
    }, 800);
});

// --- 7. The Animation Loop ---
function animate() {
    
    requestAnimationFrame(animate);

    const overload = Math.max(0, stressLevel - 3);

    
    if (isCoolingDown) {
        scene.background.lerp(colorBreathe, 0.015); // Gently fade to blue-green
    } else {
        scene.background.lerp(colorVoid, 0.05); // Fade back to dark void
    }

    if (brainModel) {
        if (isCoolingDown) {
            // THE BREATHING EFFECT: Slow, deep pulsing
            const breath = 1.5 + Math.sin(Date.now() * 0.002) * 0.1; 
            brainModel.scale.set(breath, breath, breath);
            
            // Slow down rotation to a gentle spin
            brainModel.rotation.y += 0.002;
        } else {
            // THE STRESS EFFECT: Erratic throbbing and fast spin
            brainModel.rotation.y += 0.005 + (stressLevel * 0.005) + (overload * 0.02);
            const throb = 1.5 + Math.sin(Date.now() * 0.01) * (0.05 * overload);
            brainModel.scale.set(throb, throb, throb);
        }
    }

    bubbles.forEach(bubble => {
        // If cooling down, bubbles slow down. If stressed, they speed up.
        const currentSpeed = isCoolingDown ? bubble.userData.speed : bubble.userData.speed + (stressLevel * 0.01) + (overload * 0.02);
        
        bubble.userData.angle += currentSpeed;
        bubble.position.x = Math.cos(bubble.userData.angle) * 2.5;
        bubble.position.z = Math.sin(bubble.userData.angle) * 2.5;
        bubble.position.y = Math.sin(bubble.userData.angle * 2) * 1 + (isCoolingDown ? 0 : (Math.random() - 0.5) * (overload * 0.2));
    });

    // Camera Shake (Only shakes if NOT cooling down)
    if (stressLevel >= 4 && !isCoolingDown) {
        const shakeAmount = overload * 0.15; 
        camera.position.x = (Math.random() - 0.5) * shakeAmount;
        camera.position.y = (Math.random() - 0.5) * shakeAmount;
    } else if (isCoolingDown) {
        // Smoothly glide camera back to center
        camera.position.lerp(new THREE.Vector3(0, 0, 5), 0.05);
    }

    // Chaotic static flicker
    if (stressLevel >= 3 && !isCoolingDown) {
        const baseOpacity = stressLevel * 0.1;
        const chaoticFlicker = Math.random() * (overload * 0.15);
        staticOverlay.style.opacity = Math.min(1, baseOpacity + chaoticFlicker);
    }

    // Continuous Text Scrambling at max overload (Stops if cooling down)
    if (stressLevel >= 5 && Math.random() > 0.8 && !isCoolingDown) { 
        scrambleText();
    }

    renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});