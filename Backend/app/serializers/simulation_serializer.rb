class SimulationSerializer < ActiveModel::Serializer
  attributes :id, :name, :description, :star, :planets, :asteroid_belts, :user_id
  has_many :simulation_planets, class_name: 'Sim::SimulationPlanet', key: 'planets', dependent: :destroy
  has_many :simulation_asteroid_belts, class_name: 'Sim::SimulationAsteroidBelt', key: 'asteroid_belts'

  def star
    Space::StarSerializer.new(object.star)
  end

  def planets
    object.simulation_planets
  end

  def asteroid_belts
    object.simulation_asteroid_belts
  end
end