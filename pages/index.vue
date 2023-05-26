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
  <ul>
    <li v-for="a in artworks">
      <NuxtLink :to="`/diela/${a.id}`">
        <img :src="a.content.thumbnail" width="80" />
        {{ a.content.title }}
      </NuxtLink>
    </li>
  </ul>
</template>
