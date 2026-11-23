/**
 * 只給截圖用：以 `node --import ./scripts/fake-clock.mjs` 載入，讓伺服器的「現在」從 FAKE_NOW 開始走，
 * 這樣首頁與車站看板在任何時間截圖都有一整天的班次。不影響正式程式碼。
 */
const fixed = Date.parse(process.env.FAKE_NOW ?? '');
if (!Number.isNaN(fixed)) {
  const RealDate = Date;
  const realNow = RealDate.now.bind(RealDate);
  const start = realNow();
  const now = () => fixed + (realNow() - start);
  RealDate.now = now;
  // Proxy 保留 Date.UTC / Date.parse 等靜態方法，只改掉「沒有參數的 new Date()／Date()」
  globalThis.Date = new Proxy(RealDate, {
    construct: (target, args, newTarget) => Reflect.construct(target, args.length ? args : [now()], newTarget),
    apply: (target, thisArg, args) => (args.length ? Reflect.apply(target, thisArg, args) : new RealDate(now()).toString()),
  });
}
