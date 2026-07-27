// ===============================
// SUPABASE CONFIGURATION
// ===============================

const SUPABASE_URL = "https://topngtylgfdikvmxvgbw.supabase.co";

const SUPABASE_KEY = "sb_publishable_t7UOrsX9MTxUnDE_-hyafQ_OFvQpvnn";


// ===============================
// SUPABASE REQUEST
// ===============================

async function supabaseRequest(url, options = {}) {

    const response = await fetch(
        SUPABASE_URL + url,
        {
            ...options,

            headers: {
                "apikey": SUPABASE_KEY,
                "Authorization": "Bearer " + SUPABASE_KEY,
                "Content-Type": "application/json",

                ...(options.headers || {})
            }
        }
    );


    // თუ Supabase შეცდომას აბრუნებს
    if (!response.ok) {

        const errorText = await response.text();

        let errorMessage = errorText;

        try {
            const errorData = JSON.parse(errorText);

            errorMessage =
                errorData.message ||
                errorData.error ||
                errorText;

        } catch (error) {
            // პასუხი JSON არ არის
        }

        throw new Error(
            errorMessage || "Supabase request failed"
        );
    }


    // ვკითხულობთ პასუხს ტექსტად
    const text = await response.text();


    // თუ პასუხი ცარიელია
    // მაგალითად POST / PATCH / DELETE
    // return=minimal-ის შემთხვევაში
    if (!text) {
        return null;
    }


    // თუ პასუხი JSON არის
    try {

        return JSON.parse(text);

    } catch (error) {

        // თუ JSON არ არის, ტექსტი დავაბრუნოთ
        return text;

    }

}


// ===============================
// DATE FORMAT
// ===============================

// Supabase-სთვის:
// 2026-07-29
//
// საიტზე ჩვენებისთვის:
// 29 ივლისი, 2026

function formatDate(dateString) {

    if (!dateString) {
        return "";
    }


    const months = [
        "იანვარი",
        "თებერვალი",
        "მარტი",
        "აპრილი",
        "მაისი",
        "ივნისი",
        "ივლისი",
        "აგვისტო",
        "სექტემბერი",
        "ოქტომბერი",
        "ნოემბერი",
        "დეკემბერი"
    ];


    // თუ უკვე არის YYYY-MM-DD
    const parts = dateString.split("-");


    if (parts.length === 3) {

        const year = parts[0];
        const month = Number(parts[1]);
        const day = Number(parts[2]);


        if (
            year &&
            month >= 1 &&
            month <= 12 &&
            day >= 1 &&
            day <= 31
        ) {

            return `${day} ${months[month - 1]}, ${year}`;

        }

    }


    return dateString;

}


// ===============================
// LOAD CONCERTS
// ===============================

async function loadConcerts() {

    const container =
        document.getElementById("adminConcerts");


    if (!container) {
        return;
    }


    container.innerHTML =
        "<p>Loading concerts...</p>";


    try {

        const concerts =
            await supabaseRequest(
                "/rest/v1/concerts?select=*&order=id.desc"
            );


        if (!concerts || concerts.length === 0) {

            container.innerHTML =
                "<p>No concerts yet.</p>";

            return;
        }


        container.innerHTML = "";


        concerts.forEach(concert => {

            const card =
                document.createElement("div");


            card.className =
                "admin-concert-card";


            card.innerHTML = `

                <img
                    src="${concert.image}"
                    alt="${concert.title}"
                >


                <div class="admin-concert-info">

                    <h3>
                        ${concert.title}
                    </h3>


                    <p>
                        📅 ${formatDate(concert.date)}
                    </p>


                    <p>
                        📍 ${concert.location}
                    </p>


                    <p>
                        💵 ${concert.price} GEL
                    </p>


                    <p>
                        Status:
                        <strong>
                            ${concert.status}
                        </strong>
                    </p>

                </div>


                <div class="admin-card-buttons">

                    <button
                        onclick="editConcert(${concert.id})"
                        class="edit-btn"
                    >
                        Edit
                    </button>


                    <button
                        onclick="deleteConcert(${concert.id})"
                        class="delete-btn"
                    >
                        Delete
                    </button>

                </div>

            `;


            container.appendChild(card);

        });


    } catch (error) {

        console.error(error);


        container.innerHTML = `

            <p style="color:red;">
                Error loading concerts:
                ${error.message}
            </p>

        `;

    }

}


// ===============================
// ADD / EDIT CONCERT
// ===============================

let editingId = null;


document.addEventListener(
    "DOMContentLoaded",
    () => {

        const form =
            document.getElementById("concertForm");


        if (!form) {
            return;
        }


        form.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                const title =
                    document
                    .getElementById("title")
                    .value
                    .trim();


                const date =
                    document
                    .getElementById("date")
                    .value
                    .trim();


                const location =
                    document
                    .getElementById("location")
                    .value
                    .trim();


                const image =
                    document
                    .getElementById("image")
                    .value
                    .trim();


                const price =
                    document
                    .getElementById("price")
                    .value;


                const status =
                    document
                    .getElementById("status")
                    .value;


                const message =
                    document
                    .getElementById("message");


                const submitButton =
                    document
                    .getElementById("submitButton");


                // ===============================
                // DATE VALIDATION
                // ===============================

                // ვამოწმებთ, რომ თარიღი იყოს:
                // YYYY-MM-DD
                //
                // მაგალითად:
                // 2026-07-29

                const datePattern =
                    /^\d{4}-\d{2}-\d{2}$/;


                if (!datePattern.test(date)) {

                    message.innerText =
                        "Please enter the date like: 2026-07-29";

                    message.style.color =
                        "red";

                    return;

                }


                const concertData = {

                    title: title,

                    date: date,

                    location: location,

                    image: image,

                    price: Number(price),

                    status: status

                };


                try {

                    submitButton.disabled =
                        true;


                    submitButton.innerText =
                        "Saving...";


                    // ===============================
                    // EDIT
                    // ===============================

                    if (editingId) {

                        await supabaseRequest(

                            "/rest/v1/concerts?id=eq." +
                            editingId,

                            {

                                method: "PATCH",

                                headers: {

                                    "Prefer":
                                    "return=minimal"

                                },

                                body:
                                JSON.stringify(
                                    concertData
                                )

                            }

                        );


                        message.innerText =
                            "Concert updated successfully!";

                    }


                    // ===============================
                    // ADD
                    // ===============================

                    else {

                        await supabaseRequest(

                            "/rest/v1/concerts",

                            {

                                method: "POST",

                                headers: {

                                    "Prefer":
                                    "return=minimal"

                                },

                                body:
                                JSON.stringify(
                                    concertData
                                )

                            }

                        );


                        message.innerText =
                            "Concert added successfully!";

                    }


                    message.style.color =
                        "green";


                    // ფორმის გასუფთავება
                    form.reset();


                    editingId = null;


                    document
                    .getElementById("formTitle")
                    .innerText =
                    "Add New Concert";


                    submitButton.innerText =
                    "Add Concert";


                    document
                    .getElementById("cancelButton")
                    .style.display =
                    "none";


                    // კონცერტების თავიდან ჩატვირთვა
                    await loadConcerts();


                } catch (error) {

                    console.error(error);


                    message.innerText =
                        "Error: " +
                        error.message;


                    message.style.color =
                        "red";


                } finally {

                    submitButton.disabled =
                        false;


                    if (editingId) {

                        submitButton.innerText =
                            "Update Concert";

                    } else {

                        submitButton.innerText =
                            "Add Concert";

                    }

                }

            }

        );


        // თავიდან Cancel დამალული იყოს

        document
        .getElementById("cancelButton")
        .style.display =
        "none";


        // კონცერტების ჩატვირთვა

        loadConcerts();

    }

);


// ===============================
// EDIT CONCERT
// ===============================

async function editConcert(id) {

    try {

        const concerts =
            await supabaseRequest(

                "/rest/v1/concerts?id=eq." +
                id +
                "&select=*"

            );


        if (!concerts || !concerts.length) {

            alert(
                "Concert not found."
            );

            return;

        }


        const concert =
            concerts[0];


        document
        .getElementById("title")
        .value =
        concert.title;


        document
        .getElementById("date")
        .value =
        concert.date;


        document
        .getElementById("location")
        .value =
        concert.location;


        document
        .getElementById("image")
        .value =
        concert.image;


        document
        .getElementById("price")
        .value =
        concert.price;


        document
        .getElementById("status")
        .value =
        concert.status;


        editingId =
            concert.id;


        document
        .getElementById("formTitle")
        .innerText =
        "Edit Concert";


        document
        .getElementById("submitButton")
        .innerText =
        "Update Concert";


        document
        .getElementById("cancelButton")
        .style.display =
        "inline-block";


        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });


    } catch (error) {

        console.error(error);


        alert(
            "Error loading concert: " +
            error.message
        );

    }

}


// ===============================
// DELETE CONCERT
// ===============================

async function deleteConcert(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this concert?"
        );


    if (!confirmDelete) {
        return;
    }


    try {

        await supabaseRequest(

            "/rest/v1/concerts?id=eq." +
            id,

            {

                method: "DELETE",

                headers: {

                    "Prefer":
                    "return=minimal"

                }

            }

        );


        await loadConcerts();


    } catch (error) {

        console.error(error);


        alert(
            "Error deleting concert: " +
            error.message
        );

    }

}


// ===============================
// CANCEL EDIT
// ===============================

function cancelEdit() {

    editingId = null;


    document
    .getElementById("concertForm")
    .reset();


    document
    .getElementById("formTitle")
    .innerText =
    "Add New Concert";


    document
    .getElementById("submitButton")
    .innerText =
    "Add Concert";


    document
    .getElementById("cancelButton")
    .style.display =
    "none";


    document
    .getElementById("message")
    .innerText =
    "";

}