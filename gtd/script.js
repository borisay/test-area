window.onload = function () {

  document.getElementById("btn3").onclick = function(){
// get initial task from server file.json

    buttonVisibility();
    const url = "./tasks.json";
    (function ($) {
      $.ajax({
        dataType: "json",
        url: url,
        statusCode: {
          404: function() {
            alert( "page not found" );
          }
        },
        success: function(response){
          console.log(response);
          gtd(response);
        }
      });
    })(jQuery);
  };

  document.getElementById("btn2").onclick = function(){
// get initial task from localstorage file.json
    buttonVisibility();
    let retrievedObject = localStorage.getItem('objCardsLocal');
    console.log('retrievedObject: ', JSON.parse(retrievedObject));
    let objCardsLocal = JSON.parse(retrievedObject);
    console.log(objCardsLocal);
    gtd(objCardsLocal);
  };

// create cards(<div>) for tasks
  function gtd(objCards) {
    for (let i = 0; i < objCards.length; i++) {
      console.log(objCards[i].tid + '. ' + objCards[i].type + '. ' + objCards[i].status);
      if (document.getElementById(i) == null){
        const div = document.createElement("div");
        div.setAttribute("id", i);
        objCards[i].cid = i;
        div.setAttribute("draggable", "true");
        div.setAttribute("ondragstart", "event.dataTransfer.setData('Text', this.id)"); //FF
        div.className = "card";
        div.innerHTML = '<span id="tid' + i + '">' + '#' + objCards[i].tid + '</span>' + '<span id="name' + i + '"> ' + objCards[i].name + '</span>' + '<span class="bug-button" id="bug' + i + '">' + 'Bug' + '</span>' + '<span class="task-button" id="task' + i + '">' + 'Task' + '</span>';
        if (objCards[i].type === "bug") {
          div.style.background = "rgb(243, 204, 204)";
        }
        if (objCards[i].type === "task") {
          div.style.background = "rgb(207, 226, 242)";
        }
        if (objCards[i].status === "todo") {
          document.getElementById('todo').appendChild(div);
        }
        else if (objCards[i].status === "inprogress") {
          document.getElementById('inprogress').appendChild(div);
        }
        else if (objCards[i].status === "done") {
          document.getElementById('done').appendChild(div);
        }
      }
    }

// change task status

    var dragged;
    document.addEventListener("drag", function (event) {
    }, false);

    document.addEventListener("dragstart", function (event) {
      dragged = event.target;
      event.target.style.opacity = .5;
//            event.dataTransfer.setData('Text', this.id);
      console.log(event.type);
      console.log(event.target);
      console.log(dragged);
    }, false);

    document.addEventListener("dragend", function (event) {
      event.target.style.opacity = "";
    }, false);

    /* events fired on the drop targets */
    document.addEventListener("dragover", function (event) {
      event.preventDefault();
    }, false);

    document.addEventListener("dragenter", function (event) {
      if (event.target.className === "column") {
        event.target.style.background = "yellow";
//                console.log(event.type);
//                console.log(dragged);
      }
    }, false);

    document.addEventListener("dragleave", function (event) {
      if (event.target.className === "column") {
        event.target.style.background = "";
      }
    }, false);

    document.addEventListener("drop", function (event) {
      event.preventDefault();
      if (event.target.className === "column") {
        var or = objCards.map(function (x) {
          return x.cid;
        }).indexOf(Number(dragged.id));
        event.target.style.background = "";
        dragged.parentNode.removeChild(dragged);
        event.target.appendChild(dragged);
        objCards[or].status = event.target.id;
//                console.log(objCards[dragged.id].status);
        console.log('Status: ' + objCards[or].tid + '/' + objCards[or].status + '/' + or);
        if (event.target.id === "trash") {
          var conf;
          if (confirm('Do you actually want to remove card?') === true) {
            dragged.parentNode.removeChild(dragged);
            conf = 'Card' + objCards[or].tid + ' was removed';
            objCards.splice(or, 1);
          } else {
            conf = "You can drag and drop it to other status";
          }
        }
      }
    }, false);

//create new card
    document.addEventListener("dblclick", function (event) { //create new card
      //remove  select
      if (window.getSelection)
        window.getSelection().removeAllRanges();
      else if (document.selection)
        document.selection.empty();

      if (event.target.className === "column") {
//                alert(event.target.id);
        console.log(objCards);
        var l = objCards.length;
//                alert('l '+l);
        if (l !== 0) {
          var n = 1 + Math.max.apply(Math, objCards.map(function (obj) {
            return obj.cid;
          })); //find next cid of objCards
        } else {
          var n = 0;
        }

        var div = document.createElement("div");
        div.setAttribute("id", n);
        div.setAttribute("draggable", "true");
        div.className = "card";
        div.innerHTML = '<span id="tid' + n + '">' + '#' + 'tid' + '</span>' + '<span id="name' + n + '"> ' + 'name' + '</span>' + '<span class="bug-button" id="bug' + n + '">' + 'Bug' + '</span>' + '<span class="task-button" id="task' + n + '">' + 'Task' + '</span>';
        document.getElementById(event.target.id).appendChild(div);
        objCards.push({ tid: "a", name: "b", type: "c", status: event.target.id, cid: n });
      }
    }, false);

//edit card

    var edited = null;
    document.addEventListener("dblclick", function (event) {
      if (event.target.className === "card") {
        if (edited != null) {
          document.getElementById('bug' + edited + '').style.visibility = "hidden";
          document.getElementById('task' + edited + '').style.visibility = "hidden";
          document.getElementById('tid' + edited + '').style.background = "";
          document.getElementById('name' + edited + '').style.background = "";
        }

        edited = event.target.id;
//                alert(edited);
        document.getElementById('tid' + edited + '').setAttribute("contenteditable", 'true');
        document.getElementById('name' + edited + '').setAttribute("contenteditable", 'true');
        document.getElementById('tid' + edited + '').style.background = "yellow";
        document.getElementById('name' + edited + '').style.background = "yellow";
        document.getElementById('bug' + edited + '').style.visibility = "visible";
        document.getElementById('task' + edited + '').style.visibility = "visible";
      }
    }, false);

//complete edit by selecting the "type" buttons

    document.addEventListener("click", function (event) {
      var o = objCards.map(function (x) {
        return x.cid;
      }).indexOf(Number(edited)); //find corresponding index of objCards for 'n'
      if (event.target.id === 'bug' + edited + '') {
        document.getElementById(edited).style.background = "rgb(243, 204, 204)";
        objCards[o].type = "bug";
        document.getElementById('bug' + edited + '').style.visibility = "hidden";
        document.getElementById('task' + edited + '').style.visibility = "hidden";
        document.getElementById('tid' + edited + '').setAttribute("contenteditable", 'false');
        document.getElementById('name' + edited + '').setAttribute("contenteditable", 'false');
        document.getElementById('tid' + edited + '').style.background = "";
        document.getElementById('name' + edited + '').style.background = "";
        objCards[o].tid = document.getElementById('tid' + edited + '').innerHTML.replace(/#/g, '');
        objCards[o].name = document.getElementById('name' + edited + '').innerHTML.replace(/&nbsp;/g, '');
        edited = null;
      }
      else if (event.target.id === 'task' + edited + '') {
        document.getElementById(edited).style.background = "rgb(207, 226, 242)";
        objCards[o].type = "task";
        document.getElementById('bug' + edited + '').style.visibility = "hidden";
        document.getElementById('task' + edited + '').style.visibility = "hidden";
        document.getElementById('tid' + edited + '').setAttribute("contenteditable", 'false');
        document.getElementById('name' + edited + '').setAttribute("contenteditable", 'false');
        document.getElementById('tid' + edited + '').style.background = "";
        document.getElementById('name' + edited + '').style.background = "";
        objCards[o].tid = document.getElementById('tid' + edited + '').innerHTML.replace(/#/g, '');
        objCards[o].name = document.getElementById('name' + edited + '').innerHTML.replace(/&nbsp;/g, '');
        edited = null;
      }

//            console.log(objCards);
    }, false);

//Put object to Local Store
    document.getElementById("btn1").onclick = function () {
      if(typeof(Storage) !== "undefined") {

        if (confirm('Do you actually want to save the object in Local Storage?') === true) {
          localStorage.setItem('objCardsLocal', JSON.stringify(objCards));
        }

      } else {
        alert("Sorry, no web storage support!");
      }
    };
  }
};

//Function to control the visibility of buttons
function buttonVisibility() {
  document.getElementById('btn1').style.display = "inline";
  document.getElementById('btn2').style.display = "none";
  document.getElementById('btn3').style.display = "none";
}
