class Media::TexturesController < Media::BaseTexturesController
  def initialize
    super
    @record = Media::Texture
    @folder = "textures"
  end
end
