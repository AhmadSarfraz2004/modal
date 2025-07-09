document.addEventListener("DOMContentLoaded", function () {
    const submitBtn = document.querySelector(".submit-btn");
    const tableBody = document.querySelector(".result-table tbody");
    const resultModal = document.getElementById("resultModal");
    const resultModalLabel = document.getElementById("resultModalLabel");
    const resultForm = document.getElementById("resultForm");

    let studentResult = [];
    let editingIndex = -1;

    loadFromLocalStorage();;
    insertToTable(studentResult);

    submitBtn.addEventListener("click", function () {

        const name = document.getElementById("name").value.trim();
        const english = parseInt(document.getElementById("english").value);
        const mathematics = parseInt(document.getElementById("mathematics").value);
        const computer = parseInt(document.getElementById("computer").value);
        const islamiat = parseInt(document.getElementById("islamiat").value);

        if (name.length === 0 ||
            isNaN(english) ||
            isNaN(mathematics) ||
            isNaN(computer) ||
            isNaN(islamiat)
        ) {
            alert("Please fill all fields correctly!");
            return;
        }

        else if (
            english < 0 || english > 100 ||
            mathematics < 0 || mathematics > 100 ||
            computer < 0 || computer > 75 ||
            islamiat < 0 || islamiat > 50

        ) {
            alert("Please enter valid marks!");
            return;
        }

        const totalMarks = 350;  // 100 + 100 + 75 + 50
        const obtainedMarks = english + mathematics + computer + islamiat;
        const percentage = ((obtainedMarks / totalMarks) * 100).toFixed(0);
        const percent = parseInt(percentage);


        let grade = "";
        if (percent >= 80) grade = "A+";
        else if (percent >= 70) grade = "A";
        else if (percent >= 60) grade = "B";
        else if (percent >= 50) grade = "C";
        else if (percent >= 40) grade = "D";
        else if (percent >= 33) grade = "E";
        else grade = "F";


        const isSubjectFail =
            (english / 100) * 100 < 33 ||
            (mathematics / 100) * 100 < 33 ||
            (computer / 75) * 100 < 33 ||
            (islamiat / 50) * 100 < 33;

        const status = isSubjectFail ? "Fail" : (percent >= 33 ? "Pass" : "Fail");
        
        const student = {
            name,
            english,
            mathematics,
            computer,
            islamiat,
            totalMarks,
            obtainedMarks,
            percentage,
            grade,
            status
        };


        if (editingIndex > -1) {
            studentResult[editingIndex] = student;
            editingIndex = -1;
            submitBtn.textContent = "Submit";
            resultModalLabel.textContent = "Add Details";
        } else {
            studentResult.push(student);
        }

        saveToLocalStorage(studentResult);
        insertToTable(studentResult);

        resultForm.reset();

        const resultModalInstance = bootstrap.Modal.getInstance(resultModal);
        if (resultModalInstance) {
            resultModalInstance.hide();
        }
    });

    tableBody.addEventListener("click", function (event) {
        if (event.target.classList.contains("pen-icon")) {
            const row = event.target.closest("tr");
            const index = row.dataset.index;
            editDetails(index);
        } else if (event.target.classList.contains("trash-icon")) {
            const row = event.target.closest("tr");
            const index = row.dataset.index;
            deleteDetails(index);
        }
    });

    resultModal.addEventListener('hidden.bs.modal', function () {
        resultForm.reset();
        editingIndex = -1;
        submitBtn.textContent = "Submit";
        resultModalLabel.textContent = "Add Details";
    });

    function insertToTable(dataArray) {
        tableBody.innerHTML = "";

        for (let i = 0; i < dataArray.length; i++) {
            const student = dataArray[i];

            const englishStatus = (student.english / 100) * 100 >= 33 ? 'subPass' : 'subFail';
            const mathStatus = (student.mathematics / 100) * 100 >= 33 ? 'subPass' : 'subFail';
            const computerStatus = (student.computer / 75) * 100 >= 33 ? 'subPass' : 'subFail';
            const islamiatStatus = (student.islamiat / 50) * 100 >= 33 ? 'subPass' : 'subFail';

            const newRow = tableBody.insertRow();
            newRow.dataset.index = i;

            newRow.innerHTML = `
           <td>${i + 1}</td>
            <td>${student.name}</td>
            <td class="${englishStatus}">${student.english} / 100</td>
            <td class="${mathStatus}">${student.mathematics} / 100</td>
            <td class="${computerStatus}">${student.computer} / 75</td>
            <td class="${islamiatStatus}">${student.islamiat} / 50</td>
            <td>${student.totalMarks}</td>
            <td>${student.obtainedMarks}</td>
            <td>${student.percentage}%</td>
            <td>${student.grade}</td>
            <td class="${student.status === 'Pass' ? 'pass' : 'fail'}">${student.status}</td>
            <td>
                <img src="../icons/pen.svg" alt="pen-icon" class="pen-icon">
                <img src="../icons/trash.svg" alt="trash-icon" class="trash-icon">
            </td>
        `;
        }
    }

    function saveToLocalStorage(dataArray) {
        localStorage.setItem("studentResults", JSON.stringify(dataArray));
    }

    function loadFromLocalStorage() {
        const storedResults = localStorage.getItem("studentResults");
        if (storedResults) {
            studentResult = JSON.parse(storedResults);
        }
    }

    function editDetails(index) {
        editingIndex = index;
        const student = studentResult[index];

        document.getElementById("name").value = student.name;
        document.getElementById("english").value = student.english;
        document.getElementById("mathematics").value = student.mathematics;
        document.getElementById("computer").value = student.computer;
        document.getElementById("islamiat").value = student.islamiat;

        resultModalLabel.textContent = "Edit Details";
        submitBtn.textContent = "Update";

        const modal = new bootstrap.Modal(resultModal);
        modal.show();
    }

    function deleteDetails(index) {
        if (confirm("Are you sure you want to delete this record?")) {
            studentResult.splice(index, 1);
            saveToLocalStorage(studentResult);
            insertToTable(studentResult);
        }

    }
});




/* 
-------------------- REFERENCES ------------------
Subject Weightage:
    English: 100 mark
    Mathematics: 100 marks
    Computer Science: 75 marks
    Islamic Studies: 50 marks

Grading Scheme:
    A+ (≥ 80%)
    A (70–79%)
    B (60–69%)
    C (50–59%)
    D (40–49%)
    E (33–39%
    F (< 33%)

Passing Criteria:
    passing criteria is 33% marks in each subject,
*/