class CreateSimulationMoons < ActiveRecord::Migration[6.1]
  def change
    create_table :simulation_moons do |t|
      t.timestamps
    end

    add_reference :simulation_moons, :moon, foreign_key: true, column: :moon_id
    add_reference :simulation_moons, :simulation_planet, foreign_key: true, column: :simulation_planet_id
  end
end
