<script setup lang="ts">
import type { HTMLMicrioElement, Models } from "Micrio";

const { id } = defineProps(["id"]);
useHead({
  title: "Micrio",
  script: [{ src: "https://b.micr.io/micrio-4.1.min.js" }],
});

const micrio = ref<HTMLMicrioElement>();
const tour = ref<
  Models.ImageCultureData.MarkerTour | Models.ImageCultureData.VideoTour
>();

onMounted(() => {
  const element = document.querySelector("micr-io")!;
  element.addEventListener("show", () => {
    micrio.value = document.querySelector("micr-io") as HTMLMicrioElement;
  });

  element.addEventListener("marker-open", (e: any) => {
    // Clicking on a marker also opens its tour
    const markerId = e.detail.id as string;
    const tour = micrio.value!.$current.$data.markerTours[0];
    const tourStep = tour.steps.findIndex((step) => step === markerId);
    micrio.value?.state.tour.set({ ...tour, currentStep: tourStep });
  });

  element.addEventListener("update", (e: any) => {
    tour.value = micrio.value?.state.$tour;
  });
});

function cancelTour() {
  micrio.value?.state.tour.set(undefined);
}

function changeStepBy(delta: number) {
  const tour = micrio.value?.state.$tour as
    | Models.ImageCultureData.MarkerTour
    | undefined;

  if (tour?.currentStep === undefined) return;

  const stepIndex = (() => {
    const maxIndex = tour.steps.length - 1;
    const nextIndex = tour.currentStep + delta;

    if (nextIndex < 0) return maxIndex - 1 - (nextIndex % maxIndex);
    if (nextIndex > maxIndex) return (nextIndex % maxIndex) - 1;
    return nextIndex;
  })();
  const stepId = tour.steps[stepIndex];
  const marker = micrio.value?.$current.$data.markers.find(
    (marker) => marker.id === stepId
  );

  micrio.value?.state.marker.set(marker);
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
    :tour="tour"
    :cancelTour="cancelTour"
    :nextMarker="() => changeStepBy(1)"
    :previousMarker="() => changeStepBy(-1)"
  ></slot>
</template>
