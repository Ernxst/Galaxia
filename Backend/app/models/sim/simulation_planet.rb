class Sim::SimulationPlanet < ApplicationRecord
  self.table_name = "simulation_planets"

  belongs_to :planet, class_name: 'Space::Planet'
  belongs_to :simulation

  has_many :simulation_moons, class_name: 'Sim::SimulationMoon', dependent: :destroy
end
