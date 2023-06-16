<script setup lang="ts">
import type { HTMLMicrioElement, Models } from "Micrio";

const emit = defineEmits(["update"]);

// How to do a language switch?

const { id } = defineProps(["id"]);
useHead({
  title: "Micrio",
  script: [{ src: "https://b.micr.io/micrio-4.3.min.js" }],
});

const micrioRef = ref<HTMLMicrioElement>();
const tourRef = ref<
  Models.ImageCultureData.MarkerTour | Models.ImageCultureData.VideoTour
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
    });
  });

  element.addEventListener("update", (e: any) => {
    emit("update");
  });
});

onUnmounted(() => {
  tourUnsubscribeRef.value?.();
});

function cancelTour() {
  micrioRef.value?.state.tour.set(undefined as any); // Probably the typings aren't right here
}

function changeStepBy(delta: number) {
  const micrio = micrioRef.value;
  const tour = tourRef.value as Models.ImageCultureData.MarkerTour;
  if (!micrio || !tour.goto) return;

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
