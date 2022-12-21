class Createlabyrinths2 < ActiveRecord::Migration[7.0]
  def change
    create_table :labyrinths do |t|
      t.string :labyrinth
      t.references :user, null: false, foreign_key: {on_delete: :cascade}
      t.timestamps
    end
  end
end
