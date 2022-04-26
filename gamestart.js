
document.addEventListener("keydown", function(event) {
    if (event.key == "Control") {
        const gamestart =  document.getElementById("gamestart");
        gamestart.removeAttribute('id');
        audioplay()
    }
 })
const git = document.getElementById("git")
git.addEventListener("click",()=>{
    window.open("https://github.com/Dridi19/site-rpg");

})