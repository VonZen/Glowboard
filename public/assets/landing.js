(() => {
  "use strict";

  const input = document.querySelector("#message");
  if (!input) return;
  const colours = { sunshine: "#ffe164", pink: "#ff78b6", aqua: "#76e9ee" };
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const state = { text: input.value, colour: "sunshine", style: "led", paused: reduceMotion.matches };
  const pauseButton = document.querySelector("#motion-toggle");
  const status = document.querySelector("#preview-status");
  let frame = null;
  let announcement = null;

  // The preview has no analytics, text uploads, storage, permissions or external dependencies.
  // Dot strips are rasterised only when text, style, colour or dimensions change.
  class Banner {
    constructor(canvas) {
      this.canvas = canvas;
      this.context = canvas.getContext("2d");
      this.hero = canvas.dataset.board === "hero";
      this.text = canvas.dataset.text;
      this.visible = false;
      this.position = 0;
      this.lastTime = 0;
      this.width = 0;
      this.height = 0;
      this.strip = null;
      this.background = null;
      this.overflow = false;
      this.resizeObserver = new ResizeObserver(() => this.prepare());
      this.resizeObserver.observe(canvas.parentElement);
    }

    prepare() {
      const bounds = this.canvas.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      this.width = Math.round(bounds.width * ratio);
      this.height = Math.round(bounds.height * ratio);
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.canvas.setAttribute("aria-label", `${state.style === "led" ? "LED" : state.style === "neon" ? "Neon" : "Big text"} banner preview: ${this.text || "Empty message"}`);
      const fallback = this.canvas.parentElement.querySelector(".banner-fallback");
      fallback.textContent = this.text;
      if (!this.context) return;

      const rows = 24;
      const cell = this.height / rows;
      const columns = Math.ceil(this.width / cell);
      const mask = document.createElement("canvas");
      const maskContext = mask.getContext("2d", { willReadFrequently: true });
      maskContext.font = "700 18px Arial, sans-serif";
      mask.width = Math.max(1, Math.ceil(maskContext.measureText(this.text).width) + 6);
      mask.height = rows;
      maskContext.font = "700 18px Arial, sans-serif";
      maskContext.fillStyle = "white";
      maskContext.textBaseline = "middle";
      maskContext.fillText(this.text, 3, rows / 2);
      const pixels = maskContext.getImageData(0, 0, mask.width, rows).data;

      this.background = document.createElement("canvas");
      this.background.width = this.width;
      this.background.height = this.height;
      const background = this.background.getContext("2d");
      background.fillStyle = "#101014";
      background.fillRect(0, 0, this.width, this.height);
      background.fillStyle = "#25242b";
      for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
          background.beginPath();
          background.arc((x + .5) * cell, (y + .5) * cell, cell * .31, 0, Math.PI * 2);
          background.fill();
        }
      }

      this.strip = document.createElement("canvas");
      this.strip.width = Math.ceil(mask.width * cell);
      this.strip.height = this.height;
      const strip = this.strip.getContext("2d");
      strip.fillStyle = colours[state.colour];
      strip.shadowColor = colours[state.colour];
      strip.shadowBlur = cell * 1.35;
      for (let x = 0; x < mask.width; x++) {
        if (this.hero && state.colour === "sunshine") {
          const hue = x < mask.width * .28 ? 305 : x < mask.width * .68 ? 337 : 189;
          strip.fillStyle = `hsl(${hue} 100% 72%)`;
          strip.shadowColor = strip.fillStyle;
        }
        for (let y = 0; y < rows; y++) {
          if (pixels[(y * mask.width + x) * 4 + 3] < 110) continue;
          strip.beginPath();
          strip.arc((x + .5) * cell, (y + .5) * cell, cell * .33, 0, Math.PI * 2);
          strip.fill();
        }
      }
      this.overflow = this.strip.width > this.width - cell * 4;
      this.position = 0;
      this.lastTime = 0;
      this.canvas.parentElement.classList.add("is-ready");
      requestPaint();
    }

    draw(time) {
      if (!this.visible || !this.background || !this.context) return;
      const context = this.context;
      context.clearRect(0, 0, this.width, this.height);
      if (state.style !== "led") {
        context.fillStyle = "#101014";
        context.fillRect(0, 0, this.width, this.height);
        const size = this.height * .54;
        context.font = `750 ${size}px Arial, sans-serif`;
        const textWidth = context.measureText(this.text).width;
        const scale = Math.min(1, (this.width * .86) / Math.max(1, textWidth));
        context.font = `750 ${size * scale}px Arial, sans-serif`;
        context.fillStyle = colours[state.colour];
        context.textBaseline = "middle";
        context.textAlign = "center";
        context.shadowColor = colours[state.colour];
        context.shadowBlur = state.style === "neon" ? this.height * .075 : 0;
        context.fillText(this.text, this.width / 2, this.height / 2);
        context.shadowBlur = 0;
        return;
      }
      context.drawImage(this.background, 0, 0);
      const still = state.paused || !this.overflow;
      if (still) {
        const scale = Math.min(1, (this.width * .9) / this.strip.width);
        const width = this.strip.width * scale;
        const height = this.height * scale;
        context.drawImage(this.strip, (this.width - width) / 2, (this.height - height) / 2, width, height);
        this.lastTime = 0;
      } else {
        if (this.lastTime) this.position += Math.min(50, time - this.lastTime) * this.height * .0002;
        this.lastTime = time;
        const period = this.strip.width + this.height * .65;
        this.position %= period;
        context.drawImage(this.strip, this.width * .06 - this.position, 0);
        context.drawImage(this.strip, this.width * .06 - this.position + period, 0);
      }
    }
  }

  const boards = Array.from(document.querySelectorAll("canvas[data-board]"), canvas => new Banner(canvas));

  function requestPaint() {
    if (frame === null && !document.hidden) frame = requestAnimationFrame(paint);
  }

  function paint(time) {
    frame = null;
    if (document.hidden) return;
    boards.forEach(board => board.draw(time));
    if (!state.paused && state.style === "led" && boards.some(board => board.visible && board.overflow)) requestPaint();
  }

  const visibility = new IntersectionObserver(entries => {
    for (const entry of entries) {
      const board = boards.find(item => item.canvas === entry.target);
      board.visible = entry.isIntersecting;
      board.lastTime = 0;
    }
    requestPaint();
  });
  boards.forEach(board => visibility.observe(board.canvas));

  function updatePreview() {
    state.text = input.value.slice(0, 40).trim();
    document.querySelector("#message-count").textContent = `${input.value.length} / 40`;
    document.querySelector("#message-hint").textContent = state.text ? "A few words go a long way." : "Type a message to light up the board.";
    boards.forEach(board => { board.text = state.text; board.prepare(); });
    clearTimeout(announcement);
    announcement = setTimeout(() => {
      status.textContent = state.text ? `Preview: ${state.text}. ${state.colour} colour, ${state.style === "big" ? "big text" : state.style} style.` : "The banner is empty. Type a message to light it up.";
    }, 350);
  }

  function setColour(colour) {
    if (!(colour in colours)) return;
    state.colour = colour;
    document.querySelectorAll("[data-color]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.color === colour)));
  }

  function updatePause() {
    pauseButton.setAttribute("aria-pressed", String(state.paused));
    pauseButton.textContent = state.paused ? "Play motion ▶" : "Pause motion Ⅱ";
    boards.forEach(board => { board.lastTime = 0; });
    requestPaint();
  }

  input.addEventListener("input", updatePreview);
  document.querySelectorAll("[data-color]").forEach(button => button.addEventListener("click", () => {
    setColour(button.dataset.color);
    updatePreview();
  }));
  document.querySelectorAll("[data-style]").forEach(button => button.addEventListener("click", () => {
    state.style = button.dataset.style;
    document.querySelectorAll("[data-style]").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
    updatePreview();
  }));
  pauseButton.addEventListener("click", () => { state.paused = !state.paused; updatePause(); });

  document.querySelectorAll("[data-message]").forEach(link => link.addEventListener("click", () => {
    input.value = link.dataset.message;
    setColour(link.dataset.presetColor);
    updatePreview();
  }));

  const themes = {
    cream: { name: "Cream Puppy", animal: "A golden puppy", colour: "#fff4d9" },
    peach: { name: "Peach Kitten", animal: "A sweet kitten", colour: "#fff8f3" },
    star: { name: "Starlight Shiba", animal: "A smiling shiba", colour: "#231c39" }
  };
  document.querySelectorAll("[data-theme-choice]").forEach(button => {
    button.disabled = false;
    button.addEventListener("click", () => {
      const theme = button.dataset.themeChoice;
      if (!(theme in themes)) return;
      document.body.dataset.theme = theme;
      document.querySelectorAll("[data-theme-choice]").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
      const mascot = document.querySelector("#hero-mascot");
      mascot.src = `assets/mascot-${theme}.png`;
      mascot.alt = `${themes[theme].animal} holding your glowing message`;
      document.querySelector('meta[name="theme-color"]').content = themes[theme].colour;
      document.querySelector("#theme-status").textContent = `You’re in good company with ${themes[theme].name}.`;
    });
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && frame !== null) { cancelAnimationFrame(frame); frame = null; }
    boards.forEach(board => { board.lastTime = 0; });
    if (!document.hidden) requestPaint();
  });
  reduceMotion.addEventListener("change", event => {
    if (event.matches) { state.paused = true; updatePause(); }
  });

  document.querySelector("#demo-controls").hidden = false;
  pauseButton.hidden = false;
  updatePause();
  boards.forEach(board => board.prepare());
})();
