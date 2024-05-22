export default function(id: string) {
  const { pending, data } = useLazyFetch('/chat/info', {
    method: 'post',
    body: { watchurl: id },
    initialCache: false
  });
  const nickname = ref('');

  async function postMessage(message: string) {
    const data: ChatSendResponse = await $fetch('/chat/send', {
      method: 'post',
      body: {
        watchurl: id,
        msg: message,
        nick: unref(nickname)
      }
    });

    if (!data.success && data.msg)
      console.log(data);

    return data;
  }

  return { pending, info: data, nickname, postMessage };
}