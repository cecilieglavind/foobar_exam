"use strict";

//////////////////////////////////////////////////////////////////////////////
////////                        GLOBAL VARIABLE                    //////////
//////////////////////////////////////////////////////////////////////////////
let template_bartender = document.querySelector("#bartender_template").content;
let template_beerType = document.querySelector("#beertypes_template").content;
let template_orders = document.querySelector("#order_template").content;
let template_storage = document.querySelector("#storage_template").content;
let template_tabs = document.querySelector("#tabs_template").content;

let data;

//////////////////////////////////////////////////////////////////////////////
////////                          LOAD SITET                       //////////
//////////////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded",loadScript);


//////////////////////////////////////////////////////////////////////////////
////////                        STARTING SCRIPT                   //////////
//////////////////////////////////////////////////////////////////////////////
const queHistory = []; // [30,30,45,55,25,5,15];


function loadScript(){

    data = JSON.parse(FooBar.getData());

    //Clear previous data
    document.querySelector("#bartender_reciever").innerHTML = '';
    document.querySelector("#beerInfo_reciever").innerHTML = '';
    document.querySelector("#customerOrder_reciever").innerHTML = '';
    document.querySelector("#storage_reciever").innerHTML = '';
    document.querySelector("#tabs_reciever").innerHTML = '';



//////////////////////////////////////////////////////////////////////////////
////////                            QUE                             //////////
//////////////////////////////////////////////////////////////////////////////

    // console.log("Queue: ", data.queue);
    queHistory.push( data.queue.length );

    if( queHistory.length > 32 ) // hvor mange punkter der må være i grafen, før den scroller
    {
        // console.log("scroll queueueueu");
        queHistory.shift();
    }
    drawQueueHistory();


//////////////////////////////////////////////////////////////////////////////
////////                       BARTENDERS                          //////////
//////////////////////////////////////////////////////////////////////////////

                // BARTENDERS
                data.bartenders.forEach(function(e){
        
                            // CLONING THE TEMPLATES
                            let clone_bartender = template_bartender.cloneNode(true);

                            // PUTTING STUFF INTO THE TEMPLATE
                            clone_bartender.querySelector(".person_name").textContent = e.name;

                            let Person_name = e.name.toLowerCase();
                            clone_bartender.querySelector(".person_img img").src = "img/"+Person_name+".jpg";


                            // IF STATEMED WITH THE DOT STATUS
                            if(e.status == "READY"){
                                clone_bartender.querySelector(".prik_status").style.background = "#21cd92";
                                clone_bartender.querySelector(".status_text").textContent = e.status;
                            }
                            
                            else if(e.status == "WORKING"){
                                clone_bartender.querySelector(".prik_status").style.background = "#ff0000";
                                clone_bartender.querySelector(".status_text").textContent = e.status;
                            }
                            
                            else if (e.status == "BREAK"){
                                clone_bartender.querySelector(".prik_status").style.background = "#d9d9d9";
                                clone_bartender.querySelector(".status_text").textContent = e.status;
                            }


                            // APPENDING THE STUFF TO THE TEMPLATE RECIEVER
                            document.querySelector("#bartender_reciever").appendChild(clone_bartender);
                });


//////////////////////////////////////////////////////////////////////////////
////////                          SERVING                           //////////
//////////////////////////////////////////////////////////////////////////////
                        data.serving.forEach(function(e){
                                            
                            // CLONE TEMPLATE FOR ORDERS
                            let clone_orders = template_orders.cloneNode(true);

                            // ADDING LABELS TO THE BEER TYPE
                            let imgHolder = clone_orders.querySelector(".beers");
                            e.order.forEach(function(anOrder){
                                let beertype = data.beertypes.find(function(el){
                                    return el.name === anOrder
                                });
                                // console.log(beertype)
                                let img = document.createElement('img');
                                img.src= "img/new_type/"+beertype.label;
                                imgHolder.appendChild(img)

                            });

                            // APPENDING IT TO THE HTML
                            document.querySelector("#customerOrder_reciever").appendChild(clone_orders);
                        });

//////////////////////////////////////////////////////////////////////////////
////////                        TABS                                //////////
//////////////////////////////////////////////////////////////////////////////

                        data.taps.forEach(function(e){

                            let clone_tabs = template_tabs.cloneNode(true);

                            clone_tabs.querySelector(".bar_indhold").textContent = e.level;
                            
                            // Some math, that calc the change, and changing the % of the bar_info
                            if(e.level == 2500){
                                clone_tabs.querySelector(".bar_indhold").style.background = "linear-gradient(0, #f09819 100%, #f3efef 0%)";
                            
                            } else {
                                // console.log(e.level);
                                let filledValue = ((e.level * 10)/25)/10;
                                let restValue = 100 - filledValue;
                                // console.log(filledValue);
                                clone_tabs.querySelector(".bar_indhold").style.background = `linear-gradient(0, #f09819 ${filledValue}%, #f3efef ${restValue}%)`;
                            }
                            
                            let beerLabel = e.beer.toLowerCase();
                            clone_tabs.querySelector(".tabs_img img").src = "img/new_type/"+beerLabel+".png";

                            document.querySelector("#tabs_reciever").appendChild(clone_tabs);
                        });


//////////////////////////////////////////////////////////////////////////////
////////                       BEER TYPES                          //////////
//////////////////////////////////////////////////////////////////////////////

                data.beertypes.forEach(function(e){

                            // CLONE TEMPLATE FOR ORDERS
                            let clone_beerType = template_beerType.cloneNode(true);

                            // ADDING STUFF TO THE RIGHT PLACE
                            clone_beerType.querySelector(".beer_name").textContent = e.name;
                            clone_beerType.querySelector(".beer_description").textContent = e.description.overallImpression;
                            
                            // ADDING LABELS TO THE BEER TYPE
                            let beerLabel = e.label;
                            clone_beerType.querySelector(".beer_img img").src = "img/new_type/"+beerLabel;

                            // Click event for details _ MODAL 
                            clone_beerType.querySelector(".beer_details").addEventListener("click",function(){
                                console.log(e.name);

                                document.querySelector(".beer_info_name").textContent = e.name;
                                document.querySelector(".top_information_img img").src = "img/new_type/"+beerLabel;
                                document.querySelector(".categori").textContent = e.category;
                                document.querySelector(".alkoholprocent").textContent = e.alc+"%";
                                document.querySelector(".populær").textContent = e.popularity;
                                document.querySelector(".speed").textContent = e.pouringSpeed;

                                document.querySelector(".appearence").textContent = e.description.appearance;
                                document.querySelector(".aroma").textContent = e.description.aroma;
                                // document.querySelector(".flavor").textContent = e.description.flavor;
                                document.querySelector(".mouthfeel").textContent = e.description.mouthfeel;
                                
                                // Showing modal when the btn is clicked
                                document.querySelector(".modal_window").style.visibility = "visible";

                                document.querySelector(".luk").addEventListener("click",function(){
                                    console.log("close modal")

                                    document.querySelector(".modal_window").style.visibility = "hidden";

                                })
                            });
                        
                            // APPENDING IT TO THE HTML
                            document.querySelector("#beerInfo_reciever").appendChild(clone_beerType);
                });

//////////////////////////////////////////////////////////////////////////////
////////                         STORAGE                          //////////
//////////////////////////////////////////////////////////////////////////////

                    data.storage.forEach(function(e){

                                let clone_storage = template_storage.cloneNode(true);

                                clone_storage.querySelector(".storage_name").textContent = e.name;
                                clone_storage.querySelector(".storage_mount").textContent = e.amount;

                                let lowStorage = e.amount;

                                if(lowStorage < 3) {
                                    clone_storage.querySelector(".storage_wrapper").style.background = "linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)";
                                }

                                // ADDING LABEL TO THE STORAGE
                                let beer_name = e.name.toLowerCase();
                                clone_storage.querySelector(".storage_box img").src = "img/storage/"+beer_name+".svg";

                                // ORDER NOW WINDOWS
                                clone_storage.querySelector(".storage_now").addEventListener("click", function(ex){

                                    // console.log("HEJ")
                                    document.querySelector(".modal_order_kegs").style.display = "block";

                                    document.querySelector(".close").addEventListener("click", function(){

                                        document.querySelector(".modal_order_kegs").style.display = "none";
                                    }) 
                                });
                                document.querySelector("#storage_reciever").appendChild(clone_storage);
                });


//////////////////////////////////////////////////////////////////////////////
////////                       CLOSING TIME                        //////////
//////////////////////////////////////////////////////////////////////////////
                let today = new Date();
                let goalDate = new Date(0, 0, 0, 21, 59, 0, 0);

                document.querySelector(".time_stamp").textContent = (goalDate.getHours() - today.getHours()+" hours & ");
                document.querySelector(".minuts").textContent = (goalDate.getMinutes() - today.getMinutes()+" minuts");            
                
}


//////////////////////////////////////////////////////////////////////////////
////////                         DRAWING QUE                       //////////
//////////////////////////////////////////////////////////////////////////////
function drawQueueHistory() {
                // byg points efter queueHistory
                //<polyline points="15,30 20,30 25,45 30,55 35,25 40,5 45,15" fill="none" stroke="white" />
                let points = "";
                let xStart = 15;
                const xIncrement = 5;

                let x = xStart;

                // data.que på baggrund af vores q
                queHistory.forEach( function(q) {

                    // define pointerne til formel 
                    const top = 6.7;
                    const bot = 52;

                    // Formel der udregner pointsne
                    const y = (1-q/25)*(bot-top)+top;  // Formel udregnet af Peter Lind
                    points+= x+","+y+" ";

                    // hver gang vi har et point gør læg 5 til 
                    x+=xIncrement;
                });

                document.querySelector("#que_reciever polyline").setAttribute("points", points);
}

//////////////////////////////////////////////////////////////////////////////
////////                          MESSAGES                           //////////
//////////////////////////////////////////////////////////////////////////////
                let deleteDivs = document.querySelectorAll(".delete");
                // console.log(deleteDivs);

                // For Loops can execute a block of code a number of times, so we get a array of how many divs, that has the class "delete";
                // and then says that everyone that have this clss, should have an eventlistner and a remove / slide added on click.
                for (let i=0; i<deleteDivs.length;i++) {
                    deleteDivs[i].addEventListener("click",function(ex){

                    let bla = ex.target.parentElement;
                    bla.classList.add("slideOut");
                    
                    bla.addEventListener("animationend", function(){
                        bla.style.display = "none";
                    });
                });
                }

//////////////////////////////////////////////////////////////////////////////
////////                          BURGER MENU                       //////////
//////////////////////////////////////////////////////////////////////////////
                document.querySelector(".burger-menu").addEventListener("click", function(){

                    let menu = document.querySelector(".burger-menu");
                    let menu_text = document.querySelector("#menu_info");
                    
                        menu.classList.toggle("burger-menu--opened");
                        menu.classList.toggle("burger-menu--closed");
                    
                        menu_text.classList.toggle("hide");
                    
                    });

     setInterval(function(){ 
         loadScript();    
     }, 5000);
