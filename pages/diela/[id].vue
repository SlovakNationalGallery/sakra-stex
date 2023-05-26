<script setup>
const route = useRoute();

const { data: item } = await useFetch(`/api/v1/items/${route.params.id}`, {
  transform: buildArtwork,
});
</script>

<template>
  <h1>{{ item.content.title }}</h1>
  <img :src="item.content.thumbnail" />
</template>
