import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import useSpotify from "../hooks/useSpotify";
import useSongInfo from "../hooks/useSongInfo";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowsRightLeftIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline";
import {
  BackwardIcon,
  SpeakerXMarkIcon,
  SpeakerWaveIcon,
  ForwardIcon,
  PauseCircleIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/solid";
import { isPlayingActions, trackActions } from "../store/spotifyStore";
import { debounce } from "lodash";

const Player = () => {
  const dispatch = useDispatch();
  const spotifyApi = useSpotify();
  const { data: session, status } = useSession();
  const currentTrack = useSelector((state) => state.track.track);
  const isPlaying = useSelector((state) => state.isPlaying.isPlaying);
  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo();

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        console.log("Now Playing: ", data.body?.item);
        dispatch(trackActions.select({ track: data.body?.item?.id }));
      });

      spotifyApi.getMyCurrentPlaybackState().then((data) => {
        dispatch(isPlayingActions.set({ isPlaying: data.body?.is_playing }));
      });
    }
  };

  const playPauseHandler = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        spotifyApi.pause();
        dispatch(isPlayingActions.set({ isPlaying: false }));
      } else {
        spotifyApi.play();
        dispatch(isPlayingActions.set({ isPlaying: true }));
      }
    });
  };

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrack) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrack, spotifyApi, session]);

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume);
    }
  }, [volume]);

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => {});
    }, 500),
    []
  );

  return (
    <div className="h-24 bg-gradient-to-b from-black to-gray-900 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
      {/* Left */}
      <div className="flex items-center space-x-4">
        <img
          className="hidden md:inline h-10 w-10"
          src={songInfo?.album.images?.[0]?.url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>

      {/* Center */}
      <div className="flex items-center justify-evenly">
        <ArrowsRightLeftIcon className="button" />
        <BackwardIcon
          // onClick={() => spotifyApi.skipToPrevious()}
          className="button"
        />

        {isPlaying ? (
          <PauseCircleIcon
            onClick={playPauseHandler}
            className="button h-10 w-10"
          />
        ) : (
          <PlayCircleIcon
            onClick={playPauseHandler}
            className="button h-10 w-10"
          />
        )}

        <ForwardIcon
          // onClick={() => spotifyApi.skipToNext()}
          className="button"
        />
        <ArrowUturnLeftIcon className="button" />
      </div>

      {/* Right */}
      <div className="flex items-center space-x-3 md:space-x-4 justify-end pr-5">
        <SpeakerXMarkIcon
          onClick={() => volume > 0 && setVolume((prevState) => prevState - 10)}
          className="button"
        />
        <input
          type="range"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-14 md:w-28"
          min={0}
          max={100}
        />
        <SpeakerWaveIcon
          onClick={() =>
            volume < 100 && setVolume((prevState) => prevState + 10)
          }
          className="button"
        />
      </div>
    </div>
  );
};

export default Player;
