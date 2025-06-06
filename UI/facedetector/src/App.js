import React, { useRef, useEffect, useState } from "react";

function App() {
  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const lastSpokenRef = useRef(null);

  const [hasPhoto, setHasPhoto] = useState(false);
  const [faces, setFaces] = useState([]);
  const [lastSpokenTime, setLastSpokenTime] = useState(Date.now());
  

  const getVideo = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: window.innerWidth },
          height: { ideal: window.innerHeight }
        }
      })
      .then(stream => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.onloadedmetadata = () => {
          video.play().catch(err => {
            console.error('Play error:', err);
          });
        };
      })
      .catch(err => {
        console.error(err);
      });
  };

  const takePhoto = () => {
    const width = 414;
    const height = width / (16 / 9);

    let video = videoRef.current;
    let photo = photoRef.current;

    photo.width = width;
    photo.height = height;

    let ctx = photo.getContext('2d');
    ctx.drawImage(video, 0, 0, width, height);
    setHasPhoto(true);
  };

  const closePhoto = () => {
    let photo = photoRef.current;
    let ctx = photo.getContext('2d');

    ctx.clearRect(0, 0, photo.width, photo.height);
    setHasPhoto(false);
  };

  useEffect(() => {
    getVideo();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const video = videoRef.current;
      const canvas = photoRef.current;
  
      if (!video || !canvas || video.videoWidth === 0) return;
  
      // Get actual video size
      const VIDEO_WIDTH = video.videoWidth;
      const VIDEO_HEIGHT = video.videoHeight;
  
      // Set canvas size to match video
      const displayRect = video.getBoundingClientRect();
      canvas.width = displayRect.width;
      canvas.height = displayRect.height;
  
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, displayRect.width, displayRect.height);
  
      const base64Image = canvas.toDataURL("image/jpeg");
  
      fetch("https://beame.pythonanywhere.com/classify_image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ image: base64Image })
      })
        .then(res => res.json())
        .then(data => {
          // console.log(data);
          if (data && data[0] && data[0].face_dim_x_y_w_h) {
            const facesData = data.map((item, index) => {
              const dimensions = item.face_dim_x_y_w_h;
              const className = item.class;
              const classProbability = item.class_probability[item.class_dictionary[className]];
              
              return {
                x: dimensions[0],
                y: dimensions[1],
                w: dimensions[2],
                h: dimensions[3],
                id: index,  // Set unique id using the index
                className,
                classProbability
              };
            });
            console.log(facesData)
      
            setFaces(facesData);  // Save the transformed data in faces state
          } else {
            setFaces([]);
            console.warn("No face dimensions found");
          }
        })
        .catch(err => console.error("Send error:", err));
    }, 2000);
  
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const speakWithCooldown = () => {
      const now = Date.now();
      const cooldownPeriod = 5000; // 5 seconds cooldown
  
      if (now - lastSpokenTime < cooldownPeriod) {
        return; // Skip if last speech was too recent
      }
  
      if (faces.length > 0) {
        const allClasses = faces.map(d => d.className).join(", ");
  
        if (lastSpokenRef.current !== allClasses) {
          const utterance = new SpeechSynthesisUtterance(`${allClasses}, I love you`);
          utterance.pitch = 1.5;  // Friendly pitch
          utterance.rate = 0.9;   // Slower, easier to follow
  
          const voices = speechSynthesis.getVoices();
          const femaleVoice = voices.find(voice =>
            voice.name.toLowerCase().includes("female") ||
            voice.name.toLowerCase().includes("woman") ||
            voice.name.toLowerCase().includes("zira") || // Windows voice
            voice.name.toLowerCase().includes("google uk english female")
          );
  
          if (femaleVoice) {
            utterance.voice = femaleVoice;
          }
  
          speechSynthesis.speak(utterance);
          lastSpokenRef.current = allClasses;
          setLastSpokenTime(now);  // Update the last spoken time
        }
      } else {
        lastSpokenRef.current = null;
      }
    };
  
    // Handle voice loading
    if (speechSynthesis.getVoices().length === 0) {
      speechSynthesis.onvoiceschanged = () => speakWithCooldown();
    } else {
      speakWithCooldown();
    }
  }, [faces, lastSpokenTime]);
  

  return (
<div className="App">
  <div className="camera" style={{ position: 'relative' }}>
    <video ref={videoRef}></video>

    {/* Display bounding boxes for faces */}
    {faces.length > 0 && faces.map((dimension, index) => (
      <div key={index} style={{ position: 'absolute', left: `${dimension.x}px`, top: `${dimension.y}px` }}>
        {/* Bounding box */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: `${dimension.w}px`,
            height: `${dimension.h}px`,
            border: '2px solid red',
            backgroundColor: 'transparent',
          }}
        />
        
        {/* Label with class name and probability */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: -24,
            color: 'red',
            fontSize: '14px',
            fontWeight: 'bold',
            backgroundColor: 'white',
            padding: '2px 5px',
            borderRadius: '5px',
          }}
        >
          {dimension.className} ({(dimension.classProbability).toFixed(2)}%)
        </div>
      </div>
    ))}
  </div>

  <div className={'result ' + (hasPhoto ? 'hasPhoto' : '')}>
    <canvas ref={photoRef}></canvas>
  </div>
</div>

  );
}

export default App;
