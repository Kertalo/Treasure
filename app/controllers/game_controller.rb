class GameController < ApplicationController
  def menu

  end

  def loading
    current_user.create_ready_player
  end

  def cancel
    ready = ReadyPlayer.find_by(id: Current.user.id)
    ready.destroy! if ready.present?
    redirect_to menu_path
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
end
