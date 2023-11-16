<script setup lang="ts">
import type { Micrio } from "./components/Micrio.vue";

useHead({
  // Do not index for now
  meta: [{ name: "robots", content: "noindex" }],
});

const strings = {
  sk: {
    title: "Na detailoch záleží",
    tagline: "Preskúmajte reliéf Adorácie Ježiša zblízka",
  },
  en: {
    title: "Details matter",
    tagline: "Explore the relief of the Adoration of Jesus up close",
  },
};

const cameraPreset = ref<"intro" | "zoom-out" | null>(null);
const micrio = ref<Micrio["Instance"]>();

const lang = ref<"en" | "sk">("sk");

const inactivityTimer = useTimer(60000, () => {
  micrio.value?.tour?.cancel();
  cameraPreset.value = "zoom-out";
  showIntroTimer.reset();
});
// // Show intro after timeout if no marker is selected
const showIntroTimer = useTimer(5000, () => {
  cameraPreset.value = "intro";
});

onMounted(() => {
  //Prevent right-click actions
  document.addEventListener("contextmenu", (e) => e.preventDefault());
});

function onMicrioShow($event: Micrio["Instance"]) {
  micrio.value = $event;
  const markerTour = $event.$current.$data?.markerTours?.[0];
  if (!markerTour) return;
  const markers = document.querySelectorAll("button.micrio-marker");
  markers.forEach((e) => {
    e.innerHTML = `<div>${(
      markerTour.steps!.indexOf(e.id) + 1
    ).toString()}</div>`;
  });
}

watch(micrio, (micrio, oldMicrio) => {
  if (!micrio) return;

  // Initialization
  if (!oldMicrio && micrio) {
    cameraPreset.value = "intro";
  }

  // Reset camera on navigation
  if (micrio.events.isNavigating) {
    micrio.tour?.cancel();
    return;
  }

  if (micrio.tour) {
    cameraPreset.value = null;
  }

  inactivityTimer.reset();
  showIntroTimer.cancel();
});

watch(cameraPreset, (preset) => {
  if (preset === "intro") {
    micrio.value?.camera.flyToCoo([0.06, 0.5]);
  }

  if (preset === "zoom-out") {
    micrio.value?.camera.flyToFullView();
  }
});

const showLangSwitch = computed(() => {
  return cameraPreset.value === "intro" || cameraPreset.value === "zoom-out";
});

// Micrio only emits tour-started when the camera has settled
// so we use marker-open as a proxy event
function onMarkerOpen() {
  cameraPreset.value = null;
}

function onMicrioError(e) {
  console.log(e);
  //window.location.reload();
}
</script>

<template>
  <div class="bg-black absolute inset-0 overflow-hidden font-body select-none">
    <div class="h-full w-full">
      <ClientOnly>
        <NuxtErrorBoundary @error="onMicrioError">
          <Micrio
            id="aYdqm"
            :lang="lang"
            v-slot="controls"
            @show="onMicrioShow"
            @update="micrio = $event"
            @marker-open="onMarkerOpen"
          >
            <!-- Controls -->
            <div
              class="absolute inset-x-0 bottom-0 flex justify-end p-16 pointer-events-none overflow-hidden"
            >
              <Transition
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                enter-active-class="transition-all duration-200 ease-out"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
                leave-active-class="transition-all duration-100 ease-in"
              >
                <div
                  v-if="micrio?.tour && micrio.marker"
                  class="p-6 bg-white rounded-xl border-2 border-black w-[32rem]"
                >
                  <div
                    class="flex gap-4 pointer-events-auto items-center justify-between pb-5 pt-2"
                  >
                    <button @click="controls.previousMarker">
                      <img src="~/assets/img/arrow-left.svg" />
                    </button>
                    <div class="text-2xl font-bold">
                      <span>{{ (micrio.tour.currentStep ?? 0) + 1 }}. </span>
                      <span>{{ micrio.marker.title }}</span>
                    </div>
                    <button @click="controls.nextMarker">
                      <img
                        src="~/assets/img/arrow-left.svg"
                        class="rotate-180"
                      />
                    </button>
                  </div>
                  <div v-html="micrio.marker.body" class="text-xl" />
                </div>
              </Transition>
            </div>
          </Micrio>
        </NuxtErrorBoundary>
      </ClientOnly>
    </div>

    <!-- Intro text -->
    <Transition
      appear
      enter-from-class="opacity-0 translate-y-24"
      enter-to-class="opacity-100"
      enter-active-class="transition-all duration-[2000ms] delay-1000 ease-out"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 translate-y-full"
      leave-active-class="transition-all duration-500"
    >
      <div
        v-if="cameraPreset === 'intro'"
        class="absolute bottom-32 left-32 whitespace-nowrap"
      >
        <Transition
          appear
          mode="out-in"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          enter-active-class="transition-opacity duration-300 delay-300 ease-out"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
          leave-active-class="transition-opacity duration-300"
        >
          <div :key="lang">
            <h1
              class="text-white font-bold text-[4.5rem] drop-shadow-lg font-display"
            >
              {{ strings[lang].title }}
            </h1>
            <p class="text-white text-2xl drop-shadow-sm">
              {{ strings[lang].tagline }}
            </p>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Lang switcher -->
    <Transition
      appear
      enter-from-class="opacity-0 translate-y-12"
      enter-to-class="opacity-100"
      enter-active-class="transition-all duration-300 delay-200 ease-out"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 translate-y-12"
      leave-active-class="transition-all duration-300"
    >
      <div v-if="showLangSwitch" class="absolute top-0 right-0">
        <button
          class="text-white font-display text-3xl uppercase p-12"
          @click="lang = lang === 'sk' ? 'en' : 'sk'"
        >
          {{ lang }}
        </button>
      </div>
    </Transition>
  </div>
</template>
