import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  connect() {
    const myCanvas = document.getElementById("myMove");
    const otherCanvas = document.getElementById("otherMove");
    const myCtx = myCanvas.getContext("2d");
    const otherCtx = otherCanvas.getContext("2d");

    let width = myCanvas.offsetWidth;
    let height = myCanvas.offsetHeight;
    let wall = 10;
    let side = 14;

    let cell = (width - 2 * side + wall) / 8 - wall;

    let color_side = "#6e6e6e";
    let color_wall_exist = "#6e6e6e";
    let color_wall_clear = "#282828";
    let color_wall_exist_move = "#5a5a5a";
    let color_wall_clear_move = "#3c3c3c";

    let myField = [];
    let otherField = [];

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
    }

    function create_wall(ctx, is_horizontal, is_exist, i, color)
    {
      ctx.beginPath();
      if (is_horizontal)
        ctx.rect(side - ((is_exist) ? wall : 0) + (i % 8) * (cell + wall),
            side + cell + Math.floor(i / 8) * (cell + wall),
            cell + ((is_exist) ? 2 * wall : 0), wall);
      else
        ctx.rect(side + cell + Math.floor(i / 8) * (cell + wall),
            side - ((is_exist) ? wall : 0) + (i % 8) * (cell + wall),
            wall, cell + ((is_exist) ? 2 * wall : 0));

      ctx.fillStyle = color;

      ctx.fill();
      ctx.closePath();
    }

    function create()
    {
      otherCtx.beginPath();
      otherCtx.clearRect(0, 0, width, height);
      otherCtx.closePath();

      //horizontal walls
      /*for(let i = 0; i < 56; i++)
        if ((field[i] & 4) === 4)
          create_wall(true, true, i, color_wall_exist);
        else
          create_wall(true, false, i, color_wall_clear);

      //vertical walls
      for(let i = 0; i < 56; i++)
        if ((field[Math.floor(i / 8) + (i % 8) * 8] & 2) === 2)
          create_wall(false, true, i, color_wall_exist);
        else
          create_wall(false, false, i, color_wall_clear);*/

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

    start();
    create();
  }
}
