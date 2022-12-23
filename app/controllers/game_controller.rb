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
    player = Labyrinth.find_by(user_id: Current.user.id)
    if player.present?
      Labyrinth.update(id: Current.user.id, labyrinth: params[:field])
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

  def set_other_labyrinth
    lab = Labyrinth.find_by(user_id: Current.user.id).labyrinth
    if lab.present?
      render json: lab
    else
      redirect_to "/edit_labyrinth", alert: "We could not find a labyrinth with for this user."
    end
  end
end
