<script setup lang="ts">
import gsap from "gsap";
import { pulsatingMarkersTimeline } from "./pulsatingMarkersTimeline";

const marker = ref();
const props = defineProps<{ open: boolean }>();
const pulseTimeline = gsap.timeline();

onMounted(() => {
  pulseTimeline
    .to(marker.value, {
      height: "3.5rem",
      width: "3.5rem",
      backgroundColor: "black",
      color: "white",
      opacity: 1,
      ease: "power1.out",
      duration: 0.3,
    })
    .to(marker.value, {
      height: "2rem",
      width: "2rem",
      backgroundColor: "black",
      color: "white",
      opacity: 0.2,
      duration: 1,
    })
    .repeat(-1);

  pulsatingMarkersTimeline.add(pulseTimeline, 0);
});

watch(
  () => props.open,
  (open) => {
    if (open) {
      pulseTimeline.pause();
      gsap.to(marker.value, {
        height: "3.5rem",
        width: "3.5rem",
        backgroundColor: "white",
        color: "black",
        opacity: 1,
      });
      return;
    }

    pulseTimeline.resume(pulsatingMarkersTimeline.time());
  },
);
</script>

<template>
  <div>
    <div
      ref="marker"
      class="h-8 w-8 rounded-full border-2 border-white bg-black opacity-0"
    ></div>
    <div class="absolute text-xl" :class="open ? 'text-black' : 'text-white'">
      <slot />
    </div>
  </div>
</template>
