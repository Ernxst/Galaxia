import useAudio from "@/assets/audio/audio-controller";
import { ref } from "vue";


export default function useButton(emit: (arg0: string, arg1: MouseEvent) => void) {
  const disabled = ref<boolean>(false);
  const mouseEntered = ref<boolean>(false);

  const { buttonClick, buttonHover, stopButtonClick, stopButtonHover } = useAudio();

  function onClick(event: MouseEvent) {
    buttonClick();
    emit("click", event);
  }

  function onMouseEnter(event: MouseEvent) {
    buttonHover();
    mouseEntered.value = true;
    emit("mouseenter", event);
  }

  function onMouseLeave(event: MouseEvent) {
    stopButtonHover();
    mouseEntered.value = false;
    emit("mouseleave", event);
  }

  function enable() {
    disabled.value = false;
  }

  function disable() {
    disabled.value = true;
    stopButtonClick();
    stopButtonHover();
  }

  return { disabled, mouseEntered, onClick, onMouseEnter, onMouseLeave, enable, disable };
}
