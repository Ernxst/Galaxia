class Media::AtmosphereTexturesController < Media::BaseTexturesController
  def initialize
    super
    @record = Media::AtmosphereTexture
    @folder = "atmosphere_textures"
  end
end
