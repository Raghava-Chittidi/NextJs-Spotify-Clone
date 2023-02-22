import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useSpotify from "../hooks/useSpotify";

const useSongInfo = () => {
  const spotifyApi = useSpotify();
  const currentTrack = useSelector((state) => state.track.track);
  const [songInfo, setSongInfo] = useState(null);

  useEffect(() => {
    const fetchSongInfo = async () => {
      if (currentTrack) {
        const response = await fetch(
          `https://api.spotify.com/v1/tracks/${currentTrack}`,
          {
            headers: {
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            },
          }
        );
        const trackInfo = await response.json();
        setSongInfo(trackInfo);
      }
    };

    fetchSongInfo();
  }, [currentTrack, spotifyApi]);

  return songInfo;
};

export default useSongInfo;
