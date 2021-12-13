
require 'rails_helper'

describe Celestial::Star, :type => :model do
  context "when included in a class" do
    subject { Celestial::Star.create(attributes_for(:star)) }

    describe "Validations" do
      it "is valid with valid attributes" do
        expect(subject).to be_valid
      end

      it "is not valid without a luminosity" do
        subject.luminosity = nil
        subject.save
        expect(subject.errors[:luminosity]).not_to be_empty
      end
    end
  end
end
