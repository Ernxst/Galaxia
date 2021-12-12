require "json"

User.create(username: ENV['GUEST_USERNAME'], password: ENV['GUEST_PASSWORD'])

def get_data(filename)
  file = File.open Rails.root.join(filename)
  tex_data = JSON.load(file, { :symbolize_names => true })
  tex_data.deep_transform_keys(&:to_sym)
end

def seed(arr, record)
  arr.each do |data|
    record.create(data)
  end
end

tex_data = get_data('db/seeds/texture-maps.json')
seed(tex_data[:textures], Media::Texture)
seed(tex_data[:bump_maps], Media::BumpMap)
seed(tex_data[:specular_maps], Media::SpecularMap)
seed(tex_data[:atmosphere_textures], Media::AtmosphereTexture)
# seed(tex_data[:ring_textures], Media::RingTexture)

def seed_celestial_bodies(arr, record)
  arr.each do |data|
    params = data.except(:texture, :bump_map, :specular_map, :atmosphere)
    params[:texture_id] = Media::Texture.find_by_filename(data[:texture]).id
    params[:bump_map_id] = Media::BumpMap.find_by_filename(data[:bump_map]).id unless data[:bump_map].nil?
    params[:specular_map_id] = Media::SpecularMap.find_by_filename(data[:specular_map]).id unless data[:specular_map].nil?
    atmosphere_data = data[:atmosphere]
    unless atmosphere_data.nil?
      filename = atmosphere_data[:texture]
      params[:atmosphere_texture_id] = Media::AtmosphereTexture.find_by_filename(filename).id
    end
    record.create(params)
  end
end

tex_data = get_data('db/seeds/celestial-bodies.json')
seed_celestial_bodies(tex_data[:planets], Celestial::Planet)
# seed(tex_data[:stars], Celestial::Star)
# seed(tex_data[:moons], Celestial::Moon)
# seed(tex_data[:asteroid_belts], Celestial::AsteroidBelt)