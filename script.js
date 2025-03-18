console.log("JavaScript is initialized")

let currentsong = new Audio();
let songs;
let currfolder;


function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
// // Example usage
// console.log(formatTime(12));   // "00:12"
// console.log(formatTime(90));   // "01:30"
// console.log(formatTime(3605)); // "60:05"

async function getSongs(folder) {

    currfolder = folder

    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text()

    let div = document.createElement("div")
    div.innerHTML = response;

    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {

        songUL.innerHTML = songUL.innerHTML + `
        
        <li>
                        <img src="music.svg" alt="">
                        <div class="info">
                            <div> ${song.replaceAll("%20", " ")}</div>
                            <div>Develped by Adil</div>
                        </div>
                        <div class="playnow">
                            <span>Play now</span>
                        <img src="play.svg" alt="">
                    </div>
                    </li>
        
       `

    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {

        e.addEventListener("click", element => {

            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    });

    return songs
}

const playMusic = (track, pause = false) => {
    // let audio = new Audio ("/songs/" + track)
    currentsong.src = `/${currfolder}/` + track;
    if (!pause) {
        currentsong.play()
        pause.src = "pause.svg"
    }


    document.querySelector(".sname").innerHTML = decodeURI(track)
    document.querySelector(".stime").innerHTML = "00:00/00:00";
}

async function main() {



    await getSongs("songs/pv")
    playMusic(songs[0], true)
    console.log(songs)

    async function displayAlbums() {

        let a = await fetch(`http://127.0.0.1:3000/songs/`)
        let response = await a.text()
        let div = document.createElement("div")
        div.innerHTML = response;
        let anchors = div.getElementsByTagName("a")
        let cardContainer = document.querySelector(".cardscontainer")
        let array = Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];


            if (e.href.includes("/songs")) {
                let folder = e.href.split("/").slice(-2)[0]
                //Getting meta data of the folder
                let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
                let response = await a.json();
                console.log(response)
                cardContainer.innerHTML = cardContainer.innerHTML + `
                <div data-folder="${folder}" class="cards">
                    <img src="/songs/${folder}/cover.jpg" alt="">
                    <h1>${response.title}</h1>
                    <p>${response.description}</p>
                    <div class="grncrcle">
                        <img src="playgreen.svg" alt="" srcset="">

                    </div>
                </div>
                `
            }
        }

        //Click on Cards
        Array.from(document.getElementsByClassName("cards")).forEach(e => {
            e.addEventListener("click", async item => {
                console.log(item, item.currentTarget.dataset.folder)
                songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
                playMusic(songs[0])
            })
        })



    }

    displayAlbums()



    // Attaching event listner on playbar icons

    pause.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            pause.src = "pause.svg"
        }

        else {
            currentsong.pause()
            pause.src = "play.svg"
        }
    })

    //Thanks to GPT
    // Ensure pause button updates when new song plays
    currentsong.addEventListener("play", () => {
        pause.src = "pause.svg"; // ✅ Update button when song starts playing
    });

    // Ensure pause button updates when song is paused
    currentsong.addEventListener("pause", () => {
        pause.src = "play.svg"; // ✅ Update button when song is paused
    });

    // Timeupdate event

    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration)
        document.querySelector(".stime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}:${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
    })


    //seekbar movement of circle

    document.querySelector(".line").addEventListener("click", e => {

        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentsong.currentTime = ((currentsong.duration) * percent) / 100;

    })


    //Hamburger functionality
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".one").style.left = "0%";
    })

    //Hamburger close functionality
    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".one").style.left = "-100%";
    })


    //Next button
    next.addEventListener("click", () => {
        console.log("Next clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    //Precious or last button
    last.addEventListener("click", () => {
        console.log("Next clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if (index - 1 >= length) {
            playMusic(songs[index - 1])
        }
    })


}

main()