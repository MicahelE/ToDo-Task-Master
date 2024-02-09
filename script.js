let db;
// This is what our customer data looks like.
const customerData = [
    { time: "6.00pm", name: "Friday", task: "My task", email: "bill@company.com" },
    { time: "2.00pm", name: "tony", task: "This task", email: "anthony@home.org" },
  ];

// const request = window.indexedDB.open("MyTestDatabase");
// request.onerror = (event) => {
//   console.error("Why didn't you allow my web app to use IndexedDB?!");
//   alert('Error loading database.')
// };
// request.onupgradeneeded  = (event) => {
//   db = event.target.result;
//   db.onerror = (event) => {
//     alert('Error loading database.');
//   };
  
//   const objectStore= db.createObjectStore("todo",{ autoIncrement: true });

//   customerData.forEach((customer)=>{
//     objectStore.add(customer)
//   });

//   let newStore= db.transaction(["todo"], "readwrite").objectStore("todo");
//   console.log(newStore);
//   customerData.forEach((customer)=>{
//     newStore.add(customer)
//   });
// };






// const DBOpenRequest = indexedDB.open("MyTestDatabase");

// DBOpenRequest.onsuccess = (event) => {


 
//   db = DBOpenRequest.result;
//   let newStore= db.transaction(["todo"], "readwrite").objectStore("todo");
//   console.log(newStore);
//   customerData.forEach((customer)=>{
//     newStore.add(customer)
//   });
  
// };

let button= document.getElementById("submit");
let todoText= document.getElementById("todo");
let list= document.getElementById("list");
let li = document.createElement("li");
let delButtons = document.querySelectorAll('.delete');

button.addEventListener("click", fetch);




function fetch (){

  const DBOpenRequest = indexedDB.open("MyTestDatabase");

DBOpenRequest.onsuccess = (event) => {

   // store the result of opening the database in the db
  // variable. This is used a lot below
  db = DBOpenRequest.result;
  let newStore= db.transaction(["todo"], "readwrite").objectStore("todo");
  let newData={};
  newData.time=new Date();
  newData.task=todoText.value;
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

    tr.setHTML("<tr><th scope='row'>1</th><td>Buy groceries for next week</td><td>In progress</td><td><button type='submit' class='btn btn-danger'>Delete</button><button type='submit' class='btn btn-success ms-1'>Finished</button></td></tr>");

        tr.getElementsByTagName('td')[0].textContent= cursor.value.task;
        tr.getElementsByTagName('th')[0].textContent= no;
        no++;
        list.appendChild( tr);
        console.log(key, value, cursor.key);
        cursor.continue();
    }
    else {
        // no more results
    }

    
  // objectArray.result.forEach((item)=>{
   
    // let newli= document.createElement("li");
    // let tr = document.createElement("tr");

    // tr.setHTML("<tr><th scope='row'>1</th><td>Buy groceries for next week</td><td>In progress</td><td><button type='submit' class='btn btn-danger'>Delete</button><button type='submit' class='btn btn-success ms-1'>Finished</button></td></tr>");

    // tr.getElementsByTagName('td')[0].textContent= item.task;
    // tr.getElementsByTagName('th')[0].textContent= no;
    // no++;

    // newli.textContent= item.task;
  // list.appendChild( tr);
  
//  });
}

};
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

const DBOpenRequest = indexedDB.open("MyTestDatabase");

DBOpenRequest.onupgradeneeded = (event) => {
  db = event.target.result;

  db.transaction(["todo"], "readwrite").objectStore("todo");
}


DBOpenRequest.onsuccess = (event) => {
db = DBOpenRequest.result;


  let objectArray = db.transaction('todo').objectStore('todo').openCursor();
  let no = 1;
  objectArray.onsuccess =(event)=>{
    // list.textContent='';  
    


    let cursor = event.target.result;
    if (cursor) {
        let key = cursor.primaryKey;
        let value = cursor.value;
        let tr = document.createElement("tr");

    tr.innerHTML="<tr><th scope='row'>1</th><td>Buy groceries for next week</td><td>In progress</td><td><button type='submit' class='btn btn-danger'>Delete</button><button type='submit' class='btn btn-success ms-1 delete '>Finished</button></td></tr>";
        tr.dataset.value= key;
        tr.getElementsByTagName('td')[0].textContent= cursor.value.task;
        tr.getElementsByTagName('th')[0].textContent= no;
        // console.log(tr, tr.getElementsByTagName('th')[0]);
        no++;
       list.appendChild(tr);
        // console.log(value, cursor.key);
        cursor.continue();
    }
    delButtons = document.querySelectorAll('.delete');
    delButtons.forEach((btn)=>{
      btn.addEventListener('click', deleted);
      }
      );
    
  
}

}


