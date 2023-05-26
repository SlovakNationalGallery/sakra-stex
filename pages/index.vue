<script setup>
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

const artworks = response.value.data;
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
          appear
          enter-from-class="opacity-0 scale-50"
          enter-active-class="transition duration-500"
          enter-to-class="opacity-100 scale-100"
        >
          <div>
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
