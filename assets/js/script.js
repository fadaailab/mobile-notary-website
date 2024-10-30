(function () {
    window.addEventListener("load", () => {
        // const preloader = document.querySelector(".mn-preloader");
        // preloader.classList.add("hide");

        // // Ensure preloader is fully hidden after the animation
        // setTimeout(() => {
        //     preloader.style.display = "none";
        // }, 500);

        // Start the typing effect
        const dynamicText = document.querySelector(".mn-stats__header span");
        const words = ["nümunə mətn", "bəlkə bir az yavaşlayaq"];
        dynamicText && typeEffect(dynamicText, words);
    });

    // Add hover animations to section headers
    const sectionHeaders = document.querySelectorAll('.section__header__content');

    sectionHeaders?.forEach(sectionHeader => {
        sectionHeader.addEventListener('mouseenter', () => {
            const highlight = sectionHeader.querySelector('.mn-highlight');
            const dot = sectionHeader.querySelector('.mn-dot');

            // Remove animation class once the animation ends
            if (highlight) {
                highlight.classList.add('start-animation');
                highlight.addEventListener('animationend', () => {
                    highlight.classList.remove('start-animation');
                }, { once: true });
            }
            if (dot) {
                dot.classList.add('start-animation');
                dot.addEventListener('animationend', () => {
                    dot.classList.remove('start-animation');
                }, { once: true });
            }
        });
    });

    // Typing effect for the dynamic text
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    // Initialize Typing effect
    const typeEffect = (dynamicText, words) => {
        const currentWord = words[wordIndex];
        const currentChar = currentWord.substring(0, charIndex);
        dynamicText.textContent = currentChar;

        // Determine typing or deleting behavior
        if (!isDeleting && charIndex < currentWord.length) {
            charIndex++;
            setTimeout(() => typeEffect(dynamicText, words), 200)
        } else if (isDeleting && charIndex > 0) {
            charIndex--;
            setTimeout(() => typeEffect(dynamicText, words), 100)
        } else {
            // Switch between typing and deleting mode
            isDeleting = !isDeleting;
            wordIndex = !isDeleting ? (wordIndex + 1) % words.length : wordIndex;
            setTimeout(() => typeEffect(dynamicText, words), 800)
        }
    };

    // Initialize odometers for different stat cards
    const attorneyOdometer = document.querySelector(".mn-stats__card--attorney .mn-stats__card__count");
    attorneyOdometer && createOdometer(attorneyOdometer, 298020);

    const applicationOdometer = document.querySelector(".mn-stats__card--application .mn-stats__card__count");
    applicationOdometer && createOdometer(applicationOdometer, 594912);

    // Get the header element and its offset height
    const header = document.querySelector('.header');
    const offset = header.offsetHeight;

    // Function to handle scroll events
    const handleScroll = () => {
        const scrollTop = window.scrollY;

        // Check for scroll position to add/remove the 'fixed' class
        if (scrollTop > offset / 2) {
            header.classList.add('fixed');
            // document.body.style.paddingTop = offset + 'px';
        } else {
            header.classList.remove('fixed');
            // document.body.style.paddingTop = 0 + 'px';
        }
    };

    // Attach the scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Initial check on page load
    if (window.scrollY > offset) {
        header.classList.add('fixed');
    }

    const menuTriggerButtons = document.querySelectorAll('.mn-btn--menu-toggle')

    menuTriggerButtons?.forEach((button) => {
        button.addEventListener('click', () => {
            document.querySelector('.header__menu').classList.toggle('show');
        })
    })



    // Initialize Swiper for the 'How it works' section
    const swiperHowItWorks = new Swiper(".swiper--how-it-works", {
        slidesPerView: "auto",
        spaceBetween: 16,
        freeMode: true,
    });

    // Initialize Swiper for the 'Blogs' section
    const swiperFeaturedBlogs = new Swiper(".swiper--top-blogs", {
        pagination: {
            el: ".mn-swiper__pagination",
            type: "fraction",
            formatFractionCurrent: function (number) {
                return ('0' + number).slice(-2);
            },
            formatFractionTotal: function (number) {
                return ('0' + number).slice(-2);
            },
        },
        navigation: {
            nextEl: ".mn-swiper__btn--next",
            prevEl: ".mn-swiper__btn--prev",
        },
        loop: true,
        // autoplay: {
        //     delay: 2500,
        // },
        pauseOnMouseEnter: true,
        speed: 500,
    });

    // Quick search regex
    let qsRegex;
    let buttonFilters = {};
    let buttonFilter;

    // Init Isotope
    const grid = document.querySelector('.mn-services');
    const iso = grid && new Isotope(grid, {
        itemSelector: '.mn-services__card',
        layoutMode: 'fitRows',
        fitRows: {
            columnWidth: 365,
            gutter: 16,
            equalheight: true
        },
        filter: function () {
            let searchResult = qsRegex ? this.textContent.match(qsRegex) : true
            let buttonResult = buttonFilter ? this.matches(buttonFilter) : true;
            return searchResult && buttonResult
        }
    });

    const filterTabs = document.querySelectorAll('.mn-tabs__item')
    filterTabs?.forEach(filterTab => {
        filterTab.addEventListener('click', () => {
            if (!filterTab.classList.contains('mn-tabs__item--active')) {
                document.querySelector('.mn-tabs__item--active').classList.remove('mn-tabs__item--active')
                filterTab.classList.add('mn-tabs__item--active')
                let filterGroup = filterTab.closest('.mn-tabs').getAttribute('data-filter-group')
                buttonFilters[filterGroup] = filterTab.getAttribute('data-filter')
                buttonFilter = concatValues(buttonFilters);

                iso.arrange()
            }
        });
    })

    // Use value of search field to filter
    const quicksearch = document.querySelector('#searchService');
    quicksearch?.addEventListener('input', debounce(() => {
        qsRegex = new RegExp(quicksearch.value, 'gi');
        const activeTags = document.querySelectorAll('.mn-tags__item--selected')
        activeTags?.forEach(activeTag => {
            activeTag.classList.remove('mn-tags__item--selected')
        })
        iso.arrange();
    }, 200));

    // Tags handling
    const tags = document.querySelectorAll('.mn-tags__item')

    tags?.forEach(tag => {
        tag.addEventListener('click', () => {
            const dataKey = tag.dataset.key
            const activeTags = document.querySelectorAll('.mn-tags__item--selected')
            activeTags?.forEach(activeTag => {
                activeTag.classList.remove('mn-tags__item--selected')
            })
            tag.classList.add('mn-tags__item--selected')
            quicksearch.value = dataKey
            qsRegex = new RegExp(dataKey, 'gi');
            iso.arrange();
        });
    });

    // Modal close handler
    document.querySelectorAll('.mn-modal--closeable').forEach(modal => {
        modal.addEventListener('click', function (e) {
            const modalContent = modal.querySelector('.mn-modal__content');
            if (!modalContent.contains(e.target)) {
                modalAction(modal, 'hide');
            }
        });
    });

    // Open modal handler
    document.querySelectorAll('[data-toggle="modal"]').forEach(trigger => {
        trigger.addEventListener('click', function () {
            const modal = document.querySelector(this.getAttribute('data-target'));
            modalAction(modal, 'show');
        });
    });

    // Close modal handler
    document.querySelectorAll('[data-close="modal"]').forEach(closeButton => {
        closeButton.addEventListener('click', function () {
            const modal = this.closest('.mn-modal');
            modalAction(modal, 'hide');
        });
    });

    // Accordion functionality
    document.querySelectorAll('.mn-accordion__item__header').forEach(header => {
        header.addEventListener('click', function () {
            const accordionItem = header.closest('.mn-accordion__item');
            const isActive = accordionItem.classList.contains('mn-accordion__item--show');
            const activeAccordionItem = document.querySelector('.mn-accordion__item--show');

            // Close currently active accordion
            if (activeAccordionItem && activeAccordionItem !== accordionItem) {
                activeAccordionItem.classList.remove('mn-accordion__item--show');
                const activeBody = activeAccordionItem.querySelector('.mn-accordion__item__body');
                slideUp(activeBody, 250);
            }

            // Toggle the clicked accordion
            if (!isActive) {
                accordionItem.classList.add('mn-accordion__item--show');
                const body = accordionItem.querySelector('.mn-accordion__item__body');
                slideDown(body, 250);
            }
        });
    });

    //
    document.querySelectorAll('.mn-how-it-works__card').forEach(card => {
        card.addEventListener('click', function () {
            const source = card.getAttribute('data-src');
            const video = document.querySelector(".mn-how-it-works__video")
            video?.setAttribute('src', source);
        });
    });

    document.querySelector(".mn-modal--how-it-works .mn-modal__close")?.addEventListener('click', () => {
        document.querySelector('.mn-how-it-works__video').setAttribute("src", "#");
    })

    // Initialize the active accordion item to be open
    const activeAccordionItem = document.querySelector('.mn-accordion__item--show');
    if (activeAccordionItem) {
        const activeBody = activeAccordionItem.querySelector('.mn-accordion__item__body');
        slideDown(activeBody, 250);
    }

    // Copy url to share
    const copyShareUrl = document.querySelector('.mn-share__list__item__link--copy')
    copyShareUrl?.addEventListener('click', () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url)
            .then(() => showToast('URL kopyalandı!', 'success'))
            .catch(() => showToast('URL kopyalanmadı!', 'error'));
    })

    // Modal action function
    function modalAction(modal, action, url = null) {
        const showDelay = 150;

        switch (action) {
            case 'show':
                modal.style.display = 'block';
                document.body.classList.add('overflow-hidden');
                if (modal.classList.contains('mn-modal--multi-content')) {
                    modalContentAction(modal.querySelector('.mn-modal__content[data-step="1"]'), 'show');
                }
                setTimeout(() => {
                    modal.style.display = 'block';
                    modal.classList.add('mn-modal--show');
                }, showDelay);
                break;

            case 'hide':
                modal.classList.remove('mn-modal--show');
                setTimeout(() => {
                    modal.style.display = 'none';
                    document.body.classList.remove('overflow-hidden');
                    if (modal.classList.contains('mn-modal--multi-content')) {
                        modal.querySelectorAll('.mn-modal__content').forEach(content => modalContentAction(content, 'hide'));
                    }
                    if (url) {
                        window.location.replace(url);
                    }
                }, showDelay);
                break;

            default:
                console.error('Unsupported action for modal:', action);
        }
    }

    // Modal content action function
    function modalContentAction(modalContent, action) {
        switch (action) {
            case 'show':
                modalContent.classList.add('mn-modal__content--show');
                break;

            case 'hide':
                modalContent.classList.remove('mn-modal__content--show');
                break;

            default:
                console.error('Unsupported action for modalContent:', action);
        }
    }

    // Concat object values
    function concatValues(obj) {
        let value = ''; for (let prop in obj) { value += obj[prop]; }
        return value;
    }

    // Debounce function using modern syntax
    function debounce(fn, delay = 100) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), delay);
        };
    };

    // Toaster function
    function showToast(message, type) {
        const toast = document.querySelector('.mn-toaster');
        toast.textContent = message;
        toast.className = `mn-toaster show ${type}`;

        setTimeout(() => {
            toast.className = 'mn-toaster';
        }, 2500);
    }

    // Slide animation functions
    function slideUp(target, duration = 500) {

        target.style.transitionProperty = 'height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.boxSizing = 'border-box';
        target.style.height = target.offsetHeight + 'px';
        target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout(() => {
            target.style.display = 'none';
            target.style.removeProperty('height');
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            //alert("!");
        }, duration);
    }

    function slideDown(target, duration = 500) {
        target.style.removeProperty('display');
        let display = window.getComputedStyle(target).display;
        if (display === 'none') display = 'block';
        target.style.display = display;
        let height = target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.boxSizing = 'border-box';
        target.style.transitionProperty = "height, margin, padding";
        target.style.transitionDuration = duration + 'ms';
        target.style.height = height + 'px';
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        window.setTimeout(() => {
            target.style.removeProperty('height');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
        }, duration);
    }

    function slideToggle(target, duration = 500) {
        if (window.getComputedStyle(target).display === 'none') {
            return slideDown(target, duration);
        } else {
            return slideUp(target, duration);
        }
    }

    // Create an odometer with lazy loading using Intersection Observer
    function createOdometer(el, value) {
        const odometer = new Odometer({
            el: el,
            value: 0,
            format: "(.ddd),dd"
        });

        let hasRun = false;

        const options = {
            threshold: [0, 0.9],
        };

        // Start odometer count when element is visible in the viewport
        const callback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !hasRun) {
                    odometer.update(value);
                    hasRun = true;
                }
            });
        };

        const observer = new IntersectionObserver(callback, options);
        observer.observe(el);
    };

    // Lazy load
    function lazyLoad() {
        if ("IntersectionObserver" in window) {
            let lazyImgObserver = new IntersectionObserver((entries, lazyImgObserver) => {
                entries.forEach(entry => {
                    if (entry.intersectionRatio > 0.0) {
                        let img = entry.target;
                        if (!img.hasAttribute('src')) {
                            img.setAttribute('src', img.dataset.src);
                            img.classList.remove('lazy-load')
                        }
                    }
                });
            });
            let lazyImages = document.querySelectorAll('.lazy-load');
            for (let img of lazyImages) {
                lazyImgObserver.observe(img);
            }

            // let lazyVideoObserver = new IntersectionObserver(function (entries, observer) {
            //     entries.forEach(function (video) {
            //         if (video.isIntersecting) {
            //             for (let source in video.target.children) {
            //                 let videoSource = video.target.children[source];
            //                 if (typeof videoSource.tagName === "string" && videoSource.tagName === "SOURCE" && !videoSource.hasAttribute('src')) {
            //                     videoSource.src = videoSource.dataset.src;
            //                 }
            //             }
            //             video.target.load();
            //             video.target.classList.remove("lazy-load");
            //             lazyVideoObserver.unobserve(video.target);
            //         }
            //     });
            // });

            // let lazyVideos = document.querySelectorAll("video");
            // for (let lazyVideo of lazyVideos) {
            //     lazyVideoObserver.observe(lazyVideo);
            // }
        }
    }
})();

