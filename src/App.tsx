import { useRef, useState, useEffect } from "react";
import styled, {createGlobalStyle} from "styled-components";
import play from "./assets/play.svg";
import pause from "./assets/pause.svg";
import Back from "./assets/backward-step-solid.svg";
import forWard from "./assets/forward-step-solid.svg";
import settings from "./assets/gear-solid.svg";
const VideoUrl = "https://media.w3.org/2010/05/sintel/trailer_hd.mp4";

const playbackSpeedOptions = [
  { value: 0.5, label: "0.5x" },
  { value: 1.0, label: "1.0x" },
  { value: 1.5, label: "1.5x" },
  { value: 2.0, label: "2.0x" },
];

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLProgressElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1.0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [selectedQuality, setSelectedQuality] = useState("720p");
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const video = videoRef.current!;
    video.addEventListener("timeupdate", () => {
      setCurrentTime(video.currentTime);
      setDuration(video.duration);
    });
    return () => {
      video.removeEventListener("timeupdate", () => {});
    };
  }, []);

  const toggleOpenClose = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
    console.log(isOpen);
  };
  const togglePlayPause = () => {
    const video = videoRef.current!;
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const forward5Sec = () => {
    const video = videoRef.current!;
    video.currentTime += 5;
  };

  const replay5Sec = () => {
    const video = videoRef.current!;
    video.currentTime -= 5;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current!;
    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
  };

  const handleQualityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setSelectedQuality(selected);
  };

  const handlePlaybackSpeedChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedSpeed = parseFloat(e.target.value);
    setPlaybackSpeed(selectedSpeed);
    videoRef.current!.playbackRate = selectedSpeed;
  };

  const handleProgressClick: React.MouseEventHandler<HTMLProgressElement> = (
    e
  ) => {
    const progressBar = progressRef.current!;
    const clickX = e.nativeEvent.offsetX;
    const progressBarWidth = progressBar.clientWidth;
    const newTime = (clickX / progressBarWidth) * duration;

    videoRef.current!.currentTime = newTime;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const progress = (currentTime / duration) * 100 || 0;

  return (
    <div>
      <GlobalStyles />
      <Video ref={videoRef}>
        <source src={VideoUrl} type="video/mp4" />
      </Video>
      <Input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
          />
      <ControlDiv>
        <CurrentTimeDiv>
          <span>{formatTime(currentTime)} </span>
          <Progress
            ref={progressRef}
            max="100"
            value={progress}
            onClick={handleProgressClick}
          ></Progress>
          <span> {formatTime(duration)}</span>
        </CurrentTimeDiv>
        <ButtonDiv>
          <ButtonForwardBack onClick={replay5Sec}>
            <ForwardBack src={Back} />
          </ButtonForwardBack>
          <ButtonPlay onClick={togglePlayPause}>
            <PausePlay src={isPlaying ? pause : play} />
          </ButtonPlay>
          <ButtonForwardBack onClick={forward5Sec}>
            <ForwardBack src={forWard} />
          </ButtonForwardBack>

          <SettingsDiv onClick={toggleOpenClose}>
            <Settings src={settings} />
          </SettingsDiv>
          <MainLabel
            style={isOpen ? { display: "inline" } : { display: "none" }}
          >
            <label>
              Speed:
              <select
                value={playbackSpeed}
                onChange={handlePlaybackSpeedChange}
              >
                {playbackSpeedOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Quality:
              <select value={selectedQuality} onChange={handleQualityChange}>
                <option value="720p">720p</option>
                <option value="1080p">1080p</option>
              </select>
            </label>
          </MainLabel>
        </ButtonDiv>
      </ControlDiv>
    </div>
  );
}

export default App;

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    overflow: hidden;

  }
`;

const Video = styled.video`
  width: 100%;
  height: 100vh;
  background-color: black;
`;
const ControlDiv = styled.div`
  position: absolute;
  top: 88%;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  @media only screen and (max-width: 1100px) {
    top: 82%;
  }
  @media only screen and (max-width: 768px) {
    top: 84%;
  }
`;
const Progress = styled.progress`
  width: 90vw;
  height: 6px;
  appearance: none;
  @media only screen and (max-width: 768px) {
    width: 78vw;
  }

  &::-webkit-progress-bar {
    background-color: grey;
    border-radius: 4px;
  }

  &::-webkit-progress-value {
    background-color: #fff;
    border-radius: 4px;
  }

  &::-moz-progress-bar {
    background-color: #007bff;
    border-radius: 43px;
  }
`;
const ButtonDiv = styled.div`
  display: flex;
  gap: 10px;
`;
const ButtonPlay = styled.div`
  height: 53px;
  width: 53px;
  padding: 5px;
  background-color: #fff;
  border: none;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  @media only screen and (max-width: 768px) {
  }
`;
const PausePlay = styled.img`
  width: 30px;
  height: 30px;
  margin-top: 4px;
  margin-left: 2px;
`;
const ButtonForwardBack = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #fff;
  border: none;
  padding: 5px;
  @media only screen and (max-width: 768px) {
  }
`;
const ForwardBack = styled.img`
  width: 20px;
  height: 20px;
`;
const CurrentTimeDiv = styled.div`
  color: #fff;
  font-size: 15px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
`;
const MainLabel = styled.div`
  width: 120px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  position: absolute;
  right: 15%;
  @media only screen and (min-width: 768px) {
    right: 8%;
  }
`;
const SettingsDiv = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #fff;
  border: none;
  padding: 5px;
  position: absolute;
  right: 3%;
`;
const Settings = styled.img`
  width: 20px;
  height: 20px;
  margin-left: 2px;
`;
const Input = styled.input`
position: absolute;
left: 92%;
top: 40%;
transform: rotate(-90deg);
  appearance: none;
  -webkit-appearance: none; /* Remove default styles on Webkit browsers */
  background: grey; /* Track color */
  height: 5px; /* Track height */
  border-radius: 5px;
  outline: none;
  margin: 10px 0; /* Adjust margin as needed */

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px; /* Thumb width */
    height: 20px; /* Thumb height */
    background: #fff; /* Thumb color */
    border: 2px solid #fff; /* Thumb border */
    border-radius: 50%;
    cursor: pointer;
  }

  &:focus::-webkit-slider-thumb {
    border-color: #fff;
  }
@media only screen and (max-width: 768px){
  left: 78%;
}
@media only screen and (max-width: 1100px){
  left: 88%;
}
`;
