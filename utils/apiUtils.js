export function buildArtwork(apiResponse) {
  return {
    ...apiResponse,
    content: {
      ...apiResponse.content,
      thumbnail: `https://www.webumenia.sk/dielo/nahlad/${apiResponse.id}/600`,
    },
  };
}
