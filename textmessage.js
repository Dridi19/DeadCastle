class textmessage {
    constructor({ text, oncomplete }) {
      this.text = text;
      this.onComplete = oncomplete;
      this.element = null;
    }
  
    createElement() {
      //Create the element
      this.element = document.createElement("div");
      this.element.classList.add("message");
  
      this.element.innerHTML = (`<div class="DialogBox">
      <div class="dialogTitle">${this.text}<div/>
      <button class="dialogFooter">
        Next
      </button>`
      );
  
      this.element.querySelector("button").addEventListener("click", () => {
        //Close the text message
        this.done();
      });
  
     
  
    }
  
    done() {
      this.element.remove();
      this.onComplete();
    }
  
    init(container) {
      this.createElement();
      container.appendChild(this.element)
    }
  
  }