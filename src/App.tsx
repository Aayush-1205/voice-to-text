import React, { useEffect, useState } from "react";
import "./index.css";
import {
  FaCopy,
  FaMicrophone,
  FaRegCircleStop,
  FaVolumeHigh,
} from "react-icons/fa6";
import "regenerator-runtime/runtime"; // Must import before react-speech-recognition
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { Save } from "react-ionicons";

const App = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [language, setLanguage] = useState("en-Us");
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    const chars = transcript.replace(/\s+/g, "");
    setCharCount(chars.length);
  }, [transcript]);

  const handleStartRecording = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true, language });
    }
  };

  const handleSaveTranscript = () => {
    const blob = new Blob([transcript], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "transcript.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setLanguage(event.target.value);
  };

  const handleSpeakTranscript = () => {
    const utterance = new SpeechSynthesisUtterance(transcript);
    utterance.lang = language;
    window.speechSynthesis.speak(utterance);
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!browserSupportsSpeechRecognition) {
    return <span>Your browser doesn't support speech recognition. :(</span>;
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white">
      <h1 className="my-5 font-semibold text-2xl">Welcome to Voice to Text</h1>
      <div className="xl:w-[40vw] md:w-[60vw] w-[90%] flex flex-col shadow-lg bg-white p-5 rounded-lg relative">
        <div className="w-full h-[200px] md:h-[300px] relative pb-2 pt-8 font-medium text-gray-900 leading-7">
          <Save
            onClick={transcript && handleSaveTranscript}
            cssClasses={`absolute top-0 left-0 ${
              transcript
                ? "cursor-pointer opacity-100"
                : "cursor-default opacity-50"
            } !fill-[rgba(2,71,157,1)]`}
          />
          <FaCopy
            onClick={() => copyText(transcript)}
            size={20}
            className={`absolute top-0 left-10 ${
              transcript
                ? "cursor-pointer opacity-100"
                : "cursor-default opacity-50"
            } !fill-[rgba(2,71,157,1)]`}
          />

          <FaVolumeHigh
            size={22}
            onClick={handleSpeakTranscript}
            className={`absolute bottom-0 left-0 ${
              transcript
                ? "cursor-pointer opacity-100"
                : "cursor-default opacity-50"
            } !fill-[rgba(2,71,157,1)]`}
          />
          <select
            className="w-fit h-fit px-1 bg-gray-200 text-gray-600 font-medium rounded-lg absolute top-0 right-0 outline-none"
            onChange={handleLanguageChange}
            value={language}
          >
            <option value="en-US">English</option>
            <option value="en-IN">English - IN</option>
            <option value="hi">Hindi</option>
            <option value="es-ES">Spanish</option>
            <option value="fr-FR">French</option>
            <option value="de-DE">German</option>
          </select>
          <div className="h-[140px] pb-2 mt-2 pr-1 w-full overflow-y-auto">
            {transcript ? (
              transcript
            ) : (
              <div className="absolute opacity-60 left-1/2 top-[60%] -translate-x-1/2 -translate-y-1/2 font-bold text-2xl md:text-[30px] text-center text-gray-500">
                Click On Start Recording
              </div>
            )}
          </div>
        </div>

        <div
          className={`mt-5 text-[#333] font-medium ${
            transcript ? "opacity-100" : "opacity-30"
          }`}
        >
          <p>Character Count: {charCount}</p>
        </div>

        <div className="flex w-full items-center gap-3 mt-5">
          <button
            onClick={handleStartRecording}
            className={`w-full flex gap-1 justify-center items-center text-white font-medium rounded-md py-3 ${
              listening ? "bg-red-500" : "bg-[rgba(2,71,157,1)]"
            }`}
          >
            {listening ? (
              <FaRegCircleStop className={`!fill-white !text-white`} />
            ) : (
              <FaMicrophone className={`!fill-white !text-white`} />
            )}
            {listening ? "Stop" : "Start"} Recording
          </button>
          <button
            onClick={() => {
              SpeechRecognition.stopListening();
              resetTranscript();
            }}
            className="bg-gray-500 text-white font-medium rounded-md py-3 w-[30%]"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="mt-5">
        <footer className="text-lg">
          Created by <a
            href="https://github.com/Aayush-1205/voice-to-text"
            target="_blank"
            className="text-white"
          >
             @Aayush
          </a>
        </footer>
      </div>
    </div>
  );
};

export default App;
