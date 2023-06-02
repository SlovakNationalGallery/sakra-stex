<script setup lang="ts">
import type { HTMLMicrioElement } from "Micrio";

const { id } = defineProps(["id"]);
useHead({
  title: "Micrio",
  script: [{ src: "https://b.micr.io/micrio-4.1.min.js" }],
});

const micrio = ref<HTMLMicrioElement>();

onMounted(() => {
  document.querySelector("micr-io")!.addEventListener("show", () => {
    micrio.value = document.querySelector("micr-io") as HTMLMicrioElement;
  });
  document
    .querySelector("micr-io")!
    .addEventListener("marker-open", (e: any) => {
      // Clicking on a marker also opens its tour
      const markerId = e.detail.id as string;
      const tour = micrio.value!.$current.$data.markerTours[0];
      const tourStep = tour.steps.findIndex((step) => step === markerId);
      micrio.value!.state.tour.set({ ...tour, currentStep: tourStep });
    });
});
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
</template>
