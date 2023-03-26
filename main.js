let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

// 엘리스 이미지 넣어보기
let img2 = new Image();
img2.src = 'elice.png';
img2.onload = () => {
  elice.draw();
};


let elice = {
  x: 10,
  y: 200,
  width: 45,
  height: 45,
  draw() {
    ctx.fillStyle = 'green';
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(img2, this.x, this.y);
  }
}

// 장애물이미지 넣어보기
let img1 = new Image();
img1.src = 'jsjs.png';
img1.onload = () => {
  cactus.draw();
};

// elice.draw();

class Cactus {
  constructor() {
    this.x = 500;
    this.y = 200;
    this.width = 50;
    this.height = 50;

  }
  draw() {
    ctx.fillStyle = 'red';
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(img1, this.x, this.y);
  }
}



let cactus = new Cactus();
cactus.draw();

let timer = 0;
let manyCactus = [];
let jumpTimer = 0;
let jumping = false;
let animation;
let jumpCount = 0; // 점프 카운트
let score = 0; // 점수
let startTime = Date.now();

// 점수시스템
function updateScore() {
  let elapsedTime = Date.now() - startTime;
  score = Math.floor(elapsedTime / 100); // 1초당 10점으로 계산
  document.getElementById('score').textContent = score;
}

// 랜덤으로 나오게 하기
// function getRandomFloat(min, max) {
//   return Math.random() * (max - min) + min;
// }
// floor로 정수로 바꿔줘서 그런듯?
function getRandomFloat(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function playFrame() {
  animation = requestAnimationFrame(playFrame);
  timer++;
  updateScore();

  //캔버스 클리어
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 2초마다 등장하는 느낌
  // if (timer % 120 === 0) {
  //   let cactus = new Cactus();
  //   manyCactus.push(cactus);
  // }

  // // 랜덤한 시간마다 장애물 등장 1초에서 3초사이 간격으로 등장하게 만듬!!!
  // if (timer % Math.floor(getRandomFloat(1, 3) * 60) === 0) {
  //   let cactus = new Cactus();
  //   manyCactus.push(cactus);
  // }

  // 랜덤한 시간마다 장애물 등장 1초에서 3초사이 간격으로 등장하게 만듬!!!
  // 1초 2초 3초만 나오는 딱딱한 랜덤이 문제
  if (timer % (getRandomFloat(1, 3) * 60) === 0) {
    let cactus = new Cactus();
    manyCactus.push(cactus);
  }

  manyCactus.forEach((a, i, o) => {
    // x좌표가 0미만이면 제거
    if (a.x < 0) {
      o.splice(i, 1)
    }
    a.x -= 6; // 장애물 움직이기
    // 엘리스와 장애물 크러시
    crash(elice, a);

    a.draw();
  })

  // 점프가 되었을때 점프타이머 증가 속도증가를 하려면 점프타이머도 같이 조정해주자
  if (jumping == true) {
    elice.y -= 8;
    jumpTimer += 6;
  }
  // 내려가기
  if (jumping == false) {
    if (elice.y < 200) {
      elice.y += 8;
    }
    else {
      // 점프 카운트를 0으로 초기화를 시켜줘야 여러번 점프를 안함
      jumpCount = 0;
    }
  }
  // 점프티어마가 100이 넘으면 엘리스가 멈춤
  if (jumpTimer > 100) {
    jumping = false;
    jumpTimer = 0; // 점프타이머를 0을 줘야 한번실행한뒤에도 0으로 초기화되어 다시 뜀
  }



  elice.draw();
}

playFrame();

// 충돌 확인
function crash(elice, cactus) {
  let crashX = cactus.x - (elice.x + elice.width); // x축이 부딪히면
  let crashY = cactus.y - (elice.y + elice.height); // y축이 부딪히면
  // 엘리스가 장애물에 부딪히면
  if (crashX < 0 && crashY < 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //클리어
    cancelAnimationFrame(animation);
  }
}

// 스페이스바를 누르면 점핑이 트루가 된다 
document.addEventListener('keydown', function (e) {
  if (e.code === 'Space') {
    // 점프카운트를 2를 줘서 두번점프하게끔 만듬
    if (jumpCount < 2) {
      jumping = true;
      jumpCount++;
    }
  }
})
