/**
 * Cyberpunk Terminal Auth Page Template
 * Matrix rain + glitch effects + CRT scanlines
 */

export function getAuthPageHTML(siteName: string): string {
  const title = siteName.toUpperCase()
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex,nofollow">
  <title>Access Required | ${siteName}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&display=swap');
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    :root {
      --matrix-green: #00FF41;
      --neon-cyan: #00FFFF;
      --hot-pink: #FF00FF;
      --deep-black: #0D0D0D;
      --card-bg: #0a0a0a;
      --border: #1a1a1a;
    }
    
    body { 
      font-family: 'JetBrains Mono', monospace;
      min-height: 100vh;
      background: var(--deep-black);
      color: var(--matrix-green);
      overflow: hidden;
      position: relative;
    }
    
    /* Matrix Rain Canvas */
    #matrix-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 0;
      opacity: 0.15;
    }
    
    /* CRT Scanlines */
    .scanlines {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      pointer-events: none;
      background: repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.15),
        rgba(0, 0, 0, 0.15) 1px,
        transparent 1px,
        transparent 2px
      );
    }
    
    /* CRT Flicker */
    .crt-flicker {
      animation: flicker 0.15s infinite;
    }
    
    @keyframes flicker {
      0% { opacity: 0.97; }
      50% { opacity: 1; }
      100% { opacity: 0.98; }
    }
    
    /* Main Container */
    .container { 
      position: relative;
      z-index: 10;
      display: flex; 
      align-items: center; 
      justify-content: center; 
      min-height: 100vh;
      padding: 1rem;
    }
    
    /* Auth Card */
    .auth-card {
      background: rgba(10, 10, 10, 0.95);
      border: 1px solid var(--matrix-green);
      border-radius: 4px;
      padding: 2.5rem;
      max-width: 420px;
      width: 100%;
      box-shadow: 
        0 0 20px rgba(0, 255, 65, 0.1),
        inset 0 0 60px rgba(0, 255, 65, 0.03);
    }
    
    /* Glitch Effect */
    .glitch {
      position: relative;
      font-size: 1.5rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3em;
      text-align: center;
      margin-bottom: 0.5rem;
      animation: glitch-skew 1s infinite linear alternate-reverse;
    }
    
    .glitch::before,
    .glitch::after {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    
    .glitch::before {
      left: 2px;
      text-shadow: -2px 0 var(--hot-pink);
      clip: rect(44px, 450px, 56px, 0);
      animation: glitch-anim 5s infinite linear alternate-reverse;
    }
    
    .glitch::after {
      left: -2px;
      text-shadow: -2px 0 var(--neon-cyan);
      clip: rect(44px, 450px, 56px, 0);
      animation: glitch-anim2 3s infinite linear alternate-reverse;
    }
    
    @keyframes glitch-anim {
      0% { clip: rect(31px, 9999px, 94px, 0); transform: skew(0.5deg); }
      5% { clip: rect(70px, 9999px, 71px, 0); transform: skew(0.5deg); }
      10% { clip: rect(29px, 9999px, 24px, 0); transform: skew(0.5deg); }
      15% { clip: rect(85px, 9999px, 73px, 0); transform: skew(0.5deg); }
      20% { clip: rect(26px, 9999px, 29px, 0); transform: skew(0.5deg); }
      25% { clip: rect(64px, 9999px, 85px, 0); transform: skew(0.5deg); }
      30% { clip: rect(45px, 9999px, 11px, 0); transform: skew(0.5deg); }
      35% { clip: rect(15px, 9999px, 16px, 0); transform: skew(0.5deg); }
      40% { clip: rect(66px, 9999px, 80px, 0); transform: skew(0.5deg); }
      45% { clip: rect(2px, 9999px, 48px, 0); transform: skew(0.5deg); }
      50% { clip: rect(56px, 9999px, 89px, 0); transform: skew(0.5deg); }
      55% { clip: rect(46px, 9999px, 68px, 0); transform: skew(0.5deg); }
      60% { clip: rect(26px, 9999px, 19px, 0); transform: skew(0.5deg); }
      65% { clip: rect(73px, 9999px, 1px, 0); transform: skew(0.5deg); }
      70% { clip: rect(37px, 9999px, 15px, 0); transform: skew(0.5deg); }
      75% { clip: rect(60px, 9999px, 72px, 0); transform: skew(0.5deg); }
      80% { clip: rect(18px, 9999px, 54px, 0); transform: skew(0.5deg); }
      85% { clip: rect(40px, 9999px, 47px, 0); transform: skew(0.5deg); }
      90% { clip: rect(19px, 9999px, 63px, 0); transform: skew(0.5deg); }
      95% { clip: rect(68px, 9999px, 54px, 0); transform: skew(0.5deg); }
      100% { clip: rect(95px, 9999px, 53px, 0); transform: skew(0.5deg); }
    }
    
    @keyframes glitch-anim2 {
      0% { clip: rect(65px, 9999px, 100px, 0); transform: skew(0.5deg); }
      5% { clip: rect(52px, 9999px, 74px, 0); transform: skew(0.5deg); }
      10% { clip: rect(79px, 9999px, 85px, 0); transform: skew(0.5deg); }
      15% { clip: rect(75px, 9999px, 5px, 0); transform: skew(0.5deg); }
      20% { clip: rect(67px, 9999px, 61px, 0); transform: skew(0.5deg); }
      25% { clip: rect(14px, 9999px, 79px, 0); transform: skew(0.5deg); }
      30% { clip: rect(1px, 9999px, 66px, 0); transform: skew(0.5deg); }
      35% { clip: rect(86px, 9999px, 30px, 0); transform: skew(0.5deg); }
      40% { clip: rect(23px, 9999px, 98px, 0); transform: skew(0.5deg); }
      45% { clip: rect(85px, 9999px, 72px, 0); transform: skew(0.5deg); }
      50% { clip: rect(71px, 9999px, 75px, 0); transform: skew(0.5deg); }
      55% { clip: rect(2px, 9999px, 48px, 0); transform: skew(0.5deg); }
      60% { clip: rect(30px, 9999px, 16px, 0); transform: skew(0.5deg); }
      65% { clip: rect(59px, 9999px, 50px, 0); transform: skew(0.5deg); }
      70% { clip: rect(41px, 9999px, 62px, 0); transform: skew(0.5deg); }
      75% { clip: rect(2px, 9999px, 82px, 0); transform: skew(0.5deg); }
      80% { clip: rect(47px, 9999px, 73px, 0); transform: skew(0.5deg); }
      85% { clip: rect(3px, 9999px, 27px, 0); transform: skew(0.5deg); }
      90% { clip: rect(26px, 9999px, 55px, 0); transform: skew(0.5deg); }
      95% { clip: rect(42px, 9999px, 97px, 0); transform: skew(0.5deg); }
      100% { clip: rect(38px, 9999px, 49px, 0); transform: skew(0.5deg); }
    }
    
    @keyframes glitch-skew {
      0% { transform: skew(0deg); }
      20% { transform: skew(0deg); }
      21% { transform: skew(1deg); }
      22% { transform: skew(-1deg); }
      23% { transform: skew(0deg); }
      100% { transform: skew(0deg); }
    }
    
    .subtitle {
      text-align: center;
      font-size: 0.75rem;
      color: #666;
      margin-bottom: 2rem;
      letter-spacing: 0.2em;
    }
    
    /* Terminal Prompt */
    .prompt {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      font-size: 0.875rem;
    }
    
    .prompt-symbol {
      color: var(--neon-cyan);
    }
    
    .cursor-blink {
      animation: blink 1s step-end infinite;
    }
    
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    
    /* Form */
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    label {
      display: block;
      font-size: 0.75rem;
      color: #666;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    
    input[type="password"] {
      width: 100%;
      padding: 0.875rem 1rem;
      background: rgba(0, 255, 65, 0.05);
      border: 1px solid #333;
      border-radius: 4px;
      color: var(--matrix-green);
      font-family: 'JetBrains Mono', monospace;
      font-size: 1rem;
      letter-spacing: 0.1em;
      outline: none;
      transition: all 0.3s ease;
    }
    
    input[type="password"]:focus {
      border-color: var(--neon-cyan);
      box-shadow: 
        0 0 0 2px rgba(0, 255, 255, 0.2),
        0 0 20px rgba(0, 255, 255, 0.3),
        inset 0 0 10px rgba(0, 255, 255, 0.1);
      animation: neon-pulse 2s ease-in-out infinite;
    }
    
    @keyframes neon-pulse {
      0%, 100% { box-shadow: 0 0 0 2px rgba(0, 255, 255, 0.2), 0 0 20px rgba(0, 255, 255, 0.3); }
      50% { box-shadow: 0 0 0 2px rgba(0, 255, 255, 0.4), 0 0 40px rgba(0, 255, 255, 0.5); }
    }
    
    input[type="password"]::placeholder {
      color: #444;
    }
    
    /* Button */
    button {
      width: 100%;
      padding: 1rem;
      background: transparent;
      border: 2px solid var(--matrix-green);
      border-radius: 4px;
      color: var(--matrix-green);
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    
    button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(0, 255, 65, 0.2), transparent);
      transition: left 0.5s ease;
    }
    
    button:hover {
      background: rgba(0, 255, 65, 0.1);
      box-shadow: 0 0 30px rgba(0, 255, 65, 0.3);
      text-shadow: 0 0 10px var(--matrix-green);
    }
    
    button:hover::before {
      left: 100%;
    }
    
    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    /* Messages */
    .message {
      margin-top: 1.5rem;
      padding: 0.75rem;
      border-radius: 4px;
      font-size: 0.75rem;
      text-align: center;
      display: none;
    }
    
    .message.error {
      display: block;
      background: rgba(255, 0, 255, 0.1);
      border: 1px solid var(--hot-pink);
      color: var(--hot-pink);
      animation: typewriter 0.5s steps(20);
    }
    
    .message.success {
      display: block;
      background: rgba(0, 255, 65, 0.1);
      border: 1px solid var(--matrix-green);
      color: var(--matrix-green);
    }
    
    @keyframes typewriter {
      from { width: 0; }
      to { width: 100%; }
    }
    
    /* Shake Animation */
    .shake {
      animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
    }
    
    @keyframes shake {
      10%, 90% { transform: translate3d(-1px, 0, 0); }
      20%, 80% { transform: translate3d(2px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
      40%, 60% { transform: translate3d(4px, 0, 0); }
    }
    
    /* Success Flash */
    .flash-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: var(--matrix-green);
      z-index: 100;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.1s ease;
    }
    
    .flash-overlay.active {
      animation: flash 0.5s ease-out;
    }
    
    @keyframes flash {
      0% { opacity: 0.8; }
      100% { opacity: 0; }
    }
    
    /* Footer */
    .footer {
      margin-top: 2rem;
      text-align: center;
      font-size: 0.625rem;
      color: #333;
      letter-spacing: 0.1em;
    }
    
    .footer span {
      color: #444;
    }
    
    /* Reduced Motion */
    @media (prefers-reduced-motion: reduce) {
      .glitch::before,
      .glitch::after { display: none; }
      .glitch { animation: none; }
      .crt-flicker { animation: none; }
      .cursor-blink { animation: none; opacity: 1; }
      input[type="password"]:focus { animation: none; }
      button::before { display: none; }
      #matrix-canvas { display: none; }
      .scanlines { display: none; }
    }
    
    /* Mobile */
    @media (max-width: 480px) {
      .auth-card { padding: 1.5rem; }
      .glitch { font-size: 1.25rem; letter-spacing: 0.2em; }
    }
  </style>
</head>
<body class="crt-flicker">
  <canvas id="matrix-canvas"></canvas>
  <div class="scanlines"></div>
  <div class="flash-overlay" id="flash"></div>
  
  <div class="container">
    <div class="auth-card" id="card">
      <h1 class="glitch" data-text="${title}">${title}</h1>
      <p class="subtitle">// RESTRICTED ACCESS</p>
      
      <div class="prompt">
        <span class="prompt-symbol">&gt;</span>
        <span>ENTER ACCESS CODE</span>
        <span class="cursor-blink">_</span>
      </div>
      
      <form id="authForm" method="GET">
        <div class="form-group">
          <label for="password">PASSWORD</label>
          <input 
            type="password" 
            id="password"
            name="password" 
            placeholder="••••••••••••" 
            required 
            autocomplete="current-password"
            autofocus
          >
        </div>
        
        <button type="submit" id="submitBtn">
          [ AUTHENTICATE ]
        </button>
      </form>
      
      <div class="message" id="message"></div>
      
      <div class="footer">
        <span>SYS.AUTH.v2.0</span> • <span>ENCRYPTED CONNECTION</span>
      </div>
    </div>
  </div>

  <script>
    // Matrix Rain Effect
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charArray = chars.split('');
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = [];
    
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }
    
    function drawMatrix() {
      ctx.fillStyle = 'rgba(13, 13, 13, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#00FF41';
      ctx.font = fontSize + 'px JetBrains Mono';
      
      for (let i = 0; i < drops.length; i++) {
        const char = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }
    
    let matrixInterval = setInterval(drawMatrix, 50);
    
    // Form handling with effects
    const form = document.getElementById('authForm');
    const card = document.getElementById('card');
    const message = document.getElementById('message');
    const flash = document.getElementById('flash');
    const submitBtn = document.getElementById('submitBtn');
    
    // Check if this is an error reload (password was wrong)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('password') && urlParams.get('password') !== '') {
      // Password was provided but we're still here = wrong password
      showError();
    }
    
    function showError() {
      card.classList.add('shake');
      message.className = 'message error';
      message.textContent = '⚠ ACCESS DENIED - INVALID CREDENTIALS';
      
      setTimeout(() => {
        card.classList.remove('shake');
      }, 500);
    }
    
    function showSuccess() {
      message.className = 'message success';
      message.textContent = '✓ ACCESS GRANTED - AUTHENTICATING...';
      flash.classList.add('active');
      
      // Speed up matrix
      clearInterval(matrixInterval);
      matrixInterval = setInterval(drawMatrix, 20);
    }
    
    form.addEventListener('submit', function(e) {
      submitBtn.disabled = true;
      submitBtn.textContent = '[ VERIFYING... ]';
    });
    
    // Konami Code Easter Egg
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', function(e) {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          activateEasterEgg();
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    });
    
    function activateEasterEgg() {
      document.body.style.filter = 'hue-rotate(180deg)';
      message.className = 'message success';
      message.textContent = '🎮 KONAMI CODE ACTIVATED! You found the secret!';
      
      // Rainbow matrix
      const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'];
      let colorIndex = 0;
      
      setInterval(() => {
        ctx.fillStyle = colors[colorIndex % colors.length];
        colorIndex++;
      }, 100);
      
      setTimeout(() => {
        document.body.style.filter = 'none';
      }, 5000);
    }
    
    // Reduced motion check
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      clearInterval(matrixInterval);
    }
  </script>
</body>
</html>`
}
