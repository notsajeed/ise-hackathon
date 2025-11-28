const HydrationService = (() => {
  let timer: any = null
  let intervalMin = 20
  let onNotify: (n: any) => void = () => {}

  function start(mins = intervalMin) {
    stop()
    intervalMin = mins
    timer = setInterval(() => notify(), intervalMin * 60_000)
  }
  function stop() { if (timer) clearInterval(timer); timer = null }
  function notify() { onNotify({ title: 'Hydration reminder', body: 'Time to drink water 💧' }) }
  function setCallback(cb: (n: any) => void) { onNotify = cb }

  return { start, stop, setCallback }
})()
export default HydrationService
