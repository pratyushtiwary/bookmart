import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Onboard from "./pages/onboard";
import "./App.css";
import Recommend from "pages/recommend";

const theme = createTheme({
  palette: {
    primary: {
      main: "#231955",
    },
    secondary: {
      main: "#000",
    },
  },
  typography: {
    fontFamily: ["Yaldevi", "sans-serif"].join(","),
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Onboard />} />
          <Route path="/recommend" element={<Recommend />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
