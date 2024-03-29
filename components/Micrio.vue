<script setup lang="ts">
import type { Coords, HTMLMicrioElement, Models } from "Micrio";

const gtm = useGtm();

const props = defineProps<{
  id: string;
  cancelTourAfterMs?: number;
  coordinates?: Coords;
  lang: string;
}>();
const emit = defineEmits(["marker-open", "tour-stop", "tour-started"]);

const tourCancellationTimer = useTimer(props.cancelTourAfterMs ?? 0, () => {
  if (props.cancelTourAfterMs === undefined) return;
  if (micrioRef.value?.state.$tour) {
    console.log("Cancelling tour due to inactivity");
    cancelTour();
  }
});

useHead({
  title: "Micrio",
  script: [{ src: "https://b.micr.io/micrio-4.3.min.js" }],
});

const micrioRef = ref<HTMLMicrioElement>();

onMounted(() => {
  const element = document.querySelector("micr-io")!;
  micrioRef.value = document.querySelector("micr-io") as HTMLMicrioElement;
  const micrio = micrioRef.value;

  micrio.defaultSettings = {
    noZoom: true,
    hookDrag: false,
    hookPinch: false,
    freeMove: false,
    _markers: {
      noTitles: true,
      autoStartTour: true,
      zoomOutAfterClose: true,
    },
  };

  element.addEventListener("show", (e: any) => {
    if (props.coordinates) {
      // Ignore if there's a marker selected
      if (micrio.state.$marker) return;

      micrio.camera.flyToCoo(props.coordinates);
    }

    micrio.state.tour.subscribe((tour) => {
      if (tour) {
        emit("tour-started");
        tourCancellationTimer.reset();
        return;
      }

      emit("tour-stop");
      tourCancellationTimer.cancel();
    });

    micrio.state.marker.subscribe((marker) => {
      if (marker) {
        tourCancellationTimer.reset();
        emit("marker-open");
      }
    });
  });

  element.addEventListener("marker-open", (e: any) => {
    gtm?.trackEvent({
      category: "Micrio",
      action: e.type,
      value: e.detail.title,
      label: [props.id, e.detail.title].join(" "),
    });
  });
});

watch(
  () => props.coordinates,
  (coordinates) => {
    const micrio = micrioRef.value;
    if (!micrio) return;

    // Ignore if there's a marker selected
    if (micrio.state.$marker) return;

    coordinates
      ? micrio.camera.flyToCoo(coordinates)
      : micrio.camera.flyToFullView();
  }
);

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
    :lang="lang"
    camspeed="3"
    controls="false"
    logo="false"
    toolbar="false"
    minimap="false"
    class="touch-events-none"
  />
  <slot
    :cancelTour="cancelTour"
    :nextMarker="() => changeStepBy(1)"
    :previousMarker="() => changeStepBy(-1)"
  ></slot>
</template>
