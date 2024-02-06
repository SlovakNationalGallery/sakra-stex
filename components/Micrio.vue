<script setup lang="ts">
import { HTMLMicrioElement, Models } from "Micrio";

export type Micrio = {
  Instance: ReturnType<typeof buildEmittedInstance>;
  Marker: Models.ImageCultureData.Marker;
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

const slots = defineSlots<{
  marker(props: (typeof markers)["value"][number]): any;
  controls(props: {
    cancelTour: () => void;
    nextMarker: () => void;
    previousMarker: () => void;
  }): any;
}>();

const micrioRef = shallowRef<HTMLMicrioElement>();
const dataRef = shallowRef<HTMLMicrioElement["$current"]["$data"]>();

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
      controls: {
        cancel: cancelTour,
        next: () => changeStepBy(1),
        previous: () => changeStepBy(-1),
      },
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

const markers = computed(() => {
  const markers = dataRef.value?.markers ?? [];
  const tours = dataRef.value?.markerTours ?? [];

  return markers.map((marker) => ({
    ...marker,
    open: () => {
      micrioRef.value?.$current.state.marker.set(marker);
    },
    close: () => micrioRef.value?.$current.state.marker.set(undefined as any),
    index: tours
      .find((tour) => tour.steps.includes(marker.id))
      ?.steps.indexOf(marker.id),
  }));
});

onMounted(() => {
  const micrio = micrioRef.value;
  if (!micrio) return;

  micrio.defaultSettings = {
    _markers: {
      noTitles: true,
      autoStartTour: true,
      zoomOutAfterClose: false,
    },
  };

  micrio.addEventListener("show", () => {
    emit("show", buildEmittedInstance(micrio));

    micrio.$current.data.subscribe((data) => {
      dataRef.value = data;
    });
  });

  // This emit is needed for the currentStep to update in time
  micrio.addEventListener("marker-opened", () => {
    emit("update", buildEmittedInstance(micrio));
  });

  micrio.addEventListener("marker-open", () => {
    emit("marker-open");
  });

  micrio.addEventListener("update", () => {
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
  },
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
    ref="micrioRef"
    :id="id"
    :lang="lang"
    camspeed="3"
    controls="false"
    logo="false"
    toolbar="false"
    minimap="false"
  />
  <Teleport v-for="marker in markers" :to="`#m-${marker.id} > button`">
    <slot name="marker" v-bind="marker"></slot>
  </Teleport>
</template>
