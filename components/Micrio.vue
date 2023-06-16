<script setup lang="ts">
import type { HTMLMicrioElement, Models } from "Micrio";

const props = defineProps<{
  id: string;
  cancelTourAfterMs?: number;
}>();
const emit = defineEmits(["update"]);

const tourCancellationTimer = useTimer(props.cancelTourAfterMs ?? 0, () => {
  if (props.cancelTourAfterMs === undefined) return;
  cancelTour();
});

useHead({
  title: "Micrio",
  script: [{ src: "https://b.micr.io/micrio-4.3.min.js" }],
});

const micrioRef = ref<HTMLMicrioElement>();
const tourRef = ref<
  | Models.ImageCultureData.VideoTour
  | Models.ImageCultureData.MarkerTour
  | undefined
>();
const tourUnsubscribeRef = ref<() => void>();

onMounted(() => {
  const element = document.querySelector("micr-io")!;
  micrioRef.value = document.querySelector("micr-io") as HTMLMicrioElement;
  const micrio = micrioRef.value;

  micrio.defaultSettings = {
    noZoom: true,
    _markers: {
      autoStartTour: true,
      zoomOutAfterClose: true,
    },
  };

  element.addEventListener("show", (e: any) => {
    tourUnsubscribeRef.value = micrio.state.tour.subscribe((tourData) => {
      tourRef.value = tourData;
      tourCancellationTimer.reset();
    });
  });

  element.addEventListener("update", (e) => {
    emit("update", { tour: micrio?.state.$tour });
  });
});

onUnmounted(() => {
  tourUnsubscribeRef.value?.();
});

function cancelTour() {
  const micrio = micrioRef.value;
  if (!micrio) return;
  micrio.state.tour.set(undefined);
  micrio.camera.flyToFullView();
}

function changeStepBy(delta: number) {
  const tour = micrioRef.value?.state.$tour as
    | Models.ImageCultureData.MarkerTour
    | undefined;
  if (tour?.goto === undefined) return;

  if (delta > 0) {
    tour.goto((tour.currentStep! + delta) % tour.steps.length);
  }

  if (delta < 0) {
    const nextStep = tour.currentStep! - (-delta % tour.steps.length);
    tour.goto(nextStep < 0 ? tour.steps.length + nextStep : nextStep);
  }
}
</script>

<template>
  <!-- https://kb.micr.io/for-developers/custom-options-for-the-micr-io-element -->
  <micr-io
    :id="id"
    camspeed="3"
    controls="false"
    logo="false"
    toolbar="false"
    minimap="false"
  />
  <slot
    :tour="tourRef"
    :cancelTour="cancelTour"
    :nextMarker="() => changeStepBy(1)"
    :previousMarker="() => changeStepBy(-1)"
  ></slot>
</template>
