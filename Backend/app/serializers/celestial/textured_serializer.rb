class Celestial::TexturedSerializer < ActiveModel::Serializer
  def attributes(requested_attrs = nil, reload = nil)
    super
    .merge(object.attributes)    
    .except("texture_id", "atmosphere_texture_id", "bump_map_id", "specular_map_id", "ring_texture_id")
    .merge({ 
      texture: get_tex(object.texture, Media::TexturesController),
      atmosphere_texture: get_tex(object.atmosphere_texture, Media::AtmosphereTexturesController),
      specular_map: get_tex(object.specular_map, Media::SpecularMapsController),
      bump_map: get_tex(object.bump_map, Media::BumpMapsController),
      ring_texture: get_tex(object.ring_texture, Media::RingTexturesController)
                })
  end

  def get_tex(tex, controller)
    tex.nil? ? nil : controller.new.get_texture(tex)
  end
end
