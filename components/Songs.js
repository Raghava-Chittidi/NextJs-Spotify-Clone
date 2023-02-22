import { useSelector } from "react-redux";
import Song from "./Song";

const Songs = () => {
  const playlist = useSelector((state) => state.playlist.playlist);

  return (
    <div className="text-white px-8 flex flex-col space-y-1 pb-28">
      {playlist?.tracks.items.map((track, index) => (
        <Song key={track.track.id} track={track} order={index} />
      ))}
    </div>
  );
};

export default Songs;
