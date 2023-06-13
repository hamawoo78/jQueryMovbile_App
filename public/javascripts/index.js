
let itemArray = [];

let ItemObject = function (pTitle,pPicture, pType, pCost, pDescription, pURL) {
    this.ID = Math.random().toString(16).slice(5);
    this.Title = pTitle;
    this.Picture = pPicture;
    this.Type = pType;
    this.Cost = pCost;
    this.Description = pDescription;
    this.URL = pURL;
}

// itemArray.push(new ItemObject("Handmade plate", "https://i.etsystatic.com/8444652/r/il/e49b53/3246849328/il_1588xN.3246849328_po5a.jpg", "Kitchen", "41.50", "cute plate", "https://www.bellevuecollege.edu/"));

document.addEventListener("DOMContentLoaded", function () {
        
    // Select type button
    let Types = ["Home", "Hobby", "Kitchen", "Other"];
    for (let i = 0; i < Types.length; i++) {
        let option = document.createElement("option");
        option.value = Types[i];
        option.text = Types[i];
        document.getElementById("select-type").appendChild(option);
    }

    // Select type button
    for (let i = 0; i < Types.length; i++) {
        let optionEdit = document.createElement("option");
        optionEdit.value = Types[i];
        optionEdit.text = Types[i];
        document.getElementById("select-type-edit").appendChild(optionEdit);
    }

    // add button 
    document.getElementById("buttonAdd").addEventListener("click", function () {
        let newItem = new ItemObject(
            document.getElementById("title").value, 
            document.getElementById("picture").value, 
            selectedType,
            document.getElementById("cost").value, 
            document.getElementById("description").value, 
            document.getElementById("URL").value);

            // console.log(newItem);
        
        
        $.ajax({
            url : "/AddItems",
            type: "POST",
            data: JSON.stringify(newItem),
            contentType: "application/json; charset=utf-8",
            success: function (result) {
                console.log(result);
                document.location.href = "index.html#AllItems";
            }
        });

        alert("Item is added!")
        clear();
    });

    // clear button
    function clear() {
        document.getElementById("title").value = "";
        document.getElementById("picture").value = "";
        document.getElementById("cost").value = "";
        document.getElementById("description").value = "";
        document.getElementById("URL").value = "";
      }
      
    // add function to clear button
    document.getElementById("buttonClear").addEventListener("click", clear);

    let sortOrder = "none"; // Initial sort order

    document.getElementById("buttonSortType").addEventListener("click", function () {
        sortOrder = "Type"; // Set the sort order to "name"
        itemList(sortOrder)
    });

    // sort by cost
    document.getElementById("buttonSortCost").addEventListener("click", function () {
        sortOrder = "Cost"; // Set the sort order to "name"
        itemList(sortOrder)
    });

    // modify item detail
    document.getElementById("buttonModify").addEventListener("click", function () {
        // let id = document.querySelector("[data-id]").getAttribute("data-id");
        // console.log(id);
        // let modifyID = localStorage.getItem('parm');
        
        let newItem = new ItemObject(
            // modifyID,
            document.getElementById("titleE").value, 
            document.getElementById("pictureE").value,
            selectedTypeEdit,
            document.getElementById("costE").value, 
            document.getElementById("descriptionE").value, 
            document.getElementById("URLE").value);

        document.getElementById("EditPage").style.display = "none";
        console.log(newItem);
        modifyItem(newItem); // Pass the id and newItem to the modifyItem function
    });
    




    // button on details page to view 
    document.getElementById("buy").addEventListener("click", function () {
        window.open(document.getElementById("oneURL").innerHTML);
    });


    // item delete
    document.getElementById("buttonDelete").addEventListener("click", function () {
        let localParm = localStorage.getItem('parm');
        deleteItem(localParm);
        //document.location.href= "index.html#AllItems"
    });
    
    // open Edit page
    document.getElementById("openEditPage").addEventListener("click", function () {
        let element = document.getElementById("EditPage");
        element.style.display = "block";
    });

});


    // page before show code *************************************************************************
    $(document).on("pagebeforeshow", "#AllItems", function (event) {   // have to use jQuery 
        itemList()
    });


    // need one for our details page to fill in the info based on the passed in ID
    $(document).on("pagebeforeshow", "#details", function (event) {   
    let localID = localStorage.getItem('parm');  // get the unique key back from the dictionairy
  
    // next step to avoid bug in jQuery Mobile,  force the item array to be current
    itemArray = JSON.parse(localStorage.getItem('itemArray'));  
   
    // let item;

    for (let i = 0; i < itemArray.length; i++) {
        if (itemArray[i].ID === localID) {
            item = itemArray[i];
        }
    }
    document.getElementById("oneID").textContent = item.ID;   
    document.getElementById("onePicture").innerHTML = `<img src="${item.Picture}" alt="${item.Titile}"/>`;
    document.getElementById("oneTitle").textContent = "TITLE: " + item.Title;
    document.getElementById("oneType").textContent = "TYPE: " + item.Type;
    document.getElementById("oneCost").textContent = "COST: $" + item.Cost;
    document.getElementById("oneDescription").textContent = "DESCRIPTION: " + item.Description;
    document.getElementById("oneURL").textContent = item.URL;


    document.getElementById("titleE").value = item.Title;
    document.getElementById("pictureE").value = item.Picture;
    document.getElementById("select-type").value = item.Type; 
    document.getElementById("costE").value = item.Cost;
    document.getElementById("descriptionE").value = item.Description;
    document.getElementById("URLE").value = item.URL;
    });





 
// end of page before show code *************************************************************************

function itemList(sortBy) {
    // clear prior data
   let ul =document.getElementById("myul");
   ul.innerHTML = "";


   $.get("/getAllItems", function(data, status){ 
    itemArray = data; // copy returned server json data into local array
    // now INSIDE this “call back” anonymous fun


    if (sortBy === "Type") 
    {
        itemArray.sort(dynamicSort("Type")); // Sort the array by Type
    } 
    else if (sortBy === "Cost") 
    {
        itemArray.sort(function(a,b){
            return a.Cost - b.Cost;
            }); // Sort the array by cost
    } 

    itemArray.forEach(function (oneItem,) {   // use handy array forEach method
        var myLi = document.createElement('li');
        // adding a class name to each one as a way of creating a collection
        myLi.classList.add('oneItem'); 
        // use the html5 "data-parm" to encode the ID of this particular data object
        // that we are building an li from
        myLi.setAttribute("data-parm", oneItem.ID);
        myLi.innerHTML = `<img src="${oneItem.Picture}" alt="${oneItem.Title}">` + "<br />" + oneItem.Title  + "<br />" + "$ " +oneItem.Cost;
        ul.appendChild(myLi);
    });


    // set up an event for each new li item, 
    var liList = document.getElementsByClassName("oneItem");
    let newItemArray = Array.from(liList);
    newItemArray.forEach(function (element) {
        element.addEventListener('click', function () {
            // get that data-parm we added for THIS particular li as we loop thru them
            var parm = this.getAttribute("data-parm");  // passing in the record.Id
            // get our hidden <p> and save THIS ID value in the localStorage "dictionairy"
            localStorage.setItem('parm', parm);
       
       
       
            // but also, to get around a "bug" in jQuery Mobile, take a snapshot of the
            // current movie array and save it to localStorage as well.
            let stringItemArray = JSON.stringify(itemArray); // convert array to "string"
            localStorage.setItem('itemArray', stringItemArray);
        
            
            // now jump to our page that will use that one item
            document.location.href = "index.html#details";
            });
        });
    });
};

function deleteItem(whitch){
    console.log(whitch);
    // let arrayPointer = GetArrayPointer(whitch);
    // itemArray.splice(arrayPointer,1); 

    $.ajax({
        type: "DELETE",
        url: "/DeleteItem/:" +whitch,
        success: function(result){
            alert(result);
            document.location.href = "index.html#AllItems";
        },
        error: function (xhr, textStatus, errorThrown) {
            alert("Server could not delete Item with ID " + whitch)
            document.location.href = "index.html#AllItems";
        }
    });        
}


  
$(document).bind("change", "#select-type", function (event, ui) {
        selectedType = $('#select-type').val();
    });

  
$(document).bind("change", "#select-type-edit", function (event, ui) {
    selectedTypeEdit = $('#select-type-edit').val();
});

function dynamicSort(property) {
    var sortOrder = 1;

    if (property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function (a, b) {
        if (sortOrder == -1) {
            return b[property].localeCompare(a[property]);
        } else {
            return a[property].localeCompare(b[property]);
        }
    }
}

function modifyItem(newItem){
    newItem.ID = localStorage.getItem('parm');

    $.ajax({
        type: "PUT",
        url: "/ModifyItem/:" +newItem.ID,
        data: JSON.stringify(newItem),
        contentType: "application/json; charset=utf-8",
        success: function(result){
            alert(result);
            document.location.href = "index.html#AllItems";
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Status:  " +textStatus);alert("Error: "+errorThrown)
            document.location.href = "index.html#AllItems";
        }
    });   
}