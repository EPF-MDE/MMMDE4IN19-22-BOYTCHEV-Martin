document.addEventListener("DOMContentLoaded", function (event) {
    let student_list = document.querySelector("ul");
    let link = document.createElement('a');
    link.textContent = 'Click here to add a student';
    link.setAttribute('href', '/students/create');
    student_list.append(link);
});         

let button = document.querySelector("#test");
button.addEventListener('click', function() {
    alert("CLICKED!");
});

