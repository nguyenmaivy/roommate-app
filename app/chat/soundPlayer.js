export const playSound = (path, loop = false) => {
  const audio = new Audio(path);
  audio.loop = loop;
  audio.play().catch(() => {});
  return audio; // trả ra audio để có thể stop sau
};

export const stopSound = (audioRef) => {
  if (audioRef) {
    audioRef.pause();
    audioRef.currentTime = 0;
  }
};
