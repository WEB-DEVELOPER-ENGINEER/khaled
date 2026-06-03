import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { levelService, submissionService } from '../services/api';
import './LevelPage.css';

const LevelPage = () => {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadStates, setUploadStates] = useState({});

  useEffect(() => {
    fetchWords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelId]);

  const fetchWords = async () => {
    try {
      const response = await levelService.getLevelWords(levelId);
      setWords(response.data.words);
      
      // Initialize upload states for each word
      const states = {};
      response.data.words.forEach((word, index) => {
        states[index] = { file: null, uploading: false, result: null };
      });
      setUploadStates(states);
    } catch (error) {
      toast.error('Failed to load words');
      navigate('/home');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (index, file) => {
    setUploadStates(prev => ({
      ...prev,
      [index]: { ...prev[index], file, result: null }
    }));
  };

  const handleSubmit = async (index, word) => {
    const state = uploadStates[index];
    
    if (!state.file) {
      toast.error('Please select a video file');
      return;
    }

    setUploadStates(prev => ({
      ...prev,
      [index]: { ...prev[index], uploading: true, result: null }
    }));

    try {
      const response = await submissionService.verifySubmission(
        state.file,
        word
      );

      const result = response.data;
      
      setUploadStates(prev => ({
        ...prev,
        [index]: { ...prev[index], uploading: false, result }
      }));

      if (result.isMatch) {
        toast.success(`Correct! Your submission matches "${word}"`);
      } else {
        toast.error(`Incorrect. Expected "${word}" but got "${result.predictedWord}"`);
      }
    } catch (error) {
      setUploadStates(prev => ({
        ...prev,
        [index]: { ...prev[index], uploading: false }
      }));
      toast.error('Error verifying submission. Please try again.');
    }
  };

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;
    
    const videoIdMatch = url.match(
      /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?/\s]{11})/
    );
    
    if (videoIdMatch && videoIdMatch[1]) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="level-page">
        <div className="loading-state">
          <div className="loading"></div>
          <p>Loading words...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="level-page">
      <header className="level-header">
        <div className="container">
          <div className="level-header-content">
            <button onClick={() => navigate('/home')} className="back-button">
              ← Back to Levels
            </button>
            <div className="level-title">
              <h2>Level {levelId}</h2>
            </div>
          </div>
        </div>
      </header>

      <main className="level-content">
        <div className="container">
          <div className="words-grid">
            {words.map((wordData, index) => {
              const embedUrl = getYoutubeEmbedUrl(wordData.url);
              const state = uploadStates[index] || {};

              return (
                <div key={index} className="word-card">
                  <div className="word-header">
                    <h3>{wordData.word}</h3>
                  </div>

                  <div className="video-container">
                    {embedUrl ? (
                      <iframe
                        src={embedUrl}
                        title={wordData.word}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <div className="video-placeholder">
                        📹
                      </div>
                    )}
                  </div>

                  <div className="upload-section">
                    <div className="file-input-wrapper">
                      <input
                        type="file"
                        id={`file-${index}`}
                        accept="video/*"
                        onChange={(e) => handleFileChange(index, e.target.files[0])}
                        disabled={state.uploading}
                      />
                      <label 
                        htmlFor={`file-${index}`}
                        className={`file-input-label ${state.file ? 'file-selected' : ''}`}
                      >
                        {state.file ? (
                          <>
                            📹 Video Selected
                            <span className="file-name">{state.file.name}</span>
                          </>
                        ) : (
                          '📤 Choose Video to Upload'
                        )}
                      </label>
                    </div>

                    <button
                      className="submit-button"
                      onClick={() => handleSubmit(index, wordData.word)}
                      disabled={!state.file || state.uploading}
                    >
                      {state.uploading ? (
                        <>
                          <span className="loading"></span>
                          Verifying...
                        </>
                      ) : (
                        'Submit Recording'
                      )}
                    </button>

                    {state.result && (
                      <div className={`result-message ${state.result.isMatch ? 'result-success' : 'result-error'}`}>
                        {state.result.isMatch ? (
                          <>
                            ✅ Correct Match!
                            <div className="result-details">
                              Confidence: {(state.result.confidence * 100).toFixed(1)}%
                            </div>
                          </>
                        ) : (
                          <>
                            ❌ No Match
                            <div className="result-details">
                              Expected: {state.result.expectedWord}<br />
                              Detected: {state.result.predictedWord} 
                              ({(state.result.confidence * 100).toFixed(1)}%)
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LevelPage;
