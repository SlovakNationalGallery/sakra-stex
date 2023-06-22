<script setup lang="ts">
import type { Coords, HTMLMicrioElement, Models } from "Micrio";

const props = defineProps<{
  id: string;
  cancelTourAfterMs?: number;
  coordinates?: Coords;
}>();
const emit = defineEmits(["update"]);

const tourCancellationTimer = useTimer(props.cancelTourAfterMs ?? 0, () => {
  if (props.cancelTourAfterMs === undefined) return;
  if (tourRef.value) cancelTour();
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
const markerRef = ref<Models.ImageCultureData.Marker>();

onMounted(() => {
  const element = document.querySelector("micr-io")!;
  micrioRef.value = document.querySelector("micr-io") as HTMLMicrioElement;
  const micrio = micrioRef.value;

  micrio.defaultSettings = {
    noZoom: true,
    _markers: {
      noTitles: true,
      autoStartTour: true,
      zoomOutAfterClose: true,
    },
  };

  element.addEventListener("show", (e: any) => {
    if (props.coordinates) {
      micrio.camera.flyToCoo(props.coordinates);
    }

    // Subscribe refs to state changes to that we can watch them
    micrio.state.tour.subscribe((tour) => {
      tourRef.value = tour;
    });
    micrio.state.marker.subscribe((marker) => {
      markerRef.value = marker;
    });
  });
});

watch(
  () => props.coordinates,
  (coordinates) => {
    const micrio = micrioRef.value;
    if (!micrio) return;

    // Ignore if there's a marker selected
    if (markerRef.value) return;

    coordinates
      ? micrio.camera.flyToCoo(coordinates)
      : micrio.camera.flyToFullView();
  }
);

watch(markerRef, (marker) => {
  marker ? tourCancellationTimer.reset() : tourCancellationTimer.cancel();
  emit("update", { marker });
});

function cancelTour() {
  console.log("Cancelling tour due to inactivity");
  const micrio = micrioRef.value!;

  micrio.state.tour.set(undefined);

  props.coordinates
    ? micrio.camera.flyToCoo(props.coordinates)
    : micrio.camera.flyToFullView();
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
