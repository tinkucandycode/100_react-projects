import { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [num, setNum] = useState(20);
  const [type, setType] = useState("linear");
  const [colors, setColors] = useState([]);

  const getHexColorCode = useCallback(() => {
    const max = 256 ** 3;
    const NumGen = Math.floor(Math.random() * max);
    const HexCode = NumGen.toString(16).padStart(6, "0");
    return `#${HexCode}`;
  }, []);

  const generateGradient = useCallback(() => {
    const NewGradient = [];
    for (let i = 1; i <= num; i++) {
      const colors1 = getHexColorCode();
      const colors2 = getHexColorCode();
      const degree = Math.floor(Math.random() * 360);
      if (type === "linear") {
        NewGradient.push({
          gradient: `linear-gradient(${degree}deg,${colors1},${colors2})`,
          css: `background: linear-gradient(${degree}deg,${colors1},${colors2})`,
        });
      } else {
        NewGradient.push({
          gradient: `radial-gradient(circle,${colors1},${colors2})`,
          css: `background: radial-gradient(circle,${colors1},${colors2})`,
        });
      }
    }
    setColors(NewGradient);
  }, [num, type, getHexColorCode]);

  useEffect(() => {
    generateGradient();
  }, [generateGradient]);

  const onCopy = (css) => {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard
        .writeText(css)
        .then(() => {
          toast.success(`Gradient code copied!`, { position: "top-center" });
        })
        .catch((err) => {
          console.error("Clipboard API failed, using fallback", err);
          fallbackCopy(css);
        });
    } else {
      fallbackCopy(css);
    }
  };

  const fallbackCopy = (Text) => {
    const textarea = document.createElement("textarea");
    textarea.value = Text;
    textarea.style.position = "fixed";
    textarea.style.opacity = 0;
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand("copy");
      toast.success(`Gradient code copied!`, { position: "top-center" });
    } catch (error) {
      console.error("fallback copy failed", error);
      toast.error("Failed to copy");
    }
    document.body.removeChild(textarea);
  };

  return (
    <div className="min-h-screen bg-white py-10">
      <div className="w-10/12 mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between items-center gap-4 border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 capitalize">
            ⚡ Gradient Generator - {num} {type}
          </h1>

          <div className="grid grid-cols-3 items-center gap-3">
            <input
              value={num}
              className="border border-gray-300 bg-white rounded-lg py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Number"
              onChange={(e) => setNum(Number(e.target.value))}
            />

            <select
              value={type}
              className="border border-gray-300 bg-white rounded-lg py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setType(e.target.value)}
            >
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
            </select>

            <button
              onClick={generateGradient}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg py-2 px-5 shadow-sm transition"
            >
              Generate
            </button>
          </div>
        </div>

        {/* Gradient Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {colors.map((item, index) => (
            <div
              key={index}
              className="rounded-xl h-40 relative shadow-md overflow-hidden"
              style={{ background: item.gradient }}
            >
              <button
                className="absolute bottom-3 right-3 bg-black/50 text-white text-xs rounded-md py-1 px-3 hover:bg-black/80 transition"
                onClick={() => onCopy(item.css)}
              >
                Copy
              </button>
            </div>
          ))}
        </div>
      </div>

      <ToastContainer autoClose={1200} />
    </div>
  );
}

export default App;
