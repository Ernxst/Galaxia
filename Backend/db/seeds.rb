require "json"

puts "=== Seeding Database (seeds.rb) ==="

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

@bodies = {}

def seed_celestial_bodies(arr, record)
  arr.each do |data|
    params = data.except(:texture, :bump_map, :specular_map, :atmosphere)
    params[:texture_id] = Media::Texture.find_by_filename(data[:texture]).id unless data[:texture].nil?
    params[:atmosphere_texture_id] = Media::AtmosphereTexture.find_by_filename(data[:atmosphere]).id unless data[:atmosphere].nil?
    params[:bump_map_id] = Media::BumpMap.find_by_filename(data[:bump_map]).id unless data[:bump_map].nil?
    params[:specular_map_id] = Media::SpecularMap.find_by_filename(data[:specular_map]).id unless data[:specular_map].nil?
    @bodies[params[:name]] = record.create(params)
  end
end

tex_data = get_data('db/seeds/celestial-bodies.json')
seed_celestial_bodies(tex_data[:planets], Space::Planet)
seed_celestial_bodies(tex_data[:stars], Space::Star)
seed_celestial_bodies(tex_data[:moons], Space::Moon)
seed_celestial_bodies(tex_data[:asteroid_belts], Space::AsteroidBelt)

def seed_simulations(arr)
  arr.each do |sim|
    star = @bodies[sim[:star]]
    simulation = Simulation.create(name: sim[:name], description: sim[:description], star: star)
    sim[:planets].each do |planet|
      body = @bodies[planet[:name]]
      sim_planet = Sim::SimulationPlanet.create(simulation: simulation, planet: body)
      planet[:moons].each do |moon|
         Sim::SimulationMoon.create(moon: @bodies[moon], simulation_planet: sim_planet)
      end
    end
    sim[:asteroid_belts].each do |asteroid_belt|
      body = @bodies[asteroid_belt]
      Sim::SimulationAsteroidBelt.create(simulation: simulation, asteroid_belt: body)
    end
  end
end

sim_data = get_data('db/seeds/simulations.json')
seed_simulations(sim_data[:simulations])

puts "=== Database Seeded (seeds.rb) ==="
