class AddColumnWinToGames < ActiveRecord::Migration[7.0]
  def change
    add_column :games, :win, :boolean
  end
end
