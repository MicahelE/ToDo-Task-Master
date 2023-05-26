let db;
// This is what our customer data looks like.
const customerData = [
    { time: "6.00pm", name: "Friday", task: "My task", email: "bill@company.com" },
    { time: "2.00pm", name: "tony", task: "This task", email: "anthony@home.org" },
  ];

const request = indexedDB.open("MyTestDatabase");
request.onerror = (event) => {
  console.error("Why didn't you allow my web app to use IndexedDB?!");
};
request.onupgradeneeded  = (event) => {
  db = event.target.result;

  
  const objectStore= db.createObjectStore("todo",{ autoIncrement: true });

  customerData.forEach((customer)=>{
    objectStore.add(customer)
  });

  let newStore= db.transaction(["todo"], "readwrite").objectStore("todo");
  console.log(newStore);
  customerData.forEach((customer)=>{
    newStore.add(customer)
  });
};

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
// let tr = document.createElement("tr");

//  tr.setHTML("<tr><th scope='row'>1</th><td>Buy groceries for next week</td><td>In progress</td><td><button type='submit' class='btn btn-danger'>Delete</button><button type='submit' class='btn btn-success ms-1'>Finished</button></td></tr>");

button.addEventListener("click", ()=> {

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


  let objectArray = db.transaction('todo').objectStore('todo').getAll();

  objectArray.onsuccess =()=>{

    list.textContent='';  
    let no = 1;
  objectArray.result.forEach((item)=>{
   
    // let newli= document.createElement("li");
    let tr = document.createElement("tr");

    tr.setHTML("<tr><th scope='row'>1</th><td>Buy groceries for next week</td><td>In progress</td><td><button type='submit' class='btn btn-danger'>Delete</button><button type='submit' class='btn btn-success ms-1'>Finished</button></td></tr>");

    tr.getElementsByTagName('td')[0].textContent= item.task;
    tr.getElementsByTagName('th')[0].textContent= no;
    no++;

    // newli.textContent= item.task;
  list.appendChild( tr);
  
 });
}

};
});

const DBOpenRequest = indexedDB.open("MyTestDatabase");

DBOpenRequest.onsuccess = (event) => {
db = DBOpenRequest.result;


  let objectArray = db.transaction('todo').objectStore('todo').getAll();

  objectArray.onsuccess =()=>{

    let no = 1;
  objectArray.result.forEach((item)=>{
    let tr = document.createElement("tr");

    tr.setHTML("<tr><th scope='row'>1</th><td>Buy groceries for next week</td><td>In progress</td><td><button type='submit' class='btn btn-danger'>Delete</button><button type='submit' class='btn btn-success ms-1'>Finished</button></td></tr>");

    tr.getElementsByTagName('td')[0].textContent= item.task;
    tr.getElementsByTagName('th')[0].textContent= no;
    no++;
    // newli.textContent= item.task;
  list.appendChild( tr);
  
 });
}
}
