let db;
// This is what our customer data looks like.
const customerData = [
    { time: "6.00pm", name: "Friday", task: "My task", email: "bill@company.com" },
    { time: "2.00pm", name: "tony", task: "This task", email: "anthony@home.org" },
  ];

  // import EasySpeech from 'easy-speech'
  

  EasySpeech.detect()



let button= document.getElementById("submit");
let todoText= document.getElementById("todo");
let date= document.getElementById("date");
let list= document.getElementById("list");
let li = document.createElement("li");
let delButtons = document.querySelectorAll('.delete');

let notificationBtn = document.getElementById('enable');

button.addEventListener("click", fetch);

// date.value=new Date().toJSON()
// getFullYear, getMonth, getDate, getHours, getMinutes all return values of local time.
const convertToDateTimeLocalString = (timevalue) => {
  const year = timevalue.getFullYear();
  const month = (timevalue.getMonth() + 1).toString().padStart(2, "0");
  const day = timevalue.getDate().toString().padStart(2, "0");
  const hours = timevalue.getHours().toString().padStart(2, "0");
  const minutes = timevalue.getMinutes().toString().padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
const currentTime = new Date()
date.value = convertToDateTimeLocalString(currentTime)


// window.onload = (event) => {
//   if (!Notification.permission=="granted")
//   {
//     askNotificationPermission();
//   }
//   console.log("windows don load")
// };

$( document ).ready(function() {
  
  setTimeout(() => {  notificationBtn.click() }, 1500) 

    
  console.log("windows don load")
});

function fetch (){

  const DBOpenRequest = indexedDB.open("MyTestDatabase");

if (!(date.value=='' || todoText.value=='') ) {  
  DBOpenRequest.onsuccess = (event) => {

   // store the result of opening the database in the db
  // variable. This is used a lot below
  db = DBOpenRequest.result;
  let newStore= db.transaction(["todo"], "readwrite").objectStore("todo");
  let newData={};
  newData.time=date.value;
  newData.task=todoText.value;
  newData.notified="no";
  newStore.add(newData);


  let objectArray = db.transaction('todo').objectStore('todo').openCursor();

  objectArray.onsuccess =(event)=>{
    list.textContent='';  
    let no = 1;


    let cursor = event.target.result;
    if (cursor) {
        let key = cursor.primaryKey;
        let value = cursor.value;
        let tr = document.createElement("tr");

    tr.setHTML("<tr><th scope='row'>1</th><td>Buy groceries for next week</td><td>Time</td><td>In progress</td><td><button type='submit' class='btn btn-danger'>Delete</button><button type='submit' class='btn btn-success ms-1 delete '>Finished</button></td></tr>");

        tr.getElementsByTagName('td')[0].textContent= cursor.value.task;
        tr.getElementsByTagName('td')[1].textContent= new Date(cursor.value.time).toLocaleString();
        tr.getElementsByTagName('th')[0].textContent= no;
        no++;
        list.appendChild( tr);
        console.log(key, value, cursor.key);
        cursor.continue();
    }
    else {
        // no more results
    }

    

}

};
}
}


function deleted() {

let temptr=this.closest('tr');
let remove = db
  .transaction(["todo"], "readwrite")
  .objectStore("todo")
  .delete(parseInt(temptr.dataset.value));
remove.onsuccess = (event) => {
  alert(temptr.dataset.value);
  console.log(temptr.dataset.value);
  temptr.remove();
};

}
function remove(value) {
  let remove = db
  .transaction(["todo"], "readwrite")
  .objectStore("todo")
  .delete(value);
remove.onsuccess = (event) => {
  displayData();
};
 
}
const DBOpenRequest = indexedDB.open("MyTestDatabase");

DBOpenRequest.onerror = (event) => {
  console.log("There is an error o");
};

DBOpenRequest.onsuccess = (event) => {
db = DBOpenRequest.result;

displayData();

}

DBOpenRequest.onupgradeneeded = (event) => {
  db = event.target.result;
  const objectStore= db.createObjectStore("todo",{ autoIncrement: true });
  

}

function checkDeadline() {
  let no = 1;
  
  let objectArray = db.transaction(["todo"], "readwrite").objectStore("todo");

  
  objectArray.openCursor().onsuccess =(event)=>{
    // list.textContent='';  
    


    let cursor = event.target.result;
    if (!cursor) return;

        let key = cursor.primaryKey;
        let value = cursor.value;
        let now = new Date(); 
        let timenow = now.toLocaleString();
        let dbtime= new Date(cursor.value.time).toLocaleString();
        // console.log(cursor.value.time,  '\n' .timenow );
let fas=(timenow == dbtime)
// console.log(fas)
        // console.log("cursor "+cursor.value.time)
        // console.log("date "+timenow)
        if (timenow == dbtime ) {
          // alert("e dey ok");
          // new Notification("Hi there!");
          if (Notification.permission === 'granted') {
            createNotification(cursor.value.task, cursor.primaryKey);
            console.log(cursor.value.task);
          }
          else
          {
            alternateResponse(cursor.value.task, cursor.primaryKey)
          }
        }
       
        cursor.continue();
    
    
    
  
}
}

function alternateResponse(title, key) {
  window.parent.parent.focus()
  speak(title)
    setTimeout(() => {  alert(`HEY! Your task "${title}" is now overdue.`); }, 1000)
    // First open up a transaction
  // const objectStore = db.transaction(['todo'], 'readwrite').objectStore('todo');

  // Get the to-do list object that has this title as its title
  // const objectStoreTitleRequest = objectStore.delete(key);
}

function createNotification(title, key) {
  // Create and show the notification
  
  const img = 'https://mwwire.org/wp-content/uploads/2023/05/Screenshot-2023-05-25-2.33.59-PM.png';
  const text = `HEY! Your task "${title}" is now overdue.`;
  const notification = new Notification('To do list', { body: text, icon: img });
  notification.onclick = function () { 
    window.parent.parent.focus();
};
  notification.onshow=(event)=>{
    // window.parent.parent.focus()
    speak(title)
     callMe(title)
    // textplus=title.replace(/ /g,'+')
    // fetch(`api.callmebot.com/start.php?user=@micahele&text="${textplus}"&lang=en-GB-Standard-B&rpt=2`).then((response) => console.log(textplus))
    setTimeout(() => {  alert(`HEY! Your task "${title}" is now overdue.`); }, 1000);
    
  
};
  console.log(key);
  // We need to update the value of notified to 'yes' in this particular data object, so the
  // notification won't be set off on it again

  // First open up a transaction
  const objectStore = db.transaction(['todo'], 'readwrite').objectStore('todo');

  // Get the to-do list object that has this title as its title
  const objectStoreTitleRequest = objectStore.delete(key);
  
  objectStoreTitleRequest.onsuccess = () => {
    // Grab the data object returned as the result
    // const data = objectStoreTitleRequest.result;

    // Update the notified value in the object to 'yes'
    // data.notified = 'yes';

    // Create another request that inserts the item back into the database
    // const updateTitleRequest = objectStore.put(data);

    // When this new request succeeds, run the displayData() function again to update the display
   
  };
};

function speak(value) {
  // Create a SpeechSynthesisUtterance
  // const utterance = new SpeechSynthesisUtterance("Here is your scheduled task " + value + "is now overdue");


  // Select a voice
  // const voices = speechSynthesis.getVoices();
  // utterance.voice = voices[0];
   // Choose a specific voice

  // Speak the text
  // speechSynthesis.speak(utterance);


  EasySpeech.init({ maxTimeout: 5000, interval: 250 })
    .then(() => console.debug('load complete'))
    .catch(e => console.error(e))

     EasySpeech.speak({
      text: "Here is your scheduled task " + value + "is now overdue",
      pitch: 1,
      rate: 1,
      volume: 1,
      // there are more events, see the API for supported events
      boundary: e => console.debug('boundary reached')
    })
}


function notifyMe() {
  if (!("Notification" in window)) {
    // Check if the browser supports notifications
    alert("This browser does not support desktop notification");
  } else if (Notification.permission === "granted") {
    // Check whether notification permissions have already been granted;
    // if so, create a notification
    const notification = new Notification("Hi there!");
    // Other notification-related actions can be added here
  } else if (Notification.permission !== "denied") {
    // We need to ask the user for permission
    Notification.requestPermission().then((permission) => {
      Notification.permission = permission;
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        const notification = new Notification("Hi there!");
        // Other notification-related actions can be added here
      } else {
        // If permission is denied, you might want to inform the user
        alert("Notification permission has been denied.");
      }
    });
  }
  // At last, if the user has denied notifications,
  // and you want to be respectful, there is no need to bother them anymore.
}

async function playAudio() {
  var audio = new Audio('https://cdn.freesound.org/previews/459/459965_6253486-lq.mp3');  
  audio.type = 'audio/mp3';

  try {
    await audio.play();
    console.log('Playing...');
  } catch (err) {
    console.log('Failed to play...' + err);
  }
}

async function callMe(title) {
  
    const textplus = title.replace(/ /g, '+');
    console.log(textplus);
    const url = `http://api.callmebot.com/start.php?user=@micahele&text=${textplus}&lang=en-GB-Standard-B&rpt=2`;
     fetch(url).then(response => response.text()).then(data => console.log(data))

    
  
}

  function askNotificationPermission() {
    // Function to actually ask the permissions
    function handlePermission(permission) {
      // Whatever the user answers, we make sure Chrome stores the information
      if (!Reflect.has(Notification, 'permission')) {
        Notification.permission = permission;
        
      }

      // Set the button to shown or hidden, depending on what the user answers
      if (Notification.permission === 'denied' || Notification.permission === 'default') {
        notificationBtn.style.display = 'block';
      } else {
        notificationBtn.style.display = 'none';
      }
    };

    // Check if the browser supports notifications
    if (!Reflect.has(window, 'Notification')) {
      console.log('This browser does not support notifications.');
      
    } else {
      if (checkNotificationPromise()) {
        Notification.requestPermission().then(handlePermission);
        
      } else {
        Notification.requestPermission(handlePermission);
        
      }
    }
    // const notification = new Notification("Hi there!");
  };
 // Check whether browser supports the promise version of requestPermission()
  // Safari only supports the old callback-based version
  function checkNotificationPromise() {
    try {
      Notification.requestPermission().then();
    } catch(e) {
      return false;
    }

    return true;
  };

  // Wire up notification permission functionality to 'Enable notifications' button
  notificationBtn.addEventListener('click', askNotificationPermission);


function displayData() {
  

  let no = 1;
  
    let objectArray = db.transaction(["todo"], "readwrite").objectStore("todo");
  
    
    objectArray.openCursor().onsuccess =(event)=>{
      // list.textContent='';  
      
  
  
      let cursor = event.target.result;
      if (cursor) {
          let key = cursor.primaryKey;
          let value = cursor.value;
          let tr = document.createElement("tr");
  
      tr.innerHTML="<tr><th scope='row'>1</th><td>Buy groceries for next week</td><td>Time</td><td>In progress</td><td><button type='submit' class='btn btn-danger'>Delete</button><button type='submit' class='btn btn-success ms-1 delete '>Finished</button></td></tr>";
          tr.dataset.value= key;
          tr.getElementsByTagName('td')[0].textContent= cursor.value.task;
          tr.getElementsByTagName('td')[1].textContent= new Date(cursor.value.time).toLocaleString();
          tr.getElementsByTagName('th')[0].textContent= no;
          // console.log(tr, tr.getElementsByTagName('th')[0]);
          no++;
         list.appendChild(tr);
          // console.log(value, cursor.key);
          cursor.continue();
      }
      // else
      // {
      //   alert('Nothing yet')
      //   console.log("Entries all displayed.");
      // }
      delButtons = document.querySelectorAll('.delete');
      delButtons.forEach((btn)=>{
        btn.addEventListener('click', deleted);
        }
        );
      
    
  }
  }
  setInterval(checkDeadline, 1000);



