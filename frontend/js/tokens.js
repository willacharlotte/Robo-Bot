let container = document.getElementById('game');
let id;
let offsets = {
  red: {
    x: document.getElementById('red').getBoundingClientRect().left,
    y: document.getElementById('red').getBoundingClientRect().top,
  },
  green: {
    x: document.getElementById('green').getBoundingClientRect().left,
    y: document.getElementById('green').getBoundingClientRect().top,
  },
  blue: {
    x: document.getElementById('blue').getBoundingClientRect().left,
    y: document.getElementById('blue').getBoundingClientRect().top,
  },
  purple: {
    x: document.getElementById('purple').getBoundingClientRect().left,
    y: document.getElementById('purple').getBoundingClientRect().top,
  },
  white: {
    x: document.getElementById('white').getBoundingClientRect().left,
    y: document.getElementById('white').getBoundingClientRect().top,
  },
  yellow: {
    x: document.getElementById('yellow').getBoundingClientRect().left,
    y: document.getElementById('yellow').getBoundingClientRect().top,
  },

  candlestick: {
    x: document.getElementById('candlestick').getBoundingClientRect().left,
    y: document.getElementById('candlestick').getBoundingClientRect().top,
  },
  knife: {
    x: document.getElementById('knife').getBoundingClientRect().left,
    y: document.getElementById('knife').getBoundingClientRect().top,
  },
  leadpipe: {
    x: document.getElementById('leadpipe').getBoundingClientRect().left,
    y: document.getElementById('leadpipe').getBoundingClientRect().top,
  },
  revolver: {
    x: document.getElementById('revolver').getBoundingClientRect().left,
    y: document.getElementById('revolver').getBoundingClientRect().top,
  },
  wrench: {
    x: document.getElementById('wrench').getBoundingClientRect().left,
    y: document.getElementById('wrench').getBoundingClientRect().top,
  },
  rope: {
    x: document.getElementById('rope').getBoundingClientRect().left,
    y: document.getElementById('rope').getBoundingClientRect().top,
  },
  gun: {
    x: document.getElementById('revolver').getBoundingClientRect().left,
    y: document.getElementById('revolver').getBoundingClientRect().top,
  },
};

container.addEventListener('click', getClickPosition);

function getClickPosition(e) {
  if (e.target.id != 'board') {
    id = e.target.id;
    clickItem = document.getElementById(id);
    console.log(
      clickItem.getBoundingClientRect().top,
      clickItem.getBoundingClientRect().left
    );
  } else {
    let parentPosition = getPosition(container);
    let xPosition = e.clientX - parentPosition.x - clickItem.clientWidth / 2;

    let yPosition = e.clientY - parentPosition.y - clickItem.clientHeight / 2;

    xPosition -= offsets[id].x;
    yPosition -= offsets[id].y;
    clickItem.style.left = xPosition + 'px';
    clickItem.style.top = yPosition + 'px';
  }
}

function getPosition(el) {
  let xPos = 0;
  let yPos = 0;

  while (el) {
    if (el.tagName == 'ARTICLE') {
      let xScroll = el.scrollLeft || document.documentElement.scrollLeft;
      let yScroll = el.scrollTop || document.documentElement.scrollTop;

      xPos = el.offsetLeft - xScroll + el.clientLeft;
      yPos = el.offsetTop - yScroll + el.clientTop;
    } else {
      xPos = el.offsetLeft - el.scrollLeft + el.clientLeft;
      yPos = el.offsetTop - el.scrollTop + el.clientTop;
    }

    el = el.offsetParent;
  }
  return {
    x: xPos,
    y: yPos,
  };
}
