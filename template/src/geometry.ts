// 브라우저 창 크기. BrowserFrame과 장면 축소 비율이 같은 값을 쓴다.
export const BROWSER = { width: 1600, height: 920, bar: 72, border: 1 };
export const BROWSER_SCALE = (BROWSER.height - 2 * BROWSER.border - BROWSER.bar) / 1080;
// 주소 바에 표시할 글자. 스튜디오가 영상을 만들 때 요청서의 값으로 바꾼다. 비어 있으면 표시하지 않는다.
export const ADDRESS: string = "";
