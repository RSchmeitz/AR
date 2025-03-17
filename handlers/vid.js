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

        marker.addEventListener('markerFound', function () {
            if (this.currentVid) {
                this.currentVid.play();
                isPlaying = true;
                playPauseBtn.innerHTML = '⏸';
            }
        }.bind(this));

        marker.addEventListener('markerLost', function () {
            if (this.currentVid) {
                this.currentVid.pause();
                isPlaying = false;
                playPauseBtn.innerHTML = '▶';
            }
        }.bind(this));

        // Control panel functionality
        const nextBtn = document.querySelector("#nextVideo");
        const playPauseBtn = document.querySelector("#playPauseBtn");
        let isPlaying = false;

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
        };

        nextBtn.addEventListener('click', switchToNextVideo);
        playPauseBtn.addEventListener('click', togglePlayPause);
    },
});
