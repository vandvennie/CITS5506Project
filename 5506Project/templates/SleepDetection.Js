const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
let net;

// 加载 PoseNet 模型
async function loadPosenet() {
    net = await posenet.load();
    console.log("PoseNet model loaded");
}

// 点击图片时，触发文件上传输入框
document.getElementById('uploadedImage').addEventListener('click', () => {
    document.getElementById('imageUpload').click();
});

// 处理上传的图像
document.getElementById('imageUpload').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    const img = document.getElementById('uploadedImage');
    img.src = URL.createObjectURL(file); // 显示上传的图片

    img.onload = async () => {
        // 设置画布尺寸
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        // 进行姿态估计
        const pose = await net.estimateSinglePose(img, {
            flipHorizontal: false,
        });

        // 根据姿态判断状态
        const status = analyzePose(pose);
        document.getElementById('activity').innerText = `The person is: ${status}`;
    };
});

// 根据关键点分析姿态
function analyzePose(pose) {
    const keypoints = pose.keypoints;

    // 如果头部关键点（nose）y坐标大于肩部关键点（leftShoulder）y坐标，则可能为“睡着”
    const nose = keypoints.find(k => k.part === 'nose');
    const leftShoulder = keypoints.find(k => k.part === 'leftShoulder');

    if (nose.score > 0.5 && leftShoulder.score > 0.5) {
        if (nose.position.y > leftShoulder.position.y) {
            return 'Sleeping';
        }
    }
    return 'Awake';
}

// 启动程序
loadPosenet();