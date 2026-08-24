import { CloudOff, CloudUpload, Wifi } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function OfflineStatus() {
  const [online, setOnline] = useState(() => navigator.onLine);
  const [prepared, setPrepared] = useState(() => Boolean(navigator.serviceWorker?.controller));
  useEffect(() => {
    const goOnline = () => setOnline(true);
    const goOffline = () => setOnline(false);
    const ready = () => setPrepared(true);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    navigator.serviceWorker?.addEventListener('controllerchange', ready);
    navigator.serviceWorker?.ready.then(() => setPrepared(true)).catch(() => {});
    return () => { window.removeEventListener('online', goOnline); window.removeEventListener('offline', goOffline); navigator.serviceWorker?.removeEventListener('controllerchange', ready); };
  }, []);
  const state = !online ? 'offline' : prepared ? 'ready' : 'preparing';
  const Icon = state === 'offline' ? CloudOff : state === 'ready' ? Wifi : CloudUpload;
  const text = state === 'offline' ? '離線課堂模式' : state === 'ready' ? '已準備離線' : '正在準備離線';
  return <span className={`offline-status ${state}`} title={state === 'ready' ? '核心頁面及已載入課程可在網絡中斷時繼續使用。' : state === 'offline' ? '目前未連接網絡；已快取內容仍可使用。' : '請在課前保持網絡連接，等待核心課堂頁面完成快取。'}><Icon size={14} /> {text}</span>;
}
