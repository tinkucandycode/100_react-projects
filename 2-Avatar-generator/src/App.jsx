import { useCallback, useEffect, useState } from "react";
import "remixicon/fonts/remixicon.css";

const iconData = [
  {
    label: "Illustration",
    value: "illustration",
    URL: "https://api.dicebear.com/7.x/avataaars/svg?seed=",
  },
  {
    label: "Pixel-art",
    value: "pixel-art",
    URL: "https://api.dicebear.com/7.x/adventurer/svg?seed=",
  },
  {
    label: "Sketchy",
    value: "Sketchy",
    URL: "https://api.dicebear.com/7.x/croodles/svg?seed=",
  },
  {
    label: "Robots",
    value: "robots",
    URL: "https://api.dicebear.com/7.x/bottts/svg?seed=",
  },
  {
    label: "Pixel-art",
    value: "pixel-art",
    URL: "https://api.dicebear.com/7.x/pixel-art/svg?seed=",
  },
  {
    label: " Male",
    value: "male",
    URL: "https://randomuser.me/api/portraits/men",
  },
  {
    label: "Female",
    value: "female",
    URL: "https://randomuser.me/api/portraits/women",
  },
];

function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const [icon, setIcon] = useState("male");
  const [btn, btnRole] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  const safeToast = (t) => {
    setMsg(t);
    setTimeout(() => setMsg(""), 1200);
  };

  const GenerateAvatar = useCallback(() => {
    const obj = iconData.find((item) => item.value === icon);
    if (!obj) return;
    const url = obj.URL;
    if (icon === "male" || icon === "female") {
      const uniqueValue = Math.floor(Math.random() * 99) + 1;
      const genderIcon = `${url}/${uniqueValue}.jpg`;
      setImageSrc(genderIcon);
    } else {
      const uniqueValue = Date.now();
      const imageUrl = `${url}${uniqueValue}`;
      setImageSrc(imageUrl);
    }
  }, [icon]);

  const handleButtonclick = async (buttonName) => {
    btnRole(buttonName);
    setTimeout(() => btnRole(""), 200);
    if (buttonName === "Change") {
      GenerateAvatar();
    } else if (buttonName === "Download") {
      await downloadImage();
    } else if (buttonName === "Copy") {
      await copyToClipboard();
    }
  };

  const copyToClipboard = () => async () => {
    if (!imageSrc) return safeToast("No image to copy");
    try {
      await navigator.clipboard.writeText(imageSrc);
      safeToast("Copied to clipboard");
    } catch {
      safeToast("Failed to copy");
    }
  };

  const downloadImage = () => {
    const a = document.createElement("a");
    a.href = imageSrc;
    a.dow = `download,${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  useEffect(() => {
    GenerateAvatar();
  }, [icon]);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-700 to-slate-900 flex items-center justify-center">
        <div className="flex flex-col justify-center items-center  w-full max-w-md rounded-2xl backdrop-blur-xl shadow-xl border-slate-600 border p-10">
          <img
            src={imageSrc || "/avatar-profile-picture.jpg"}
            alt="Avatar"
            className="w-32 h-32 rounded-2xl border-4 border-slate-600 shadow-lg object-cover "
          />
          <div className="text-center">
            <h1 className="text-3xl font-bold mt-2 text-cyan-50 tracking-wide ">
              Avatar Generator
            </h1>
            <p className="text-cyan-50/80 mb-1">
              Generate unlimited avatars for yours website
            </p>
            {msg && <p className="text-xs text-emerald-300">{msg}</p>}
          </div>

          <div className="relative w-full px-5">
            <select
              className="bg-slate-900/60 mt-3 rounded-md w-full p-2.5 appearance-none text-cyan-50 "
              value={icon}
              onChange={(e) => {
                setIcon(e.target.value);
              }}
            >
              {iconData.map((icon, index) => {
                return (
                  <option
                    key={index}
                    value={icon.value}
                    className="text-cyan-50"
                  >
                    {icon.label}
                  </option>
                );
              })}
            </select>
            <div className="bg-slate-900/60 mt-3 rounded-md w-full p-2.5 appearance-none text-cyan-50 overflow-x-hidden break-all">
              {imageSrc}
            </div>
          </div>
          <div className="flex w-full justify-around ">
            {["Change", "Download", "Copy"].map((e) => {
              const buttonIcons = {
                Change: "ri-exchange-funds-fill",
                Download: "ri-download-2-line",
                Copy: "ri-file-copy-line",
              };
              let baseColor =
                e === "Change"
                  ? `bg-gradient-to-r from-rose-500 to-orange-600 `
                  : e === "Download"
                  ? `bg-gradient-to-r from-green-500 to-green-600`
                  : `bg-gradient-to-r from-purple-500 to-purple-600  `;
              let activeColor =
                e === "Change"
                  ? "bg-gradient-to-br from-rose-800 to-orange-900 "
                  : e === "Download"
                  ? "bg-gradient-to-br from-green-800 to-green-900"
                  : "bg-gradient-to-br from-purple-800 to-purple-900 ";
              return (
                <button
                  key={e}
                  onClick={() => handleButtonclick(e)}
                  className={`rounded-sm px-3 py-2 mt-5 w-fit text-center font-medium transition-colors
                    ${btn == e ? activeColor : baseColor}`}
                >
                  <i className={`mr-1 ${buttonIcons[e]}`}></i>
                  {e}
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
