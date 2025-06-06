// 3D Gallery implementation using Three.js
class ThreeDGallery {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.images = [];
    this.frames = [];
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.isInitialized = false;
    this.clock = new THREE.Clock();
    this.audioEnabled = false;
    this.ambientSound = null;
    this.currentImageIndex = -1;
    this.isAnimating = false;
  }

  init() {
    if (!this.container) return;
    
    // Create scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x121212);
    this.scene.fog = new THREE.Fog(0x121212, 10, 30);
    
    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      60, 
      this.container.clientWidth / this.container.clientHeight, 
      0.1, 
      1000
    );
    this.camera.position.set(0, 0, 10);
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.container.appendChild(this.renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
    
    const pointLight = new THREE.PointLight(0x6c63ff, 1, 20);
    pointLight.position.set(0, 5, 0);
    this.scene.add(pointLight);
    
    // Add controls
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 3;
    this.controls.maxDistance = 20;
    this.controls.maxPolarAngle = Math.PI / 2;
    
    // Add event listeners
    window.addEventListener('resize', this.onWindowResize.bind(this));
    this.container.addEventListener('click', this.onMouseClick.bind(this));
    this.container.addEventListener('mousemove', this.onMouseMove.bind(this));
    
    // Initialize audio
    this.initAudio();
    
    this.isInitialized = true;
    this.animate();
  }
  
  initAudio() {
    this.ambientSound = new Howl({
      src: ['https://assets.codepen.io/217233/ambient.mp3'],
      loop: true,
      volume: 0.3,
      autoplay: false
    });
    
    // Add audio toggle button
    const audioBtn = document.createElement('button');
    audioBtn.className = 'audio-toggle';
    audioBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    audioBtn.addEventListener('click', () => {
      this.audioEnabled = !this.audioEnabled;
      if (this.audioEnabled) {
        this.ambientSound.play();
        audioBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
      } else {
        this.ambientSound.pause();
        audioBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
      }
    });
    this.container.appendChild(audioBtn);
  }
  
  loadImages(images) {
    this.images = images;
    
    // Create a circular gallery
    const radius = 8;
    const totalImages = images.length;
    
    for (let i = 0; i < totalImages; i++) {
      const angle = (i / totalImages) * Math.PI * 2;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      
      // Create frame
      this.createPhotoFrame(images[i], x, 0, z, angle - Math.PI / 2, i);
    }
    
    // Add particles
    this.addParticles();
  }
  
  createPhotoFrame(image, x, y, z, rotationY, index) {
    // Create frame geometry
    const frameWidth = 2;
    const frameHeight = 3;
    const frameDepth = 0.1;
    const frameGeometry = new THREE.BoxGeometry(frameWidth, frameHeight, frameDepth);
    
    // Load texture
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(image.url + '?auto=format&fit=crop&w=600&q=80');
    
    // Create materials
    const frameMaterial = [
      new THREE.MeshStandardMaterial({ color: 0x222222 }), // right
      new THREE.MeshStandardMaterial({ color: 0x222222 }), // left
      new THREE.MeshStandardMaterial({ color: 0x222222 }), // top
      new THREE.MeshStandardMaterial({ color: 0x222222 }), // bottom
      new THREE.MeshStandardMaterial({ map: texture }), // front
      new THREE.MeshStandardMaterial({ color: 0x333333 }) // back
    ];
    
    // Create mesh
    const frame = new THREE.Mesh(frameGeometry, frameMaterial);
    frame.position.set(x, y, z);
    frame.rotation.y = rotationY;
    frame.castShadow = true;
    frame.receiveShadow = true;
    frame.userData = { 
      index: index,
      title: image.title,
      description: image.description
    };
    
    this.scene.add(frame);
    this.frames.push(frame);
    
    // Add floating title
    this.createFloatingText(image.title, x, y + 1.7, z, rotationY);
    
    return frame;
  }
  
  createFloatingText(text, x, y, z, rotationY) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;
    
    context.fillStyle = 'rgba(0, 0, 0, 0)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.font = '24px Poppins';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    
    sprite.position.set(x, y, z);
    sprite.scale.set(2, 0.5, 1);
    
    this.scene.add(sprite);
  }
  
  addParticles() {
    const particleCount = 1000;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      // Create a sphere of particles
      const radius = 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = (Math.random() - 0.5) * radius;
      positions[i + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x6c63ff,
      size: 0.05,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
    this.scene.add(particleSystem);
    
    // Animate particles
    this.particleSystem = particleSystem;
  }
  
  onWindowResize() {
    if (!this.container) return;
    
    this.camera.aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }
  
  onMouseMove(event) {
    // Calculate mouse position in normalized device coordinates
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / this.container.clientWidth) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / this.container.clientHeight) * 2 + 1;
    
    // Update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // Calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects(this.frames);
    
    if (intersects.length > 0) {
      this.container.style.cursor = 'pointer';
    } else {
      this.container.style.cursor = 'default';
    }
  }
  
  onMouseClick(event) {
    if (this.isAnimating) return;
    
    // Calculate mouse position in normalized device coordinates
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / this.container.clientWidth) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / this.container.clientHeight) * 2 + 1;
    
    // Update the picking ray with the camera and mouse position
    this.raycaster.setFromCamera(this.mouse, this.camera);
    
    // Calculate objects intersecting the picking ray
    const intersects = this.raycaster.intersectObjects(this.frames);
    
    if (intersects.length > 0) {
      const selectedFrame = intersects[0].object;
      const index = selectedFrame.userData.index;
      
      if (this.currentImageIndex === index) {
        // If clicking the same image, go back to gallery view
        this.zoomOut();
      } else {
        // Zoom in to the selected image
        this.zoomToImage(selectedFrame);
      }
    }
  }
  
  zoomToImage(frame) {
    this.isAnimating = true;
    this.currentImageIndex = frame.userData.index;
    
    // Disable controls during animation
    this.controls.enabled = false;
    
    // Get position in front of the frame
    const targetPosition = frame.position.clone();
    const direction = targetPosition.clone().sub(new THREE.Vector3(0, 0, 0)).normalize();
    targetPosition.sub(direction.multiplyScalar(2));
    
    // Create info panel
    this.showImageInfo(frame.userData);
    
    // Animate camera
    new TWEEN.Tween(this.camera.position)
      .to({
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z
      }, 1000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();
    
    // Animate camera look at
    new TWEEN.Tween(this.controls.target)
      .to({
        x: frame.position.x,
        y: frame.position.y,
        z: frame.position.z
      }, 1000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onComplete(() => {
        this.controls.enabled = true;
        this.isAnimating = false;
      })
      .start();
  }
  
  zoomOut() {
    this.isAnimating = true;
    this.currentImageIndex = -1;
    
    // Hide info panel
    this.hideImageInfo();
    
    // Disable controls during animation
    this.controls.enabled = false;
    
    // Animate camera back to original position
    new TWEEN.Tween(this.camera.position)
      .to({
        x: 0,
        y: 0,
        z: 10
      }, 1000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .start();
    
    // Animate camera look at back to center
    new TWEEN.Tween(this.controls.target)
      .to({
        x: 0,
        y: 0,
        z: 0
      }, 1000)
      .easing(TWEEN.Easing.Cubic.InOut)
      .onComplete(() => {
        this.controls.enabled = true;
        this.isAnimating = false;
      })
      .start();
  }
  
  showImageInfo(imageData) {
    // Create or show info panel
    let infoPanel = document.getElementById('gallery-info-panel');
    if (!infoPanel) {
      infoPanel = document.createElement('div');
      infoPanel.id = 'gallery-info-panel';
      infoPanel.className = 'gallery-info-panel';
      this.container.appendChild(infoPanel);
    }
    
    infoPanel.innerHTML = `
      <h2>${imageData.title}</h2>
      <p>${imageData.description}</p>
      <button class="back-btn"><i class="fas fa-arrow-left"></i> Back to Gallery</button>
    `;
    
    // Add event listener to back button
    const backBtn = infoPanel.querySelector('.back-btn');
    backBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.zoomOut();
    });
    
    // Show with animation
    infoPanel.style.display = 'block';
    setTimeout(() => {
      infoPanel.classList.add('visible');
    }, 10);
  }
  
  hideImageInfo() {
    const infoPanel = document.getElementById('gallery-info-panel');
    if (infoPanel) {
      infoPanel.classList.remove('visible');
      setTimeout(() => {
        infoPanel.style.display = 'none';
      }, 300);
    }
  }
  
  animate() {
    if (!this.isInitialized) return;
    
    requestAnimationFrame(this.animate.bind(this));
    
    // Update controls
    this.controls.update();
    
    // Update tweens
    TWEEN.update();
    
    // Rotate particle system
    if (this.particleSystem) {
      this.particleSystem.rotation.y += 0.0005;
    }
    
    // Render scene
    this.renderer.render(this.scene, this.camera);
  }
}

// Initialize 3D Gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Create gallery container if it doesn't exist
  let galleryContainer = document.getElementById('three-d-gallery');
  if (!galleryContainer) {
    galleryContainer = document.createElement('div');
    galleryContainer.id = 'three-d-gallery';
    galleryContainer.className = 'three-d-gallery';
    document.body.appendChild(galleryContainer);
    
    // Add gallery toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'gallery-toggle';
    toggleBtn.className = 'gallery-toggle';
    toggleBtn.innerHTML = '<i class="fas fa-cube"></i> 3D Gallery';
    document.body.appendChild(toggleBtn);
    
    toggleBtn.addEventListener('click', () => {
      galleryContainer.classList.toggle('active');
      if (galleryContainer.classList.contains('active')) {
        toggleBtn.innerHTML = '<i class="fas fa-times"></i> Close Gallery';
      } else {
        toggleBtn.innerHTML = '<i class="fas fa-cube"></i> 3D Gallery';
      }
    });
  }
  
  // Initialize gallery
  const gallery = new ThreeDGallery('three-d-gallery');
  gallery.init();
  
  // Get images from the main app
  const getImagesInterval = setInterval(() => {
    if (typeof sampleImages !== 'undefined') {
      gallery.loadImages(sampleImages);
      clearInterval(getImagesInterval);
    }
  }, 100);
});