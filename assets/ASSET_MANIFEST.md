# Asset Manifest

This document tracks media and marker assets in the project and highlights which files are currently referenced in the application (`index.html` and handler scripts).

## Actively Used Assets

| Asset | Type | Purpose |
| --- | --- | --- |
| `vid1.mp4` | Video | Primary training clip for the left marker rotation.
| `vid2.mp4` | Video | Secondary clip in the left marker playlist.
| `vid3.mp4` | Video | Third clip in the left marker playlist.
| `vid4.mp4` | Video | Fourth clip in the left marker playlist.
| `FemEnv.mp4` | Video | Environment clip used by the R marker sequence.
| `PrintEnv.mp4` | Video | Environment clip used by the R marker sequence.
| `p_marker.patt` | Marker pattern | Custom marker used for the "P" marker.
| `R.patt` | Marker pattern | Custom marker used for the "R" marker.
| `L.patt` | Marker pattern | Custom marker used for the "L" marker.

These files are preloaded through the `<a-assets>` block in `index.html` and are required for the current AR experience.

## Present but Unused Assets

The following items are not referenced by the application code. They appear to be legacy or staging resources and can be removed or migrated into source control ignore rules if they are no longer required.

| Asset | Notes |
| --- | --- |
| `C.patt` | Unused marker pattern.
| `default_marker.patt` | AR.js default pattern; not loaded anywhere.
| `P.patt` | Legacy marker variant.
| `T.patt` | Legacy marker variant.
| `L_marker.png` | Marker graphic; not linked in HTML.
| `Nomarker.png` | Placeholder graphic; unused.
| `p_marker.png` | Marker graphic; unused.
| `R_marker.png` | Marker graphic; unused.
| `pattern-image_2025-07-03_165950281.png` | Generated marker image; unused.
| `output.mp4` | Generated output video; not referenced in code.
| `new/` | Staging directory containing alternate encodes of active videos.
| `og/` | Staging directory containing original source videos.

If any of these assets should become part of the experience, update `index.html` (and handlers if needed) so they are preloaded and referenced. Otherwise consider cleaning them up or keeping them out of version control to reduce repository size.

## Maintenance Tips

- Whenever you introduce a new video or marker, add it to the "Actively Used" table above after wiring it into the scene.
- If you retire a media file, move it to an ignored staging directory or remove it entirely, then update this manifest.
- Large binary assets are good candidates for Git LFS if their history needs to be tracked.
