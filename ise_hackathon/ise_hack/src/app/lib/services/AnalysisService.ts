type Landmark = { name: string; x: number; y: number }
type Alert = { level?: 'warning' | 'critical'; title: string; message: string } | null

const AnalysisService = (() => {
  let subscribers: ((a: Alert) => void)[] = []
  let state = {
    neckAngle: 0,
    torsoAngle: 0,
    shoulderForwardness: 0,
    ema: { neckAngle: 0, torsoAngle: 0, shoulderForwardness: 0 },
    lastAlertAt: 0,
    snoozedUntil: 0,
    sustained: { neck: 0, torso: 0 }
  }
  const ALPHA = 0.25

  function onAlert(cb: (a: Alert) => void) {
    subscribers.push(cb)
    return () => { subscribers = subscribers.filter(s => s !== cb) }
  }
  function emitAlert(alert: Alert) { subscribers.forEach(cb => cb(alert)) }

  function compute(landmarks: Landmark[] | null) {
    if (!landmarks) return null
    const find = (n: string) => landmarks.find(l => l.name === n) || null
    const nose = find('nose'), lS = find('left_shoulder'), rS = find('right_shoulder'), lH = find('left_hip'), rH = find('right_hip')
    if (!nose || !lS || !rS || !lH || !rH) return null
    const shoulderMid = { x: (lS.x + rS.x) / 2, y: (lS.y + rS.y) / 2 }
    const hipMid = { x: (lH.x + rH.x) / 2, y: (lH.y + rH.y) / 2 }
    const neckVec = { x: nose.x - shoulderMid.x, y: nose.y - shoulderMid.y }
    const torsoVec = { x: shoulderMid.x - hipMid.x, y: shoulderMid.y - hipMid.y }
    const angleDeg = (v: {x:number;y:number}) => {
      const dot = v.y
      const mag = Math.sqrt(v.x*v.x + v.y*v.y)
      if (mag === 0) return 0
      const cos = dot / mag
      const rad = Math.acos(Math.max(-1, Math.min(1, cos)))
      return rad * (180/Math.PI)
    }
    const neckAngle = angleDeg(neckVec)
    const torsoAngle = angleDeg(torsoVec)
    const shoulderForwardness = shoulderMid.x - hipMid.x
    return { neckAngle, torsoAngle, shoulderForwardness }
  }

  function smoothAndStore(metrics: any) {
    for (const k of ['neckAngle','torsoAngle','shoulderForwardness']) {
      const v = metrics[k]
      // @ts-ignore
      state.ema[k] = ALPHA * v + (1-ALPHA) * state.ema[k]
    }
    state.neckAngle = state.ema.neckAngle
    state.torsoAngle = state.ema.torsoAngle
    state.shoulderForwardness = state.ema.shoulderForwardness
  }

  function updateSustained(metrics: any, dtSeconds = 0.2) {
    state.sustained.neck = (metrics.neckAngle > 15) ? state.sustained.neck + dtSeconds : 0
    state.sustained.torso = (metrics.torsoAngle > 12) ? state.sustained.torso + dtSeconds : 0
  }

  function decision() {
    const now = Date.now()
    if (now < state.snoozedUntil) return
    if (state.neckAngle > 20 && state.sustained.neck > 15 && (now - state.lastAlertAt) > 30_000) {
      state.lastAlertAt = now
      emitAlert({ level: 'critical', title: 'Forward head detected', message: `Neck: ${Math.round(state.neckAngle)}° — sit back and raise screen.` })
    } else if (state.torsoAngle > 12 && state.sustained.torso > 15 && (now - state.lastAlertAt) > 30_000) {
      state.lastAlertAt = now
      emitAlert({ level: 'warning', title: 'Slouching', message: `Torso lean: ${Math.round(state.torsoAngle)}°. Straighten your back.` })
    }
  }

  function consume(landmarks: Landmark[] | null) {
    const metrics = compute(landmarks)
    if (!metrics) return
    smoothAndStore(metrics)
    updateSustained(metrics)
    decision()
    // local log (lightweight)
    try {
      const logs = JSON.parse(localStorage.getItem('posture_logs') || '[]')
      logs.push({ t: Date.now(), neck: state.neckAngle, torso: state.torsoAngle })
      if (logs.length > 500) logs.splice(0, logs.length - 500)
      localStorage.setItem('posture_logs', JSON.stringify(logs))
    } catch (e) {}
  }

  function getLatestSnapshot() {
    const label = state.neckAngle > 20 ? 'forward_head' : (state.torsoAngle > 12 ? 'slouch' : 'ok')
    const confidence = Math.min(1, (state.neckAngle + state.torsoAngle) / 100)
    return { postureLabel: label, confidence, durationSeconds: Math.round(Math.max(state.sustained.neck, state.sustained.torso)) }
  }

  function snooze(sec: number) { state.snoozedUntil = Date.now() + sec*1000 }
  function acknowledge() { emitAlert(null) }

  return { consume, onAlert, snooze, acknowledge, getLatestSnapshot }
})()

export default AnalysisService
