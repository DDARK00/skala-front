// 강의 3과목 점수 입력 → 평균 및 합격 여부 계산

function startGradeCalculator() {
    var subjects = ["HTML", "CSS", "JavaScript"];
    var total = 0;

    for (var i = 0; i < subjects.length; i++) {
        var score = Number(prompt(subjects[i] + " 점수를 입력하세요."));
        total += score;
    }

    var average = total / subjects.length;
    var result = average >= 60 ? "합격" : "불합격";

    alert("총점: " + total + "점, 평균: " + average + ", 결과: " + result + "입니다!");
}

document.getElementById("startGrade").addEventListener("click", startGradeCalculator);