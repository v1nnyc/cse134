class ButtonFactory {
  constructor(type, secondary) {
    let buttonValues = {
      "cancel" : "Cancel",
      "ok" : "Ok"
    };

    let button = document.createElement("button");
    button.innerHTML = buttonValues[(secondary === undefined) ? type : secondary];
    button.id = buttonValues[(secondary === undefined) ? type : secondary];
    button.onclick = closeDialog;
    return button;
  }
}

class MessageFactory {
  constructor(type) {
    let messages = {
      "alert" : "Alert pressed!",
      "confirm" : "Do you confirm this?",
      "prompt" : "What is your name?"
    }
    let message = document.createElement("p");
    message.innerHTML = messages[type];
    return message;
  }
}

class InputFactory {
  constructor(type){
    let ids = {
      "prompt" : "prompt-input"
    }
    let input = document.createElement("input");
    input.id = ids[type]
    return input;
  }
}

class AlertDialog {
  constructor() {
    let alertDiv = document.createElement("div");
    alertDiv.id = "alertDiv";
    alertDiv.appendChild(new MessageFactory("alert"));
    alertDiv.appendChild(new ButtonFactory("alert", "ok"));
    this.contents = alertDiv;
  }
}

class ConfirmDialog {
  constructor() {
    let confirmDiv = document.createElement("div");
    confirmDiv.id = "confirmDiv";
    confirmDiv.appendChild(new MessageFactory("confirm"));
    confirmDiv.appendChild(new ButtonFactory("confirm", "ok"));
    confirmDiv.appendChild(new ButtonFactory("confirm", "cancel"));

    this.contents = confirmDiv;
  }
}

class PromptDialog {
  constructor() {
    let confirmDiv = document.createElement("div");
    confirmDiv.id = "promptDiv";
    confirmDiv.appendChild(new MessageFactory("prompt"));
    confirmDiv.appendChild(new InputFactory("prompt"));
    confirmDiv.appendChild(document.createElement("br"))
    confirmDiv.appendChild(new ButtonFactory("prompt", "ok"));
    confirmDiv.appendChild(new ButtonFactory("prompt", "cancel"));
    this.contents = confirmDiv;
  }
}

function assign() {
  let methods = {
    "alert": function() {
      return (new AlertDialog()).contents;
    },
    "confirm": function() {
      return (new ConfirmDialog()).contents;
    },
    "prompt": function() {
      return (new PromptDialog()).contents;
    }
  }

  let buttons = document.getElementById('buttons').children;

  for (let i = 0; i < buttons.length; i++) {
    let child = buttons[i];
    document.getElementById(child.id).addEventListener("click", function() {
      clearBoxThen(appendToDialog(methods[child.id]()));
    });
  }
}

function appendToDialog(contents) {
  dialog.removeChild(dialog.firstChild);
  dialog = openDialog();
  dialog.appendChild(contents);
}

function assignOutput(string){
  document.getElementById("output").innerHTML = string;
}

let closeOptions = {
  "alertDiv" : {
    "Ok" : function(){/*just close*/}
  },
  "confirmDiv" : {
    "Ok" : function(){
      showBox();
      assignOutput("Confirm result: true");
    },
    "Cancel" : function(){
      showBox();
      assignOutput("Confirm result: false")
    }
  },
  "promptDiv" : {
    "Ok" : function(){
      showBox();
      assignOutput("Prompt result: " + DOMPurify.sanitize((document.getElementById("prompt-input").value || "User didn’t enter anything")));
    },
    "Cancel" : function(){
      showBox();
      assignOutput("Prompt result: User didn’t enter anything")
    }
  }
}

function closeDialog() {
  document.getElementById("gray-out").hidden = true;
  closeOptions[this.parentNode.id][this.id]();
  document.getElementById("dialog").open = false;
}

function showBox() {
  document.getElementById("table").hidden = false;
}

function openDialog() {
  document.getElementById("gray-out").hidden = false;
  let dialog = document.getElementById("dialog")
  dialog.open = true;
  return dialog;
}

function clearBoxThen(callback) {
  document.getElementById("table").hidden = true;
}
