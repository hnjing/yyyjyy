'use strict';
let watermark = {};

let setWatermark = (str) => {
  let id = '1.23452384164.123412415';

  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id));
  }

  let can = document.createElement('canvas');
  can.width = 250;
  can.height = 150;

  let cans = can.getContext('2d');
  cans.rotate((-15 * Math.PI) / 150);
  cans.font = '18px Vedana';
  cans.fillStyle = 'rgba(0, 0, 0, .1)';
  cans.textAlign = 'left';
  cans.textBaseline = 'Middle';
  cans.fillText(str, can.width / 20, can.height);

  let div = document.createElement('div');
  div.id = id;
  div.style.pointerEvents = 'none';
  div.style.top = '100px';
  div.style.left = '0px';
  div.style.position = 'fixed';
  div.style.zIndex = '100000';
  div.style.opacity = '0.8';
  div.style.width = document.documentElement.clientWidth + 'px';
  div.style.height = document.documentElement.clientHeight + 'px';
  div.style.background =
    'url(' + can.toDataURL('image/png') + ') left top repeat';
  document.body.appendChild(div);
  return id;
};

// 该方法只允许调用一次
watermark.set = (str) => {
  let id = setWatermark(str);
  setInterval(() => {
    if (document.getElementById(id) === null) {
      id = setWatermark(str);
    }
  }, 500);
  window.onresize = () => {
    setWatermark(str);
  };
};

const outWatermark = (id) => {
  if (document.getElementById(id) !== null) {
    const div = document.getElementById(id);
    div.style.display = 'none';
  }
};
watermark.out = () => {
  const str = '1.23452384164.123412415';
  outWatermark(str);
};

export default watermark;
