<script setup lang="ts">
import type { Coords, HTMLMicrioElement, Models } from "Micrio";

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
const markerRef = ref<Models.ImageCultureData.Marker>();
const tourRef = ref<
  Models.ImageCultureData.MarkerTour | Models.ImageCultureData.VideoTour
>();
const isPopoverHidden = ref<Boolean>(false);
const previousMarkerId = ref<String>();

const handleTouchMove = () => {
  isPopoverHidden.value = true;
  const micrio = micrioRef.value;
  if (!(micrio && micrio.state.$marker)) return;
  const currentlySelectedId = micrio.state.$marker.id;
  if (!currentlySelectedId) return;
  const marker = document.getElementById(currentlySelectedId);
  if (!marker) return;
  marker.parentElement!.classList.remove("opened");
};

onMounted(() => {
  const element = document.querySelector("micr-io")!;
  micrioRef.value = document.querySelector("micr-io") as HTMLMicrioElement;
  const micrio = micrioRef.value;

  micrio.defaultSettings = {
    freeMove: false,
    _markers: {
      noTitles: true,
      autoStartTour: true,
    },
  };

  element.addEventListener("show", (e: any) => {
    const markerTour = micrio.$current.$data.markerTours![0].steps;
    const markers = document.querySelectorAll("button.micrio-marker");

    markers.forEach((e) => {
      e.innerHTML = `<div>${(markerTour.indexOf(e.id) + 1).toString()}</div>`;
    });

    if (props.coordinates) {
      // Ignore if there's a marker selected
      if (micrio.state.$marker) return;

      micrio.camera.flyToCoo(props.coordinates);
    }

    micrio.state.tour.subscribe((tour) => {
      tourRef.value = tour;
      if (tour) {
        emit("tour-started");
        tourCancellationTimer.reset();
        return;
      }

      emit("tour-stop");
      tourCancellationTimer.cancel();
    });

    if (micrio.state.marker) {
      markers.forEach((element) => {
        element.addEventListener("click", () => {
          if (micrio.state.$marker.id === element.id) {
            if (
              previousMarkerId.value === element.id &&
              isPopoverHidden.value === false
            ) {
              isPopoverHidden.value = true;
              element.parentElement!.classList.remove("opened");
            } else {
              element.parentElement!.classList.add("opened");
              isPopoverHidden.value = false;
            }
            previousMarkerId.value = element.id;
          }
        });
      });
    }

    micrio.state.marker.subscribe((marker) => {
      markerRef.value = marker;
      if (marker) {
        tourCancellationTimer.reset();
        emit("marker-open");
      }
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
  const tour = micrioRef.value?.state.$tour;
  if (!tour) return;
  if (!("goto" in tour && tour.goto)) return;

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
  <div class="h-full" @touchmove="handleTouchMove">
    <micr-io
      :id="id"
      :lang="lang"
      camspeed="3"
      controls="false"
      logo="false"
      toolbar="false"
      minimap="false"
    />
  </div>
  <slot
    :cancelTour="cancelTour"
    :nextMarker="() => changeStepBy(1)"
    :previousMarker="() => changeStepBy(-1)"
    :isPopoverHidden="isPopoverHidden"
    :markerRef="markerRef"
    :tourRef="tourRef"
  ></slot>
</template>
