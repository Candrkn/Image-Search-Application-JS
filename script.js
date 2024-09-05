const apiKey = "oobYc6CYGcOBn6dGlyldESmqfFMpGlVle43qqQEUR3Q";
const url = "https://api.unsplash.com/search/photos?page=1&query=";

const form = document.querySelector("form");
const searchInput = document.querySelector("#searchInput");
const row = document.querySelector(".row");
const toggleBtn = document.querySelector("#toggleBtn");
const body = document.querySelector("body");
const clearBtn = document.querySelector("#clearBtn");
const select = document.querySelector("select");
const bilgiMesaji = document.querySelector("#bilgiMesaji");

// ! Gece Gunduz modu

toggleBtn.addEventListener("click", function(){
    if(body.classList.contains("dark-mode")){
        body.classList.remove("dark-mode");
        toggleBtn.innerHTML = "Light Mode";
    }else{
        body.classList.add("dark-mode");
        toggleBtn.innerHTML = "Dark Mode";
    }
})

// ! Indırme islemini Gerceklestirecek Fonksiyon

function downloadImage(imageUrl){
    fetch(imageUrl)
    .then(function(response){
        return response.blob();
    })
    .then(function(blob){
        const url = window.URL.createObjectURL(new Blob([blob]));

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "image.jpg");
        body.append(link);
        link.click();
        link.remove();
    })
}

// ! form Submit oldugunda İstek gondermek icin;

let resimler = [];

form.addEventListener("submit", function(e){
    e.preventDefault();

    row.innerHTML = "";

    let searchTerm = searchInput.value;
    let request = `${url}${searchTerm}&client_id=${apiKey}`
    
    fetch(request)
    .then(function(response){
        return response.json();
    })
    .then(function(data){
        console.log(data.results)
        resimler = data.results;

        onYuzeEkle(resimler);
        localStorageyeEkle(resimler);
        searchInput.value ="";
    })
})

// ! Sayfa Yuklendiginde localstoragedan verileri alip ekrana bastırmak icin

window.addEventListener("load", function(){
    const storedResimler = JSON.parse(localStorage.getItem("resimler"));
    if(storedResimler){
        resimler = storedResimler.filter(function(item){
            return !row.innerHTML.includes(item.urls.small);
        });
        onYuzeEkle(resimler)
    }
})

function localStorageyeEkle(resimler){
    localStorage.setItem("resimler", JSON.stringify(resimler))
}

function onYuzeEkle(veriler){
    veriler.forEach(function(veri){
        console.log(veri);

        const downloadBtn = document.createElement("button");
        downloadBtn.classList = "btn btn-primary float-end me-2"
        downloadBtn.innerHTML = "İndir";
        downloadBtn.addEventListener("click", function(){
            downloadImage(veri.urls.full);
        })

        const date = new Date(veri.updated_at)
        const update = date.toLocaleDateString("tr-Tr",{
            month : "long",
            year : "numeric",
        })

        const col = document.createElement("div");
        col.classList = "col-4 mb-3 border border-1 p-2";

        const img = document.createElement("img");
        img.style.width = "100%";
        img.style.height = "250px";
        img.src = veri.urls.small;
        img.style.marginBottom = "15px";
    
        const deleteBtn = document.createElement("button")
        deleteBtn.classList = "btn btn-danger float-end";
        deleteBtn.innerHTML = "Delete";
        deleteBtn.id = "delete";

        const like = document.createElement("p");
        like.innerHTML = `${veri.likes} Likes `

        const updatedDate = document.createElement("p");
        updatedDate.innerHTML = `Update Date : ${update}`

        const photo = document.createElement("p");
        photo.innerHTML = `Uploaded By : ${veri.user.name}`;

        row.append(col);
        col.append(img);
        col.append(deleteBtn);
        col.append(downloadBtn);
        col.append(like);
        col.append(updatedDate);
        col.append(photo);
    })
}

// ! Sil butonuna basildiginda ilgili elemanı sildirmek icin;

row.addEventListener("click",function(e){
    if(e.target.id.includes("delete")){
        let column = e.target.parentElement;

         // ! Sildigimiz elemanı localstoragedan kaldirmak icin

         let deletedIndex = Array.from(row.children).indexOf(column);
         resimler.splice(deletedIndex,1);
         localStorage.setItem("resimler", JSON.stringify(resimler));



        column.remove();

       



        // ! Bilgi mesajini dondurmek icin
        bilgiMesaji.innerHTML = "Photo Deleted"
        bilgiMesaji.classList.add("text-success", "text-center", "fw-bold", "mt-4","bg-warning","p-3");

        setTimeout(function(){
            bilgiMesaji.innerHTML = "";
            bilgiMesaji.classList.remove("text-success", "text-center", "fw-bold", "mt-4","bg-warning","p-3");
        },1500)
    }
})

// ! Temizle Butonuna Basildigi zaman tüm icerigin temizlenmesi;

clearBtn.addEventListener("click", function(e){
    e.preventDefault();
    row.innerHTML = "";

       // ! Bilgi mesajini dondurmek icin
       bilgiMesaji.innerHTML = "Photos Deleted"
       bilgiMesaji.classList.add("text-white", "text-center", "fw-bold", "mt-4","bg-primary","p-3");

       setTimeout(function(){
           bilgiMesaji.innerHTML = "";
           bilgiMesaji.classList.remove("text-white", "text-center", "fw-bold", "mt-4","bg-primary","p-3");
       },1500)
})

// ! Artan Azalan Durumuna gore listelemek;

select.addEventListener("change", function(){
    let seciliDurum = select.value;
    console.log(seciliDurum);

    if(seciliDurum == "Artan"){
        resimler.sort((a,b)=> a.likes - b.likes)
    }else{
        resimler.sort((a,b)=> b.likes - a.likes)
    }
    row.innerHTML="";
    onYuzeEkle(resimler)
})