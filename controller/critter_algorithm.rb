#!/usr/bin/env ruby

=begin

- So we have characters that match the rules ok, but we need to break these up into body parts and the corresponding characters so :arms => 'a', 'b', 'c' and then count which is higher, a, b, or c and apply the highest one to the CRITTER hash. Need to only separate clashing values (e.g. colours) and one 'accessory' (e.g. horn)

=end

#require 'rubygems' #1.8 compatibility
require 'sequel'
require 'mysql2'
require 'yajl'

RULES = {
	:arms => {
		'd' => 'short',
		'b' => 'long'
	},
	:ears => {
		'c' => 'mouse',
		's' => 'floppy'
	},
	:nose => {
		'j' => 'button'
	},
	:eye_colour => {
		'a' => 'green',
		'e' => 'blue',
		'o' => 'orange',
		'i' => 'brown',
		'u' => 'yellow',
		'A' => 'deep_blue',
		'E' => 'small_black',
		'I' => 'purple',
		'O' => 'pink',
		'U' => 'black'
	},
	:legs => {
		'n' => 'long',
		'f' => 'short'
	},
	:face => {
		'q' => 'big',
		'r' => 'button'
	},
	:mouth => {
		'g' => 'fangs',
		'p' => 'plain'
	},
	:hands => {
		'v' => 'paws',
		'w' => 'claws'
	},
	:body_colour => {
		'S' => 'blue',
		'F' => 'yellow',
		'G' => 'pink',
		'H' => 'red',
		'T' => 'white',
		'J' => 'green'
	},
	:body_type => {
		'L' => 'simple',
		'y' => 'furry'
	},
	:body => {
		'm' => 'plain',
		'h' => 'spotty',
		'k' => 'stripy'
	},
	:accessory => {
		'V' => 'horns',
		'P' => 'tail'
	}
}

class Critter
	
	attr_accessor :critter
	
	def initialize(data, username, default_critter, uid)
		@default_critter = default_critter
		@default_critter[:name] = username
		@default_critter[:uid] = uid
		letterFreq = get_letter_frequency(data, RULES)
		highestValues = determine_highest_value(letterFreq)
		attributes = determine_attributes(highestValues, RULES)
		matched = match_attributes(attributes, RULES)
		@critter = make_critter(matched, @default_critter)
	end
	
	def get_letter_frequency(tweet, hash, results = {})
		hash.each do |key, value|
			if value.kind_of?(Hash) #if value is a hash then call function again from that point
				get_letter_frequency(tweet, value, results)
				results[key] = {}
			else #we're in a leaf node
				if tweet.is_a? String #found from x factor stress test
					tweet.each_char do |c| #for each character in tweet, see if it matches a key
						if c.eql?(key)
							results[key] = (results[key] || 0) + 1 #key = a, results[key] = 0..infinity + 1
						end
					end
				end
			end
		end
		results
	end
	
	def determine_highest_value(letterFreq, results = [])		
		currentHighest = letterFreq.flatten.fetch(1) #the first number
		currentHighestKey = String
		letterFreq.each_cons(2) do |(prev_key, prev_value), (next_key, next_value)|
			if prev_value.is_a? Integer and currentHighest.is_a? Integer
				if prev_value > currentHighest
					currentHighest = prev_value
					currentHighestKey = prev_key
				end
			end
			if next_value.is_a? Hash
				results << currentHighestKey #'bank'
				currentHighest = 0
			end
		end
		results.uniq #return unique results
	end
	
	def determine_attributes(array, hash, results = {})
		hash.each do |key, value|
			if value.is_a? Hash #if value is a hash then call function again from that point
				determine_attributes(array, value, results)
			else #we're in a leaf node
				array.each do |item|					
					if item.eql? key
						results[key] = value
					end
				end
			end
		end
		results
	end
	
	def match_attributes(attributes, hash, results = {})
		#this method matches attributes, e.g. {"c"=>"hairy"} to the body part {:arms=>"hairy"}.
		#It does this by iterating through RULES to see if any of the :Symbols include one of the
		#keys present in attributes. If it does, it adds it to the hash called results.
		hash.each do |key, value|
			if key.is_a? Symbol #gets all Symbols in hash
				attributes.each do |attr_key, attr_value| #goes through each item in attributes
					if value.has_key? attr_key #sees if an item in attributes is in the hash
						#there is! Store it in the results hash
						#key = :arms, attr_value = "hairy". #=> {:arms=>"hairy"}
						results[key] = attr_value
					end
				end
				#is a symbol but we must dig deeper!
				match_attributes(attributes, value) #recursively iterate
			end
		end
		results
	end
	
	def make_critter(matched, hash)
		critter = hash.merge!(matched)
				
		db = Sequel.connect('mysql2://fetimocom1:iBMbSSIz@mysql.fetimo.com/twittercritter')
		critters = db[:critters]
		
		critter = Yajl::Encoder.encode(critter)
		@default_critter[:critter] = critter
		
		Thread.new do
			critters.insert(@default_critter)
		end
		
		critter
	end
end