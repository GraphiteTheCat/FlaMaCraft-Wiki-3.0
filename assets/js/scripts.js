let translationdocument;
let svgmapdocument
let svgmap;
let timeframe;

if(document.body.getAttribute("data-transcategory").startsWith("season")) {
    svgmap = document.getElementsByClassName("map")[0].children[1];
    timeframe = document.getElementById("timeframe");
}

document.addEventListener("DOMContentLoaded", async function() {
    if(localStorage.getItem("language") === null) { //Nastaví jazyk pokud nebyl nastaven předtím.
        localStorage.setItem("language", "cs");
    }
    document.getElementById("language").value = localStorage.getItem("language");

    let response = await fetch(`/translations/${localStorage.getItem("language")}.json`);
    translationdocument = await response.json();    //Najde JSON soubor s jazykem

    const translationpath = translationdocument[this.body.getAttribute("data-transcategory")]; //Vytvoří proměnnou pro lokální překlady.

    document.querySelectorAll("[data-tl]").forEach(el => {  //Hledá a nastavuje lokální překlady
        if(localStorage.getItem("language") != "cs" && !el.getAttribute("data-tl").startsWith("-")) {
            el.innerHTML = translationpath[el.getAttribute("data-tl")];
        }
    });
    document.querySelectorAll("[data-tlg]").forEach(elg => {    //Hledá a nastavuje globální překlady
        if(localStorage.getItem("language") != "cs" && !elg.getAttribute("data-tlg").startsWith("-")) {
            elg.innerHTML = translationdocument[elg.getAttribute("data-tlg")];
        }
    });

    response = await fetch(`/translations/${localStorage.getItem("language")}-svgmaps.json`); //Obdrží a zpracuje JSON soubor na SVG mapy.
    svgmapdocument = await response.json();
    svgmapdocument = svgmapdocument[document.body.getAttribute("data-transcategory")]

    svgmap.innerHTML = svgmapdocument[timeframe.value];


    // Hodnoty atributu data-tl nebo data-tlg které začínají na pomlčku jsou nastaveny až po splnění kondice (tlačítko, etc.)
})

document.getElementById("language").addEventListener("change", function() {
    localStorage.setItem("language", this.value);
    location.reload();
})

if(svgmap != null) {
    timeframe.addEventListener("change", function() {
        svgmap.innerHTML = svgmapdocument[timeframe.value];
    })


    svgmap.addEventListener("click", function() {
        if(event.target.tagName === "path") {
            const about = Array.from(document.querySelector(".mapabout").children);
            let faction = event.target.getAttribute("data-country");
            about.forEach(line => {
                if(line.getAttribute("data-tl") === "-flag") {
                    line.src = svgmapdocument[faction][line.getAttribute("data-tl")];
                }
                else if(line.getAttribute("data-tl") === "-page") {
                    line.href = svgmapdocument[faction][line.getAttribute("data-tl")];
                }
                else if(line.getAttribute("data-tl") != "-page") {
                    line.innerText = svgmapdocument[faction][line.getAttribute("data-tl")];
                }
            })
        }
    })
}