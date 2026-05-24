# 🧠 QuizApp

A mobile quiz application built with **React Native** and **Expo**. Test your general knowledge with 10 questions, a countdown timer per question, speed-based scoring, and a detailed results screen.

---

## 📱 Screenshots

| Home Screen | Quiz Screen | Results Screen |
|-------------|-------------|----------------|
| Rules, stats, high score | Question + timer + options | Score breakdown per question |

---

## ✨ Features

- **10 questions** on general knowledge topics (Ukrainian language)
- **15-second countdown timer** per question — animated progress bar changes color (green → orange → red)
- **Speed-based scoring** — 10 base points + remaining seconds as bonus (max 25 per question)
- **Real-time feedback** — correct/wrong highlight with the right answer revealed
- **Progress indicator** — colored dots (green = correct, red = wrong, purple = current)
- **Results screen** — total score, correct/wrong count, full per-question breakdown
- **High score** — best result saved locally via AsyncStorage and shown on home screen
- **Play again** — restart at any time from the results or home screen

---

## 🎯 Scoring System

| Outcome | Points |
|---------|--------|
| Correct answer | 10 (base) + `floor(timeLeft)` (0–15 bonus) |
| Wrong answer | 0 |
| Time out | 0 |
| **Max per question** | **25** |
| **Max total (10 questions)** | **250** |

---

## 🛠 Tech Stack

| Technology | Purpose |
|------------|---------|
| [React Native](https://reactnative.dev/) | Cross-platform mobile framework |
| [Expo SDK 54](https://expo.dev/) | Toolchain & device APIs |
| [React Navigation v7](https://reactnavigation.org/) | Stack navigation |
| [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/) | High score persistence |
| [@expo/vector-icons](https://docs.expo.dev/guides/icons/) | Ionicons icon set |

---

## 📋 Requirements

- **Node.js** 18+
- **npm** 9+
- **Expo Go** app on your Android or iOS device ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))
- Both your phone and computer must be on the **same Wi-Fi network**

---

## 🚀 Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/ostrolutska/UID-ZALIK.git
cd UID-ZALIK

# 2. Install dependencies
npm install

# 3. Set your local IP (replace with your machine's IP)
set REACT_NATIVE_PACKAGER_HOSTNAME=192.168.x.x   # Windows
export REACT_NATIVE_PACKAGER_HOSTNAME=192.168.x.x # macOS/Linux

# 4. Start the development server
npx expo start
```

Scan the QR code with **Expo Go** (Android) or the built-in **Camera app** (iOS).

> **Find your local IP:**
> - Windows: run `ipconfig` → look for IPv4 Address under Wi-Fi
> - macOS/Linux: run `ifconfig` → look for `inet` under `en0`

---

## 📁 Project Structure

```
QuizApp/
├── App.js                        # Entry point — navigation container + providers
├── app.json                      # Expo configuration (SDK 54, bundle IDs)
├── package.json                  # Dependencies
├── babel.config.js               # Babel preset for Expo
└── src/
    ├── data/
    │   └── questions.js          # 10 quiz questions with options & correct index
    ├── context/
    │   └── QuizContext.js        # Global state: score, answers, high score (AsyncStorage)
    ├── screens/
    │   ├── HomeScreen.js         # Welcome screen: rules, stats, high score, start button
    │   ├── QuizScreen.js         # Question card, 4 answer buttons, timer, progress dots
    │   └── ResultScreen.js       # Score summary, correct/wrong count, per-question details
    └── components/
        ├── AnswerButton.js       # Answer option (states: default / correct / wrong / disabled)
        ├── TimerBar.js           # Countdown progress bar (color-coded)
        └── ProgressDots.js       # Row of dots showing answered/current/upcoming questions
```

---

## 🗺 Screen Flow

```
HomeScreen
    │
    └─► [Start Quiz] ──► QuizScreen (question 1 of 10)
                              │
                         [answer / timeout]
                              │
                         QuizScreen (question 2…10)
                              │
                         [last question answered]
                              │
                         ResultScreen
                         │          │
                    [Play Again]  [Home]
                         │          │
                    QuizScreen  HomeScreen
```

---

## 🧩 Adding or Editing Questions

Open `src/data/questions.js` and follow the existing format:

```js
{
  id: 11,
  question: 'Your question here?',
  options: ['Option A', 'Option B', 'Option C', 'Option D'],
  correct: 0,  // 0-based index of the correct option
}
```

---

## 📄 License

MIT © Eva Ostrolutska
