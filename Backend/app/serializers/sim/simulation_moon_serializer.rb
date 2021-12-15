class Sim::SimulationMoonSerializer < ActiveModel::Serializer
  belongs_to :moon, class_name: 'Space::Moon'
  has_one :moon, class_name: 'Space::Moon'

  def attributes(requested_attrs = nil, reload = nil)
    Space::MoonSerializer.new(object.moon).attributes
  end
end