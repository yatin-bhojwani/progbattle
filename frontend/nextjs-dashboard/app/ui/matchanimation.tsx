import { useEffect, useRef, useState } from 'react';
import { MatchFrame } from '../lib/matchframe';
type PongAnimationProps = {
  matchData: MatchFrame[];
  onClose: () => void;
};

export default function PongAnimation ({ matchData, onClose }: PongAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const animationRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number | null>(null);
  const [frameRate, setFrameRate] = useState(5); // Default 30 FPS

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scale = 600 / 30; // Scale from 30x30 to 600x600
    const frameDelay = 1000 / frameRate; // Milliseconds per frame

    const drawFrame = () => {
      const frame = matchData[currentFrame];
      if (!frame) return;

      // Clear canvas
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw scores
      ctx.fillStyle = 'white';
      ctx.font = '24px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(`Player 1: ${frame.score_bot1}`, 20, 600);
      ctx.textAlign = 'left';
      ctx.fillText(`Player 2: ${frame.score_bot2}`, 20, 30);

      // Draw paddles
      const paddleWidth = 35;
      const paddleHeight = 15;
      
      // Bottom paddle (paddle1)
      ctx.fillStyle = 'blue';
      ctx.fillRect(
        parseFloat(frame.paddle1_x) * scale - paddleWidth/2,
        canvas.height - 40,
        paddleWidth,
        paddleHeight
      );
      
      // Top paddle (paddle2)
      ctx.fillStyle = 'red';
      ctx.fillRect(
        parseFloat(frame.paddle2_x) * scale - paddleWidth/2,
        15,
        paddleWidth,
        paddleHeight
      );

      // Draw ball
      ctx.beginPath();
      ctx.arc(
        parseFloat(frame.ball_x) * scale,
        parseFloat(frame.ball_y) * scale + 30,
        5,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = 'white';
      ctx.fill();
    };

    const animate = (timestamp: number) => {
      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = timestamp;
      }
      
      const elapsed = timestamp - lastFrameTimeRef.current;
      
      if (isPlaying && elapsed > frameDelay) {
        setCurrentFrame(prev => (prev + 1) % matchData.length);
        lastFrameTimeRef.current = timestamp;
        drawFrame();
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };

    drawFrame();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [currentFrame, isPlaying, matchData, frameRate]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      <div className="relative">
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={645}
          className="border-2 border-white rounded-lg"
        />
        
        <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-2">
          <div className="flex gap-4">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-500"
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>
            <button
              onClick={onClose}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-500"
            >
              Close
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-white">
            <span>Speed:</span>
            <button 
              onClick={() => setFrameRate(prev => Math.max(10, prev - 5))}
              className="bg-gray-700 px-3 py-1 rounded"
            >
              -
            </button>
            <span>{frameRate} FPS</span>
            <button 
              onClick={() => setFrameRate(prev => Math.min(60, prev + 5))}
              className="bg-gray-700 px-3 py-1 rounded"
            >
              +
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};