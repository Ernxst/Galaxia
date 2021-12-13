require 'rails_helper'

describe Celestial::AsteroidBelt, :type => :model do
  context "when included in a class" do
    subject { Celestial::AsteroidBelt.create(attributes_for(:asteroid_belt)) }

    describe "Validations" do
      it "is valid with valid attributes" do
        expect(subject).to be_valid
      end

      it "is not valid without a depth" do
        subject.depth = nil
        subject.save
        expect(subject.errors[:depth]).not_to be_empty
      end

      it "is not valid without an inner_semi_major" do
        subject.inner_semi_major = nil
        subject.save
        expect(subject.errors[:inner_semi_major]).not_to be_empty
      end

      it "is not valid without an outer_semi_major" do
        subject.outer_semi_major = nil
        subject.save
        expect(subject.errors[:outer_semi_major]).not_to be_empty
      end

      it "is not valid without an inner_eccentricity" do
        subject.inner_eccentricity = nil
        subject.save
        expect(subject.errors[:inner_eccentricity]).not_to be_empty
      end

      it "is not valid without an inclination" do
        subject.inclination = nil
        subject.save
        expect(subject.errors[:inclination]).not_to be_empty
      end

      it "is not valid without num_of_asteroids" do
        subject.num_of_asteroids = nil
        subject.save
        expect(subject.errors[:num_of_asteroids]).not_to be_empty
      end

    end
  end
end
