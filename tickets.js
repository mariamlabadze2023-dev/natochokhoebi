// ===============================
// SUPABASE SETTINGS
// ===============================

const SUPABASE_URL =
    "https://topngtylgfdikvmxvgbw.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_t7UOrsX9MTxUnDE_-hyafQ_OFvQpvnn";


// ===============================
// LOAD CONCERTS
// ===============================

async function loadTickets() {

    const container =
        document.getElementById("ticketsContainer");

    if (!container) {
        return;
    }


    try {

        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/concerts?select=*`,
            {
                method: "GET",

                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization":
                        `Bearer ${SUPABASE_KEY}`
                }
            }
        );


        if (!response.ok) {

            throw new Error(
                "Failed to load concerts"
            );

        }


        const concerts =
            await response.json();


        // Clear loading message

        container.innerHTML = "";


        // ===============================
        // NO CONCERTS
        // ===============================

        if (
            !concerts ||
            concerts.length === 0
        ) {

            container.innerHTML = `
                <p class="no-concerts">
                    No concerts available.
                </p>
            `;

            return;
        }


        // ===============================
        // CREATE CONCERT CARDS
        // ===============================

        concerts.forEach(concert => {


            // Check status

            const isEnded =
                concert.status === "ended";


            // Create card

            const card =
                document.createElement("div");


            card.className =
                isEnded
                    ? "ticket-card ended"
                    : "ticket-card";


            // ===============================
            // CONCERT IMAGE
            // ===============================

            const image =
                concert.image ||
                "images/natushki.jpeg";


            // ===============================
            // TICKET LINK
            // ===============================

            const ticketUrl =
                concert.ticket_url ||
                "#";


            // ===============================
            // PRICE
            // ===============================

            let priceHTML = "";


            if (
                concert.price !== null &&
                concert.price !== undefined &&
                concert.price !== ""
            ) {

                priceHTML = `
                    <p class="price">
                        💵 ${concert.price} GEL
                    </p>
                `;

            }


            // ===============================
            // TICKET BUTTON
            // ===============================

            let buttonHTML = "";


            if (isEnded) {

                buttonHTML = `
                    <a
                        href="#"
                        class="buy-btn disabled"
                        onclick="return false;"
                    >
                        Ended
                    </a>
                `;

            } else {

                if (ticketUrl !== "#") {

                    buttonHTML = `
                        <a
                            href="${ticketUrl}"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="buy-btn"
                        >
                            Buy Ticket
                        </a>
                    `;

                } else {

                    buttonHTML = `
                        <a
                            href="#"
                            class="buy-btn disabled"
                            onclick="return false;"
                        >
                            Buy Ticket
                        </a>
                    `;

                }

            }


            // ===============================
            // CARD HTML
            // ===============================

            card.innerHTML = `

                <span class="status ${
                    isEnded
                        ? "ended"
                        : "available"
                }">

                    ${
                        isEnded
                            ? "Ended"
                            : "Available"
                    }

                </span>


                <img
                    src="${image}"
                    alt="${
                        concert.title ||
                        "Nato & Chokhos concert"
                    }"
                >


                <h2>
                    ${
                        concert.title ||
                        ""
                    }
                </h2>


                <p>
                    📅 ${
                        concert.date ||
                        ""
                    }
                </p>


                <p>
                    📍 ${
                        concert.location ||
                        ""
                    }
                </p>


                ${priceHTML}


                ${buttonHTML}

            `;


            // Add card

            container.appendChild(card);

        });


    } catch (error) {

        console.error(
            "Concert loading error:",
            error
        );


        container.innerHTML = `
            <p class="error-message">
                Concerts could not be loaded.
            </p>
        `;

    }

}



// ===============================
// FILTER TICKETS
// ===============================

function filterTickets(type) {

    const cards =
        document.querySelectorAll(
            ".ticket-card"
        );


    cards.forEach(card => {


        // ===============================
        // ALL
        // ===============================

        if (type === "all") {

            card.style.display =
                "block";

        }


        // ===============================
        // AVAILABLE
        // ===============================

        else if (
            type === "available"
        ) {

            if (
                card.classList.contains(
                    "ended"
                )
            ) {

                card.style.display =
                    "none";

            } else {

                card.style.display =
                    "block";

            }

        }


        // ===============================
        // ENDED
        // ===============================

        else if (
            type === "ended"
        ) {

            if (
                card.classList.contains(
                    "ended"
                )
            ) {

                card.style.display =
                    "block";

            } else {

                card.style.display =
                    "none";

            }

        }

    });

}



// ===============================
// LOAD WHEN PAGE OPENS
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadTickets();

    }
);