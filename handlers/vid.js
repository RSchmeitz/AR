AFRAME.registerComponent('videohandler', {
    init: function () {
        var marker = this.el;
        this.vid1 = document.querySelector("#vid1");
        this.vid2 = document.querySelector("#vid2");
        this.vid3 = document.querySelector("#vid3");
        this.vid4 = document.querySelector("#vid4");
        this.currentVid = this.vid1;
        this.videoTitle = document.querySelector("#videoTitle");
        this.videoNumber = 1;
        this.videoTitles = ["Video 1: Environment demo", "Video 2: RL Agent Playthrough", "Video 3: RL Agent Playthrough", "Video 4: RL Agent Playthrough"];

        var videoEl = marker.querySelector('a-video'); // Select the video entity

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
            // Update to cycle through all 4 videos
            this.videoNumber = (this.videoNumber % 4) + 1;
            
            // Set current video based on video number
            switch(this.videoNumber) {
                case 1: this.currentVid = this.vid1; break;
                case 2: this.currentVid = this.vid2; break;
                case 3: this.currentVid = this.vid3; break;
                case 4: this.currentVid = this.vid4; break;
            }

            // Update UI
            this.videoTitle.setAttribute('value', this.videoTitles[this.videoNumber - 1]);
            videoEl.setAttribute('material', 'src', '#vid' + this.videoNumber);

            // Restart and play the new video
            this.currentVid.currentTime = 0;
            this.currentVid.play();
            isPlaying = true;
            playPauseBtn.innerHTML = '⏸';

            if (!isARMode) {
                normalVideo.src = this.currentVid.src;
                normalVideo.play();
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
