// Entry point for the React app
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css"; // Global styles and Tailwind imports

// Find the root element and render our app
// Using the new React 18 createRoot API instead of the old ReactDOM.render
createRoot(document.getElementById("root")).render(<App />);