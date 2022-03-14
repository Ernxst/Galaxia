class Space::StarSerializer < Celestial::TexturedSerializer
  def attributes(requested_attrs = nil, reload = nil)
    super.except(:bump_map, :specular_map, :ring_texture)
  end
end
