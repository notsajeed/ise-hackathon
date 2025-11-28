const CameraService = (() => {
  let stream: MediaStream | null = null
  async function startCamera() {
    if (stream) return stream
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false })
    return stream
  }
  function stopCamera() {
    if (!stream) return
    stream.getTracks().forEach(t => t.stop())
    stream = null
  }
  return { startCamera, stopCamera }
})()
export default CameraService
