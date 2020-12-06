
console.log("content script loaded...")
// probably where we will create the pop up, and make it invisible
var definitionView = document.createElement("h1");
definitionView.innerHTML = "";
var exampleModal;

// overlay div allows us to implement click outside card to close it
var clickOverlay = document.createElement("div");
clickOverlay.setAttribute("id", "clickOutsideOverlay");

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    console.log("received a message...");
    if (request.greeting == "hello") {
      console.log("Received a definition!...")
      console.log(request.definition);

      // after this point, can populate pop up, and make it visible.
      definitionJSON = JSON.parse(request.definition);
      console.log(definitionJSON);
      definitionView.innerText = definitionJSON[0]["meanings"][0]["definitions"][0]["definition"];
      var word = definitionJSON[0]["word"];
      var name = definitionView.innerText;
      var audioLink = definitionJSON[0]["phonetics"][0]["audio"];
      var exampleModal = getExampleModal();

      console.log(word);
      //sendResponse({wordDefined: word});
      // Init the modal if it hasn't been already.
      if (!exampleModal) { exampleModal = initExampleModal(); }
      var html =
        '<div class="modal-header">' +
        '<h5 class="modal-title" id="exampleModalLabel">' + word + '</h5>' +
        '</div>' +
        '<div><div class="modal-body">' +
        name +
        '</div></div>' +
        '<div class="modal-body">' +
        '<p>Learn to Pronounce!</p>'+
        '<audio controls> <source src=' + audioLink + ' type="audio/mpeg">Your browser does not support the audio element. </audio>' +
        '</div>';
      var linebreak = document.createElement('br');
      var footer = document.createElement('div');
      footer.classList.add('modal-footer');
      var button = document.createElement('button');
      button.classList.add('btn-modal');
      button.classList.add('btn-primary-modal');
      button.setAttribute("id", "listAdd")
      button.innerHTML = "Add it to your list";
      var button2 = document.createElement('button');
      button2.classList.add('btn-modal');
      button2.classList.add('btn-secondary-modal');
      button2.innerHTML = "Close";
      button.addEventListener("click", check);
      button2.addEventListener("click", remove);
      footer.appendChild(button);
      footer.appendChild(button2);


      setExampleModalContent(html, footer, linebreak);

      var toolbarHeight = 180;

      // var div = document.createElement("div");
      // div.id = "myToolbar";
      // div.textContent = "I am the toolbar !";

      // var div = document.createElement("div");
      // div.id = "myToolbar";
      // div.textContent = "I am the toolbar !";

      var st = exampleModal.style;
      st.display = "block";
      st.top = "10px";
      st.minWidth = "10%";
      st.left = "70%";
      st.padding = "1%";
      st.minWidth = "10%";
      st.zIndex = "9999";
      st.minHeight = toolbarHeight + "px";
      st.color = "white";
      st.fontStyle = "italic";
      st.position = "fixed";
      st.background = 'black';
      // exampleModal.ondragover= (e)=> { exampleModal.style.left = e.pageX + 'px';
      // exampleModal.style.top = e.pageY + 'px';}
      // exampleModal.ondrag= (e)=> { exampleModal.style.left = e.pageX + 'px';
      // exampleModal.style.top = e.pageY + 'px';}
      exampleModal.ondragend = (e) => {
        exampleModal.style.left = e.pageX + 'px';
        exampleModal.style.top = e.pageY + 'px';
      }
      // document.body.style.webkitTransform = "translateY(" + toolbarHeight + "px)";
      // exampleModal.addEventListener("drag", drags);

      // add modal to document
      document.documentElement.appendChild(exampleModal);

      // ensure overlay div is on and add it
      clickOverlay.style.display = 'block';
      document.documentElement.appendChild(clickOverlay);

      document.onclick = function (e) {
        // if overlay div is clicked then remove the card, and the overlay div
        if (e.target.id == 'clickOutsideOverlay') {
          exampleModal.querySelector('.modal-content').innerHTML = "";
          exampleModal.style.display = 'none';
          document.body.style.webkitTransform = "translateY(" + 0 + "px)";          
          clickOverlay.style.display = 'none';
          document.documentElement.removeChild(clickOverlay);
        }
      };
      // document.addEventListener('mousemove', onMouseMove);


      // Show the modal.
      // jQuery(exampleModal).modal('show');
      // document.body.insertBefore(exampleModal, document.body.firstChild);
      return true;
    }
  });

function drags(e) {
  exampleModal.style.left = e.pageX + 'px';
  exampleModal.style.top = e.pageY + 'px';

}

function check() {
  console.log("hello");
}

function getExampleModal() {
  return document.getElementById('exampleModal');
}

function remove() {
  // getExampleModal().querySelector('.modal-content').removeChild(footer);
  var exampleModal = getExampleModal();
  exampleModal.querySelector('.modal-content').innerHTML = "";
  exampleModal.style.display = 'none';
  document.body.style.webkitTransform = "translateY(" + 0 + "px)";
}

function setExampleModalContent(html, footer, linebreak) {
  getExampleModal().querySelector('.modal-content').innerHTML = html;
  getExampleModal().querySelector('.modal-content').appendChild(footer);
}


function initExampleModal() {
  var modal = document.createElement('div');
  modal.classList.add('modal', 'fade');
  modal.setAttribute('id', 'exampleModal');
  modal.setAttribute('tabindex', '-1');
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-labelledby', 'exampleModalLabel');
  modal.setAttribute('aria-hidden', 'true');
  modal.setAttribute("draggable", true);
  modal.innerHTML =
    '<div class="modal-dialog" role="document">' +
    '<div class="modal-content"></div>' +
    '</div>';
  document.body.appendChild(modal);
  return modal;
}