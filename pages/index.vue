<script setup>
const artworks = ref([]);
const animateFromIndex = ref(0);

const { data: response } = await useFetch("/api/v1/items", {
  query: {
    size: 10,
    "filter[has_image]": true,
  },
  transform: (res) => ({
    ...res,
    data: res.data.map(buildArtwork),
  }),
});

artworks.value = response.value.data;

const interval = ref();

onMounted(() => {
  interval.value = setInterval(() => {
    animateFromIndex.value += response.value.data.length;
    artworks.value = artworks.value.concat(response.value.data);
  }, 2000);
});
onUnmounted(() => {
  interval.value.clearInterval();
});
</script>

<template>
  <h1>Index page</h1>
  Toto je super: {{ artworks.length }}
  <div class="p-12">
    <masonry-wall
      :items="artworks"
      :ssr-columns="1"
      :column-width="300"
      :gap="16"
    >
      <template #default="{ item: a, index }">
        <Transition
          :appear="index >= animateFromIndex"
          enter-from-class="opacity-0 scale-50"
          enter-active-class="transition duration-500"
          enter-to-class="opacity-100 scale-100"
        >
          <div
            :style="`transition-delay: ${(index - animateFromIndex) * 100}ms`"
          >
            <NuxtLink :to="`/diela/${a.id}`">
              <img :src="a.content.thumbnail" />
            </NuxtLink>
            <h1>{{ a.content.title }}</h1>
            <span>{{ a.description }}</span>
          </div>
        </Transition>
      </template>
    </masonry-wall>
  </div>
</template>
