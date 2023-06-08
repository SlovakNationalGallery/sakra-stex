<template>
  <ClientOnly>
    <div class="relative w-100 h-screen">
      <Micrio id="NwEkJ" v-slot="micrio">
        <div class="absolute inset-x-0 bottom-0 flex justify-center p-12">
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
              class="w-60 h-24 bg-green-500 grid grid-cols-3 p-2 gap-2"
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
    </div>
  </ClientOnly>
</template>
