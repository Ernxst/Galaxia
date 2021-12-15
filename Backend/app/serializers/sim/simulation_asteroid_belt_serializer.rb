class Sim::SimulationAsteroidBeltSerializer < ActiveModel::Serializer
  belongs_to :asteroid_belt, class_name: 'Space::AsteroidBelt'

  def attributes(requested_attrs = nil, reload = nil)
    super.merge(object.asteroid_belt.attributes)
  end
end