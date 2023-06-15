<script setup lang="ts">
const showIntro = ref(true);

const introTimer = useTimer(5, () => (showIntro.value = true));

function onUpdate() {
  showIntro.value = false;
  introTimer.reset();
}
</script>

<template>
  <div class="bg-black absolute inset-0 flex">
    <div
      class="transition-all duration-[1500ms] flex items-end ease-in-out"
      :class="{ 'w-0': !showIntro, 'w-1/3': showIntro }"
    >
      <Transition
        appear
        enter-from-class="opacity-0 translate-y-24"
        enter-to-class="opacity-100"
        enter-active-class="transition-all duration-[2000ms] delay-1000 ease-out"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0 translate-y-24"
        leave-active-class="transition-all duration-500"
      >
        <div v-if="showIntro" class="mb-40 ml-20 whitespace-nowrap">
          <h1 class="text-white font-bold text-5xl">Záleží na detailoch</h1>
          <p class="text-white text-lg mt-2">
            Nechajte sa vtiahnuť do detailov umeleckých diel
          </p>
        </div>
      </Transition>
    </div>
    <div class="h-full w-full">
      <ClientOnly>
        <Micrio id="NwEkJ" v-slot="micrio" @update="onUpdate">
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
  </div>
</template>
