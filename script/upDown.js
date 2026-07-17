// 업다운 숫자 맞추기 게임

function startUpDownGame() {
  let computerNum = Math.floor(Math.random() * 50) + 1;
  let tryCount = 0;
  let guess;

  while (true) {
    guess = prompt("1부터 50 사이의 숫자를 맞춰보세요!");

    // 취소를 누르면 게임 중단
    if (guess === null) {
      return;
    }

    guess = Number(guess);
    tryCount++;

    if (guess > computerNum) {
      alert("Down!");
    } else if (guess < computerNum) {
      alert("Up!");
    } else {
      alert("축하합니다! " + tryCount + "번 만에 맞추셨습니다.");
      break;
    }
  }
}

document
  .getElementById("startUpDown")
  .addEventListener("click", startUpDownGame);
