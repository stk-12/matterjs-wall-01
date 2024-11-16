
// 使用モジュール
const Engine = Matter.Engine,
  Render = Matter.Render,
  Runner = Matter.Runner,
  Bodies = Matter.Bodies,
  Composites = Matter.Composites,
  Composite = Matter.Composite,
  MouseConstraint = Matter.MouseConstraint,
  Mouse = Matter.Mouse,
  Events = Matter.Events;

// エンジンの生成
const engine = Engine.create();
const world = engine.world;

// セッティング
const settings = {
  width: window.innerWidth + 200,
  height: window.innerHeight + 100,
  wall: {
    size: 20,
    options: { isStatic: true, render: { opacity: 0 } }
  },
  // pin: {
  //   radius: 30,
  //   options: { isStatic: true, render: { fillStyle: '#ffffff' } }
  // },
  // resetPositions: {
  //   ball1: { x: window.innerWidth / 2, y: window.innerHeight / 4 },
  //   ball2: { x: window.innerWidth / 2, y: window.innerHeight - 50 }
  // }
}

// レンダラーの生成
const render = Render.create({
  element: document.querySelector('.js-canvas'),
  engine: engine,
  options: {
    width: settings.width,
    height: settings.height,
    wireframes: false, // ワイヤーフレーム
    background: null, // 背景色を透明
  }
});

// レンダラーとエンジンの実行
Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);


// ブロックのスタック生成
const blockWidth = 100;
const blockHeight = 100;
const columns = Math.ceil(settings.width / blockWidth) - 1;
const rows = Math.ceil(settings.height / blockHeight) - 1;

const stack = Composites.stack(0, -blockHeight / 2, columns, rows, 0, 0, (x, y) => {
    return Bodies.rectangle(x, y, blockWidth, blockHeight, {
      // isStatic: true, // 静的なオブジェクトにする
      density: 1.0, // 重さ
      restitution: 0.0, // 弾性
      friction: 0.8, // 摩擦
      render: {
        fillStyle: '#222222'
      }
    });
});

// 床の生成
const createWalls = () => [
  Bodies.rectangle(settings.width / 2, settings.height + settings.wall.size / 2, settings.width + blockWidth * 2, settings.wall.size, settings.wall.options), // 下の壁
];

// ワールドにすべてのボディ（オブジェクト）を追加
Composite.add(world, [stack, ...createWalls()]);



// マウス制御
const mouse = Mouse.create(render.canvas);
const mouseConstraint = MouseConstraint.create(engine, {
  mouse: mouse,
  constraint: {
    stiffness: 0.2,
    render: {
        visible: false
    }
  }
});
Composite.add(world, mouseConstraint);
render.mouse = mouse;


// リサイズ設定
window.addEventListener('resize', () => {
  render.options.width = window.innerWidth;
  render.options.height = window.innerHeight;
  render.canvas.width = window.innerWidth;
  render.canvas.height = window.innerHeight;

  Composite.clear(world, false, true);
  Composite.add(world, [...createWallsAndPins()]);
});