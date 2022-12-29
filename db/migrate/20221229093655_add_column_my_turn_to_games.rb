class AddColumnMyTurnToGames < ActiveRecord::Migration[7.0]
  def change
    add_column :games, :turn, :boolean
  end
end
