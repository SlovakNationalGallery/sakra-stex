<script setup lang="ts">
useHead({
  // Do not index for now
  meta: [{ name: "robots", content: "noindex" }],
});

const tourRunning = ref(false);
const showIntro = ref(true);
const showLangSwitch = ref(true);

const lang = ref("sk");
// Show intro after timeout if no marker is selected
const showIntroTimer = useTimer(5000, () => (showIntro.value = true));

watch(tourRunning, (tourRunning) => {
  if (tourRunning) {
    showIntro.value = false;
    showIntroTimer.cancel();
    return;
  }

  if (!tourRunning) {
    showIntroTimer.reset();
    showLangSwitch.value = true;
    return;
  }
});

// Micrio only emits tour-started when the camera has settled
// so we use marker-open as a proxy event
function onMarkerOpen() {
  showIntro.value = false;
  showLangSwitch.value = false;
}

function onMicrioError() {
  window.location.reload();
}
</script>

<template>
  <div class="bg-black absolute inset-0 overflow-hidden font-body">
    <div class="h-full w-full">
      <ClientOnly>
        <NuxtErrorBoundary @error="onMicrioError">
          <Micrio
            id="aYdqm"
            :cancel-tour-after-ms="20000"
            :lang="lang"
            :coordinates="showIntro ? [0.06, 0.5] : undefined"
            v-slot="micrio"
            @marker-open="onMarkerOpen"
            @tour-started="tourRunning = true"
            @tour-stop="tourRunning = false"
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
                  v-if="tourRunning"
                  class="p-4 bg-white grid grid-cols-3 rounded-[5rem] gap-4 pointer-events-auto drop-shadow-lg shadow-black/70"
                >
                  <button
                    class="w-14 h-14 bg-black/5 active:bg-black/10 flex items-center justify-center rounded-full"
                    @click="micrio.cancelTour"
                  >
                    <img src="~/assets/img/x-mark.svg" />
                  </button>
                  <button
                    class="w-14 h-14 bg-black/5 active:bg-black/10 flex items-center justify-center rounded-full"
                    @click="micrio.previousMarker"
                  >
                    <img src="~/assets/img/arrow-left.svg" />
                  </button>
                  <button
                    class="w-14 h-14 bg-black/5 active:bg-black/10 flex items-center justify-center rounded-full"
                    @click="micrio.nextMarker"
                  >
                    <img src="~/assets/img/arrow-left.svg" class="rotate-180" />
                  </button>
                </div>
              </Transition>
            </div>

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
              <div v-if="showLangSwitch" class="hidden absolute top-0 right-0">
                <button
                  class="text-white font-display text-3xl uppercase p-12"
                  @click="lang = lang === 'sk' ? 'en' : 'sk'"
                >
                  {{ lang }}
                </button>
              </div>
            </Transition>
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
        v-if="showIntro"
        class="absolute bottom-32 left-32 whitespace-nowrap"
      >
        <h1
          class="text-white font-bold text-[4.5rem] drop-shadow-lg font-display"
        >
          Na detailoch záleží
        </h1>
        <p class="text-white text-2xl drop-shadow-sm">
          Nechajte sa vtiahnuť do detailov umeleckých diel
        </p>
      </div>
    </Transition>
  </div>
</template>
