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
        // Add performance variables
        this.lastTick = 0;
        this.tickInterval = 1000/30; // Limit to 30fps

        var marker = this.el;
        
        var markerId = this.data.markerId;
        let markerVisible = false;
        let isPlaying = false;
        let isARMode = true;
        
        this.vid1 = document.querySelector("#vid1");
        this.vid2 = document.querySelector("#vid2");
        this.vid3 = document.querySelector("#vid3");
        this.vid4 = document.querySelector("#vid4");
        this.femEnv = document.querySelector("#femEnv");
        this.printEnv = document.querySelector("#printEnv");
        
        // Set current video based on marker
        switch(markerId) {
            case 'r': 
                this.currentVid = this.printEnv;
                this.printEnv.playbackRate = 4.0;
                this.femEnv.playbackRate = 4.0;
                // Add ended event listeners for R marker videos
                this.printEnv.addEventListener('ended', () => {
                    if (markerId === 'r') {
                        this.currentVid = this.femEnv;
                        videoEl.setAttribute('material', 'src', '#femEnv');
                        this.videoNumber = 2;
                        this.femEnv.currentTime = 0;
                        this.femEnv.playbackRate = 4.0;
                        this.femEnv.play();
                        if (!isARMode) {
                            normalVideo.src = this.femEnv.src;
                            normalVideo.playbackRate = 4.0;
                            normalVideo.play();
                        }
                    }
                });
                this.femEnv.addEventListener('ended', () => {
                    if (markerId === 'r') {
                        this.currentVid = this.printEnv;
                        videoEl.setAttribute('material', 'src', '#printEnv');
                        this.videoNumber = 1;
                        this.printEnv.currentTime = 0;
                        this.printEnv.playbackRate = 4.0;
                        this.printEnv.play();
                        if (!isARMode) {
                            normalVideo.src = this.printEnv.src;
                            normalVideo.playbackRate = 4.0;
                            normalVideo.play();
                        }
                    }
                });
                break;
            case 'l':
                const videoEl = marker.querySelector('a-video');
                const normalVideo = document.querySelector('#normalVideo');
                
                this.currentVid = this.vid1;
                this.videoNumber = 1;

                [this.vid1, this.vid2, this.vid3, this.vid4].forEach(v => {
                    v.playbackRate = 1.0;
                    v.muted = true;
                });

                const playVideoSafely = (video) => {
                    video.play().catch(() => {
                        const onFirstInteraction = () => {
                            video.play();
                            window.removeEventListener('touchstart', onFirstInteraction);
                        };
                        window.addEventListener('touchstart', onFirstInteraction, { once: true });
                    });
                };

                [this.vid1, this.vid2, this.vid3, this.vid4].forEach((vid, i, arr) => {
                    vid.addEventListener('ended', () => {
                        const next = (i + 1) % arr.length;
                        this.currentVid = arr[next];
                        this.videoNumber = next + 1;
                        videoEl.setAttribute('material', 'src', `#vid${next+1}`);
                        this.currentVid.currentTime = 0;
                        playVideoSafely(this.currentVid);
                        if (!isARMode) {
                            normalVideo.src = this.currentVid.src;
                            playVideoSafely(normalVideo);
                        }
                    });
                });

                videoEl.setAttribute('material', 'src', '#vid1');
                this.vid1.currentTime = 0;
                playVideoSafely(this.vid1);
                isPlaying = true;
                break;

        }
        
        this.videoTitle = document.querySelector("#videoTitle_" + markerId);
        this.videoNumber = 1;
        
        // Set titles based on marker
        switch(markerId) {
            case 'r':
                this.videoTitles = ["SimpleEnv Demo", "FemEnv Demo"];
                break;
            case 'l':
                this.videoTitles = ["PBF - Train", "PBF - Test", 
                                  "Simple - Train", "Simple - Test"];
                break;
            default:
                this.videoTitles = ["PBF - Train", "PBF - Test", 
                                  "Simple - Train", "Simple - Test"];
                break;
        }

        var videoEl = marker.querySelector('a-video');
        let lastMarkerTime = 0;
        const MARKER_TIMEOUT = 1000; // Increased from 300 to 1000ms for better persistence

        marker.addEventListener('markerFound', function () {
            if (!this.stabilityStartTime) {
                this.stabilityStartTime = Date.now();
                this.stableFrames = 0;
                return;
            }

            this.stableFrames++;
            
            // Wait for 5 stable frames before showing content
            if (this.stableFrames >= 5) {
                markerVisible = true;
                lastMarkerTime = Date.now();
                
                if (!this.warmupComplete && this.warmupFrames >= 3) {
                    this.warmupComplete = true;
                }
                if (this.warmupComplete && this.currentVid) {
                    if (!this.currentVid.playing) {
                        this.currentVid.play();
                        isPlaying = true;
                        playPauseBtn.innerHTML = '⏸';
                    }
                }
                this.warmupFrames = (this.warmupFrames || 0) + 1;
            }
        }.bind(this));

        marker.addEventListener('markerLost', function () {
            this.stabilityStartTime = null;
            this.stableFrames = 0;
            
            // Increase marker timeout for smoother transitions
            setTimeout(() => {
                if (Date.now() - lastMarkerTime > MARKER_TIMEOUT) {
                    markerVisible = false;
                    if (this.currentVid && isPlaying) {
                        // Increased timeout for video pause
                        setTimeout(() => {
                            if (!markerVisible) {
                                this.currentVid.pause();
                                isPlaying = false;
                                playPauseBtn.innerHTML = '▶';
                            }
                        }, 1000); // Increased from 500 to 1000ms
                    }
                }
            }, MARKER_TIMEOUT);
        }.bind(this));

        // Add orientation change handler
        window.addEventListener('orientationchange', () => {
            // Wait for orientation change to complete
            setTimeout(() => {
                if (this.currentVid && isPlaying) {
                    this.currentVid.play();
                }
            }, 200);
        });

        // Optimize tick function further
        this.tick = AFRAME.utils.throttleTick(function(t) {
            if (t - this.lastTick < this.tickInterval) return;
            this.lastTick = t;

            if (markerVisible && !this.warmupComplete) {
                marker.object3D.visible = this.warmupFrames >= 3;
            }
        }, 33);  // Cap at ~30fps

        // Add these before control panel section
        this.allVideos = [this.printEnv, this.femEnv, this.vid1, this.vid2, this.vid3, this.vid4];
        this.current2DVideoIndex = 0;

        // Control panel functionality
        const nextBtn = document.querySelector("#nextVideo");
        const playPauseBtn = document.querySelector("#playPauseBtn");
        const modeToggleBtn = document.querySelector("#modeToggleBtn");
        const normalVideoContainer = document.querySelector("#normalVideoContainer");
        const normalVideo = document.querySelector("#normalVideo");
        const scene = document.querySelector("a-scene");

        // Add 2D mode video ended handler
        normalVideo.addEventListener('ended', () => {
            if (!isARMode) {
                this.current2DVideoIndex = (this.current2DVideoIndex + 1) % this.allVideos.length;
                normalVideo.src = this.allVideos[this.current2DVideoIndex].src;
                // Set correct playback rate based on video type
                if (this.allVideos[this.current2DVideoIndex] === this.printEnv || 
                    this.allVideos[this.current2DVideoIndex] === this.femEnv) {
                    normalVideo.playbackRate = 4.0;
                } else {
                    normalVideo.playbackRate = 1.0;
                }
                normalVideo.play();
            }
        });

        // Update next video handling in 2D mode
        const switchToNextVideo = () => {
            if (!isARMode) {
                requestAnimationFrame(() => {
                    // 2D mode video switching
                    this.current2DVideoIndex = (this.current2DVideoIndex + 1) % this.allVideos.length;
                    normalVideo.src = this.allVideos[this.current2DVideoIndex].src;
                    if (this.allVideos[this.current2DVideoIndex] === this.printEnv || 
                        this.allVideos[this.current2DVideoIndex] === this.femEnv) {
                        normalVideo.playbackRate = 4.0;
                    } else {
                        normalVideo.playbackRate = 1.0;
                    }
                    normalVideo.currentTime = 0;
                    normalVideo.play();
                });
                return;
            }

            // AR mode video switching (existing code)
            if (markerId === 'r') {
                this.videoNumber = (this.videoNumber % 2) + 1;
                switch(this.videoNumber) {
                    case 1: this.currentVid = this.printEnv; break;
                    case 2: this.currentVid = this.femEnv; break;
                }
                // Remove title update for r marker
                videoEl.setAttribute('material', 'src', '#' + (this.videoNumber === 1 ? 'printEnv' : 'femEnv'));
                
                this.currentVid.currentTime = 0;
                this.currentVid.play();
                isPlaying = true;
                playPauseBtn.innerHTML = '⏸';

                if (!isARMode) {
                    normalVideo.src = this.currentVid.src;
                    normalVideo.play();
                }
            } else if (markerId === 'l') {
                this.videoNumber = (this.videoNumber % 4) + 1;
                
                switch(this.videoNumber) {
                    case 1: 
                        this.currentVid = this.vid1;
                        videoEl.setAttribute('material', 'src', '#vid1');
                        break;
                    case 2: 
                        this.currentVid = this.vid2;
                        videoEl.setAttribute('material', 'src', '#vid2');
                        break;
                    case 3: 
                        this.currentVid = this.vid3;
                        videoEl.setAttribute('material', 'src', '#vid3');
                        break;
                    case 4: 
                        this.currentVid = this.vid4;
                        videoEl.setAttribute('material', 'src', '#vid4');
                        break;
                }

                if (this.videoTitle) {
                    this.videoTitle.setAttribute('value', this.videoTitles[this.videoNumber - 1]);
                }

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
        
        // Update toggle mode function
        const toggleMode = () => {
            isARMode = !isARMode;
            if (isARMode) {
                normalVideoContainer.style.display = 'none';
                scene.style.display = 'block';
                modeToggleBtn.textContent = '2D';
                // Remove guide display code
                if (this.currentVid) {
                    normalVideo.pause();
                    this.currentVid.play();
                }
            } else {
                normalVideoContainer.style.display = 'block';
                scene.style.display = 'none';
                modeToggleBtn.textContent = 'AR';
                // Remove guide hide code
                if (this.currentVid) {
                    this.currentVid.pause();
                    normalVideo.src = this.currentVid.src;
                    normalVideo.play();
                }
            }
        };

        // Update play/pause handling
        const togglePlayPause = () => {
            if (!isARMode) {
                if (isPlaying) {
                    normalVideo.pause();
                    playPauseBtn.innerHTML = '▶';
                } else {
                    normalVideo.play();
                    playPauseBtn.innerHTML = '⏸';
                }
                isPlaying = !isPlaying;
                return;
            }

            // Existing AR mode play/pause code
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

        nextBtn.addEventListener('click', switchToNextVideo);
        playPauseBtn.addEventListener('click', togglePlayPause);
        modeToggleBtn.addEventListener('click', toggleMode);

        // Optimize tick function
        this.tick = function(t) {
            // Limit update frequency
            if (t - this.lastTick < this.tickInterval) return;
            this.lastTick = t;

            if (markerVisible && !this.warmupComplete) {
                marker.object3D.visible = this.warmupFrames >= 3;
            }
        };
    },
});
