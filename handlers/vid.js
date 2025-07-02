AFRAME.registerComponent('scale-on-pinch', {
    init: function () {
        this.scale = {x: 1, y: 1, z: 1};
        this.initialDistance = 0;
        this.initialScale = 1;

        this.handleTouchStart = (e) => {
            if (e.touches.length === 2) {
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                this.initialDistance = Math.hypot(
                    touch2.pageX - touch1.pageX,
                    touch2.pageY - touch1.pageY
                );
                this.initialScale = this.el.object3D.scale.x;
            }
        };

        this.handleTouchMove = (e) => {
            if (e.touches.length === 2) {
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const currentDistance = Math.hypot(
                    touch2.pageX - touch1.pageX,
                    touch2.pageY - touch1.pageY
                );
                const scaleFactor = currentDistance / this.initialDistance;
                const newScale = this.initialScale * scaleFactor;
                
                // Limit scale between 0.5 and 3
                const limitedScale = Math.min(Math.max(newScale, 0.5), 3);
                this.el.object3D.scale.set(limitedScale, limitedScale, limitedScale);
            }
        };

        this.el.sceneEl.canvas.addEventListener('touchstart', this.handleTouchStart);
        this.el.sceneEl.canvas.addEventListener('touchmove', this.handleTouchMove);
    },

    remove: function () {
        this.el.sceneEl.canvas.removeEventListener('touchstart', this.handleTouchStart);
        this.el.sceneEl.canvas.removeEventListener('touchmove', this.handleTouchMove);
    }
});

AFRAME.registerComponent('videohandler', {
    schema: {
        markerId: {type: 'string', default: 'p'}
    },
    init: function () {
        var marker = this.el;
        var markerId = this.data.markerId;
        
        this.vid1 = document.querySelector("#vid1");
        this.vid2 = document.querySelector("#vid2");
        this.vid3 = document.querySelector("#vid3");
        this.vid4 = document.querySelector("#vid4");
        
        // Set current video based on marker
        switch(markerId) {
            case 'r': this.currentVid = this.vid1; break;
            case 'l': this.currentVid = this.vid2; break;
            default: this.currentVid = this.vid1; break;
        }
        
        this.videoTitle = document.querySelector("#videoTitle_" + markerId);
        this.videoNumber = 1;
        
        // Set titles based on marker
        switch(markerId) {
            case 'r':
                this.videoTitles = ["Right Marker: Video 1"];
                break;
            case 'l':
                this.videoTitles = ["Left Marker: Video 2"];
                break;
            default:
                this.videoTitles = ["Video 1: Environment demo", "Video 2: RL Agent Playthrough", 
                                  "Video 3: RL Agent Playthrough", "Video 4: RL Agent Playthrough"];
                break;
        }

        var videoEl = marker.querySelector('a-video');
        let markerVisible = false;
        let lastMarkerTime = 0;
        const MARKER_TIMEOUT = 300; // Time in ms before considering marker lost

        const targetBox = document.querySelector("#targetBox");
        const targetText = document.querySelector("#targetText");

        marker.addEventListener('markerFound', function () {
            markerVisible = true;
            lastMarkerTime = Date.now();
            if (!this.warmupComplete && this.warmupFrames >= 5) {
                this.warmupComplete = true;
            }
            if (this.warmupComplete && this.currentVid) {
                this.currentVid.play();
                isPlaying = true;
                playPauseBtn.innerHTML = '⏸';
            }
            this.warmupFrames = (this.warmupFrames || 0) + 1;
            
            // Hide guide elements when marker is found
            targetBox.style.display = 'none';
            targetText.style.display = 'none';
        }.bind(this));

        marker.addEventListener('markerLost', function () {
            // Only consider the marker truly lost after MARKER_TIMEOUT ms
            setTimeout(() => {
                if (Date.now() - lastMarkerTime > MARKER_TIMEOUT) {
                    markerVisible = false;
                    if (this.currentVid) {
                        this.currentVid.pause();
                        isPlaying = false;
                        playPauseBtn.innerHTML = '▶';
                    }
                }
            }, MARKER_TIMEOUT);
        }.bind(this));

        // Control panel functionality
        const nextBtn = document.querySelector("#nextVideo");
        const playPauseBtn = document.querySelector("#playPauseBtn");
        const modeToggleBtn = document.querySelector("#modeToggleBtn");
        const normalVideoContainer = document.querySelector("#normalVideoContainer");
        const normalVideo = document.querySelector("#normalVideo");
        const scene = document.querySelector("a-scene");
        let isPlaying = false;
        let isARMode = true;

        const togglePlayPause = () => {
            if (this.currentVid) {
                if (isPlaying) {
                    this.currentVid.pause();
                    playPauseBtn.innerHTML = '▶';
                } else {
                    this.currentVid.play();
                    playPauseBtn.innerHTML = '⏸';
                }
                isPlaying = !isPlaying;
            }
        };

        const switchToNextVideo = () => {
            // Only allow video switching for p_marker
            if (markerId === 'p') {
                this.videoNumber = (this.videoNumber % 4) + 1;
                
                switch(this.videoNumber) {
                    case 1: this.currentVid = this.vid1; break;
                    case 2: this.currentVid = this.vid2; break;
                    case 3: this.currentVid = this.vid3; break;
                    case 4: this.currentVid = this.vid4; break;
                }

                this.videoTitle.setAttribute('value', this.videoTitles[this.videoNumber - 1]);
                videoEl.setAttribute('material', 'src', '#vid' + this.videoNumber);

                this.currentVid.currentTime = 0;
                this.currentVid.play();
                isPlaying = true;
                playPauseBtn.innerHTML = '⏸';

                if (!isARMode) {
                    normalVideo.src = this.currentVid.src;
                    normalVideo.play();
                }
            }
        };

        const toggleMode = () => {
            isARMode = !isARMode;
            if (isARMode) {
                normalVideoContainer.style.display = 'none';
                scene.style.display = 'block';
                modeToggleBtn.textContent = '2D';
                // Show guide elements when switching to AR mode (only if marker not detected)
                if (!markerVisible) {
                    targetBox.style.display = 'block';
                    targetText.style.display = 'block';
                }
                if (this.currentVid) {
                    normalVideo.pause();
                    this.currentVid.play();
                }
            } else {
                normalVideoContainer.style.display = 'block';
                scene.style.display = 'none';
                modeToggleBtn.textContent = 'AR';
                // Hide guide elements in 2D mode
                targetBox.style.display = 'none';
                targetText.style.display = 'none';
                if (this.currentVid) {
                    this.currentVid.pause();
                    normalVideo.src = this.currentVid.src;
                    normalVideo.play();
                }
            }
        };

        nextBtn.addEventListener('click', switchToNextVideo);
        playPauseBtn.addEventListener('click', togglePlayPause);
        modeToggleBtn.addEventListener('click', toggleMode);

        // Add tick function to handle tracking stability
        this.tick = function() {
            if (markerVisible && !this.warmupComplete) {
                marker.object3D.visible = this.warmupFrames >= 5;
            }
        };
    },
});
