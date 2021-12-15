FactoryBot.define do
  factory :simulation_asteroid_belt, class: 'Sim::SimulationAsteroidBelt' do
    asteroid_belt
  end

  factory :simulation_moon, class: 'Sim::SimulationMoon' do
    moon
  end

  factory :simulation_planet, class: 'Sim::SimulationPlanet' do
    planet
    after(:create) do |sim_planet|
      create_list :simulation_moon, 1, simulation_planet: sim_planet
    end
  end

  factory :celestial_body, class: Celestial do
    name { Faker::Space.planet }
    caption { Faker::Lorem.sentence(word_count: 2) }
    short_description { Faker::Lorem.sentence(word_count: 8) }
    description { Faker::Lorem.paragraphs(number: 2).join("\n") }

    mass { Faker::Number.number(digits: 24) }
    mean_velocity { Faker::Number.within(range: 4000..65000) }
    axial_tilt { Faker::Number.within(range: 0.0..Math::PI) }
    day_length do
      tidally_locked = Faker::Boolean.boolean(true_ratio: 0.33)
      tidally_locked ? 0 : Faker::Number.within(range: 0.0..1000000)
    end
  end

  factory :orbiting_body, parent: :celestial_body, class: Celestial::Orbitable do
    semi_major { Faker::Number.within(range: 0.25..55) }
    eccentricity { Faker::Number.within(range: 0..0.96) }
    semi_minor { (1 - eccentricity ** 2.0) * semi_major }
    inclination { Faker::Number.within(range: 0..2 * Math::PI) }
    orbital_period { Faker::Number.within(range: 0.279..60182) }
  end

  factory :planet, parent: :orbiting_body, class: Space::Planet do
    radius { Faker::Number.within(range: 2255..258670) }
    texture
    atmosphere_texture
    bump_map
    specular_map
  end

  factory :moon, parent: :orbiting_body, class: Space::Moon do
    radius { Faker::Number.within(range: 637.1..2548.4) }
    texture
    atmosphere_texture
    bump_map
    specular_map
  end

  factory :star, parent: :celestial_body, class: Space::Star do
    radius { Faker::Number.within(range: 2255..258670) }
    luminosity { Faker::Number.within(range: 3e27 * 0.05..3e27 * 6000000) }
    texture
    atmosphere_texture
  end

  factory :asteroid_belt, parent: :celestial_body, class: Space::AsteroidBelt do
    inner_semi_major { Faker::Number.within(range: 0.25..60) }
    outer_semi_major { Faker::Number.within(range: 0.5..80) }
    inner_eccentricity { Faker::Number.within(range: 0..0.96) }
    outer_eccentricity { Faker::Number.within(range: 0..0.96) }
    inclination { Faker::Number.within(range: 0..2 * Math::PI) }
    depth { Faker::Number.within(range: 1..15) }
    num_of_asteroids { Faker::Number.within(range: 500..100000) }
  end

  factory :texture, class: 'media/texture' do
    name { Faker::Internet.username(specifier: 3) }
    sequence(:filename) { |n| "tex-#{n}-#{Faker::File.file_name}" }
    original_url { Faker::Internet.url }
    width { Faker::Number.within(range: 480..8000) }
    height { Faker::Number.within(range: 240..400) }
    add_attribute(:for) { [:any, :planets, :stars, :moons].sample }

    factory :atmosphere_texture, class: 'media/atmosphere_texture' do
      sequence(:filename) { |n| "atmos-#{n}-#{Faker::File.file_name}" }
    end

    factory :bump_map, class: 'media/bump_map' do
      sequence(:filename) { |n| "bump-#{n}-#{Faker::File.file_name}" }
    end

    factory :specular_map, class: 'media/specular_map' do
      sequence(:filename) { |n| "spec-#{n}-#{Faker::File.file_name}" }
    end
  end

  factory :simulation do
    name { Faker::Space.planet }
    description { Faker::Lorem.paragraphs(number: 2).join("\n") }
    star
    trait :user_created do
      user
    end
    after(:create) do |sim|
      create_list :simulation_planet, 3, simulation: sim
      create_list :simulation_asteroid_belt, 1, simulation: sim
    end
  end

  factory :user do
    username { Faker::Internet.username(specifier: 3) }
    password { Faker::Internet.password(min_length: 3, max_length: 24, mix_case: true, special_characters: true) }
  end
end
