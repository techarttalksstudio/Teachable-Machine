// Teachable Machine 匯出模型的網址
const URL = "https://teachablemachine.withgoogle.com/models/T00-hhSUl/";

let model, webcam, labelContainer, maxPredictions;

// 載入模型並初始化攝影機
async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // 載入模型與標籤資料
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // 建立攝影機
    const flip = true; // 是否要水平翻轉
    webcam = new tmImage.Webcam(200, 200, flip); // 寬、高、翻轉
    await webcam.setup(); // 取得攝影機權限
    await webcam.play();
    window.requestAnimationFrame(loop);

    // 把攝影機畫布加到網頁中
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"));
    }

    //按鈕按下後休息
    document.querySelector("button").style.display = "none";
}

// 每一幀更新攝影機與預測
async function loop() {
    webcam.update(); // 更新攝影機畫面
    await predict();
    window.requestAnimationFrame(loop);
}

// 執行預測
async function predict() {
    // 可以輸入 image、video 或 canvas 元素
    const prediction = await model.predict(webcam.canvas);

    // 顯示所有類別的預測值
    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction =
            prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        labelContainer.childNodes[i].innerHTML = classPrediction;
    }

    // 額外判斷：假設第 1 個類別 (index 1) 代表「娃娃」
    const resultDiv = document.getElementById("result");
    if (prediction[0].probability > 0.5) {
        resultDiv.innerHTML = "<span style='color:green;font-weight:bold;'>娃娃</span>";
    } else {
        resultDiv.innerHTML = "<span style='color:red;font-weight:bold;'>無娃娃</span>";
    }
}
