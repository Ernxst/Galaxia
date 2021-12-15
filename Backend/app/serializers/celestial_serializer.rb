class CelestialSerializer < ActiveModel::Serializer
  def attributes(requested_attrs = nil, reload = nil)
    super.merge(object.attributes)
  end
end