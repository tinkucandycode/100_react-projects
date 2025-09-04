import { useEffect, useState, useCallback } from "react";
import "remixicon/fonts/remixicon.css";

const iconData = [
  {
    label: "Illustration (Avataaars)",
    value: "avataaars",
    URL: "https://api.dicebear.com/7.x/avataaars/svg?seed=",
  },
  {
    label: "Adventurer",
    value: "adventurer",
    URL: "https://api.dicebear.com/7.x/adventurer/svg?seed=",
  },
  {
    label: "Sketchy (Croodles)",
    value: "croodles",
    URL: "https://api.dicebear.com/7.x/croodles/svg?seed=",
  },
  {
    label: "Robots (Bottts)",
    value: "bottts",
    URL: "https://api.dicebear.com/7.x/bottts/svg?seed=",
  },
  {
    label: "Pixel Art",
    value: "pixel-art",
    URL: "https://api.dicebear.com/7.x/pixel-art/svg?seed=",
  },
  {
    label: "Male (RandomUser)",
    value: "male",
    URL: "https://randomuser.me/api/portraits/men",
  },
  {
    label: "Female (RandomUser)",
    value: "female",
    URL: "https://randomuser.me/api/portraits/women",
  },
];

function App() {
  const [imageSrc, setImageSrc] = useState("");
  const [icon, setIcon] = useState("male");
  const [btn, setBtn] = useState("");
  const [msg, setMsg] = useState("");

  const safeToast = (t) => {
    setMsg(t);
    setTimeout(() => setMsg(""), 1200);
  };

  const generateAvatar = useCallback(() => {
    const obj = iconData.find((item) => item.value === icon);
    if (!obj) return;

    if (icon === "male" || icon === "female") {
      // RandomUser images: 0–99
      const uniqueValue = Math.floor(Math.random() * 100); // 0..99
      setImageSrc(`${obj.URL}/${uniqueValue}.jpg`);
    } else {
      // DiceBear: SVG seeds
      const uniqueValue = Date.now();
      setImageSrc(`${obj.URL}${uniqueValue}`);
    }
  }, [icon]);

  const copyToClipboard = async () => {
    if (!imageSrc) return safeToast("No image to copy");
    try {
      await navigator.clipboard.writeText(imageSrc);
      safeToast("Image URL copied!");
    } catch {
      safeToast("Copy failed");
    }
  };

  // Try native download first; falls back to open if browser blocks
  const downloadImage = async () => {
    if (!imageSrc) return safeToast("No image to download");

    // Choose extension by source
    const ext = icon === "male" || icon === "female" ? "jpg" : "svg";
    const fileName = `avatar-${Date.now()}.${ext}`;

    const a = document.createElement("a");
    a.href = imageSrc;
    a.setAttribute("download", fileName); // ← key fix
    a.rel = "noopener";
    a.referrerPolicy = "no-referrer";
    document.body.appendChild(a);
    a.click();
    a.remove();

    // Note: Cross-origin servers may ignore the filename; still downloads.
  };

  const handleButtonclick = async (buttonName) => {
    setBtn(buttonName);
    setTimeout(() => setBtn(""), 200);

    if (buttonName === "Change") {
      generateAvatar();
    } else if (buttonName === "Download") {
      await downloadImage();
    } else if (buttonName === "Copy") {
      await copyToClipboard();
    }
  };

  useEffect(() => {
    generateAvatar();
  }, [generateAvatar]);

  const buttonIcons = {
    Change: "ri-exchange-funds-fill",
    Download: "ri-download-2-line",
    Copy: "ri-file-copy-line",
  };

  const isActionDisabled = (label) => label !== "Change" && !imageSrc; // only disable Copy/Download if no image

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-700 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col justify-center items-center w-full max-w-md rounded-2xl backdrop-blur-xl shadow-xl border-slate-600 border p-10">
          <img
            src={imageSrc || "/avatar-profile-picture.jpg"}
            alt="Avatar"
            className="w-32 h-32 rounded-2xl border-4 border-slate-600 shadow-lg object-cover"
          />

          <div className="text-center">
            <h1 className="text-3xl font-bold mt-2 text-cyan-50 tracking-wide">
              Avatar Generator
            </h1>
            <p className="text-cyan-50/80 mb-1">
              Generate unlimited avatars for your website
            </p>
            {msg && <p className="text-xs text-emerald-300">{msg}</p>}
          </div>

          <div className="relative w-full px-5">
            <label htmlFor="avatar-style" className="sr-only">
              Avatar style
            </label>
            <select
              id="avatar-style"
              className="bg-slate-900/60 mt-3 rounded-md w-full p-2.5 appearance-none text-cyan-50"
              value={icon}
              aria-label="Avatar style"
              onChange={(e) => setIcon(e.target.value)}
            >
              {iconData.map((it) => (
                <option
                  key={it.value}
                  value={it.value}
                  className="text-cyan-50"
                >
                  {it.label}
                </option>
              ))}
            </select>

            <div className="bg-slate-900/60 mt-3 rounded-md w-full p-2.5 appearance-none text-cyan-50 overflow-x-hidden break-all select-all">
              {imageSrc}
            </div>
          </div>

          <div className="flex w-full justify-around">
            {["Change", "Download", "Copy"].map((label) => {
              const base =
                label === "Change"
                  ? "bg-gradient-to-r from-rose-500 to-orange-600"
                  : label === "Download"
                  ? "bg-gradient-to-r from-green-500 to-green-600"
                  : "bg-gradient-to-r from-purple-500 to-purple-600";

              const active =
                label === "Change"
                  ? "bg-gradient-to-br from-rose-800 to-orange-900"
                  : label === "Download"
                  ? "bg-gradient-to-br from-green-800 to-green-900"
                  : "bg-gradient-to-br from-purple-800 to-purple-900";

              const isActive = btn === label;

              return (
                <button
                  key={label}
                  onClick={() => handleButtonclick(label)}
                  aria-label={label}
                  disabled={isActionDisabled(label)}
                  className={`rounded-sm px-3 py-2 mt-5 w-fit text-center font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                    isActive ? active : base
                  }`}
                >
                  <i className={`mr-1 ${buttonIcons[label]}`} />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
