class Celestial::TexturedSerializer < CelestialSerializer
  def attributes(requested_attrs = nil, reload = nil)
    super.except("texture_id", "atmosphere_texture_id", "bump_map_id", "specular_map_id")
         .merge({ texture: get_tex(object.texture, Media::TexturesController),
                  atmosphere_texture: get_tex(object.atmosphere_texture, Media::AtmosphereTexturesController),
                  specular_map: get_tex(object.specular_map, Media::SpecularMapsController),
                  bump_map: get_tex(object.bump_map, Media::BumpMapsController)
                })
  end

  def get_tex(tex, controller)
    tex.nil? ? nil : controller.new.get_texture(tex)[:url]
  end
end
