class CreateLabyrinths < ActiveRecord::Migration[7.0]
  def change
    create_table :labyrinths do |t|
      t.string :labyrinth

      t.timestamps
    end
  end
end
