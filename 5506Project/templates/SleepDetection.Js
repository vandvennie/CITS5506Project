const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
let net;

async function loadPosenet() {
    net = await posenet.load();
    console.log("PoseNet model loaded");
}

document.getElementById('uploadedImage').addEventListener('click', () => {
    document.getElementById('imageUpload').click();
});

document.getElementById('imageUpload').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    const img = document.getElementById('uploadedImage');
    img.src = URL.createObjectURL(file); 
});

document.getElementById('uploadedImage').addEventListener('load', async () => {
    const img = document.getElementById('uploadedImage');
    
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const pose = await net.estimateSinglePose(img, {
        flipHorizontal: false,
    });

    const status = analyzePose(pose);
    document.getElementById('activity').innerText = `The person is: ${status}`;
});

function analyzePose(pose) {
    const keypoints = pose.keypoints;

    const nose = keypoints.find(k => k.part === 'nose');
    const leftShoulder = keypoints.find(k => k.part === 'leftShoulder');

    if (nose.score > 0.5 && leftShoulder.score > 0.5) {
        if (nose.position.y > leftShoulder.position.y) {
            return 'Sleeping';
        }
    }
    return 'Awake';
}

loadPosenet();
