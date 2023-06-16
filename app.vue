<script setup lang="ts">
useHead({
  // Do not index for now
  meta: [{ name: "robots", content: "noindex" }],
});

const showIntro = ref(true);
const showIntroTimer = useTimer(15000, () => (showIntro.value = true));

function onUpdate({ tour }: { tour?: Object }) {
  showIntro.value = false;
  if (tour) showIntroTimer.reset();
}
</script>

<template>
  <div class="bg-black absolute inset-0 overflow-hidden font-body">
    <div class="h-full w-full">
      <ClientOnly>
        <Micrio
          :cancel-tour-after-ms="10000"
          id="NwEkJ"
          v-slot="micrio"
          @update="onUpdate"
        >
          <!-- Controls -->
          <div
            class="absolute inset-x-0 bottom-0 flex justify-end p-16 pointer-events-none overflow-hidden"
          >
            <Transition
              enter-from-class="opacity-0 translate-y-24"
              enter-to-class="opacity-100"
              enter-active-class="transition-all duration-500 ease-out"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0 translate-y-24"
              leave-active-class="transition-all duration-500 ease-in"
            >
              <div
                v-if="micrio.tour"
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
        </Micrio>
      </ClientOnly>
    </div>

    <!-- Intro text -->
    <Transition
      appear
      enter-from-class="opacity-0 translate-y-24"
      enter-to-class="opacity-100"
      enter-active-class="transition-all duration-[2000ms] delay-1000 ease-out"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0 translate-y-24"
      leave-active-class="transition-all duration-500"
    >
      <div
        v-if="showIntro"
        class="absolute bottom-32 left-32 whitespace-nowrap"
      >
        <h1
          class="text-white font-bold text-[4.5rem] drop-shadow-lg font-display"
        >
          Záleží na detailoch
        </h1>
        <p class="text-white text-2xl mt-2 drop-shadow-sm">
          Nechajte sa vtiahnuť do detailov umeleckých diel
        </p>
      </div>
    </Transition>
  </div>
</template>
