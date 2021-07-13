'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');
const tabsContainer = document.querySelector('.operations__tab-container');
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const allSections = document.querySelectorAll('.section');
const imgTargets = document.querySelectorAll('img[data-src]'); // to get only the images, for which img has to changed--with data src attribute

const openModal = function (e) {
  e.preventDefault(); // prevent the default behaviour of going  top
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal)); // open modal)(nodelist)
//console.log(btnsOpenModal);
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// to scroll to section 1 when clicked on learnmore--smooth scrolling

btnScrollTo.addEventListener('click', function (e) {
  //const s1coords = section1.getBoundingClientRect();
  //console.log(s1coords);
  // console.log(e.target.getBoundingClientRect());
  //console.log('Current scroll (X/Y)', window.pageXOffset, window.pageYOffset);

  section1.scrollIntoView({ behaviour: 'smooth' });
});

////////////////////////////////////////////
/////page Navigation with event delegation

//add event listener to parent element
//determine the delegation elemnt(target element)
//

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault(); // prevent the default behavior of scrolling to the hyperlink

  //console.log(e.target.classList);

  ////////////////matching criteria to check only for the target element.

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    // console.log(e.target.getAttribute('href'));
    // console.log(e.target);
    // console.log(document.querySelector(id));
    document.querySelector(id).scrollIntoView({ behaviour: 'smooth' });
  }
});

/////////////// getting tabbed content ///

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab'); //check the closest of the clicked element(because of the number elemnt span )

  if (!clicked) return; // to check if its clicked only on the tabs .,else return

  // removing and adding active class
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');
  //console.log(clicked);

  //adding acontent and removing other tabs content--activating content area
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

///////////////////////////////////////

//////menu fade animation

//console.log(nav);

const handleHover = function (e, opacity) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    //console.log(link);
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('.nav__logo');
    //console.log(logo);
    // fade all the siblings ,check for the mouseover item before that .
    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });

    logo.style.opacity = this; // fade the image
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5)); // bind returns a function which is inturned passed as callbackfuncti
nav.addEventListener('mouseout', handleHover.bind(1));

/////////////////////////////////////////////////////////////////////////

////sticky navigation using intersection API//

//console.log(header);
//console.log(navHeight);

const stickyNav = function (
  entries //  entries.. threshold arry/values
) {
  const [entry] = entries;
  //console.log(entry);

  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky'); // add and remove sticky class based on header intersecting the viewport
};

////const Observer = new IntersectionObserver(callbackfuntion,parameters)

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `${navHeight}px`,
});

headerObserver.observe(header);
////////////////

///// revealing sections ///

//console.log(allSections);

const revealSection = function (entries, observer) {
  const [entry] = entries;
  //console.log(entry.target);
  if (!entry.isIntersecting) return;
  else entry.target.classList.remove('section--hidden'); // reveal the section (classs) based on target value(section)
  observer.unobserve(entry.target); // to unabsorve th target later
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section); // to observer on all the sections
  section.classList.add('section--hidden');
});
/////////////////////////////////////////////////

/////lazy image loading/////////

//console.log(imgTargets);

const loadImg = function (entries, observer) {
  const [entry] = entries;
  //console.log(entry);
  if (!entry.isIntersecting) return;
  else {
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load', function (e) {
      entry.target.classList.remove('lazy-img'); // done through eventlistener, for network performace on loading images
    });
    observer.unobserve(entry.target); // stop observing the img load
  }
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(image => imgObserver.observe(image));
///////////////////////////////////////

///////////////////////////////////////
// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
