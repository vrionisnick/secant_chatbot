// Chatbot.js
import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocation } from 'react-router-dom';
import jsonData from '../secant_questions.json';
import '../css/Chatbot.css';

const api_base_url = 'http://localhost:5000';
//const api_base_url = 'https://inf-webapp.herokuapp.com/:5000';

function Chatbot() {
  const useQuery = () => {
    const { search } = useLocation();
    return React.useMemo(() => new URLSearchParams(search), [search]);
  };

  const query = useQuery();
  const totalQuestions = parseInt(query.get('questions'), 10) || 3;
  const token = query.get('token') || 'test';

  const [askedQuestions, setAskedQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [questionCount, setQuestionCount] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [evaluationFinished, setEvaluationFinished] = useState(false);
  const [correctResponse, setCorrectResponse] = useState('');
  const [questionHistory, setQuestionHistory] = useState([]);

  const lastQuestionRef = useRef(null);
  const submitButtonRef = useRef(null);
  const chatHistoryEndRef = useRef(null);

  const StartAgain = () => {
    // Reset state
    setAskedQuestions([]);
    setCurrentQuestion(null);
    setSelectedAnswer('');
    setQuestionCount(0);
    setShowResult(false);
    setCorrectAnswers(0);
    setEvaluationFinished(false);
    setCorrectResponse('');
    setQuestionHistory([]);
  };
  
  

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    if (questionCount < totalQuestions && jsonData.questions.length > 0) {
      let potentialQuestions = jsonData.questions.filter(
        q => !askedQuestions.includes(q.id)
      );
      if (potentialQuestions.length > 0) {
        let randomQuestionIndex = Math.floor(Math.random() * potentialQuestions.length);
        let randomQuestion = potentialQuestions[randomQuestionIndex];
        let shuffledResponses = shuffleArray([...randomQuestion.responses]);

        setCurrentQuestion({ ...randomQuestion, responses: shuffledResponses });
        setCorrectResponse(randomQuestion.responses.find(r => r.result === "correct").response);
        setAskedQuestions(prev => [...prev, randomQuestion.id]);
        setShowResult(false);
        setSelectedAnswer('');
      }
    } else {
      setEvaluationFinished(true);
    }
  }, [questionCount, totalQuestions]);

  useEffect(() => {
    if (showResult && currentQuestion) {
      console.log("Selected answer:", selectedAnswer);
      console.log("Correct response:", correctResponse);
      console.log("Is answer correct?", selectedAnswer === correctResponse);
      setQuestionHistory(prev => [
        ...prev,
        { question: currentQuestion.question, answer: selectedAnswer, correct: selectedAnswer === correctResponse, link: currentQuestion.link }
      ]);
    }
  }, [showResult, currentQuestion, selectedAnswer, correctResponse]);
  

  const generateSessionId = () => {
    return localStorage.getItem('session_id') || createAndStoreSessionId();
  };
  
  const createAndStoreSessionId = () => {
    const newId = uuidv4(); 
    localStorage.setItem('session_id', newId);
    return newId;
  };
  
  const handleSubmit = async () => {
    const answerIsCorrect = selectedAnswer === correctResponse;
    setShowResult(true);
    if (answerIsCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }

    const answerData = {
      question: currentQuestion.question,
      user_token: token,
      answer_date: new Date().toISOString(),
      answer: selectedAnswer,
      status: answerIsCorrect ? 'correct' : 'wrong',
      session_id: generateSessionId() // Use session_id for consistency
    };

    try {
      const response = await fetch(`${api_base_url}/submit-answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answerData),
      });

      if (!response.ok) {
        console.error('Error submitting answer');
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };
  
  const handleNextQuestion = () => {
    if (questionCount < totalQuestions - 1) {
      setQuestionCount(prev => prev + 1);
    } else {
      setEvaluationFinished(true);
    }
  };

  const getButtonClassName = (response) => {
    let className = 'chatbot-answer-button';
    if (response === selectedAnswer) {
      className += ' selected';
    }
    if (showResult) {
      if (response === correctResponse) {
        className += ' correct';
      } else if (response === selectedAnswer) {
        className += ' incorrect';
      }
    }
    return className;
  };

  return (
    <div className="chatbot-container">
      <div className="question-history">
        {questionHistory.map((item, index) => (
          <div key={index} className="chatbot-question-answer">
            <div className="chatbot-question">{item.question}</div>
            <div className={`chatbot-answer ${item.correct ? 'correct' : 'incorrect'} ${evaluationFinished ? 'color' : ''}`}>
              {item.answer}
              {!item.correct && (
                <p>
                  <strong>Answer was wrong.</strong> Learn more <a href={item.link} target="_blank" rel="noopener noreferrer">here</a>.
                </p>
              )}
            </div>
          </div>
        ))}
        <div ref={chatHistoryEndRef}></div>
      </div>
  
      {!evaluationFinished && currentQuestion && (
        <div className="current-question">
          <div className="chatbubble">
            <div className="chatbot-question">{currentQuestion.question}</div>
            <div className="chatbot-answers">
              {currentQuestion.responses.map((response, index) => (
                <button
                  key={`${currentQuestion.id}-response-${index}`}
                  className={getButtonClassName(response.response)}
                  onClick={() => setSelectedAnswer(response.response)}
                  disabled={showResult}
                  ref={index === currentQuestion.responses.length - 1 ? lastQuestionRef : null}
                >
                  {response.response}
                </button>
              ))}
            </div>
          </div>
          {!showResult && (
            <button className="chatbot-submit-button" onClick={handleSubmit} disabled={!selectedAnswer} ref={submitButtonRef}>
              Submit
            </button>
          )}
          {showResult && (
            <div>
              <button className="chatbot-next-button" onClick={handleNextQuestion}>
                {questionCount < totalQuestions - 1 ? "Next Question" : "Show Results"}
              </button>
            </div>
          )}
        </div>
      )}
      {evaluationFinished && (
        <div className="evaluation-results">
          <button className="chatbot-start-again-button" onClick={() => StartAgain()}>
            Start Again
          </button>
        </div>
      )}
    </div>
  );
}

export default Chatbot