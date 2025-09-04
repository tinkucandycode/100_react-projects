import { useEffect, useState, useCallback } from "react";
import "remixicon/fonts/remixicon.css";

// Avatar sources
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

export default function App() {
  const [imageSrc, setImageSrc] = useState("");
  const [icon, setIcon] = useState("avataaars");
  const [btn, setBtn] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const toast = (t) => {
    setMsg(t);
    clearTimeout(toast._t);
    toast._t = setTimeout(() => setMsg(""), 1200);
  };

  // URL builder for selected icon
  const buildImageUrl = useCallback(() => {
    const src = iconData.find((i) => i.value === icon);
    if (!src) return "";
    if (icon === "male" || icon === "female") {
      const n = Math.floor(Math.random() * 100); // 0..99
      return `${src.URL}/${n}.jpg`;
    }
    // DiceBear seeds (SVG by default). If you want PNG, replace 'svg' with 'png' in iconData URLs.
    const seed = Date.now().toString();
    return `${src.URL}${seed}`;
  }, [icon]);

  const generateAvatar = useCallback(() => {
    const url = buildImageUrl();
    if (!url) return;
    setImageSrc(url);
  }, [buildImageUrl]);

  const copyToClipboard = async () => {
    if (!imageSrc) return toast("No image to copy");
    try {
      await navigator.clipboard.writeText(imageSrc);
      toast("URL copied!");
    } catch {
      toast("Copy failed");
    }
  };

  // Robust downloader: uses state directly (no parameter — avoids shadowing bugs)
  const downloadImage = async () => {
    if (!imageSrc || typeof imageSrc !== "string") {
      console.warn("downloadImage: invalid imageSrc =>", imageSrc);
      alert("No image to download");
      return;
    }
    try {
      setBusy(true);
      const res = await fetch(imageSrc, { mode: "cors" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const blob = await res.blob();
      const mime = (blob.type || "").toLowerCase();
      const ext = mime.includes("svg")
        ? "svg"
        : mime.includes("png")
        ? "png"
        : mime.includes("jpeg") || mime.includes("jpg")
        ? "jpg"
        : "png"; // safe fallback

      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = `avatar.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(href);
      toast("Downloaded!");
    } catch (e) {
      console.error("Download failed:", e);
      alert("Download failed. Check console for details.");
    } finally {
      setBusy(false);
    }
  };

  const handleButtonclick = async (buttonName) => {
    setBtn(buttonName);
    setTimeout(() => setBtn(""), 300);

    if (buttonName === "Change") generateAvatar();
    else if (buttonName === "Copy") await copyToClipboard();
    else if (buttonName === "Download") await downloadImage();
  };

  useEffect(() => {
    generateAvatar(); // initial + whenever icon changes
  }, [icon, generateAvatar]);

  const buttonIcons = {
    Change: "ri-exchange-funds-fill",
    Download: "ri-download-2-line",
    Copy: "ri-file-copy-line",
  };

  return (
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
          {msg && (
            <p className="text-xs text-emerald-300" role="status">
              {msg}
            </p>
          )}
        </div>

        <div className="relative w-full px-5">
          <select
            className="bg-slate-900/60 mt-3 rounded-md w-full p-2.5 appearance-none text-cyan-50"
            value={icon}
            aria-label="Avatar style"
            onChange={(e) => setIcon(e.target.value)}
          >
            {iconData.map((it) => (
              <option key={it.value} value={it.value} className="text-cyan-50">
                {it.label}
              </option>
            ))}
          </select>

          <div className="bg-slate-900/60 mt-3 rounded-md w-full p-2.5 text-cyan-50 overflow-x-hidden break-all select-all">
            {imageSrc}
          </div>
        </div>

        <div className="flex w-full justify-around">
          {["Change", "Download", "Copy"].map((e) => {
            const base =
              e === "Change"
                ? "bg-gradient-to-r from-rose-500 to-orange-600"
                : e === "Download"
                ? "bg-gradient-to-r from-green-500 to-green-600"
                : "bg-gradient-to-r from-purple-500 to-purple-600";
            const active =
              e === "Change"
                ? "bg-gradient-to-br from-rose-800 to-orange-900"
                : e === "Download"
                ? "bg-gradient-to-br from-green-800 to-green-900"
                : "bg-gradient-to-br from-purple-800 to-purple-900";
            const isActive = btn === e;
            const isDisabled = busy && e === "Download";

            return (
              <button
                key={e}
                onClick={() => handleButtonclick(e)}
                aria-label={e}
                disabled={isDisabled}
                className={`rounded-sm px-3 py-2 mt-5 w-fit text-center font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                  isActive ? active : base
                }`}
              >
                <i className={`mr-1 ${buttonIcons[e]}`} />
                {e}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
