Malcolm X 100th Birthday Filter
A web-based camera filter app to celebrate the centennial of Malcolm X (1925–2025). Users can take a selfie or photo with their webcam, overlay a commemorative Malcolm X medallion or badge, and download/share the result. Presented by CMG Worldwide.

------------

Table of Contents
Project Overview
How It Works
File & Code Structure
index.html
filter.js
Image Assets
Customization
Browser Support
Credits
License

Project Overview
This project is a static web application that allows users to:
Access their device camera in-browser.
Overlay a Malcolm X centennial medallion or badge on their live video feed.
Move and resize the medallion overlay (drag & pinch).
Switch between two overlays (medallion and full-frame badge).
Flip between front and back cameras (if supported).
Capture a photo with the overlay and download it as a PNG.
Retake photos as needed.
No server or backend is required; everything runs in the browser.

------------

How It Works

Camera Access:
The app requests permission to use the user's camera and displays the video feed in a square container.
Overlay Selection:
Users can switch between two overlays using left/right arrow buttons.
The first overlay is a medallion badge (draggable and resizable).
The second overlay is a full-frame badge (fixed).
Overlay Manipulation:
The medallion overlay can be dragged and pinched (on touch devices) or dragged and resized (on desktop) to fit the user's face or desired position.

Flip Camera:
The "Flip Camera" button toggles between the front and back cameras (if available).
Capture & Download:
The "Capture" button takes a snapshot of the video feed with the overlay.
The result is displayed, and the user can download the image as a PNG.

Retake:
The "Retake" button returns to the live camera view for another attempt.

------------

File & Code Structure

index.html
Purpose:
The main HTML file that structures the web page, loads styles, and includes the JavaScript logic.
Key Sections:
Header: Displays the title "Malcolm X Centennial Stamp".
Camera Container: Contains the live video feed, overlay image, navigation arrows, and a hidden canvas for capturing images.
Controls: Includes "Flip Camera" and "Capture" buttons.
Download & Retake: "Download and Share" link and "Retake" button, shown after capturing a photo.
Footer: CMG Worldwide branding and logo.
Script: Loads filter.js for all interactive logic.
Styling:
Inline CSS provides a modern, dark-themed, responsive layout. The camera container is always square, and overlays are styled for both full-frame and medallion modes.

------------

filter.js
Purpose:
Handles all camera, overlay, and user interaction logic.
Key Functionalities:
Camera Initialization: Uses navigator.mediaDevices.getUserMedia to access the camera and display the video feed.
Overlay Management: Loads two overlays (overlay1.png and overlay2.png). Users can switch overlays with navigation arrows.
Drag & Pinch Logic: For the medallion overlay, pointer events allow users to drag (move) and pinch (resize) the overlay. This works on both desktop and mobile.
Flip Camera: Switches between front and back cameras by changing the facingMode constraint.
Capture Logic: When "Capture" is clicked:
Draws the current video frame onto a hidden canvas.
Draws the overlay image in the correct position and scale (for the medallion, this is calculated based on user manipulation).
Hides the live UI and shows the result with download and retake options.
Download: Converts the canvas to a PNG and sets it as the download link.
Retake: Restores the live camera view and overlay controls.
Why This Approach:
All logic is client-side for privacy and speed.
Uses modern browser APIs for camera and pointer events.
No dependencies or frameworks, making it lightweight and portable.

------------

Image Assets
overlay1.png: The medallion badge overlay. This image is draggable and resizable by the user.
overlay2.png: The full-frame badge overlay. This image covers the entire camera view and is fixed in place.
cmg_logo.png: The CMG Worldwide logo, displayed in the footer for branding.
How to Replace:
You can swap these images for new overlays or branding as needed. Just keep the filenames or update the references in the code.
Customization
Overlays: Replace overlay1.png and overlay2.png with your own PNG overlays (transparent backgrounds recommended).
Branding: Update the logo or footer text in index.html as needed.
Styling: Modify the <style> section in index.html for custom colors, fonts, or layout.

------------

Browser Support
Modern browsers with camera and pointer event support (Chrome, Firefox, Edge, Safari).
Mobile browsers supported (with camera access).
Credits
Malcolm X Centennial (1925–2025)
Presented by CMG Worldwide

------------

License
This project is for educational and commemorative purposes. Please ensure you have the rights to use all images and branding materials.
