// ==========================================
// LOCALLOOP — GSAP ANIMATIONS
// ==========================================

gsap.registerPlugin(ScrollTrigger);

const desktop = gsap.matchMedia();


// ==========================================
// DESKTOP ANIMATIONS ONLY
// ==========================================

desktop.add("(min-width: 1001px)", () => {

    // NAVBAR INTRO

    gsap.from(".navbar", {
        y: -60,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });


    // HERO INTRO

    const heroIntro = gsap.timeline();

    heroIntro
        .from(".hero .eyebrow", {
            y: 30,
            opacity: 0,
            duration: 0.7
        })
        .from(".hero h1", {
            y: 70,
            opacity: 0,
            duration: 1
        }, "-=0.3")
        .from(".hero-content > p", {
            y: 30,
            opacity: 0,
            duration: 0.7
        }, "-=0.5")
        .from(".hero-btn", {
            y: 25,
            opacity: 0,
            duration: 0.7
        }, "-=0.3")
        .from(".city-image", {
            y: 150,
            scale: 1.15,
            opacity: 0,
            duration: 1.3
        }, "-=0.8");


    // HERO PARALLAX

    gsap.to(".city-image", {
        y: -100,
        scale: 1.12,
        ease: "none",

        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 1
        }
    });


    // HERO EXIT

    gsap.timeline({
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "+=80%",
            scrub: 1,
            pin: true,
            anticipatePin: 1
        }
    })
    .to(".hero-content", {
        y: -100,
        scale: 0.85,
        opacity: 0,
        ease: "none"
    })
    .to(".city-image", {
        scale: 1.35,
        y: -180,
        opacity: 0.3,
        ease: "none"
    }, 0);


    // SERVICES TRANSITION

    gsap.timeline({
        scrollTrigger: {
            trigger: ".services",
            start: "top top",
            end: "+=100%",
            scrub: 1,
            pin: true,
            anticipatePin: 1
        }
    })
    .from(".services .section-heading", {
        y: 100,
        opacity: 0,
        ease: "none"
    })
    .from(".category-card", {
        y: 120,
        opacity: 0,
        scale: 0.85,
        stagger: 0.12,
        ease: "none"
    }, 0.2)
    .to(".category-card", {
        y: -80,
        opacity: 0,
        stagger: 0.06,
        ease: "none"
    }, 0.8);


    // FEATURED PROFESSIONALS

    gsap.timeline({
        scrollTrigger: {
            trigger: ".featured",
            start: "top top",
            end: "+=100%",
            scrub: 1,
            pin: true,
            anticipatePin: 1
        }
    })
    .from(".featured .section-heading", {
        y: 80,
        opacity: 0,
        ease: "none"
    })
    .from(".provider-card", {
        y: 130,
        opacity: 0,
        scale: 0.85,
        stagger: 0.15,
        ease: "none"
    }, 0.2);


    // HOW IT WORKS

    gsap.timeline({
        scrollTrigger: {
            trigger: ".how-it-works",
            start: "top top",
            end: "+=100%",
            scrub: 1,
            pin: true,
            anticipatePin: 1
        }
    })
    .from(".how-it-works .section-heading", {
        y: 80,
        opacity: 0,
        ease: "none"
    })
    .from(".step", {
        y: 120,
        opacity: 0,
        scale: 0.85,
        stagger: 0.18,
        ease: "none"
    }, 0.2);


    // FOOTER

    gsap.from("footer", {
        scrollTrigger: {
            trigger: "footer",
            start: "top 90%"
        },
        y: 70,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });


    // REFRESH

    window.addEventListener("load", () => {
        ScrollTrigger.refresh();
    });

});


// ==========================================
// TABLET AND MOBILE: NO PINNING
// ==========================================

desktop.add("(max-width: 1000px)", () => {

    gsap.from(".hero-content > *", {
        y: 35,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out"
    });

});
