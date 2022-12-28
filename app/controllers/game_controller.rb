require 'json'

class GameController < ApplicationController
  before_action :authenticate_user!
  def create_lobby
    current_user.create_game
    @token = Game.find_by(user_id: Current.user.id)
  end

  def join_lobby
    game = Game.find_by(id: params[:token])
    if game.present?
      game.update(opponent: Current.user.id)
      redirect_to main_path
    else
      redirect_to '/join', alert: "Invalid token"
    end
  end

  def cancel
    game = Game.find_by(user_id: Current.user.id)
    game.destroy! if game.present?
    redirect_to root_path
  end

  def edit_labyrinth

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
    if new_move / 100 == 1
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
    else
      render json: -1
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

  def set_other_labyrinth
    other_id = Game.find_by(user_id: Current.user.id).opponent
    unless other_id.present?
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
end
