let username = "";
const questions = [
  {
    q: "What’s said to appear in mirrors when you say her name three times?",
    options: ["Bloody Mary", "Slender Man", "La Llorona", "The Babadook"],
    correct: 0,
    bg: "bg1.jpg",
  },
  {
    q: "In horror movies, which room is the most haunted usually?",
    options: ["Living Room", "Kitchen", "Basement", "Bathroom"],
    correct: 2,
    bg: "bg2.jpg",
  },
  {
    q: "Which creature hunts you only if you hear it scream first?",
    options: ["Wendigo", "Banshee", "Vampire", "Zombie"],
    correct: 1,
    bg: "bg3.jpg",
  },
  {
    q: "What’s the cursed object in 'The Ring'?",
    options: ["Book", "Phone", "Mirror", "VHS Tape"],
    correct: 3,
    bg: "bg4.jpg",
  },
  {
    q: "Which forest is known for paranormal activity in Japan?",
    options: ["Okigahara", "Arashiyama", "Nara", "Fujisan"],
    correct: 0,
    bg: "bg5.jpg",
  },
  {
    q: "What do you do if you hear footsteps behind you in an empty house?",
    options: ["Turn around", "Run", "Hide", "Don’t look back"],
    correct: 3,
    bg: "bg6.jpg",
  },
];

const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const resultEl = document.getElementById("result");
const bgSound = document.getElementById("bg-sound");
const wrongSound = document.getElementById("wrong-sound");

let current = 0;
let score = 0;

function startQuiz() {
  const input = document.getElementById("username");
  username = input.value.trim();
  if (!username) {
    alert("Please enter your name...");
    return;
  }

  // Save in localStorage
  let storedNames = JSON.parse(localStorage.getItem("quizNames")) || [];
  storedNames.push(username);
  localStorage.setItem("quizNames", JSON.stringify(storedNames));

  // Google Sheet
  fetch(
    "https://script.google.com/macros/s/AKfycbxR5EKAZkhH2br6-Oh2w-gKbhvNkyrhaHzcKxyFykfJjcLLDGnhMh2vZRzOgmHWD-KZ/exec",
    {
      method: "POST",
      body: JSON.stringify({ name: username }),
      headers: { "Content-Type": "application/json" },
    }
  ).catch((e) => console.error("Sheet error:", e));

  document.getElementById("login-container").style.display = "none";
  document.getElementById("quiz-container").style.display = "block";

  bgSound.volume = 0.3;
  bgSound.play().catch(() => console.warn("Autoplay blocked"));

  stopCreepyAnimations();
  showQuestion();
}

function showQuestion() {
  const q = questions[current];
  questionEl.textContent = q.q;
  optionsEl.innerHTML = "";
  q.options.forEach((option, i) => {
    const btn = document.createElement("div");
    btn.className = "option";
    btn.textContent = option;
    btn.onclick = () => checkAnswer(i);
    optionsEl.appendChild(btn);
  });

  // ✅ Apply only image, keep other bg styles from CSS
  document.body.style.backgroundImage = `url(${q.bg})`;
}

function checkAnswer(index) {
  const isCorrect = index === questions[current].correct;
  if (isCorrect) {
    score++;
  } else {
    wrongSound.currentTime = 0;
    wrongSound.play();
  }
  current++;
  if (current < questions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}

function endQuiz() {
  questionEl.textContent = "The ritual is complete...";
  optionsEl.innerHTML = "";
  resultEl.innerHTML = `<p>${username}, you survived with a score of ${score} out of ${questions.length}.</p>`;
}

// Shift + L to view names
window.addEventListener("keydown", (e) => {
  if (e.shiftKey && e.key === "L") {
    const stored = JSON.parse(localStorage.getItem("quizNames")) || [];
    alert("Names that dared to enter:\n\n" + stored.join("\n"));
  }
});

// Skulls only during login
let skullInterval;

function startCreepyAnimations() {
  skullInterval = setInterval(() => {
    if (document.getElementById("login-container").style.display !== "none") {
      const skull = document.createElement("div");
      skull.className = "skull";
      skull.style.left = `${Math.random() * 100}vw`;
      skull.style.top = "-50px";
      document.getElementById("skull-container").appendChild(skull);
      setTimeout(() => skull.remove(), 6000);
    }
  }, 800);
}

function stopCreepyAnimations() {
  clearInterval(skullInterval);
}

// Start skulls on load
window.onload = () => {
  startCreepyAnimations();
};
