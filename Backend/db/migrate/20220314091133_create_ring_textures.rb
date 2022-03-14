class CreateRingTextures < ActiveRecord::Migration[6.1]
  def change
    create_table :ring_textures do |t|
      t.string :name, null: false
      t.string :filename, null: false
      t.string :original_url, null: true, default: ""
      t.integer :width, null: false
      t.integer :height, null: false
      t.boolean :circular, null: false
      t.integer :for, default: 0
      t.timestamps
    end
  end
end
