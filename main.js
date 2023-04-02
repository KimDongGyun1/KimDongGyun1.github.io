let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;

// 장애물이미지 넣어보기
let img1 = new Image();
img1.src = 'jsjs.png';
img1.onload = () => {
  cactus.draw();
};

// 엘리스 이미지 넣어보기
let img2 = new Image();
img2.src = 'elice.png';
img2.onload = () => {
  elice.draw();
};

// 당근 이미지 넣어보기
let img3 = new Image();
img3.src = 'carrot.jpeg';
img3.onload = () => {
  carrot.draw();
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

// 당근 클래스
class Carrot {
  constructor() {
    this.x = 500;
    this.y = 100;
    this.width = 30;
    this.height = 30;

  }
  draw() {
    ctx.fillStyle = 'blue';
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(img3, this.x, this.y);
  }
}

let cactus = new Cactus();
let carrot = new Carrot();
cactus.draw();
carrot.draw();

let timer = 0;
let manyCactus = [];
let manyCarrot = [];
let jumpTimer = 0;
let jumping = false;
let animation;
let jumpCount = 0; // 점프 카운트
let score = 0; // 점수
let carrotScore = 0; // 당근 충돌 시 증가한 점수
let startTime = Date.now();


// 점수시스템
function updateScore() {
  let elapsedTime = Date.now() - startTime;
  score = Math.floor(elapsedTime / 10) + carrotScore; // 당근 충돌 시 증가한 점수를 더함
  document.getElementById('score').textContent = score;
}

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


  // 랜덤한 시간마다 장애물 등장 1초에서 3초사이 간격으로 등장하게 만듬!!!
  // 1초 2초 3초만 나오는 딱딱한 랜덤이 문제
  if (timer % (getRandomFloat(1, 4) * 60) === 0) {
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

  if (timer % (getRandomFloat(2.5, 4.5) * 60) === 0) {
    let carrot = new Carrot();
    manyCarrot.push(carrot);
  }

  manyCarrot.forEach((a, i, o) => {
    // x좌표가 0미만이면 제거
    if (a.x < 0) {
      o.splice(i, 1)
    }
    a.x -= 6; // 장애물 움직이기
    // 엘리스와 장애물 크러시
    crash_carrot(elice, a);

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
  let crashX = elice.x + elice.width > cactus.x;
  let crashY = elice.y + elice.height > cactus.y;
  if (crashX && crashY) {
    cancelAnimationFrame(animation); // 게임 종료
    alert('Game Over');
    location.reload(); // 페이지 새로고침
  }
}

// 당근과 충돌
function crash_carrot(elice, carrot) {
  let crashX = elice.x + elice.width > carrot.x;
  let crashY = elice.y + elice.height > carrot.y;
  if (crashX && crashY) {
    // 엘리스와 당근이 부딪혔을때
    manyCarrot.shift(); // 당근 제거
    carrotScore += 500; // 점수 증가 값 저장
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
