const tracker = new clm.tracker();  // Initialize the face tracking object
tracker.init();  // Set up the tracker

// Trigger image file input when the 'uploadedImages' button is clicked
document.getElementById('uploadedImages').addEventListener('click', () => {
    document.getElementById('imageUploads').click();
});

async function initialize() {
    // DOM element references for images, canvas, and other UI components
    const activity_img = document.getElementById('activity_img');
    const activity_img_show = document.getElementById('activity_img_show');
    const uploadedImages = document.getElementById('uploadedImages');
    const imageUploads = document.getElementById('imageUploads');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');  // Canvas context for drawing

    // Handle image file selection and update the preview image source
    imageUploads.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            uploadedImages.src = URL.createObjectURL(file);  // Create a URL for the selected image
        }
    });

    // Start face detection when the image is fully loaded
    uploadedImages.addEventListener('load', () => {
        detectFace(uploadedImages, canvas, ctx, tracker, activity_img, activity_img_show);
    });
}

// Detect face and update the UI based on the tracking results
function detectFace(img, canvas, ctx, tracker, activity_img, activity_img_show) {
    // Adjust canvas size to match the image dimensions
    canvas.width = img.width;
    canvas.height = img.height;

    // Clear previous canvas content and draw the new image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    // Start tracking face features on the canvas
    tracker.start(canvas);
    const positions = tracker.getCurrentPosition();  // Get the current facial landmarks

    // If face features are detected, evaluate eye state and update UI
    if (positions.length > 0) {
        const leftEye = [positions[36], positions[37], positions[38]];  // Left eye landmarks
        const rightEye = [positions[42], positions[43], positions[44]];  // Right eye landmarks

        const leftEyeOpen = isEyeOpen(leftEye);  // Check if the left eye is open
        const rightEyeOpen = isEyeOpen(rightEye);  // Check if the right eye is open

        // Update status message and toggle visibility of activity images
        const status = 'Baby is on bed.';
        document.getElementById('on_bed').innerText = status;
        activity_img_show.style.display = 'none';
        activity_img.style.display = 'block';
    } else {
        // If no face is detected, update the status and switch activity images
        document.getElementById('on_bed').innerText = 'Baby is not on bed.';
        activity_img_show.style.display = 'block';
        activity_img.style.display = 'none';
    }
}

// Check if the eye is open by comparing vertical and horizontal distances between landmarks
function isEyeOpen(eyeLandmarks) {
    const verticalDistance = Math.abs(eyeLandmarks[0][1] - eyeLandmarks[2][1]);  // Vertical distance between landmarks
    const horizontalDistance = Math.abs(eyeLandmarks[0][0] - eyeLandmarks[1][0]);  // Horizontal distance between landmarks
    return verticalDistance < horizontalDistance * 0.01;  // Return true if the eye is open
}

// Initialize the application
initialize();
