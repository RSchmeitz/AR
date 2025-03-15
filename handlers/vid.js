AFRAME.registerComponent('videohandler', {
    init: function () {
        var marker = this.el;
        this.vid1 = document.querySelector("#vid1");
        this.vid2 = document.querySelector("#vid2");
        this.currentVid = this.vid1;
        this.videoTitle = document.querySelector("#videoTitle");
        this.videoNumber = 1;
        this.videoTitles = ["Video 1: Environment demo", "Video 2: RL Agent Playthrough"]; // Add video titles

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
            this.videoNumber = this.videoNumber === 2 ? 1 : 2;
            this.currentVid = this.videoNumber === 1 ? this.vid1 : this.vid2;

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
