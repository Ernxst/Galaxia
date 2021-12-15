class Sim::SimulationPlanetSerializer < ActiveModel::Serializer
  belongs_to :planet, class_name: 'Space::Planet'
  has_one :planet, class_name: 'Space::Planet'
  has_many :simulation_moons, class_name: 'Sim::SimulationMoon', dependent: :destroy

  def attributes(requested_attrs = nil, reload = nil)
    super
      .merge(Space::PlanetSerializer.new(object.planet).attributes)
      .merge({ moons: object.simulation_moons.map do |moon|
        Sim::SimulationMoonSerializer.new(moon).attributes
      end })
  end
end