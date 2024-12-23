import { useEffect, useRef } from 'react';

interface MatrixConfig {
  speed: number;
  density: number;
  fontSize: number;
  glowStrength: number;
}

const defaultConfig: MatrixConfig = {
  speed: 0.5, // Lower value = slower speed
  density: 0.975, // Higher value = less dense
  fontSize: 16,
  glowStrength: 5
};

const MatrixRainEngine = {
  initialized: false,
  canvas: null as HTMLCanvasElement | null,
  ctx: null as CanvasRenderingContext2D | null,
  characters: 'ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ123456789:・."=*+-<>¦｜╌ﾟ',
  drops: [] as number[],
  config: defaultConfig,
  columns: 0,
  lastFrame: 0,

  init(canvas: HTMLCanvasElement, config: Partial<MatrixConfig> = {}) {
    if (this.initialized) return;
    
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.config = { ...defaultConfig, ...config };
    this.resize();
    
    this.initialized = true;
    this.lastFrame = performance.now();
    requestAnimationFrame((timestamp) => this.animate(timestamp));
  },

  resize() {
    if (!this.canvas || !this.ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = this.canvas.getBoundingClientRect();

    // Set canvas size accounting for device pixel ratio
    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    
    // Scale context to match device pixel ratio
    this.ctx.scale(dpr, dpr);
    
    // Recalculate columns
    this.columns = Math.ceil(rect.width / this.config.fontSize);
    
    // Reset drops array with random starting positions
    this.drops = Array(this.columns).fill(1).map(() => Math.random() * -100);
    
    // Set proper font size
    this.ctx.font = `bold ${this.config.fontSize}px monospace`;

    // Set initial black background
    this.ctx.fillStyle = '#000000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  },

  animate(timestamp: number) {
    if (!this.canvas || !this.ctx) return;

    // Calculate time delta
    const delta = timestamp - this.lastFrame;
    
    // Only update if enough time has passed (controls speed)
    if (delta > (1000 / 60) / this.config.speed) {
      // Clear with solid black background
      this.ctx.fillStyle = '#000000';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Enable glow effect
      this.ctx.shadowBlur = this.config.glowStrength;
      this.ctx.shadowColor = '#0F0';
      
      // Loop over drops
      for (let i = 0; i < this.drops.length; i++) {
        // Random character
        const char = this.characters[Math.floor(Math.random() * this.characters.length)];
        
        // Calculate position
        const x = i * this.config.fontSize;
        const y = this.drops[i] * this.config.fontSize;
        
        // Draw character with bright green color
        this.ctx.fillStyle = '#00FF00';
        this.ctx.fillText(char, x, y);
        
        // Add random bright white characters for emphasis
        if (Math.random() > this.config.density) {
          this.ctx.fillStyle = '#FFFFFF';
          this.ctx.fillText(char, x, y);
        }
        
        // Reset drop or move it down
        if (y > this.canvas.height && Math.random() > this.config.density) {
          this.drops[i] = 0;
        }
        this.drops[i] += this.config.speed;
      }
      
      this.lastFrame = timestamp;
    }
    
    requestAnimationFrame((timestamp) => this.animate(timestamp));
  },

  cleanup() {
    this.initialized = false;
    this.canvas = null;
    this.ctx = null;
    this.drops = [];
  }
};

interface MatrixRainProps {
  config?: Partial<MatrixConfig>;
}

const MatrixRain = ({ config = {} }: MatrixRainProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver(() => {
      MatrixRainEngine.resize();
    });

    MatrixRainEngine.init(canvas, config);
    resizeObserver.observe(canvas);

    return () => {
      resizeObserver.disconnect();
      MatrixRainEngine.cleanup();
    };
  }, [config]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
      }}
    />
  );
};

export default MatrixRain;
