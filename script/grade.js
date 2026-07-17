// 강의 3과목 점수 입력 → 평균 및 합격 여부 계산

function startGradeCalculator() {
  let subjects = ["HTML", "CSS", "JavaScript"];
  let total = 0;

  for (let i = 0; i < subjects.length; i++) {
    let score = Number(prompt(subjects[i] + " 점수를 입력하세요."));
    total += score;
  }

  let average = total / subjects.length;
  let result = average >= 60 ? "합격" : "불합격";

  alert(
    "총점: " + total + "점, 평균: " + average + ", 결과: " + result + "입니다!",
  );
}

document
  .getElementById("startGrade")
  .addEventListener("click", startGradeCalculator);
