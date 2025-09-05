import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import "remixicon/fonts/remixicon.css";
const API_KEY = "0u3puwhzVXZq5VJnOJtvm10Lf2xmDIvRHw4FMlRu0vSxRlD8ofOIATFF";
const API_URL = `https://api.pexels.com/v1/search?query=people&page=1&per_page=15`;
const NUM_IMAGES = 24;
function App() {
  const [photos, setPhotos] = useState([]);
  const [isLoading, setLoading] = useState(false);

  const fetchImage = async () => {
    try {
      setLoading(true);
      const options = {
        headers: {
          Authorization: API_KEY,
        },
      };
      const res = await axios.get(API_URL, options);
      console.log(res);

      setPhotos(res.data.photos);
    } catch (error) {
      toast.error("failed to loaded images");
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImage();
  }, []);
  return (
    <>
      <div className="bg-gray-200 min-h-screen flex flex-col items-center py-8 ">
        <h1 className="text-3xl font-bold text-pink-500 mb-5">IMAGE GALLERY</h1>
        <form>
          <input
            type="text"
            placeholder="search image here"
            className="border border-gray-200 p-3 bg-white rounded-lg mb-5 w-full md:w-[250px] lg:w-[500px] mx-auto  focus:ring-2 focus:ring-blue-500 transition-all duration-300 ease-in-out"
          />
          <button className="bg-blue-600 font-medium  w-20 p-3 m-2 rounded-lg hover:bg-blue-500 shadow-md ">
            Search
          </button>
        </form>
        <div className="w-11/12 md:w-10/12 mx-auto ">
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-3 gap-4 space-y-4  ">
            {photos.map((item) => (
              <div className="bg-gray-300 rounded-2xl p-5">
                <div key={item.id} className="break-inside-avoid">
                  <img
                    src={item.src.original}
                    alt={item.alt}
                    className="rounded-xl w-full shadow-md hover:shadow-lg transition-shadow duration-300 "
                  />
                  <div className="font-light bg-gray-200 my-2 p-5 text-lg rounded-sm grid grid-cols-2 underline-offset-100">
                    {/* button */}
                    <a className="bg-blue-600 font-medium w-full col-span-2 py-2 text-center rounded-lg mb-3 hover:bg-blue-500 shadow-md">
                      <i class="ri-download-fill text-white"></i>
                    </a>
                    {/* credits */}
                    <div className="ml-2">
                      Credits
                      <div className=" font-bold bg-gray-200 ">
                        {item.photographer}
                      </div>
                    </div>
                    {/* side para alt*/}
                    <p>{item.alt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className=" flex justify-center items-center h-40">
            {isLoading && (
              <i class="ri-loader-2-line text-4xl text-gray-500 animate-spin"></i>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
