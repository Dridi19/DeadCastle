function remova(){
   const gamestart =  document.getElementById("gamestart");
   gamestart.remove()
}
document.addEventListener("keydown", function(event) {
    if (event.key == "Control") {
        const gamestart =  document.getElementById("gamestart");
        gamestart.removeAttribute('id');
        
    }
 })