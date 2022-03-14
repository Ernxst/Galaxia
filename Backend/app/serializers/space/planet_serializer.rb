class Space::PlanetSerializer < Celestial::TexturedSerializer
  def attributes(requested_attrs = nil, reload = nil)
    super
  .except("tilt", "inner_radius", "outer_radius")
  .except(:ring_texture)
  .merge({
      ring: { 
      tilt: object.tilt, 
      texture: get_ring_tex(object.ring_texture), 
      inner_radius: object.inner_radius,
      outer_radius: object.outer_radius, 
      circular: object.ring_texture.nil? ? false : object.ring_texture.circular
    }
  })
  end

  def get_ring_tex(tex)
    tex.nil? ? nil : Media::RingTexturesController.new.get_texture(tex)
  end
end
