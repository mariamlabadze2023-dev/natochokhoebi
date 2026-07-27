// =====================
// 🌙 DARK MODE
// =====================

function toggleDarkMode() {

```
document.body.classList.toggle("dark");

localStorage.setItem(
    "dark",
    document.body.classList.contains("dark") ? "on" : "off"
);
```

}

window.addEventListener("load", () => {

```
if (localStorage.getItem("dark") === "on") {
    document.body.classList.add("dark");
}
```

});

// =====================
// 🔍 SEARCH
// VIDEOS + INTERVIEWS
// =====================

document.addEventListener("DOMContentLoaded", () => {

```
const searchInput = document.getElementById("searchInput");

if (!searchInput) return;

const cards = document.querySelectorAll(
    ".video-card, .interview-card"
);

searchInput.addEventListener("input", () => {

    const value =
        searchInput.value.toLowerCase();

    cards.forEach(card => {

        const title =
            (
                card.dataset.title ||
                card.querySelector("h2")?.innerText ||
                ""
            ).toLowerCase();

        card.style.display =
            title.includes(value)
                ? "block"
                : "none";

    });

});
```

});

// =====================
// ❤️ VIDEO FAVORITES
// =====================

document.addEventListener("DOMContentLoaded", () => {

```
let saved =
    JSON.parse(
        localStorage.getItem("favorites")
    ) || [];


document.querySelectorAll(".video-card").forEach(card => {

    const img =
        card.querySelector("img");

    const fav =
        card.querySelector(".fav");


    if (!img || !fav) return;


    const id = img.src;


    if (saved.includes(id)) {

        fav.classList.add("active");

    }


    fav.addEventListener("click", (e) => {

        e.preventDefault();
        e.stopPropagation();


        if (saved.includes(id)) {

            saved =
                saved.filter(
                    i => i !== id
                );

            fav.classList.remove("active");

        } else {

            saved.push(id);

            fav.classList.add("active");

        }


        localStorage.setItem(
            "favorites",
            JSON.stringify(saved)
        );

    });

});
```

});

// =====================
// ❤️ INTERVIEW FAVORITES
// =====================

document.addEventListener("DOMContentLoaded", () => {

```
document
    .querySelectorAll(".interview-card")
    .forEach(card => {

        const fav =
            card.querySelector(".fav");

        const id =
            card.dataset.title;


        if (!fav || !id) return;


        if (
            localStorage.getItem(
                "fav_" + id
            ) === "true"
        ) {

            fav.classList.add("active");

        }


        fav.addEventListener("click", (e) => {

            e.preventDefault();
            e.stopPropagation();


            fav.classList.toggle("active");


            if (
                fav.classList.contains("active")
            ) {

                localStorage.setItem(
                    "fav_" + id,
                    "true"
                );

            } else {

                localStorage.removeItem(
                    "fav_" + id
                );

            }

        });

    });
```

});

// =====================
// ❤️ INTERVIEW FILTERS
// =====================

function showAll() {

```
document
    .querySelectorAll(".interview-card")
    .forEach(card => {

        card.style.display = "block";

    });
```

}

function showFavs() {

```
document
    .querySelectorAll(".interview-card")
    .forEach(card => {

        const id =
            card.dataset.title;

        const isFav =
            localStorage.getItem(
                "fav_" + id
            ) === "true";


        card.style.display =
            isFav
                ? "block"
                : "none";

    });
```

}

// =====================
// 🎟 TICKETS FILTER
// =====================

function filterTickets(type) {

```
const cards =
    document.querySelectorAll(
        ".ticket-card"
    );


const buttons =
    document.querySelectorAll(
        ".filter-buttons button"
    );


buttons.forEach(btn => {

    btn.classList.remove("active");

});


if (event?.target) {

    event.target.classList.add("active");

}


cards.forEach(card => {

    if (type === "all") {

        card.style.display = "block";

    }

    else if (type === "available") {

        card.style.display =
            card.classList.contains("ended")
                ? "none"
                : "block";

    }

    else if (type === "ended") {

        card.style.display =
            card.classList.contains("ended")
                ? "block"
                : "none";

    }

});
```

}

// =====================
// ❤️ FAN MESSAGE FORM
// FORMSPREE
// =====================

document.addEventListener("DOMContentLoaded", () => {

```
const fanForm =
    document.getElementById("fanForm");

const formMessage =
    document.getElementById("formMessage");


if (!fanForm || !formMessage) return;


fanForm.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();


        const submitButton =
            fanForm.querySelector(
                ".send-message-btn"
            );


        submitButton.disabled = true;

        submitButton.textContent =
            "Sending...";


        const formData =
            new FormData(fanForm);


        try {

            const response =
                await fetch(
                    fanForm.action,
                    {
                        method: "POST",
                        body: formData,
                        headers: {
                            "Accept":
                                "application/json"
                        }
                    }
                );


            if (response.ok) {

                fanForm.reset();


                formMessage.textContent =
                    "Thank you for your message! ❤️";


                formMessage.style.display =
                    "block";


                submitButton.textContent =
                    "Message Sent ❤️";


            } else {

                throw new Error(
                    "Form submission failed"
                );

            }


        } catch (error) {

            formMessage.textContent =
                "Something went wrong. Please try again.";

            formMessage.style.display =
                "block";


            formMessage.style.color =
                "crimson";


            submitButton.textContent =
                "Send Message ❤️";

        }


        submitButton.disabled = false;

    }
);
```

});

// ===============================
// BURGER MENU
// ===============================

function toggleMenu() {

    const navMenu =
        document.getElementById("navMenu");

    if (!navMenu) return;

    navMenu.classList.toggle("active");

}


// CLOSE MENU AFTER CLICKING A LINK

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const navLinks =
            document.querySelectorAll(
                "#navMenu a"
            );

        navLinks.forEach(link => {

            link.addEventListener(
                "click",
                function () {

                    const navMenu =
                        document.getElementById(
                            "navMenu"
                        );

                    if (navMenu) {

                        navMenu.classList.remove(
                            "active"
                        );

                    }

                }
            );

        });

    }
);

// ===============================
// BURGER MENU
// ===============================

function toggleMenu() {

    const navMenu =
        document.getElementById("navMenu");

    if (!navMenu) return;

    navMenu.classList.toggle("active");

}


// CLOSE MENU WHEN LINK IS CLICKED

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const navLinks =
            document.querySelectorAll(
                "#navMenu a"
            );

        navLinks.forEach(link => {

            link.addEventListener(
                "click",
                function () {

                    const navMenu =
                        document.getElementById(
                            "navMenu"
                        );

                    if (navMenu) {

                        navMenu.classList.remove(
                            "active"
                        );

                    }

                }
            );

        });

    }
);