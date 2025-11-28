const StorageService = (()=> {
  function get(key: string) {
    try { return JSON.parse(localStorage.getItem(key) || 'null') } catch { return null }
  }
  function set(key: string, val: any) {
    try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
  }
  return { get, set }
})()
export default StorageService
