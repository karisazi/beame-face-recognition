# BeaMe: Face Detection App

BeaMe is the easy, flexible way to build real-time face detectors in the browser. Using your webcam and OpenCV, it detects whoever you want. Clean UI, fast results, and ready to power your next personalized face detection project.
**Live Demo:** [https://beamee.vercel.app](https://beamee.vercel.app)
<p align="center">
    <img src="beame_demo.gif" width="100%" alt="Codec demo">
</p>

## 🎯 Goal
BeaMe is built to simplify the process of creating real-time, personalized face detection apps in the browser. Instead of working from scratch, users can retrain the model with their own dataset, update the server, and instantly test face recognition results via webcam. The goal is to provide a clean, modular foundation for rapid prototyping, learning, or building lightweight face-aware applications.

---

## ⚙️ Quick Start

### 🔧 Prerequisites

- Python 3.7 or higher installed  
- Node.js (LTS version) installed

### 💻 Installation & Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/karisazi/beame-face-recognition.git
cd beame-face-recognition

# 2. Install dependencies
pip install -r requirements.txt

# 3. Add data images facse on dataset folder
cd model
mkdir dataset # add face images inside dataset

# update artifacts on server
cd server/artifacts # replace content with updated file .pkl and .json
# deploy updated server

# update server  on UI
cd UI/facedetector
# open src/App.js
# replace server url with your own

# run app locally
npm install 
npm start
```

## 📂 Use Cases
- Quick face detection for security/verification
- Pre-processing for face recognition systems
- Attendance System