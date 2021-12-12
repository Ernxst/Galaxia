class CreateStars < ActiveRecord::Migration[6.1]
  def change
    create_table :stars do |t|
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

      # Spherical Body
      t.float :radius, null: false

      # Star
      t.float :luminosity, null: false, limit: 20

      t.timestamps
    end

    # Textured Body
    add_reference :stars, :texture, foreign_key: true, column: :texture_id
    add_reference :stars, :atmosphere_texture, foreign_key: true, column: :atmosphere_texture_id
  end
end
