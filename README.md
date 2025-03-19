# Interactive AR Video Demonstration Platform

An augmented reality visualization platform designed for academic poster presentations, enabling interactive demonstration of research videos through AR markers.

## Academic Applications
- Interactive poster presentations
- Real-time research demonstrations
- Multi-video comparative analysis
- Seamless switching between visualization modes

## Technical Implementation
This implementation leverages AR.js and A-Frame frameworks for web-based augmented reality visualization.

### System Requirements
- Modern web browser (Chrome/Firefox/Safari)
- Webcam-enabled device
- Local or remote web server

### Quick Setup for Poster Presentations

1. Repository setup:
```bash
git clone [your-repository]
cd [repository-name]
```

2. Framework dependencies (add to your HTML):
```html
<script src="https://aframe.io/releases/1.0.4/aframe.min.js"></script>
<script src="https://raw.githack.com/AR-js-org/AR.js/master/aframe/build/aframe-ar.js"></script>
```

### Marker Generation for Your Poster
1. Generate your marker at: [AR.js Marker Generator](https://jeromeetienne.github.io/AR.js/three.js/examples/marker-training/examples/generator.html)
2. Integrate the pattern file (.patt) into your assets
3. Print the marker alongside your poster

### Research Video Integration
```javascript
this.videoTitles = ["Experimental Results", "Comparative Analysis"];
```

## Presentation Mode Features
- **Dual Display Modes:** Switch between AR and traditional viewing
- **Sequential Analysis:** Easy navigation between multiple result videos
- **Real-time Control:** Dynamic playback management
- **Marker Stability:** Enhanced tracking for stable presentations

## Best Practices for Academic Presentations
- Mount poster on non-reflective surface
- Position marker at eye-level
- Ensure adequate lighting (>200 lux)
- Test marker recognition distance (optimal: 0.5-2m)

## Technical Notes
- Marker detection latency: ~300ms
- Video format: H.264 encoded MP4

## Deployment on GitHub Pages

### Quick Setup
1. Enable GitHub Pages for your repository:
   - Go to Settings > Pages
   - Select branch 'main' (or 'master') as source
   - Select root folder (/) as source

2. Configure your domain (optional):
   - Default URL: https://username.github.io/repository-name
   - Custom domain can be configured in Pages settings

### Automatic Deployment
The included `.github/workflows/deploy.yml` handles automatic deployment:
- Builds on every push to main/master
- Deploys to GitHub Pages automatically
- No additional configuration needed

### Testing Your Deployment
1. After pushing changes, check Actions tab for deployment status
2. Once deployed, your AR demo will be available at:
   - https://username.github.io/repository-name
   - Or your custom domain if configured

### Best Practices
- Test locally before pushing
- Ensure all assets use relative paths
- Keep video files under GitHub's size limits
- Use Git LFS for large files if needed

## QR Code Generation for Easy Access

### Using Python to Generate QR Code
1. Install QR code generator:
```bash
pip install qrcode
```

2. Generate QR code for your GitHub Pages URL:
```python
import qrcode

# Replace with your actual GitHub Pages URL
url = "https://username.github.io/repository-name"

# Generate QR code
qr = qrcode.QRCode(version=1, box_size=10, border=5)
qr.add_data(url)
qr.make(fit=True)

# Create and save the image
qr_image = qr.make_image(fill_color="black", back_color="white")
qr_image.save("ar_demo_qr.png")
```

3. Print the QR code alongside your poster
   - Recommended size: 5x5 cm
   - Place near AR marker for easy access
   - Test QR code readability under presentation lighting

### URL Structure
- Default GitHub Pages URL format: 
  - `https://username.github.io/repository-name`
  - Example: `https://research-lab.github.io/ar-demo`
- Custom domain (if configured):
  - `https://your-custom-domain.com`

## References
Based on [AR.js](https://github.com/AR-js-org/AR.js) framework
