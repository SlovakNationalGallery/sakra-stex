export default function (durationInMs: number, onTimeout: () => void) {
  const timeout = ref();

  onUnmounted(() => {
    clearTimer();
  });

  function startTimer() {
    clearTimer();
    timeout.value = setTimeout(onTimeout, durationInMs);
  }

  function clearTimer() {
    timeout.value && clearTimeout(timeout.value);
  }

  function reset() {
    clearTimer();
    startTimer();
  }

  function cancel() {
    clearTimer();
  }

  return { reset, cancel };
}
