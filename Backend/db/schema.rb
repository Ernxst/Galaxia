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

ActiveRecord::Schema.define(version: 2021_12_09_114147) do

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

end
