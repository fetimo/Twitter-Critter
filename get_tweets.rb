#!/usr/bin/env ruby

=begin

# TODO
1. group letters of similar frequencies (e.g. vowels)

- So we have characters that match the rules ok, but we need to break these up into body parts and the corresponding characters so :arms => 'a', 'b', 'c' and then count which is higher, a, b, or c and apply the highest one to the CRITTER hash. Need to only separate clashing values (e.g. colours) and one 'accessory' (e.g. horn)

=end

#require 'rubygems' #1.8 compatiability
require 'twitter'
require 'sequel'
require 'mysql2'
require 'json'
require 'logger'

DB = Sequel.connect('mysql2://fetimocom1:iBMbSSIz@mysql.fetimo.com/twittercritter')

Twitter.configure do |config|
	config.consumer_key = 'DQicogvXxpbW7oleCfV3Q'
	config.consumer_secret = 'GTYPQnV47dATvuITMXnVUC8PADpIgDPYyN84VKO6oM'
	config.oauth_token = '158797209-ovcnbKy1Zxl0uP0nWqqWVyUUYwbFWz963pz2r8'
	config.oauth_token_secret = 'VvgzYzcarPl1H6gtwX4L1Qu7kLewYcT2cqp75hK7s'
end

RULES = {
	:arms => {
		'a' => 'short',
		'b' => 'long',
		'c' => 'hairy'
	},
	:eye_colour => {
		'd' => 'green',
		'e' => 'blue',
		'f' => 'red',
		'i' => 'brown'
	},
	:eye_shape => {
		'g' => 'wide',
		'h' => 'narrow'
	},
	:neck => {
		'j' => 'long',
		'k' => 'thin',
		'l' => 'thick',
		'm' => 'short'
	},
	:legs => {
		'n' => 'long',
		'o' => 'short',
		'p' => 'four'
	},
	:face => {
		'q' => 'big nose',
		'r' => 'small nose',
		's' => 'glasses',
		't' => 'horns',
		'u' => 'freckly'
	},
	:hands => {
		'v' => 'paws',
		'w' => 'claws'
	},
	:hair_colour => {
		'y' => 'black',
		'A' => 'pink',
		'B' => 'red',
		'D' => 'blond'
	},
	:hair_length => {
		'z' => 'long',
		'C' => 'short'
	},
	'x' => 'bow',
	:body_colour => {
		'E' => 'blue',
		'F' => 'yellow',
		'G' => 'pink',
		'H' => 'red',
		'I' => 'white',
		'J' => 'green'
	},
	:body_weight => {
		'K' => 'fat',
		'L' => 'thin'
	},
	:body_tail => {
		'M' => 'thick tail',
		'N' => 'thin tail',
	},
	:accessory => {
		'O' => 'shell',
		'P' => 'spiky'
	}
}
if RUBY_PLATFORM == 'x86_64-darwin11.1.0'
	$LOG = Logger.new('algorithm.log')
else
	$LOG = Logger.new('/tmp/algorithm.log')
end

class Critter
		
	def initialize
		
		@@default_critter = {
			#default values
			:location => 0,
			:name => 'Steve',
			:arms => 'medium',
			:eye_colour => 'brown',
			:eye_shape => 'normal',
			:neck => 'medium',
			:legs => 'medium',
			:face => 'blank',
			:hands => 'simple',
			:hair_colour => 'brown',
			:hair_length => 'medium',
			:body_colour => 'black',
			:body_weight => 'medium',
			:body_tail => 'none',
			:accessory => 'none',
			:critter => ''
		}
		prev_tweets = DB[:prev_tweet]
		tweet = fetch_tweet
		prev_tweet = prev_tweets.first
		if prev_tweet[:tweetId] < tweet[:id]
			Thread.new do
				prev_tweets.update(:tweetId => tweet[:id])
			end
			letterFreq = get_letter_frequency(tweet[:tweet], RULES)
			highestValues = determine_highest_value(letterFreq)
			attributes = determine_attributes(highestValues, RULES)
			matched = match_attributes(attributes, RULES)
			make_critter(matched, @@default_critter)
		end
	end
	
	def fetch_tweet
		tweet = {:username => String, :tweet => String, :geocode => Float, :id => 0}
		begin
			search = Twitter::Search.new
			search.hashtag("#awesome").no_retweets.per_page(1).fetch.each do |result|
				tweet[:username] = result.from_user
				#remove hashtag
				tweet[:tweet] = result.text.sub(/#awesome/, '')
				tweet[:geocode] = result.geo
				tweet[:id] = result.id.to_int
			end
		rescue Errno::ENOENT
			sleep(5)
			$LOG.info "ENOENT error - attempting to retry"
			retry
		rescue Errno::ETIMEDOUT
			sleep(5)
			$LOG.info " Operation timed out - attempting to retry"
			retry
		rescue Errno::ECONNRESET
			sleep(5)
			$LOG.info "Connection reset by peer - attempting to retry"
			retry
		rescue Twitter::ServiceUnavailable
			sleep(30)
			$LOG.info "Twitter is over capacity, waiting longer before retrying"
			retry
		rescue # This rescues StandardError and its children
			sleep(5)
			$LOG.error "Somewhat bad exception #{$!.class} #{$!} happened - I'm giving up"
			raise
		rescue Exception
			sleep(5)
			$LOG.fatal "Really bad exception #{$!.class} #{$!} happened - I'm giving up"
			raise
		end
		
		@@default_critter[:name] = tweet[:username]
		@@default_critter[:location] = tweet[:geocode]
		
		tweet
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
		critter = hash.merge(matched)
		critters = DB[:critters]
		
		critter = JSON.generate(critter)

		@@default_critter[:critter] = critter

		Thread.new do
			critters.insert(@@default_critter)
		end
		Thread.new do
			if RUBY_PLATFORM == 'x86_64-darwin11.1.0' #checks if we're in dev (mac os x) or production
				latest = 'public/js/latest_critter.json'
				File.open(latest, 'w') do |f|
					f.write(critter)
				end
			else
				latest = '/home/timofe_/critter/public/js/latest_critter.json'
				File.open(latest, 'w') do |f|
					f.write(critter)
				end
			end
		end
	end
end

loop do
	Critter.new
	sleep(10)
end