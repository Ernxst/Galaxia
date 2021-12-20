class CreateAsteroidBelts < ActiveRecord::Migration[6.1]
  def change
    create_table :asteroid_belts do |t|
      # Base Object
      t.string :name, null: false
      t.text :caption, default: ""
      t.text :description, default: ""
      t.text :short_description, default: ""

      # Asteroid Belt
      t.integer :num_of_asteroids, null: false
      t.float :depth, null: false

      # Celestial Body
      t.float :mass, null: false, limit: 12
      t.float :mean_velocity, null: false
      t.float :axial_tilt, null: false
      t.float :day_length, null: false

      # Orbiting Body
      t.float :inner_semi_major, null: false
      t.float :outer_semi_major, null: false
      t.float :inner_eccentricity, null: false
      t.float :outer_eccentricity, null: false
      t.float :inclination, null: false

      t.timestamps
    end
  end
end
