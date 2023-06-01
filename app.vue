<script setup>
const { data: tileSources } = await useFetch(
  "http://imi.sng.cust.eea.sk/publicIS/fcgi-bin/iipsrv.fcgi?IIIF=/SNGFOTOFRESHFILM/X100/SNG--P_53--1_9--2015_07_30--L2_WEB.jp2/info.json"
);
</script>

<template>
  <ClientOnly>
    <ZoomViewer :tile-sources="tileSources" />
  </ClientOnly>
</template>
