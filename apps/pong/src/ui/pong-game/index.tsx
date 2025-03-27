"use client";

import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useAnimationControls } from "motion/react";
import { useElementDimensions } from "@/hooks/use-element-dimensions";
import { useMobile } from "@/hooks/use-mobile";
import { useOrientation } from "@/hooks/use-orientation";
import useWindowSize from "@/hooks/use-window-size";
import { OrientationOverlay } from "@/ui/orientation-overlay";

// Game constants
const PADDLE_WIDTH = 15;
const BALL_SIZE = 15;
const BASE_BALL_SPEED = 7; // Base speed for reference width
const REFERENCE_WIDTH = 892; // Reference width for speed scaling
const COMPUTER_SPEED_BASE = 4; // Base computer speed
const MAX_BALL_SPEED_BASE = 20; // Base max ball speed
const ANGLE_IMPACT_FACTOR = 1.5;
const PADDLE_VELOCITY_IMPACT = 1.8;
const PADDLE_HEIGHT_PERCENTAGE = 0.18;
const ASPECT_RATIO = 4 / 3;
const MAX_GAME_WIDTH = 892;
const MAX_GAME_HEIGHT = 668;
const WINNING_SCORE = 11;
const SCORE_DIFFERENCE_FOR_SCALING = 3;
const MIN_PADDLE_SCALE = 0.6;
const EDGE_BOUNCE_MULTIPLIER = 1.8;
const MIN_ANGLE_FACTOR = 0.2;
const TOUCH_SENSITIVITY = 0.8;
const CENTER_PADDLE_ON_TOUCH = true;
const POWER_SHOT_THRESHOLD = 8;
const POWER_SHOT_MULTIPLIER = 1.5;
const POWER_SHOT_DURATION = 800;
const TOUCH_ZONE_WIDTH = 60; // Width in pixels for the external touch zone

type GameState = "idle" | "playing" | "paused" | "gameOver";

export default function PongGame() {
  // Get window size for responsive scaling
  const windowSize = useWindowSize();

  // Game state (these should remain as React state since they affect UI)
  const [gameState, setGameState] = useState<GameState>("idle");
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [gameMessage, setGameMessage] = useState("");
  const [powerShotActive, setPowerShotActive] = useState(false);
  const [displayBallSpeed, setDisplayBallSpeed] = useState("0.0");
  const [displayPaddleVelocity, setDisplayPaddleVelocity] = useState("0.0");

  // Refs for real-time game physics (to avoid re-renders)
  const playerPositionRef = useRef(0);
  const computerPositionRef = useRef(0);
  const ballPositionRef = useRef({ x: 0, y: 0 });
  const ballDirectionRef = useRef({ x: BASE_BALL_SPEED, y: BASE_BALL_SPEED });
  const playerPaddleVelocityRef = useRef(0);
  const lastPlayerPositionRef = useRef(0);
  const computerPaddleVelocityRef = useRef(0);
  const lastComputerPositionRef = useRef(0);
  const speedScaleRef = useRef(1.0); // Reference for speed scaling

  // We still need some state for the UI to render properly
  const [playerPosition, setPlayerPosition] = useState(0);
  const [computerPosition, setComputerPosition] = useState(0);
  const [ballPosition, setBallPosition] = useState({ x: 0, y: 0 });

  // Paddle heights
  const [paddleHeight, setPaddleHeight] = useState(100);
  const [playerPaddleHeight, setPlayerPaddleHeight] = useState(paddleHeight);
  const [computerPaddleHeight, setComputerPaddleHeight] =
    useState(paddleHeight);

  // Refs for game elements and animation
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const touchZoneRef = useRef<HTMLDivElement>(null);
  const playerPaddleRef = useRef<HTMLDivElement>(null);
  const computerPaddleRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const lastTouchYRef = useRef<number | null>(null);
  const powerShotTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const wasAutoPaused = useRef(false);
  const gameInitializedRef = useRef(false);

  // Use the element dimensions hook to track game area size in real-time
  const [gameBoardDimensions, measureGameBoard] =
    useElementDimensions(gameAreaRef);

  // Animation controls
  const playerPaddleControls = useAnimationControls();
  const computerPaddleControls = useAnimationControls();
  const ballControls = useAnimationControls();

  // Game dimensions
  const [gameDimensions, setGameDimensions] = useState({
    width: 800,
    height: 600
  });

  // Hooks
  const isMobile = useMobile();
  const {
    isPortrait,
    isLandscape: _isLandscape,
    justRotatedToLandscape
  } = useOrientation();

  // Add this at the top with other refs
  const velocitySmoothingRef = useRef<number[]>([0, 0, 0, 0, 0]); // Last 5 velocity readings
  const gameStartTimeRef = useRef<number>(0);

  // Calculate speed scale based on game width
  const calculateSpeedScale = useCallback((width: number) => {
    if (width <= 0) return 1.0;
    // Calculate the ratio between reference width and current width
    // We want to slow down the ball on smaller screens, so we use a square root to dampen the effect
    return Math.sqrt(REFERENCE_WIDTH / width);
  }, []);

  // Get scaled ball speed
  const getScaledBallSpeed = useCallback(() => {
    return BASE_BALL_SPEED / speedScaleRef.current;
  }, []);

  // Get scaled max ball speed
  const getScaledMaxBallSpeed = useCallback(() => {
    return MAX_BALL_SPEED_BASE / speedScaleRef.current;
  }, []);

  // Get scaled computer speed
  const getScaledComputerSpeed = useCallback(() => {
    return COMPUTER_SPEED_BASE / speedScaleRef.current;
  }, []);

  // Update speed scale when game dimensions change
  useEffect(() => {
    if (gameBoardDimensions.width > 0) {
      const newSpeedScale = calculateSpeedScale(gameBoardDimensions.width);
      speedScaleRef.current = newSpeedScale;

      // Log for debugging
      console.log(
        `Game width: ${gameBoardDimensions.width}, Speed scale: ${newSpeedScale}`
      );
      console.log(`Scaled ball speed: ${getScaledBallSpeed()}`);
    }
  }, [gameBoardDimensions.width, calculateSpeedScale, getScaledBallSpeed]);

  // Update paddle heights based on score difference (ability scaling)
  useEffect(() => {
    if (gameState !== "playing") return;

    const scoreDifference = playerScore - computerScore;

    let playerScale = 1.0;
    let computerScale = 1.0;

    if (scoreDifference >= SCORE_DIFFERENCE_FOR_SCALING) {
      playerScale = Math.max(
        MIN_PADDLE_SCALE,
        1.0 - (scoreDifference - SCORE_DIFFERENCE_FOR_SCALING) * 0.1
      );
    } else if (scoreDifference <= -SCORE_DIFFERENCE_FOR_SCALING) {
      computerScale = Math.max(
        MIN_PADDLE_SCALE,
        1.0 - (Math.abs(scoreDifference) - SCORE_DIFFERENCE_FOR_SCALING) * 0.1
      );
    }

    setPlayerPaddleHeight(Math.round(paddleHeight * playerScale));
    setComputerPaddleHeight(Math.round(paddleHeight * computerScale));
  }, [playerScore, computerScore, paddleHeight, gameState]);

  // Check for game end conditions
  useEffect(() => {
    if (playerScore >= WINNING_SCORE || computerScore >= WINNING_SCORE) {
      const scoreDifference = Math.abs(playerScore - computerScore);

      if (scoreDifference >= 2) {
        const winner = playerScore > computerScore ? "You" : "Computer";
        setGameMessage(`${winner} won ${playerScore}-${computerScore}!`);
        setGameState("gameOver");
      }
    }
  }, [playerScore, computerScore]);

  // Scroll game into view when rotated to landscape
  useEffect(() => {
    if (justRotatedToLandscape && gameContainerRef.current) {
      setTimeout(() => {
        if (gameContainerRef.current) {
          gameContainerRef.current.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center"
          });
        }
      }, 300);
    }
  }, [justRotatedToLandscape]);

  // Pause game when in portrait mode
  useEffect(() => {
    if (isMobile && isPortrait && gameState === "playing") {
      setGameState("paused");
      wasAutoPaused.current = true;
    }
  }, [isMobile, isPortrait, gameState]);

  // Initialize game dimensions and paddle height based on container size
  useEffect(() => {
    const updateDimensions = () => {
      if (gameAreaRef.current) {
        // Use the measure function from useElementDimensions
        measureGameBoard();

        const { width, height } = gameAreaRef.current.getBoundingClientRect();

        setGameDimensions({ width, height });

        const newPaddleHeight = Math.round(height * PADDLE_HEIGHT_PERCENTAGE);
        setPaddleHeight(newPaddleHeight);
        setPlayerPaddleHeight(newPaddleHeight);
        setComputerPaddleHeight(newPaddleHeight);

        // Reset positions
        const initialPlayerPos = height / 2 - newPaddleHeight / 2;
        playerPositionRef.current = initialPlayerPos;
        setPlayerPosition(initialPlayerPos);

        const initialComputerPos = height / 2 - newPaddleHeight / 2;
        computerPositionRef.current = initialComputerPos;
        setComputerPosition(initialComputerPos);

        const initialBallPos = {
          x: width / 2 - BALL_SIZE / 2,
          y: height / 2 - BALL_SIZE / 2
        };
        ballPositionRef.current = initialBallPos;
        setBallPosition(initialBallPos);

        // Update speed scale
        speedScaleRef.current = calculateSpeedScale(width);

        // Mark game as initialized
        gameInitializedRef.current = true;
      }
    };

    updateDimensions();

    // Add a small delay to ensure dimensions are properly calculated
    const timeoutId = setTimeout(() => {
      updateDimensions();
    }, 100);

    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
      clearTimeout(timeoutId);
    };
  }, [measureGameBoard, calculateSpeedScale]);

  // Handle keyboard controls
  useEffect(() => {
    if (gameState !== "playing") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Use real-time dimensions from the hook
      const height = gameBoardDimensions.height || gameDimensions.height;

      if (e.key === "ArrowUp") {
        const newPos = Math.max(0, playerPositionRef.current - 20);
        playerPositionRef.current = newPos;
        setPlayerPosition(newPos);
        playerPaddleControls.start({ top: newPos });
      } else if (e.key === "ArrowDown") {
        const newPos = Math.min(
          height - playerPaddleHeight,
          playerPositionRef.current + 20
        );
        playerPositionRef.current = newPos;
        setPlayerPosition(newPos);
        playerPaddleControls.start({ top: newPos });
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    gameState,
    gameDimensions,
    playerPaddleHeight,
    playerPaddleControls,
    gameBoardDimensions.height
  ]);

  // Trigger power shot effect
  const triggerPowerShot = useCallback(() => {
    setPowerShotActive(true);

    if (powerShotTimeoutRef.current) {
      clearTimeout(powerShotTimeoutRef.current);
    }

    powerShotTimeoutRef.current = setTimeout(() => {
      setPowerShotActive(false);
    }, POWER_SHOT_DURATION);
  }, []);

  // Enhanced paddle collision physics with power shots
  const handlePaddleCollision = useCallback(
    (
      ballPos: { x: number; y: number },
      paddlePos: number,
      paddleHeight: number,
      paddleVelocity: number,
      isPlayerPaddle: boolean
    ) => {
      const hitPosition =
        (ballPos.y + BALL_SIZE / 2 - paddlePos) / paddleHeight;
      let normalizedHitPosition = hitPosition - 0.5;

      const edgeFactor =
        Math.abs(normalizedHitPosition) > 0.3
          ? EDGE_BOUNCE_MULTIPLIER
          : 1 +
            (Math.abs(normalizedHitPosition) / 0.3) *
              (EDGE_BOUNCE_MULTIPLIER - 1);

      normalizedHitPosition *= edgeFactor;

      if (Math.abs(normalizedHitPosition) < MIN_ANGLE_FACTOR) {
        normalizedHitPosition =
          normalizedHitPosition >= 0 ? MIN_ANGLE_FACTOR : -MIN_ANGLE_FACTOR;
      }

      const angle = (normalizedHitPosition * Math.PI) / 3;
      const perpendicularityFactor = Math.abs(Math.sin(angle));
      const speedBoost = perpendicularityFactor * ANGLE_IMPACT_FACTOR;
      const absPaddleVelocity = Math.abs(paddleVelocity);
      const isPowerShot = absPaddleVelocity >= POWER_SHOT_THRESHOLD;

      let paddleImpact = absPaddleVelocity * PADDLE_VELOCITY_IMPACT;

      if (isPowerShot) {
        paddleImpact *= POWER_SHOT_MULTIPLIER;

        if (isPlayerPaddle) {
          triggerPowerShot();
        }
      }

      // Use scaled ball speed
      const scaledBallSpeed = getScaledBallSpeed();
      const scaledMaxBallSpeed = getScaledMaxBallSpeed();

      const baseSpeed = scaledBallSpeed + speedBoost;
      const newSpeed = Math.min(baseSpeed + paddleImpact, scaledMaxBallSpeed);
      const yComponent =
        scaledBallSpeed * Math.sin(angle) + paddleVelocity * 0.5;

      const newDirection = {
        x: isPlayerPaddle
          ? newSpeed * Math.cos(angle)
          : -newSpeed * Math.cos(angle),
        y: yComponent
      };

      const speed = Math.sqrt(
        newDirection.x * newDirection.x + newDirection.y * newDirection.y
      );
      setDisplayBallSpeed(speed.toFixed(1));

      return newDirection;
    },
    [triggerPowerShot, getScaledBallSpeed, getScaledMaxBallSpeed]
  );

  // Reset ball to center
  const resetBall = useCallback(() => {
    if (!gameInitializedRef.current) {
      console.log("Game not initialized, skipping ball reset");
      return;
    }

    // Use real-time dimensions from the hook
    const width = gameBoardDimensions.width || gameDimensions.width;
    const height = gameBoardDimensions.height || gameDimensions.height;

    // Ensure dimensions are valid
    if (width <= 10 || height <= 10) {
      console.log("Invalid game dimensions for ball reset:", width, height);
      return;
    }

    const newBallPos = {
      x: width / 2 - BALL_SIZE / 2,
      y: height / 2 - BALL_SIZE / 2
    };

    ballPositionRef.current = newBallPos;
    setBallPosition(newBallPos);
    ballControls.set(newBallPos);

    const angle = (Math.random() * Math.PI) / 4 - Math.PI / 8;
    const direction = Math.random() > 0.5 ? 1 : -1;

    // Use scaled ball speed
    const scaledBallSpeed = getScaledBallSpeed();
    const initialSpeed = scaledBallSpeed * (1 + Math.random() * 0.2);

    ballDirectionRef.current = {
      x: direction * initialSpeed * Math.cos(angle),
      y: initialSpeed * Math.sin(angle)
    };

    setPowerShotActive(false);
    if (powerShotTimeoutRef.current) {
      clearTimeout(powerShotTimeoutRef.current);
    }

    // Only update display speed when game is actually playing
    if (gameState === "playing") {
      setDisplayBallSpeed(initialSpeed.toFixed(1));
    } else {
      setDisplayBallSpeed("0.0");
    }

    setDisplayPaddleVelocity("0.0");

    // Add a small delay before the ball starts moving again
    setTimeout(() => {
      // Only restart if still in playing state
      if (gameState === "playing") {
        // Game loop will continue automatically since we're updating the refs
        lastTimeRef.current = 0; // Reset time reference to ensure smooth restart
      }
    }, 500);
  }, [
    gameDimensions,
    ballControls,
    gameState,
    gameBoardDimensions,
    getScaledBallSpeed
  ]);

  // Main game loop
  useEffect(() => {
    if (gameState !== "playing" || !gameInitializedRef.current) return;

    // Track paddle velocity with requestAnimationFrame
    let velocityFrameId: number | null = null;

    const trackVelocity = () => {
      const velocity =
        playerPositionRef.current - lastPlayerPositionRef.current;
      playerPaddleVelocityRef.current = velocity;

      // Update velocity smoothing array
      velocitySmoothingRef.current.shift(); // Remove oldest reading
      velocitySmoothingRef.current.push(Math.abs(velocity)); // Add newest reading

      // Calculate average velocity for display
      const avgVelocity =
        velocitySmoothingRef.current.reduce((sum, val) => sum + val, 0) /
        velocitySmoothingRef.current.length;

      // Only update display if significant change or if velocity is near zero
      if (
        Math.abs(Number(displayPaddleVelocity) - avgVelocity) > 0.5 ||
        avgVelocity < 0.2
      ) {
        setDisplayPaddleVelocity(avgVelocity.toFixed(1));
      }

      lastPlayerPositionRef.current = playerPositionRef.current;

      if (gameState === "playing") {
        velocityFrameId = requestAnimationFrame(trackVelocity);
      }
    };

    velocityFrameId = requestAnimationFrame(trackVelocity);

    // Main game loop
    const gameLoop = (timestamp: number) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }

      // Use real-time dimensions from the hook
      const width = gameBoardDimensions.width || gameDimensions.width;
      const height = gameBoardDimensions.height || gameDimensions.height;

      // More robust safety check - ensure dimensions are valid
      if (width <= 10 || height <= 10) {
        console.log("Invalid game dimensions in game loop:", width, height);
        gameLoopRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      // Update ball position
      const newBallPos = {
        x: ballPositionRef.current.x + ballDirectionRef.current.x,
        y: ballPositionRef.current.y + ballDirectionRef.current.y
      };

      // Extra safety check - if ball is way out of bounds, reset it
      if (
        Math.abs(newBallPos.x) > width * 2 ||
        Math.abs(newBallPos.y) > height * 2
      ) {
        console.log("Ball way out of bounds, resetting:", newBallPos);
        resetBall();
        gameLoopRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      // Ball collision with top and bottom walls
      if (newBallPos.y <= 0 || newBallPos.y >= height - BALL_SIZE) {
        ballDirectionRef.current.y = -ballDirectionRef.current.y;
        newBallPos.y = newBallPos.y <= 0 ? 0 : height - BALL_SIZE;
      }

      // Calculate computer paddle velocity
      const computerVelocity =
        computerPositionRef.current - lastComputerPositionRef.current;
      computerPaddleVelocityRef.current = computerVelocity;
      lastComputerPositionRef.current = computerPositionRef.current;

      // Ball collision with paddles
      // Player paddle collision
      if (
        newBallPos.x <= PADDLE_WIDTH &&
        newBallPos.y + BALL_SIZE >= playerPositionRef.current &&
        newBallPos.y <= playerPositionRef.current + playerPaddleHeight
      ) {
        ballDirectionRef.current = handlePaddleCollision(
          newBallPos,
          playerPositionRef.current,
          playerPaddleHeight,
          playerPaddleVelocityRef.current,
          true
        );
        newBallPos.x = PADDLE_WIDTH;
      }

      // Computer paddle collision
      if (
        newBallPos.x + BALL_SIZE >= width - PADDLE_WIDTH &&
        newBallPos.y + BALL_SIZE >= computerPositionRef.current &&
        newBallPos.y <= computerPositionRef.current + computerPaddleHeight
      ) {
        ballDirectionRef.current = handlePaddleCollision(
          newBallPos,
          computerPositionRef.current,
          computerPaddleHeight,
          computerPaddleVelocityRef.current,
          false
        );
        newBallPos.x = width - PADDLE_WIDTH - BALL_SIZE;
      }

      // Scoring - but only if game has been running for at least 500ms
      const gameRunningTime = Date.now() - gameStartTimeRef.current;
      if (gameRunningTime < 500) {
        // Game just started, don't allow scoring yet
        if (newBallPos.x < 0 || newBallPos.x > width) {
          console.log("Preventing early scoring, game just started");
          resetBall();
          gameLoopRef.current = requestAnimationFrame(gameLoop);
          return;
        }
      }

      // Regular scoring logic
      if (newBallPos.x < 0) {
        // Computer scores
        setComputerScore(prev => prev + 1);
        resetBall();
        // Don't return here, let the game loop continue
        // Just skip the rest of this frame
        gameLoopRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      if (newBallPos.x > width) {
        // Player scores
        setPlayerScore(prev => prev + 1);
        resetBall();
        // Don't return here, let the game loop continue
        // Just skip the rest of this frame
        gameLoopRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      // Update ball position in ref and animate
      ballPositionRef.current = newBallPos;
      ballControls.set(newBallPos);

      // Only update React state occasionally for UI updates (not every frame)
      if (timestamp % 6 === 0) {
        setBallPosition(newBallPos);
      }

      // Move computer paddle (simple AI)
      const ballCenter = newBallPos.y + BALL_SIZE / 2;
      const paddleCenter =
        computerPositionRef.current + computerPaddleHeight / 2;

      // Use scaled computer speed
      const scaledComputerSpeed = getScaledComputerSpeed();

      if (ballCenter < paddleCenter - 10) {
        const newPos = Math.max(
          0,
          computerPositionRef.current - scaledComputerSpeed
        );
        computerPositionRef.current = newPos;
        computerPaddleControls.set({ top: newPos });

        // Only update React state occasionally
        if (timestamp % 6 === 0) {
          setComputerPosition(newPos);
        }
      } else if (ballCenter > paddleCenter + 10) {
        const newPos = Math.min(
          height - computerPaddleHeight,
          computerPositionRef.current + scaledComputerSpeed
        );
        computerPositionRef.current = newPos;
        computerPaddleControls.set({ top: newPos });

        // Only update React state occasionally
        if (timestamp % 6 === 0) {
          setComputerPosition(newPos);
        }
      }

      // Continue the game loop
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
      if (velocityFrameId) {
        cancelAnimationFrame(velocityFrameId);
      }
    };
  }, [
    gameState,
    gameDimensions,
    playerPaddleHeight,
    computerPaddleHeight,
    handlePaddleCollision,
    resetBall,
    displayPaddleVelocity,
    ballControls,
    computerPaddleControls,
    gameBoardDimensions,
    getScaledComputerSpeed
  ]);

  // Start game
  const startGame = useCallback(() => {
    // Ensure game is initialized before starting and dimensions are valid
    if (
      !gameInitializedRef.current ||
      gameBoardDimensions.width <= 10 ||
      gameBoardDimensions.height <= 10
    ) {
      console.log("Game not ready to start. Dimensions:", gameBoardDimensions);

      // Force a dimension update
      measureGameBoard();

      if (gameAreaRef.current) {
        const rect = gameAreaRef.current.getBoundingClientRect();
        console.log("Current getBoundingClientRect:", rect);

        if (rect.width > 10 && rect.height > 10) {
          setGameDimensions({ width: rect.width, height: rect.height });
          gameInitializedRef.current = true;

          // Try again after a short delay to ensure state is updated
          setTimeout(() => {
            startGame();
          }, 100);
        } else {
          console.log(
            "Game area still has invalid dimensions. Cannot start game."
          );
          return;
        }
      } else {
        console.log("Game area ref not available");
        return;
      }
      return;
    }

    // Reset paddle positions to ensure they're within bounds
    const height = gameBoardDimensions.height || gameDimensions.height;

    // Center paddles vertically
    const initialPlayerPos = height / 2 - playerPaddleHeight / 2;
    playerPositionRef.current = initialPlayerPos;
    setPlayerPosition(initialPlayerPos);
    playerPaddleControls.set({ top: initialPlayerPos });

    const initialComputerPos = height / 2 - computerPaddleHeight / 2;
    computerPositionRef.current = initialComputerPos;
    setComputerPosition(initialComputerPos);
    computerPaddleControls.set({ top: initialComputerPos });

    resetBall();
    setPlayerScore(0);
    setComputerScore(0);
    setGameMessage("");
    setGameState("playing");

    setPlayerPaddleHeight(paddleHeight);
    setComputerPaddleHeight(paddleHeight);
    gameStartTimeRef.current = Date.now();
  }, [
    paddleHeight,
    resetBall,
    gameDimensions,
    gameBoardDimensions,
    playerPaddleHeight,
    computerPaddleHeight,
    measureGameBoard,
    playerPaddleControls,
    computerPaddleControls
  ]);

  // Pause game
  const togglePause = useCallback(() => {
    setGameState(prev => (prev === "playing" ? "paused" : "playing"));
  }, []);

  // Show orientation overlay for mobile devices in portrait mode
  const showOrientationOverlay = isMobile && isPortrait;

  // Auto-resume game when rotating back to landscape if it was paused due to orientation
  useEffect(() => {
    if (
      justRotatedToLandscape &&
      gameState === "paused" &&
      wasAutoPaused.current
    ) {
      setTimeout(() => {
        setGameState("playing");
        wasAutoPaused.current = false;
      }, 500);
    }
  }, [justRotatedToLandscape, gameState]);

  // Create a background pattern (8x8 bitmap tile)
  const createBackgroundPattern = () => {
    return (
      <div className="absolute inset-0 opacity-10">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='8' height='8' viewBox='0 0 8 8' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h4v4H0V0zm4 4h4v4H4V4z' fill='%23ffffff' fillOpacity='0.4' fillRule='evenodd'/%3E%3C/svg%3E")`,
            backgroundSize: "8px 8px"
          }}
        />
      </div>
    );
  };

  // Handle mouse movement for desktop
  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (gameState !== "playing" || isMobile) return;

      // Use real-time dimensions from the hook
      const height = gameBoardDimensions.height || gameDimensions.height;
      const rect = gameAreaRef.current?.getBoundingClientRect();

      if (rect) {
        const relativeY = e.clientY - rect.top;
        const newPos = Math.min(
          Math.max(0, relativeY - playerPaddleHeight / 2),
          height - playerPaddleHeight
        );

        playerPositionRef.current = newPos;
        playerPaddleControls.set({ top: newPos });

        // Only update React state occasionally to reduce renders
        if (Date.now() % 3 === 0) {
          setPlayerPosition(newPos);
        }
      }
    },
    [
      gameState,
      isMobile,
      gameDimensions,
      playerPaddleHeight,
      playerPaddleControls,
      gameBoardDimensions.height
    ]
  );

  // Handle touch start for mobile
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (gameState !== "playing") return;

      // Use real-time dimensions from the hook
      const height = gameBoardDimensions.height || gameDimensions.height;
      if (!e.touches[0]) return;
      const touch = e.touches[0];
      lastTouchYRef.current = touch.clientY;

      if (CENTER_PADDLE_ON_TOUCH) {
        // Get the touch position relative to the game area
        const gameRect = gameAreaRef.current?.getBoundingClientRect();
        if (gameRect) {
          // Calculate the relative Y position in the game area
          const relativeY = touch.clientY - gameRect.top;
          const newPos = Math.min(
            Math.max(0, relativeY - playerPaddleHeight / 2),
            height - playerPaddleHeight
          );

          playerPositionRef.current = newPos;
          setPlayerPosition(newPos);
          playerPaddleControls.start({ top: newPos });
        }
      }
    },
    [
      gameState,
      gameDimensions,
      playerPaddleHeight,
      playerPaddleControls,
      gameBoardDimensions.height
    ]
  );

  // Handle touch move for mobile with sensitivity adjustment
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (gameState !== "playing") return;

      // Use real-time dimensions from the hook
      const height = gameBoardDimensions.height || gameDimensions.height;
      if (!e.touches[0]) return;
      const touch = e.touches[0];

      const currentTouchY = touch.clientY;

      if (lastTouchYRef.current !== null) {
        const moveDelta =
          (currentTouchY - lastTouchYRef.current) * TOUCH_SENSITIVITY;
        const newPos = Math.min(
          Math.max(0, playerPositionRef.current + moveDelta),
          height - playerPaddleHeight
        );

        playerPositionRef.current = newPos;
        playerPaddleControls.set({ top: newPos });

        // Only update React state occasionally to reduce renders
        if (Date.now() % 3 === 0) {
          setPlayerPosition(newPos);
        }
      }

      lastTouchYRef.current = currentTouchY;
      e.preventDefault(); // Prevent scrolling while controlling
    },
    [
      gameState,
      gameDimensions,
      playerPaddleHeight,
      playerPaddleControls,
      gameBoardDimensions.height
    ]
  );

  // Handle touch end
  const handleTouchEnd = useCallback(() => {
    lastTouchYRef.current = null;
  }, []);

  // Add this to the useEffect that watches gameState changes
  useEffect(() => {
    if (gameState !== "playing") {
      setDisplayBallSpeed("0.0");
      setDisplayPaddleVelocity("0.0");
      // Reset velocity smoothing array
      velocitySmoothingRef.current = [0, 0, 0, 0, 0];
    }
  }, [gameState]);

  // Calculate responsive game size based on window dimensions
  const calculateGameSize = () => {
    // Default to max size
    let gameWidth = MAX_GAME_WIDTH;
    let gameHeight = MAX_GAME_HEIGHT;

    // If window is smaller than max size, scale down proportionally
    if (windowSize.width > 0) {
      const availableWidth = Math.min(windowSize.width * 0.9, MAX_GAME_WIDTH);
      const availableHeight = Math.min(
        windowSize.height * 0.7,
        MAX_GAME_HEIGHT
      );

      // Maintain aspect ratio
      if (availableWidth / availableHeight > ASPECT_RATIO) {
        // Height is the limiting factor
        gameHeight = availableHeight;
        gameWidth = gameHeight * ASPECT_RATIO;
      } else {
        // Width is the limiting factor
        gameWidth = availableWidth;
        gameHeight = gameWidth / ASPECT_RATIO;
      }
    }

    return { width: gameWidth, height: gameHeight };
  };

  // Get calculated game size
  const calculatedGameSize =
    windowSize.width > 0
      ? calculateGameSize()
      : { width: MAX_GAME_WIDTH, height: MAX_GAME_HEIGHT };

  return (
    <>
      {showOrientationOverlay && <OrientationOverlay />}

      <div
        ref={gameContainerRef}
        id="game-container"
        className="flex w-full max-w-4xl flex-col items-center"
        tabIndex={-1}>
        <div className="mb-4 flex w-full justify-between">
          <div className="text-2xl font-bold text-white">
            Player: {playerScore}
          </div>
          <div className="flex gap-2">
            {(gameState === "idle" || gameState === "gameOver") && (
              <button
                onClick={startGame}
                className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                disabled={showOrientationOverlay}>
                {gameState === "gameOver" ? "Play Again" : "Start Game"}
              </button>
            )}
            {(gameState === "playing" || gameState === "paused") && (
              <button
                onClick={togglePause}
                className="rounded bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
                disabled={showOrientationOverlay}>
                {gameState === "paused" ? "Resume" : "Pause"}
              </button>
            )}
          </div>
          <div className="text-2xl font-bold text-white">
            Computer: {computerScore}
          </div>
        </div>

        {/* Game area wrapper with 4:3 aspect ratio constraint and external touch zone for mobile */}
        <div className="flex w-full justify-center">
          <div className="flex items-center justify-center">
            {/* External touch control zone for mobile */}
            {isMobile && !isPortrait && gameState === "playing" && (
              <div
                ref={touchZoneRef}
                className="relative mr-2 h-full rounded-lg border border-white/20"
                style={{
                  width: `${TOUCH_ZONE_WIDTH}px`,
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  height: `${calculatedGameSize.height}px`
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}>
                {/* Visual indicator for touch zone */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30">
                  <div className="flex h-16 w-8 items-center justify-center rounded-full border border-white">
                    <div className="h-8 w-1 rounded-full bg-white"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Game board */}
            <div
              className="relative"
              style={{
                width: `${calculatedGameSize.width}px`,
                height: `${calculatedGameSize.height}px`,
                maxWidth: "100%"
              }}>
              <div
                ref={gameAreaRef}
                className="absolute inset-0 touch-none overflow-hidden border-2 border-white bg-gray-800"
                onMouseMove={!isMobile ? handleMouseMove : undefined}>
                {/* Background pattern */}
                {createBackgroundPattern()}

                {/* Player paddle */}
                <motion.div
                  ref={playerPaddleRef}
                  className={`absolute left-0 rounded-sm ${powerShotActive ? "bg-blue-400 shadow-[0_0_15px_5px_rgba(59,130,246,0.7)]" : "bg-blue-500"}`}
                  style={{
                    width: PADDLE_WIDTH,
                    height: playerPaddleHeight,
                    top: playerPosition,
                    transition: powerShotActive
                      ? "background-color 0.1s, box-shadow 0.1s"
                      : "none"
                  }}
                  animate={playerPaddleControls}
                  initial={{ top: playerPosition }}
                  transition={{ type: "tween", duration: 0 }}
                  drag={!isMobile ? "y" : false}
                  dragConstraints={{
                    top: 0,
                    bottom:
                      gameBoardDimensions.height > 0
                        ? gameBoardDimensions.height - playerPaddleHeight
                        : gameDimensions.height - playerPaddleHeight
                  }}
                  dragElastic={0.1}
                  onDrag={(_, info) => {
                    if (!isMobile) {
                      // Use real-time dimensions from the hook
                      const height =
                        gameBoardDimensions.height || gameDimensions.height;
                      const newPos = Math.min(
                        Math.max(0, info.point.y),
                        height - playerPaddleHeight
                      );
                      playerPositionRef.current = newPos;
                      setPlayerPosition(newPos);
                    }
                  }}
                />

                {/* Computer paddle */}
                <motion.div
                  ref={computerPaddleRef}
                  className="absolute right-0 rounded-sm bg-red-500"
                  style={{
                    width: PADDLE_WIDTH,
                    height: computerPaddleHeight,
                    top: computerPosition
                  }}
                  animate={computerPaddleControls}
                  initial={{ top: computerPosition }}
                  transition={{ type: "tween", duration: 0 }}
                />

                {/* Ball */}
                <motion.div
                  ref={ballRef}
                  className={`absolute rounded-full ${powerShotActive ? "bg-blue-200 shadow-[0_0_10px_3px_rgba(59,130,246,0.7)]" : "bg-white"}`}
                  style={{
                    width: BALL_SIZE,
                    height: BALL_SIZE,
                    left: ballPosition.x,
                    top: ballPosition.y
                  }}
                  animate={ballControls}
                  initial={{ left: ballPosition.x, top: ballPosition.y }}
                  transition={{ type: "tween", duration: 0 }}
                />

                {/* Center line */}
                <div className="dashed absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/30" />

                {/* Game state overlays */}
                {gameState === "idle" && !showOrientationOverlay && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                    <div className="text-center text-white">
                      <h2 className="mb-4 text-3xl font-bold">Pong Game</h2>
                      <p className="mb-2">
                        Use arrow keys or click/tap to move your paddle
                      </p>
                      <p className="mb-2">
                        Move your paddle quickly to hit powerful shots!
                      </p>
                      <p className="mb-4">
                        First to 11 points wins (must win by 2)!
                      </p>
                      <button
                        onClick={startGame}
                        className="rounded-lg bg-green-500 px-6 py-3 text-xl text-white hover:bg-green-600">
                        Start Game
                      </button>
                    </div>
                  </div>
                )}

                {gameState === "paused" && !showOrientationOverlay && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                    <div className="text-center text-white">
                      <h2 className="mb-4 text-3xl font-bold">Game Paused</h2>
                      <button
                        onClick={togglePause}
                        className="rounded-lg bg-yellow-500 px-6 py-3 text-xl text-white hover:bg-yellow-600">
                        Resume Game
                      </button>
                    </div>
                  </div>
                )}

                {gameState === "gameOver" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/70">
                    <div className="text-center text-white">
                      <h2 className="mb-4 text-3xl font-bold">Game Over</h2>
                      <p className="mb-6 text-2xl">{gameMessage}</p>
                      <button
                        onClick={startGame}
                        className="rounded-lg bg-green-500 px-6 py-3 text-xl text-white hover:bg-green-600">
                        Play Again
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Game info and instructions - Fixed height container to prevent layout shift */}
        <div className="mt-4 flex h-24 flex-col items-center">
          {gameState === "playing" && (
            <div className="mb-2 flex gap-4 text-sm text-white">
              <div>
                Ball Speed:{" "}
                <span
                  className={powerShotActive ? "font-bold text-blue-300" : ""}>
                  {displayBallSpeed}
                </span>
              </div>
              <div>
                Paddle Velocity:{" "}
                <span
                  className={
                    Number(displayPaddleVelocity) >= POWER_SHOT_THRESHOLD
                      ? "font-bold text-yellow-300"
                      : ""
                  }>
                  {displayPaddleVelocity}
                  {Number(displayPaddleVelocity) >= POWER_SHOT_THRESHOLD &&
                    " 🔥"}
                </span>
              </div>
              {powerShotActive && (
                <span className="animate-pulse font-bold text-blue-300">
                  POWER SHOT!
                </span>
              )}
            </div>
          )}

          {isMobile && !isPortrait && (
            <div className="text-center text-white">
              <p>
                Use the touch area to the left of the game to control your
                paddle
              </p>
              <p className="mt-1 text-sm text-yellow-300">
                Tip: Move quickly for power shots!
              </p>
            </div>
          )}

          {!isMobile && (
            <div className="text-center text-white">
              <p>Use arrow keys or mouse to position your paddle</p>
              <p className="mt-1 text-sm text-yellow-300">
                Tip: Move quickly for power shots!
              </p>
            </div>
          )}

          {/* Display ability scaling info when active */}
          {(playerPaddleHeight < paddleHeight ||
            computerPaddleHeight < paddleHeight) && (
            <div className="mt-2 text-center text-sm text-yellow-300">
              <p>
                Ability scaling active: The leading player's paddle is reduced
                in size
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
