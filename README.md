# AI Interview Platform

An intelligent, AI-powered preparation platform designed to help job seekers succeed in technical and behavioral interviews. By analyzing a candidate's profile (from uploaded resumes and self-descriptions) against a target job description, the platform uses Google Gemini to generate custom interview questions, identify skill gaps, and produce an optimized, ATS-friendly resume.

---

## 🚀 Key Features

*   **Custom Preparation Plans**: Generates customized, day-by-day plans focusing on the candidate's primary learning areas.
*   **Targeted AI Mock Questions**: Automatically generates at least 5 technical and 5 behavioral questions tailored precisely to the candidate's background and the target job role.
*   **Resume Optimization & Generation**: Extracts text from PDF/DOCX resumes, analyzes skill gaps, and generates a structured, ATS-friendly resume compiled into a high-quality PDF using Puppeteer.
*   **JWT-Based Authentication**: Secure registration, login, and session tracking using HTTP-only cookies and bcrypt hashing.
*   **Responsive Dashboard**: An interactive dashboard showing recent preparation plans, match scores, and interview histories.

---

## 🛠 Tech Stack

### Frontend
*   **Core**: React 19 (Vite)
*   **Styling**: Sass / SCSS, Tailwind CSS (v4)
*   **Animation**: Framer Motion
*   **Routing**: React Router DOM (v7)
*   **API Client**: Axios

### Backend
*   **Server**: Node.js, Express (v5)
*   **Database**: MongoDB & Mongoose
*   **AI Service**: Google Gen AI SDK (`@google/genai` using `gemini-3.1-flash-lite`)
*   **Document Parsing**: `pdf-parse` (for PDFs) & `mammoth` (for DOCX files)
*   **PDF Generation**: Puppeteer
*   **Validation**: Zod (for data schema validation)

---

## 📂 Project Structure

```text
AI-Interview-Platform/
├── Backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Authentication & Interview logic controllers
│   │   ├── middlewares/     # Authentication & File-upload (Multer) middlewares
│   │   ├── models/          # MongoDB schemas (User, blacklisted tokens, reports)
│   │   ├── routes/          # API Route definitions
│   │   └── services/        # Gemini integration and Puppeteer PDF renderer
│   ├── server.js            # Entry point for backend
│   └── .env                 # Environment variables configuration
├── Frontend/
│   ├── src/
│   │   ├── components/      # Shared layout and general UI components
│   │   ├── features/        # Feature-based pages (Auth, Interview)
│   │   ├── assets/          # Static assets & stylesheets
│   │   ├── App.jsx          # Main App entry
│   │   └── app.routes.jsx   # Client-side routing configuration
│   └── vite.config.js       # Vite configuration
└── README.md                # Project documentation (this file)
```

---

## ⚙️ Installation & Configuration

### Prerequisites
*   Node.js (v18+)
*   MongoDB Instance (Local or MongoDB Atlas)
*   Google Gemini API Key

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `Backend/` directory and configure the variables:
   ```env
   PORT=3000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>
   JWT_SECRET=your_jwt_secret_here
   GOOGLE_GENAI_API_KEY=your_gemini_api_key_here
   ```
4. Start the server in development mode:
   ```bash
   npm run dev
   ```
   *The server runs on `http://localhost:3000` by default.*

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   *The frontend runs on `http://localhost:5173` by default.*

---

## 🔌 API Endpoints Summary

### Authentication Routes (`/api/auth`)
| Method | Route | Description | Access |
| :--- | :--- | :--- | :--- |
| **POST** | `/register` | Register a new account | Public |
| **POST** | `/login` | Log in and set HTTP-only cookie JWT | Public |
| **GET** | `/logout` | Log out and blacklist current token | Public |
| **GET** | `/get-me` | Retrieve profile of currently logged-in user | Private |

### Interview Routes (`/api/interview`)
| Method | Route | Description | Access |
| :--- | :--- | :--- | :--- |
| **POST** | `/` | Upload resume + descriptions and generate prep report | Private |
| **GET** | `/` | Fetch all generated interview reports for the user | Private |
| **GET** | `/:interviewId` | Retrieve a specific interview prep report | Private |
| **DELETE** | `/:interviewId` | Delete a specific interview prep report | Private |
| **POST** | `/:interviewReportId/resume/pdf` | Generate optimized resume PDF based on the report | Private |

---

## 📝 License

Distributed under the ISC License. See `Backend/package.json` for details.
