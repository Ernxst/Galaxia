class CreatePlanets < ActiveRecord::Migration[6.1]
  def change
    create_table :planets do |t|
      # Base Object
      t.string :name, null: false
      t.string :caption, default: ""
      t.string :description, default: ""
      t.string :short_description, default: ""

      # Celestial Body
      t.float :mass, null: false, limit: 12
      t.float :mean_velocity, null: false
      t.float :axial_tilt, null: false
      t.float :day_length, null: false

      # Orbiting Body
      t.float :semi_major, null: false
      t.float :semi_minor, null: false
      t.float :eccentricity, null: false
      t.float :inclination, null: false
      t.float :orbital_period, null: false

      # Spherical Body
      t.float :radius, null: false

      t.timestamps
    end

    # Textured Body
    add_reference :planets, :texture, foreign_key: true, column: :texture_id
    add_reference :planets, :atmosphere_texture, foreign_key: true, column: :atmosphere_texture_id
    add_reference :planets, :bump_map, foreign_key: true, column: :bump_map_id
    add_reference :planets, :specular_map, foreign_key: true, column: :specular_map_id
  end
end
