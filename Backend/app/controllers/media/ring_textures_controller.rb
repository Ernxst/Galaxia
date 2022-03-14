class Media::RingTexturesController < Media::BaseTexturesController
  def initialize
    super
    @record = Media::RingTexture
    @folder = "ring_textures"
  end
end
