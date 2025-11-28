/** Stubbed PoseService. Replace with MediaPipe/BlazePose integration. */
type Landmark = { name: string; x: number; y: number }

const PoseService = (() => {
  let initialized = false
  async function init() {
    // load model here (swap in real model)
    initialized = true
  }
  async function estimate(videoEl: HTMLVideoElement): Promise<Landmark[] | null> {
    if (!initialized) return null
    // mock normalized landmarks (x/y in 0..1)
    return [
      { name: 'nose', x: 0.5, y: 0.18 },
      { name: 'left_shoulder', x: 0.42, y: 0.38 },
      { name: 'right_shoulder', x: 0.58, y: 0.38 },
      { name: 'left_hip', x: 0.46, y: 0.72 },
      { name: 'right_hip', x: 0.54, y: 0.72 }
    ]
  }
  return { init, estimate }
})()
export default PoseService
