
const dropdown = document.getElementsByClassName("dropdown-btn");



for (let i = 0; i < dropdown.length; i++) {
  dropdown[i].addEventListener("click", ()=>{
    dropdown[i].classList.toggle("active");
    const dropdownContent = dropdown[i].nextElementSibling;
    if (dropdownContent.style.display === "block") {
      dropdownContent.style.display = "none";

    } else {
      dropdownContent.style.display = "block";
    }
  });
}

const download = document.getElementById("download")
    download.addEventListener("click",(e)=>{
        const pdf = document.getElementById("print");
        html2pdf().from(pdf).save();
    })


