export default function (durationInSeconds: number, onTimeout: () => void) {
  const timeout = ref();

  onMounted(() => {
    startTimer();
  });

  onUnmounted(() => {
    clearTimer();
  });

  function startTimer() {
    clearTimer();
    timeout.value = setTimeout(onTimeout, durationInSeconds * 1000);
  }

  function clearTimer() {
    timeout.value && clearTimeout(timeout.value);
  }

  function reset() {
    clearTimer();
    startTimer();
  }

  return { reset };
}
