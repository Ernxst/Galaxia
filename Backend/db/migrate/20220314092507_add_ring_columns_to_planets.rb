class AddRingColumnsToPlanets < ActiveRecord::Migration[6.1]
  def change
    add_column :planets, :tilt, :float, default: 0
    add_column :planets, :inner_radius, :float, default: 0
    add_column :planets, :outer_radius, :float, default: 0
    add_reference :planets, :ring_texture, foreign_key: true, column: :ring_texture_id
  end
end
