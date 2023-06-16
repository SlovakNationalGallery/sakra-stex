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
  <div class="bg-black absolute inset-0 overflow-hidden">
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
            class="absolute inset-x-0 bottom-0 flex justify-center p-12 pointer-events-none overflow-hidden"
          >
            <Transition
              enter-from-class="opacity-0 translate-y-24"
              enter-to-class="opacity-100"
              enter-active-class="transition-all duration-500"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0 translate-y-24"
              leave-active-class="transition-all duration-500"
            >
              <div
                v-if="micrio.tour"
                class="w-60 h-24 bg-green-500 grid grid-cols-3 p-2 gap-2 pointer-events-auto"
              >
                <button
                  class="bg-black text-white"
                  @click="micrio.previousMarker"
                >
                  &lt;
                </button>
                <button class="bg-black text-white" @click="micrio.cancelTour">
                  x
                </button>
                <button class="bg-black text-white" @click="micrio.nextMarker">
                  &gt;
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
        class="absolute bottom-20 left-20 whitespace-nowrap shadow-sm"
      >
        <h1 class="text-white font-bold text-5xl drop-shadow-lg">
          Záleží na detailoch
        </h1>
        <p class="text-white text-lg mt-2 drop-shadow-lg">
          Nechajte sa vtiahnuť do detailov umeleckých diel
        </p>
      </div>
    </Transition>
  </div>
</template>
