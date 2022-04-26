var audio = new Audio('images/music.mp3')
audio.play();
audio.loop =true;
const audiohtml = document.querySelector(".audio")
function play(){

    if(audio.paused){
        audiohtml.innerHTML = `<img src="images/pause.svg" alt="" onclick="play()"></img>`

    audio.play()}else{
        audiohtml.innerHTML = `<img src="images/play.svg" alt="" onclick="play()"></img>`
        audio.pause()
    }
}
function audioplay(){
    audio.play();
}