# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_12_12_223704) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "atmosphere_textures", force: :cascade do |t|
    t.string "name", null: false
    t.string "filename", null: false
    t.string "original_url", default: ""
    t.integer "width", null: false
    t.integer "height", null: false
    t.integer "for", default: 0
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "bump_maps", force: :cascade do |t|
    t.string "name", null: false
    t.string "filename", null: false
    t.string "original_url", default: ""
    t.integer "width", null: false
    t.integer "height", null: false
    t.integer "for", default: 0
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "moons", force: :cascade do |t|
    t.string "name", null: false
    t.string "caption", default: ""
    t.string "description", default: ""
    t.string "short_description", default: ""
    t.float "mass", null: false
    t.float "mean_velocity", null: false
    t.float "axial_tilt", null: false
    t.float "day_length", null: false
    t.float "semi_major", null: false
    t.float "semi_minor", null: false
    t.float "eccentricity", null: false
    t.float "inclination", null: false
    t.float "orbital_period", null: false
    t.float "radius", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "texture_id"
    t.bigint "atmosphere_texture_id"
    t.bigint "bump_map_id"
    t.bigint "specular_map_id"
    t.index ["atmosphere_texture_id"], name: "index_moons_on_atmosphere_texture_id"
    t.index ["bump_map_id"], name: "index_moons_on_bump_map_id"
    t.index ["specular_map_id"], name: "index_moons_on_specular_map_id"
    t.index ["texture_id"], name: "index_moons_on_texture_id"
  end

  create_table "planets", force: :cascade do |t|
    t.string "name", null: false
    t.string "caption", default: ""
    t.string "description", default: ""
    t.string "short_description", default: ""
    t.float "mass", null: false
    t.float "mean_velocity", null: false
    t.float "axial_tilt", null: false
    t.float "day_length", null: false
    t.float "semi_major", null: false
    t.float "semi_minor", null: false
    t.float "eccentricity", null: false
    t.float "inclination", null: false
    t.float "orbital_period", null: false
    t.float "radius", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "texture_id"
    t.bigint "atmosphere_texture_id"
    t.bigint "bump_map_id"
    t.bigint "specular_map_id"
    t.index ["atmosphere_texture_id"], name: "index_planets_on_atmosphere_texture_id"
    t.index ["bump_map_id"], name: "index_planets_on_bump_map_id"
    t.index ["specular_map_id"], name: "index_planets_on_specular_map_id"
    t.index ["texture_id"], name: "index_planets_on_texture_id"
  end

  create_table "preset_simulations", force: :cascade do |t|
    t.string "name", null: false
    t.string "description", default: ""
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "specular_maps", force: :cascade do |t|
    t.string "name", null: false
    t.string "filename", null: false
    t.string "original_url", default: ""
    t.integer "width", null: false
    t.integer "height", null: false
    t.integer "for", default: 0
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "stars", force: :cascade do |t|
    t.string "name", null: false
    t.string "caption", default: ""
    t.string "description", default: ""
    t.string "short_description", default: ""
    t.float "mass", null: false
    t.float "mean_velocity", null: false
    t.float "axial_tilt", null: false
    t.float "day_length", null: false
    t.float "radius", null: false
    t.float "luminosity", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.bigint "texture_id"
    t.bigint "atmosphere_texture_id"
    t.index ["atmosphere_texture_id"], name: "index_stars_on_atmosphere_texture_id"
    t.index ["texture_id"], name: "index_stars_on_texture_id"
  end

  create_table "textures", force: :cascade do |t|
    t.string "name", null: false
    t.string "filename", null: false
    t.string "original_url", default: ""
    t.integer "width", null: false
    t.integer "height", null: false
    t.integer "for", default: 0
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "users", force: :cascade do |t|
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "username"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  add_foreign_key "moons", "atmosphere_textures"
  add_foreign_key "moons", "bump_maps"
  add_foreign_key "moons", "specular_maps"
  add_foreign_key "moons", "textures"
  add_foreign_key "planets", "atmosphere_textures"
  add_foreign_key "planets", "bump_maps"
  add_foreign_key "planets", "specular_maps"
  add_foreign_key "planets", "textures"
  add_foreign_key "stars", "atmosphere_textures"
  add_foreign_key "stars", "textures"
end
