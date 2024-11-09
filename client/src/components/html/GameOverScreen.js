import { useState, useEffect } from 'react';
import cubeRunLogo from '../../textures/cuberun-logo.png';
import '../../styles/gameMenu.css';
import { useStore } from '../../state/useStore';
import { Contract, RpcProvider } from "starknet";
import { contractAddress } from '../constant';
import { useSelector } from 'react-redux';

const GameOverScreen = () => {
  // Retrieve the previous high score from local storage or default to 0
  const previousScore = localStorage.getItem('highscore') ? JSON.parse(localStorage.getItem('highscore')) : 0;
  const [shown, setShown] = useState(false);
  const [opaque, setOpaque] = useState(false);
  const [highScore, setHighScore] = useState(previousScore);
  const userId = window.location.pathname.split('/').pop();
  const connection = useSelector((state) => state.connection);

  const gameOver = useStore((s) => s.gameOver);
  const score = useStore((s) => s.score);

  useEffect(() => {
    let t;
    if (gameOver !== opaque) t = setTimeout(() => setOpaque(gameOver), 500);
    return () => clearTimeout(t);
  }, [gameOver, opaque]);

  useEffect(() => {
    if (gameOver) {
      setShown(true);
      submitOrUpdateScore(score); // Attempt to submit the score or update it if it exists
    } else {
      setShown(false);
    }
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) {
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('highscore', JSON.stringify(score));
      }
    }
  }, [gameOver, score, highScore]);

  const highScoreOnChain = async (score) => {
    const provider = new RpcProvider({
      nodeUrl:
        "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_7/NC_mjlIJfcEpaOhs3JB4JHcjFQhcFOrs",
    });

    const ContAbi = await provider.getClassAt(contractAddress);
    console.log(">> contract abi", ContAbi);
    const newContract = new Contract(
      ContAbi.abi,
      contractAddress,
      connection?.provider
    );
    const address = connection.address;
    console.log("wallet address", address);
    console.log("contract details", newContract);
    const integerScore = Math.round(score);
    const response = await newContract.addHighScore(integerScore);
    console.log(">> response", response);
  };

  useEffect(() => {
    highScoreOnChain(score);
  }, [gameOver]);

  const readHighScoreOnChain = async () => {
    const provider = new RpcProvider({
      nodeUrl:
        "https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_7/NC_mjlIJfcEpaOhs3JB4JHcjFQhcFOrs",
    });

    const ContAbi = await provider.getClassAt(contractAddress);
    console.log(">> contract abi", ContAbi);
    const newContract = new Contract(
      ContAbi.abi,
      contractAddress,
      provider
    );
    const address = connection.address;
    console.log("wallet address", address);
    console.log("contract details", newContract);
    const response = await newContract.getHighScore();
    console.log(">> high score", parseInt(response));
    setHighScore(parseInt(response));
  };
  useEffect(() => {
    readHighScoreOnChain();
  }, [gameOver, score, highScore]);

  const submitOrUpdateScore = async (score) => {
    try {
      // Attempt to submit the score
      console.log('Submitting score:', score);
      const response = await fetch('https://virtual-gf-py.vercel.app/score/add_score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          score: parseInt(score, 10),
          type: 'game2',
        }),
      });

      // Check if the score already exists
      const data = await response.json();
      console.log('Score submission response:', data);
      if (data.error && data.error.includes("already exists")) {
        // If the score exists, update it instead
        await updateScore(score);
      } else {
        console.log('Score submitted successfully:', data);
      }
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  };

  const updateScore = async (newScore) => {
    try {
      console.log('Updating score:', newScore);
      const response = await fetch('https://virtual-gf-py.vercel.app/score/update_score', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          new_score: parseInt(newScore, 10),
          type: 'game2',
        }),
      });
      const data = await response.json();
      console.log('Score update response:', data);
    } catch (error) {
      console.error('Error updating score:', error);
    }
  };

  const handleRestart = () => {
    window.location.reload(); // TODO: make a proper restart
  };

  return shown ? (
    <div className="game__container" style={{ opacity: shown ? 1 : 0, background: opaque ? '#141622FF' : '#141622CC' }}>
      <div className="game__menu">
        <img className="game__logo-small" width="512px" src={cubeRunLogo} alt="Cuberun Logo" />
        <h1 className="game__score-gameover">GAME OVER</h1>
        <div className="game__scorecontainer">
          <div className="game__score-left">
            <h1 className="game__score-title">SCORE</h1>
            <h1 className="game__score">{score.toFixed(0)}</h1>
          </div>
          <div className="game__score-right">
            <h1 className="game__score-title">HIGH SCORE</h1>
            <div className="game__score">
              <span
                style={{ textDecoration: score.toFixed(0) === highScore.toFixed(0) ? 'underline' : 'none' }}
                className="game__score-score"
              >
                {highScore > 0 ? Math.round(highScore) : '-'}
              </span>
            </div>
          </div>
        </div>
        <button onClick={handleRestart} className="game__menu-button">
          RESTART
        </button>
      </div>
    </div>
  ) : null;
};

export default GameOverScreen;
