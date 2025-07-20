// src/component/FaceExpressionDetector.jsx
import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const FaceExpressionDetector = () => {
  const videoRef = useRef(null);
  const [expression, setExpression] = useState("Click to detect");

  const emojiMap = {
    happy: "😄",
    sad: "😢",
    angry: "😠",
    surprised: "😲",
    disgusted: "🤢",
    fearful: "😨",
    neutral: "😐",
  };

  // Load face-api.js models
  const loadModels = async () => {
    const MODEL_URL = "/models";
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
      ]);
    } catch (err) {
      console.error("❌ Failed to load models:", err);
      setExpression("Model error");
    }
  };

  // Start webcam
  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("❌ Webcam access failed:", err);
      setExpression("Camera error");
    }
  };

  // Detect face expression once
  const handleDetectClick = async () => {
    const detections = await faceapi
      .detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      )
      .withFaceExpressions();

    if (detections.length > 0) {
      const expressions = detections[0].expressions;
      const maxValue = Math.max(...Object.values(expressions));
      const currentExpression = Object.keys(expressions).find(
        (key) => expressions[key] === maxValue
      );
      setExpression(currentExpression);
      console.log("Detected Expression:", currentExpression);
    } else {
      setExpression("No face detected");
      console.log("❗ No face detected");
    }
  };

  // Load models and start camera on mount
  useEffect(() => {
    loadModels();
    startVideo();
  }, []);

  return (
    <div className="flex flex-col items-center mt-10">
      <video
        ref={videoRef}
        autoPlay
        muted
        width="640"
        height="480"
        className="rounded-lg shadow-lg border-2 border-blue-500"
      />
      <button
        onClick={handleDetectClick}
        className="mt-5 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Detect Expression
      </button>
      <div className="mt-4 text-2xl font-semibold">
        Expression: {expression} {emojiMap[expression] || "🤖"}
      </div>
    </div>
  );
};

export default FaceExpressionDetector;
