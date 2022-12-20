import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    const myCanvas = document.getElementById("myMove");
    const otherCanvas = document.getElementById("otherMove");
    const myCtx = myCanvas.getContext("2d");
    const otherCtx = otherCanvas.getContext("2d");

    let width = myCanvas.offsetWidth;
    let height = myCanvas.offsetHeight;

    let way = 10;
    let wall = 10;
    let side = 14;

    let cell = (width - 2 * side + wall) / 8 - wall;

    let color_way = "#8888ff";
    let color_side = "#6e6e6e";
    let color_wall_exist = "#6e6e6e";
    let color_wall_clear = "#282828";
    let color_wall_exist_move = "#3c3c3c";

    let myField = [];
    let otherField = [];

    let myPosition = 0;
    let otherPosition = 0;

    function start()
    {
      //здесь должно присваиваться myField и otherField текущим лабиринтам
      for(let i = 0; i < 64; i++)
        myField[i] = 0;
      for(let i = 0; i < 8; i++)
        myField[i] += 1;
      for(let i = 56; i < 64; i++)
        myField[i] += 4;
      for(let i = 0; i < 64; i += 8)
        myField[i] += 8;
      for(let i = 7; i < 64; i += 8)
        myField[i] += 2;

      otherField = JSON.parse(localStorage.getItem('field'));

      create();
    }

    function create_road(ctx, position, rotation)
    {
      let new_position = (rotation & 10) > 0 ? (rotation === 2 ? position + 1 : position - 1) :
          (rotation === 4 ? position + 8 : position - 8);
      ctx.beginPath();
      if ((rotation & 10) > 0)
        ctx.rect(side + cell / 2 - way / 2 + ((rotation === 2 ? position : new_position) % 8) * (cell + wall),
          side + cell / 2 - way / 2 + Math.floor(position / 8) * (cell + wall), cell + wall + way, way);
      else
        ctx.rect(side + cell / 2 - way / 2 + (position % 8) * (cell + wall), side + cell / 2 - way / 2 +
          Math.floor((rotation === 4 ? position : new_position) / 8) * (cell + wall), way, cell + wall + way);
      ctx.fillStyle = color_way;
      ctx.fill();
      ctx.closePath();
      return new_position;
    }

    function create_position(ctx, position)
    {
      ctx.beginPath();
      ctx.arc(side + cell / 2 + (position % 8) * (cell + wall), side + cell / 2 + Math.floor(position / 8)
          * (cell + wall), way/2, 0, Math.PI * 2, true);
      ctx.fillStyle = "#0000ff";
      ctx.fill();
      ctx.closePath();
    }

    function create_wall(ctx, position, rotation, is_exist, color)
    {
      if (rotation === 1)
        position -= 8;
      if (rotation === 2)
        position += 1;

      ctx.beginPath();
      if ((rotation & 4) > 0)
        ctx.rect(side - ((is_exist) ? wall : 0) + (position % 8) * (cell + wall),
            side + cell + Math.floor(position / 8) * (cell + wall),
            cell + ((is_exist) ? 2 * wall : 0), wall);
      else
        ctx.rect(side - wall + (position % 8) * (cell + wall),
            side - ((is_exist) ? wall : 0) + Math.floor(position / 8) * (cell + wall),
            wall, cell + ((is_exist) ? 2 * wall : 0));

      ctx.fillStyle = color;

      ctx.fill();
      ctx.closePath();
    }

    function move(rotation, isClear, isMyTurn)
    {
      let ctx = isMyTurn ? myCtx : otherCtx;
      let position = isMyTurn ? myPosition : otherPosition;
      if (!isClear)
        create_wall(ctx, position,
            rotation, true, color_wall_exist)
      else
      {
        position = create_road(ctx, position, rotation);
        create_position(ctx, position);
        if (isMyTurn)
          myPosition = position;
        else
          otherPosition = position;
      }
    }

    function create()
    {
      //horizontal walls
      for(let i = 0; i < 56; i++)
        create_wall(myCtx, i, 4, false, color_wall_clear);
      //vertical walls
      for(let i = 0; i < 64; i++)
        if (i % 8 !== 0)
          create_wall(myCtx, i, 8, false, color_wall_clear);

      //horizontal walls
      for(let i = 0; i < 56; i++)
        if ((otherField[i] & 4) === 4)
          create_wall(otherCtx, i, 4, true, color_wall_exist_move);
        else
          create_wall(otherCtx, i, 4, false, color_wall_clear);

      //vertical walls
      for(let i = 0; i < 64; i++)
        if (i % 8 !== 0)
        {
          if ((otherField[i] & 8) === 8)
            create_wall(otherCtx, i, 8, true, color_wall_exist_move);
          else
            create_wall(otherCtx, i, 8, false, color_wall_clear);
        }

      create_position(myCtx, 0);
      create_position(otherCtx, 0);

      otherCtx.beginPath();

      otherCtx.rect(0, 0, width, side);
      otherCtx.rect(0, 0, side, height);
      otherCtx.rect(width-side, 0, side, height);
      otherCtx.rect(0, height-side, width, side);

      otherCtx.fillStyle = color_side;
      otherCtx.fill();
      otherCtx.closePath();

      myCtx.beginPath();

      myCtx.rect(0, 0, width, side);
      myCtx.rect(0, 0, side, height);
      myCtx.rect(width-side, 0, side, height);
      myCtx.rect(0, height-side, width, side);

      myCtx.fillStyle = color_side;
      myCtx.fill();
      myCtx.closePath();
    }

    const button_up = document.getElementById("up");
    const button_right = document.getElementById("right");
    const button_down = document.getElementById("down");
    const button_left = document.getElementById("left");
    button_up.addEventListener('click', (event) =>
    { move(1, true, true); });
    button_right.addEventListener('click', (event) =>
    { move(2, true, true); });
    button_down.addEventListener('click', (event) =>
    { move(4, true, true); });
    button_left.addEventListener('click', (event) =>
    { create(); move(8, true, true); });

    async function set_other_labyrinth()
    {
      fetch('/set_other_labyrinth')
          .then(response => response.json())
          .then(results => { localStorage.setItem('field', JSON.stringify(results)); start(); });
    }

    set_other_labyrinth().then(r => r);
  }
}
