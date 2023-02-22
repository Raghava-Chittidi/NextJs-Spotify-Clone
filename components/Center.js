import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { signOut, useSession } from "next-auth/react";
import { shuffle } from "lodash";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useSpotify from "../hooks/useSpotify";
import { playlistActions } from "../store/spotifyStore";

import Songs from "../components/Songs";

const colors = [
  "from-indigo-500",
  "from-blue-500",
  "from-green-500",
  "from-red-500",
  "from-yellow-500",
  "from-pink-500",
  "from-purple-500",
];

const Center = () => {
  const { data: session } = useSession();
  const spotifyApi = useSpotify();
  const dispatch = useDispatch();

  const [color, setColor] = useState(null);
  const [playlist, setPlaylist] = useState(null);

  const playlistId = useSelector((state) => state.playlistId.id);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi
        .getPlaylist(playlistId)
        .then((data) => {
          setPlaylist(data.body);
          dispatch(playlistActions.select({ playlist: data.body }));
        })
        .catch((err) => console.log("Something went wrong!", err));
    }
  }, [spotifyApi, playlistId]);

  return (
    <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
      <div className="relative">
        <header className="absolute top-5 right-8 ">
          <div
            className="flex items-center bg-black text-white space-x-3 opacity-90 hover:opacity-80 rounded-full cursor-pointer p-1 pr-2"
            onClick={signOut}
          >
            <img
              className="rounded-full w-10 h-10"
              src={session?.user.image}
              alt={session?.user.name}
            />
            <h2>{session?.user.name}</h2>
            <ChevronDownIcon className="h-5 w-5" />
          </div>
        </header>
      </div>

      <section
        className={`text-white bg-gradient-to-b to-black ${color} h-80 flex items-end space-x-7 p-8`}
      >
        <img
          className="h-44 w-44 shadow-2xl"
          src={playlist?.images?.[0]?.url}
          alt=""
        />
        <div>
          <p>PLAYLIST</p>
          <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">
            {playlist?.name}
          </h1>
        </div>
      </section>

      <div>
        <Songs />
      </div>
    </div>
  );
};

export default Center;
