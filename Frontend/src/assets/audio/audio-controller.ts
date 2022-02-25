import { Howl, Howler } from "howler";
import { ref, watch } from "vue";


function getSound(url: string, bg: boolean): Howl {
  return new Howl({
    src: [url],
    autoplay: bg,
    loop: bg,
    preload: true,
  });
}

const clickSound = getSound("https://storage.googleapis.com/galaxia-js.appspot.com/media/audio/button-click.mp3", false);
const hoverSound = getSound("https://storage.googleapis.com/galaxia-js.appspot.com/media/audio/button-enter.mp3", false);
const loadingSound = getSound("https://storage.googleapis.com/galaxia-js.appspot.com/media/audio/load.mp3", false);
const bgSound = getSound("https://storage.googleapis.com/galaxia-js.appspot.com/media/audio/app.mp3", true);

const soundOn = ref<boolean>(true);
const playingAudio = ref<boolean>(false);
bgSound.once("load", () => playingAudio.value = true);

export default function useAudio() {
  const toggleAudio = () => soundOn.value = !soundOn.value;
  // @ts-ignore
  watch(soundOn, (newValue: boolean) => Howler.mute(newValue));

  function playSoundEffect(sound: Howl) {
    sound.pause();
    sound.seek(0);
    sound.play();
  }

  return {
    soundOn,
    playingAudio,
    toggleAudio,
    backgroundMusic: () => playSoundEffect(clickSound),
    buttonClick: () => playSoundEffect(clickSound),
    buttonHover: () => playSoundEffect(hoverSound),
    stopBackgroundMusic: () => bgSound.pause(),
    stopButtonClick: () => clickSound.pause(),
    stopButtonHover: () => hoverSound.pause(),
  };
}
