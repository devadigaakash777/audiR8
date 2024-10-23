// Initialize the Three.js scene, camera, and renderer
const scene = new THREE.Scene();
const container = document.getElementById('car-container');
const btn360 = document.getElementById('btn360');
const zoomControls = document.querySelector(".zoom-controls");
const interiorBtn = document.getElementById('interior');
const exteriorBtn = document.getElementById('exterior');

// Set up the camera with an appropriate aspect ratio and position
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(-10, 0, 31);

// Set up the WebGL renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor(0x000000); // Set background color to black
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Lighting setup
const directionalLight1 = new THREE.DirectionalLight(0xffffff, 2);
directionalLight1.position.set(10, 10, 10);
directionalLight1.lookAt(0, 0, 0); // Focus light at the center of the scene
scene.add(directionalLight1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
directionalLight2.position.set(10, 10, 10); // Placeholder second light, can be updated later

// Create a group to centralize car model positioning and rotations
const carGroup = new THREE.Group();
carGroup.position.set(-10, -10, -10);
scene.add(carGroup);

// Function to load and display the 3D car model
function displayCarModel() {
  console.log("360° button clicked");

  // Hide the 360° button after interaction
  btn360.style.display = "none";
  
  // Load the car model using FBXLoader
  const fbxLoader = new THREE.FBXLoader();
  fbxLoader.load('audi.fbx', function(object) {
      console.log("Car model successfully loaded");

      // Adjust car model scale and positioning
      object.scale.set(0.01, 0.01, 0.01);
      object.position.set(-10, 0, 25);

      // Remove shadow properties from meshes
      object.traverse(function(child) {
          if (child.isMesh) {
              // No shadows, preserving performance
          }
      });

      // Add the car model to the scene
      carGroup.add(object);

      // Set up animation
      const clock = new THREE.Clock();
      let animationActive = true;

      function animate() {
          const elapsedTime = clock.getElapsedTime() + 4;

          // Update light positioning for initial car rotation effect
          if (elapsedTime < 7.5) {
              directionalLight1.position.x = Math.sin(elapsedTime * 0.5) * 20;
              directionalLight1.position.z = Math.cos(elapsedTime * 0.5) * 20;
              animationActive = true;
          } else {
              if (animationActive) {
                  // Finalize lighting positions and intensities
                  directionalLight1.position.set(170, 15, 50);
                  scene.add(directionalLight2);
                  directionalLight2.position.set(-170, 15, 50);
                  directionalLight1.intensity = 1;
                  directionalLight2.intensity = 1;

                  // Enable buttons and zoom controls
                  zoomControls.style.display = "flex";
                  exteriorBtn.removeAttribute("disabled");
                  interiorBtn.removeAttribute("disabled");
              }

              animationActive = false;
              carGroup.rotation.y += 0.003; // Rotate car slowly
          }

          // Render the scene with the updated camera and light positions
          requestAnimationFrame(animate);
          renderer.render(scene, camera);
      }

      // Start animation
      animate();

  }, undefined, function(error) {
      console.error("Error loading car model:", error);
  });
}

// Responsive handling for window resize events
window.addEventListener('resize', function() {
  const width = container.clientWidth;
  const height = container.clientHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});



// Interior and exterior view controls
function viewInterior() {
    camera.position.set(-10, 0, -9);
  }

  function viewExterior() {
    camera.position.set(-10, 0, 31);
  }

  // Zoom controls
  function zoomIn() {
    camera.position.z--;
  }

  function zoomOut() {
    camera.position.z++;
  }