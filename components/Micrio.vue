<script setup lang="ts">
import type { HTMLMicrioElement, Models } from "Micrio";

export type Micrio = {
  Instance: ReturnType<typeof buildEmittedInstance>;
};

const props = defineProps<{
  id: string;
  lang: string;
}>();

const emit = defineEmits<{
  show: [micrio: Micrio["Instance"]];
  update: [micrio: Micrio["Instance"]];
  "marker-open": [void];
}>();

useHead({
  title: "Micrio",
  script: [{ src: "https://b.micr.io/micrio-4.3.min.js" }],
});

const micrioRef = ref<HTMLMicrioElement>();

function buildEmittedInstance(micrio: HTMLMicrioElement) {
  const tour = (() => {
    if (!micrio.state.$tour) return undefined;

    // Specify currentStep explicitly, because Micrio is not showing it for some reason
    const currentStep =
      "currentStep" in micrio.state.$tour
        ? micrio.state.$tour.currentStep
        : undefined;

    return {
      ...micrio.state.$tour,
      currentStep,
      cancel: cancelTour,
    };
  })();

  return {
    camera: micrio.camera,
    tour,
    events: {
      isNavigating: micrio.events.isNavigating,
    },
    marker: micrio.state?.$marker,
    $current: micrio.$current,
  };
}

onMounted(() => {
  const element = document.querySelector("micr-io")!;
  micrioRef.value = document.querySelector("micr-io") as HTMLMicrioElement;
  const micrio = micrioRef.value;

  micrio.defaultSettings = {
    _markers: {
      noTitles: true,
      autoStartTour: true,
      zoomOutAfterClose: true,
    },
  };

  element.addEventListener("show", (e: any) => {
    emit("show", buildEmittedInstance(e.detail as HTMLMicrioElement));
  });

  // This emit is needed for the currentStep to update in time
  element.addEventListener("marker-opened", () => {
    emit("update", buildEmittedInstance(micrio));
  });

  element.addEventListener("marker-open", () => {
    emit("marker-open");
  });

  element.addEventListener("update", () => {
    emit("update", buildEmittedInstance(micrio));
  });
});

watch(
  () => props.lang,
  (lang) => {
    const micrio = micrioRef.value;
    if (!micrio) return;

    const oldView = micrio.camera.getView()!;
    micrioRef.value?.$current.lang.set(lang);

    // Restore view
    micrio.camera.jumpToView(oldView, 0);
  }
);

function cancelTour() {
  micrioRef.value?.state.tour.set(undefined);
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
    :lang="lang"
    camspeed="3"
    controls="false"
    logo="false"
    toolbar="false"
    minimap="false"
  />
  <slot
    :cancelTour="cancelTour"
    :nextMarker="() => changeStepBy(1)"
    :previousMarker="() => changeStepBy(-1)"
  ></slot>
</template>
