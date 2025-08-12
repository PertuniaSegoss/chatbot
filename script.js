const chatbox = document.getElementById("chatbox");
const userInput = document.getElementById("userInput");
const micButton = document.getElementById("micButton");
const startQuizBtn = document.getElementById("startQuizBtn");
const sendBtn = document.getElementById("sendBtn");

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    userInput.value = transcript;
    sendMessage();
    stopListening();
  };
  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    stopListening();
  };
  recognition.onend = () => {
    stopListening();
  };
} else {
  micButton.style.display = "none";
}

function speak(text) {
  if (!window.speechSynthesis) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";

  const voices = window.speechSynthesis.getVoices();

  const femaleVoice = voices.find(
    (voice) =>
      voice.lang.startsWith("en") &&
      (voice.name.toLowerCase().includes("female") ||
        voice.name.toLowerCase().includes("woman") ||
        voice.name.toLowerCase().includes("zira") ||
        voice.name.toLowerCase().includes("samantha") ||
        voice.name.toLowerCase().includes("google us english"))
  );
  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }

  utterance.pitch = 1;
  utterance.rate = 1;
  window.speechSynthesis.speak(utterance);
}

// Q&A pairs
const qaPairs = {
  "what is javascript":
    "JavaScript is a programming language used to make web pages interactive.",
  "what is html":
    "HTML stands for HyperText Markup Language, and it structures content on the web.",
  "what is css":
    "CSS is Cascading Style Sheets, used to style and layout web pages.",
  "what is a frontend developer":
    "A frontend developer builds the user interface of websites or apps using HTML, CSS, and JavaScript.",
  "what is backend development":
    "Backend development focuses on servers, databases, and application logic behind the scenes.",
  "what is api":
    "API stands for Application Programming Interface, it lets different software communicate.",
  "what is node.js":
    "Node.js is a JavaScript runtime that lets you run JavaScript code outside the browser.",
  "what is react":
    "React is a JavaScript library for building user interfaces, especially single-page applications.",
  "what is github":
    "GitHub is a platform for hosting and collaborating on code repositories using Git.",
  "what is cloud computing":
    "Cloud computing means using remote servers on the internet to store, manage, and process data.",
  "what is machine learning":
    "Machine learning is a type of AI that allows computers to learn from data and improve over time.",
  "how to learn programming":
    "Start with basics like HTML, CSS, and JavaScript, then build projects to practice.",
  "what is responsive design":
    "Responsive design makes websites look good on all devices, like phones and desktops.",
  "what is sql": "SQL is a language used to manage and query databases.",
  "what is linux":
    "Linux is an open-source operating system widely used for servers and development.",
  "what is css flexbox":
    "Flexbox is a CSS layout mode for arranging elements in one dimension, either row or column.",
  "what is git":
    "Git is a version control system that helps track changes in code and collaborate with others.",
  "what is debugging":
    "Debugging is the process of finding and fixing errors in your code.",
  "what is a framework":
    "A framework is a pre-written set of code libraries that help you build applications faster.",
  "what is object-oriented programming":
    "OOP is a programming style based on objects containing data and methods.",
  "what is a database":
    "A database stores and organizes data so it can be easily accessed and managed.",
  "what is cybersecurity":
    "Cybersecurity protects computers and networks from theft, damage, or unauthorized access.",
  "what is an algorithm":
    "An algorithm is a step-by-step procedure or formula for solving a problem.",
  "what is artificial intelligence":
    "AI is technology that enables machines to perform tasks that typically require human intelligence.",
  "what is devops":
    "DevOps combines software development and IT operations to shorten development cycles.",
  "what is a software bug":
    "A software bug is an error or flaw in a program that causes it to behave unexpectedly.",
  "what is api testing":
    "API testing checks that APIs work correctly and meet expectations.",
  "what is a programming language":
    "A programming language is a formal language used to write computer programs.",
  "what is html semantic tags":
    "Semantic tags clearly describe the meaning of content, like header, footer, article.",
  "what is asynchronous programming":
    "It's a way to write code that can start tasks and continue without waiting for them to finish.",
  "what is css grid":
    "CSS Grid is a layout system for creating two-dimensional grids on web pages.",
  "what is a virtual machine":
    "A virtual machine simulates a computer system allowing multiple OS to run on one physical machine.",
  "what is software testing":
    "Software testing evaluates a program to find defects and ensure quality.",
  "what is a container":
    "Containers package software so it runs reliably across different computing environments.",
  "what is docker":
    "Docker is a platform for developing, shipping, and running applications in containers.",
  "what is continuous integration":
    "CI is the practice of automatically testing and merging code changes frequently.",
  "what is user experience":
    "UX is how a user feels when interacting with a product, like a website or app.",
};

const funFacts = [
  "Did you know? The first computer bug was an actual moth found in a Harvard Mark II computer in 1947.",
  "Fun fact: The first programming language was called Fortran, created in the 1950s.",
  "Tech trivia: The first website went live on August 6, 1991.",
  "Did you know? The original name for JavaScript was Mocha.",
  "Fun fact: The word 'robot' comes from a Czech word meaning 'forced labor.'",
  "Tech trivia: The QWERTY keyboard layout was designed to slow down typing to prevent jams in old typewriters.",
  "Did you know? Linux was created by Linus Torvalds in 1991 as a free alternative to Unix.",
  "Fun fact: Email was invented before the World Wide Web.",
  "Tech trivia: The first computer mouse was made of wood.",
];

let awaitingAnswerFor = null;
let inQuiz = false;
let quizIndex = 0;
let quizScore = 0;
let quizSet = [];

const quizQuestions = [
  {
    question: "What language is used to style web pages?",
    answer: "css",
  },
  {
    question: "What does API stand for?",
    answer: "application programming interface",
  },
  {
    question: "What does HTML stand for?",
    answer: "hypertext markup language",
  },
  {
    question: "Which language runs in a web browser?",
    answer: "javascript",
  },
  {
    question: "What is GitHub used for?",
    answer: "hosting and collaborating on code repositories",
  },
  {
    question: "What is Node.js?",
    answer: "javascript runtime",
  },
  {
    question: "Name a popular JavaScript library for building UI.",
    answer: "react",
  },
  {
    question: "What does SQL do?",
    answer: "manages and queries databases",
  },
  {
    question: "What is responsive design?",
    answer: "design that makes websites look good on all devices",
  },
  {
    question: "What is a framework?",
    answer: "a pre-written set of code libraries to build applications",
  },
];

// Shuffle and pick 5 questions for quiz
function startQuiz() {
  if (inQuiz) return;
  inQuiz = true;
  quizScore = 0;
  quizIndex = 0;
  quizSet = quizQuestions.sort(() => 0.5 - Math.random()).slice(0, 5);
  addMessage(
    "Quiz started! I will ask you 5 questions. Type your answer or 'quit quiz' to stop.",
    "bot"
  );
  speak(
    "Quiz started! I will ask you 5 questions. Type your answer or quit quiz to stop."
  );
  setTimeout(() => askQuizQuestion(), 1000);
}

function askQuizQuestion() {
  if (quizIndex >= quizSet.length) {
    endQuiz();
    return;
  }
  addMessage(
    `Question ${quizIndex + 1}: ${quizSet[quizIndex].question}`,
    "bot"
  );
  speak(`Question ${quizIndex + 1}: ${quizSet[quizIndex].question}`);
}

function endQuiz() {
  addMessage(
    `Quiz over! Your score: ${quizScore} out of ${quizSet.length}.`,
    "bot"
  );
  speak(`Quiz over! Your score is ${quizScore} out of ${quizSet.length}.`);
  inQuiz = false;
}

window.onload = () => {
  addMessage(
    "Hi! My name is Pertunia. You can ask me any question related to tech.",
    "bot"
  );
  speak(
    "Hi! My name is Pertunia. You can ask me any question related to tech."
  );
};

function sendMessage() {
  let question = userInput.value.trim();
  if (!question) return;

  addMessage(question, "user");

  let questionLower = question.toLowerCase();

  if (inQuiz) {
    if (questionLower === "quit quiz") {
      addMessage("Quiz exited. Hope you had fun!", "bot");
      speak("Quiz exited. Hope you had fun!");
      inQuiz = false;
      userInput.value = "";
      userInput.focus();
      return;
    }
    const correctAnswer = quizSet[quizIndex].answer.toLowerCase();

    if (
      questionLower.includes(correctAnswer) ||
      correctAnswer.includes(questionLower)
    ) {
      quizScore++;
      addMessage("Correct! 🎉", "bot");
      speak("Correct!");
    } else {
      addMessage(
        `Oops, the correct answer was: "${quizSet[quizIndex].answer}".`,
        "bot"
      );
      speak(`Oops, the correct answer was ${quizSet[quizIndex].answer}`);
    }
    quizIndex++;
    userInput.value = "";
    userInput.focus();

    setTimeout(() => askQuizQuestion(), 1200);
    return;
  }

  if (awaitingAnswerFor) {
    const newAnswer = question;
    qaPairs[awaitingAnswerFor] = newAnswer;
    addMessage(
      `Thanks! I've learned something new about "${awaitingAnswerFor}".`,
      "bot"
    );
    speak(`Thanks! I've learned something new about ${awaitingAnswerFor}.`);
    awaitingAnswerFor = null;
    userInput.value = "";
    userInput.focus();
    return;
  }

  if (questionLower === "start quiz") {
    startQuiz();
    userInput.value = "";
    userInput.focus();
    return;
  }

  if (
    questionLower.includes("fun fact") ||
    questionLower.includes("tell me something interesting")
  ) {
    const randomFact = funFacts[Math.floor(Math.random() * funFacts.length)];
    setTimeout(() => {
      addMessage(randomFact, "bot");
      speak(randomFact);
    }, 500);
    userInput.value = "";
    userInput.focus();
    return;
  }

  let answer = null;
  for (const key in qaPairs) {
    if (questionLower.includes(key)) {
      answer = qaPairs[key];
      break;
    }
  }

  if (!answer) {
    addMessage(
      `I don't know the answer to that yet. Would you like to teach me? Please type the answer now.`,
      "bot"
    );
    speak(
      "I don't know the answer to that yet. Would you like to teach me? Please type the answer now."
    );
    awaitingAnswerFor = questionLower;
    userInput.value = "";
    userInput.focus();
    return;
  }

  setTimeout(() => {
    addMessage(answer, "bot");
    speak(answer);
  }, 500);

  userInput.value = "";
  userInput.focus();
}

function addMessage(text, sender) {
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", sender);

  if (sender === "bot") {
    const avatarSpan = document.createElement("span");
    avatarSpan.classList.add("avatar");
    avatarSpan.textContent = "🤖";

    const textSpan = document.createElement("span");
    textSpan.textContent = text;

    msgDiv.appendChild(avatarSpan);
    msgDiv.appendChild(textSpan);
  } else {
    msgDiv.textContent = text;
  }

  chatbox.appendChild(msgDiv);
  chatbox.scrollTop = chatbox.scrollHeight;
}

userInput.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});

sendBtn.addEventListener("click", sendMessage);

let listening = false;
micButton.addEventListener("click", () => {
  if (!recognition) return;

  if (!listening) {
    recognition.start();
    micButton.classList.add("listening");
    micButton.title = "Listening... Click to stop";
    listening = true;
  } else {
    recognition.stop();
    stopListening();
  }
});

function stopListening() {
  listening = false;
  micButton.classList.remove("listening");
  micButton.title = "Start listening 🎤";
}

startQuizBtn.addEventListener("click", () => {
  if (!inQuiz) {
    startQuiz();
    userInput.value = "";
    userInput.focus();
  }
});

if (window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {};
}
