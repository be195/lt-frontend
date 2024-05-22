export default function(peertoken: string) {
  const connection = new RTCPeerConnection();
  const connectionReference = ref(connection);

  connection.addTransceiver('audio');
  connection.addTransceiver('video');

  async function lazy() {
    const offer = await connection.createOffer({ iceRestart: true });
    offer.sdp = offer.sdp.replace('useinbandfec=1', 'useinbandfec=1; stereo=1');
    connection.setLocalDescription(offer);

    const data = await $fetch('/sst/watch/peercon', {
      method: 'post',
      body: { offer, token: peertoken }
    });
    connection.setRemoteDescription(data.sdp);
  }

  lazy();

  return connectionReference;
}
