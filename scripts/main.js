'use strict';

const getUrl = (url, currUrl = '') => {
  if (url) {
    document.location.href = url;
  } else {
    document.location.href = currUrl ? 'error404.html' : 'pages/error404.html';
  }

};

function Slider() {

  this.sldrRoot = document.querySelector('.slider');

  this.sldrList =      this.sldrRoot.querySelector('.slider-list');
  this.sldrElements =  this.sldrList.querySelectorAll('.slider-element');
  this.sldrElemFirst = this.sldrList.querySelector('.slider-element');
  this.leftArrow =     this.sldrRoot.querySelector('div.slider-arrow-left');
  this.rightArrow =    this.sldrRoot.querySelector('div.slider-arrow-right');
  this.indicatorDots = this.sldrRoot.querySelector('div.slider-dots');

  // Initialization
  this.options = Slider.defaults;
  Slider.initialize(this)
}

Slider.defaults = {
  loop: true,    
  auto: true,     
  interval: 5000, 
  arrows: true,   
  dots: true     
};

Slider.prototype.elemPrev = function(num) {
  num = num || 1;

  let prevElement = this.currentElement;
  this.currentElement -= num;
  if(this.currentElement < 0) this.currentElement = this.elemCount-1;

  if(!this.options.loop) {
    if(this.currentElement == 0) {
      this.leftArrow.style.display = 'none'
    };
    this.rightArrow.style.display = 'block'
  };

  this.sldrElements[this.currentElement].style.opacity = '1';
  this.sldrElements[prevElement].style.opacity = '0';

  if(this.options.dots) {
    this.dotOn(prevElement); this.dotOff(this.currentElement)
  }
};

Slider.prototype.elemNext = function(num) {
  num = num || 1;

  let prevElement = this.currentElement;
  this.currentElement += num;
  if(this.currentElement >= this.elemCount) this.currentElement = 0;

  if(!this.options.loop) {
    if(this.currentElement == this.elemCount-1) {
      this.rightArrow.style.display = 'none'
    };
    this.leftArrow.style.display = 'block'
  };

  this.sldrElements[this.currentElement].style.opacity = '1';
  this.sldrElements[prevElement].style.opacity = '0';

  if(this.options.dots) {
    this.dotOn(prevElement); this.dotOff(this.currentElement)
  }
};

Slider.prototype.dotOn = function(num) {
  this.indicatorDotsAll[num].style.cssText = 'background-color:#BBB; cursor:pointer;'
};

Slider.prototype.dotOff = function(num) {
  this.indicatorDotsAll[num].style.cssText = 'background-color:#556; cursor:default;'
};

Slider.initialize = function(that) {
  that.elemCount = that.sldrElements.length; 

  that.currentElement = 0;
  let bgTime = getTime();

  function getTime() {
    return new Date().getTime();
  };
  function setAutoScroll() {
    that.autoScroll = setInterval(function() {
      let fnTime = getTime();
      if(fnTime - bgTime + 10 > that.options.interval) {
        bgTime = fnTime; that.elemNext()
      }
    }, that.options.interval)
  };

  if(that.elemCount >= 1) { 
    that.sldrElemFirst.style.opacity = '1';
  };

  if(that.options.auto) {
    setAutoScroll();
  };

  if(that.options.arrows) {
    that.leftArrow.addEventListener('click', function() {
      let fnTime = getTime();
      if(fnTime - bgTime > 1000) {
        bgTime = fnTime; that.elemPrev()
      }
    }, false);
    that.rightArrow.addEventListener('click', function() {
      let fnTime = getTime();
      if(fnTime - bgTime > 1000) {
        bgTime = fnTime; that.elemNext()
      }
    }, false)
  }

  if(that.options.dots) {
    let sum = '', diffNum;
    for(let i=0; i<that.elemCount; i++) {
      sum += '<span class="dot"></span>'
    };
    that.indicatorDots.innerHTML = sum;
    that.indicatorDotsAll = that.sldrRoot.querySelectorAll('span.dot');
    for(let n=0; n<that.elemCount; n++) {
      that.indicatorDotsAll[n].addEventListener('click', function() {
        diffNum = Math.abs(n - that.currentElement);
        if(n < that.currentElement) {
          bgTime = getTime(); that.elemPrev(diffNum)
        }
        else if(n > that.currentElement) {
          bgTime = getTime(); that.elemNext(diffNum)
        }
      }, false)
    };
    that.dotOff(0);  
    for(let i=1; i<that.elemCount; i++) {
      that.dotOn(i)
    }
  }
};

new Slider();