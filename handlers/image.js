AFRAME.registerComponent('mediahandler', {
    init: function () {
        var marker = this.el;
        var mediaId = this.el.getAttribute('media-id');
        this.media = document.querySelector(mediaId);

        marker.addEventListener('markerFound', function () {
            this.toggle = true;
            if (this.media.play) { // Check if it's a video
                this.media.play();
            }
        }.bind(this));

        marker.addEventListener('markerLost', function () {
            this.toggle = false;
            if (this.media.pause) { // Check if it's a video
                this.media.pause();
            }
        }.bind(this));
    }
});
