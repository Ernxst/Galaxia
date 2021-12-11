class CreateAtmosphereTextures < ActiveRecord::Migration[6.1]
  def change
    create_table :atmosphere_textures do |t|
      t.string :name, null: false
      t.string :filename, null: false
      t.string :original_url, null: true, default: ""
      t.integer :width, null: false
      t.integer :height, null: false
      t.integer :for, default: 0
      t.timestamps
    end
  end
end
