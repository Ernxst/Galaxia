class Sim::SimulationMoon < ApplicationRecord
  self.table_name = "simulation_moons"

  belongs_to :moon, class_name: 'Space::Moon'
  belongs_to :simulation_planet, class_name: 'Sim::SimulationPlanet'
end
