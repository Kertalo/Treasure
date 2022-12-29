require 'json'

class GameController < ApplicationController
  before_action :authenticate_user!

  def edit_labyrinth

  end

  def play
    game = Game.find_by(user_id: Current.user.id)
    if game.present?
      if game.opponent.present?
        redirect_to main_path
      end
    end
  end

  def create_lobby
    if have_labyrinth?
      current_user.create_game
      token = Game.find_by(user_id: Current.user.id)
      token.update(turn: true)
      redirect_to '/create_page', alert: "Your Lobby Token: " + token.id.to_s
    else
      redirect_to '/home', alert: "You have to create a labyrinth"
    end
  end

  def join_lobby
    if have_labyrinth?
      game1 = Game.find_by(id: params[:token])
      if game1.present?
        game1.update(opponent: Current.user.id)
        game2 = current_user.create_game(opponent: game1.user_id)
        game2.update(turn: false)
        redirect_to '/join', alert: "You have successfully connected!"
      else
        redirect_to '/join', alert: "Invalid token"
      end
    else
      redirect_to '/home', alert: "You have to create a labyrinth"
    end
  end

  def cancel
    game = Game.find_by(user_id: Current.user.id)
    game.destroy! if game.present?
    redirect_to root_path
  end

  def exit
    game1 = Game.find_by(user_id: Current.user.id)
    if game1.present?
      game2 = Game.find_by(user_id: game1.opponent)
      game1.destroy! if game1.present?
      game2.destroy! if game2.present?
    end
  end

  def save_labyrinth
    labyrinth = Labyrinth.find_by(user_id: Current.user.id)
    if labyrinth.present?
      labyrinth.update(labyrinth: params[:field])
    else
      current_user.create_labyrinth(labyrinth: params[:field])
    end
    redirect_to "/edit_labyrinth"
  end

  def reset_labyrinth
    lab = Labyrinth.find_by(user_id: Current.user.id).labyrinth
    if lab.present?
      render json: lab
    else
      redirect_to "/edit_labyrinth", alert: "We could not find a labyrinth with for this user."
    end
  end

  def move(rotation)
    new_move = User.find_by(id: Current.user.id).move
    new_move = new_move % 100
    other_id = Game.find_by(user_id: Current.user.id).opponent
    unless other_id.present?
      other_id = Game.find_by(opponent: Current.user.id).user_id
    end
    labyrinth = JSON.parse(Labyrinth.find_by(user_id: other_id).labyrinth)
    if (labyrinth[new_move] & rotation) != rotation
      if rotation == 1
        new_move -= 8
      else
        if rotation == 2
          new_move += 1
        else
          if rotation == 4
            new_move += 8
          else
            new_move -= 1
          end
        end
      end
      user1 = User.find_by(id: Current.user.id)
      user2 = User.find_by(id: other_id)
      user1.update(move: new_move)
      if (labyrinth[new_move] & 16) == 16
        render json: 2
      else
        user2.update(move: (user2.move % 100) + 100)
        render json: 1
      end
    else
      user = User.find_by(id: Current.user.id)
      user.update(move: new_move + 100)
      render json: 0
    end
  end

  def move_up
    move(1)
  end

  def move_right
    move(2)
  end

  def move_down
    move(4)
  end

  def move_left
    move(8)
  end

  def update_labyrinth
    other_id = Game.find_by(user_id: Current.user.id).opponent
    unless other_id.present?
      other_id = Game.find_by(opponent: Current.user.id).user_id
    end
    if other_id.present?
      render json: User.find_by(id: other_id).move
    else
      render json: nil
    end
  end

  def get_turn
    if game_exist?
      game = Game.find_by(user_id: Current.user.id)
      render json: game.turn
    else
      render json: 666
      redirect_to home_path, alert: "This game session no longer exists!"
    end
  end

  def set_turn
    game1 = Game.find_by(user_id: Current.user.id)
    game1.update(turn: false)
    game2 = Game.find_by(user_id: game1.opponent)
    game2.update(turn: true)
  end

  def set_other_labyrinth
    game = Game.find_by(user_id: Current.user.id)
    if game.present?
      other_id = game.opponent
    else
      other_id = Game.find_by(opponent: Current.user.id).user_id
    end
    if other_id.present?
      user1 = User.find_by(id: Current.user.id)
      user2 = User.find_by(id: other_id)
      user1.update(move: 100)
      user2.update(move: 0)
    end
    lab = Labyrinth.find_by(user_id: Current.user.id).labyrinth
    if lab.present?
      render json: lab
    else
      redirect_to "/edit_labyrinth", alert: "We could not find a labyrinth with for this user."
    end
  end

  def get_win
    game1 = Game.find_by(user_id: Current.user.id)
    if game1.present?
      if game1.win
        render json: true
        return
      end
      game2 = Game.find_by(user_id: game1.opponent)
      if game2.present?
        if game2.win
          render json: true
          return
        end
      end
    end
    render json: false
  end

  def win
    game1 = Game.find_by(user_id: Current.user.id)
    if game1.present?
      game2 = Game.find_by(user_id: game1.opponent)
      game2.update(win: true)
      game1.update(win: true)
    end
  end

  private def game_exist?
    game1 = Game.find_by(user_id: Current.user.id)
    if game1.present?
      game2 = Game.find_by(user_id: game1.opponent)
      if game2.present?
        return true
      end
    end
    false
  end
end
